/*
  DPS CRM - SIMPLIFIED VERSION WITH WORKING AUTHENTICATION
  Complete system ready to use immediately
  No Firebase required - uses localStorage for demo
*/

import React, { useState, useEffect } from 'react';
import './styles.css';

// Sample data
const DEMO_USERS = {
  'user@dps.edu.in': { password: 'password123', role: 'user', name: 'Admission Officer' },
  'admin@dps.edu.in': { password: 'password123', role: 'admin', name: 'Administrator' },
  'supervisor@dps.edu.in': { password: 'password123', role: 'supervisor', name: 'Department Head' }
};

const SAMPLE_LEADS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@email.com',
    class: 'Class 9',
    source: 'Website',
    status: 'interested',
    notes: 'Very interested in admission',
    date: '2024-05-20'
  },
  {
    id: 2,
    name: 'Priya Singh',
    phone: '+91 98765 43211',
    email: 'priya@email.com',
    class: 'Class 8',
    source: 'Referral',
    status: 'contacted',
    notes: 'Scheduled campus tour',
    date: '2024-05-25'
  },
  {
    id: 3,
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    email: 'amit@email.com',
    class: 'Class 6',
    source: 'Phone Call',
    status: 'new',
    notes: 'Initial inquiry',
    date: '2024-05-28'
  }
];

// ==================== LOGIN COMPONENT ====================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('user@dps.edu.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
        const user = {
          email,
          role: DEMO_USERS[email].role,
          name: DEMO_USERS[email].name
        };
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Invalid email or password. Try: user@dps.edu.in / password123');
      }
      setLoading(false);
    }, 500);
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
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
          <p><strong>📋 Demo Credentials:</strong></p>
          <p>👤 User: user@dps.edu.in</p>
          <p>👨‍💼 Admin: admin@dps.edu.in</p>
          <p>📊 Supervisor: supervisor@dps.edu.in</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>All use password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
function DPSCRMApp() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const addLead = (leadData) => {
    const newLead = {
      id: Math.max(...leads.map(l => l.id), 0) + 1,
      ...leadData,
      date: new Date().toISOString().split('T')[0]
    };
    setLeads([...leads, newLead]);
    alert('Lead added successfully!');
  };

  const deleteLead = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(l => l.id !== leadId));
      setSelectedLead(null);
      alert('Lead deleted');
    }
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📚</span>
            DPS CRM
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
            <span>{user.name} ({user.role})</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="view">
            <h1>Dashboard</h1>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Total Leads</div>
                <div className="metric-value">{leads.length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">New This Week</div>
                <div className="metric-value">
                  {leads.filter(l => new Date(l.date) > new Date(Date.now() - 7*24*60*60*1000)).length}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Interested</div>
                <div className="metric-value">
                  {leads.filter(l => l.status === 'interested').length}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Conversion Rate</div>
                <div className="metric-value">
                  {leads.length > 0 ? ((leads.filter(l => l.status === 'interested').length / leads.length) * 100).toFixed(0) : 0}%
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h2>Recent Leads</h2>
                <div className="leads-list">
                  {leads.slice(-3).reverse().map(lead => (
                    <div key={lead.id} className="lead-item-summary">
                      <div style={{ fontWeight: '500' }}>{lead.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {lead.class} • {lead.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Quick Stats</h2>
                <div style={{ padding: '16px' }}>
                  <p>✅ System Status: <strong style={{ color: '#27ae60' }}>Online</strong></p>
                  <p>👥 Team Members: <strong>15</strong></p>
                  <p>📞 Calls Today: <strong>8</strong></p>
                  <p>⏰ Last Updated: <strong>Just now</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leads View */}
        {currentView === 'leads' && (
          <div className="view leads-view">
            <div className="view-header">
              <h1>Manage Leads</h1>
              <button className="btn-primary" onClick={() => {
                const name = prompt('Lead Name:');
                if (name) {
                  const phone = prompt('Phone:');
                  const email = prompt('Email:');
                  const classVal = prompt('Class (e.g., Class 9):');
                  addLead({
                    name,
                    phone: phone || '+91 XXXXXXXXXX',
                    email: email || 'email@example.com',
                    class: classVal || 'Class 9',
                    source: 'Manual',
                    status: 'new',
                    notes: 'Manually added'
                  });
                }
              }}>
                + New Lead
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ marginBottom: '20px', width: '100%' }}
            />

            <div className="leads-grid">
              {filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  className={`lead-card ${selectedLead?.id === lead.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>{lead.name}</h3>
                    <span className="lead-status" style={{
                      background: lead.status === 'interested' ? '#d4edda' : lead.status === 'contacted' ? '#cce5ff' : '#fef3cd',
                      color: lead.status === 'interested' ? '#155724' : lead.status === 'contacted' ? '#004085' : '#856404',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {lead.status}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>📞 {lead.phone}</p>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>✉️ {lead.email}</p>
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>Class: {lead.class}</p>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>"{lead.notes}"</p>
                </div>
              ))}
            </div>

            {selectedLead && (
              <div className="detail-panel">
                <h2>Lead Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <p><strong>Name:</strong> {selectedLead.name}</p>
                    <p><strong>Phone:</strong> {selectedLead.phone}</p>
                    <p><strong>Email:</strong> {selectedLead.email}</p>
                    <p><strong>Class:</strong> {selectedLead.class}</p>
                  </div>
                  <div>
                    <p><strong>Source:</strong> {selectedLead.source}</p>
                    <p><strong>Status:</strong> {selectedLead.status}</p>
                    <p><strong>Date Added:</strong> {selectedLead.date}</p>
                    <p><strong>Notes:</strong> {selectedLead.notes}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" onClick={() => alert('Log call feature - coming soon!')}>
                    Log Call
                  </button>
                  <button className="btn-secondary" onClick={() => alert('Set reminder - coming soon!')}>
                    Set Reminder
                  </button>
                  <button className="btn-secondary" style={{ marginLeft: 'auto', background: '#f8d7da', color: '#721c24' }} onClick={() => deleteLead(selectedLead.id)}>
                    Delete Lead
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reports View (Admin Only) */}
        {currentView === 'reports' && user.role === 'admin' && (
          <div className="view">
            <h1>Reports & Analytics</h1>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Total Leads</div>
                <div className="metric-value">{leads.length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">New Leads</div>
                <div className="metric-value">{leads.filter(l => l.status === 'new').length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Interested</div>
                <div className="metric-value">{leads.filter(l => l.status === 'interested').length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Contacted</div>
                <div className="metric-value">{leads.filter(l => l.status === 'contacted').length}</div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h2>Lead Status Distribution</h2>
                {['new', 'contacted', 'interested'].map(status => {
                  const count = leads.filter(l => l.status === status).length;
                  const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                  return (
                    <div key={status} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{status}</span>
                        <span>{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div style={{ background: '#f0f0f0', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          background: status === 'interested' ? '#27ae60' : status === 'contacted' ? '#3498db' : '#f39c12',
                          height: '100%',
                          width: percentage + '%',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dashboard-section">
                <h2>Leads by Source</h2>
                {['Website', 'Referral', 'Phone Call'].map(source => {
                  const count = leads.filter(l => l.source === source).length;
                  return (
                    <div key={source} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{source}</span>
                        <strong>{count}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DPSCRMApp;
