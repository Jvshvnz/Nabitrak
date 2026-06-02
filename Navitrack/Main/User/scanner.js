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

let html5QrCode = null;
let isScanning = false;

document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const statusBadge = document.getElementById("statusBadge");
    const errorBox = document.getElementById("errorBox");
    const roomPanel = document.getElementById("roomPanel");
    const roomDetails = document.getElementById("roomDetails");
    const historyList = document.getElementById("historyList");
    const liveTime = document.getElementById("liveTime");

    // ==========================
    // LIVE CLOCK
    // ==========================

    function updateClock() {
        if (!liveTime) return;

        const now = new Date();

        liveTime.textContent = now.toLocaleString("en-PH", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ==========================
    // SCANNER INITIALIZATION
    // ==========================

    function initializeScanner() {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }
    }

    // ==========================
    // STATUS HANDLER
    // ==========================

    function setStatus(type, text) {

        statusBadge.textContent = text;

        switch (type) {

            case "ready":
                statusBadge.className =
                    "status-badge px-4 py-2 rounded-full text-sm font-semibold bg-cyan-500/20 border border-cyan-400/30 text-cyan-300";
                break;

            case "scanning":
                statusBadge.className =
                    "status-badge px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 border border-yellow-400/30 text-yellow-300";
                break;

            case "success":
                statusBadge.className =
                    "status-badge px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300";
                break;

            case "error":
                statusBadge.className =
                    "status-badge px-4 py-2 rounded-full text-sm font-semibold bg-red-500/20 border border-red-400/30 text-red-300";
                break;
        }
    }

    // ==========================
    // ERROR DISPLAY
    // ==========================

    function showError(message) {

        console.error(message);

        errorBox.classList.remove("hidden");
        errorBox.textContent = message;

        setStatus("error", "Error");
    }

    function clearError() {
        errorBox.classList.add("hidden");
        errorBox.textContent = "";
    }

    // ==========================
    // START SCANNER
    // ==========================

    async function startScanner() {

        if (isScanning) return;

        try {

            clearError();

            if (!navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia) {

                showError("Your browser does not support camera access.");
                return;
            }

            initializeScanner();

            setStatus("scanning", "Scanning...");

            await html5QrCode.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    },
                    aspectRatio: 1
                },
                onScanSuccess,
                onScanFailure
            );

            isScanning = true;

            startBtn.disabled = true;
            stopBtn.disabled = false;

        } catch (err) {

            console.error(err);

            showError(
                err.message ||
                "Failed to access camera. Please allow permission."
            );

            setStatus("ready", "Ready");
        }
    }

    // ==========================
    // STOP SCANNER
    // ==========================

    async function stopScanner() {

        try {

            if (!html5QrCode || !isScanning) return;

            await html5QrCode.stop();
            await html5QrCode.clear();

            isScanning = false;

            startBtn.disabled = false;
            stopBtn.disabled = true;

            setStatus("ready", "Ready");

        } catch (err) {

            console.error(err);

        }
    }

    // ==========================
    // QR SUCCESS
    // ==========================

    async function onScanSuccess(decodedText) {

        console.log("QR Detected:", decodedText);

        await stopScanner();

        setStatus("success", "Verified");

        showRoomDetails(decodedText);

        addToHistory(decodedText);
    }

    // ==========================
    // QR FAILURE
    // ==========================

    function onScanFailure() {
        // Ignore normal scan misses
    }

    // ==========================
    // ROOM DETAILS
    // ==========================

    function showRoomDetails(qrData) {

        roomPanel.classList.remove("hidden");

        let roomInfo = {
            room: "Room 104",
            building: "CAST Building",
            floor: "Ground Floor",
            status: "Available",
            subject: "System Analysis and Design",
            instructor: "Instructor",
            time: "4:00 PM - 5:00 PM"
        };

        try {

            const parsed = JSON.parse(qrData);

            roomInfo = {
                ...roomInfo,
                ...parsed
            };

        } catch {

            roomInfo.room = qrData;
        }

        roomDetails.innerHTML = `
            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p class="text-slate-400 text-sm">Room</p>
                <p class="text-3xl font-bold text-white">${roomInfo.room}</p>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p class="text-slate-400 text-sm">Building</p>
                <p class="text-xl font-semibold text-white">${roomInfo.building}</p>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p class="text-slate-400 text-sm">Floor</p>
                <p class="text-white">${roomInfo.floor}</p>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p class="text-slate-400 text-sm">Status</p>
                <p class="text-emerald-400 font-semibold">${roomInfo.status}</p>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p class="text-slate-400 text-sm">Current Subject</p>
                <p class="text-white">${roomInfo.subject}</p>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p class="text-slate-400 text-sm">Schedule</p>
                <p class="text-white">${roomInfo.time}</p>
            </div>
        `;
    }

    // ==========================
    // HISTORY
    // ==========================

    function addToHistory(qrData) {

        const now = new Date();

        const time = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        const item = document.createElement("div");

        item.className =
            "flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-3";

        item.innerHTML = `
            <div>
                <div class="font-medium text-white">${qrData}</div>
                <div class="text-xs text-slate-400">Room Verification</div>
            </div>
            <span class="text-xs text-slate-400">${time}</span>
        `;

        historyList.prepend(item);

        while (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    // ==========================
    // BUTTON EVENTS
    // ==========================

    startBtn.addEventListener("click", startScanner);

    stopBtn.addEventListener("click", stopScanner);

    // ==========================
    // INITIAL STATE
    // ==========================

    setStatus("ready", "Ready");
});