# Android Studio Import Guide - Besmi

## Option 1: Direct Project Import (Recommended)

### Step 1: Download Project Files
You can download your complete Android project from Replit:
1. In Replit, go to the `android` folder in your file tree
2. Right-click on the `android` folder → "Download as zip"
3. Extract the zip file on your local machine

### Step 2: Open in Android Studio
1. **Launch Android Studio**
2. **Select**: "Open an Existing Project" (not "Start a new Android Studio project")
3. **Navigate to**: Your extracted `android` folder
4. **Select**: The `android` folder (should show Android icon)
5. **Click**: "OK"

## Option 2: Import via Capacitor (If you have the full project)

If you have the complete Besmi project locally:
```bash
# In your project root
npx cap sync android
npx cap open android
```

## Project Configuration Already Set

Your Android project is pre-configured with:
- **App ID**: `com.besmi.lashbooking`
- **App Name**: `Besmi`
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 22 (Android 5.1)
- **Server URL**: `https://besmi.replit.app`

## Build Instructions

Once opened in Android Studio:

### For Testing (Debug APK)
1. **Menu**: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. **Select**: `app-debug.apk`
3. **Install**: Transfer to your Android device and install

### For Production (Release APK)
1. **Menu**: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. **Select**: `app-release.apk`
3. **Location**: `android/app/build/outputs/apk/release/app-release.apk`

### For Google Play Store (App Bundle)
1. **Menu**: `Build` → `Generate Signed Bundle / APK`
2. **Select**: `Android App Bundle`
3. **Create keystore** (first time only)
4. **Output**: `android/app/build/outputs/bundle/release/app-release.aab`

## Troubleshooting

### If Gradle Sync Fails
1. **Menu**: `File` → `Sync Project with Gradle Files`
2. **Or**: Click the "Sync Now" banner if it appears

### If Dependencies Missing
1. **Menu**: `Tools` → `SDK Manager`
2. **Install**: Android SDK Platform 34
3. **Install**: Android SDK Build-Tools 34.0.0

### If Build Fails
1. **Menu**: `Build` → `Clean Project`
2. **Then**: `Build` → `Rebuild Project`

## Your App Features

The built APK will include:
- Complete lash booking system
- Enhanced mobile toggle buttons
- Client management
- Payment processing
- Camera integration
- Push notifications
- Automatic updates from web platform

## Next Steps After Build

1. **Test locally**: Install debug APK on your device
2. **Prepare for store**: Create signed release APK/AAB
3. **Google Play Console**: Upload AAB for store submission
4. **Update anytime**: Web platform changes automatically appear in app