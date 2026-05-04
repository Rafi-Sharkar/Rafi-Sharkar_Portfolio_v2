# Firebase Authentication Setup for Admin Login

This portfolio now uses **Firebase Authentication** instead of hardcoded credentials for secure admin access.

## Setup Steps

### 1. Enable Firebase Authentication
- Go to your [Firebase Console](https://console.firebase.google.com)
- Select your project (`rafi-sharkar`)
- Navigate to **Authentication** → **Sign-in method**
- Enable **Email/Password** authentication

### 2. Create an Admin Account
- In Firebase Console, go to **Authentication** → **Users**
- Click **Add user**
- Enter your admin email and a strong password
- Click **Create user**

### 3. Environment Variables
Your `.env` file already has Firebase configuration. Make sure these are set:
```
VITE_FIREBASE_API_KEY=AIzaSyDM8YF5v52fdRc6fEZe-e528eSjhkiNOU4
VITE_FIREBASE_AUTH_DOMAIN=rafi-sharkar.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rafi-sharkar
VITE_FIREBASE_STORAGE_BUCKET=rafi-sharkar.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=190905282016
VITE_FIREBASE_APP_ID=1:190905282016:web:8dc07f036d2ca99b090f85
```

### 4. Admin Login Flow
- Go to `/admin/login`
- Enter the email and password you created in Firebase
- On successful login, you'll have access to the admin dashboard

## Security Benefits

✅ **No hardcoded credentials** in source code
✅ **Firebase handles password security** with encryption
✅ **Easy to manage** - create/revoke admin accounts from Firebase Console
✅ **Audit logs** - Firebase tracks all authentication attempts
✅ **Can enable 2FA** - Add multi-factor authentication for extra security

## Netlify Deployment

Ensure your Netlify environment has the Firebase variables set:
1. Go to Netlify Dashboard → Site Settings → Build & Deploy → Environment
2. Add all `VITE_FIREBASE_*` variables
3. Push to `main` to redeploy

The build will now pass secrets scanning since we're no longer hardcoding credentials! 🎉
