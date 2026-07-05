# TestFlight リリースチェックリスト

現在の達成状況と残ブロッカーは `RELEASE_STATUS.md` も参照してください。
App Store Connect の新規アプリ作成手順は `APP_STORE_CONNECT_SETUP.md` を参照してください。

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

このスクリプトは実ビルド前に `.\scripts\preflight-release.ps1` を実行します。確認済みで省略する場合は `-SkipPreflight`、EAS build inspect だけ省略する場合は `-SkipBuildInspect` を指定します。

実ビルド前の確認をまとめて実行する場合:

```powershell
.\scripts\preflight-release.ps1
```

ビルド完了後に自動 submit まで行う場合:

```powershell
.\scripts\testflight-release.ps1 -Submit
```

`-Submit` を使う場合、`eas.json` の `submit.production.ios.ascAppId` が必須です。未設定の場合はスクリプトが停止します。

App Store Connect に新規アプリを作成後、Apple が発行した App ID を `eas.json` の `submit.production.ios.ascAppId` に追加してから submit します。

```bash
npm run set:asc-app-id -- <App Store Connect Apple ID>
npm run check:release
npx eas-cli@latest submit --platform ios --profile production
```

## GitHub Actions からのEAS本番ビルド

Apple認証とiOS credentials の確認が完了した後は、GitHub Actions の `EAS iOS Production Build` workflow から本番ビルドを手動起動できます。

事前準備:

- Expo の Access Token を発行し、GitHub repository secret `EXPO_TOKEN` に登録します。
- 初回だけ、手元のターミナルで `npx eas credentials:configure-build --platform ios --profile production` を実行し、Apple ID と証明書確認を完了します。
- App Store Connect への自動submitを使う場合は、App Store Connectで作成したアプリの Apple ID を `npm run set:asc-app-id -- <Apple ID>` で `eas.json` に追加します。
- `EXPO_TOKEN` が未登録の場合、workflow は EAS build の前に明示的なエラーで停止します。

実行手順:

1. GitHub の `Actions` タブを開きます。
2. `EAS iOS Production Build` を選択します。
3. `Run workflow` を押します。
4. TestFlightへ続けて送る場合は `submit` を有効にし、`what_to_test` を確認して実行します。

この workflow は、`npm ci`、`npm run typecheck`、`npm run lint`、`npm run doctor` を通してから EAS production build を投入します。

## EAS Metadata

App Store Connect に入力する主要メタデータは `store.config.json` にも保存しています。

```bash
npm run metadata:lint
```

App Store Connect のアプリ作成、`ascAppId` 設定、Apple認証が終わった後、必要に応じて以下で同期します。

```bash
npm run set:asc-app-id -- <App Store Connect Apple ID>
npm run check:release
npx eas-cli@latest metadata:push
```

## GitHub Pages 公開URL

App Store Connect に入力するサポートURLとプライバシーポリシーURLは、`docs/` 配下のHTMLを GitHub Pages で公開して使います。

GitHub Pages の設定:

1. GitHub repository の `Settings` を開きます。
2. `Pages` を開きます。
3. Source を `Deploy from a branch` にします。
4. Branch を `main`、folder を `/docs` にします。
5. 保存後、以下のURLにアクセスできることを確認します。

```text
https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/support.html
https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html
```

公開状態を確認する場合:

```bash
npm run check:public-urls
```

## App Store Connect

- Bundle ID: `com.gsw.pocketsenpai.sekoukanri`
- SKU案: `pocket-senpai-sekokan`
- カテゴリ案: Education
- 年齢制限: 4+ 想定
- サポートURL: `https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/support.html`
- プライバシーポリシーURL: `https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html`
- アプリプライバシー回答: `APP_PRIVACY_ANSWERS.md` に従い RevenueCat の「購入情報」と AdMob の広告関連データを選択
- 暗号化: 非該当 (`ITSAppUsesNonExemptEncryption: false`)
- 広告SDK: 未組み込み
- Firebase: 未組み込み
- クラウドLLM: 未使用
- キャラクター資産: `assets/characters/senpai-construction.png`
- スクリーンショット撮影メモ: `SCREENSHOT_GUIDE.md`

## TestFlight ベータ審査メモ案

本アプリは、建設・土木の施工管理を学ぶ新人・若手向けの教育支援アプリです。2頭身の施工管理先輩キャラクターがホーム画面と相談画面に登場し、安全管理、品質管理、工程管理、書類整理、関係者への報告練習を、アプリ内の監修済みテンプレートで確認できます。

本アプリは法令適合、構造安全、施工可否、労働安全、災害・事故対応などの最終判断を行いません。実務では法令、設計図書、仕様書、所属会社のルール、有資格者・監督者の指示に従うよう、アプリ内に常時免責文を表示しています。

ログインは不要です。テスト時はホーム画面から各メニューを選択し、「先輩相談」では候補質問をタップしてテンプレート回答を確認できます。

## 既知の注意点

- AIモデルが利用できない場合、相談機能は監修済みテンプレート応答へフォールバックします。
- AdMob/Firebase は現在未使用です。将来導入する場合は、正式な App ID とプライバシー回答を更新してください。
- Firebase/広告SDKのプレースホルダー実装は削除済みです。将来導入する場合は、プライバシー回答と `npm run check:privacy` の条件を更新してください。

## 直近の検証結果

2026-06-20 時点で以下を確認済みです。

```bash
npm run typecheck
npm run lint
npm run doctor
npm run check:release
npm run check:public-urls
npm run check:privacy
npm run metadata:lint
npm run preflight:release
npx eas-cli@latest build:inspect --platform ios --profile production --stage archive --output ./dist/eas-inspect-ios --force
```

結果:

- TypeScript: 成功
- Expo lint: 成功
- Expo Doctor: 21/21 checks passed
- Release readiness check: 成功。`ascAppId` は App Store Connect アプリ作成後に追加
- Public URL check: 成功
- Privacy implementation check: 成功
- EAS Metadata lint: 成功
- Preflight release script: 成功
- EAS build inspect: 成功
- GitHub Actions CI: `typecheck` / `lint` / `doctor` を push と PR で実行
- EAS production build: iOS Distribution Certificate の対話確認が必要なため、Codex非対話環境では未投入
