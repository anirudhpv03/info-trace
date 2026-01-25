









// Helper function to select elements by ID
const el = id => document.getElementById(id);
const collectedData = {};

// ================= MAIN FUNCTION =================
async function collect() {
    collectIdentity();
    collectDevice();
    collectBrowser();
    collectScreen();
    collectFingerprints();
    await collectIP();

    console.log("Info‑Trace Strict Mode Data:", collectedData);
}

// ================= IDENTITY =================
function collectIdentity() {
    collectedData.userAgent = navigator.userAgent;
    el('ua').textContent = navigator.userAgent;
}

// ================= DEVICE INFO =================
function collectDevice() {
    collectedData.platform = navigator.platform || 'Unavailable';
    collectedData.deviceType = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    collectedData.cpuCores = navigator.hardwareConcurrency || 'Unavailable';
    collectedData.touchSupport = navigator.maxTouchPoints > 0;

    el('platform').textContent = collectedData.platform;
    el('deviceType').textContent = collectedData.deviceType;
    el('cores').textContent = collectedData.cpuCores;
    el('touch').textContent = collectedData.touchSupport ? 'Yes' : 'No';
}

// ================= BROWSER INFO =================
function collectBrowser() {
    collectedData.language = navigator.language || 'Unavailable';
    collectedData.languages = navigator.languages || ['Unavailable'];
    collectedData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unavailable';

    el('language').textContent = collectedData.language;
    el('languages').textContent = collectedData.languages.join(', ');
    el('timezone').textContent = collectedData.timezone;
}

// ================= SCREEN / DISPLAY =================
function collectScreen() {
    collectedData.screenWidth = screen.width;
    collectedData.screenHeight = screen.height;
    collectedData.screenAvailWidth = screen.availWidth;
    collectedData.screenAvailHeight = screen.availHeight;
    collectedData.colorDepth = screen.colorDepth;
    collectedData.pixelRatio = window.devicePixelRatio;

    el('screen').textContent = `${screen.width} × ${screen.height}`;
    el('screenAvail').textContent = `${screen.availWidth} × ${screen.availHeight}`;
    el('color').textContent = `${screen.colorDepth}-bit`;
    el('pixelRatio').textContent = window.devicePixelRatio;
}

// ================= FINGERPRINTS =================
function collectFingerprints() {
    // Canvas Fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '14px Arial';
    ctx.fillText(navigator.userAgent, 5, 20);
    const canvasFP = canvas.toDataURL();
    collectedData.canvasFP = canvasFP;
    el('canvasFP').textContent = canvasFP.slice(0, 140) + '…';

    // WebGL Info
    const glCanvas = document.createElement('canvas');
    const gl = glCanvas.getContext('webgl');
    if (!gl) {
        collectedData.webgl = 'Unsupported';
        el('webgl').textContent = 'WebGL Unsupported';
    } else {
        const debug = gl.getExtension('WEBGL_debug_renderer_info');
        const vendor = debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : 'Masked';
        const renderer = debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'Masked';
        collectedData.webgl = { vendor, renderer };
        el('webgl').textContent = `${vendor} | ${renderer}`;
    }

}

// ================= PUBLIC IP =================
async function collectIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        collectedData.ip = data.ip;
        el('ip').textContent = data.ip;
    } catch {
        collectedData.ip = 'Unavailable';
        el('ip').textContent = 'Unavailable';
    }
}

// ================= EXPORT JSON =================
function exportJSON() {
    const blob = new Blob([JSON.stringify(collectedData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'info-trace-strict.json';
    a.click();
}

// ================= CLEAR DATA =================
function clearData() {
    document.querySelectorAll('.card-value').forEach(e => e.textContent = 'Cleared');
    Object.keys(collectedData).forEach(k => delete collectedData[k]);
}

// Optional: Auto-run on page load
window.addEventListener('load', collect);
