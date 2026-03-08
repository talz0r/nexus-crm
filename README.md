# Nexus CRM

## Setup

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Fill in the Firebase values from **Firebase Console > Project settings > General > Your apps (Web app)**.
3. Add your deploy domain in **Firebase Authentication > Settings > Authorized domains**.
4. Run:
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
