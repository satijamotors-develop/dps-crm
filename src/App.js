import React, { useState, useEffect } from 'react';
import './App.css';

const DEMO_USERS = {
  'nikishsatija@gmail.com': { password: '9009780008', role: 'director', name: 'Nikish Satija' },
  'kashish.mehta23@gmail.com': { password: '9754780008', role: 'director', name: 'Kashish Satija' },
  'principal@dpschhindwara.com': { password: '9977544122', role: 'admin', name: 'Mr. Habib Khan' },
  'ashishfalke178@gmail.com': { password: '8889748872', role: 'user', name: 'Ashish Sir' },
  'dharmendralokmat@gmail.com': { password: '9407140700', role: 'user', name: 'Jaiswal Sir' },
  'pammushriwastav123@gmail.com': { password: '9993628008', role: 'user', name: 'Pramod Sir' },
  'gauravarora1838@gmail.com': { password: '9935832732', role: 'user', name: 'Gaurav Sir' },
  'dpshrutika@gmail.com': { password: '9993282242', role: 'user', name: 'Shrutika mam' },
  'priyanshiofficial18@gmail.com': { password: '9479482109', role: 'user', name: 'Priyanshi mam' },
  'niteshpathe1982@gmail.com': { password: '9407331677', role: 'user', name: 'Nitesh Sir' },
  'santosh.forver@gmail.com': { password: '8806824689', role: 'user', name: 'Mishra Sir' },
  'aryanpal5652@gmail.com': { password: '9827357737', role: 'user', name: 'Devlal Sir' },
  'kulsum001211@gmail.com': { password: '7898360786', role: 'user', name: 'Kulsum mam' }
};

const SAMPLE_LEADS = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', class: 'Class 9', source: 'Website', status: 'interested', notes: 'Very interested', date: '2024-05-20', calls: [], reminders: [] },
];

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
      const user = { email, role: DEMO_USERS[email].role, name: DEMO_USERS[email].name };
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📚 DPS CRM</h1>
          <p>Lead Management System</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
      </div>
    </div>
  );
}

function LeadDetailsModal({ lead, onClose, onAddCall, onAddReminder, canDelete, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 {lead.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>📋 Basic Information</h3>
            <div className="detail-grid">
              <div><label>📞 Phone:</label><p>{lead.phone}</p></div>
              <div><label>✉️ Email:</label><p>{lead.email}</p></div>
              <div><label>📚 Class:</label><p>{lead.class}</p></div>
              <div><label>📌 Source:</label><p>{lead.source}</p></div>
              <div><label>📊 Status:</label><p><span className={`status-badge ${lead.status}`}>{lead.status}</span></p></div>
              <div><label>📅 Added:</label><p>{lead.date}</p></div>
            </div>
          </div>

          {lead.notes && (
            <div className="detail-section">
              <h3>📝 Notes</h3>
              <p>{lead.notes}</p>
            </div>
          )}

          {lead.calls && lead.calls.length > 0 && (
            <div className="detail-section">
              <h3>📞 Call History ({lead.calls.length} calls)</h3>
              <div className="call-history">
                {lead.calls.map((call, idx) => (
                  <div key={idx} className="call-item">
                    <div className="call-header">{call.date} at {call.time}</div>
                    <div className="call-details">
                      <p><strong>Duration:</strong> {call.duration}</p>
                      <p><strong>Outcome:</strong> {call.outcome}</p>
                      <p><strong>Notes:</strong> {call.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lead.reminders && lead.reminders.length > 0 && (
            <div className="detail-section">
              <h3>⏰ Reminders ({lead.reminders.length})</h3>
              <div className="reminder-list">
                {lead.reminders.map((reminder, idx) => (
                  <div key={idx} className="reminder-item">
                    <div className="reminder-header">{reminder.scheduledDate} at {reminder.scheduledTime}</div>
                    <p><strong>Type:</strong> {reminder.type}</p>
                    <p><strong>Description:</strong> {reminder.description}</p>
                    {reminder.notificationMethod && <p><strong>Notification:</strong> {reminder.notificationMethod}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>⚙️ Actions</h3>
            <div className="action-buttons">
              <button className="btn-action" onClick={onAddCall}>📞 Log Call</button>
              <button className="btn-action" onClick={onAddReminder}>⏰ Set Reminder</button>
              {canDelete && <button className="btn-action btn-delete" onClick={onDelete}>🗑️ Delete</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogCallModal({ lead, onClose, onSave }) {
  const [duration, setDuration] = useState('');
  const [outcome, setOutcome] = useState('interested');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (duration && outcome && notes) {
      onSave({ date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), duration: duration + ' min', outcome, notes });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h2>📞 Log Call</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Duration (minutes)</label><input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="15" required /></div>
          <div className="form-group"><label>Outcome</label><select value={outcome} onChange={(e) => setOutcome(e.target.value)}><option value="interested">Interested</option><option value="not-interested">Not Interested</option><option value="callback">Schedule Callback</option><option value="voicemail">Left Voicemail</option></select></div>
          <div className="form-group"><label>Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What was discussed?" rows="4" required></textarea></div>
          <div style={{display:'flex',gap:'10px'}}><button type="submit" className="btn-primary" style={{flex:1}}>Save</button><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button></div>
        </form>
      </div>
    </div>
  );
}

function ReminderModal({ lead, onClose, onSave }) {
  const [type, setType] = useState('followup');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [notificationMethod, setNotificationMethod] = useState('whatsapp');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && description) {
      onSave({ type, scheduledDate: date, scheduledTime: time, description, notificationMethod });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h2>⏰ Set Reminder</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Type</label><select value={type} onChange={(e) => setType(e.target.value)}><option value="followup">Follow-up Call</option><option value="send-docs">Send Documents</option><option value="visit">Campus Visit</option></select></div>
          <div className="form-group"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
          <div className="form-group"><label>Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What do you need to do?" rows="3" required></textarea></div>
          
          <div className="notification-section">
            <h3>📲 How to notify?</h3>
            <div className="notification-options">
              <label className="notification-option">
                <input type="radio" value="whatsapp" checked={notificationMethod === 'whatsapp'} onChange={(e) => setNotificationMethod(e.target.value)} />
                <span>💬 WhatsApp</span>
              </label>
              <label className="notification-option">
                <input type="radio" value="sms" checked={notificationMethod === 'sms'} onChange={(e) => setNotificationMethod(e.target.value)} />
                <span>📱 SMS</span>
              </label>
              <label className="notification-option">
                <input type="radio" value="email" checked={notificationMethod === 'email'} onChange={(e) => setNotificationMethod(e.target.value)} />
                <span>📧 Email</span>
              </label>
            </div>
          </div>

          <div style={{display:'flex',gap:'10px'}}><button type="submit" className="btn-primary" style={{flex:1}}>Set Reminder</button><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button></div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedLeads = localStorage.getItem('dpscrm_leads');
    if (savedLeads) try { setLeads(JSON.parse(savedLeads)); } catch (e) { }
  }, []);

  useEffect(() => {
    localStorage.setItem('dpscrm_leads', JSON.stringify(leads));
  }, [leads]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const addLead = () => {
    const name = prompt('Lead Name:');
    if (name) {
      const phone = prompt('Phone:');
      const email = prompt('Email:');
      const classVal = prompt('Class:');
      const newLead = {
        id: Math.max(...leads.map(l => l.id), 0) + 1,
        name,
        phone: phone || '+91',
        email: email || '',
        class: classVal || 'N/A',
        source: 'Manual',
        status: 'new',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        calls: [],
        reminders: []
      };
      setLeads([...leads, newLead]);
      alert('Lead added!');
    }
  };

  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const rows = data.split('\n');
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        const newLeads = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          const values = rows[i].split(',');
          const leadObj = {};
          headers.forEach((header, index) => {
            const value = values[index] ? values[index].trim() : '';
            if (header === 'name') leadObj.name = value;
            else if (header === 'phone') leadObj.phone = value;
            else if (header === 'email') leadObj.email = value;
            else if (header === 'class') leadObj.class = value;
            else if (header === 'source') leadObj.source = value;
            else if (header === 'status') leadObj.status = value;
            else if (header === 'notes') leadObj.notes = value;
          });
          if (leadObj.name && leadObj.phone) {
            newLeads.push({
              id: Math.max(...leads.map(l => l.id), 0) + newLeads.length + 1,
              name: leadObj.name,
              phone: leadObj.phone,
              email: leadObj.email || '',
              class: leadObj.class || 'N/A',
              source: leadObj.source || 'Imported',
              status: leadObj.status || 'new',
              notes: leadObj.notes || '',
              date: new Date().toISOString().split('T')[0],
              calls: [],
              reminders: []
            });
          }
        }
        if (newLeads.length > 0) {
          setLeads([...leads, ...newLeads]);
          alert(`Imported ${newLeads.length} leads!`);
        }
      } catch (error) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  const saveCallLog = (callData) => {
    const updatedLeads = leads.map(lead =>
      lead.id === selectedLeadModal.id ? { ...lead, calls: [...(lead.calls || []), callData] } : lead
    );
    setLeads(updatedLeads);
    setSelectedLeadModal(updatedLeads.find(l => l.id === selectedLeadModal.id));
    setShowCallModal(false);
    alert('Call logged!');
  };

  const saveReminder = (reminderData) => {
    const updatedLeads = leads.map(lead =>
      lead.id === selectedLeadModal.id ? { ...lead, reminders: [...(lead.reminders || []), reminderData] } : lead
    );
    setLeads(updatedLeads);
    setSelectedLeadModal(updatedLeads.find(l => l.id === selectedLeadModal.id));
    setShowReminderModal(false);
    alert(`Reminder set! Will send notification via ${reminderData.notificationMethod.toUpperCase()}`);
  };

  const deleteLead = (leadId) => {
    if (user.role !== 'director') {
      alert('Only Directors can delete leads!');
      return;
    }
    if (window.confirm('Delete this lead?')) {
      setLeads(leads.filter(l => l.id !== leadId));
      setSelectedLeadModal(null);
    }
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingReminders = leads.reduce((sum, l) => sum + (l.reminders ? l.reminders.length : 0), 0);
  const totalCalls = leads.reduce((sum, l) => sum + (l.calls ? l.calls.length : 0), 0);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">📚 DPS CRM</div>
          <div className="navbar-menu">
            <button className="nav-item active">Dashboard</button>
            <button className="nav-item">Leads</button>
            {(user.role === 'admin' || user.role === 'director') && <button className="nav-item" onClick={() => setShowReportModal(true)}>📊 Reports</button>}
          </div>
          <div className="navbar-user">
            <span>{user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>📊 Lead Management Dashboard</h1>
          <div className="header-stats">
            <div className="stat-box"><span className="stat-number">{leads.length}</span><span className="stat-label">Total Leads</span></div>
            <div className="stat-box"><span className="stat-number">{leads.filter(l => l.status === 'interested').length}</span><span className="stat-label">Interested</span></div>
            <div className="stat-box"><span className="stat-number">{pendingReminders}</span><span className="stat-label">Pending Reminders</span></div>
            <div className="stat-box"><span className="stat-number">{totalCalls}</span><span className="stat-label">Total Calls</span></div>
          </div>
        </div>

        <div className="leads-toolbar">
          <input type="text" placeholder="🔍 Search by name, phone, or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          <div style={{display:'flex',gap:'10px'}}>
            <label className="btn-primary" style={{cursor:'pointer',margin:0}}>📥 Import<input type="file" accept=".csv" onChange={handleExcelImport} style={{display:'none'}} /></label>
            <button className="btn-primary" onClick={addLead}>+ Add Lead</button>
          </div>
        </div>

        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>👤 Name</th>
                <th>📞 Phone</th>
                <th>📚 Class</th>
                <th>📊 Status</th>
                <th>📞 Calls</th>
                <th>⏰ Reminders</th>
                <th>📅 Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="lead-row">
                  <td><button className="link-button" onClick={() => setSelectedLeadModal(lead)}>{lead.name}</button></td>
                  <td>{lead.phone}</td>
                  <td>{lead.class}</td>
                  <td><span className={`status-badge ${lead.status}`}>{lead.status}</span></td>
                  <td><span className="count-badge">{lead.calls ? lead.calls.length : 0}</span></td>
                  <td><span className="count-badge reminder">{lead.reminders ? lead.reminders.length : 0}</span></td>
                  <td>{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selectedLeadModal && (
        <LeadDetailsModal
          lead={selectedLeadModal}
          onClose={() => setSelectedLeadModal(null)}
          onAddCall={() => setShowCallModal(true)}
          onAddReminder={() => setShowReminderModal(true)}
          canDelete={user.role === 'director'}
          onDelete={() => deleteLead(selectedLeadModal.id)}
        />
      )}

      {showCallModal && selectedLeadModal && <LogCallModal lead={selectedLeadModal} onClose={() => setShowCallModal(false)} onSave={saveCallLog} />}
      {showReminderModal && selectedLeadModal && <ReminderModal lead={selectedLeadModal} onClose={() => setShowReminderModal(false)} onSave={saveReminder} />}

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>📊 CRM Report</h2><button className="modal-close" onClick={() => setShowReportModal(false)}>✕</button></div>
            <div style={{padding:'20px'}}>
              <div style={{marginBottom:'20px'}}>
                <h3>Lead Statistics</h3>
                <p>Total: <strong>{leads.length}</strong></p>
                <p>Interested: <strong>{leads.filter(l => l.status === 'interested').length}</strong></p>
                <p>Conversion Rate: <strong>{leads.length > 0 ? ((leads.filter(l => l.status === 'interested').length / leads.length) * 100).toFixed(1) : 0}%</strong></p>
              </div>
              <button className="btn-primary" onClick={() => window.print()}>🖨️ Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
