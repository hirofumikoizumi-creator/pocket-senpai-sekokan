const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const appJson = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));

const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const blockedPackages = [
  'firebase',
  '@react-native-firebase/app',
  '@react-native-firebase/analytics',
  '@react-native-firebase/auth',
  '@react-native-firebase/firestore',
  '@react-native-firebase/messaging',
  'react-native-google-mobile-ads',
  'expo-ads-admob',
  'expo-firebase-analytics',
  'expo-location',
  'expo-camera',
  'expo-media-library',
  'expo-notifications',
  'expo-tracking-transparency',
  '@react-native-community/geolocation',
  'axios',
];

const blockedFiles = [
  'src/services/firebase.ts',
  'src/services/adService.ts',
  'src/components/AdBanner.tsx',
  'GoogleService-Info.plist',
  'google-services.json',
];

const blockedAppJsonKeys = [
  'firebaseApiKey',
  'firebaseAuthDomain',
  'firebaseProjectId',
  'firebaseStorageBucket',
  'firebaseMessagingSenderId',
  'firebaseAppId',
  'adMobAppId',
];

const failures = [];

for (const packageName of blockedPackages) {
  if (dependencies[packageName]) {
    failures.push(`Blocked privacy-sensitive package is installed: ${packageName}`);
  }
}

for (const relativePath of blockedFiles) {
  if (fs.existsSync(path.join(root, relativePath))) {
    failures.push(`Blocked placeholder or service file is present: ${relativePath}`);
  }
}

const extra = (appJson.expo && appJson.expo.extra) || {};
for (const key of blockedAppJsonKeys) {
  if (Object.prototype.hasOwnProperty.call(extra, key)) {
    failures.push(`app.json expo.extra must not include ${key} for the current no-data-collection release.`);
  }
}

const plugins = JSON.stringify(appJson.expo && appJson.expo.plugins ? appJson.expo.plugins : []);
for (const pluginName of ['expo-location', 'expo-camera', 'expo-notifications', 'expo-tracking-transparency']) {
  if (plugins.includes(pluginName)) {
    failures.push(`app.json plugins must not include ${pluginName} for the current no-data-collection release.`);
  }
}

if (failures.length > 0) {
  console.error('Privacy implementation check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Privacy implementation check passed.');
