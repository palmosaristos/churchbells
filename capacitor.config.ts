import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sacredbells.app',
  appName: 'Sacred Bells',
  webDir: 'dist',
  android: {
    backgroundColor: '#1a1f2e'
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1f2e'
    }
  }
};

export default config;