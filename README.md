# Gemini Firebase Demo

A small, deliberately minimal sandbox to prove out **React → Firebase AI
Logic → Gemini** before using it in the real ProjectenPlaats project, and to
show the teacher exactly how API cost/usage is controlled.

This repo does **not** touch ProjectenPlaats. It is a separate Firebase
project on the free **Spark plan**, with **no billing account attached**.

## Architecture

```
                     DEMO

              ┌───────────────┐
              │     React     │
              │   Web App     │
              └───────┬───────┘
                      │
                      │ Firebase AI Logic SDK
                      ▼
              ┌───────────────┐
              │ Firebase AI   │
              │    Logic      │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │    Gemini     │
              │ Developer API │
              └───────┬───────┘
                      │
                      │ JSON
                      ▼
              ┌───────────────┐
              │ React Result  │
              └───────────────┘
```

The app sends a short "project idea" string to Gemini (`gemini-2.5-flash`)
via the Firebase AI Logic SDK, asks it to return structured JSON matching
ProjectenPlaats' project shape (title, description, objectives, tasks,
skills, deliverables), and renders it.

## Cost / abuse protection

This is the part that matters most:

```
Firebase Spark plan   (no billing account can be charged)
        +
Gemini free tier      (Gemini Developer API no-cost tier)
        +
App Check              (blocks requests from outside this app)
        +
Client request limiter (hard stop at 10 requests per browser session)
        +
Gemini quotas          (Google's own per-minute/per-day request limits)
```

Specifically:

- **No billing account.** The Firebase project stays on Spark. Without a
  billing account attached, Google cannot charge this project, full stop.
- **Gemini Developer API, not Vertex AI.** We explicitly use
  `GoogleAIBackend()` (Gemini Developer API), which has a no-cost tier,
  rather than the Vertex AI backend, which requires billing.
- **App Check.** Enforced on the Firebase AI Logic backend so only
  requests from this specific app (not random scripts hitting the API
  directly) are accepted.
- **Client-side limiter.** `MAX_REQUESTS_PER_SESSION = 10` in `App.jsx`
  hard-stops the UI after 10 generate calls per browser session. This is a
  teaching/safety aid, not the real security boundary — Google's own
  Gemini quotas and App Check are what actually protect the account.

## Project structure

```
src/
├── components/
│   ├── ProjectInput.jsx    # idea textarea + generate button
│   ├── ProjectResult.jsx   # renders result / loading / error states
│   └── UsageCounter.jsx    # "Requests this session: n / 10"
├── services/
│   └── gemini.js           # prompt + call to Gemini + JSON parsing
├── App.jsx                 # state + the request limiter
├── firebase.js             # Firebase + App Check + AI Logic init
├── main.jsx
└── styles.css
```

Deliberately **not** included: authentication, Firestore, Cloud Functions,
a backend server, Ollama, or any ProjectenPlaats production code. The goal
is to isolate exactly one thing: React talking to Gemini through Firebase.

## Setup

1. **Create a separate Firebase project** in the
   [Firebase console](https://console.firebase.google.com/), e.g.
   `projectenplaats-ai-demo`. Do **not** reuse the ProjectenPlaats project.
2. When prompted to set up AI, choose **Gemini Developer API** (not
   Vertex AI / Agent Platform), and do **not** link a billing account.
3. Add a Web app in the Firebase console and copy its config values.
4. Copy `.env.example` to `.env.local` and fill in those values:
   ```
   cp .env.example .env.local
   ```
5. Install dependencies and run:
   ```
   npm install
   npm run dev
   ```
6. On first run in dev mode, the console will print an App Check debug
   token. Register that token in Firebase console → App Check → Apps →
   Manage debug tokens, so local requests are accepted.

## Demo script for the teacher

1. **Normal request** — type an idea like *"I want a Unity game where
   players run a pancake restaurant"* and click Generate. Show the
   structured JSON result rendered as title/objectives/tasks/skills.
2. **Bad input** — type something like `asdfgh` and generate. Show that
   the app still responds sensibly instead of crashing.
3. **Loading state** — click Generate and point out the "Generating..."
   state before the result appears.
4. **Error handling** — (optional) temporarily break the API key or
   disconnect network to show the "Unable to generate the project. You
   can try again later." message instead of a crash.
5. **Safety limiter** — click Generate repeatedly and show the counter
   climbing (`Requests this session: n / 10`) until it stops at 10 with
   the "Demo request limit reached" message.

## Next steps (only after teacher approval)

This demo stays separate until the architecture is approved. Integrating
any of this into ProjectenPlaats itself — real Firestore data, auth,
production quotas — is a deliberately separate follow-up step.
