/*
  EMAIL & SMS REMINDER SERVICE
  ===========================
  
  Deploy these functions to Vercel/Netlify or use as Firebase Cloud Functions
  
  Configuration:
  - Twilio Account SID
  - Twilio Auth Token
  - SendGrid API Key
  - Firebase Project ID
  
  Set environment variables in Vercel/Netlify/Firebase
*/

// ==================== EMAIL SERVICE (SendGrid) ====================

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Vercel/Netlify API endpoint for sending reminders
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, recipient, subject, body, phone, message, reminderId } = req.body;

  try {
    if (action === 'send-email') {
      await sendEmail(recipient, subject, body);
      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        reminderId
      });
    }

    if (action === 'send-sms') {
      await sendSMS(phone, message);
      return res.status(200).json({
        success: true,
        message: 'SMS sent successfully',
        reminderId
      });
    }

    if (action === 'send-reminder') {
      const { lead, reminderType, time } = req.body;
      await sendReminder(lead, reminderType, time);
      return res.status(200).json({
        success: true,
        message: 'Reminder sent successfully'
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function sendEmail(to, subject, htmlContent) {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL || 'noreply@dpscrm.com',
    subject,
    html: htmlContent
  };

  await sgMail.send(msg);
  console.log(`Email sent to ${to}`);
}

async function sendSMS(phoneNumber, messageText) {
  const twilio = require('twilio');
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: messageText,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });

  console.log(`SMS sent to ${phoneNumber}`);
}

async function sendReminder(lead, reminderType, time) {
  const templates = {
    'follow-up-call': {
      subject: `Reminder: Follow-up call for ${lead.name}`,
      body: `
        <h2>Follow-up Call Reminder</h2>
        <p>Hi,</p>
        <p>This is a reminder to follow up with:</p>
        <p><strong>${lead.name}</strong></p>
        <p>Contact: ${lead.phone}</p>
        <p>Scheduled for: ${time}</p>
        <p>Notes: ${lead.notes}</p>
        <p><a href="https://dpscrm.vercel.app/leads/${lead.id}">Open Lead in CRM</a></p>
      `
    },
    'schedule-visit': {
      subject: `Reminder: Schedule visit with ${lead.name}`,
      body: `
        <h2>Schedule Campus Visit</h2>
        <p>Hi,</p>
        <p>Please schedule a campus visit with:</p>
        <p><strong>${lead.name}</strong></p>
        <p>Contact: ${lead.phone}</p>
        <p>Class: ${lead.interestedClass}</p>
      `
    },
    'send-docs': {
      subject: `Reminder: Send documents to ${lead.name}`,
      body: `
        <h2>Send Documents</h2>
        <p>Hi,</p>
        <p>Please send required documents to:</p>
        <p><strong>${lead.name}</strong></p>
        <p>Email: ${lead.email}</p>
        <p>Documents required: Marksheet, Birth Certificate, Residence Proof</p>
      `
    },
    'check-payment': {
      subject: `Reminder: Check payment status for ${lead.name}`,
      body: `
        <h2>Check Payment Status</h2>
        <p>Hi,</p>
        <p>Please check payment status for:</p>
        <p><strong>${lead.name}</strong></p>
        <p>Email: ${lead.email}</p>
      `
    }
  };

  const template = templates[reminderType] || templates['follow-up-call'];

  await sendEmail(lead.email, template.subject, template.body);

  // Also send SMS if phone number exists
  if (lead.phone) {
    const smsMessage = `DPS CRM: ${template.subject}. Reply with OK when done.`;
    await sendSMS(lead.phone, smsMessage);
  }
}

// ==================== BATCH REMINDER PROCESSOR ====================

// Run this as a scheduled job (Vercel Cron or Google Cloud Scheduler)
export async function processPendingReminders(req, res) {
  try {
    // Fetch pending reminders from Firebase/Google Sheets
    const db = require('firebase-admin').firestore();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' +
                       String(now.getMinutes()).padStart(2, '0');

    // Query reminders due now
    const remindersSnapshot = await db.collection('reminders')
      .where('scheduledDate', '==', today)
      .where('scheduledTime', '==', currentTime)
      .where('status', '==', 'pending')
      .get();

    let processedCount = 0;

    for (const doc of remindersSnapshot.docs) {
      const reminder = doc.data();

      // Get lead details
      const leadDoc = await db.collection('leads').doc(reminder.leadId).get();
      const lead = leadDoc.data();

      if (lead) {
        // Send reminder
        await sendReminder(lead, reminder.type, reminder.scheduledTime);

        // Mark as sent
        await doc.ref.update({
          status: 'sent',
          sentAt: now
        });

        processedCount++;
      }
    }

    console.log(`Processed ${processedCount} reminders`);
    return res.status(200).json({
      success: true,
      processedCount,
      message: `${processedCount} reminders processed`
    });
  } catch (error) {
    console.error('Error processing reminders:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// ==================== TWILIO WEBHOOK (for incoming SMS) ====================

export async function handleIncomingSMS(req, res) {
  const twilio = require('twilio');
  const VoiceResponse = twilio.twiml.VoiceResponse;

  const incomingMessage = req.body.Body;
  const fromPhone = req.body.From;
  const messageId = req.body.MessageSid;

  try {
    // Find lead by phone number
    const db = require('firebase-admin').firestore();
    const leadSnapshot = await db.collection('leads')
      .where('phone', '==', fromPhone)
      .limit(1)
      .get();

    if (leadSnapshot.empty) {
      // Reply: Lead not found
      const twiml = new VoiceResponse();
      twiml.message('We couldn\'t find your record. Please contact the school.');
      return res.status(200).type('text/xml').send(twiml.toString());
    }

    const lead = leadSnapshot.docs[0];
    const leadData = lead.data();

    // Log the incoming message
    await db.collection('messages').add({
      leadId: lead.id,
      leadName: leadData.name,
      fromPhone,
      message: incomingMessage,
      timestamp: new Date(),
      type: 'incoming'
    });

    // Send confirmation
    const twiml = new VoiceResponse();
    twiml.message(`Hi ${leadData.name}, we received your message: "${incomingMessage}". Our team will get back to you soon!`);

    // Notify admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New SMS from ${leadData.name}`,
      `<p>From: ${fromPhone}</p><p>Message: ${incomingMessage}</p>`
    );

    return res.status(200).type('text/xml').send(twiml.toString());
  } catch (error) {
    console.error('Error handling incoming SMS:', error);
    const twiml = new VoiceResponse();
    twiml.message('Sorry, we encountered an error. Please try again.');
    return res.status(200).type('text/xml').send(twiml.toString());
  }
}

// ==================== FIREBASE CLOUD FUNCTION VERSION ====================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

admin.initializeApp();
const db = admin.firestore();

// Triggered when a reminder is created or updated
exports.onReminderChange = functions.firestore
  .document('reminders/{reminderId}')
  .onWrite(async (change, context) => {
    const reminder = change.after.data();

    if (!reminder || reminder.status !== 'pending') {
      return;
    }

    // Schedule the reminder email
    const scheduledTime = new Date(`${reminder.scheduledDate}T${reminder.scheduledTime}`);
    const now = new Date();
    const delayMs = scheduledTime.getTime() - now.getTime();

    if (delayMs > 0) {
      setTimeout(async () => {
        try {
          const leadDoc = await db.collection('leads').doc(reminder.leadId).get();
          const lead = leadDoc.data();

          if (lead) {
            await sendReminder(lead, reminder.type, reminder.scheduledTime);
            await change.after.ref.update({
              status: 'sent',
              sentAt: admin.firestore.FieldValue.serverTimestamp()
            });
          }
        } catch (error) {
          console.error('Error sending reminder:', error);
        }
      }, delayMs);
    }
  });

// Scheduled function to process daily reminders
exports.processDailyReminders = functions.pubsub
  .schedule('0 */1 * * *') // Every hour
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = String(now.getHours()).padStart(2, '0') + ':' +
                         String(now.getMinutes()).padStart(2, '0');

      const remindersSnapshot = await db.collection('reminders')
        .where('scheduledDate', '==', today)
        .where('scheduledTime', '<=', currentTime)
        .where('status', '==', 'pending')
        .get();

      let processed = 0;

      for (const doc of remindersSnapshot.docs) {
        const reminder = doc.data();
        const leadDoc = await db.collection('leads').doc(reminder.leadId).get();
        const lead = leadDoc.data();

        if (lead) {
          await sendReminder(lead, reminder.type, reminder.scheduledTime);
          await doc.ref.update({
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp()
          });
          processed++;
        }
      }

      console.log(`Processed ${processed} reminders`);
      return { processed };
    } catch (error) {
      console.error('Error processing reminders:', error);
      return { error: error.message };
    }
  });

// Generate daily report
exports.generateDailyReport = functions.pubsub
  .schedule('0 6 * * *') // 6 AM daily
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get statistics
      const leadsSnapshot = await db.collection('leads').get();
      const callsSnapshot = await db.collection('calls')
        .where('date', '==', today)
        .get();

      const leads = leadsSnapshot.docs.map(d => d.data());
      const todayLeads = leads.filter(l => l.createdDate === today);

      const statuses = leads.reduce((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {});

      const reportHtml = `
        <h1>DPS CRM Daily Report</h1>
        <p>Date: ${new Date().toDateString()}</p>
        
        <h2>Summary</h2>
        <ul>
          <li>Total Leads: ${leads.length}</li>
          <li>New Leads Today: ${todayLeads.length}</li>
          <li>Calls Today: ${callsSnapshot.size}</li>
        </ul>
        
        <h2>Status Distribution</h2>
        <ul>
          ${Object.entries(statuses)
            .map(([status, count]) => `<li>${status}: ${count}</li>`)
            .join('')}
        </ul>
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL,
        'DPS CRM Daily Report',
        reportHtml
      );

      console.log('Daily report sent');
      return { success: true };
    } catch (error) {
      console.error('Error generating report:', error);
      return { error: error.message };
    }
  });

module.exports = { processDailyReminders, generateDailyReport, onReminderChange };
