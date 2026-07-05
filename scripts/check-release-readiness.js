const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'app.json',
  'eas.json',
  'store.config.json',
  'APP_STORE_CONNECT_SETUP.md',
  'APP_STORE_METADATA.md',
  'APP_PRIVACY_ANSWERS.md',
  'RELEASE_STATUS.md',
  'RELEASE_CHECKLIST.md',
  'SCREENSHOT_GUIDE.md',
  'PRIVACY_POLICY.md',
  'SUPPORT.md',
  'docs/index.html',
  'docs/privacy.html',
  'docs/support.html',
  'assets/characters/senpai-construction.png',
  'assets/models/ai-model.gguf',
];

const requiredPackageScripts = [
  'typecheck',
  'lint',
  'doctor',
  'build:ios:prod',
  'build:inspect:ios',
  'submit:ios',
  'preflight:release',
  'check:public-urls',
  'check:privacy',
  'set:asc-app-id',
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
const storeConfig = readJson('store.config.json');

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
  warnings.push('eas.json submit.production.ios.ascAppId is not set yet. Run `npm run set:asc-app-id -- <Apple ID>` after creating the App Store Connect app.');
} else if (!/^\d+$/.test(String(productionSubmit.ascAppId))) {
  failures.push('eas.json submit.production.ios.ascAppId must be a numeric App Store Connect Apple ID.');
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

if (!scripts['metadata:lint']) {
  failures.push('Missing package script: metadata:lint');
}

if (storeConfig.configVersion !== 0) {
  failures.push('store.config.json must use configVersion 0.');
}

const appleInfoJa = storeConfig.apple && storeConfig.apple.info && storeConfig.apple.info.ja;
if (!appleInfoJa) {
  failures.push('store.config.json must include apple.info.ja.');
} else {
  assertEqual('store.config.json apple.info.ja.title', appleInfoJa.title, expected.appName);
  assertEqual('store.config.json apple.info.ja.supportUrl', appleInfoJa.supportUrl, 'https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/support.html');
  assertEqual('store.config.json apple.info.ja.privacyPolicyUrl', appleInfoJa.privacyPolicyUrl, 'https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html');
}

const metadata = fileExists('APP_STORE_METADATA.md')
  ? fs.readFileSync(path.join(root, 'APP_STORE_METADATA.md'), 'utf8')
  : '';
for (const phrase of ['プライバシーポリシーURL', 'サポートURL', 'App Review', 'RevenueCat']) {
  if (!metadata.includes(phrase)) {
    failures.push(`APP_STORE_METADATA.md is missing release phrase: ${phrase}`);
  }
}

const privacyAnswers = fileExists('APP_PRIVACY_ANSWERS.md')
  ? fs.readFileSync(path.join(root, 'APP_PRIVACY_ANSWERS.md'), 'utf8')
  : '';
for (const phrase of ['RevenueCat', 'AdMob', '購入情報', 'AsyncStorage', 'Firebase', 'クラウドLLM']) {
  if (!privacyAnswers.includes(phrase)) {
    failures.push(`APP_PRIVACY_ANSWERS.md is missing privacy phrase: ${phrase}`);
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

const releaseStatus = fileExists('RELEASE_STATUS.md')
  ? fs.readFileSync(path.join(root, 'RELEASE_STATUS.md'), 'utf8')
  : '';
for (const phrase of ['未完了の外部作業', 'ascAppId', 'Distribution Certificate', 'GitHub Actions CI']) {
  if (!releaseStatus.includes(phrase)) {
    failures.push(`RELEASE_STATUS.md is missing release status phrase: ${phrase}`);
  }
}

const appStoreConnectSetup = fileExists('APP_STORE_CONNECT_SETUP.md')
  ? fs.readFileSync(path.join(root, 'APP_STORE_CONNECT_SETUP.md'), 'utf8')
  : '';
for (const phrase of ['New App', 'com.gsw.pocketsenpai.sekoukanri', 'pocket-senpai-sekokan', 'set:asc-app-id']) {
  if (!appStoreConnectSetup.includes(phrase)) {
    failures.push(`APP_STORE_CONNECT_SETUP.md is missing setup phrase: ${phrase}`);
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
