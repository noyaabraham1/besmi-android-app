#!/bin/bash

# Create Complete Android Build Package for Besmi
echo "Creating complete Android build package..."

# Create build directory
mkdir -p besmi-android-build

# Copy essential Android project files
echo "Copying Android project files..."
cp -r android besmi-android-build/
cp capacitor.config.ts besmi-android-build/
cp package.json besmi-android-build/
cp -r client/dist besmi-android-build/web-assets/

# Copy build guides
cp ANDROID_BUILD_READY.md besmi-android-build/
cp android-studio-build-guide.md besmi-android-build/
cp android-studio-import-guide.md besmi-android-build/
cp BUILD_COMPLETE_PACKAGE.md besmi-android-build/

# Create build instructions
cat > besmi-android-build/BUILD_INSTRUCTIONS.md << 'EOF'
# Besmi Android Build Instructions

## Quick Start
1. Open Android Studio
2. Select "Open an Existing Project"
3. Navigate to and select the `android` folder
4. Wait for Gradle sync to complete
5. Build → Build Bundle(s) / APK(s) → Build APK(s)
6. Select release variant
7. APK will be generated at: android/app/build/outputs/apk/release/app-release.apk

## Project Configuration
- App ID: com.besmi.lashbooking
- App Name: Besmi
- Production Server: https://besmi.replit.app
- Plugins: 7 Capacitor plugins configured

## Features Included
- Mobile-optimized toggle buttons (70px width)
- Enhanced business hours interface
- Complete lash booking system
- Automatic updates from web platform
EOF

# Create archive
echo "Creating archive..."
tar -czf besmi-android-complete.tar.gz besmi-android-build/

echo "Build package created: besmi-android-complete.tar.gz"
echo "Package includes:"
echo "- Complete Android project"
echo "- Build instructions"
echo "- Production configuration"
echo "- Latest mobile optimizations"