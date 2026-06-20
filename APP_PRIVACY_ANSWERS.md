# App Store Connect プライバシー回答ガイド

現行実装を前提にした App Store Connect の「アプリのプライバシー」回答メモです。

## 結論

現行バージョンでは、App Store Connect のデータ収集回答は以下を選択します。

```text
このアプリからデータを収集しない
```

## 根拠

- ログイン機能はありません。
- 広告SDKは組み込んでいません。
- 分析SDKは組み込んでいません。
- Firebaseは組み込んでいません。
- 広告サービスのプレースホルダーや広告SDKは組み込んでいません。
- クラウドLLMへ相談内容を送信しません。
- 位置情報、カメラ、マイク、写真、連絡先、通知権限を要求しません。
- チェック状態、お気に入り、相談回数などは端末内の AsyncStorage に保存します。
- 端末内保存データは外部サーバーや第三者サービスへ送信しません。

## App Store Connect 入力手順

1. App Store Connect で対象アプリを開きます。
2. `App Privacy` または `アプリのプライバシー` を開きます。
3. データ収集の有無で `No, we do not collect data from this app` を選択します。
4. プライバシーポリシーURLに以下を入力します。

```text
https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html
```

5. 保存します。

## 将来変更時の注意

以下のいずれかを導入した場合は、この回答を見直します。

- Firebase Auth、Firestore、Analytics、Messaging
- AdMobなどの広告SDK
- クラウドLLM、外部AI API、外部ログ保存
- ログイン、アカウント作成、クラウド同期
- Push通知
- 位置情報、カメラ、マイク、写真、連絡先などの権限

変更した場合は、`PRIVACY_POLICY.md`、`docs/privacy.html`、`APP_STORE_METADATA.md`、`store.config.json`、App Store Connect のプライバシー回答をまとめて更新してください。
