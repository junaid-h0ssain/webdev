import './style.css';
import { 
    auth, 
    emailSignup, 
    emailLogin, 
    googleLogin, 
    phoneLogin, 
    verifyPhoneOtp, 
    logout, 
    changePassword, 
    recoverPassword 
} from './login.js';
import { onAuthStateChanged } from "firebase/auth";

// Render HTML
document.querySelector('#app').innerHTML = `
<main>
    <!-- Loading State -->
    <div id="loading-section">
        <p>Loading...</p>
    </div>

    <!-- Logged In State -->
    <div id="logged-in-section" class="hidden">
        <h2>Welcome, <span id="user-display"></span>!</h2>
        <p>You are logged in.</p>
        
        <p id="logged-in-error" class="error hidden"></p>
        <p id="logged-in-success" class="success hidden"></p>

        <div id="post-view"></div>

        <div id="change-password-toggle">
            <button id="show-change-password-btn">Change Password</button>
        </div>
        
        <div id="change-password-form" class="hidden">
            <h3>Change Password</h3>
            <form id="change-password">
                <label for="current-password">Current Password:</label>
                <input type="password" id="current-password" required />
                <br />
                <label for="new-password">New Password:</label>
                <input type="password" id="new-password" required />
                <br />
                <button type="submit">Update Password</button>
                <button type="button" id="cancel-change-password">Cancel</button>
            </form>
        </div>

        <button id="logout-btn">Logout</button>
    </div>

    <!-- Logged Out State -->
    <div id="logged-out-section" class="hidden">
        <p id="logged-out-error" class="error hidden"></p>
        <p id="logged-out-success" class="success hidden"></p>

        <!-- Forgot Password Section -->
        <div id="forgot-password-section" class="hidden">
            <h2>Recover Password</h2>
            <form id="recover-password-form">
                <label for="recovery-email">Email:</label>
                <input type="email" id="recovery-email" required />
                <br />
                <button type="submit">Send Reset Email</button>
                <button type="button" id="back-to-login">Back to Login</button>
            </form>
        </div>

        <!-- Login/Signup Section -->
        <div id="auth-section">
            <h2>Sign Up</h2>
            <form id="signup-form">
                <label for="signup-email">Email:</label>
                <input type="email" id="signup-email" required />
                <br />
                <label for="signup-password">Password:</label>
                <input type="password" id="signup-password" required />
                <br />
                <button type="submit">Sign up with email</button>
            </form>

            <h2>Login</h2>
            <form id="login-form">
                <label for="login-email">Email:</label>
                <input type="email" id="login-email" required />
                <br />
                <label for="login-password">Password:</label>
                <input type="password" id="login-password" required />
                <br />
                <button type="submit">Login with email</button>
            </form>
            <button type="button" id="forgot-password-btn">Forgot Password?</button>

            <h2>Or</h2>
            <button id="google-login-btn">Sign in with Google</button>

            <h2>Phone Login</h2>
            <div id="phone-input-section">
                <form id="phone-login-form">
                    <label for="phone-number">Enter your number +880 1234567890</label>
                    <input type="tel" id="phone-number" placeholder="+1234567890" required />
                    <br />
                    <button type="submit">Send OTP</button>
                </form>
                <div id="recaptcha-container"></div>
            </div>
            
            <div id="otp-section" class="hidden">
                <form id="verify-otp-form">
                    <label for="otp-code">Enter OTP Code:</label>
                    <input type="text" id="otp-code" placeholder="000000" maxlength="6" required />
                    <br />
                    <button type="submit">Verify OTP</button>
                    <button type="button" id="back-from-otp">Back</button>
                </form>
            </div>
        </div>
    </div>
</main>
`;

// State
let user = null;

// DOM Elements
const loadingSection = document.getElementById('loading-section');
const loggedInSection = document.getElementById('logged-in-section');
const loggedOutSection = document.getElementById('logged-out-section');
const userDisplay = document.getElementById('user-display');

// Error/Success messages
const loggedInError = document.getElementById('logged-in-error');
const loggedInSuccess = document.getElementById('logged-in-success');
const loggedOutError = document.getElementById('logged-out-error');
const loggedOutSuccess = document.getElementById('logged-out-success');

// Change password elements
const changePasswordToggle = document.getElementById('change-password-toggle');
const changePasswordFormEl = document.getElementById('change-password-form');
const showChangePasswordBtn = document.getElementById('show-change-password-btn');
const cancelChangePasswordBtn = document.getElementById('cancel-change-password');

// Forgot password elements
const forgotPasswordSection = document.getElementById('forgot-password-section');
const authSection = document.getElementById('auth-section');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');
const backToLoginBtn = document.getElementById('back-to-login');

// Phone login elements
const phoneInputSection = document.getElementById('phone-input-section');
const otpSection = document.getElementById('otp-section');
const backFromOtpBtn = document.getElementById('back-from-otp');

// Helper functions
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
}

function clearMessages() {
    hideError(loggedInError);
    hideError(loggedInSuccess);
    hideError(loggedOutError);
    hideError(loggedOutSuccess);
}

function showSuccess(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function updateUI() {
    loadingSection.classList.add('hidden');
    
    if (user) {
        loggedInSection.classList.remove('hidden');
        loggedOutSection.classList.add('hidden');
        userDisplay.textContent = user.email || user.phoneNumber;
    } else {
        loggedInSection.classList.add('hidden');
        loggedOutSection.classList.remove('hidden');
    }
}

// Auth state listener
onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
    updateUI();
});

// Signup handler
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const result = await emailSignup(email, password);
    if (!result.success) {
        showError(loggedOutError, result.error);
    }
});

// Login handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const result = await emailLogin(email, password);
    if (!result.success) {
        showError(loggedOutError, result.error);
    }
});

// Google login
document.getElementById('google-login-btn').addEventListener('click', () => {
    googleLogin();
});

// Phone login handler
document.getElementById('phone-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const phoneNumber = document.getElementById('phone-number').value;
    const result = await phoneLogin(phoneNumber);
    if (result.success) {
        phoneInputSection.classList.add('hidden');
        otpSection.classList.remove('hidden');
    } else {
        showError(loggedOutError, result.error);
    }
});

// Verify OTP handler
document.getElementById('verify-otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const otpCode = document.getElementById('otp-code').value;
    const result = await verifyPhoneOtp(otpCode);
    if (!result.success) {
        showError(loggedOutError, result.error);
    } else {
        otpSection.classList.add('hidden');
        phoneInputSection.classList.remove('hidden');
        document.getElementById('otp-code').value = '';
        document.getElementById('phone-number').value = '';
    }
});

// Back from OTP
backFromOtpBtn.addEventListener('click', () => {
    otpSection.classList.add('hidden');
    phoneInputSection.classList.remove('hidden');
    document.getElementById('otp-code').value = '';
});

// Logout handler
document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
});

// Change password toggle
showChangePasswordBtn.addEventListener('click', () => {
    clearMessages();
    changePasswordToggle.classList.add('hidden');
    changePasswordFormEl.classList.remove('hidden');
});

cancelChangePasswordBtn.addEventListener('click', () => {
    changePasswordFormEl.classList.add('hidden');
    changePasswordToggle.classList.remove('hidden');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
});

// Change password handler
document.getElementById('change-password').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const currentPwd = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password').value;
    const result = await changePassword(currentPwd, newPwd);
    if (result.success) {
        showSuccess(loggedInSuccess, result.message);
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        changePasswordFormEl.classList.add('hidden');
        changePasswordToggle.classList.remove('hidden');
    } else {
        showError(loggedInError, result.error);
    }
});

// Forgot password toggle
forgotPasswordBtn.addEventListener('click', () => {
    clearMessages();
    authSection.classList.add('hidden');
    forgotPasswordSection.classList.remove('hidden');
});

backToLoginBtn.addEventListener('click', () => {
    forgotPasswordSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    document.getElementById('recovery-email').value = '';
});

// Recover password handler
document.getElementById('recover-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const recoveryEmail = document.getElementById('recovery-email').value;
    const result = await recoverPassword(recoveryEmail);
    if (result.success) {
        showSuccess(loggedOutSuccess, result.message);
        document.getElementById('recovery-email').value = '';
        forgotPasswordSection.classList.add('hidden');
        authSection.classList.remove('hidden');
    } else {
        showError(loggedOutError, result.error);
    }
});
