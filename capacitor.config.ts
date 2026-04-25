import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'xyz.chatboxapp.chatbox',
  appName: 'Chatbox',
  webDir: 'release/app/dist/renderer',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: 'automatic',
  },
}

export default config
