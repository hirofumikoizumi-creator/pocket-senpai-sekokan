export const REVENUECAT_ENTITLEMENT_ID = 'premium';
export const REVENUECAT_OFFERING_ID = 'default';

type PurchaseStatus = {
  isConfigured: boolean;
  isPremium: boolean;
  customerInfo?: unknown;
};

export function isRevenueCatAvailable() {
  return false;
}

export async function configureRevenueCat() {
  return false;
}

export async function getRevenueCatStatus(): Promise<PurchaseStatus> {
  return { isConfigured: false, isPremium: false };
}

export async function purchasePremium() {
  throw new Error('RevenueCat purchases are available in iOS and Android builds.');
}

export async function restorePremium() {
  throw new Error('RevenueCat restore is available in iOS and Android builds.');
}
