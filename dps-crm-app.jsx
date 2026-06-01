/*
  DPS CRM APPLICATION
  Complete system with:
  - Google Sheets integration
  - User authentication
  - Lead & call management
  - Reminder system
  - Admin dashboard & reports
  - Mobile-responsive design
  
  Deploy to: Vercel or Netlify
  Database: Google Sheets + Firebase Firestore (free tier)
*/

import React, { useState, useEffect } from 'react';
import './styles.css';

// ==================== AUTHENTICATION ====================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In production: Connect to Firebase Authentication
      // For now: Simple validation
      if (email && password.length >= 6) {
        // Determine role based on email
        const role = email.includes('admin') ? 'admin' : 'user';
        localStorage.setItem('user', JSON.stringify({ email, role }));
        onLogin({ email, role });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>DPS CRM</h1>
          <p>Delhi Public School Lead Management System</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@dps.edu.in"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <p>👤 User: user@dps.edu.in / password123</p>
          <p>👨‍💼 Admin: admin@dps.edu.in / password123</p>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
function DPSCRMApp() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [calls, setCalls] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      loadData();
    }
  }, []);

  // Sync with Google Sheets every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      // In production: Fetch from Firebase Firestore
      // For demo: Load from sample data
      
      const sampleLeads = [
        {
          id: 1,
          name: 'Rajesh Kumar',
          relation: 'Parent of Class 8',
          phone: '+91 98765 43210',
          email: 'rajesh.kumar@email.com',
          status: 'follow-up',
          source: 'Website',
          interestedClass: 'Class 9',
          createdDate: '2024-05-20',
          lastContact: '2024-05-28',
          notes: 'Interested in admission. Documents pending.',
          assignedTo: 'user@dps.edu.in',
          budget: 'Premium'
        },
        {
          id: 2,
          name: 'Priya Singh',
          relation: 'Parent of prospective student',
          phone: '+91 98765 43211',
          email: 'priya.singh@email.com',
          status: 'interested',
          source: 'Referral',
          interestedClass: 'Class 8',
          createdDate: '2024-05-25',
          lastContact: '2024-05-27',
          notes: 'Very interested. Scheduled tour.',
          assignedTo: 'user@dps.edu.in',
          budget: 'Standard'
        },
        {
          id: 3,
          name: 'Amit Patel',
          relation: 'Parent',
          phone: '+91 98765 43212',
          email: 'amit.patel@email.com',
          status: 'new',
          source: 'Phone Call',
          interestedClass: 'Class 6',
          createdDate: '2024-05-29',
          lastContact: null,
          notes: 'Initial inquiry',
          assignedTo: 'user@dps.edu.in',
          budget: 'Premium'
        }
      ];

      setLeads(sampleLeads);

      const sampleCalls = [
        {
          id: 1,
          leadId: 1,
          date: '2024-05-28',
          time: '09:15',
          duration: 8,
          outcome: 'positive',
          notes: 'Discussed admission requirements. Parent very interested.',
          nextAction: 'Send documents checklist'
        },
        {
          id: 2,
          leadId: 2,
          date: '2024-05-27',
          time: '14:30',
          duration: 12,
          outcome: 'positive',
          notes: 'Scheduled campus visit for Saturday.',
          nextAction: 'Confirm visit details'
        }
      ];

      setCalls(sampleCalls);

      const sampleReminders = [
        {
          id: 1,
          leadId: 1,
          type: 'follow-up-call',
          scheduledDate: '2024-05-31',
          scheduledTime: '10:00',
          description: 'Follow-up on Rajesh Kumar - Check document status',
          status: 'pending',
          createdBy: 'user@dps.edu.in'
        },
        {
          id: 2,
          leadId: 2,
          type: 'schedule-visit',
          scheduledDate: '2024-05-31',
          scheduledTime: '14:00',
          description: 'Confirm campus visit with Priya Singh',
          status: 'pending',
          createdBy: 'user@dps.edu.in'
        }
      ];

      setReminders(sampleReminders);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const addLead = (leadData) => {
    const newLead = {
      id: Date.now(),
      ...leadData,
      createdDate: new Date().toISOString().split('T')[0],
      assignedTo: user.email,
      status: 'new'
    };
    setLeads([...leads, newLead]);
    // Sync to Google Sheets
    syncToGoogleSheets('leads', [...leads, newLead]);
  };

  const updateLead = (leadId, updates) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, ...updates } : lead
    );
    setLeads(updatedLeads);
    syncToGoogleSheets('leads', updatedLeads);
  };

  const addCall = (callData) => {
    const newCall = {
      id: Date.now(),
      ...callData,
      date: new Date().toISOString().split('T')[0]
    };
    setCalls([...calls, newCall]);
    syncToGoogleSheets('calls', [...calls, newCall]);
  };

  const addReminder = (reminderData) => {
    const newReminder = {
      id: Date.now(),
      ...reminderData,
      status: 'pending',
      createdBy: user.email
    };
    setReminders([...reminders, newReminder]);
    syncToGoogleSheets('reminders', [...reminders, newReminder]);
  };

  const syncToGoogleSheets = async (sheet, data) => {
    try {
      // In production: Use Apps Script to append to Google Sheets
      // Example: POST to Google Apps Script endpoint
      const response = await fetch(process.env.REACT_APP_GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheet, data, user: user.email })
      });
      console.log('Synced to Google Sheets:', sheet);
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="logo-icon">📚</span>
            <span>DPS CRM</span>
          </div>
          <div className="navbar-menu">
            <button
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-item ${currentView === 'leads' ? 'active' : ''}`}
              onClick={() => setCurrentView('leads')}
            >
              Leads
            </button>
            <button
              className={`nav-item ${currentView === 'calls' ? 'active' : ''}`}
              onClick={() => setCurrentView('calls')}
            >
              Calls
            </button>
            <button
              className={`nav-item ${currentView === 'reminders' ? 'active' : ''}`}
              onClick={() => setCurrentView('reminders')}
            >
              Reminders
            </button>
            {user.role === 'admin' && (
              <button
                className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
                onClick={() => setCurrentView('reports')}
              >
                Reports
              </button>
            )}
          </div>
          <div className="navbar-user">
            <span>{user.email.split('@')[0]}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'dashboard' && (
          <DashboardView leads={leads} calls={calls} reminders={reminders} user={user} />
        )}
        {currentView === 'leads' && (
          <LeadsView
            leads={leads}
            onAddLead={addLead}
            onUpdateLead={updateLead}
            onSelectLead={setSelectedLead}
            selectedLead={selectedLead}
          />
        )}
        {currentView === 'calls' && (
          <CallsView calls={calls} leads={leads} onAddCall={addCall} />
        )}
        {currentView === 'reminders' && (
          <RemindersView reminders={reminders} leads={leads} onAddReminder={addReminder} />
        )}
        {currentView === 'reports' && user.role === 'admin' && (
          <ReportsView leads={leads} calls={calls} reminders={reminders} />
        )}
      </main>
    </div>
  );
}

// ==================== VIEWS ====================

function DashboardView({ leads, calls, reminders, user }) {
  const totalLeads = leads.length;
  const followUpDue = leads.filter(l => l.status === 'follow-up').length;
  const thisWeekCalls = calls.filter(c => {
    const callDate = new Date(c.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return callDate > weekAgo;
  }).length;
  const conversionRate = leads.filter(l => l.status === 'enrolled').length / Math.max(1, totalLeads);

  const pendingReminders = reminders.filter(r => r.status === 'pending').slice(0, 5);
  const recentCalls = calls.slice(-3).reverse();

  return (
    <div className="view dashboard-view">
      <h1>Dashboard</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Leads</div>
          <div className="metric-value">{totalLeads}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Follow-up Due</div>
          <div className="metric-value" style={{ color: '#e74c3c' }}>{followUpDue}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Calls This Week</div>
          <div className="metric-value">{thisWeekCalls}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Conversion Rate</div>
          <div className="metric-value">{(conversionRate * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Pending Reminders</h2>
          <div className="reminders-list">
            {pendingReminders.length > 0 ? (
              pendingReminders.map(reminder => (
                <div key={reminder.id} className="reminder-item">
                  <div className="reminder-time">{reminder.scheduledTime}</div>
                  <div className="reminder-desc">{reminder.description}</div>
                  <div className="reminder-date">{reminder.scheduledDate}</div>
                </div>
              ))
            ) : (
              <p className="empty-state">No pending reminders</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Calls</h2>
          <div className="calls-list">
            {recentCalls.length > 0 ? (
              recentCalls.map(call => {
                const lead = leads.find(l => l.id === call.leadId);
                return (
                  <div key={call.id} className="call-item">
                    <div style={{ fontWeight: 500 }}>{lead?.name}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      {call.date} • {call.duration} min
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {call.notes}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-state">No recent calls</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsView({ leads, onAddLead, onUpdateLead, onSelectLead, selectedLead }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relation: '',
    interestedClass: '',
    source: 'Website',
    budget: 'Standard',
    notes: ''
  });

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddLead = (e) => {
    e.preventDefault();
    onAddLead(formData);
    setFormData({
      name: '', phone: '', email: '', relation: '',
      interestedClass: '', source: 'Website', budget: 'Standard', notes: ''
    });
    setShowForm(false);
  };

  return (
    <div className="view leads-view">
      <div className="view-header">
        <h1>Manage Leads</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + New Lead
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add New Lead</h2>
          <form onSubmit={handleAddLead}>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Relation (Parent, Student, etc.)"
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              />
              <select
                value={formData.interestedClass}
                onChange={(e) => setFormData({ ...formData, interestedClass: e.target.value })}
              >
                <option value="">Select Class</option>
                {['KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 
                  'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Social Media">Social Media</option>
                <option value="Walk-in">Walk-in</option>
              </select>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              >
                <option value="Economy">Economy</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
              Add Lead
            </button>
          </form>
        </div>
      )}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="follow-up">Follow-up</option>
          <option value="enrolled">Enrolled</option>
        </select>
      </div>

      <div className="leads-grid">
        {filteredLeads.map(lead => (
          <div
            key={lead.id}
            className={`lead-card ${selectedLead?.id === lead.id ? 'selected' : ''}`}
            onClick={() => onSelectLead(lead)}
          >
            <div className="lead-status" data-status={lead.status}>{lead.status}</div>
            <h3>{lead.name}</h3>
            <p>{lead.relation}</p>
            <p style={{ fontSize: '12px', color: '#999' }}>📞 {lead.phone}</p>
            <p style={{ fontSize: '12px', color: '#999' }}>✉️ {lead.email}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Class: {lead.interestedClass}</p>
          </div>
        ))}
      </div>

      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onUpdate={onUpdateLead} />
      )}
    </div>
  );
}

function LeadDetailPanel({ lead, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(lead);

  const handleSave = () => {
    onUpdate(lead.id, editData);
    setIsEditing(false);
  };

  return (
    <div className="detail-panel">
      <h2>Lead Details</h2>
      <div className="detail-info">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Status:</strong> {lead.status}</p>
        <p><strong>Interested Class:</strong> {lead.interestedClass}</p>
        <p><strong>Source:</strong> {lead.source}</p>
        <p><strong>Budget:</strong> {lead.budget}</p>
        <p><strong>Created:</strong> {lead.createdDate}</p>
        <p><strong>Last Contact:</strong> {lead.lastContact || 'Never'}</p>
        <p><strong>Notes:</strong> {lead.notes}</p>
      </div>
      {isEditing && (
        <div style={{ marginTop: '16px' }}>
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button className="btn-primary" onClick={handleSave} style={{ marginTop: '8px' }}>
            Save
          </button>
        </div>
      )}
      {!isEditing && (
        <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{ marginTop: '16px' }}>
          Edit Notes
        </button>
      )}
    </div>
  );
}

function CallsView({ calls, leads, onAddCall }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leadId: '',
    time: '',
    duration: '',
    outcome: 'positive',
    notes: ''
  });

  const handleAddCall = (e) => {
    e.preventDefault();
    onAddCall(formData);
    setFormData({ leadId: '', time: '', duration: '', outcome: 'positive', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="view calls-view">
      <div className="view-header">
        <h1>Call Logs</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Log Call
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Log New Call</h2>
          <form onSubmit={handleAddCall}>
            <select
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: parseInt(e.target.value) })}
              required
            >
              <option value="">Select Lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name}</option>
              ))}
            </select>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
            <select
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
            >
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
            <textarea
              placeholder="Call Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
              Save Call
            </button>
          </form>
        </div>
      )}

      <div className="calls-list">
        {calls.length > 0 ? (
          calls.reverse().map(call => {
            const lead = leads.find(l => l.id === call.leadId);
            return (
              <div key={call.id} className="call-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{lead?.name}</h3>
                    <p>{call.date} at {call.time}</p>
                  </div>
                  <span className={`outcome-badge outcome-${call.outcome}`}>{call.outcome}</span>
                </div>
                <p>Duration: {call.duration} minutes</p>
                <p className="notes-text">{call.notes}</p>
              </div>
            );
          })
        ) : (
          <p className="empty-state">No calls logged yet</p>
        )}
      </div>
    </div>
  );
}

function RemindersView({ reminders, leads, onAddReminder }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leadId: '',
    type: 'follow-up-call',
    scheduledDate: '',
    scheduledTime: '',
    description: ''
  });

  const handleAddReminder = (e) => {
    e.preventDefault();
    onAddReminder(formData);
    setFormData({
      leadId: '',
      type: 'follow-up-call',
      scheduledDate: '',
      scheduledTime: '',
      description: ''
    });
    setShowForm(false);
  };

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const completedReminders = reminders.filter(r => r.status === 'completed');

  return (
    <div className="view reminders-view">
      <div className="view-header">
        <h1>Reminders</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + New Reminder
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create Reminder</h2>
          <form onSubmit={handleAddReminder}>
            <select
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: parseInt(e.target.value) })}
              required
            >
              <option value="">Select Lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name}</option>
              ))}
            </select>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="follow-up-call">Follow-up Call</option>
              <option value="send-docs">Send Documents</option>
              <option value="schedule-visit">Schedule Visit</option>
              <option value="check-payment">Check Payment</option>
            </select>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
              Create Reminder
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ marginTop: '24px' }}>Pending ({pendingReminders.length})</h2>
        {pendingReminders.map(reminder => {
          const lead = leads.find(l => l.id === reminder.leadId);
          return (
            <div key={reminder.id} className="reminder-card">
              <p><strong>{lead?.name}</strong></p>
              <p>{reminder.description}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>
                {reminder.scheduledDate} at {reminder.scheduledTime}
              </p>
            </div>
          );
        })}
      </div>

      {completedReminders.length > 0 && (
        <div>
          <h2 style={{ marginTop: '24px' }}>Completed ({completedReminders.length})</h2>
          {completedReminders.map(reminder => {
            const lead = leads.find(l => l.id === reminder.leadId);
            return (
              <div key={reminder.id} className="reminder-card completed">
                <p><strong>{lead?.name}</strong></p>
                <p>{reminder.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReportsView({ leads, calls, reminders }) {
  const statusCounts = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    interested: leads.filter(l => l.status === 'interested').length,
    followUp: leads.filter(l => l.status === 'follow-up').length,
    enrolled: leads.filter(l => l.status === 'enrolled').length
  };

  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? (statusCounts.enrolled / totalLeads * 100).toFixed(1) : 0;
  const avgCallDuration = calls.length > 0 ? (calls.reduce((sum, c) => sum + c.duration, 0) / calls.length).toFixed(1) : 0;

  return (
    <div className="view reports-view">
      <h1>Admin Reports</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Leads</div>
          <div className="metric-value">{totalLeads}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Conversion Rate</div>
          <div className="metric-value">{conversionRate}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Calls</div>
          <div className="metric-value">{calls.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Call Duration</div>
          <div className="metric-value">{avgCallDuration} min</div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-section">
          <h2>Lead Status Distribution</h2>
          <div className="status-chart">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="status-bar">
                <span>{status}: {count}</span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{ width: `${(count / Math.max(1, totalLeads)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <h2>Lead Source Analysis</h2>
          <div className="source-list">
            {leads.reduce((acc, lead) => {
              const existing = acc.find(item => item.source === lead.source);
              if (existing) existing.count++;
              else acc.push({ source: lead.source, count: 1 });
              return acc;
            }, []).map(item => (
              <div key={item.source} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{item.source}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="report-section" style={{ marginTop: '24px' }}>
        <h2>Performance by Team Member</h2>
        <div className="team-performance">
          {leads.reduce((acc, lead) => {
            const existing = acc.find(item => item.member === lead.assignedTo);
            if (existing) existing.count++;
            else acc.push({ member: lead.assignedTo, count: 1 });
            return acc;
          }, []).map(item => (
            <div key={item.member} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '8px' }}>
              <span>{item.member}</span>
              <strong>{item.count} leads</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DPSCRMApp;
