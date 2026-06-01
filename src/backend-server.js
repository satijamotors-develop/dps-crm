// 📧 Backend Server for Email Notifications
// Using: Node.js + Express + SendGrid
// This file handles sending reminders via email

// ============================================
// STEP 1: Install Required Packages
// ============================================
/*
npm install express cors sendgrid dotenv
*/

// ============================================
// STEP 2: Create .env file in root
// ============================================
/*
Create file: .env
Add this line:
SENDGRID_API_KEY=your_api_key_here
PORT=5000
*/

// ============================================
// STEP 3: Create server.js file
// ============================================

const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(express.json());
app.use(express.cors ? require('cors')() : (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ============================================
// ENDPOINT 1: Send Reminder Email
// ============================================
app.post('/api/send-reminder-email', async (req, res) => {
  try {
    const { 
      staffEmail, 
      staffName, 
      studentName, 
      reminderType, 
      reminderDate, 
      reminderTime, 
      description 
    } = req.body;

    // Email content
    const msg = {
      to: staffEmail,
      from: 'noreply@dpscrm.com', // Change to your verified sender
      subject: `DPS CRM Reminder - ${studentName}`,
      html: `
        <h2>📌 DPS CRM Reminder</h2>
        <p>Dear ${staffName},</p>
        
        <p>You have a scheduled reminder:</p>
        
        <div style="background: #f0f4ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>👤 Student:</strong> ${studentName}</p>
          <p><strong>📞 Type:</strong> ${reminderType}</p>
          <p><strong>📅 Date:</strong> ${reminderDate}</p>
          <p><strong>⏰ Time:</strong> ${reminderTime}</p>
          <p><strong>📝 Description:</strong> ${description}</p>
        </div>
        
        <p>Please complete this task at the scheduled time.</p>
        
        <p>Best regards,<br>DPS School Admissions CRM</p>
      `,
    };

    await sgMail.send(msg);
    
    res.json({ 
      success: true, 
      message: `Reminder email sent to ${staffEmail}` 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// ENDPOINT 2: Send Call Log Notification
// ============================================
app.post('/api/send-call-notification', async (req, res) => {
  try {
    const { 
      staffEmail, 
      staffName, 
      studentName, 
      callDuration, 
      callOutcome, 
      callNotes 
    } = req.body;

    const msg = {
      to: staffEmail,
      from: 'noreply@dpscrm.com',
      subject: `Call Logged - ${studentName}`,
      html: `
        <h2>📞 Call Log Confirmed</h2>
        <p>Dear ${staffName},</p>
        
        <p>Your call has been logged in the system:</p>
        
        <div style="background: #f0f4ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>👤 Student:</strong> ${studentName}</p>
          <p><strong>⏱️ Duration:</strong> ${callDuration}</p>
          <p><strong>📊 Outcome:</strong> ${callOutcome}</p>
          <p><strong>📝 Notes:</strong> ${callNotes}</p>
        </div>
        
        <p>Best regards,<br>DPS School Admissions CRM</p>
      `,
    };

    await sgMail.send(msg);
    
    res.json({ 
      success: true, 
      message: `Notification sent to ${staffEmail}` 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// ENDPOINT 3: Test Endpoint
// ============================================
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { email } = req.body;

    const msg = {
      to: email,
      from: 'noreply@dpscrm.com',
      subject: 'DPS CRM - Test Email',
      html: `
        <h2>✅ Test Email</h2>
        <p>This is a test email from DPS CRM system.</p>
        <p>If you received this, email integration is working! 🎉</p>
      `,
    };

    await sgMail.send(msg);
    
    res.json({ 
      success: true, 
      message: `Test email sent to ${email}` 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// Health Check
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 DPS CRM Backend running on port ${PORT}`);
  console.log(`📧 Email service enabled`);
});

// ============================================
// USAGE IN REACT CRM
// ============================================
/*
When setting reminder in CRM, call this:

fetch('http://localhost:5000/api/send-reminder-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    staffEmail: 'ashish@example.com',
    staffName: 'Ashish Sir',
    studentName: 'Rajesh Kumar',
    reminderType: 'Follow-up Call',
    reminderDate: '2024-05-31',
    reminderTime: '10:00 AM',
    description: 'Call for admission confirmation'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
*/
