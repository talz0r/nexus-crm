# Nexus CRM

Production-ready setup guide for **Firebase + GitHub + Vercel**.

---

## 1) Local setup (must do first)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env file from template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and paste your Firebase Web App values from:
   **Firebase Console → Project settings → General → Your apps → Web app config**.
4. Start locally:
   ```bash
   npm run dev
   ```
5. Build validation:
   ```bash
   npm run build
   ```

> If any `VITE_FIREBASE_*` key is missing, the app shows a setup screen with the missing keys list.

---

## 2) Required Firebase configuration

### A. Authentication
1. Go to **Firebase Console → Authentication → Sign-in method**.
2. Enable **Email/Password** provider.
3. Save.

### B. Authorized domains
1. Go to **Firebase Console → Authentication → Settings → Authorized domains**.
2. Ensure all domains are listed:
   - `localhost`
   - your Firebase hosting domains (`*.firebaseapp.com`, `*.web.app`)
   - your Vercel production domain (for example: `your-app.vercel.app`)
   - any custom domain you use

### C. API key restrictions (Google Cloud Console)
If login/register still fails after A+B:
1. Open **Google Cloud Console → APIs & Services → Credentials**.
2. Open the Web API key used by Firebase.
3. Under **Application restrictions**:
   - either set to **None** (quick test), or
   - **HTTP referrers** and allow your exact site origins.
4. If restricted by API list, make sure required Firebase APIs are allowed.

---

## 3) GitHub secure workflow

1. Keep `.env` out of git (already in `.gitignore`).
2. Commit only `.env.example`.
3. If GitHub alerts "Secrets detected":
   - rotate/restrict the affected key,
   - push updated safe config,
   - resolve the alert in GitHub Security tab.

---

## 4) Vercel deployment (recommended)

1. Import repo into Vercel.
2. In Vercel project settings, add Environment Variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Redeploy.
4. Add Vercel domain in Firebase Authorized domains.

---

## 5) Deploying elsewhere (Netlify / Render / self-hosted)

Use the same `VITE_FIREBASE_*` environment variables in that platform and redeploy.
Also ensure the deployed domain is added in Firebase Authorized domains.

---

## 6) Fast troubleshooting checklist

If authentication still fails:
1. Confirm env values are from the **same Firebase project**.
2. Confirm Email/Password provider is enabled.
3. Confirm deployed domain exists in Authorized domains.
4. Confirm API key restrictions are not blocking your domain/referrer.
5. Redeploy and hard refresh browser.

The app now displays Firebase `code` + message under errors to speed up diagnosis.
