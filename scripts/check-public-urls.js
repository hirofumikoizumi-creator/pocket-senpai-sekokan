const https = require('https');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const storeConfig = JSON.parse(fs.readFileSync(path.join(root, 'store.config.json'), 'utf8'));
const jaInfo = storeConfig.apple && storeConfig.apple.info && storeConfig.apple.info.ja;

if (!jaInfo) {
  console.error('store.config.json is missing apple.info.ja');
  process.exit(1);
}

const checks = [
  {
    label: 'supportUrl',
    url: jaInfo.supportUrl,
    requiredText: 'サポート',
  },
  {
    label: 'privacyPolicyUrl',
    url: jaInfo.privacyPolicyUrl,
    requiredText: 'プライバシーポリシー',
  },
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`${url} returned HTTP ${response.statusCode}`));
          return;
        }

        let body = '';
        response.setEncoding('utf8');
        response.on('data', chunk => {
          body += chunk;
        });
        response.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

(async () => {
  for (const check of checks) {
    if (!check.url || !check.url.startsWith('https://')) {
      throw new Error(`${check.label} must be an https URL.`);
    }

    const body = await fetchText(check.url);
    if (!body.includes(check.requiredText)) {
      throw new Error(`${check.label} did not include expected text: ${check.requiredText}`);
    }

    console.log(`${check.label} OK: ${check.url}`);
  }

  console.log('Public URL check passed.');
})().catch(error => {
  console.error(`Public URL check failed: ${error.message}`);
  process.exit(1);
});
