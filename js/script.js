
const loadState = () => {
    const fallbackState = {
        currentUser: null,
        users: [],
        directives: [
            { id: 1, sender: "Gasaka Central Office", text: "New curriculum synchronization guidelines committed for Q3.", timestamp: "2026-07-15" }
        ],
        logs: [
            { id: 101, instructor: "Jean Claude", facility: "Munazi Primary", category: "Infrastructure Deficit", description: "Roofing structural integrity compromised in Block B.", artifact: "http://docs.com/munazi-b.pdf", status: "Pending Verification" },
            { id: 102, instructor: "Marie Claire", facility: "Gasaka Primary", category: "Shortage of Teaching Materials", description: "P4 Mathematics textbook allocation missing 40 copies.", artifact: "", status: "Verified & Escalated" }
        ]
    };
    const saved = localStorage.getItem('edu_rural_state');
    return saved ? JSON.parse(saved) : fallbackState;
};

const saveState = (state) => {
    localStorage.setItem('edu_rural_state', JSON.stringify(state));
};

let appState = loadState();


document.addEventListener('DOMContentLoaded', () => {
    
    if (document.getElementById('regTargetRole') || document.getElementById('registrationForm')) {
        initiateRegistrationWizardHooks();
    }
    
 
    if (document.getElementById('loginForm')) {
        initiateLoginHooks();
    }
    
  
    if (document.getElementById('passwordResetForm')) {
        initiateResetHooks();
    }
    
   
    if (document.getElementById('sidebarName')) {
        initiateDashboardWorkspace();
    }
});


function initiateRegistrationWizardHooks() {
    const roleSelect = document.getElementById('regTargetRole');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const role = this.value;
            document.getElementById('conditional-teacher-fields').style.display = (role === 'teacher') ? 'block' : 'none';
            document.getElementById('conditional-authority-fields').style.display = (role === 'highauthority') ? 'block' : 'none';
        });
    }

    const nextBtn = document.getElementById('btnNextStep');
    if (nextBtn) {
        nextBtn.onclick = function(e) {
            e.preventDefault();
            document.getElementById('reg-step-1').style.display = 'none';
            document.getElementById('reg-step-2').style.display = 'block';
            const alertBox = document.getElementById('regAlert');
            if (alertBox) alertBox.style.display = 'none';
        };
    }

    const prevBtn = document.getElementById('btnPrevStep');
    if (prevBtn) {
        prevBtn.onclick = function(e) {
            e.preventDefault();
            document.getElementById('reg-step-2').style.display = 'none';
            document.getElementById('reg-step-1').style.display = 'block';
        };
    }

    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const role = document.getElementById('regTargetRole').value;
            const email = document.getElementById('attrEmail').value;
            
            const newUser = {
                role: role,
                name: document.getElementById('attrName').value,
                phone: document.getElementById('attrPhone').value,
                email: email,
                age: document.getElementById('attrAge').value,
                exp: document.getElementById('attrExp').value,
                residence: document.getElementById('attrResidence').value,
                nationality: document.getElementById('attrNationality').value,
                nationalID: document.getElementById('attrID').value,
                photo: document.getElementById('attrPhoto').value,
                password: document.getElementById('attrPassword').value,
                subject: role === 'teacher' ? document.getElementById('attrSubject').value : '',
                school: role === 'teacher' ? document.getElementById('attrSchool').value : '',
                jurisdictionType: role === 'highauthority' ? document.getElementById('attrJurisdictionType').value : '',
                jurisdictionName: role === 'highauthority' ? document.getElementById('attrJurisdictionName').value : ''
            };

            appState.users.push(newUser);
            saveState(appState);
            alert("Account record persisted successfully. Redirecting to sign in page.");
            window.location.href = './login.html';
        });
    }
}


function initiateLoginHooks() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('logEmail').value;
            const password = document.getElementById('logPassword').value;
            const alertBox = document.getElementById('loginAlert');

            const matchedUser = appState.users.find(u => u.email === email && u.password === password);

            if (matchedUser) {
                appState.currentUser = matchedUser;
                saveState(appState);
                if (alertBox) alertBox.style.display = 'none';
                window.location.href = './dashboard.html';
            } else {
                if (alertBox) {
                    alertBox.textContent = "Gateway authentication failed: Invalid token credentials.";
                    alertBox.style.display = 'block';
                }
            }
        });
    }
}


function initiateResetHooks() {
    const channelSelect = document.getElementById('resetChannel');
    if (channelSelect) {
        channelSelect.addEventListener('change', function() {
            const label = document.getElementById('lblRecoveryInput');
            const input = document.getElementById('recoveryTarget');
            if (this.value === 'email') {
                label.textContent = "Account Email Coordinates";
                input.placeholder = "name@domain.com";
                input.type = "email";
            } else {
                label.textContent = "Configured Mobile Node";
                input.placeholder = "e.g., +250...";
                input.type = "text";
            }
        });
    }

    const resetForm = document.getElementById('passwordResetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const channel = document.getElementById('resetChannel').value;
            const target = document.getElementById('recoveryTarget').value;
            const newPassword = document.getElementById('recoveryNewPassword').value;

            const matchedUser = appState.users.find(u => channel === 'email' ? u.email === target : u.phone === target);

            if (matchedUser) {
                matchedUser.password = newPassword;
                saveState(appState);
                alert("Decryption token updated instantly inside system records.");
                window.location.href = './login.html';
            } else {
                alert("Target coordinates map no active system node.");
            }
        });
    }
}


function initiateDashboardWorkspace() {
    if (!appState.currentUser) {
        alert("No active session located. Redirecting to terminal gateway.");
        window.location.href = './login.html';
        return;
    }

    document.getElementById('sidebarName').textContent = appState.currentUser.name;
    document.getElementById('sidebarRoleBadge').textContent = appState.currentUser.role.toUpperCase();
    
    document.getElementById('btnForceDisconnect').addEventListener('click', () => {
        appState.currentUser = null;
        saveState(appState);
        window.location.href = './index.html';
    });

    if (appState.currentUser.role === 'teacher') {
        document.getElementById('workspace-teacher').style.display = 'block';
        document.getElementById('teacherLogForm').addEventListener('submit', handleTeacherReportSubmission);
        renderTeacherDashboard();
    } else if (appState.currentUser.role === 'headteacher') {
        document.getElementById('workspace-headteacher').style.display = 'block';
        document.getElementById('headteacherDirectiveForm').addEventListener('submit', handleDirectiveEmission);
        renderHeadTeacherDashboard();
    } else if (appState.currentUser.role === 'highauthority') {
        document.getElementById('workspace-highauthority').style.display = 'block';
        document.getElementById('authoritySearch').addEventListener('input', filterAuthorityLedger);
        renderAuthorityDashboard();
    }

    renderPublicFeed();
    renderProfileAttributes();
}

function navigateTab(tabId) {
    document.querySelectorAll('.tab-panel-block').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).style.display = 'block';
    document.getElementById(`menu-${tabId}`).classList.add('active');
}

function renderTeacherDashboard() {
    const feed = document.getElementById('teacherAnnouncementsFeed');
    if (feed) {
        feed.innerHTML = appState.directives.map(d => `
            <div class="announcement-box authority">
                <div class="announcement-header">
                    <span>Origin: ${d.sender}</span>
                    <span>${d.timestamp}</span>
                </div>
                <p style="font-size:0.875rem; color:var(--dark);">${d.text}</p>
            </div>
        `).join('');
    }

    const tableBody = document.getElementById('teacherLogsTableBody');
    if (tableBody) {
        const myLogs = appState.logs.filter(l => l.instructor === appState.currentUser.name);
        tableBody.innerHTML = myLogs.length ? myLogs.map(l => `
            <tr>
                <td><b>${l.category}</b></td>
                <td>${l.description}</td>
                <td>${l.artifact ? `<a href="${l.artifact}" target="_blank">View File</a>` : 'None'}</td>
                <td><span class="badge ${l.status.includes('Verified') ? 'badge-success' : 'badge-info'}">${l.status}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="4" style="text-align:center; color:#64748b;">No items committed to local pipeline.</td></tr>`;
    }
}

function handleTeacherReportSubmission(event) {
    event.preventDefault();
    const newLog = {
        id: Date.now(),
        instructor: appState.currentUser.name,
        facility: appState.currentUser.school || "Assigned Facility",
        category: document.getElementById('newReportCat').value,
        description: document.getElementById('newReportDesc').value,
        artifact: document.getElementById('newReportFile').value,
        status: "Pending Verification"
    };
    appState.logs.push(newLog);
    saveState(appState);
    alert("Infrastructure deficit committed to pipeline securely.");
    event.target.reset();
    renderTeacherDashboard();
}

function renderHeadTeacherDashboard() {
    const tableBody = document.getElementById('headteacherReviewTableBody');
    if (tableBody) {
        const pendingLogs = appState.logs.filter(l => l.status === "Pending Verification");
        tableBody.innerHTML = pendingLogs.length ? pendingLogs.map(l => `
            <tr>
                <td>${l.instructor} (${l.facility})</td>
                <td><b>${l.category}</b></td>
                <td>${l.description}</td>
                <td>${l.artifact ? `<a href="${l.artifact}" target="_blank">Link</a>` : 'None'}</td>
                <td>
                    <button class="btn-primary-action" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="escalateLogItem(${l.id})">Verify & Escalate</button>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="text-align:center; color:#64748b;">No pending instructor infrastructure lines to verify.</td></tr>`;
    }
}

function escalateLogItem(logId) {
    const log = appState.logs.find(l => l.id === logId);
    if (log) {
        log.status = "Verified & Escalated";
        saveState(appState);
        alert("Log row validated against local parameters and synced to sub-district ledger.");
        renderHeadTeacherDashboard();
        renderPublicFeed();
    }
}

function handleDirectiveEmission(event) {
    event.preventDefault();
    const text = document.getElementById('newDirectiveText').value;
    appState.directives.unshift({
        id: Date.now(),
        sender: appState.currentUser.name,
        text: text,
        timestamp: new Date().toISOString().split('T')[0]
    });
    saveState(appState);
    alert("Directive successfully broadcast to local campus screen terminals.");
    event.target.reset();
    renderHeadTeacherDashboard();
}

function renderAuthorityDashboard(filterText = "") {
    const tableBody = document.getElementById('authorityLedgerTableBody');
    if (!tableBody) return;
    let items = appState.logs.filter(l => l.status === "Verified & Escalated");

    if (filterText) {
        items = items.filter(l => l.facility.toLowerCase().includes(filterText.toLowerCase()) || l.category.toLowerCase().includes(filterText.toLowerCase()));
    }

    tableBody.innerHTML = items.length ? items.map(l => `
        <tr>
            <td><b>${l.facility}</b></td>
            <td>${l.category}</td>
            <td>${l.description}</td>
            <td>${l.id}</td>
            <td><span class="badge badge-success">${l.status}</span></td>
        </tr>
    `).join('') : `<tr><td colspan="5" style="text-align:center; color:#64748b;">No infrastructure lines match filter criteria.</td></tr>`;
}

function filterAuthorityLedger() {
    const text = document.getElementById('authoritySearch').value;
    renderAuthorityDashboard(text);
}

function renderPublicFeed() {
    const container = document.getElementById('publicMediaFeed');
    if (!container) return;
    const verifiedItems = appState.logs.filter(l => l.status === "Verified & Escalated");

    container.innerHTML = verifiedItems.map(l => `
        <div class="media-card">
            <div class="media-body">
                <div class="media-meta">Verified Operational Update • ${l.facility}</div>
                <h4 style="font-size:1rem; margin-bottom:0.5rem; color:var(--primary);">${l.category}</h4>
                <p style="font-size:0.85rem; color:#475569;">${l.description}</p>
            </div>
            <div class="media-footer">
                <span style="font-size:0.7rem; font-weight:700; color:var(--success);">STATUS: PUBLIC RESOLUTION LOOP</span>
                <div style="display:flex; gap:0.35rem;">
                    <button class="social-share-btn" onclick="alert('Shared via Meta pipeline.')">FB</button>
                    <button class="social-share-btn twitter" onclick="alert('Shared via X framework.')">X</button>
                    <button class="social-share-btn whatsapp" onclick="alert('Shared via secure Mobile link.')">WA</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProfileAttributes() {
    const container = document.getElementById('profileAttributesDisplay');
    if (!container) return;
    const u = appState.currentUser;
    
    let htmlData = `
        <div><label>Full Legal Name</label><p style="padding:0.5rem 0; font-weight:600;">${u.name}</p></div>
        <div><label>Account Coordinate Email</label><p style="padding:0.5rem 0; font-weight:600;">${u.email}</p></div>
        <div><label>Mobile Node Address</label><p style="padding:0.5rem 0; font-weight:600;">${u.phone}</p></div>
        <div><label>Age Metric</label><p style="padding:0.5rem 0; font-weight:600;">${u.age} Years</p></div>
        <div><label>Field Experience Matrix</label><p style="padding:0.5rem 0; font-weight:600;">${u.exp} Years</p></div>
        <div><label>Territory Residence</label><p style="padding:0.5rem 0; font-weight:600;">${u.residence}</p></div>
        <div><label>National Key Identity String</label><p style="padding:0.5rem 0; font-weight:600;">${u.nationalID}</p></div>
        <div><label>Nationality Origin</label><p style="padding:0.5rem 0; font-weight:600;">${u.nationality}</p></div>
    `;

    if (u.role === 'teacher') {
        htmlData += `
            <div><label>Specialized Subject</label><p style="padding:0.5rem 0; font-weight:600;">${u.subject || 'N/A'}</p></div>
            <div><label>Active Managed Facility</label><p style="padding:0.5rem 0; font-weight:600;">${u.school || 'N/A'}</p></div>
        `;
    } else if (u.role === 'highauthority') {
        htmlData += `
            <div><label>Jurisdiction Level</label><p style="padding:0.5rem 0; font-weight:600;">${u.jurisdictionType || 'N/A'}</p></div>
            <div><label>Territory Assignment Name</label><p style="padding:0.5rem 0; font-weight:600;">${u.jurisdictionName || 'N/A'}</p></div>
        `;
    }

    container.innerHTML = htmlData;
}
