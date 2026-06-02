/* ══════════════════════════════════════════════
   NAVITRACK — PROFILE PAGE JAVASCRIPT
   File: profile.js
══════════════════════════════════════════════ */
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

(function () {
    'use strict';

    /* ─────────────────────────────────────────
       FACULTY DATA
       Replace this object with a dynamic fetch
       from your PHP/MySQL backend when ready.
    ───────────────────────────────────────── */
    const FACULTY_PROFILE = {
        initials:    'MP',
        fullName:    'Michael Peoro',
        employeeId:  '2019-0087',
        facultyId:   'PSU-FAC-2020-0087',
        department:  'BSIT',
        college:     'College of Computer and Arts and Sciences Technology',
        position:    'Instructor I',
        role:        'Program Coordinator',
        campus:      'PSU Bayambang',
        email:       'mr.peoro@psu.edu.ph',
        contact:     '+63 917 845 2210',
        academicYear:'A.Y. 2025–2026',
        status:      'active',          // 'active' | 'inactive'
        currentClass: {
            code:    'SAD 101',
            title:   'System Analysis & Design',
            days:    'Mon/Wed',
            time:    '4:00–5:00',
            room:    'Room 106',
        }
    };

    /* ─────────────────────────────────────────
       REFERENCES
    ───────────────────────────────────────── */
    const overlay  = document.getElementById('profile-overlay');
    const panel    = document.getElementById('profile-panel');

    /* ─────────────────────────────────────────
       OPEN / CLOSE
    ───────────────────────────────────────── */
    function openProfileOverlay() {
        if (!overlay) return;
        renderProfile();
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Rotate chevron on nav button
        document.body.classList.add('profile-open');

        // Trap focus inside panel for a11y
        if (panel) {
            const firstFocusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        }
    }

    function closeProfileOverlay() {
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        document.body.classList.remove('profile-open');
    }

    /* Close when clicking the dark backdrop (not the panel itself) */
    function handleOverlayClick(event) {
        if (event.target === overlay) {
            closeProfileOverlay();
        }
    }

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
            closeProfileOverlay();
        }
    });

    /* ─────────────────────────────────────────
       RENDER — populate DOM with faculty data
       Extend here to support multiple profiles
       or a PHP fetch response.
    ───────────────────────────────────────── */
    function renderProfile() {
        const p = FACULTY_PROFILE;

        /* -- Nav button -- */
        const navAvatar = document.querySelector('.profile-nav-avatar');
        const navName   = document.querySelector('.profile-nav-name');
        const navRole   = document.querySelector('.profile-nav-role');
        if (navAvatar) navAvatar.textContent = p.initials;
        if (navName)   navName.textContent   = p.fullName;
        if (navRole)   navRole.textContent   = p.position;

        /* -- Panel avatar -- */
        const avatar = document.querySelector('.profile-avatar');
        if (avatar) avatar.textContent = p.initials;

        /* -- Header text -- */
        setText('.profile-full-name',       p.fullName);
        setText('.profile-position-title',  `${p.role}\u00a0·\u00a0${p.position}`);
        setText('.profile-department',       `${p.department}\n${p.college}`);
        setText('.profile-id-value',         p.facultyId);

        /* -- Online status dot -- */
        const statusDot = document.querySelector('.profile-avatar-status');
        if (statusDot) {
            statusDot.style.background = p.status === 'active' ? '#22c55e' : '#6b7280';
            statusDot.title = p.status === 'active' ? 'Online' : 'Offline';
        }

        /* -- Detail cards -- */
        const cards = document.querySelectorAll('.profile-detail-card');
        const cardData = [
            { icon: 'fa-envelope',      label: 'Email Address',   value: p.email,        mono: false },
            { icon: 'fa-phone-alt',     label: 'Contact Number',  value: p.contact,      mono: false },
            { icon: 'fa-id-badge',      label: 'Employee ID',     value: p.employeeId,   mono: true  },
            { icon: 'fa-building',      label: 'Department',      value: 'BSIT — DIT',   mono: false },
            { icon: 'fa-award',         label: 'Position / Rank', value: p.position,     mono: false },
            { icon: 'fa-briefcase',     label: 'Role',            value: p.role,         mono: false },
            { icon: 'fa-university',    label: 'Campus',          value: p.campus,       mono: false },
            { icon: 'fa-calendar-alt',  label: 'Academic Year',   value: p.academicYear, mono: false },
        ];

        cards.forEach(function (card, i) {
            if (!cardData[i]) return;
            const d = cardData[i];
            const iconEl  = card.querySelector('.pdc-icon-wrap i');
            const labelEl = card.querySelector('.pdc-label');
            const valueEl = card.querySelector('.pdc-value');
            if (iconEl)  { iconEl.className = `fas ${d.icon}`; }
            if (labelEl) labelEl.textContent = d.label;
            if (valueEl) {
                valueEl.textContent = d.value;
                valueEl.className = d.mono ? 'pdc-value mono' : 'pdc-value';
            }
        });

        /* -- Schedule strip -- */
        const c = p.currentClass;
        const pssValue = document.querySelector('.pss-value');
        if (pssValue) {
            pssValue.innerHTML =
                `${c.code}\u00a0\u2014\u00a0${c.title}\u00a0&nbsp;·&nbsp;\u00a0${c.days} ${c.time}\u00a0&nbsp;·&nbsp;\u00a0${c.room}`;
        }
    }

    /* ─────────────────────────────────────────
       HELPERS
    ───────────────────────────────────────── */
    function setText(selector, text) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    /* ─────────────────────────────────────────
       LOGOUT HANDLER
       Wire this to your session logout endpoint.
    ───────────────────────────────────────── */
    function handleLogout() {
        if (!confirm('Are you sure you want to log out?')) return;
        /* Example: window.location.href = '/logout.php'; */
        alert('Logged out successfully.\n(Connect this to your logout.php endpoint.)');
        closeProfileOverlay();
    }

    /* ─────────────────────────────────────────
       EDIT PROFILE HANDLER (stub)
       Replace with your edit modal/page logic.
    ───────────────────────────────────────── */
    function handleEditProfile() {
        alert('Edit Profile panel coming soon.\n(Connect this to your admin/faculty edit form.)');
    }

    /* ─────────────────────────────────────────
       ATTACH BUTTON LISTENERS
       Run after DOM is ready.
    ───────────────────────────────────────── */
    function attachListeners() {
        /* Logout button */
        const logoutBtn = document.querySelector('.profile-btn-logout');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

        /* Edit button */
        const editBtn = document.querySelector('.profile-btn-edit');
        if (editBtn) editBtn.addEventListener('click', handleEditProfile);
    }

    /* ─────────────────────────────────────────
       EXPOSE TO GLOBAL SCOPE
       So onclick="..." attributes in the HTML work.
    ───────────────────────────────────────── */
    window.openProfileOverlay  = openProfileOverlay;
    window.closeProfileOverlay = closeProfileOverlay;
    window.handleOverlayClick  = handleOverlayClick;

    /* ─────────────────────────────────────────
       INIT
    ───────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            renderProfile();
            attachListeners();
        });
    } else {
        renderProfile();
        attachListeners();
    }

})();