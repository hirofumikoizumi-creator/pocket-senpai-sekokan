const appJson = require('./app.json');

function readOptionalEnv(name, fallback) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : fallback;
}

const admobIosAppId = readOptionalEnv('ADMOB_IOS_APP_ID', 'ca-app-pub-5840457424714744~7487827529');
const admobAndroidAppId = readOptionalEnv('ADMOB_ANDROID_APP_ID', 'ca-app-pub-5840457424714744~7487827529');
const admobBannerUnitId = readOptionalEnv('ADMOB_BANNER_UNIT_ID', 'ca-app-pub-5840457424714744/5895122794');
const admobInterstitialUnitId = readOptionalEnv('ADMOB_INTERSTITIAL_UNIT_ID', 'ca-app-pub-5840457424714744/4861664185');
const admobRewardedUnitId = readOptionalEnv('ADMOB_REWARDED_UNIT_ID', 'ca-app-pub-5840457424714744/6250767477');

module.exports = {
  expo: {
    ...appJson.expo,
    plugins: [
      ...(appJson.expo.plugins || []),
      [
        'react-native-google-mobile-ads',
        {
          iosAppId: admobIosAppId,
          androidAppId: admobAndroidAppId,
        },
      ],
    ],
    extra: {
      ...(appJson.expo.extra || {}),
      admobBannerUnitId,
      admobInterstitialUnitId,
      admobRewardedUnitId,
      revenueCatIosApiKey: readOptionalEnv('REVENUECAT_IOS_API_KEY', 'appl_REVENUECAT_IOS_API_KEY'),
      revenueCatAndroidApiKey: readOptionalEnv('REVENUECAT_ANDROID_API_KEY', 'goog_REVENUECAT_ANDROID_API_KEY'),
      revenueCatEntitlementId: readOptionalEnv('REVENUECAT_ENTITLEMENT_ID', 'premium'),
      revenueCatOfferingId: readOptionalEnv('REVENUECAT_OFFERING_ID', 'default'),
    },
  },
};
