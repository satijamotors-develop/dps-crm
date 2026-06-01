/*
  GOOGLE APPS SCRIPT FOR DPS CRM
  ============================
  
  This script syncs data between your CRM application and Google Sheets.
  
  SETUP INSTRUCTIONS:
  1. Go to script.google.com
  2. Create new project
  3. Paste this code
  4. Create Google Sheet with tabs: Leads, Calls, Reminders, Users
  5. Deploy as web app (Anyone)
  6. Copy the deployment URL
  7. Set REACT_APP_GOOGLE_SCRIPT_URL in your .env file
  
  Sheet Structure:
  - Leads: id, name, phone, email, relation, interestedClass, source, budget, status, createdDate, lastContact, notes, assignedTo
  - Calls: id, leadId, date, time, duration, outcome, notes, nextAction
  - Reminders: id, leadId, type, scheduledDate, scheduledTime, description, status, createdBy
  - Users: email, role, department
*/

const SHEET_NAME = 'DPS_CRM_Data';
let spreadsheet;

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { sheet, data: sheetData, user, action } = data;

    if (!spreadsheet) {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }

    switch (action) {
      case 'get':
        return getSheetData(sheet);
      case 'append':
        return appendToSheet(sheet, sheetData);
      case 'update':
        return updateSheetData(sheet, sheetData);
      case 'delete':
        return deleteFromSheet(sheet, sheetData);
      default:
        return appendToSheet(sheet, sheetData);
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function appendToSheet(sheetName, records) {
  const sheet = getOrCreateSheet(sheetName);
  
  if (!Array.isArray(records)) {
    records = [records];
  }

  records.forEach(record => {
    const values = objectToArray(record, getHeaders(sheetName));
    sheet.appendRow(values);
  });

  SpreadsheetApp.flush();
  
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: `${records.length} record(s) added to ${sheetName}`,
      count: records.length
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheetName) {
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, data: [] })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const records = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, data: records })
  ).setMimeType(ContentService.MimeType.JSON);
}

function updateSheetData(sheetName, updates) {
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  let updatedCount = 0;

  if (!Array.isArray(updates)) {
    updates = [updates];
  }

  updates.forEach(updateRecord => {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == updateRecord.id) { // Match by ID in first column
        const values = objectToArray(updateRecord, headers);
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([values]);
        updatedCount++;
        break;
      }
    }
  });

  SpreadsheetApp.flush();

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: `${updatedCount} record(s) updated`,
      count: updatedCount
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function deleteFromSheet(sheetName, ids) {
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  let deleteCount = 0;
  for (let i = data.length - 1; i > 0; i--) {
    if (ids.includes(data[i][0])) {
      sheet.deleteRow(i + 1);
      deleteCount++;
    }
  }

  SpreadsheetApp.flush();

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: `${deleteCount} record(s) deleted`,
      count: deleteCount
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName) {
  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }

  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    const headers = getHeaders(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function getHeaders(sheetName) {
  const headerMap = {
    'Leads': [
      'id', 'name', 'phone', 'email', 'relation', 'interestedClass', 
      'source', 'budget', 'status', 'createdDate', 'lastContact', 'notes', 'assignedTo'
    ],
    'Calls': [
      'id', 'leadId', 'date', 'time', 'duration', 'outcome', 'notes', 'nextAction'
    ],
    'Reminders': [
      'id', 'leadId', 'type', 'scheduledDate', 'scheduledTime', 
      'description', 'status', 'createdBy'
    ],
    'Users': [
      'email', 'role', 'department', 'joinDate', 'active'
    ],
    'CallLogs': [
      'timestamp', 'user', 'action', 'details'
    ]
  };

  return headerMap[sheetName] || [];
}

function objectToArray(obj, headers) {
  return headers.map(header => {
    const value = obj[header];
    if (value === null || value === undefined) return '';
    return value.toString();
  });
}

// ==================== UTILITY FUNCTIONS ====================

// Send email reminders
function sendReminderEmails() {
  const sheet = getOrCreateSheet('Reminders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0');

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const reminder = {};
    headers.forEach((header, index) => {
      reminder[header] = row[index];
    });

    // Check if reminder is due
    if (reminder.scheduledDate === today && reminder.scheduledTime === currentTime && reminder.status === 'pending') {
      // Get lead info
      const leadsSheet = getOrCreateSheet('Leads');
      const leadsData = leadsSheet.getDataRange().getValues();
      let leadEmail = '';

      for (let j = 1; j < leadsData.length; j++) {
        if (leadsData[j][0] == reminder.leadId) {
          leadEmail = leadsData[j][3]; // email column
          break;
        }
      }

      if (leadEmail) {
        const emailBody = `
          Reminder: ${reminder.description}
          
          Lead: ${reminder.leadId}
          Scheduled: ${reminder.scheduledDate} at ${reminder.scheduledTime}
          
          Please complete this follow-up.
        `;

        GmailApp.sendEmail(leadEmail, 'DPS CRM Reminder', emailBody);
        
        // Mark as sent
        sheet.getRange(i + 1, headers.indexOf('status') + 1).setValue('sent');
      }
    }
  }
}

// Generate daily report
function generateDailyReport() {
  const leads = getSheetDataAsObjects('Leads');
  const calls = getSheetDataAsObjects('Calls');
  
  const report = `
    DPS CRM DAILY REPORT
    ====================
    Date: ${new Date().toDateString()}
    
    SUMMARY:
    - Total Leads: ${leads.length}
    - New Leads Today: ${leads.filter(l => l.createdDate === new Date().toISOString().split('T')[0]).length}
    - Total Calls: ${calls.length}
    - Calls Today: ${calls.filter(c => c.date === new Date().toISOString().split('T')[0]).length}
    
    By Status:
    ${Object.entries(leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {})).map(([status, count]) => `  - ${status}: ${count}`).join('\n')}
  `;

  // Send to admin
  GmailApp.sendEmail('admin@dps.edu.in', 'DPS CRM Daily Report', report);
}

// Utility function
function getSheetDataAsObjects(sheetName) {
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) return [];

  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

// Schedule daily report (run from Triggers menu)
function setupTriggers() {
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Add new triggers
  ScriptApp.newTrigger('sendReminderEmails')
    .timeBased()
    .everyHours(1)
    .create();

  ScriptApp.newTrigger('generateDailyReport')
    .timeBased()
    .atTime('06:00')
    .inTimezone('Asia/Kolkata')
    .everyDays(1)
    .create();
}

// Test function
function testSync() {
  const testData = {
    sheet: 'Leads',
    data: {
      id: Date.now(),
      name: 'Test Lead',
      phone: '+91 98765 43210',
      email: 'test@example.com',
      relation: 'Parent',
      interestedClass: 'Class 9',
      source: 'Test',
      budget: 'Standard',
      status: 'new',
      createdDate: new Date().toISOString().split('T')[0],
      lastContact: '',
      notes: 'Test entry',
      assignedTo: 'admin@dps.edu.in'
    },
    action: 'append'
  };

  appendToSheet(testData.sheet, testData.data);
  Logger.log('Test data added successfully');
}
