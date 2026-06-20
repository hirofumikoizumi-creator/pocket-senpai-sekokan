# ポケット先輩（施工管理）

建設・土木の施工管理士を目指す新人・若手向けの教育・学習支援アプリです。現場での安全・品質・工程・書類・関係者調整を、監修済みテンプレートで整理します。

## 絶対ルール

- 法令適合、構造計算、施工可否、重機・仮設・災害・事故・緊急対応、契約や行政手続きの最終判断を扱いません。
- OpenAI 等のクラウドLLMには接続しません。
- 相談機能は `src/data/` の監修済み素材を整形するだけです。
- Qwen3 はオンデバイス整形器としてのみ扱い、素材外の技術判断や法令判断を生成させません。
- Qwen3 ランタイムが利用できない環境でもテンプレート応答で動作します。
- 相談・トーク・マニュアル等の画面に免責文を常設します。

## 免責文

本アプリは建設・土木の施工管理を学ぶための教育・学習支援アプリです。法令適合、構造安全、施工可否、労働安全、災害・事故対応などの判断を代替するものではありません。実務では法令、設計図書、仕様書、元請・発注者・所属会社のルール、有資格者・監督者の指示に従ってください。

## 技術スタック

- Expo SDK 56
- React Native 0.85
- TypeScript strict
- Expo Router
- React Native Paper
- AsyncStorage

## 主な機能

- 先輩相談
- 現場トーク集
- 業務別マニュアル
- チェックリスト
- ミニ学習クイズ
- お気に入り

## 開発

```bash
npm install
npx expo start
npx tsc --noEmit
```

## オンデバイスQwen3

ローカルLLM実行には `llama.rn` を使います。クラウドLLMには接続しません。

本番ビルド前に、次のファイルを実モデルへ差し替えてください。

```text
assets/models/Qwen3-0.6B-Q8_0.gguf
```

このリポジトリではGGUFモデルをGit LFSで管理します。実モデルが500MB未満、読み込み不可、またはネイティブモジュールが使えない環境では、相談機能は監修済みテンプレートへフォールバックします。

## iOS / TestFlight

`app.json` の Bundle ID と `eas.json` の App Store Connect 情報を、施工管理版の新規アプリに合わせて設定してください。Apple/EAS credentials は対話入力が必要です。

```bash
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

PowerShell で credentials 設定から build まで進める場合:

```powershell
.\scripts\testflight-release.ps1
```

元アプリからの同期履歴は `UPSTREAM_SYNC.md` を参照してください。
