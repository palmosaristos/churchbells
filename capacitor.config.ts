import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b701d68cfaea4582a088f82817681112',
  appName: 'churchbells',
  webDir: 'dist',
  server: {
    url: 'https://b701d68c-faea-4582-a088-f82817681112.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;