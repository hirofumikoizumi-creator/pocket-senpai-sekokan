# TestFlight リリースチェックリスト

## EAS

- Expo owner: `hirofumikoizumi`
- EAS project: `@hirofumikoizumi/pocket-senpai-sekokan`
- EAS projectId: `cf290c01-7ed1-42e5-95f9-9c2b7f887201`
- iOS bundle identifier: `com.gsw.pocketsenpai.sekoukanri`
- App name: `ポケット先輩（施工管理）`

## 手元で必要な対話作業

このCodex実行環境では EAS の対話プロンプトに入力できないため、iOS credentials の確認だけ手元のターミナルで実施してください。

```bash
git clone https://github.com/hirofumikoizumi-creator/pocket-senpai-sekokan.git
cd pocket-senpai-sekokan
npm install
npx eas credentials:configure-build --platform ios --profile production
npx eas build --platform ios --profile production
```

PowerShell でまとめて実行する場合:

```powershell
.\scripts\testflight-release.ps1
```

ビルド完了後に自動 submit まで行う場合:

```powershell
.\scripts\testflight-release.ps1 -Submit
```

App Store Connect に新規アプリを作成後、Apple が発行した App ID を `eas.json` の `submit.production.ios.ascAppId` に追加してから submit します。

```bash
npx eas submit --platform ios --profile production
```

## App Store Connect

- Bundle ID: `com.gsw.pocketsenpai.sekoukanri`
- SKU案: `pocket-senpai-sekokan`
- カテゴリ案: Education
- 年齢制限: 4+ 想定
- 暗号化: 非該当 (`ITSAppUsesNonExemptEncryption: false`)
- 広告SDK: 未組み込み
- Firebase: 未組み込み
- クラウドLLM: 未使用
- キャラクター資産: `assets/characters/senpai-construction.png`

## TestFlight ベータ審査メモ案

本アプリは、建設・土木の施工管理を学ぶ新人・若手向けの教育支援アプリです。2頭身の施工管理先輩キャラクターがホーム画面と相談画面に登場し、安全管理、品質管理、工程管理、書類整理、関係者への報告練習を、アプリ内の監修済みテンプレートで確認できます。

本アプリは法令適合、構造安全、施工可否、労働安全、災害・事故対応などの最終判断を行いません。実務では法令、設計図書、仕様書、所属会社のルール、有資格者・監督者の指示に従うよう、アプリ内に常時免責文を表示しています。

ログインは不要です。テスト時はホーム画面から各メニューを選択し、「先輩相談」では候補質問をタップしてテンプレート回答を確認できます。

## 既知の注意点

- `assets/models/Qwen3-0.6B-Q8_0.gguf` が実モデルではない場合、相談機能は監修済みテンプレート応答へフォールバックします。
- AdMob/Firebase は現在未使用です。将来導入する場合は、正式な App ID とプライバシー回答を更新してください。
