# PostOpp

Quick symptom tracking for veterans. Log symptoms in 2-3 taps, track pain over time, and export reports for your doctor.

## What It Does

- **2-tap logging** — Open app, tap symptom, rate pain, done
- **4 symptoms on home screen** — Customizable from 16 veteran-specific defaults or create your own
- **Pain scale 1-10** — Large, color-coded buttons designed for ease of use
- **GPS + timestamp** — Every log captures when and where symptoms occur
- **Follow-up reminders** — Push notifications ask "How is it now?" after 30min/1hr/2hr
- **Trends & charts** — SVG pain charts per symptom over week/month/3 months
- **PDF export** — Generate a CONFIDENTIAL symptom report for doctor visits
- **JSON backup** — Export/import data to transfer between devices
- **Works offline** — PWA with service worker caching, installable on any device

## Privacy & Security

PostOpp is designed with veteran health data privacy as the top priority:

- **Local-only storage** — All data stays on your device. No accounts, no cloud, no servers
- **AES-256-GCM encryption** — Every symptom log is encrypted before touching IndexedDB
- **Optional PIN lock** — 4-digit PIN with PBKDF2 hashing and brute-force lockout
- **No analytics or tracking** — Zero telemetry, zero third-party scripts
- **HIPAA-exempt** — No covered entity, no cloud storage. Regulated by FTC Health Breach Notification Rule
- **Security headers** — HSTS, X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy

## Tech Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v4**
- **Dexie.js** (IndexedDB)
- **Web Crypto API** (AES-256-GCM, PBKDF2)
- **jsPDF** (PDF generation)
- **Vitest** (unit tests)
- **Vercel** (hosting)

## Getting Started

```bash
git clone https://github.com/kateparkervale/postopp.git
cd postopp
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Deploy

```bash
npm run build     # Static export to /out
npm test          # Run unit tests
npx vercel --prod # Deploy to Vercel
```

## Default Symptoms

PTSD, Migraine, Hip Pain, Sinus Infection, Back Pain, Knee Pain, Tinnitus, Anxiety, Depression, Insomnia, GI Issues, Shoulder Pain, Neck Pain, Fatigue, Dizziness, Headache

Users can also create custom symptoms with their own name, icon, and color.

## Medical Disclaimer

**PostOpp is NOT a medical device.** It does not diagnose, treat, or prevent any medical condition. PostOpp is a personal symptom tracker only. Always consult your VA medical team or healthcare provider for medical decisions.

**If you are experiencing a medical emergency, call 911. For the Veterans Crisis Line, dial 988 and press 1.**

## License

Open source. See repository for license details.
