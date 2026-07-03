// ===== DATA =====
const jobs = [
  { id:1, title:'Assistant Engineer (Transmission)', dept:'Engineering', type:'technical', location:'New Delhi', vacancies:12, deadline:'2026-08-15', posted:'2026-06-01', experience:'2-5 years', education:'B.Tech/B.E.', badge:'new' },
  { id:2, title:'Programme Executive', dept:'Editorial', type:'editorial', location:'New Delhi', vacancies:8, deadline:'2026-07-30', posted:'2026-06-10', experience:'1-3 years', education:'Graduation', badge:'new' },
  { id:3, title:'Junior Engineer (Electronics)', dept:'Technical', type:'technical', location:'Delhi/NCR', vacancies:20, deadline:'2026-07-20', posted:'2026-05-20', experience:'0-2 years', education:'Diploma/B.Tech', badge:'closing' },
  { id:4, title:'Research Officer', dept:'Research & Development', type:'technical', location:'New Delhi', vacancies:4, deadline:'2026-09-01', posted:'2026-06-15', experience:'3-6 years', education:'Post Graduation', badge:'new' },
  { id:5, title:'Staff Car Driver', dept:'Administration', type:'administrative', location:'New Delhi', vacancies:6, deadline:'2026-08-10', posted:'2026-06-05', experience:'2+ years', education:'10th Pass', badge:'' },
  { id:6, title:'News Reader cum Translator', dept:'Editorial', type:'editorial', location:'New Delhi', vacancies:3, deadline:'2026-07-25', posted:'2026-06-12', experience:'1-4 years', education:'Graduation', badge:'closing' },
  { id:7, title:'Accounts Officer', dept:'Finance', type:'administrative', location:'New Delhi', vacancies:2, deadline:'2026-09-10', posted:'2026-06-18', experience:'4-7 years', education:'CA/MBA Finance', badge:'new' },
  { id:8, title:'Script Writer', dept:'Editorial', type:'editorial', location:'New Delhi', vacancies:5, deadline:'2026-08-20', posted:'2026-06-08', experience:'2-5 years', education:'Graduation', badge:'' },
];

const myApplications = [
  { id:'AIR2026001', role:'Assistant Engineer (Transmission)', applied:'2026-06-05', status:'interview', stage:4 },
  { id:'AIR2026002', role:'Research Officer', applied:'2026-06-18', status:'assessment', stage:3 },
  { id:'AIR2026003', role:'Programme Executive', applied:'2026-06-20', status:'screening', stage:2 },
];

const notifications = [
  { id:1, icon:'fa-video', bg:'#e3f2fd', color:'#1565c0', title:'Interview Scheduled', desc:'Your interview for Assistant Engineer is scheduled on July 10, 2026 at 11:00 AM.', time:'2 hours ago', read:false },
  { id:2, icon:'fa-laptop-code', bg:'#e8f5e9', color:'#2e7d32', title:'Assessment Link Sent', desc:'Aptitude test for Research Officer is live. Complete before July 5, 2026.', time:'1 day ago', read:false },
  { id:3, icon:'fa-check-circle', bg:'#e8f5e9', color:'#2e7d32', title:'Application Shortlisted', desc:'Your application for Programme Executive has passed the screening stage.', time:'3 days ago', read:false },
  { id:4, icon:'fa-file-alt', bg:'#fff3e0', color:'#e65100', title:'Application Submitted', desc:'Your application for Programme Executive (AIR2026003) was received.', time:'4 days ago', read:false },
  { id:5, icon:'fa-info-circle', bg:'#f3e5f5', color:'#6a1b9a', title:'New Vacancies Posted', desc:'7 new positions have been posted. Check the vacancies section.', time:'5 days ago', read:true },
];

const stageLabels = ['Applied', 'Screening', 'Assessment', 'Interview', 'Decision'];
let currentRole = 'candidate';

// ===== NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'candidate-dashboard') { showDashTab('overview', null); animateCounters(); }
  if (id === 'hr-dashboard') showHRTab('hr-overview', null);
  if (id === 'admin-dashboard') showAdminTab('admin-overview', null);
  if (id === 'interviewer-dashboard') showIVTab('iv-overview', null);
}

function handleLogin(e) {
  e.preventDefault();
  const dashMap = { candidate:'candidate-dashboard', hr:'hr-dashboard', admin:'admin-dashboard', interviewer:'interviewer-dashboard' };
  showPage(dashMap[currentRole]);
  showToast(`Welcome back! Signed in as ${currentRole.charAt(0).toUpperCase()+currentRole.slice(1)}`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  showPage('login-page');
  showToast('Account created! Please sign in.', 'success');
}

function selectRole(el, role) {
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentRole = role;
}

function togglePwd() {
  const inp = document.getElementById('pwd-input');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleSidebar() {
  document.querySelectorAll('.sidebar').forEach(s => s.classList.toggle('collapsed'));
}

// ===== JOB LISTINGS =====
function renderJobs(filter='all') {
  const grid = document.getElementById('jobs-grid');
  if (!grid) return;
  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.type === filter);
  grid.innerHTML = filtered.map(j => `
    <div class="job-card" onclick="openJobModal(${j.id})">
      <div class="job-card-header">
        <div class="job-icon"><i class="fas fa-${j.type==='technical'?'microchip':j.type==='editorial'?'pen-nib':'building'}"></i></div>
        ${j.badge ? `<span class="job-badge badge-${j.badge==='new'?'new':'closing'}">${j.badge==='new'?'New':'Closing Soon'}</span>` : ''}
      </div>
      <h3>${j.title}</h3>
      <p class="job-dept">${j.dept}</p>
      <div class="job-meta">
        <span><i class="fas fa-map-marker-alt"></i>${j.location}</span>
        <span><i class="fas fa-users"></i>${j.vacancies} Vacancies</span>
        <span><i class="fas fa-calendar"></i>Deadline: ${formatDate(j.deadline)}</span>
      </div>
      <button class="btn-primary" onclick="event.stopPropagation();applyJob(${j.id})">Apply Now <i class="fas fa-arrow-right"></i></button>
    </div>
  `).join('');
}

function filterJobs(el, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderJobs(filter);
}

function openJobModal(id) {
  const j = jobs.find(x => x.id === id);
  if (!j) return;
  openModal(`
    <h3><i class="fas fa-briefcase" style="color:var(--primary);margin-right:8px"></i>${j.title}</h3>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px">
      <span class="pill pill-active"><i class="fas fa-building" style="margin-right:4px"></i>${j.dept}</span>
      <span class="pill pill-assessment"><i class="fas fa-map-marker-alt" style="margin-right:4px"></i>${j.location}</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><small style="color:var(--text-light);font-size:0.75rem">VACANCIES</small><div style="font-weight:700;color:var(--primary)">${j.vacancies}</div></div>
      <div><small style="color:var(--text-light);font-size:0.75rem">EXPERIENCE</small><div style="font-weight:700;color:var(--primary)">${j.experience}</div></div>
      <div><small style="color:var(--text-light);font-size:0.75rem">EDUCATION</small><div style="font-weight:700;color:var(--primary)">${j.education}</div></div>
      <div><small style="color:var(--text-light);font-size:0.75rem">DEADLINE</small><div style="font-weight:700;color:var(--danger)">${formatDate(j.deadline)}</div></div>
    </div>
    <p style="font-size:0.85rem;color:var(--text-light);line-height:1.6;margin-bottom:20px">Selected candidates will be part of All India Radio's mission to broadcast quality content across India. This role involves working with state-of-the-art broadcast infrastructure under the Prasar Bharati umbrella.</p>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn-primary" onclick="applyJob(${j.id});closeModal()"><i class="fas fa-paper-plane"></i> Apply Now</button>
    </div>
  `);
}

function applyJob(id) {
  const j = jobs.find(x => x.id === id);
  showToast(`Application submitted for "${j.title}"`, 'success');
}

// ===== CANDIDATE DASHBOARD TABS =====
function showDashTab(tab, el) {
  if (el) {
    document.querySelectorAll('#candidate-dashboard .nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  const titles = { overview:'Overview', 'my-applications':'My Applications', 'browse-jobs':'Browse Jobs', assessments:'Assessments', interviews:'Interviews', notifications:'Notifications', profile:'My Profile' };
  document.getElementById('dash-page-title').textContent = titles[tab] || tab;
  const content = document.getElementById('dash-content');

  if (tab === 'overview') content.innerHTML = renderCandidateOverview();
  else if (tab === 'my-applications') content.innerHTML = renderMyApplications();
  else if (tab === 'browse-jobs') content.innerHTML = renderBrowseJobs();
  else if (tab === 'assessments') content.innerHTML = renderAssessments();
  else if (tab === 'interviews') content.innerHTML = renderInterviews();
  else if (tab === 'notifications') content.innerHTML = renderNotifications();
  else if (tab === 'profile') content.innerHTML = renderProfile();
}

function renderCandidateOverview() {
  return `
    <div style="margin-bottom:8px"><p style="font-size:0.9rem;color:var(--text-light)">Good morning, <strong style="color:var(--primary)">Rahul Sharma</strong> — here's your application summary.</p></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon sc-blue"><i class="fas fa-file-alt"></i></div><div class="stat-card-info"><span class="num">3</span><span class="label">Applications</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-orange"><i class="fas fa-laptop-code"></i></div><div class="stat-card-info"><span class="num">1</span><span class="label">Pending Assessment</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-green"><i class="fas fa-video"></i></div><div class="stat-card-info"><span class="num">1</span><span class="label">Interview Scheduled</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-purple"><i class="fas fa-bell"></i></div><div class="stat-card-info"><span class="num">4</span><span class="label">New Notifications</span></div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-header"><i class="fas fa-file-alt"></i><h4>Application Status</h4></div>
        ${myApplications.map(a => `
          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div><div style="font-size:0.88rem;font-weight:600">${a.role}</div><div style="font-size:0.75rem;color:var(--text-light)">${a.id}</div></div>
              <span class="pill pill-${a.status}">${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span>
            </div>
            <div class="progress-tracker">${stageLabels.map((s,i) => `
              <div class="progress-step ${i+1 < a.stage ? 'ps-done' : i+1===a.stage ? 'ps-active' : 'ps-pending'}">
                <div class="ps-circle">${i+1 < a.stage ? '<i class="fas fa-check" style="font-size:0.7rem"></i>' : i+1}</div>
                <span class="ps-label">${s}</span>
              </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><i class="fas fa-clock"></i><h4>Upcoming</h4></div>
          <div class="timeline">
            <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h5>Interview – Asst. Engineer</h5><p>Panel interview via video conference</p><div class="timeline-time"><i class="fas fa-calendar" style="margin-right:4px"></i>July 10, 2026 · 11:00 AM</div></div></div>
            <div class="timeline-item"><div class="timeline-dot" style="background:var(--accent)"></div><div class="timeline-content"><h5>Assessment – Research Officer</h5><p>Aptitude + Technical test (90 mins)</p><div class="timeline-time"><i class="fas fa-calendar" style="margin-right:4px"></i>July 5, 2026 · Deadline</div></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><i class="fas fa-bolt"></i><h4>Quick Actions</h4></div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn-secondary" onclick="showDashTab('browse-jobs',null)" style="justify-content:flex-start"><i class="fas fa-search"></i> Browse New Jobs</button>
            <button class="btn-secondary" onclick="showDashTab('assessments',null)" style="justify-content:flex-start"><i class="fas fa-laptop-code"></i> Start Assessment</button>
            <button class="btn-secondary" onclick="showDashTab('interviews',null)" style="justify-content:flex-start"><i class="fas fa-video"></i> View Interview Details</button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderMyApplications() {
  return `
    <div class="search-filter-bar">
      <div class="search-box"><i class="fas fa-search"></i><input type="text" placeholder="Search applications..."/></div>
      <select class="filter-select"><option>All Status</option><option>Applied</option><option>Screening</option><option>Assessment</option><option>Interview</option><option>Selected</option></select>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>Application ID</th><th>Role</th><th>Applied On</th><th>Current Stage</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${myApplications.map(a => `<tr>
          <td><strong>${a.id}</strong></td>
          <td>${a.role}</td>
          <td>${formatDate(a.applied)}</td>
          <td>${stageLabels[a.stage-1]}</td>
          <td><span class="pill pill-${a.status}">${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span></td>
          <td class="actions">
            <button class="btn-secondary" onclick="viewApplication('${a.id}')"><i class="fas fa-eye"></i></button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderBrowseJobs() {
  return `
    <div class="search-filter-bar">
      <div class="search-box"><i class="fas fa-search"></i><input type="text" placeholder="Search jobs..." oninput="filterJobsInline(this.value)"/></div>
      <select class="filter-select" onchange="filterJobsByType(this.value)"><option value="all">All Types</option><option value="technical">Technical</option><option value="editorial">Editorial</option><option value="administrative">Administrative</option></select>
    </div>
    <div id="inline-jobs-grid" class="jobs-grid" style="max-width:100%;margin:0">${renderJobCards(jobs)}</div>`;
}

function renderJobCards(list) {
  return list.map(j => `
    <div class="job-card" onclick="openJobModal(${j.id})">
      <div class="job-card-header"><div class="job-icon"><i class="fas fa-${j.type==='technical'?'microchip':j.type==='editorial'?'pen-nib':'building'}"></i></div>${j.badge ? `<span class="job-badge badge-${j.badge==='new'?'new':'closing'}">${j.badge==='new'?'New':'Closing Soon'}</span>` : ''}</div>
      <h3>${j.title}</h3><p class="job-dept">${j.dept}</p>
      <div class="job-meta"><span><i class="fas fa-map-marker-alt"></i>${j.location}</span><span><i class="fas fa-users"></i>${j.vacancies} Vacancies</span><span><i class="fas fa-calendar"></i>${formatDate(j.deadline)}</span></div>
      <button class="btn-primary" onclick="event.stopPropagation();applyJob(${j.id})">Apply <i class="fas fa-arrow-right"></i></button>
    </div>`).join('');
}

function filterJobsInline(val) {
  const grid = document.getElementById('inline-jobs-grid');
  if (!grid) return;
  const filtered = jobs.filter(j => j.title.toLowerCase().includes(val.toLowerCase()) || j.dept.toLowerCase().includes(val.toLowerCase()));
  grid.innerHTML = filtered.length ? renderJobCards(filtered) : '<div class="empty-state"><i class="fas fa-search"></i><p>No jobs found</p></div>';
}

function filterJobsByType(type) {
  const grid = document.getElementById('inline-jobs-grid');
  if (!grid) return;
  const filtered = type === 'all' ? jobs : jobs.filter(j => j.type === type);
  grid.innerHTML = renderJobCards(filtered);
}

function renderAssessments() {
  return `
    <div class="assessment-card">
      <div>
        <h4>Aptitude & Technical Test – Research Officer</h4>
        <p>Application ID: AIR2026002 · Department: Research & Development</p>
        <div class="assessment-meta">
          <span><i class="fas fa-clock"></i>Duration: 90 minutes</span>
          <span><i class="fas fa-question-circle"></i>75 Questions</span>
          <span><i class="fas fa-calendar-times"></i>Deadline: Jul 5, 2026</span>
        </div>
        <div class="countdown">Time Remaining <span id="countdown-timer">2d 14h 22m</span></div>
      </div>
      <div style="text-align:right">
        <div class="assessment-icon"><i class="fas fa-laptop-code"></i></div>
        <button class="btn-primary" onclick="startAssessment()" style="margin-top:12px"><i class="fas fa-play"></i> Start Test</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-history"></i><h4>Past Assessments</h4></div>
      <table class="data-table">
        <thead><tr><th>Role</th><th>Date</th><th>Score</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>Assistant Engineer (Transmission)</td><td>Jun 15, 2026</td><td>78/100</td><td><span class="pill pill-selected">Passed</span></td></tr>
        </tbody>
      </table>
    </div>`;
}

function renderInterviews() {
  return `
    <div class="interview-card">
      <div class="iv-avatar">RS</div>
      <div class="iv-info">
        <h4>Panel Interview – Assistant Engineer (Transmission)</h4>
        <div class="iv-meta">
          <span><i class="fas fa-calendar"></i>July 10, 2026</span>
          <span><i class="fas fa-clock"></i>11:00 AM – 12:00 PM</span>
          <span><i class="fas fa-video"></i>Virtual (MS Teams)</span>
          <span><i class="fas fa-users"></i>3 Panel Members</span>
        </div>
      </div>
      <div class="iv-actions">
        <button class="btn-primary" onclick="joinInterview()"><i class="fas fa-video"></i> Join</button>
        <button class="btn-secondary" onclick="showToast('Instructions sent to your email','success')"><i class="fas fa-info-circle"></i></button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-book-open"></i><h4>Interview Preparation Tips</h4></div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
        ${['Test your audio and video 15 minutes before','Keep your government ID ready for verification','Review the job description and your application','Be in a quiet, well-lit environment','Have a stable internet connection'].map(t=>`<li style="display:flex;align-items:center;gap:8px;font-size:0.87rem"><i class="fas fa-check-circle" style="color:var(--success)"></i>${t}</li>`).join('')}
      </ul>
    </div>`;
}

function renderNotifications() {
  return `
    <div class="section-header"><h3>All Notifications</h3><button class="btn-secondary" onclick="markAllRead()"><i class="fas fa-check-double"></i> Mark All Read</button></div>
    <div class="notif-list">
      ${notifications.map(n => `
        <div class="notif-item ${n.read?'':'unread'}" onclick="this.classList.remove('unread')">
          <div class="notif-icon" style="background:${n.bg};color:${n.color}"><i class="fas ${n.icon}"></i></div>
          <div class="notif-body">
            <div class="title">${n.title}${!n.read?'<span style="font-size:0.7rem;background:var(--primary);color:#fff;padding:1px 7px;border-radius:10px;margin-left:8px;font-weight:600">NEW</span>':''}</div>
            <div class="desc">${n.desc}</div>
            <div class="time"><i class="fas fa-clock" style="margin-right:3px"></i>${n.time}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderProfile() {
  return `
    <div class="profile-header">
      <div class="profile-avatar-big">RS</div>
      <div class="profile-info">
        <h3>Rahul Sharma</h3>
        <p>Candidate · AIR Portal ID: AIR-CAND-2026-00142</p>
        <div class="profile-meta">
          <span><i class="fas fa-envelope"></i>rahul.sharma@email.com</span>
          <span><i class="fas fa-phone"></i>+91 98765 43210</span>
          <span><i class="fas fa-map-marker-alt"></i>New Delhi</span>
        </div>
      </div>
      <button class="btn-primary" style="margin-left:auto" onclick="showToast('Profile saved!','success')"><i class="fas fa-save"></i> Save</button>
    </div>
    <div class="form-section">
      <h4><i class="fas fa-user" style="margin-right:8px;color:var(--primary)"></i>Personal Information</h4>
      <div class="form-grid">
        <div class="form-group"><label>First Name</label><input type="text" value="Rahul"/></div>
        <div class="form-group"><label>Last Name</label><input type="text" value="Sharma"/></div>
        <div class="form-group"><label>Date of Birth</label><input type="date" value="1995-03-15"/></div>
        <div class="form-group"><label>Gender</label><select><option>Male</option><option>Female</option><option>Other</option></select></div>
        <div class="form-group"><label>Category</label><select><option>General</option><option>OBC</option><option>SC</option><option>ST</option></select></div>
        <div class="form-group"><label>Nationality</label><input type="text" value="Indian"/></div>
      </div>
    </div>
    <div class="form-section">
      <h4><i class="fas fa-graduation-cap" style="margin-right:8px;color:var(--primary)"></i>Education</h4>
      <div class="form-grid">
        <div class="form-group"><label>Highest Qualification</label><select><option>B.Tech</option><option>M.Tech</option><option>MBA</option><option>Graduation</option></select></div>
        <div class="form-group"><label>Specialization</label><input type="text" value="Electronics & Comm."/></div>
        <div class="form-group"><label>University</label><input type="text" value="Delhi University"/></div>
        <div class="form-group"><label>Year of Passing</label><input type="number" value="2018"/></div>
      </div>
    </div>`;
}

// ===== HR DASHBOARD TABS =====
function showHRTab(tab, el) {
  if (el) {
    document.querySelectorAll('#hr-dashboard .nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  const titles = { 'hr-overview':'HR Dashboard', 'hr-jobs':'Job Postings', 'hr-applications':'Applications', 'hr-screening':'Screening', 'hr-assessments':'Assessments', 'hr-interviews':'Interviews', 'hr-hiring':'Hiring Decisions', 'hr-reports':'Reports' };
  document.getElementById('hr-page-title').textContent = titles[tab] || tab;
  const content = document.getElementById('hr-content');

  if (tab === 'hr-overview') content.innerHTML = renderHROverview();
  else if (tab === 'hr-jobs') content.innerHTML = renderHRJobs();
  else if (tab === 'hr-applications') content.innerHTML = renderHRApplications();
  else if (tab === 'hr-screening') content.innerHTML = renderHRScreening();
  else if (tab === 'hr-assessments') content.innerHTML = renderHRAssessments();
  else if (tab === 'hr-interviews') content.innerHTML = renderHRInterviews();
  else if (tab === 'hr-hiring') content.innerHTML = renderHRHiring();
  else if (tab === 'hr-reports') content.innerHTML = renderHRReports();
}

function renderHROverview() {
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon sc-blue"><i class="fas fa-briefcase"></i></div><div class="stat-card-info"><span class="num">8</span><span class="label">Active Job Postings</span><span class="trend trend-up"><i class="fas fa-arrow-up"></i>+2 this week</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-orange"><i class="fas fa-users"></i></div><div class="stat-card-info"><span class="num">248</span><span class="label">Total Applicants</span><span class="trend trend-up"><i class="fas fa-arrow-up"></i>+34 today</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-purple"><i class="fas fa-filter"></i></div><div class="stat-card-info"><span class="num">86</span><span class="label">Shortlisted</span><span class="trend">35% pass rate</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-green"><i class="fas fa-video"></i></div><div class="stat-card-info"><span class="num">12</span><span class="label">Interviews Scheduled</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-teal"><i class="fas fa-trophy"></i></div><div class="stat-card-info"><span class="num">7</span><span class="label">Offers Extended</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-red"><i class="fas fa-times-circle"></i></div><div class="stat-card-info"><span class="num">155</span><span class="label">Not Eligible</span></div></div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">
      <div class="card">
        <div class="card-header"><i class="fas fa-chart-bar"></i><h4>Applications by Role</h4></div>
        <div class="bar-chart-wrap">
          <div class="bar-chart">
            ${[{l:'Asst Eng',v:85},{l:'Prog Exec',v:62},{l:'Jr Eng',v:48},{l:'Research',v:22},{l:'Accounts',v:18},{l:'Driver',v:13}].map(b=>`<div style="display:flex;flex-direction:column;align-items:center;flex:1"><div class="bar" style="height:${b.v}%" title="${b.l}: ${b.v} applications"></div><div class="bar-label">${b.l}</div></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><i class="fas fa-tasks"></i><h4>Pending Actions</h4></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[{c:'#fff3e0',t:'#e65100',i:'fa-filter',txt:'48 applications to screen',btn:'Review'},{c:'#e3f2fd',t:'#1565c0',i:'fa-laptop-code',txt:'12 assessments evaluated',btn:'View'},{c:'#e8f5e9',t:'#2e7d32',i:'fa-video',txt:'3 interviews completed',btn:'Decide'},{c:'#f3e5f5',t:'#6a1b9a',i:'fa-trophy',txt:'5 offers pending approval',btn:'Approve'}].map(item=>`
            <div style="background:${item.c};border-radius:8px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div style="display:flex;align-items:center;gap:8px"><i class="fas ${item.i}" style="color:${item.t}"></i><span style="font-size:0.83rem;font-weight:500">${item.txt}</span></div>
              <button class="btn-secondary" style="font-size:0.75rem;padding:5px 10px" onclick="showToast('Opening...','')"><i class="fas fa-arrow-right"></i></button>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function renderHRJobs() {
  return `
    <div class="section-header">
      <h3>Job Postings</h3>
      <button class="btn-primary" onclick="openPostJobModal()"><i class="fas fa-plus"></i> New Job Posting</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>Job Title</th><th>Department</th><th>Vacancies</th><th>Applications</th><th>Status</th><th>Deadline</th><th>Actions</th></tr></thead>
      <tbody>
        ${jobs.map(j => `<tr>
          <td><strong>${j.title}</strong></td>
          <td>${j.dept}</td>
          <td>${j.vacancies}</td>
          <td>${Math.floor(Math.random()*50)+10}</td>
          <td><span class="pill ${new Date(j.deadline) > new Date() ? 'pill-active':'pill-closed'}">${new Date(j.deadline) > new Date() ? 'Active':'Closed'}</span></td>
          <td>${formatDate(j.deadline)}</td>
          <td class="actions">
            <button class="btn-secondary" onclick="showToast('Viewing job details','')"><i class="fas fa-eye"></i></button>
            <button class="btn-secondary" onclick="showToast('Job editing opened','')"><i class="fas fa-edit"></i></button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderHRApplications() {
  const cands = [
    {id:'AIR2026001',name:'Rahul Sharma',role:'Asst Engineer',date:'Jun 5',status:'interview'},
    {id:'AIR2026004',name:'Priya Nair',role:'Research Officer',date:'Jun 18',status:'assessment'},
    {id:'AIR2026005',name:'Amit Kumar',role:'Prog Executive',date:'Jun 20',status:'screening'},
    {id:'AIR2026006',name:'Sunita Rao',role:'Asst Engineer',date:'Jun 22',status:'applied'},
    {id:'AIR2026007',name:'Vikram Singh',role:'Jr Engineer',date:'Jun 23',status:'rejected'},
    {id:'AIR2026008',name:'Meera Pillai',role:'Accounts Officer',date:'Jun 24',status:'selected'},
  ];
  return `
    <div class="search-filter-bar">
      <div class="search-box"><i class="fas fa-search"></i><input type="text" placeholder="Search candidates..."/></div>
      <select class="filter-select"><option>All Status</option><option>Applied</option><option>Screening</option><option>Assessment</option><option>Interview</option><option>Selected</option><option>Rejected</option></select>
      <select class="filter-select"><option>All Jobs</option>${jobs.map(j=>`<option>${j.title}</option>`).join('')}</select>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>App ID</th><th>Candidate</th><th>Applied For</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${cands.map(c=>`<tr>
          <td><strong>${c.id}</strong></td>
          <td><div style="display:flex;align-items:center;gap:8px"><div style="width:30px;height:30px;border-radius:50%;background:var(--primary);color:#fff;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center">${c.name.split(' ').map(n=>n[0]).join('')}</div>${c.name}</div></td>
          <td>${c.role}</td>
          <td>${c.date}</td>
          <td><span class="pill pill-${c.status}">${c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
          <td class="actions">
            <button class="btn-secondary" onclick="viewCandidateProfile('${c.name}')"><i class="fas fa-eye"></i> View</button>
            <button class="btn-success" style="font-size:0.78rem;padding:5px 10px" onclick="moveCandidate('${c.name}')"><i class="fas fa-arrow-right"></i></button>
            <button class="btn-danger" style="font-size:0.78rem;padding:5px 10px" onclick="rejectCandidate('${c.name}')"><i class="fas fa-times"></i></button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderHRScreening() {
  return `
    <div class="card">
      <div class="card-header"><i class="fas fa-cog"></i><h4>Eligibility Criteria Setup – Assistant Engineer (Transmission)</h4></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        ${[{l:'Minimum Education',v:'B.Tech / B.E. in Electronics / Electrical'},{l:'Minimum Experience',v:'2 Years'},{l:'Age Limit',v:'18–35 years (with relaxation as per Govt. rules)'},{l:'Required Skills',v:'Transmission Systems, RF Engineering'}].map(f=>`
          <div style="background:var(--bg);border-radius:8px;padding:14px">
            <div style="font-size:0.75rem;color:var(--text-light);margin-bottom:4px">${f.l}</div>
            <div style="font-size:0.9rem;font-weight:600">${f.v}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn-primary" onclick="showToast('Auto-screening started for 85 applications','success')"><i class="fas fa-play"></i> Run Auto-Screening</button>
        <button class="btn-secondary" onclick="showToast('Criteria saved','success')"><i class="fas fa-save"></i> Save Criteria</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-chart-pie"></i><h4>Screening Results</h4></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px">
        <div style="background:#e8f5e9;border-radius:8px;padding:16px 24px;text-align:center"><div style="font-size:1.8rem;font-weight:700;color:var(--success)">54</div><div style="font-size:0.78rem;color:#2e7d32">Eligible</div></div>
        <div style="background:#ffebee;border-radius:8px;padding:16px 24px;text-align:center"><div style="font-size:1.8rem;font-weight:700;color:var(--danger)">31</div><div style="font-size:0.78rem;color:#c62828">Not Eligible</div></div>
        <div style="background:#fff3e0;border-radius:8px;padding:16px 24px;text-align:center"><div style="font-size:1.8rem;font-weight:700;color:var(--warning)">8</div><div style="font-size:0.78rem;color:#e65100">Under Review</div></div>
      </div>
      <button class="btn-primary" onclick="showToast('Shortlisted candidates notified','success')"><i class="fas fa-paper-plane"></i> Notify Shortlisted Candidates</button>
    </div>`;
}

function renderHRAssessments() {
  return `
    <div class="section-header"><h3>Assessment Management</h3><button class="btn-primary" onclick="showToast('New assessment form opened','')"><i class="fas fa-plus"></i> Create Assessment</button></div>
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>Assessment</th><th>Role</th><th>Type</th><th>Duration</th><th>Questions</th><th>Scheduled</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>Aptitude + Technical</td><td>Asst Engineer</td><td>MCQ + Coding</td><td>90 min</td><td>75</td><td>Jun 15, 2026</td><td><span class="pill pill-closed">Completed</span></td></tr>
        <tr><td>Research Aptitude</td><td>Research Officer</td><td>MCQ + Essay</td><td>90 min</td><td>60</td><td>Jul 5, 2026</td><td><span class="pill pill-active">Active</span></td></tr>
        <tr><td>General Aptitude</td><td>Programme Executive</td><td>MCQ</td><td>60 min</td><td>50</td><td>Jul 12, 2026</td><td><span class="pill pill-pending">Upcoming</span></td></tr>
      </tbody>
    </table></div>`;
}

function renderHRInterviews() {
  return `
    <div class="section-header"><h3>Interview Schedule</h3><button class="btn-primary" onclick="openScheduleModal()"><i class="fas fa-calendar-plus"></i> Schedule Interview</button></div>
    ${[
      {name:'Rahul Sharma',role:'Asst Engineer',date:'Jul 10',time:'11:00 AM',panel:'Panel A',score:'78/100'},
      {name:'Priya Nair',role:'Research Officer',date:'Jul 11',time:'2:00 PM',panel:'Panel B',score:'82/100'},
      {name:'Meera Pillai',role:'Accounts Officer',date:'Jul 12',time:'10:00 AM',panel:'Panel A',score:'71/100'},
    ].map(i=>`
      <div class="interview-card">
        <div class="iv-avatar">${i.name.split(' ').map(n=>n[0]).join('')}</div>
        <div class="iv-info">
          <h4>${i.name} — ${i.role}</h4>
          <div class="iv-meta">
            <span><i class="fas fa-calendar"></i>${i.date}</span>
            <span><i class="fas fa-clock"></i>${i.time}</span>
            <span><i class="fas fa-users"></i>${i.panel}</span>
            <span><i class="fas fa-star"></i>Assessment: ${i.score}</span>
          </div>
        </div>
        <div class="iv-actions">
          <button class="btn-secondary" onclick="showToast('Interview details opened','')"><i class="fas fa-eye"></i> View</button>
          <button class="btn-primary" onclick="showToast('Joining interview room...','')"><i class="fas fa-video"></i> Join</button>
        </div>
      </div>`).join('')}`;
}

function renderHRHiring() {
  return `
    <div class="card">
      <div class="card-header"><i class="fas fa-trophy"></i><h4>Final Hiring Decisions</h4></div>
      <p style="font-size:0.85rem;color:var(--text-light);margin-bottom:16px">Review all stages and make the final offer. Candidates are ranked by composite score.</p>
      <table class="data-table">
        <thead><tr><th>Rank</th><th>Candidate</th><th>Role</th><th>Screening</th><th>Assessment</th><th>Interview</th><th>Total</th><th>Decision</th></tr></thead>
        <tbody>
          ${[{r:1,n:'Meera Pillai',role:'Accounts Officer',s:'✓',a:'88%',i:'9/10',t:'92%'},{r:2,n:'Rahul Sharma',role:'Asst Engineer',s:'✓',a:'78%',i:'8/10',t:'84%'},{r:3,n:'Priya Nair',role:'Research Officer',s:'✓',a:'82%',i:'7/10',t:'81%'}].map(c=>`
            <tr>
              <td><strong>#${c.r}</strong></td>
              <td>${c.n}</td><td>${c.role}</td><td style="color:var(--success)">✓ Eligible</td>
              <td>${c.a}</td><td>${c.i}</td>
              <td><strong style="color:var(--primary)">${c.t}</strong></td>
              <td class="actions">
                <button class="btn-success" style="font-size:0.78rem;padding:5px 10px" onclick="extendOffer('${c.n}')"><i class="fas fa-check"></i> Offer</button>
                <button class="btn-danger" style="font-size:0.78rem;padding:5px 10px" onclick="rejectCandidate('${c.n}')"><i class="fas fa-times"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderHRReports() {
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon sc-blue"><i class="fas fa-percent"></i></div><div class="stat-card-info"><span class="num">34%</span><span class="label">Offer Acceptance Rate</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-green"><i class="fas fa-clock"></i></div><div class="stat-card-info"><span class="num">18</span><span class="label">Avg Days to Hire</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-orange"><i class="fas fa-user-check"></i></div><div class="stat-card-info"><span class="num">60</span><span class="label">Positions Filled (YTD)</span></div></div>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-chart-bar"></i><h4>Recruitment Funnel</h4></div>
      ${[{l:'Applications Received',v:248,c:'var(--primary)'},{l:'Eligible After Screening',v:86,c:'#1565c0'},{l:'Cleared Assessment',v:54,c:'#0277bd'},{l:'Completed Interview',v:30,c:'var(--success)'},{l:'Offers Extended',v:7,c:'var(--accent)'}].map(f=>`
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.83rem">${f.l}</span><strong style="font-size:0.83rem">${f.v}</strong></div>
          <div style="background:var(--border);border-radius:4px;height:8px"><div style="background:${f.c};width:${Math.round(f.v/248*100)}%;height:100%;border-radius:4px;transition:width 0.6s"></div></div>
        </div>`).join('')}
    </div>`;
}

// ===== ADMIN DASHBOARD TABS =====
function showAdminTab(tab, el) {
  if (el) {
    document.querySelectorAll('#admin-dashboard .nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  const titles = { 'admin-overview':'Admin Dashboard','admin-users':'User Management','admin-roles':'Roles & Permissions','admin-reports':'Reports & Analytics','admin-settings':'System Settings','admin-audit':'Audit Logs' };
  document.getElementById('admin-page-title').textContent = titles[tab] || tab;
  const content = document.getElementById('admin-content');
  if (tab === 'admin-overview') content.innerHTML = renderAdminOverview();
  else if (tab === 'admin-users') content.innerHTML = renderAdminUsers();
  else if (tab === 'admin-reports') content.innerHTML = renderAdminReports();
  else if (tab === 'admin-settings') content.innerHTML = renderAdminSettings();
  else if (tab === 'admin-audit') content.innerHTML = renderAdminAudit();
  else content.innerHTML = `<div class="empty-state"><i class="fas fa-cog"></i><p>Section under construction</p></div>`;
}

function renderAdminOverview() {
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon sc-blue"><i class="fas fa-users"></i></div><div class="stat-card-info"><span class="num">1,248</span><span class="label">Total Candidates</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-purple"><i class="fas fa-user-tie"></i></div><div class="stat-card-info"><span class="num">14</span><span class="label">HR Managers</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-green"><i class="fas fa-user-check"></i></div><div class="stat-card-info"><span class="num">28</span><span class="label">Interviewers</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-orange"><i class="fas fa-briefcase"></i></div><div class="stat-card-info"><span class="num">8</span><span class="label">Active Drives</span></div></div>
    </div>
    <div class="quick-actions">
      ${[{i:'fa-user-plus',l:'Add User'},{i:'fa-briefcase',l:'New Drive'},{i:'fa-file-export',l:'Export Data'},{i:'fa-shield-alt',l:'Permissions'},{i:'fa-chart-pie',l:'Reports'},{i:'fa-cog',l:'Settings'}].map(q=>`
        <div class="qa-card" onclick="showToast('${q.l} opened','')"><div class="qa-icon"><i class="fas ${q.i}"></i></div><p>${q.l}</p></div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-history"></i><h4>Recent Activity</h4></div>
      <div class="timeline">
        ${[{t:'New HR user added: Kavita Menon',d:'Admin added a new HR Manager account',time:'10 mins ago'},{t:'Job posting published: Research Officer',d:'4 vacancies posted by HR Manager Rajan',time:'2 hours ago'},{t:'Assessment completed: Asst Engineer batch',d:'54 candidates cleared, 31 failed',time:'Yesterday'},{t:'System backup completed',d:'Automated daily backup successful',time:'Yesterday'}].map(a=>`
          <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h5>${a.t}</h5><p>${a.d}</p><div class="timeline-time">${a.time}</div></div></div>`).join('')}
      </div>
    </div>`;
}

function renderAdminUsers() {
  const users = [
    {name:'Kavita Menon',email:'kavita@air.gov.in',role:'HR',status:'active',joined:'Jun 1, 2026'},
    {name:'Rajan Verma',email:'rajan@air.gov.in',role:'HR',status:'active',joined:'May 15, 2026'},
    {name:'Dr. Suresh Iyer',email:'suresh@air.gov.in',role:'Interviewer',status:'active',joined:'May 20, 2026'},
    {name:'Anita Das',email:'anita@air.gov.in',role:'Interviewer',status:'inactive',joined:'Apr 10, 2026'},
    {name:'Admin User',email:'admin@air.gov.in',role:'Admin',status:'active',joined:'Jan 1, 2026'},
  ];
  const roleColors = { HR:'sc-blue', Interviewer:'sc-green', Admin:'sc-purple', Candidate:'sc-orange' };
  return `
    <div class="section-header"><h3>System Users</h3><button class="btn-primary" onclick="openAddUserModal()"><i class="fas fa-user-plus"></i> Add User</button></div>
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
      <tbody>
        ${users.map(u=>`<tr>
          <td><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;font-size:0.72rem;font-weight:700;display:flex;align-items:center;justify-content:center">${u.name.split(' ').map(n=>n[0]).join('')}</div><strong>${u.name}</strong></div></td>
          <td>${u.email}</td>
          <td><span class="pill pill-${u.role==='HR'?'assessment':u.role==='Admin'?'screening':'interview'}">${u.role}</span></td>
          <td><span class="pill pill-${u.status==='active'?'active':'rejected'}">${u.status}</span></td>
          <td>${u.joined}</td>
          <td class="actions"><button class="btn-secondary" onclick="showToast('Editing ${u.name}','')"><i class="fas fa-edit"></i></button><button class="btn-danger" style="font-size:0.78rem;padding:5px 10px" onclick="showToast('${u.name} deactivated','warning')"><i class="fas fa-ban"></i></button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderAdminReports() {
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon sc-blue"><i class="fas fa-file-alt"></i></div><div class="stat-card-info"><span class="num">1,248</span><span class="label">Total Applications</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-green"><i class="fas fa-trophy"></i></div><div class="stat-card-info"><span class="num">60</span><span class="label">Hired (YTD)</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-orange"><i class="fas fa-clock"></i></div><div class="stat-card-info"><span class="num">18 days</span><span class="label">Avg Time to Hire</span></div></div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <button class="btn-secondary" onclick="showToast('PDF report exported','success')"><i class="fas fa-file-pdf"></i> Export PDF</button>
      <button class="btn-secondary" onclick="showToast('Excel report exported','success')"><i class="fas fa-file-excel"></i> Export Excel</button>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-chart-bar"></i><h4>Monthly Application Trend</h4></div>
      <div class="bar-chart-wrap">
        <div class="bar-chart">
          ${[{l:'Feb',v:30},{l:'Mar',v:45},{l:'Apr',v:55},{l:'May',v:80},{l:'Jun',v:95},{l:'Jul',v:70}].map(b=>`<div style="display:flex;flex-direction:column;align-items:center;flex:1"><div class="bar" style="height:${b.v}%" title="${b.l}: ${b.v} applications"></div><div class="bar-label">${b.l}</div></div>`).join('')}
        </div>
      </div>
    </div>`;
}

function renderAdminSettings() {
  return `
    <div class="form-section">
      <h4><i class="fas fa-globe" style="margin-right:8px;color:var(--primary)"></i>General Settings</h4>
      <div class="form-grid">
        <div class="form-group"><label>Portal Name</label><input type="text" value="AIR Recruitment Portal"/></div>
        <div class="form-group"><label>Organization</label><input type="text" value="All India Radio, New Delhi"/></div>
        <div class="form-group"><label>Contact Email</label><input type="email" value="recruitment@air.gov.in"/></div>
        <div class="form-group"><label>Help Desk Phone</label><input type="tel" value="+91-11-2342XXXX"/></div>
      </div>
    </div>
    <div class="form-section">
      <h4><i class="fas fa-envelope" style="margin-right:8px;color:var(--primary)"></i>Notification Settings</h4>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${['Email notifications to candidates','SMS alerts for interview schedule','Show rejection reason to candidates','Auto-notify on assessment completion'].map(s=>`
          <label style="display:flex;align-items:center;gap:10px;font-size:0.88rem;cursor:pointer"><input type="checkbox" checked style="width:16px;height:16px;accent-color:var(--primary)"/>${s}</label>`).join('')}
      </div>
    </div>
    <button class="btn-primary" onclick="showToast('Settings saved successfully','success')"><i class="fas fa-save"></i> Save Settings</button>`;
}

function renderAdminAudit() {
  const logs = [
    {user:'Admin',action:'Added user Kavita Menon (HR)',time:'Jul 2, 2026 · 09:15 AM',type:'user'},
    {user:'HR · Rajan',action:'Published job: Research Officer (4 vacancies)',time:'Jul 2, 2026 · 08:42 AM',type:'job'},
    {user:'System',action:'Auto-screening completed: 85 applications processed',time:'Jul 1, 2026 · 11:30 PM',type:'system'},
    {user:'HR · Kavita',action:'Interview scheduled for Rahul Sharma on Jul 10',time:'Jul 1, 2026 · 05:10 PM',type:'interview'},
    {user:'Admin',action:'System settings updated: rejection reason display enabled',time:'Jun 30, 2026 · 3:22 PM',type:'settings'},
  ];
  const typeIcons = {user:'fa-user',job:'fa-briefcase',system:'fa-cog',interview:'fa-video',settings:'fa-sliders-h'};
  const typeColors = {user:'sc-blue',job:'sc-orange',system:'sc-purple',interview:'sc-green',settings:'sc-teal'};
  return `
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>User</th><th>Action</th><th>Timestamp</th><th>Type</th></tr></thead>
      <tbody>
        ${logs.map(l=>`<tr>
          <td><strong>${l.user}</strong></td>
          <td>${l.action}</td>
          <td style="color:var(--text-light);font-size:0.8rem">${l.time}</td>
          <td><div class="stat-card-icon ${typeColors[l.type]}" style="width:28px;height:28px;font-size:0.75rem;border-radius:6px"><i class="fas ${typeIcons[l.type]}"></i></div></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

// ===== INTERVIEWER DASHBOARD TABS =====
function showIVTab(tab, el) {
  if (el) {
    document.querySelectorAll('#interviewer-dashboard .nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  const titles = { 'iv-overview':'Dashboard','iv-schedule':'My Schedule','iv-candidates':'Candidates','iv-feedback':'Feedback' };
  document.getElementById('iv-page-title').textContent = titles[tab] || tab;
  const content = document.getElementById('iv-content');
  if (tab === 'iv-overview') content.innerHTML = renderIVOverview();
  else if (tab === 'iv-schedule') content.innerHTML = renderIVSchedule();
  else if (tab === 'iv-candidates') content.innerHTML = renderIVCandidates();
  else if (tab === 'iv-feedback') content.innerHTML = renderIVFeedback();
}

function renderIVOverview() {
  return `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon sc-orange"><i class="fas fa-calendar"></i></div><div class="stat-card-info"><span class="num">2</span><span class="label">Today's Interviews</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-blue"><i class="fas fa-users"></i></div><div class="stat-card-info"><span class="num">8</span><span class="label">Assigned Candidates</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-green"><i class="fas fa-star"></i></div><div class="stat-card-info"><span class="num">5</span><span class="label">Feedback Submitted</span></div></div>
      <div class="stat-card"><div class="stat-card-icon sc-red"><i class="fas fa-exclamation-circle"></i></div><div class="stat-card-info"><span class="num">3</span><span class="label">Feedback Pending</span></div></div>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-clock"></i><h4>Today's Schedule</h4></div>
      ${[{name:'Rahul Sharma',role:'Asst Engineer',time:'11:00 AM',dur:'1 hr'},{name:'Priya Nair',role:'Research Officer',time:'2:00 PM',dur:'45 min'}].map(i=>`
        <div class="interview-card" style="margin-bottom:10px">
          <div class="iv-avatar">${i.name.split(' ').map(n=>n[0]).join('')}</div>
          <div class="iv-info"><h4>${i.name}</h4><div class="iv-meta"><span><i class="fas fa-briefcase"></i>${i.role}</span><span><i class="fas fa-clock"></i>${i.time} · ${i.dur}</span></div></div>
          <div class="iv-actions">
            <button class="btn-primary" onclick="joinInterview()"><i class="fas fa-video"></i> Join</button>
            <button class="btn-secondary" onclick="openFeedbackModal('${i.name}')"><i class="fas fa-star"></i></button>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderIVSchedule() {
  return `
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>Candidate</th><th>Role</th><th>Date</th><th>Time</th><th>Mode</th><th>Feedback</th><th>Actions</th></tr></thead>
      <tbody>
        ${[{n:'Rahul Sharma',r:'Asst Engineer',d:'Jul 10',t:'11:00 AM',m:'Video',f:'pending'},{n:'Priya Nair',r:'Research Officer',d:'Jul 11',t:'2:00 PM',m:'Video',f:'pending'},{n:'Meera Pillai',r:'Accounts Officer',d:'Jul 12',t:'10:00 AM',m:'Video',f:'submitted'},{n:'Amit Kumar',r:'Prog Executive',d:'Jul 8',t:'3:00 PM',m:'Video',f:'submitted'}].map(i=>`
          <tr>
            <td><strong>${i.n}</strong></td><td>${i.r}</td><td>${i.d}</td><td>${i.t}</td><td><span class="pill pill-assessment"><i class="fas fa-video" style="margin-right:4px"></i>${i.m}</span></td>
            <td><span class="pill pill-${i.f==='pending'?'pending':'selected'}">${i.f.charAt(0).toUpperCase()+i.f.slice(1)}</span></td>
            <td class="actions">
              <button class="btn-primary" onclick="joinInterview()"><i class="fas fa-video"></i> Join</button>
              ${i.f==='pending'?`<button class="btn-secondary" onclick="openFeedbackModal('${i.n}')"><i class="fas fa-star"></i> Rate</button>`:''}
            </td>
          </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderIVCandidates() {
  return `
    <div class="search-filter-bar"><div class="search-box"><i class="fas fa-search"></i><input type="text" placeholder="Search candidates..."/></div></div>
    <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead><tr><th>Candidate</th><th>Applied For</th><th>Assessment Score</th><th>Interview Date</th><th>Profile</th></tr></thead>
      <tbody>
        ${[{n:'Rahul Sharma',r:'Asst Engineer',score:'78%',date:'Jul 10'},{n:'Priya Nair',r:'Research Officer',score:'82%',date:'Jul 11'},{n:'Meera Pillai',r:'Accounts Officer',score:'71%',date:'Jul 12'}].map(c=>`
          <tr>
            <td><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center">${c.n.split(' ').map(n=>n[0]).join('')}</div>${c.n}</div></td>
            <td>${c.r}</td><td><strong style="color:var(--primary)">${c.score}</strong></td><td>${c.date}</td>
            <td><button class="btn-secondary" onclick="viewCandidateProfile('${c.n}')"><i class="fas fa-eye"></i> View</button></td>
          </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function renderIVFeedback() {
  return `
    <div class="card">
      <div class="card-header"><i class="fas fa-star"></i><h4>Submitted Feedback</h4></div>
      ${[{n:'Meera Pillai',r:'Accounts Officer',rating:4,comment:'Strong financial knowledge, clear communication. Recommended for selection.'},{n:'Amit Kumar',r:'Prog Executive',rating:3,comment:'Good content knowledge, slightly nervous. May need onboarding support.'}].map(f=>`
        <div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <div><strong>${f.n}</strong><span style="color:var(--text-light);font-size:0.82rem;margin-left:8px">· ${f.r}</span></div>
            <div class="star-rating">${[1,2,3,4,5].map(s=>`<i class="fas fa-star ${s<=f.rating?'':'empty'}"></i>`).join('')}</div>
          </div>
          <p style="font-size:0.85rem;color:var(--text-light);line-height:1.5">${f.comment}</p>
        </div>`).join('')}
    </div>
    <button class="btn-primary" onclick="openFeedbackModal('New Candidate')"><i class="fas fa-plus"></i> Add New Feedback</button>`;
}

// ===== MODALS =====
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function openPostJobModal() {
  openModal(`
    <h3><i class="fas fa-briefcase" style="color:var(--primary);margin-right:8px"></i>Post New Job</h3>
    <div class="modal-field"><label>Job Title</label><input type="text" placeholder="e.g. Assistant Engineer (Transmission)"/></div>
    <div class="modal-field"><label>Department</label><input type="text" placeholder="Department name"/></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="modal-field"><label>Vacancies</label><input type="number" placeholder="No. of posts"/></div>
      <div class="modal-field"><label>Job Type</label><select><option>Technical</option><option>Editorial</option><option>Administrative</option></select></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="modal-field"><label>Last Date</label><input type="date"/></div>
      <div class="modal-field"><label>Location</label><input type="text" value="New Delhi"/></div>
    </div>
    <div class="modal-field"><label>Eligibility Criteria</label><textarea placeholder="Minimum education, experience, age limit, skills..."></textarea></div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="closeModal();showToast('Job posted successfully','success')"><i class="fas fa-paper-plane"></i> Publish</button>
    </div>`);
}

function openScheduleModal() {
  openModal(`
    <h3><i class="fas fa-calendar-plus" style="color:var(--primary);margin-right:8px"></i>Schedule Interview</h3>
    <div class="modal-field"><label>Candidate</label><select><option>Rahul Sharma</option><option>Priya Nair</option><option>Meera Pillai</option></select></div>
    <div class="modal-field"><label>Job Role</label><select>${jobs.map(j=>`<option>${j.title}</option>`).join('')}</select></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="modal-field"><label>Date</label><input type="date"/></div>
      <div class="modal-field"><label>Time</label><input type="time"/></div>
    </div>
    <div class="modal-field"><label>Interviewer Panel</label><select><option>Panel A – Dr. Suresh Iyer</option><option>Panel B – Anita Das</option></select></div>
    <div class="modal-field"><label>Mode</label><select><option>Virtual (Video Call)</option><option>In-Person</option></select></div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="closeModal();showToast('Interview scheduled and candidate notified','success')"><i class="fas fa-calendar-check"></i> Schedule</button>
    </div>`);
}

function openAddUserModal() {
  openModal(`
    <h3><i class="fas fa-user-plus" style="color:var(--primary);margin-right:8px"></i>Add New User</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="modal-field"><label>First Name</label><input type="text" placeholder="First name"/></div>
      <div class="modal-field"><label>Last Name</label><input type="text" placeholder="Last name"/></div>
    </div>
    <div class="modal-field"><label>Official Email</label><input type="email" placeholder="user@air.gov.in"/></div>
    <div class="modal-field"><label>Role</label><select><option>HR</option><option>Interviewer</option><option>Admin</option></select></div>
    <div class="modal-field"><label>Department</label><input type="text" placeholder="Department"/></div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="closeModal();showToast('User added and credentials sent via email','success')"><i class="fas fa-user-plus"></i> Add User</button>
    </div>`);
}

function openFeedbackModal(name) {
  let rating = 0;
  openModal(`
    <h3><i class="fas fa-star" style="color:var(--accent);margin-right:8px"></i>Submit Feedback – ${name}</h3>
    <div class="modal-field"><label>Overall Rating</label>
      <div class="star-rating" id="modal-stars" style="font-size:1.4rem;gap:6px">
        ${[1,2,3,4,5].map(s=>`<i class="fas fa-star empty" id="star-${s}" onmouseover="hoverStars(${s})" onmouseout="resetStars()" onclick="setRating(${s})"></i>`).join('')}
      </div>
    </div>
    <div class="modal-field"><label>Technical Skills</label><select><option>Excellent</option><option>Good</option><option>Average</option><option>Below Average</option></select></div>
    <div class="modal-field"><label>Communication</label><select><option>Excellent</option><option>Good</option><option>Average</option><option>Below Average</option></select></div>
    <div class="modal-field"><label>Recommendation</label><select><option>Strongly Recommend</option><option>Recommend</option><option>Neutral</option><option>Not Recommended</option></select></div>
    <div class="modal-field"><label>Detailed Comments</label><textarea placeholder="Share your observations about the candidate..."></textarea></div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="closeModal();showToast('Feedback submitted for ${name}','success')"><i class="fas fa-paper-plane"></i> Submit Feedback</button>
    </div>`);
}

function hoverStars(n) { for(let i=1;i<=5;i++) { const s=document.getElementById('star-'+i); if(s){s.style.color=i<=n?'#ffc107':'var(--border)';} } }
function resetStars() { for(let i=1;i<=5;i++) { const s=document.getElementById('star-'+i); if(s){s.style.color='var(--border)';} } }
function setRating(n) { for(let i=1;i<=5;i++) { const s=document.getElementById('star-'+i); if(s){s.style.color=i<=n?'#ffc107':'var(--border)';} } }

function viewApplication(id) { openModal(`<h3>Application – ${id}</h3><p style="color:var(--text-light);font-size:0.88rem;margin-bottom:16px">Detailed application view for ID: ${id}</p><div class="modal-actions"><button class="btn-primary" onclick="closeModal()">Close</button></div>`); }
function viewCandidateProfile(name) { openModal(`<h3><i class="fas fa-user-circle" style="color:var(--primary);margin-right:8px"></i>${name}</h3><p style="color:var(--text-light);font-size:0.88rem;margin-bottom:16px">Full candidate profile with resume, education, and experience details.</p><div class="modal-actions"><button class="btn-success" onclick="closeModal();showToast('Candidate moved to next stage','success')"><i class="fas fa-arrow-right"></i> Move to Next Stage</button><button class="btn-danger" style="margin-left:8px" onclick="rejectCandidate('${name}');closeModal()"><i class="fas fa-times"></i> Reject</button></div>`); }
function moveCandidate(name) { showToast(`${name} moved to the next stage`, 'success'); }
function rejectCandidate(name) { showToast(`${name}'s application marked as rejected`, 'error'); }
function extendOffer(name) { showToast(`Offer letter sent to ${name}`, 'success'); }
function joinInterview() { showToast('Redirecting to video conference room...', ''); }
function startAssessment() { showToast('Opening assessment in a new window...', ''); }
function markAllRead() { document.querySelectorAll('.notif-item').forEach(n => n.classList.remove('unread')); showToast('All notifications marked as read', 'success'); }

// ===== TOAST =====
function showToast(msg, type='') {
  const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', '':'fa-info-circle' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]||'fa-info-circle'}"></i>${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(40px)'; toast.style.transition='all 0.3s'; setTimeout(()=>toast.remove(), 300); }, 3000);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start.toLocaleString();
      if (start >= target) clearInterval(timer);
    }, 20);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderJobs();
  animateCounters();
});

// ===== LANGUAGE / i18n =====
let currentLang = 'en';

const translations = {
  en: {
    // Navbar
    nav_home: 'Home',
    nav_about: 'About',
    nav_vacancies: 'Vacancies',
    nav_login: 'Login',
    nav_apply: 'Apply Now',
    // Hero
    hero_badge: 'Government of India',
    hero_title: 'Shape the Voice of India',
    hero_desc: 'Join All India Radio – the largest radio network in the world. Build your career in public broadcasting with purpose and impact.',
    hero_btn_apply: 'Start Application',
    hero_btn_vacancies: 'View Vacancies',
    stat_positions: 'Open Positions',
    stat_applications: 'Applications This Year',
    stat_stations: 'Stations Nationwide',
    // Process
    process_title: 'How It Works',
    process_sub: 'A transparent, end-to-end digital recruitment journey',
    step1_title: 'Apply',
    step1_desc: 'Submit your application online with required documents',
    step2_title: 'Screening',
    step2_desc: 'Automated eligibility check based on job criteria',
    step3_title: 'Assessment',
    step3_desc: 'Online aptitude and technical evaluation',
    step4_title: 'Interview',
    step4_desc: 'Virtual interview with panel review',
    step5_title: 'Selection',
    step5_desc: 'Final decision with status update on your dashboard',
    // Jobs
    jobs_title: 'Current Vacancies',
    jobs_sub: 'Explore open positions across All India Radio',
    filter_all: 'All Roles',
    filter_technical: 'Technical',
    filter_editorial: 'Editorial',
    filter_admin: 'Administrative',
    // Login
    login_welcome: 'Welcome Back',
    login_sub: 'Sign in to your account',
    login_email: 'Email / User ID',
    login_email_ph: 'Enter your email',
    login_password: 'Password',
    login_pwd_ph: 'Enter password',
    login_remember: 'Remember me',
    login_forgot: 'Forgot Password?',
    login_btn: 'Sign In',
    login_new_candidate: 'New candidate?',
    login_create_account: 'Create Account',
    // Register
    reg_title: 'Create Account',
    reg_sub: 'Register as a new candidate',
    reg_btn: 'Register',
    reg_already: 'Already registered?',
    reg_login_link: 'Login here',
    btn_back: 'Back',
  },
  hi: {
    // Navbar
    nav_home: 'होम',
    nav_about: 'हमारे बारे में',
    nav_vacancies: 'रिक्तियाँ',
    nav_login: 'लॉगिन',
    nav_apply: 'आवेदन करें',
    // Hero
    hero_badge: 'भारत सरकार',
    hero_title: 'भारत की आवाज़ को आकार दें',
    hero_desc: 'ऑल इंडिया रेडियो से जुड़ें – विश्व का सबसे बड़ा रेडियो नेटवर्क। सार्वजनिक प्रसारण में अपना करियर बनाएं।',
    hero_btn_apply: 'आवेदन शुरू करें',
    hero_btn_vacancies: 'रिक्तियाँ देखें',
    stat_positions: 'खुले पद',
    stat_applications: 'इस वर्ष आवेदन',
    stat_stations: 'देशभर के स्टेशन',
    // Process
    process_title: 'यह कैसे काम करता है',
    process_sub: 'एक पारदर्शी, पूर्णतः डिजिटल भर्ती प्रक्रिया',
    step1_title: 'आवेदन करें',
    step1_desc: 'आवश्यक दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा करें',
    step2_title: 'स्क्रीनिंग',
    step2_desc: 'नौकरी मानदंडों के आधार पर स्वचालित पात्रता जाँच',
    step3_title: 'मूल्यांकन',
    step3_desc: 'ऑनलाइन अभिरुचि और तकनीकी परीक्षा',
    step4_title: 'साक्षात्कार',
    step4_desc: 'पैनल समीक्षा के साथ वर्चुअल साक्षात्कार',
    step5_title: 'चयन',
    step5_desc: 'अंतिम निर्णय और डैशबोर्ड पर स्थिति अपडेट',
    // Jobs
    jobs_title: 'वर्तमान रिक्तियाँ',
    jobs_sub: 'ऑल इंडिया रेडियो में खुले पदों का अन्वेषण करें',
    filter_all: 'सभी पद',
    filter_technical: 'तकनीकी',
    filter_editorial: 'संपादकीय',
    filter_admin: 'प्रशासनिक',
    // Login
    login_welcome: 'वापस स्वागत है',
    login_sub: 'अपने खाते में साइन इन करें',
    login_email: 'ईमेल / यूज़र आईडी',
    login_email_ph: 'अपना ईमेल दर्ज करें',
    login_password: 'पासवर्ड',
    login_pwd_ph: 'पासवर्ड दर्ज करें',
    login_remember: 'मुझे याद रखें',
    login_forgot: 'पासवर्ड भूल गए?',
    login_btn: 'साइन इन करें',
    login_new_candidate: 'नए उम्मीदवार?',
    login_create_account: 'खाता बनाएं',
    // Register
    reg_title: 'खाता बनाएं',
    reg_sub: 'नए उम्मीदवार के रूप में पंजीकरण करें',
    reg_btn: 'पंजीकरण करें',
    reg_already: 'पहले से पंजीकृत हैं?',
    reg_login_link: 'यहाँ लॉगिन करें',
    btn_back: 'वापस',
  }
};

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  applyLanguage();
}

function applyLanguage() {
  const t = translations[currentLang];
  const isHindi = currentLang === 'hi';

  // Update lang-btn label
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = isHindi ? '🌐 English' : '🌐 हिंदी';

  // Update all data-i18n elements (text content)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      // Preserve child elements (like <a> tags) — only update text nodes
      if (el.children.length === 0) {
        el.textContent = t[key];
      } else {
        // For elements with mixed content (text + children), update carefully
        el.childNodes.forEach(node => {
          if (node.nodeType === 3 /* TEXT_NODE */ && node.textContent.trim()) {
            // Replace only the main text chunk
            node.textContent = t[key] + ' ';
          }
        });
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Update page title
  document.title = isHindi
    ? 'AIR भर्ती पोर्टल – ऑल इंडिया रेडियो'
    : 'AIR Recruitment Portal – All India Radio';

  // Re-render jobs to update badge text and button labels
  renderJobs();
}
