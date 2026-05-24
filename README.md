# WisePath

**A SMART Course Recommendation with Progress Tracker for Incoming College Students**

WisePath is a mobile application built for senior high school and incoming college students who need help choosing a college program. It combines self-assessment, personalized course recommendations across multiple programs, academic progress tracking, and an admin overview for school staff.

Capstone project — College of Information and Communications Technology, STI West Negros University.

---

## Features

### Student
- **Account** — Register, sign in, and complete a learning profile
- **Career assessment** — Multi-question quiz that ranks all programs with fit percentages
- **Recommendations** — View top match and alternative programs
- **Course explorer** — Program details, curriculum, careers, and skills
- **Progress tracker** — Track completed, ongoing, and remaining subjects per program
- **Profile** — View strengths, assessment history, retake quiz, or remove past assessments

### Admin
- **Overview dashboard** — Total students, active assessments, completion rate, total courses, recent activity
- **Course management** — Add, edit, or remove degree programs
- **Assessment management** — Manage quiz questions
- **Records** — View student assessment data

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Mobile | [Expo](https://expo.dev) SDK 54, React Native 0.81, React 19 |
| Navigation | React Navigation (native stack) |
| State | Zustand |
| Backend | Firebase Authentication, Cloud Firestore |
| UI | Lucide icons, Expo Linear Gradient |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- [npm](https://www.npmjs.com/) or yarn
- [Expo Go](https://expo.dev/go) on your phone (for device testing), or Android Studio / Xcode for emulators
- A [Firebase](https://console.firebase.google.com/) project with **Email/Password** auth and **Firestore** enabled
- [Firebase CLI](https://firebase.google.com/docs/cli) (optional, for deploying security rules)

---

## Getting started

### 1. Clone and install

```bash
cd WISEPATHSYS
npm install
```

### 2. Environment variables

Copy the example env file and fill in your Firebase web app config (Firebase Console → Project settings → Your apps):

```bash
copy .env.example .env
```

Required variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Optional:

```env
EXPO_PUBLIC_ADMIN_CODE=wisepath-admin-2026
```

### 3. Firebase setup

1. **Authentication** → Sign-in method → enable **Email/Password**
2. **Firestore** → Create database (production or test mode, then apply rules)
3. Deploy security rules from this repo:

```bash
firebase login
firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
```

Rules live in [`firestore.rules`](./firestore.rules). They allow:
- Students to read/write their own profile, assessments, and course progress
- Public read for courses and quiz questions
- Admins to manage content and view overview data

### 4. Seed data (admin)

1. Register an account using the **admin registration code** (`EXPO_PUBLIC_ADMIN_CODE`, default `wisepath-admin-2026`)
2. Open **Admin** → use **Courses** / **Questions** screens, or seed default programs and quiz items when collections are empty (on first admin load)

Default programs: **Hospitality Management**, **Information Technology**, **Criminal Justice**.

### 5. Run the app

```bash
npm start
```

Then:
- Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with **Expo Go**
- For connection issues on a physical device, try: `npx expo start --tunnel`

Other scripts:

```bash
npm run android
npm run ios
npm run web
```

---

## User flows

### Student
1. **Register** → **Profile setup** → **Dashboard**
2. Take **Assessment** → view **Recommendations** (all programs ranked)
3. Open a **Course** → **Start Course** → **Progress** screen
4. **Profile** — review history, retake assessment, or remove records

### Admin
1. Register with admin code → **Admin Overview**
2. Use **Courses**, **Questions**, or **Records** from the manage row at the bottom

---

## Project structure

```
WISEPATHSYS/
├── App.tsx                 # App entry
├── navigation/             # Root navigator, route types
├── screens/                # UI screens (auth, student, admin)
├── components/             # Reusable UI (buttons, cards, etc.)
├── services/               # Firebase, auth, quiz, progress, admin
├── stores/                 # Zustand state (auth, user, courses)
├── utils/                  # Types, theme, constants, sample data
├── firestore.rules         # Firestore security rules
├── firebase.json           # Firebase project config
├── metro.config.js         # Metro bundler (Firebase compatibility)
└── .env.example            # Environment template
```

---

## Firestore collections

| Collection | Purpose |
|------------|---------|
| `users` | Account role, profile, `profileComplete` |
| `courses` | Degree programs (title, curriculum, careers, skills) |
| `quizQuestions` | Assessment questions and scoring weights |
| `assessments` | Student quiz results and recommendations |
| `courseProgress` | Per-student, per-program academic progress |

Progress document IDs: `{userId}__{courseId}`.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| `Permission denied` on Firestore | Deploy `firestore.rules` and sign out/in |
| Firebase Auth configuration error | Check `.env` values, especially `APP_ID` format (`1:...`) |
| Auth not registered (Expo) | Ensure `metro.config.js` has `unstable_enablePackageExports: false` |
| Expo Go won’t connect | Same Wi‑Fi, disable VPN, or use `--tunnel` |
| Assessment delete fails | Rules must allow student `delete` on own `assessments` |

---

## Team

- De Leon, Sweet Angelu P.
- Esguerra, Shanela C.
- Galilea, Shan Mark G.
- Jorolan, Jeia A.
- Legaspi, Jezreel G.

---

## License

Academic capstone project — STI West Negros University. All rights reserved by the project proponents unless otherwise stated by the institution.
