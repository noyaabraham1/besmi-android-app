#!/bin/bash

# Create a focused Android project package
echo "Creating Android project package..."

# Create package directory
mkdir -p /tmp/besmi-android-package

# Copy essential files
cp -r android /tmp/besmi-android-package/
cp capacitor.config.ts /tmp/besmi-android-package/
cp package.json /tmp/besmi-android-package/
cp android-app-store-submission.md /tmp/besmi-android-package/

# Create setup instructions
cat > /tmp/besmi-android-package/README.md << 'EOF'
# Besmi Android App - Ready for App Store

## Quick Setup

1. Open Android Studio
2. File → Open → Select the "android" folder
3. Wait for Gradle sync to complete
4. Build → Generate Signed Bundle/APK
5. Follow android-app-store-submission.md guide

## Configuration
- App ID: com.besmi.lashbooking
- Production Server: https://besmi.replit.app
- Automatic updates enabled

Your app is ready for Google Play Store submission!
EOF

# Create archive
cd /tmp
zip -r besmi-android-project.zip besmi-android-package/
mv besmi-android-project.zip /home/runner/workspace/

# Cleanup
rm -rf /tmp/besmi-android-package

echo "✅ Android project package created: besmi-android-project.zip"
ls -lh /home/runner/workspace/besmi-android-project.zip