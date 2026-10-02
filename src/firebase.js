// firebase.js
//
// This file initializes Firebase and Firebase AI Logic.
//
// IMPORTANT SAFETY NOTES (read before touching this file):
// - This project must live on the Firebase "Spark" (free) plan.
// - Do NOT attach a Cloud Billing account to this Firebase project.
// - We use the Gemini Developer API backend (getGenerativeModel with a
//   GoogleAIBackend), NOT Vertex AI, because the Developer API has a
//   no-cost tier that does not require billing.
// - App Check is enabled to stop random people/bots from calling your
//   Gemini quota from outside this app.

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// All of these values come from your .env.local file (see .env.example).
// They are safe to expose in client code — Firebase web config is not secret,
// App Check + Gemini quotas are what actually protect you.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// --- App Check -------------------------------------------------------
//
// While developing locally, Firebase can't verify a real reCAPTCHA token
// from localhost, so we use the official App Check *debug token* flow.
// This still exercises the real App Check code path, it just uses a
// debug token instead of a production reCAPTCHA token.
//
// In production/deployed builds, set VITE_RECAPTCHA_SITE_KEY and remove
// the debug-token flag.
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-undef
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.VITE_RECAPTCHA_SITE_KEY || "debug-placeholder"
  ),
  isTokenAutoRefreshEnabled: true,
});

// --- Firebase AI Logic (Gemini Developer API) -------------------------
const ai = getAI(app, { backend: new GoogleAIBackend() });

// gemini-3.8-flash: fast + low latency, ideal for zero-cost tier tasks.
// Change "gemini-3.8-flash" to "gemini-3.5-flash-lite"
export const model = getGenerativeModel(ai, { model: "gemini-3.5-flash-lite" });