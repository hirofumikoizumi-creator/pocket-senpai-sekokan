const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'app.json',
  'eas.json',
  'APP_STORE_METADATA.md',
  'RELEASE_CHECKLIST.md',
  'SCREENSHOT_GUIDE.md',
  'PRIVACY_POLICY.md',
  'SUPPORT.md',
  'assets/characters/senpai-construction.png',
  'assets/models/Qwen3-0.6B-Q8_0.gguf',
];

const requiredPackageScripts = [
  'typecheck',
  'lint',
  'doctor',
  'build:ios:prod',
  'build:inspect:ios',
  'submit:ios',
];

const expected = {
  appName: 'ポケット先輩（施工管理）',
  slug: 'pocket-senpai-sekokan',
  owner: 'hirofumikoizumi',
  projectId: 'cf290c01-7ed1-42e5-95f9-9c2b7f887201',
  bundleIdentifier: 'com.gsw.pocketsenpai.sekoukanri',
  androidPackage: 'com.pocketsenpai.sekokan',
  scheme: 'pocket-senpai',
};

const failures = [];
const warnings = [];

function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    failures.push(`${relativePath} could not be read as JSON: ${error.message}`);
    return {};
  }
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assertEqual(label, actual, expectedValue) {
  if (actual !== expectedValue) {
    failures.push(`${label} expected "${expectedValue}" but found "${actual}"`);
  }
}

for (const file of requiredFiles) {
  if (!fileExists(file)) {
    failures.push(`Missing required release file: ${file}`);
  }
}

const appJson = readJson('app.json');
const easJson = readJson('eas.json');
const packageJson = readJson('package.json');

const expo = appJson.expo || {};
assertEqual('expo.name', expo.name, expected.appName);
assertEqual('expo.slug', expo.slug, expected.slug);
assertEqual('expo.owner', expo.owner, expected.owner);
assertEqual('expo.scheme', expo.scheme, expected.scheme);
assertEqual('expo.extra.eas.projectId', expo.extra && expo.extra.eas && expo.extra.eas.projectId, expected.projectId);
assertEqual('expo.ios.bundleIdentifier', expo.ios && expo.ios.bundleIdentifier, expected.bundleIdentifier);
assertEqual('expo.android.package', expo.android && expo.android.package, expected.androidPackage);

if (expo.ios && expo.ios.infoPlist && expo.ios.infoPlist.ITSAppUsesNonExemptEncryption !== false) {
  failures.push('expo.ios.infoPlist.ITSAppUsesNonExemptEncryption must be false for current release metadata.');
}

if (!Array.isArray(expo.plugins) || !JSON.stringify(expo.plugins).includes('llama.rn')) {
  failures.push('llama.rn plugin is not configured in app.json.');
}

const productionBuild = easJson.build && easJson.build.production;
if (!productionBuild || !productionBuild.ios || productionBuild.ios.autoIncrement !== true) {
  failures.push('eas.json production iOS build must enable autoIncrement.');
}

const productionSubmit = easJson.submit && easJson.submit.production && easJson.submit.production.ios;
if (!productionSubmit || !productionSubmit.appleId || !productionSubmit.appleTeamId) {
  failures.push('eas.json submit.production.ios must include appleId and appleTeamId.');
}

if (!productionSubmit || !productionSubmit.ascAppId) {
  warnings.push('eas.json submit.production.ios.ascAppId is not set yet. Add it after creating the App Store Connect app.');
}

const scripts = packageJson.scripts || {};
for (const script of requiredPackageScripts) {
  if (!scripts[script]) {
    failures.push(`Missing package script: ${script}`);
  }
}

if (!scripts['build:ios:prod'] || !scripts['build:ios:prod'].includes('eas-cli@latest')) {
  failures.push('build:ios:prod should use eas-cli@latest.');
}

const metadata = fileExists('APP_STORE_METADATA.md')
  ? fs.readFileSync(path.join(root, 'APP_STORE_METADATA.md'), 'utf8')
  : '';
for (const phrase of ['プライバシーポリシーURL', 'サポートURL', 'App Review', 'このアプリからデータを収集しない']) {
  if (!metadata.includes(phrase)) {
    failures.push(`APP_STORE_METADATA.md is missing release phrase: ${phrase}`);
  }
}

const checklist = fileExists('RELEASE_CHECKLIST.md')
  ? fs.readFileSync(path.join(root, 'RELEASE_CHECKLIST.md'), 'utf8')
  : '';
for (const phrase of ['EXPO_TOKEN', 'credentials:configure-build', 'ascAppId', 'Distribution Certificate']) {
  if (!checklist.includes(phrase)) {
    failures.push(`RELEASE_CHECKLIST.md is missing release phrase: ${phrase}`);
  }
}

if (failures.length > 0) {
  console.error('Release readiness check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Release readiness check passed.');
if (warnings.length > 0) {
  console.log('Warnings:');
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}
