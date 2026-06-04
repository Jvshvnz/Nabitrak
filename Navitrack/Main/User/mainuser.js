// Navi Track • PSU - Main JavaScript

/* CUSTOM CURSOR */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  if (dot)  dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
})();

/* APP BOOTSTRAP */
document.addEventListener('DOMContentLoaded', () => {
  initializeLoadingScreen();
  initializeApp();
});

/* LOADING SCREEN */
function initializeLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const steps = [
    { pct: 15,  label: 'Initializing' },
    { pct: 32,  label: 'Loading assets' },
    { pct: 52,  label: 'Fetching rooms' },
    { pct: 68,  label: 'Syncing schedules' },
    { pct: 84,  label: 'Preparing campus' },
    { pct: 100, label: 'Ready' }
  ];

  let idx = 0;

  function runStep() {
    if (idx >= steps.length) return;
    const step   = steps[idx];
    const fill   = document.getElementById('ls-fill');
    const pct    = document.getElementById('ls-pct');
    const status = document.getElementById('ls-status');

    if (fill)   fill.style.width   = step.pct + '%';
    if (pct)    pct.textContent    = step.pct + '%';
    if (status) status.textContent = step.label;

    idx++;
    if (idx < steps.length) {
      setTimeout(runStep, Math.random() * 240 + 180);
    } else {
      // All steps done — fade out loading screen, THEN show navbar
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        const nav = document.getElementById('main-nav');
        if (nav) nav.classList.add('nav-visible');

        // After CSS transition fully ends, remove from DOM
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 750);
      }, 350);
    }
  }

  setTimeout(runStep, 380);
}

/* APP INIT */
function initializeApp() {
  updateHeroClock();
  initFloorPlan();
  populateRooms();
  initNavActiveLinks();

  console.log(
    '%c✅ Navi Track • PSU initialized',
    'background:#E8B923; color:#0A2540; font-weight:700; padding:6px 16px; border-radius:9999px'
  );
}

/* Active nav link on scroll */
function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));
}

/* HERO LIVE CLOCK (top-right card) */
function updateHeroClock() {
  const clock  = document.getElementById('liveClock');
  const dateEl = document.getElementById('currentDate');

  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (clock)  clock.textContent  = `${h}:${m}:${s}`;
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  tick();
  setInterval(tick, 1000);
}

/* FLOOR PLAN (hero mini map) */
function initFloorPlan() {
  const fp = document.getElementById('floorPlan');
  if (!fp) return;

  fp.style.position = 'relative';
  fp.style.overflow = 'hidden';

  fp.innerHTML = `
    <!-- Building outline -->
    <div style="position:absolute;inset:12px;background:#dde3ec;border-radius:12px;border:2.5px solid #94a3b8;"></div>

    <!-- Hallway -->
    <div style="position:absolute;top:50%;left:12px;right:12px;height:22px;background:#c8d0dc;transform:translateY(-50%);"></div>

    <!-- Rooms top row -->
    <div class="floor-room" style="top:18px;left:20px;width:62px;height:44px;font-size:0.62rem;">101</div>
    <div class="floor-room" style="top:18px;left:90px;width:62px;height:44px;font-size:0.62rem;">102</div>
    <div class="floor-room" style="top:18px;left:160px;width:62px;height:44px;font-size:0.62rem;">103</div>
    <div class="floor-room active" onclick="highlightRoom()"
      style="top:18px;left:230px;width:68px;height:44px;font-size:0.58rem;flex-direction:column;gap:1px;">
      <span>104</span>
      <span style="font-size:0.45rem;font-weight:500;color:#92400e;">YOU</span>
    </div>

    <!-- Rooms bottom row -->
    <div class="floor-room" style="bottom:18px;left:20px;width:62px;height:44px;font-size:0.62rem;">Lab 1</div>
    <div class="floor-room" style="bottom:18px;left:90px;width:62px;height:44px;font-size:0.62rem;">Lab 2</div>
    <div class="floor-room" style="bottom:18px;left:160px;width:62px;height:44px;font-size:0.62rem;">106</div>
    <div class="floor-room" style="bottom:18px;left:230px;width:68px;height:44px;font-size:0.62rem;">107</div>

    <!-- You-are-here pin -->
    <div style="position:absolute;top:14px;right:18px;z-index:10;">
      <div style="width:22px;height:22px;background:#ef4444;border-radius:50% 50% 50% 0;
                  transform:rotate(-45deg);box-shadow:0 4px 12px rgba(239,68,68,0.5);"></div>
    </div>
  `;
}

/* ROOM LOCATOR LIST */
let allRooms = [
  { id: 301, name: "Lab 1 — Computer Lab",   building: "Cast", floor: "1", status: "Available", time: "3 min walk" },
  { id: 302, name: "Lab 2 — Computer Lab",   building: "Cast", floor: "1", status: "Occupied",  time: "4 min walk" },
  { id: 303, name: "Lab 3 — Computer Lab",   building: "Cast", floor: "1", status: "Available", time: "3 min walk" },
  { id: 304, name: "Room 106 — Lecture",     building: "Cast", floor: "1", status: "Available", time: "1 min walk" },
  { id: 201, name: "Room 107 — Lecture",     building: "Cast", floor: "1", status: "Occupied",  time: "2 min walk" },
];

function populateRooms(filteredRooms = allRooms) {
  const container = document.getElementById('rooms-list');
  if (!container) return;
  container.innerHTML = '';

  filteredRooms.forEach(room => {
    const div = document.createElement('div');
    div.className = `flex justify-between items-center px-5 py-4 rounded-3xl cursor-pointer hover:bg-white/10 
                     ${room.status === 'Available' ? 'border border-[#E8B923]' : ''}`;
    div.innerHTML = `
      <div>
        <div class="font-medium">${room.name}</div>
        <div class="text-xs text-white/60">${room.building} • Floor ${room.floor}</div>
      </div>
      <div class="text-right">
        <div class="text-sm ${room.status === 'Available' ? 'text-emerald-400' : 'text-amber-300'}">${room.status}</div>
        <div class="text-[#E8B923] text-xs">${room.time}</div>
      </div>`;
    div.onclick = () => selectRoom(room.id);
    container.appendChild(div);
  });

  const rc = document.getElementById('result-count');
  if (rc) rc.textContent = `${filteredRooms.length} rooms`;
}

function filterRooms() {
  const query = (document.getElementById('room-search')?.value || '').toLowerCase().trim();
  const filtered = allRooms.filter(r =>
    r.name.toLowerCase().includes(query) || r.building.toLowerCase().includes(query)
  );
  populateRooms(filtered);
}

window.selectRoom = function (id) {
  console.log(`Room ${id} selected`);
};

window.highlightRoom = function () {
  alert("Room 104 — You are here!");
};

window.changeFloor = function () {
  alert("Floor selector — wire to your PHP backend.");
};

window.hideDetailPanel = function () {
  document.getElementById('room-detail-panel')?.classList.add('hidden');
};

/* TOP-LEVEL BUTTON HANDLERS (hero buttons) */
function findRoom() {
  document.getElementById('room-locator')
    .scrollIntoView({ behavior: 'smooth' });
}

function openSchedule() {
  document.getElementById('block-schedule')
    .scrollIntoView({ behavior: 'smooth' });
}

function toggleLogin() {
  alert("🔐 Login modal — connect to your PHP auth endpoint.");
}

/* FACULTY SCHEDULE + ROOM SCANNER MODULE */
(function () {

  /* SCHEDULE CONSTANTS */
  const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const TIMES = [
    '7:00','7:30','8:00','8:30','9:00','9:30',
    '10:00','10:30','11:00','11:30',
    '12:00','12:30',
    '1:00','1:30','2:00','2:30',
    '3:00','3:30','4:00','4:30',
    '5:00','5:30'
  ];
  const LUNCH = new Set(['12:00','12:30']);

  let scheduleDB = [
    { id:'SCH-001', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'GEE 1 BTLED',   section:'BTLED 2nd Flr.',   room:'CAST 2nd Flr.',  days:['Monday','Tuesday','Wednesday'],  timeIn:'8:00',  timeOut:'9:00',  type:'gee' },
    { id:'SCH-002', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'GEE 1 BECED',   section:'BECED 3-1',        room:'Recto Rm 203',   days:['Monday','Tuesday','Wednesday'],  timeIn:'9:00',  timeOut:'10:00', type:'gee' },
    { id:'SCH-003', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'NET 101 (Lec)', section:'BSIT DA 2-1',      room:'IT Lab 3',       days:['Thursday','Friday'],            timeIn:'7:30',  timeOut:'9:00',  type:'lec' },
    { id:'SCH-004', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'NET 101 (Lab)', section:'BSIT DA 2-1',      room:'IT Lab 3',       days:['Thursday','Friday'],            timeIn:'9:00',  timeOut:'10:30', type:'lab' },
    { id:'SCH-005', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'NET 101 (Lab)', section:'BSIT WMT 2-1',     room:'IT Lab 3',       days:['Thursday','Friday'],            timeIn:'10:30', timeOut:'12:00', type:'lab' },
    { id:'SCH-006', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'NET 101',       section:'M. Peoro',         room:'CAST Rm. 106',   days:['Thursday','Friday'],            timeIn:'1:00',  timeOut:'2:30',  type:'lec' },
    { id:'SCH-007', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'SAD 101',       section:'BSIT DA 2-1',      room:'CAST Rm. 106',   days:['Monday','Tuesday','Wednesday'], timeIn:'2:00',  timeOut:'3:00',  type:'lec' },
    { id:'SCH-008', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'SAD 101',       section:'BSIT WMT 2-1',     room:'CAST Rm. 106',   days:['Monday','Tuesday','Wednesday'], timeIn:'4:00',  timeOut:'5:00',  type:'lec' },
    { id:'SCH-009', faculty:'Peoro, Michael Ryan C.',  dept:'CAST', subject:'Consultation',  section:'',                 room:'Faculty Room',   days:['Thursday','Friday'],            timeIn:'3:00',  timeOut:'5:00',  type:'consult' },
    { id:'SCH-010', faculty:'Francisco, Janice C.',    dept:'CAST', subject:'IM 101',        section:'BSIT WMT 1-1',     room:'CAST Rm. 104',   days:['Monday','Wednesday'],           timeIn:'9:00',  timeOut:'10:30', type:'lec' },
    { id:'SCH-011', faculty:'Cahatol, Ghana L.',       dept:'CAST', subject:'HCI 101',       section:'BSIT DA 3-1',      room:'CAST Rm. 102',   days:['Tuesday','Thursday'],           timeIn:'1:00',  timeOut:'2:30',  type:'lec' },
  ];

  let currentFaculty = scheduleDB[0].faculty;
  let currentView    = 'grid';

  function getFacultyList() {
    return [...new Set(scheduleDB.map(s => s.faculty))];
  }

  function initSchedulePage() {
    populateFacultyDropdowns();
    loadFacultySchedule(currentFaculty);
  }

  function populateFacultyDropdowns() {
    const list = getFacultyList();
    ['sched-faculty-select'].forEach(id => {
      const sel = document.getElementById(id);
      if (!sel) return;
      sel.innerHTML = list.map(f => `<option value="${f}">${f}</option>`).join('');
      sel.value = currentFaculty;
    });
  }

  window.loadFacultySchedule = function (faculty) {
    currentFaculty = faculty;
    const entries  = scheduleDB.filter(s => s.faculty === faculty);
    const dept     = entries[0]?.dept || '—';
    const hrs      = calcTotalHours(entries);
    const fn = document.getElementById('sched-faculty-name');
    const fd = document.getElementById('sched-dept');
    const fh = document.getElementById('sched-hours');
    const fs = document.getElementById('sched-faculty-select');
    if (fn) fn.textContent = faculty;
    if (fd) fd.textContent = dept;
    if (fh) fh.textContent = hrs + ' hrs/week';
    if (fs) fs.value = faculty;
    renderCurrentView();
  };

  function calcTotalHours(entries) {
    let mins = 0;
    entries.forEach(e => {
      const [inH, inM]   = e.timeIn.split(':').map(Number);
      const [outH, outM] = e.timeOut.split(':').map(Number);
      mins += ((outH * 60 + outM) - (inH * 60 + inM)) * e.days.length;
    });
    return Math.round(mins / 60);
  }

  window.switchSchedView = function (view) {
    currentView = view;
    ['grid','list','conflicts'].forEach(v => {
      document.getElementById('sched-view-' + v)?.classList.add('hidden');
      const tab = document.getElementById('tab-' + v);
      if (tab) {
        tab.classList.remove('active-tab');
        tab.classList.add('text-white/60');
      }
    });
    document.getElementById('sched-view-' + view)?.classList.remove('hidden');
    const activeTab = document.getElementById('tab-' + view);
    if (activeTab) {
      activeTab.classList.add('active-tab');
      activeTab.classList.remove('text-white/60');
    }
    renderCurrentView();
  };

  function renderCurrentView() {
    if (currentView === 'grid')      renderGrid();
    else if (currentView === 'list') renderList();
    else                             renderConflicts();
  }

  /* GRID RENDERING (unchanged logic) */
  function renderGrid() {
    const entries  = scheduleDB.filter(s => s.faculty === currentFaculty);
    const theadRow = document.getElementById('sched-thead-row');
    if (!theadRow) return;

    while (theadRow.children.length > 1) theadRow.removeChild(theadRow.lastChild);
    DAYS.forEach(day => {
      const th = document.createElement('th');
      th.className = 'text-left px-3 py-4 text-[10px] uppercase tracking-widest text-[#E8B923]/70 font-bold';
      th.textContent = day;
      theadRow.appendChild(th);
    });

    const tbody = document.getElementById('sched-grid-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    TIMES.forEach(time => {
      const isLunch = LUNCH.has(time);
      const tr = document.createElement('tr');
      tr.className = 'border-b border-white/[0.06]' + (isLunch ? ' bg-orange-500/[0.04]' : '');

      const tdTime = document.createElement('td');
      tdTime.className = 'px-4 py-2 text-[10px] text-white/30 font-medium whitespace-nowrap align-top border-r border-white/[0.06]';
      tdTime.textContent = time;
      tr.appendChild(tdTime);

      DAYS.forEach(day => {
        const td = document.createElement('td');
        td.className = 'border-r border-white/[0.06] align-top p-1';
        td.style.minWidth = '110px';

        if (isLunch) {
          if (day === 'Monday') {
            td.colSpan = 6;
            td.className = 'align-middle p-2';
            td.innerHTML = `<div class="text-center text-[9px] font-bold tracking-[0.15em] uppercase text-orange-400/60 py-1">— Lunch Break —</div>`;
            tr.appendChild(td);
          }
          return;
        }

        const matching = entries.filter(e =>
          e.days.includes(day) && timeInRange(time, e.timeIn, e.timeOut)
        );

        if (matching.length > 0) {
          matching.forEach(entry => {
            const tag = document.createElement('div');
            tag.className = 'rounded-lg mb-1 px-2 py-1.5 cursor-pointer ' + typeStyle(entry.type);
            tag.innerHTML = `
              <div class="text-[10px] font-bold leading-tight ${typeTextColor(entry.type)}">${entry.subject}</div>
              ${entry.section ? `<div class="text-[9px] text-white/50 mt-0.5">${entry.section}</div>` : ''}
              ${entry.room    ? `<div class="text-[9px] text-white/30">${entry.room}</div>` : ''}`;
            tr.appendChild(td);
            td.appendChild(tag);
          });
        } else {
          td.innerHTML = `<div class="h-8 rounded-lg hover:bg-white/[0.03] transition cursor-pointer"></div>`;
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });
  }

  function timeInRange(slotTime, timeIn, timeOut) {
    const toMins = t => { const p = t.split(':').map(Number); return p[0]*60+(p[1]||0); };
    return toMins(slotTime) >= toMins(timeIn) && toMins(slotTime) < toMins(timeOut);
  }

  function typeStyle(type) {
    return {
      lec:     'bg-blue-500/10 border-l-2 border-blue-400',
      lab:     'bg-emerald-500/10 border-l-2 border-emerald-400',
      gee:     'bg-[#E8B923]/10 border-l-2 border-[#E8B923]',
      consult: 'bg-purple-500/10 border-l-2 border-purple-400'
    }[type] || 'bg-white/5 border-l-2 border-white/20';
  }

  function typeTextColor(type) {
    return {
      lec:     'text-blue-300',
      lab:     'text-emerald-300',
      gee:     'text-[#E8B923]',
      consult: 'text-purple-300'
    }[type] || 'text-white/80';
  }

  function typeBadge(type) {
    return {
      lec:     '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300">LEC</span>',
      lab:     '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">LAB</span>',
      gee:     '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-500/20 text-yellow-300">GEE</span>',
      consult: '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300">CONSULT</span>'
    }[type] || '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/50">—</span>';
  }

  /* LIST VIEW */
  function renderList() {
    const entries = scheduleDB.filter(s => s.faculty === currentFaculty);
    const tbody   = document.getElementById('sched-list-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!entries.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-white/30 text-sm">No schedules found.</td></tr>`;
      return;
    }
    entries.forEach(e => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-white/[0.06] hover:bg-white/[0.03] transition';
      tr.innerHTML = `
        <td class="p-5 text-xs text-white/40 font-mono">${e.id}</td>
        <td class="p-5 text-sm font-semibold text-white">${e.subject}</td>
        <td class="p-5 text-sm text-white/70">${e.section || '—'}</td>
        <td class="p-5 text-sm text-white/70">${e.room || '—'}</td>
        <td class="p-5 text-xs text-white/60">${e.days.join(', ')}</td>
        <td class="p-5 text-sm text-white/80">${e.timeIn}</td>
        <td class="p-5 text-sm text-white/80">${e.timeOut}</td>
        <td class="p-5">${typeBadge(e.type)}</td>
        <td class="p-5">
          <div class="flex gap-2">
            <button class="px-3 py-1.5 text-[10px] font-semibold border border-white/10 rounded-xl text-white/60 hover:bg-white/5 transition">Edit</button>
            <button class="px-3 py-1.5 text-[10px] font-semibold border border-red-500/20 rounded-xl text-red-400/70 hover:bg-red-500/10 transition">Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* CONFLICTS VIEW */
  function renderConflicts() {
    const conflicts = findConflicts();
    const container = document.getElementById('sched-conflicts-body');
    if (!container) return;
    if (!conflicts.length) {
      container.innerHTML = `<div class="flex items-center gap-4 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"><div class="text-2xl">✓</div><div><div class="text-sm font-semibold text-emerald-300">No conflicts detected</div><div class="text-xs text-white/40 mt-0.5">All schedules for ${currentFaculty} are conflict-free.</div></div></div>`;
      return;
    }
    container.innerHTML = conflicts.map(c => `
      <div class="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl">
        <div class="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">⚠ Conflict</div>
        <div class="text-sm text-white/80">${c.msg}</div>
        <div class="flex gap-2 mt-3">
          <span class="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-white/50">${c.a}</span>
          <span class="text-white/30 text-xs self-center">vs</span>
          <span class="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-white/50">${c.b}</span>
        </div>
      </div>`).join('');
  }

  function findConflicts() {
    const conflicts = [];
    const entries   = scheduleDB.filter(s => s.faculty === currentFaculty);
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i], b = entries[j];
        const shared = a.days.filter(d => b.days.includes(d));
        if (!shared.length) continue;
        if (timesOverlap(a.timeIn, a.timeOut, b.timeIn, b.timeOut)) {
          const msg = a.room && b.room && a.room === b.room
            ? `Room conflict on ${shared.join(', ')} at ${a.timeIn}–${a.timeOut} in ${a.room}`
            : `Time overlap on ${shared.join(', ')} between ${a.timeIn}–${a.timeOut} and ${b.timeIn}–${b.timeOut}`;
          conflicts.push({ msg, a: a.subject, b: b.subject });
        }
      }
    }
    return conflicts;
  }

  function timesOverlap(s1, e1, s2, e2) {
    const m = t => { const p = t.split(':').map(Number); return p[0]*60+(p[1]||0); };
    return m(s1) < m(e2) && m(s2) < m(e1);
  }

  window.exportSchedulePDF = function () {
    alert('PDF export — wire to your PHP export endpoint or window.print().');
  };

  /* ROOM SCANNER (qr) */
  const roomDatabase = {
    "ROOM-101":   { room: "ROOM-101",   building: "CAST Building",       floor: "1st Floor", status: "Vacant",      department: "BSIT Department",      schedule: "No active class" },
    "ROOM-205":   { room: "ROOM-205",   building: "Engineering Building", floor: "2nd Floor", status: "Occupied",    department: "BSBA Department",     schedule: "8:00 AM - 11:00 AM" },
    "CAST-LAB-3": { room: "CAST-LAB-3", building: "CAST Building",       floor: "3rd Floor", status: "Maintenance", department: "Computer Laboratory", schedule: "Unavailable" },
    "IT-LAB-A":   { room: "IT-LAB-A",   building: "IT Center",           floor: "4th Floor", status: "Reserved",    department: "Information Technology", schedule: "Research Presentation" }
  };

  let html5QrCode;
  let scannerRunning = false;
  let currentCamera = "environment";

  const statusBadge = document.getElementById("statusBadge");
  const roomPanel   = document.getElementById("roomPanel");
  const roomDetails = document.getElementById("roomDetails");
  const historyList = document.getElementById("historyList");
  const errorBox    = document.getElementById("errorBox");

  // Live Clock for scanner sidebar
  function updateScannerClock() {
    const el = document.getElementById("liveTime");
    if (!el) return;
    el.innerText = new Date().toLocaleString();
  }
  setInterval(updateScannerClock, 1000);
  updateScannerClock();

  function setStatus(text, colorClass) {
    if (!statusBadge) return;
    statusBadge.innerText = text;
    statusBadge.className = `status-badge px-4 py-2 rounded-full text-sm font-semibold ${colorClass}`;
  }

  function playSuccessSound() {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const osc   = audio.createOscillator();
    const gain  = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.3);
    if (navigator.vibrate) navigator.vibrate(150);
  }

  function addHistory(text, success = true) {
    if (!historyList) return;
    const item = document.createElement("div");
    item.className = `rounded-2xl p-4 border ${success ? "bg-emerald-500/10 border-emerald-400/20" : "bg-red-500/10 border-red-400/20"}`;
    item.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <p class="font-medium">${text}</p>
          <p class="text-xs text-slate-400 mt-1">${new Date().toLocaleTimeString()}</p>
        </div>
        <div class="text-xl">${success ? "✓" : "✕"}</div>
      </div>
    `;
    historyList.prepend(item);
  }

  function renderRoomInfo(data) {
    if (!roomPanel || !roomDetails) return;
    roomPanel.classList.remove("hidden");
    const statusColor = {
      "Vacant":      "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
      "Occupied":    "text-red-300 border-red-400/30 bg-red-500/10",
      "Maintenance": "text-yellow-300 border-yellow-400/30 bg-yellow-500/10",
      "Reserved":    "text-indigo-300 border-indigo-400/30 bg-indigo-500/10"
    };

    roomDetails.innerHTML = `
      <div class="glass rounded-2xl p-5"><p class="text-slate-400 text-sm">Room</p><h3 class="text-2xl font-bold">${data.room}</h3></div>
      <div class="glass rounded-2xl p-5"><p class="text-slate-400 text-sm">Building</p><h3 class="text-xl font-semibold">${data.building}</h3></div>
      <div class="glass rounded-2xl p-5"><p class="text-slate-400 text-sm">Floor</p><h3 class="text-xl font-semibold">${data.floor}</h3></div>
      <div class="glass rounded-2xl p-5">
        <p class="text-slate-400 text-sm mb-2">Status</p>
        <span class="px-4 py-2 rounded-full border text-sm font-semibold ${statusColor[data.status]}">${data.status}</span>
      </div>
      <div class="glass rounded-2xl p-5"><p class="text-slate-400 text-sm">Department</p><h3 class="text-lg font-semibold">${data.department}</h3></div>
      <div class="glass rounded-2xl p-5"><p class="text-slate-400 text-sm">Schedule</p><h3 class="text-lg font-semibold">${data.schedule}</h3></div>
    `;
  }

  async function onScanSuccess(decodedText) {
    if (!scannerRunning) return;

    setStatus("Verifying...", "bg-yellow-500/20 border border-yellow-400/30 text-yellow-300");
    await new Promise(r => setTimeout(r, 1200));

    const roomData = roomDatabase[decodedText];

    if (roomData) {
      playSuccessSound();
      setStatus("Verified", "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300");
      renderRoomInfo(roomData);
      addHistory(`Verified ${decodedText}`, true);
      stopScanner();
    } else {
      setStatus("Invalid QR", "bg-red-500/20 border border-red-400/30 text-red-300");
      addHistory(`Invalid QR: ${decodedText}`, false);
    }
  }

  async function startScanner() {
    if (scannerRunning) return;
    if (roomPanel) roomPanel.classList.add("hidden");
    setStatus("Scanning...", "bg-cyan-500/20 border border-cyan-400/30 text-cyan-300");
    if (errorBox) errorBox.classList.add("hidden");

    html5QrCode = new Html5Qrcode("reader");

    try {
      await html5QrCode.start(
        { facingMode: currentCamera },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      );
      scannerRunning = true;
    } catch (err) {
      if (errorBox) {
        errorBox.classList.remove("hidden");
        errorBox.innerHTML = `<strong>Camera Error:</strong><br>Permission denied or camera unavailable.`;
      }
      setStatus("Camera Denied", "bg-red-500/20 border border-red-400/30 text-red-300");
    }
  }

  async function stopScanner() {
    if (!scannerRunning || !html5QrCode) return;
    try {
      await html5QrCode.stop();
      scannerRunning = false;
      setStatus("Stopped", "bg-slate-500/20 border border-slate-400/30 text-slate-300");
    } catch (e) {}
  }

  // Scanner buttons (if present on page)
  const startBtn = document.getElementById("startBtn");
  const stopBtn  = document.getElementById("stopBtn");
  if (startBtn) startBtn.addEventListener("click", startScanner);
  if (stopBtn)  stopBtn.addEventListener("click", stopScanner);

  // Auto start scanner on full load (optional)
  window.addEventListener("load", () => {
    setTimeout(startScanner, 1200);
  });

  /* INIT FOR SCHEDULE */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedulePage);
  } else {
    initSchedulePage();
  }

})(); // end IIFE

/* FINAL LOADER HIDE (safety) */
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
});