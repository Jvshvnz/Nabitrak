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
   
   function selectRole(index) {
        const buttons = document.querySelectorAll('.role-btn');

        buttons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add(
                    'active',
                    'bg-white/10',
                    'text-white',
                    'border-white/20'
                );
            } else {
                btn.classList.remove(
                    'active',
                    'bg-white/10',
                    'text-white',
                    'border-white/20'
                );
            }
        });
    }

    // Toggle Password Visibility
    function togglePassword() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');

        if (!passwordInput || !eyeIcon) return;

        const isPassword = passwordInput.type === 'password';

        passwordInput.type = isPassword ? 'text' : 'password';

        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    }

    // Handle Login
    function handleLogin(event) {
        event.preventDefault();

        const form = event.target;
        const button = form.querySelector('button[type="submit"]');

        if (!button) return;

        const originalContent = button.innerHTML;

        // Loading State
        button.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4">
                    </circle>

                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 
                        0 0 5.373 0 12h4z">
                    </path>
                </svg>

                <span>Signing In...</span>
            </div>
        `;

        button.disabled = true;
        button.classList.add('opacity-80', 'cursor-not-allowed');

        // Fake Login Delay
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;

            button.classList.remove(
                'opacity-80',
                'cursor-not-allowed'
            );

            // Toast
            const toast = document.getElementById('successToast');

            if (toast) {
                toast.classList.remove(
                    'hidden',
                    'translate-y-10',
                    'opacity-0'
                );

                toast.classList.add(
                    'translate-y-0',
                    'opacity-100'
                );

                // Auto Hide
                setTimeout(() => {
                    toast.classList.add(
                        'translate-y-10',
                        'opacity-0'
                    );

                    setTimeout(() => {
                        toast.classList.add('hidden');
                    }, 300);
                }, 2500);
            }

            // Demo Alert
            setTimeout(() => {
                alert(
                    "🎉 Login Successful!\n\n" +
                    "Welcome to Horizon Capstone Management System."
                );
            }, 800);

        }, 1800);
    }

    // Forgot Password
    function forgotPassword() {
        alert(
            "Password reset flow would open here.\n\n" +
            "Demo mode enabled."
        );
    }

    // Initialize
    window.addEventListener('DOMContentLoaded', () => {

        // Default Role
        selectRole(0);

        // Autofocus Input
        const identifierInput = document.getElementById('identifier');

        if (identifierInput) {
            setTimeout(() => {
                identifierInput.focus();
            }, 500);
        }

        // Console Branding
        console.log(
            '%c✨ Horizon Login UI Ready',
            `
            color:#22D3EE;
            font-size:14px;
            font-family:Inter,sans-serif;
            font-weight:600;
            `
        );

        console.log(
            '%cUltra-premium Apple-inspired aesthetic initialized.',
            `
            color:#94A3B8;
            font-size:12px;
            font-family:Inter,sans-serif;
            `
        );
    });