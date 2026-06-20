# App Store Connect 新規アプリ作成ガイド

ポケット先輩（施工管理）を TestFlight に進めるための App Store Connect 入力手順です。

## 事前条件

- Apple Developer Program に登録済み
- Bundle ID `com.gsw.pocketsenpai.sekoukanri` を利用できる状態
- GitHub Pages の公開URLが有効
- `npm run check:public-urls` が成功
- `npm run check:privacy` が成功

## 新規アプリ作成

App Store Connect で `My Apps` を開き、`+` から `New App` を選択します。

入力値:

- Platforms: `iOS`
- Name: `ポケット先輩（施工管理）`
- Primary language: `Japanese`
- Bundle ID: `com.gsw.pocketsenpai.sekoukanri`
- SKU: `pocket-senpai-sekokan`
- User Access: 運用方針に合わせて選択

作成後、App Information 画面などに表示される Apple ID を控えます。

## Apple ID を eas.json に反映

App Store Connect の Apple ID を確認したら、ローカルで以下を実行します。

```bash
npm run set:asc-app-id -- <App Store Connect Apple ID>
npm run check:release
```

`eas.json` の `submit.production.ios.ascAppId` に数字IDが入ります。

## App Information

- Subtitle: `建設・土木の現場学習サポート`
- Category: `Education`
- Secondary Category: `Productivity`
- Content Rights: 第三者コンテンツを含まない想定
- Age Rating: `APP_PRIVACY_ANSWERS.md` と `store.config.json` の advisory に従って設定

## Pricing and Availability

初回TestFlightでは販売開始設定の確定前でも進められます。本審査へ進める前に価格と提供地域を決めます。

## App Privacy

`APP_PRIVACY_ANSWERS.md` に従って入力します。

選択:

```text
このアプリからデータを収集しない
```

Privacy Policy URL:

```text
https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html
```

## App Store メタデータ

`store.config.json` と `APP_STORE_METADATA.md` を基準に入力します。

主なURL:

- Support URL: `https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/support.html`
- Privacy Policy URL: `https://hirofumikoizumi-creator.github.io/pocket-senpai-sekokan/privacy.html`

必要に応じて、App Store Connect作成後に以下で同期します。

```bash
npx eas-cli@latest metadata:push
```

## TestFlight

App Store Connectアプリ作成、`ascAppId` 設定、EAS iOS credentials の対話確認が終わったら、以下でビルドを投入します。

```powershell
.\scripts\testflight-release.ps1
```

自動submitまで進める場合:

```powershell
.\scripts\testflight-release.ps1 -Submit
```

## 注意

`ascAppId` 未設定のまま `-Submit` を指定すると、`testflight-release.ps1` はApple認証へ進む前に停止します。
