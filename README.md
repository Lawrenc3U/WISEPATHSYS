# WisePath

**A course recommendation and academic progress app for incoming college students.**

WisePath helps students explore degree programs, find programs that match their interests, and follow assessment-based progress. Administrators can manage the program catalog, questions, and student assessment records.

Academic capstone project — College of Information and Communications Technology, STI West Negros University.

## What WisePath does

### Student features
- Create an account and complete a profile with education, interests, goals, and preferences.
- Take a career assessment and see up to three ranked program matches.
- Read a guidance summary and compare program details.
- Browse curriculum, skills, career paths, duration, and tuition estimates when available.
- Complete assessments for a specific program and view the fit result.
- Track overall progress and completed, ongoing, and remaining subjects.
- Review assessment history and retake assessments.

### Administrator features
- View dashboard totals and recent activity.
- Add, edit, or remove degree programs.
- Manage career-assessment questions.
- Review student assessment records.

## Technology

- **Programming language:** TypeScript 5.9
- **Frontend:** React 19 and React Native 0.86, running with Expo SDK 57
- **Backend:** Firebase services, using Firebase Authentication for accounts and roles
- **Database:** Cloud Firestore, accessed through the Firebase JavaScript SDK 12
- **Navigation:** React Navigation 7
- **State management:** Zustand 4
- **Local authentication persistence:** AsyncStorage
- **UI and animation:** NativeWind, Lucide React Native, Expo Linear Gradient, and React Native Reanimated

## Requirements

- Node.js (current LTS recommended) and npm
- Expo Go, or Android Studio / Xcode for an emulator or simulator
- A Firebase project with Email/Password Authentication and Cloud Firestore enabled

## Setup

1. **Install the packages**

	```bash
	npm install
	```

2. **Set up Firebase configuration**

	Copy `.env.example` to `.env` and replace the example values with your Firebase web app configuration. Find those values in Firebase Console → Project settings → Your apps.

	```bash
	copy .env.example .env
	```

	The Firebase app ID should start with `1:`. The measurement ID is optional.

3. **Enable Firebase services and deploy rules**

	- Enable **Email/Password** under Firebase Console → Authentication → Sign-in method.
	- Create a Cloud Firestore database.
	- Review [firestore.rules](./firestore.rules), then deploy the rules:

	```bash
	firebase login
	firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
	```

4. **Run the app**

	```bash
	npm start
	```

	- Press `a` for Android or `i` for iOS, or scan the QR code using Expo Go.
	- If a device cannot connect, run `npx expo start --tunnel`.
	- Other available commands: `npm run android`, `npm run ios`, and `npm run web`.

## Admin account

The admin code is used when **registering** an administrator. It is not requested at sign-in.

- Choose the admin role on the registration screen.
- Enter the default code: **`wisepath-admin-2026`**.
- Finish registration with an email and password.
- Sign in with that email and password to open the admin area.

To change the default code for a local build, set `EXPO_PUBLIC_ADMIN_CODE` in `.env`. The code is included in the client app, so it is not a secure production credential. Use Firebase Authentication and Firestore rules to protect access, and change the default before distributing the app.

## System flow

### Student flow

1. **Create an account and profile.** Add information such as senior high school strand, interests, and learning goals.
2. **Complete the career assessment.** WisePath scores the answers and combines them with profile information and affordability details when available.
3. **View program matches.** The app ranks up to three programs and shows match percentages and program information.
4. **Explore a program.** Review its curriculum, skills, career paths, duration, and available tuition estimate.
5. **Complete program assessments.** Each program has its own assessments. A completed assessment is saved with a score; 75% or higher is marked as a fit for that program.
6. **Advance and review progress.** The career assessment initializes or updates progress for the top match. Completing program assessments can contribute evenly up to 60% of that program's progress bar. Higher existing curriculum progress is preserved. The progress screen also shows subjects, year/semester, and graduation readiness.
7. **Continue.** Return to recommendations, review assessment history, complete other program assessments, and check progress again.

### Administrator flow

- Register with the admin role and code.
- Sign in using the registered email and password.
- Use the dashboard to reach course management, assessment management, and student records.

## Recommendations and AI

WisePath currently creates program matches with a **weighted scoring system in the app**, not a local or cloud AI model. It scores each program using:

- **Career assessment answers:** Each answer adds points to one or more program areas according to the question's scoring weights.
- **Student profile:** Career interests, senior high school strand, and learning goals add points to related program areas. Selected skill level and learning style can also add points.
- **Affordability, when information is available:** The app compares the student's selected parental-income range with a program's estimated tuition and adds an affordability score. If either value is missing or the student prefers not to share income, this factor is not used.

The app combines these points, ranks the programs, and displays the top three. Match percentages are derived from the scores; they are not probabilities of success or guarantees that a student will fit a program.

The guidance summary on the Recommendations screen is a **simulated message generated locally** from the profile and highest-scoring program. It does not call an LLM.

**OpenAI integration point:** [services/openaiService.ts](./services/openaiService.ts) contains a separate helper that can send quiz-answer data to a backend at `POST /api/recommendations`. The backend must be hosted separately and would be responsible for calling OpenAI and returning recommendations. The current Recommendations screen does not call this helper, so WisePath does not currently send recommendation data to OpenAI. Setting `EXPO_PUBLIC_OPENAI_API_KEY` alone does not turn on OpenAI recommendations; never put a real OpenAI secret key in the Expo app. Store and use it only on the backend.

## Firestore data

- `users` — account role and student profile
- `courses` — degree programs and curriculum
- `quizQuestions` — career-assessment questions and scoring weights
- `assessments` — career-assessment results and recommendations
- `courseProgress` — each student's progress in a program
- `programAssessmentCompletions` — completed program assessments and fit scores

The app also includes local default program and assessment data. Firebase rules control access to Firestore data.

## Main project folders and files

- `App.tsx` — app entry point
- `navigation/` — root navigation and route types
- `screens/` — student, authentication, and admin screens
- `components/` — reusable interface components
- `services/` — Firebase, authentication, assessments, recommendations, and progress
- `stores/` — Zustand application state
- `utils/` — types, theme, constants, and assessment data
- `firestore.rules` — Firestore security rules
- `firebase.json` — Firebase CLI configuration
- `package.json` — dependencies and Expo commands

## Troubleshooting

- **Firestore says `Permission denied`:** Deploy and review `firestore.rules`. Confirm that the signed-in user has the expected role and owns the requested data.
- **Firebase configuration error:** Check the `.env` values, especially that `EXPO_PUBLIC_FIREBASE_APP_ID` starts with `1:`, then restart Expo.
- **Sign-in or registration fails:** Confirm Email/Password is enabled in Firebase Authentication.
- **Expo Go cannot connect:** Check phone/computer connectivity, disable VPN if needed, or use `npx expo start --tunnel`.
- **Progress is missing:** Sign in and complete the career assessment or a program assessment. Confirm Firestore rules allow access to the user's records.

## Project team

- De Leon, Sweet Angelu P.
- Esguerra, Shanela C.
- Galilea, Shan Mark G.
- Jorolan, Jeia A.
- Clauor, Josh Matthew E.

## License

Academic capstone project — STI West Negros University. All rights reserved by the project proponents unless otherwise stated by the institution.
