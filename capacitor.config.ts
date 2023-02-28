import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.condor.soatechapp',
  appName: 'Soatech',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_image_notification",
      iconColor: "#f5425d",
    },
  },
};

export default config;
