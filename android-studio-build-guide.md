# Android Studio Build Guide - Besmi Production Release

## Quick Setup for Android Studio Build

### 1. Open Project in Android Studio
```bash
# Navigate to your project directory and run:
npx cap open android
```

This opens your Besmi Android project in Android Studio with proper configuration.

### 2. Verify Project Configuration

Your project is already configured with:
- **App ID**: `com.besmi.lashbooking`
- **App Name**: `Besmi`
- **Server URL**: Points to `https://besmi.replit.app` for production
- **Required permissions**: Camera, Internet, Vibrate, Storage

### 3. Generate Production Build

#### Option A: Release APK (Simple)
1. In Android Studio: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Select "release" variant
3. APK generated in: `android/app/build/outputs/apk/release/`

#### Option B: App Bundle (Recommended for Play Store)
1. In Android Studio: `Build` → `Generate Signed Bundle / APK`
2. Select "Android App Bundle"
3. Create/use keystore for signing
4. Select "release" build variant
5. AAB generated in: `android/app/build/outputs/bundle/release/`

### 4. Create Keystore (First Time Only)
```bash
keytool -genkey -v -keystore besmi-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias besmi-key
```

**Save these details securely:**
- Keystore file location
- Keystore password
- Key alias and password

### 5. Test Release Build
- Install APK on test device
- Verify app connects to production server
- Test core functions: login, booking, camera, notifications

### 6. Build Configuration Details

Your `capacitor.config.ts` is already optimized for production:
```typescript
server: {
  url: 'https://besmi.replit.app',  // Production server
  androidScheme: 'https'
}
```

This means your Android app will:
- Connect directly to your live Replit server
- Receive automatic updates when you update the web platform
- Work with live payment processing and notifications

## Common Build Issues & Solutions

### Build Errors
```bash
# Clean and rebuild if needed
cd android
./gradlew clean
./gradlew assembleRelease
```

### Java/SDK Issues
- Ensure JDK 11+ is installed
- Set JAVA_HOME environment variable
- Update Android SDK through Android Studio

### Network Security
Your app uses HTTPS connection to production server, which is properly configured for Android security requirements.

## Production Checklist

- [ ] App builds successfully in release mode
- [ ] Connects to https://besmi.replit.app
- [ ] All permissions work (camera, notifications)
- [ ] No crashes or critical bugs
- [ ] Keystore created and secured
- [ ] Release signed with production keystore

## Next Steps After Build

1. **Test thoroughly** on multiple devices
2. **Upload to Google Play Console** (use the generated AAB file)
3. **Submit for review** with proper app store listing
4. **Monitor for approval** (typically 1-3 days)

Your mobile app will automatically receive updates whenever you update the web platform - no new builds required for content/feature changes.