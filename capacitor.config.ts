import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.condor.soatechapp',
  appName: 'Soatech',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_image_notification",
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '768878593957-29bp124t8ka428mbaqvbouqf58k84nn5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
