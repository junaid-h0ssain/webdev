// @ts-ignore
import { fireApp } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updatePassword,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";

const auth = getAuth(fireApp);
const provider = new GoogleAuthProvider();
auth.languageCode = 'en';
// auth.settings.appVerificationDisabledForTesting = true; // Only for testing with Firebase emulator

/**
 * @param {string} email
 * @param {string} password
 */
function emailSignup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Signup successful:', user);
            return { success: true, user };
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === 'auth/email-already-in-use') {
                return { success: false, error: 'This email is already registered' };
            } else if (errorCode === 'auth/weak-password') {
                return { success: false, error: 'Password should be at least 6 characters' };
            } else {
                return { success: false, error: errorMessage };
            }
        });
}

/**
 * @param {string} email
 * @param {string} password
 */
async function emailLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Login successful:', user);
        return { success: true, user };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/user-not-found') {
            return { success: false, error: 'No account found with this email' };
        } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
            return { success: false, error: 'Invalid email or password' };
        } else {
            return { success: false, error: errorMessage };
        }
    }
}


function googleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log('Google login successful');
        }).catch((error) => {
            console.error('Google login error:', error.code, error.message);
        });
}

/**
 * @param {string} containerId
 */
async function initializeRecaptcha(containerId = 'recaptcha-container') {
    // @ts-ignore
    if (window.recaptchaVerifier) {
        // @ts-ignore
        return window.recaptchaVerifier;
    }

    // @ts-ignore
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'normal',
        'callback': () => console.log('reCAPTCHA verified'),
        'expired-callback': () => {
            console.log('reCAPTCHA expired');
            // @ts-ignore
            window.recaptchaVerifier = null;
        }
    });

    // Render the reCAPTCHA widget
    // @ts-ignore
    await window.recaptchaVerifier.render();
    // @ts-ignore
    return window.recaptchaVerifier;
}

/**
 * @param {string} phoneNumber
 * @param {string} recaptchaContainerId
 */
async function phoneLogin(phoneNumber, recaptchaContainerId = 'recaptcha-container') {
    try {
        const appVerifier = await initializeRecaptcha(recaptchaContainerId);
        
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        // @ts-ignore
        window.confirmationResult = confirmationResult;
        console.log('OTP sent to', phoneNumber);
        return { success: true, message: 'OTP sent to your phone' };
    } catch (error) {
        console.error('Phone login error:', error);
        // Reset reCAPTCHA on error so it can be re-rendered
        // @ts-ignore
        if (window.recaptchaVerifier) {
            // @ts-ignore
            window.recaptchaVerifier.clear();
            // @ts-ignore
            window.recaptchaVerifier = null;
        }
        
        if (error.code === 'auth/invalid-phone-number') {
            return { success: false, error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)' };
        } else if (error.code === 'auth/too-many-requests') {
            return { success: false, error: 'Too many requests. Please try again later' };
        } else {
            return { success: false, error: error.message || 'Failed to send OTP' };
        }
    }
}

/**
 * @param {string} code
 */
function verifyPhoneOtp(code) {
    // @ts-ignore
    if (!window.confirmationResult) {
        return Promise.resolve({ success: false, error: 'No OTP request found. Please request OTP first' });
    }

    // @ts-ignore
    return window.confirmationResult.confirm(code)
        .then((userCredential) => {
            // @ts-ignore
            window.confirmationResult = null;
            return { success: true, user: userCredential.user };
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-verification-code') {
                return { success: false, error: 'Invalid OTP code. Please try again' };
            } else if (error.code === 'auth/code-expired') {
                return { success: false, error: 'OTP code expired. Please request a new one' };
            } else {
                return { success: false, error: error.message };
            }
        });
}

function logout() {
    signOut(auth).catch((error) => console.error('Logout error:', error));
}

/**
 * @param {string} currentPassword
 * @param {string} newPassword
 */
async function changePassword(currentPassword, newPassword) {
    const user = auth.currentUser;
    
    if (!user) return { success: false, error: 'No user is currently logged in' };
    if (!user.email) return { success: false, error: 'User does not have an email associated' };

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        return { success: true, message: 'Password updated successfully' };
    } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            return { success: false, error: 'Current password is incorrect' };
        } else if (error.code === 'auth/weak-password') {
            return { success: false, error: 'New password should be at least 6 characters' };
        } else if (error.code === 'auth/requires-recent-login') {
            return { success: false, error: 'Please log in again before changing password' };
        } else {
            return { success: false, error: error.message };
        }
    }
}

/**
 * @param {string} email
 */
async function recoverPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent. Check your inbox.' };
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return { success: false, error: 'No account found with this email' };
        } else if (error.code === 'auth/invalid-email') {
            return { success: false, error: 'Invalid email address' };
        } else if (error.code === 'auth/too-many-requests') {
            return { success: false, error: 'Too many requests. Please try again later' };
        } else {
            return { success: false, error: error.message };
        }
    }
}

export { auth, emailSignup, emailLogin, googleLogin, phoneLogin, verifyPhoneOtp, logout, changePassword, recoverPassword };
