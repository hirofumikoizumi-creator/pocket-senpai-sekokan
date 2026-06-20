# リリース状態サマリ

最終確認日: 2026-06-20

## 現在の状態

ポケット先輩（施工管理）は、アプリ実装、提出資料、公開URL、メタデータ、CI、preflight確認まで整備済みです。

TestFlight投入前に残っている外部作業は、App Store Connectで作成したアプリの Apple ID を `ascAppId` として登録することと、EAS iOS Distribution Certificate の対話確認です。

## リポジトリ

- GitHub: `https://github.com/hirofumikoizumi-creator/pocket-senpai-sekokan`
- 最新確認コミット: `c9be35a Add release preflight script`
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

## 確認済み

- `powershell -ExecutionPolicy Bypass -File scripts/preflight-release.ps1 -SkipInstall -SkipBuildInspect`: 成功
- `npm run build:inspect:ios`: 成功
- `npm run check:release`: 成功
- `npm run check:public-urls`: 成功
- `npm run metadata:lint`: 成功
- `npm run typecheck`: 成功
- `npm run lint`: 成功
- `npm run doctor`: 成功
- GitHub Actions CI: 成功 (`27864234409`)
- GitHub Pages deploy: 成功 (`27864234197`)

## 未完了の外部作業

### 1. App Store Connect アプリ作成後の `ascAppId` 設定

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

## 最新のEAS buildブロッカー

Codex非対話環境で `npx eas-cli@latest build --platform ios --profile production --non-interactive --freeze-credentials --no-wait` を実行した結果、以下で停止しています。

```text
Distribution Certificate is not validated for non-interactive builds.
Credentials are not set up. Run this command again in interactive mode.
```

これはアプリ実装や設定ファイルの不足ではなく、Apple/EAS credentials の対話確認が未完了であることを示します。
