# Nexus CRM

## Setup

The project now includes a default Firebase config for quick start.

1. (Recommended) Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Fill in the Firebase values from **Firebase Console > Project settings > General > Your apps (Web app)**.
3. Add your deploy domain in **Firebase Authentication > Settings > Authorized domains**.
4. If you skip `.env`, the app uses built-in fallback values from the configured Firebase project.
5. Run:
   ```bash
   npm install
   npm run dev
   ```

## Security note (GitHub secret alert)

A Firebase API key was previously committed. Even though Firebase API keys are client-side by design, once flagged you should:

1. In Google Cloud Console, restrict the key to your allowed websites (HTTP referrers).
2. If needed, create a new Web API key and update `.env`.
3. In Firebase Authentication, ensure only expected domains are authorized.
4. Mark the GitHub secret alert as resolved after rotation/restriction.


## Quick fix for "Firebase config missing" screen

If login shows a Firebase setup error:

1. `cp .env.example .env`
2. Paste your Firebase Web App values into `.env`
3. Restart dev server or redeploy production

> The app now shows exactly which `VITE_FIREBASE_*` keys are missing on-screen.
