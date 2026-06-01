import React, { useState } from 'react';
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

const ALLOWED_IMPORTERS = ['nikishsatija@gmail.com', 'kashish.mehta23@gmail.com', 'principal@dpschhindwara.com', 'dpshrutika@gmail.com', 'priyanshiofficial18@gmail.com'];
const ALLOWED_ASSIGNERS = ['principal@dpschhindwara.com', 'dpshrutika@gmail.com', 'priyanshiofficial18@gmail.com'];
const ALLOWED_EXPORTERS = ['nikishsatija@gmail.com', 'kashish.mehta23@gmail.com', 'principal@dpschhindwara.com'];

const COUNSELORS = [
  { email: 'ashishfalke178@gmail.com', name: 'Ashish Sir' },
  { email: 'dharmendralokmat@gmail.com', name: 'Jaiswal Sir' },
  { email: 'pammushriwastav123@gmail.com', name: 'Pramod Sir' },
  { email: 'gauravarora1838@gmail.com', name: 'Gaurav Sir' },
  { email: 'niteshpathe1982@gmail.com', name: 'Nitesh Sir' },
  { email: 'santosh.forver@gmail.com', name: 'Mishra Sir' },
  { email: 'aryanpal5652@gmail.com', name: 'Devlal Sir' },
  { email: 'kulsum001211@gmail.com', name: 'Kulsum mam' }
];

const SAMPLE_LEADS = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', class: 'Class 9', source: 'Website', status: 'interested', notes: 'Very interested', date: '2024-05-20', calls: [], reminders: [], assignedTo: null, assignmentHistory: [], admissionStatus: 'pending', lockedBy: null, lockDate: null },
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
          <p className="subtitle">Delhi Public School - Admissions Management</p>
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

function LeadDetailsModal({ lead, onClose, user, onAddCall, onAddReminder, onAssign, onLock, onUnlock }) {
  const [showAssignmentHistory, setShowAssignmentHistory] = useState(false);
  const isLocked = lead.admissionStatus === 'admitted';
  const canAssign = ALLOWED_ASSIGNERS.includes(user.email);
  const canLock = ['nikishsatija@gmail.com', 'kashish.mehta23@gmail.com', 'principal@dpschhindwara.com'].includes(user.email);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 {lead.name} {isLocked && '🔒'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {isLocked && <div className="lock-notice">⚠️ This lead is LOCKED (Admission Done)</div>}
          
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

          {lead.notes && <div className="detail-section"><h3>📝 Notes</h3><p>{lead.notes}</p></div>}

          {canAssign && (
            <div className="detail-section">
              <h3>👤 Assign to Counselor</h3>
              <select onChange={(e) => onAssign(lead.id, e.target.value)} disabled={isLocked}>
                <option value="">Select Counselor...</option>
                {COUNSELORS.map(c => <option key={c.email} value={c.email}>{c.name}</option>)}
              </select>
              {lead.assignedTo && (
                <p>Currently assigned to: <strong>{COUNSELORS.find(c => c.email === lead.assignedTo)?.name || lead.assignedTo}</strong></p>
              )}
            </div>
          )}

          {canLock && (
            <div className="detail-section">
              <h3>🔒 Admission Status</h3>
              {!isLocked ? (
                <button onClick={() => onLock(lead.id)} className="btn-lock">Mark as Admitted (Lock)</button>
              ) : (
                <button onClick={() => onUnlock(lead.id)} className="btn-unlock">Unlock Lead</button>
              )}
              {lead.lockDate && <p>Locked on: {lead.lockDate} by {DEMO_USERS[lead.lockedBy]?.name}</p>}
            </div>
          )}

          {lead.calls && lead.calls.length > 0 && (
            <div className="detail-section">
              <h3>📞 Call History ({lead.calls.length} calls)</h3>
              <div className="call-history">
                {lead.calls.map((call, idx) => (
                  <div key={idx} className="call-item">
                    <div className="call-header">{call.date} at {call.time}</div>
                    <div className="call-details">Duration: {call.duration} | Outcome: {call.outcome}</div>
                    {call.notes && <div className="call-notes">{call.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {lead.assignmentHistory && lead.assignmentHistory.length > 0 && (
            <div className="detail-section">
              <h3>📋 Assignment History</h3>
              <button onClick={() => setShowAssignmentHistory(!showAssignmentHistory)} className="btn-secondary">
                {showAssignmentHistory ? 'Hide' : 'Show'} History
              </button>
              {showAssignmentHistory && (
                <div className="assignment-history">
                  {lead.assignmentHistory.map((assignment, idx) => (
                    <div key={idx} className="assignment-item">
                      <p><strong>{DEMO_USERS[assignment.assignedBy]?.name}</strong> assigned to <strong>{COUNSELORS.find(c => c.email === assignment.assignedTo)?.name}</strong></p>
                      <p className="assignment-date">{assignment.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            {!isLocked && (
              <>
                <button onClick={() => onAddCall(lead.id)} className="btn-secondary">📞 Log Call</button>
                <button onClick={() => onAddReminder(lead.id)} className="btn-secondary">⏰ Set Reminder</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ filters, onFilterChange, onClearFilters }) {
  const statusOptions = ['All', 'New', 'Interested', 'Contacted', 'Admitted'];
  const dateOptions = ['All', 'Last 7 days', 'Last 30 days', 'Last 90 days'];
  const assignmentOptions = ['All', 'Assigned', 'Unassigned'];
  const classOptions = ['All', 'Class 1-2', 'Class 3-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];
  const sourceOptions = ['All', 'Website', 'Master Import', 'Phone Call', 'Others'];
  const sortOptions = ['Newest First', 'Oldest First', 'Name A-Z', 'Name Z-A', 'Most Calls'];

  const hasActiveFilters = Object.values(filters).some(v => v !== 'All' && v !== 'Newest First');

  return (
    <div className="filter-section">
      <h3>🔍 FILTERS</h3>
      <div className="filter-grid">
        <div className="filter-item">
          <label>Status:</label>
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Date:</label>
          <select value={filters.date} onChange={(e) => onFilterChange('date', e.target.value)}>
            {dateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Assignment:</label>
          <select value={filters.assignment} onChange={(e) => onFilterChange('assignment', e.target.value)}>
            {assignmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Class:</label>
          <select value={filters.class} onChange={(e) => onFilterChange('class', e.target.value)}>
            {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Source:</label>
          <select value={filters.source} onChange={(e) => onFilterChange('source', e.target.value)}>
            {sourceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Sort:</label>
          <select value={filters.sort} onChange={(e) => onFilterChange('sort', e.target.value)}>
            {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      {hasActiveFilters && <button onClick={onClearFilters} className="btn-clear">Clear Filters</button>}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('dpscrm_leads');
    return saved ? JSON.parse(saved) : SAMPLE_LEADS;
  });

  const [selectedLead, setSelectedLead] = useState(null);
  const [showReports, setShowReports] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    date: 'All',
    assignment: 'All',
    class: 'All',
    source: 'All',
    sort: 'Newest First'
  });

  const getDateRange = (filter) => {
    const today = new Date();
    switch(filter) {
      case 'Last 7 days':
        return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'Last 30 days':
        return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'Last 90 days':
        return new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const getVisibleLeads = () => {
    let visible = leads;
    
    if (user.role === 'user' && !ALLOWED_ASSIGNERS.includes(user.email)) {
      visible = leads.filter(lead => lead.assignedTo === user.email);
    }
    
    if (filters.status !== 'All') {
      visible = visible.filter(lead => lead.status === filters.status.toLowerCase());
    }
    
    if (filters.date !== 'All') {
      const cutoffDate = getDateRange(filters.date);
      visible = visible.filter(lead => new Date(lead.date) >= cutoffDate);
    }
    
    if (filters.assignment === 'Assigned') {
      visible = visible.filter(lead => lead.assignedTo);
    } else if (filters.assignment === 'Unassigned') {
      visible = visible.filter(lead => !lead.assignedTo);
    }
    
    if (filters.class !== 'All') {
      visible = visible.filter(lead => lead.class.includes(filters.class.split('-')[1]?.trim() || filters.class));
    }
    
    if (filters.source !== 'All') {
      visible = visible.filter(lead => lead.source === filters.source);
    }
    
    if (searchTerm) {
      visible = visible.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }
    
    // Apply sorting
    switch(filters.sort) {
      case 'Oldest First':
        visible.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'Name A-Z':
        visible.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name Z-A':
        visible.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Most Calls':
        visible.sort((a, b) => (b.calls?.length || 0) - (a.calls?.length || 0));
        break;
      case 'Newest First':
      default:
        visible.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return visible;
  };

  const handleAddLead = () => {
    const newLead = {
      id: Date.now(),
      name: 'New Lead',
      phone: '',
      email: '',
      class: '',
      source: '',
      status: 'new',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      calls: [],
      reminders: [],
      assignedTo: null,
      assignmentHistory: [],
      admissionStatus: 'pending',
      lockedBy: null,
      lockDate: null
    };
    setLeads([...leads, newLead]);
  };

  const handleAssignLead = (leadId, counselorEmail) => {
    if (!counselorEmail) return;
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const newHistory = [...(lead.assignmentHistory || [])];
        newHistory.push({
          assignedBy: user.email,
          assignedTo: counselorEmail,
          date: new Date().toLocaleString(),
          notes: 'Assignment'
        });
        return { ...lead, assignedTo: counselorEmail, assignmentHistory: newHistory };
      }
      return lead;
    }));
    alert('Lead assigned successfully!');
  };

  const handleLockLead = (leadId) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, admissionStatus: 'admitted', lockedBy: user.email, lockDate: new Date().toLocaleString() }
        : lead
    ));
    alert('Lead locked!');
  };

  const handleUnlockLead = (leadId) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, admissionStatus: 'pending', lockedBy: null, lockDate: null }
        : lead
    ));
    alert('Lead unlocked!');
  };

  const handleExportExcel = () => {
    if (!ALLOWED_EXPORTERS.includes(user.email)) {
      alert('Only Directors and Principal can export!');
      return;
    }
    const csvContent = [
      ['ID', 'Name', 'Phone', 'Email', 'Class', 'Source', 'Status', 'Assigned To', 'Total Calls', 'Date'],
      ...leads.map(lead => [
        lead.id, lead.name, lead.phone, lead.email, lead.class, lead.source, lead.status,
        COUNSELORS.find(c => c.email === lead.assignedTo)?.name || 'Unassigned',
        lead.calls?.length || 0, lead.date
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DPS_CRM_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportReport = () => {
    if (!ALLOWED_EXPORTERS.includes(user.email)) {
      alert('Only Directors and Principal can export!');
      return;
    }
    const reportText = `DPS SCHOOL CRM REPORT\nGenerated: ${new Date().toLocaleString()}\n\n${leads.map(l => `${l.name} | ${l.phone} | ${l.class} | ${l.status}`).join('\n')}`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DPS_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleImportData = () => {
    if (!ALLOWED_IMPORTERS.includes(user.email)) {
      alert('Only authorized users can import!');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target.result;
          const lines = csv.split('\n');
          const newLeads = lines.slice(1).map((line, idx) => {
            const [id, name, phone, email, className, source, status] = line.split(',').map(s => s.replace(/"/g, '').trim());
            if (!name) return null;
            return {
              id: parseInt(id) || Date.now() + idx,
              name, phone, email,
              class: className, source,
              status: status || 'new',
              notes: '',
              date: new Date().toISOString().split('T')[0],
              calls: [], reminders: [],
              assignedTo: null,
              assignmentHistory: [],
              admissionStatus: 'pending'
            };
          }).filter(Boolean);
          setLeads([...leads, ...newLeads]);
          alert(`Imported ${newLeads.length} leads!`);
        } catch (error) {
          alert('Error importing: ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  const visibleLeads = getVisibleLeads();
  const canExport = ALLOWED_EXPORTERS.includes(user.email);
  const canImport = ALLOWED_IMPORTERS.includes(user.email);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 DPS CRM - Lead Management</h1>
        <div className="header-right">
          <span>Welcome, {user.name}</span>
          <button onClick={() => { localStorage.clear(); setUser(null); }} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="toolbar">
        <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        {canImport && <button onClick={handleImportData} className="btn-secondary">📥 Import</button>}
        {canExport && <button onClick={handleExportExcel} className="btn-secondary">📊 Export Excel</button>}
        {canExport && <button onClick={handleExportReport} className="btn-secondary">📋 Export Report</button>}
        <button onClick={() => setShowReports(!showReports)} className="btn-secondary">📈 Reports</button>
        <button onClick={handleAddLead} className="btn-primary">➕ Add Lead</button>
      </div>

      <FilterSection filters={filters} onFilterChange={(key, value) => setFilters({...filters, [key]: value})} onClearFilters={() => setFilters({status: 'All', date: 'All', assignment: 'All', class: 'All', source: 'All', sort: 'Newest First'})} />

      {showReports && (
        <div className="reports-section">
          <h2>📊 Detailed Reports</h2>
          <div className="report-cards">
            <div className="report-card"><h3>Total Leads</h3><p className="big-number">{visibleLeads.length}</p></div>
            <div className="report-card"><h3>Interested</h3><p className="big-number">{visibleLeads.filter(l => l.status === 'interested').length}</p></div>
            <div className="report-card"><h3>Contacted</h3><p className="big-number">{visibleLeads.filter(l => l.status === 'contacted').length}</p></div>
            <div className="report-card"><h3>Total Calls</h3><p className="big-number">{visibleLeads.reduce((sum, l) => sum + (l.calls?.length || 0), 0)}</p></div>
          </div>
        </div>
      )}

      <div className="leads-list">
        {visibleLeads.length === 0 ? (
          <div className="no-leads">No leads found. Try adjusting your filters.</div>
        ) : (
          visibleLeads.map(lead => (
            <div key={lead.id} className={`lead-card ${lead.admissionStatus === 'admitted' ? 'locked' : ''}`} onClick={() => setSelectedLead(lead)}>
              <div className="lead-header">
                <h3>{lead.name} {lead.admissionStatus === 'admitted' && '🔒'}</h3>
                <span className={`status-badge ${lead.status}`}>{lead.status}</span>
              </div>
              <p>📞 {lead.phone}</p>
              <p>📚 {lead.class}</p>
              <p>👤 {COUNSELORS.find(c => c.email === lead.assignedTo)?.name || 'Unassigned'}</p>
              <p className="lead-date">📅 {lead.date}</p>
            </div>
          ))
        )}
      </div>

      {selectedLead && (
        <LeadDetailsModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          user={user}
          onAddCall={() => {}}
          onAddReminder={() => {}}
          onAssign={handleAssignLead}
          onLock={handleLockLead}
          onUnlock={handleUnlockLead}
        />
      )}
    </div>
  );
}

export default App;
