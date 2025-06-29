import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.besmi.lashbooking',
  appName: 'Besmi',
  webDir: 'client/dist',
  server: {
    androidScheme: 'https',
    url: process.env.NODE_ENV === 'production' ? 'https://besmi.replit.app' : 'http://localhost:5000',
    cleartext: process.env.NODE_ENV !== 'production'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "default",
      backgroundColor: "#ffffff"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    }
  }
};

export default config;
