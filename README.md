# RapidLearn

RapidLearn is a Next.js learning app. The Android APK is generated automatically with **Capacitor 7** and GitHub Actions.

## Android APK build (no manual keystore)

This project uses the same Capacitor wrapper approach as ReelRadar:

- GitHub Actions generates a lightweight Android wrapper.
- Capacitor 7 loads the deployed RapidLearn website inside Android WebView.
- Gradle builds an automatically debug-signed APK.
- No Bubblewrap, manual keystore, signing passwords, or Android signing GitHub secrets are required.

### 1. Deploy RapidLearn

Deploy the Next.js app to Vercel and make sure the public website is reachable over HTTPS.

### 2. Add one GitHub repository variable

In your GitHub repository, open:

**Settings → Secrets and variables → Actions → Variables → New repository variable**

Add:

| Name | Value |
|---|---|
| `RAPIDLEARN_URL` | Your deployed Vercel URL, e.g. `https://your-project.vercel.app` |

Optional:

| Name | Value |
|---|---|
| `ANDROID_APP_ID` | Android package ID; defaults to `com.rapidlearn.app` |

Keep the Android app ID stable after distributing the app. Changing it creates a separate Android app.

**You do not need to add any GitHub signing secrets.**

### 3. Run the workflow

The workflow starts automatically when you push to `main` or `master`. You can also run it manually:

1. Open the repository's **Actions** tab.
2. Select **Build RapidLearn Android APK**.
3. Select **Run workflow**.

### 4. Download the APK

When the workflow succeeds:

1. Open the completed workflow run.
2. Scroll to **Artifacts**.
3. Download `rapidlearn-android-debug-<run number>`.
4. Extract the ZIP and install `app-debug.apk` on your Android device.

This is an installable **debug APK**, not a Play Store release bundle. Because GitHub's build runner creates its debug signing key automatically, a later APK may have a different debug signature. If Android refuses to install a newer build over an older one, uninstall the previous RapidLearn app first, then install the new APK. This removes app-local data.

## How the Android app works

The Android wrapper loads the live website at `RAPIDLEARN_URL`. Your Next.js API routes and Gemini, Wikipedia, NASA, and quiz integrations continue to run through the deployed web app. An internet connection is required for the website and live API features.

The wrapper is generated in `android-wrapper/` during GitHub Actions; generated Android project files are not required in the repository.

## Local development

Run the web app as usual:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
