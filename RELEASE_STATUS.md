# リリース状態サマリ

最終確認日: 2026-06-20

## 現在の状態

ポケット先輩（施工管理）は、アプリ実装、提出資料、公開URL、プライバシー実装確認、メタデータ、CI、preflight確認まで整備済みです。

TestFlight投入前に残っている外部作業は、App Store Connectで作成したアプリの Apple ID を `ascAppId` として登録することと、EAS iOS Distribution Certificate の対話確認です。

## リポジトリ

- GitHub: `https://github.com/hirofumikoizumi-creator/pocket-senpai-sekokan`
- 最新確認コミット（リリース実装）: `fc5e3d0 Verify no data collection implementation`
- ローカル作業ツリー: clean

## アプリ設定

- App name: `ポケット先輩（施工管理）`
- Expo owner: `hirofumikoizumi`
- Expo project: `@hirofumikoizumi/pocket-senpai-sekokan`
- EAS projectId: `cf290c01-7ed1-42e5-95f9-9c2b7f887201`
- iOS bundle identifier: `com.gsw.pocketsenpai.sekoukanri`
- Android package: `com.pocketsenpai.sekokan`
- App Store category: Education / Productivity
- Support URL: `https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/support.html`
- Privacy Policy URL: `https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html`
- App Privacy: 現行実装では「このアプリからデータを収集しない」を選択

## 確認済み

- `powershell -ExecutionPolicy Bypass -File scripts/preflight-release.ps1 -SkipInstall -SkipBuildInspect`: 成功
- `npm run build:inspect:ios`: 成功
- `npm run check:release`: 成功
- `npm run check:public-urls`: 成功
- `npm run check:privacy`: 成功
- `npm run metadata:lint`: 成功
- `npm run typecheck`: 成功
- `npm run lint`: 成功
- `npm run doctor`: 成功
- GitHub Actions CI: 成功確認済み (`27865080755`)
- GitHub Pages deploy: 成功確認済み (`27865080283`)

## 未完了の外部作業

### 1. App Store Connect アプリ作成後の `ascAppId` 設定

新規アプリ作成手順は `APP_STORE_CONNECT_SETUP.md` を参照してください。

App Store Connectで新規アプリを作成し、Apple IDを確認したら以下を実行します。

```bash
npm run set:asc-app-id -- <App Store Connect Apple ID>
npm run check:release
```

### 2. EAS iOS credentials の対話確認

Codexの非対話環境では、iOS Distribution Certificate の確認プロンプトへ入力できません。

手元ターミナルで以下を実行してください。

```bash
npx eas-cli@latest credentials:configure-build --platform ios --profile production
```

確認後、production buildを投入します。

```bash
npx eas-cli@latest build --platform ios --profile production
```

PowerShellでまとめて進める場合:

```powershell
.\scripts\testflight-release.ps1
```

`testflight-release.ps1` は実ビルド前にpreflight確認を実行します。`-Submit` 指定時は `ascAppId` が未設定だと停止します。

## プライバシー確認

現行実装では、ログイン、Firebase、広告SDK、分析SDK、クラウドLLM送信、位置情報、カメラ、通知、トラッキング系SDKを組み込んでいません。

`npm run check:privacy` で、依存関係、`app.json`、プレースホルダー実装、Firebase/広告設定ファイルが残っていないことを確認します。

## 最新のEAS buildブロッカー

Codex非対話環境で `npx eas-cli@latest build --platform ios --profile production --non-interactive --freeze-credentials --no-wait` を実行した結果、以下で停止しています。

```text
Distribution Certificate is not validated for non-interactive builds.
Credentials are not set up. Run this command again in interactive mode.
```

これはアプリ実装や設定ファイルの不足ではなく、Apple/EAS credentials の対話確認が未完了であることを示します。
