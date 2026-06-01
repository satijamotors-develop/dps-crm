# DPS CRM - Admin Guide

## Administrator Dashboard & Controls

---

## Admin Features Overview

As an admin, you have access to:

### 1. **Full Lead Management**
- View ALL leads (not just assigned ones)
- Edit any lead's information
- Reassign leads between team members
- Delete leads if needed
- Bulk import/export

### 2. **Complete Analytics & Reports**
- Lead status distribution
- Conversion rate tracking
- Performance by team member
- Source analysis
- Trend forecasting

### 3. **Team Management**
- Create user accounts
- Assign roles (Admin, Supervisor, User)
- Monitor team activity
- Set sales targets
- Review performance

### 4. **Automation Control**
- Configure email templates
- Set up SMS reminders
- Define reminder schedules
- Manage notification preferences
- View delivery logs

### 5. **System Settings**
- School information
- Notification settings
- Data backup & export
- Activity logs
- User access management

---

## Getting Started as Admin

### First Login
1. Use admin credentials provided
2. Complete profile setup
3. Configure school details
4. Set up notification preferences
5. Invite team members

### Initial Setup Checklist
- [ ] Update school contact information
- [ ] Configure SendGrid for emails
- [ ] Set up Twilio for SMS
- [ ] Create user accounts for team
- [ ] Configure reminder schedules
- [ ] Test email/SMS functionality
- [ ] Set up Google Sheets sync
- [ ] Create backups

---

## User Account Management

### Creating a New User Account

1. **From CRM:**
   - Dashboard → Settings → Users
   - Click "Add New User"
   - Fill in details

2. **From Google Sheets:**
   - Open Users sheet
   - Add row with:
     ```
     email | role | department | joinDate | active
     user@dps.edu.in | user | Admissions | 2024-05-01 | true
     ```

### User Roles

| Role | Can Do | Can't Do |
|------|--------|----------|
| **Admin** | Everything | Nothing |
| **Supervisor** | View all leads, reports, manage team | Delete users, system settings |
| **User** | Add/edit own leads, log calls | See other users' data, reports |

### Assign Leads to Users

**Method 1: Bulk Assignment**
1. Dashboard → Leads
2. Select multiple leads
3. "Assign To" → Choose user
4. Click "Assign"

**Method 2: Edit Individual Lead**
1. Open lead
2. Click "Edit"
3. Change "Assigned To" field
4. Save

**Method 3: CSV Import**
1. Prepare CSV with: name, phone, email, assignedTo
2. Dashboard → Import
3. Upload file
4. Confirm assignment

---

## Reports & Analytics

### Available Reports

#### 1. Lead Summary Report
- Total leads by status
- Leads created this month
- Leads by class
- Leads by source

**How to Generate:**
1. Dashboard → Reports
2. Select "Lead Summary"
3. Choose date range
4. Click "Generate"
5. View or download as PDF/CSV

#### 2. Team Performance Report
- Leads per team member
- Calls logged per person
- Conversion rate by person
- Average call duration
- Follow-up compliance

**How to Generate:**
1. Dashboard → Reports
2. Select "Team Performance"
3. Filter by date/user
4. Download

#### 3. Conversion Funnel
- Leads → Contacted → Interested → Enrolled
- Show drop-off points
- Identify bottlenecks
- Compare with targets

#### 4. Source Analysis
- Which sources bring best leads
- Conversion rate by source
- Cost per lead (if applicable)
- ROI by marketing source

#### 5. Custom Reports
Create your own reports:
1. Dashboard → Reports → Custom
2. Select metrics:
   - [ ] Total Leads
   - [ ] Conversion Rate
   - [ ] Avg Call Duration
   - [ ] New Leads Today
   - [ ] Pending Follow-ups
3. Choose grouping (By User, Class, Source)
4. Select date range
5. Generate

### Exporting Data

**Export to CSV:**
1. Reports → Your report
2. Click "Download"
3. Choose format
4. Opens in Excel

**Export to Google Sheets:**
1. Reports → Your report
2. Click "Send to Sheets"
3. Data appended to Google Sheet
4. Share with team

**Export to PDF:**
1. Reports → Your report
2. Click "PDF"
3. Customize for printing
4. Download

---

## Monitoring & Alerts

### Real-time Dashboard

Top of your screen shows:
- 🟢 System status (Online/Offline)
- 👥 Users online now
- 📊 Today's activity
- ⚠️ Alerts (if any)

### Activity Log

Track everything:
1. Settings → Activity Log
2. See:
   - Who logged in when
   - Which leads were modified
   - Calls added
   - Data exported
3. Filter by user/date/action
4. Download for audit

### Email/SMS Delivery Logs

1. Settings → Notifications → Logs
2. View:
   - When emails sent
   - SMS delivered
   - Failed attempts
   - Recipient details
3. Resend if failed

### Performance Alerts

Automatic alerts for:
- ⚠️ Team member with low call count
- ⚠️ Lead not contacted in 7 days
- ⚠️ High bounce rate on emails
- ⚠️ System errors/failures
- ⚠️ API quota exceeded

**Configure Alerts:**
1. Settings → Alerts
2. Choose which alerts to enable
3. Set thresholds
4. Choose notification method (Email/SMS/Dashboard)

---

## Email Notifications Setup

### Email Templates

Pre-built templates for:

1. **Reminder Email**
   - Subject: "Action Required: {leadName}"
   - To: Assigned user
   - Includes: Lead info, action type, deadline

2. **Daily Summary**
   - Subject: "DPS CRM Daily Report"
   - To: You + supervisors
   - Includes: Metrics, new leads, calls, trends

3. **Welcome Email**
   - Subject: "Welcome to DPS CRM"
   - To: New user
   - Includes: Login URL, guide, support contact

4. **Lead Assignment**
   - Subject: "New Lead: {leadName}"
   - To: Assigned user
   - Includes: Lead details, class, source

5. **Performance Report**
   - Subject: "Your Monthly Performance"
   - To: Each user
   - Includes: Leads managed, conversions, targets

### Customize Templates

1. Settings → Email Templates
2. Click template to edit
3. Edit subject & body
4. Use variables like:
   - {leadName} - Lead's name
   - {phone} - Phone number
   - {email} - Email address
   - {class} - Class interested
   - {user} - Assigned user name
   - {date} - Today's date
5. Click "Save & Test"

### Test Email Sending

1. Settings → Notifications
2. Click "Send Test Email"
3. Enter your email
4. Confirm received
5. Check formatting

---

## SMS Configuration

### Setup Twilio

1. Get Twilio Account SID & Token
2. Settings → SMS → Configure
3. Paste credentials
4. Click "Test"
5. Receive test SMS to verify

### SMS Templates

Pre-configured messages:

1. **Follow-up Reminder**
   ```
   "Hi {name}, reminder to follow up on {class} admission inquiry. Call us: 011-4040-4040"
   ```

2. **Campus Visit Confirmation**
   ```
   "Hi {name}, your campus visit is {date} at {time}. Reply YES to confirm."
   ```

3. **Document Reminder**
   ```
   "Hi {name}, please submit: Marksheet, Birth Certificate, Residence Proof. 
   Email: admissions@dps.edu.in"
   ```

### Edit SMS Templates

1. Settings → SMS Templates
2. Click to edit
3. Keep under 160 characters
4. Use variables: {name}, {date}, {time}, {class}
5. Save & test

---

## Data Management

### Backup & Restore

**Manual Backup:**
1. Dashboard → Settings → Backup
2. Click "Create Backup"
3. System creates Google Sheets backup
4. Download copy to local storage

**Automatic Backup:**
- Happens daily at 2 AM
- Stored in Google Drive
- 30-day retention

**Restore from Backup:**
1. Settings → Backup → Restore
2. Choose backup date
3. Confirm restore
4. System restores all data
5. Activity logged

### Data Export

**Full System Export:**
1. Settings → Export
2. Choose:
   - Leads
   - Calls
   - Reminders
   - Users
   - Activity Log
3. Select date range
4. Choose format (CSV/Excel)
5. Download

**One-time Export:**
1. Dashboard
2. Reports → Any report
3. Click "Download"
4. Choose format

### Data Import

**Import Leads from Excel:**
1. Prepare CSV with columns:
   ```
   name,phone,email,relation,interestedClass,source,budget,assignedTo
   ```
2. Dashboard → Import
3. Select file
4. Map columns
5. Preview & confirm
6. Import

**Import Call Logs:**
1. Format: leadId,date,time,duration,outcome,notes
2. Dashboard → Import → Calls
3. Follow same process

---

## Scheduling & Automation

### Scheduled Reminders

**Daily Routine:**
1. Settings → Schedules
2. Create new schedule:
   - **Time:** 9:00 AM
   - **Days:** Monday-Friday
   - **Action:** Send morning briefing
   - **Recipients:** All users

3. Create another:
   - **Time:** 5:00 PM
   - **Days:** Monday-Friday
   - **Action:** Send "Action due tomorrow" reminders
   - **Recipients:** Assigned users

**Weekly Reports:**
1. Create schedule:
   - **Time:** 9:00 AM Monday
   - **Action:** Send weekly summary
   - **Recipients:** Admin

2. Create another:
   - **Time:** 5:00 PM Friday
   - **Action:** Send weekly performance report
   - **Recipients:** Admin + Supervisors

**Monthly Reviews:**
1. Create schedule:
   - **Time:** 9:00 AM (1st of month)
   - **Action:** Send monthly analytics
   - **Recipients:** All management

### Event-Triggered Actions

Automatic actions when:

1. **Lead Added**
   - Send assignment email to user
   - Log activity
   - Create reminder to contact

2. **Call Logged**
   - Update lead status automatically
   - Log activity
   - Check if follow-up needed

3. **Reminder Due**
   - Send email to user
   - Send SMS if enabled
   - Create in-app notification

4. **Lead Status Changed**
   - Log change with timestamp
   - Send notification if important
   - Update metrics

---

## Performance Targets & Tracking

### Set Team Targets

1. Settings → Targets
2. Click "Add Target"
3. Fill in:
   - **Metric:** Calls per day, Conversion rate, etc.
   - **Target Value:** e.g., 5 calls/day
   - **Team Member:** Individual or whole team
   - **Period:** Daily, Weekly, Monthly
   - **Alert:** If below target
4. Save

### Track Achievement

1. Dashboard → Performance
2. View progress against targets
3. See:
   - Actual vs Target
   - % Achievement
   - Trend (↑ / ↓)
   - Forecast for month end

### Performance Incentives

**Create Custom Reports:**
1. Reports → Custom
2. Include:
   - Most leads added
   - Best conversion rate
   - Most calls logged
   - Highest follow-up compliance
3. Identify top performers
4. Share results (motivate team!)

---

## Troubleshooting

### Common Issues

**Issue: Users can't login**
- Check if account exists in Users sheet
- Verify email spelling
- Confirm role is set
- Check if account is marked "active"

**Issue: Reminders not sending**
- Verify SendGrid API key in settings
- Check email addresses in leads
- Confirm email templates are enabled
- Check delivery logs for errors

**Issue: SMS not working**
- Verify Twilio credentials
- Check phone number format (+91...)
- Ensure Twilio account has credits
- Check SMS logs for errors

**Issue: Google Sheets not syncing**
- Verify Google Apps Script URL is correct
- Check Apps Script is deployed
- Redeploy if needed
- Verify sheet names match

**Issue: Reports not generating**
- Check if data exists for date range
- Try smaller date range
- Verify filters are correct
- Clear browser cache

**Issue: Slow performance**
- Check internet connection
- Close extra browser tabs
- Clear browser cache
- Try different browser

### Getting Help

1. Check "Help & Documentation" in-app
2. Review troubleshooting section
3. Check activity logs for clues
4. Contact support with:
   - What you were doing
   - Error message
   - Screenshot
   - When it started happening

---

## Best Practices

### Data Quality
- ✅ Regular data cleanup
- ✅ Standardize phone formats
- ✅ Validate email addresses
- ✅ Remove duplicate leads
- ✅ Archive old records

### Performance
- ✅ Monitor team metrics weekly
- ✅ Set realistic targets
- ✅ Provide feedback regularly
- ✅ Celebrate wins
- ✅ Address issues early

### Security
- ✅ Change admin password quarterly
- ✅ Enable 2FA on Google account
- ✅ Review access logs monthly
- ✅ Limit admin accounts (2-3 only)
- ✅ Keep API keys secure

### Maintenance
- ✅ Weekly backups (manual review)
- ✅ Monthly user access review
- ✅ Quarterly system audit
- ✅ Annual data cleanup
- ✅ Update documentation

---

## Admin Checklist

### Daily
- [ ] Check dashboard for alerts
- [ ] Review pending reminders
- [ ] Monitor system status
- [ ] Check email/SMS logs

### Weekly
- [ ] Review team performance
- [ ] Check data quality
- [ ] Send weekly summary
- [ ] Respond to user issues

### Monthly
- [ ] Generate full report
- [ ] Review team targets vs actual
- [ ] Clean up old data
- [ ] Update team on metrics
- [ ] Plan next month's strategy

### Quarterly
- [ ] Full system audit
- [ ] Review user access
- [ ] Plan training sessions
- [ ] Update documentation

### Annually
- [ ] Full data backup to archive
- [ ] Security review
- [ ] Plan system upgrades
- [ ] Review & update procedures

---

## Contact Support

**Email:** support@dps-crm.com
**Hours:** 9 AM - 5 PM IST, Monday-Friday
**Response Time:** 2-4 hours
**Emergency:** admin@dps.edu.in

---

**Last Updated:** May 2024
**Version:** 1.0.0
**Status:** Production Ready ✅

*For detailed setup, see DEPLOYMENT_GUIDE.md*
