# DPS CRM - Complete Setup & Deployment Guide

## Overview
A full-featured CRM system for Delhi Public School with:
- ✅ Lead management & tracking
- ✅ Call logging & history
- ✅ Automated reminders (email & SMS)
- ✅ Admin dashboard & reports
- ✅ Google Sheets integration
- ✅ Team collaboration (10-15 users)
- ✅ Mobile-responsive design
- ✅ Free hosting on Vercel/Netlify

---

## STEP 1: Prerequisites

### Required Services (All Free)
1. **GitHub Account** - for code hosting
2. **Vercel or Netlify Account** - for hosting
3. **Firebase Account** - for real-time database (optional, can use Google Sheets only)
4. **SendGrid Account** - for email (free: 100 emails/day)
5. **Twilio Account** - for SMS reminders (free credits: $15)
6. **Google Cloud Console** - for Google Sheets API & Apps Script

---

## STEP 2: Google Sheets Setup

### 2.1 Create Google Sheet
1. Go to [Google Drive](https://drive.google.com)
2. Click "New" → "Google Sheets"
3. Name it: "DPS_CRM_Data"
4. Create these sheets (tabs):
   - **Leads** - Lead information
   - **Calls** - Call logs
   - **Reminders** - Scheduled reminders
   - **Users** - Team members
   - **ActivityLog** - Audit trail

### 2.2 Add Headers to Each Sheet

**Leads Sheet:**
```
id | name | phone | email | relation | interestedClass | source | budget | status | createdDate | lastContact | notes | assignedTo
```

**Calls Sheet:**
```
id | leadId | date | time | duration | outcome | notes | nextAction
```

**Reminders Sheet:**
```
id | leadId | type | scheduledDate | scheduledTime | description | status | createdBy
```

**Users Sheet:**
```
email | role | department | joinDate | active
```

### 2.3 Deploy Google Apps Script

1. Open your Google Sheet
2. Click "Extensions" → "Apps Script"
3. Copy the code from `google-apps-script.gs`
4. Paste it into the editor
5. Click "Deploy" → "New Deployment"
6. Choose type: "Web app"
7. Execute as: Your email
8. Who has access: "Anyone"
9. Copy the deployment URL (you'll need this in Step 4)

**Important:** Every time you modify the script, deploy a new version!

---

## STEP 3: Setup External Services

### 3.1 SendGrid (Email Service)

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account
3. Go to Settings → API Keys
4. Create new API key
5. Copy the key (save it securely)

**Email Template Creation:**
1. Go to "Marketing" → "Templates"
2. Create template for "Reminder Email"
3. Use this subject: `DPS CRM - Action Required: {leadName}`

### 3.2 Twilio (SMS Service)

1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for free account
3. Verify phone number
4. Go to "Account" → "API Keys & Tokens"
5. Copy: Account SID, Auth Token, and Phone Number
6. Save these securely

### 3.3 Firebase (Optional - For Real-time Updates)

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Get Started"
3. Create new project: "DPS-CRM"
4. Enable Firestore Database
5. Set up Security Rules for user access
6. Copy your Firebase config

---

## STEP 4: Deploy to Vercel (Recommended)

### 4.1 Prepare Your Code

1. Create folder: `dps-crm`
2. Copy files:
   - `dps-crm-app.jsx` → `src/App.jsx`
   - `styles.css` → `src/styles.css`
   - Create `package.json` (see below)

### 4.2 Create package.json

```json
{
  "name": "dps-crm",
  "version": "1.0.0",
  "description": "DPS Lead Management CRM",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^9.23.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4.3 Create .env.local

```
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
REACT_APP_SENDGRID_API_KEY=your_sendgrid_key
REACT_APP_TWILIO_ACCOUNT_SID=your_twilio_sid
REACT_APP_TWILIO_AUTH_TOKEN=your_twilio_token
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_ADMIN_EMAIL=admin@dps.edu.in
```

### 4.4 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dps-crm
git push -u origin main
```

### 4.5 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repo
4. Add environment variables from .env.local
5. Click "Deploy"
6. Your app is live at: `dps-crm.vercel.app`

---

## STEP 5: Setup Authentication

### 5.1 Create User Accounts

1. Open the deployed CRM
2. Admin creates accounts for team members
3. Each person gets:
   - Email: `firstname@dps.edu.in`
   - Temporary password
   - Role: User or Admin

### 5.2 Admin Account Setup

Create in Users sheet:
```
admin@dps.edu.in | admin | Management | 2024-01-01 | true
supervisor@dps.edu.in | supervisor | Management | 2024-01-01 | true
```

---

## STEP 6: Setup Reminders & Automation

### 6.1 Enable Scheduled Reminders

In Google Apps Script:
1. Click "Triggers" (clock icon)
2. Click "Create new trigger"
3. Function: `sendReminderEmails`
4. Event type: "Time-based"
5. Type: "Hour timer" (every hour)
6. Click "Create"

### 6.2 Enable Daily Reports

1. Create new trigger
2. Function: `generateDailyReport`
3. Type: "Day timer"
4. Time: 6:00 AM IST
5. Click "Create"

---

## STEP 7: Configure Email Notifications

### Email Types Setup:

**1. Welcome Email** (New User)
- Recipient: New team member
- Trigger: Account created
- Content: Login credentials, quick guide

**2. Lead Assignment** (New Lead)
- Recipient: Assigned user
- Trigger: Lead assigned
- Content: Lead name, contact, class

**3. Follow-up Reminder**
- Recipient: Assigned user
- Trigger: Scheduled reminder time
- Content: Lead info, action required

**4. Daily Summary**
- Recipient: Admin
- Trigger: 6 AM daily
- Content: Stats, new leads, calls

---

## STEP 8: Configure SMS Notifications

### Text Message Templates:

**Follow-up Reminder:**
```
"Hi {name}, this is a reminder to follow up on your admission inquiry for Class {class}. 
Call: 011-4040-4040 or reply OK"
```

**Visit Confirmation:**
```
"Hi {name}, your campus visit is scheduled for {date} at {time}. 
Please confirm by replying YES or NO"
```

**Document Reminder:**
```
"Hi {name}, please submit required documents: 
Marksheet, Birth Certificate, Residence Proof. 
Email: admissions@dps.edu.in"
```

---

## STEP 9: Team Member Onboarding

### For Each Team Member:

1. **Admin creates account in Users sheet**
2. **Send Welcome Email with:**
   - Login URL
   - Username (email)
   - Temporary password
   - Quick start guide
3. **Grant Permissions:**
   - Read: All leads
   - Write: Own leads & calls
   - Admin can see reports

### Quick Start Guide for Users:

```
1. Go to https://dps-crm.vercel.app
2. Login with your DPS email
3. Click "New Lead" to add prospects
4. Log calls after speaking with parents
5. Create reminders for follow-ups
6. View your dashboard for pending tasks
```

---

## STEP 10: Admin Dashboard Features

### Reports Available:

1. **Lead Summary**
   - Total leads by status
   - Conversion rate
   - Leads by source
   - Leads by class

2. **Performance Metrics**
   - Calls per team member
   - Conversion rate per person
   - Average call duration
   - Closure time analysis

3. **Team Activity**
   - Leads per person
   - Calls logged per person
   - Response time

4. **Predictive Analytics**
   - Pipeline forecast
   - Expected enrollments
   - Seasonal trends

---

## STEP 11: Data Backup & Export

### Weekly Backup:
```bash
1. Open Google Sheet
2. File → Download → CSV
3. Save to cloud storage (Google Drive, OneDrive, etc.)
```

### Export for Analysis:
```bash
1. CRM → Reports → Download
2. Formats: CSV, PDF, Excel
3. Share with management
```

---

## STEP 12: Troubleshooting

### Issue: Reminders not sending
- Check SendGrid API key in .env
- Verify email addresses in leads
- Check Google Apps Script triggers

### Issue: SMS not working
- Verify Twilio credentials
- Check phone number format (+91...)
- Ensure Twilio has credits

### Issue: Google Sheets not syncing
- Redeploy Google Apps Script
- Check Apps Script URL in .env
- Verify sheet names match

### Issue: Login not working
- Check user email in Users sheet
- Verify role is set (admin/user)
- Check local storage in browser

---

## STEP 13: Security Best Practices

1. **Change Admin Password Regularly**
2. **Enable 2FA on Google Account**
3. **Keep API Keys Secure (use Vercel secrets)**
4. **Regular Data Backups**
5. **Monitor Access Logs**
6. **Restrict Google Sheet Sharing**

---

## File Structure

```
dps-crm/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx (main component)
│   ├── styles.css (styling)
│   ├── components/
│   │   ├── LoginPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LeadsView.jsx
│   │   ├── CallsView.jsx
│   │   └── ReportsView.jsx
│   ├── services/
│   │   ├── googleSheets.js
│   │   ├── firebase.js
│   │   ├── email.js
│   │   └── sms.js
│   └── main.jsx
├── api/
│   ├── reminders.js
│   └── reports.js
├── .env.local
├── package.json
└── README.md
```

---

## Support & Maintenance

### Monthly Tasks:
- Review data backups
- Update user access
- Monitor API usage/costs
- Check SMS/email logs

### Quarterly Tasks:
- Team training session
- Update reminders templates
- Performance review
- Plan upgrades

### Annual Tasks:
- Full system audit
- User access review
- Plan new features
- Renewal of licenses

---

## Contact & Support

- **Admin Email:** admin@dps.edu.in
- **Support Team:** [Your support contact]
- **Documentation:** https://dps-crm.vercel.app/docs
- **Bug Reports:** [GitHub issues]

---

**Last Updated:** May 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
