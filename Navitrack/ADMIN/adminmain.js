const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  if (dot)  dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
})();
// ====================== LOADING SCREEN ======================
const loadingSteps = [
    { pct: 18,  label: "Initializing"    },
    { pct: 38,  label: "Loading modules" },
    { pct: 58,  label: "Fetching data"   },
    { pct: 78,  label: "Preparing portal"},
    { pct: 92,  label: "Almost ready"    },
    { pct: 100, label: "Done"            },
];

let stepIndex = 0;

function runLoadingStep() {
    if (stepIndex >= loadingSteps.length) return;
    const step = loadingSteps[stepIndex];
    document.getElementById('progress-fill').style.width = step.pct + '%';
    document.getElementById('pct-text').textContent = step.pct + '%';
    document.getElementById('status-text').textContent = step.label;
    stepIndex++;
    if (stepIndex < loadingSteps.length) {
        const delay = stepIndex === loadingSteps.length - 1 ? 280 : Math.random() * 250 + 160;
        setTimeout(runLoadingStep, delay);
    } else {
        setTimeout(finishLoading, 350);
    }
}

function finishLoading() {
    const screen = document.getElementById('loading-screen');
    screen.classList.add('fade-out');
    setTimeout(() => {
        screen.style.display = 'none';
        // Direct na ipakita ang admin panel, walang login
        document.getElementById('admin-panel').classList.remove('hidden');
        showPage('dashboard');
    }, 680);
}

window.onload = function () {
    setTimeout(runLoadingStep, 600);
};


// ====================== PAGE NAVIGATION ======================
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-' + page).classList.remove('hidden');

    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
    const activeLink = Array.from(document.querySelectorAll('.admin-nav-item'))
        .find(item => item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + page + "'"));
    if (activeLink) activeLink.classList.add('active');
}


// ====================== LOGIN ======================
function adminLogin() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    showPage('dashboard');
}

function logout() {
    if (confirm("Logout from Admin Portal?")) {
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
    }
}


// ====================== MODAL HELPERS ======================
function openRoomModal() {
    document.getElementById('modal-room').classList.add('open');
}

function openScheduleModal() {
    document.getElementById('modal-schedule').classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function closeOnOverlay(e, id) {
    if (e.target === document.getElementById(id)) {
        closeModal(id);
    }
}

function submitRoom() {
    const name     = document.getElementById('room-name').value.trim();
    const building = document.getElementById('room-building').value;
    const course   = document.getElementById('room-course').value;

    if (!name || !building || !course) {
        alert('Please fill in all fields.');
        return;
    }

    // TODO: Replace with your fetch() call to PHP backend
    // Example:
    // fetch('save_room.php', {
    //     method: 'POST',
    //     body: new FormData(/* ... */),
    // });

    console.log('Room saved:', { name, building, course });
    alert('Room "' + name + '" saved successfully!');
    closeModal('modal-room');

    // Clear fields
    document.getElementById('room-name').value = '';
    document.getElementById('room-building').value = '';
    document.getElementById('room-course').value = '';
}

function submitSchedule() {
    const room       = document.getElementById('sched-room').value;
    const subject    = document.getElementById('sched-subject').value.trim();
    const instructor = document.getElementById('sched-instructor').value.trim();
    const day        = document.getElementById('sched-day').value;
    const timein     = document.getElementById('sched-timein').value;
    const timeout    = document.getElementById('sched-timeout').value;

    if (!room || !subject || !instructor || !day || !timein || !timeout) {
        alert('Please fill in all fields.');
        return;
    }

    // TODO: Replace with your fetch() call to PHP backend

    console.log('Schedule saved:', { room, subject, instructor, day, timein, timeout });
    alert('Schedule saved successfully!');
    closeModal('modal-schedule');

    // Clear fields
    document.getElementById('sched-room').value = '';
    document.getElementById('sched-subject').value = '';
    document.getElementById('sched-instructor').value = '';
    document.getElementById('sched-day').value = '';
    document.getElementById('sched-timein').value = '';
    document.getElementById('sched-timeout').value = '';
}


// ====================== USERS ======================
function addNewUser() {
    alert("Add New User form — connect to your PHP backend.");
}

function searchUsers() {
    const query = document.getElementById('user-search').value.toLowerCase();
    const rows  = document.querySelectorAll('#users-body tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}


// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
    // Any extra init here
});