# App Store Connect プライバシー回答ガイド

月額プレミアムプランと無料プラン広告を含む現行実装を前提にした App Store Connect の「アプリのプライバシー」回答メモです。

## 結論

現行バージョンでは、アプリ内課金の購入状態確認に RevenueCat、無料プランの広告表示に Google AdMob を使用します。App Store Connect のデータ収集回答は、各SDKの実際の利用に合わせて以下を選択します。

```text
はい、このアプリからデータを収集します
```

データタイプ:

- 購入情報
- ID
- 使用状況データ
- 診断

利用目的:

- アプリの機能
- サードパーティ広告

ユーザーへの関連付け:

- はい

トラッキング:

- 非パーソナライズド広告のみを要求する実装です。App Store Connect では AdMob の実設定とGoogleのデータ開示に合わせて回答してください。

## 根拠

- ログイン機能はありません。
- 無料プランの広告表示に Google AdMob SDK を使用します。
- 分析SDKは組み込んでいません。
- Firebaseは組み込んでいません。
- 広告サービスのプレースホルダーや広告SDKは組み込んでいません。
- 月額プレミアムプランの購入・復元・購読状態確認に RevenueCat SDK を使用します。
- クラウドLLMへ相談内容を送信しません。
- 位置情報、カメラ、マイク、写真、連絡先、通知権限を要求しません。
- チェック状態、お気に入り、相談回数などは端末内の AsyncStorage に保存します。
- 端末内保存データは外部サーバーや第三者サービスへ送信しません。

## App Store Connect 入力手順

1. App Store Connect で対象アプリを開きます。
2. `App Privacy` または `アプリのプライバシー` を開きます。
3. データ収集の有無で `Yes, we collect data from this app` を選択します。
4. RevenueCat 用に `Purchases` / `購入情報` を追加します。
5. AdMob 用に `Identifiers` / `ID`、`Usage Data` / `使用状況データ`、`Diagnostics` / `診断` を追加します。
6. 利用目的は `App Functionality` / `アプリの機能`、`Third-Party Advertising` / `サードパーティ広告` を実態に合わせて選択します。
7. ユーザーへの関連付け、トラッキングは AdMob の実設定と Google のデータ開示に合わせて選択します。
8. プライバシーポリシーURLに以下を入力します。

```text
https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html
```

9. 保存します。

## 将来変更時の注意

以下のいずれかを導入した場合は、この回答を見直します。

- Firebase Auth、Firestore、Analytics、Messaging
- AdMobなどの広告SDK
- クラウドLLM、外部AI API、外部ログ保存
- ログイン、アカウント作成、クラウド同期
- Push通知
- 位置情報、カメラ、マイク、写真、連絡先などの権限

変更した場合は、`PRIVACY_POLICY.md`、`docs/privacy.html`、`APP_STORE_METADATA.md`、`store.config.json`、App Store Connect のプライバシー回答をまとめて更新してください。
