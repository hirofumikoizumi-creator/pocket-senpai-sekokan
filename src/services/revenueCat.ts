import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { PREMIUM_PRODUCT_ID } from '../constants/plans';

declare const require: any;

const constants = Constants as any;
const extra = Constants.expoConfig?.extra || constants.manifest2?.extra || {};

export const REVENUECAT_ENTITLEMENT_ID = String(extra.revenueCatEntitlementId || 'premium');
export const REVENUECAT_OFFERING_ID = String(extra.revenueCatOfferingId || 'default');

let configured = false;
let configureAttempted = false;

type PurchasesModule = any;

type PurchaseStatus = {
  isConfigured: boolean;
  isPremium: boolean;
  customerInfo?: any;
};

function getApiKey() {
  if (Platform.OS === 'ios') return String(extra.revenueCatIosApiKey || '');
  if (Platform.OS === 'android') return String(extra.revenueCatAndroidApiKey || '');
  return '';
}

function isPlaceholderKey(apiKey: string) {
  return !apiKey || apiKey.includes('REVENUECAT') || apiKey.includes('YOUR_');
}

function getPurchases(): PurchasesModule | null {
  if (Platform.OS === 'web') return null;

  try {
    const purchasesModule = require('react-native-purchases');
    return purchasesModule.default || purchasesModule;
  } catch (error) {
    console.warn('RevenueCat SDK is unavailable:', error);
    return null;
  }
}

function hasPremiumEntitlement(customerInfo: any) {
  return Boolean(customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID]);
}

export function isRevenueCatAvailable() {
  return Platform.OS !== 'web' && !isPlaceholderKey(getApiKey()) && Boolean(getPurchases());
}

export async function configureRevenueCat() {
  if (configured) return true;
  if (configureAttempted && !configured) return false;

  configureAttempted = true;

  const apiKey = getApiKey();
  const Purchases = getPurchases();

  if (!Purchases || isPlaceholderKey(apiKey)) {
    return false;
  }

  const purchasesModule = require('react-native-purchases');
  const logLevel = purchasesModule.LOG_LEVEL?.VERBOSE || Purchases.LOG_LEVEL?.VERBOSE;
  if (logLevel && Purchases.setLogLevel) {
    Purchases.setLogLevel(logLevel);
  }

  Purchases.configure({ apiKey });
  configured = true;
  return true;
}

export async function getRevenueCatStatus(): Promise<PurchaseStatus> {
  const isConfigured = await configureRevenueCat();
  const Purchases = getPurchases();

  if (!isConfigured || !Purchases) {
    return { isConfigured: false, isPremium: false };
  }

  const customerInfo = await Purchases.getCustomerInfo();
  return {
    isConfigured: true,
    isPremium: hasPremiumEntitlement(customerInfo),
    customerInfo,
  };
}

function getMonthlyPackage(offerings: any) {
  return (
    offerings?.current?.monthly ||
    offerings?.all?.[REVENUECAT_OFFERING_ID]?.monthly ||
    offerings?.current?.availablePackages?.find?.((item: any) =>
      item?.product?.identifier === PREMIUM_PRODUCT_ID ||
      item?.product?.productIdentifier === PREMIUM_PRODUCT_ID
    ) ||
    offerings?.current?.availablePackages?.[0] ||
    null
  );
}

async function purchaseConfiguredProduct(Purchases: PurchasesModule) {
  if (Purchases.purchaseProduct) {
    return Purchases.purchaseProduct(PREMIUM_PRODUCT_ID);
  }

  if (Purchases.getProducts && Purchases.purchaseStoreProduct) {
    const products = await Purchases.getProducts([PREMIUM_PRODUCT_ID]);
    const product = products?.find?.((item: any) =>
      item?.identifier === PREMIUM_PRODUCT_ID ||
      item?.productIdentifier === PREMIUM_PRODUCT_ID
    );
    if (product) return Purchases.purchaseStoreProduct(product);
  }

  return null;
}

export async function purchasePremium() {
  const isConfigured = await configureRevenueCat();
  const Purchases = getPurchases();

  if (!isConfigured || !Purchases) {
    throw new Error('RevenueCat is not configured. Set REVENUECAT_IOS_API_KEY / REVENUECAT_ANDROID_API_KEY and use a development or production build.');
  }

  const offerings = await Purchases.getOfferings();
  const monthlyPackage = getMonthlyPackage(offerings);

  const result = monthlyPackage
    ? await Purchases.purchasePackage(monthlyPackage)
    : await purchaseConfiguredProduct(Purchases);

  if (!result) {
    throw new Error(`RevenueCat offering or product is missing. Create offering "${REVENUECAT_OFFERING_ID}" or publish product ${PREMIUM_PRODUCT_ID}.`);
  }
  const customerInfo = result.customerInfo || result;

  return {
    isPremium: hasPremiumEntitlement(customerInfo),
    customerInfo,
  };
}

export async function restorePremium() {
  const isConfigured = await configureRevenueCat();
  const Purchases = getPurchases();

  if (!isConfigured || !Purchases) {
    throw new Error('RevenueCat is not configured. Set REVENUECAT_IOS_API_KEY / REVENUECAT_ANDROID_API_KEY and use a development or production build.');
  }

  const customerInfo = await Purchases.restorePurchases();
  return {
    isPremium: hasPremiumEntitlement(customerInfo),
    customerInfo,
  };
}
