const fs = require('fs');
const path = require('path');

const appId = process.argv[2];

if (!appId || !/^\d+$/.test(appId)) {
  console.error('Usage: node scripts/set-asc-app-id.js <numeric App Store Connect Apple ID>');
  console.error('Example: node scripts/set-asc-app-id.js 1234567890');
  process.exit(1);
}

const easJsonPath = path.resolve(__dirname, '..', 'eas.json');
const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));

easJson.submit = easJson.submit || {};
easJson.submit.production = easJson.submit.production || {};
easJson.submit.production.ios = easJson.submit.production.ios || {};
easJson.submit.production.ios.ascAppId = appId;

fs.writeFileSync(easJsonPath, `${JSON.stringify(easJson, null, 2)}\n`);

console.log(`Set eas.json submit.production.ios.ascAppId to ${appId}`);
