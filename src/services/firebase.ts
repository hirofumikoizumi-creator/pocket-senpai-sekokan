/**
 * Firebase設定
 * 
 * 将来的な機能拡張用:
 * - ログイン機能 (Firebase Auth)
 * - Push通知 (Firebase Cloud Messaging)
 * - 学習履歴管理 (Firestore)
 * - アナリティクス (Firebase Analytics)
 * 
 * セットアップ手順:
 * 1. Firebase Consoleでプロジェクト作成
 * 2. iOSアプリを追加（バンドルID: com.gsw.pocketsenpai.sekoukanri）
 * 3. GoogleService-Info.plistをダウンロード
 * 4. app.jsonのextra内の値を実際の値に置き換え
 * 5. 必要なFirebaseサービスを有効化
 */

// Firebase初期化（将来実装時に使用）
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';
// import Constants from 'expo-constants';

/*
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
*/

// 現在はダミーエクスポート（将来の拡張用）
export const firebaseEnabled = false;

export function initializeFirebase() {
  if (!firebaseEnabled) {
    console.log('[Firebase] Firebase is not configured yet. Skipping initialization.');
    return;
  }
  // 将来: Firebase初期化処理
}
