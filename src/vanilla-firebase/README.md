# Vanilla Firebase Auth

A simple vanilla JavaScript authentication app using Firebase and Vite.

## Features

- 📧 Email/Password signup & login
- 🔐 Google OAuth login
- 📱 Phone number login with OTP
- 🔑 Password change & recovery
- ⚡ Built with Vite for fast development

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase in `src/firebase-config.js`:
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

3. Enable authentication methods in [Firebase Console](https://console.firebase.google.com):
   - Authentication → Sign-in method → Enable Email/Password, Google, Phone

4. Add your domain to authorized domains (for phone auth):
   - Authentication → Settings → Authorized domains

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── main.js           # Entry point, UI & event handlers
├── login.js          # Firebase auth functions
├── firebase-config.js # Firebase configuration
└── style.css         # Styles
```

## License

MIT
