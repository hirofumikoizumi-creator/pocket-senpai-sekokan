# Upstream Sync

このリポジトリは `hirofumikoizumi-creator/pocket-senpai-dh.git` をベースにした、建設・土木の施工管理版です。

## 2026-06-20 同期

同期元:

- Repository: `hirofumikoizumi-creator/pocket-senpai-dh.git`
- Branch: `origin/master`
- Commit: `9e38e27 Set iOS encryption declaration`

施工管理版へ反映済みの主な基盤:

- Expo SDK 56 / React Native 0.85 / Expo Router 構成
- iOS `ITSAppUsesNonExemptEncryption: false`
- `expo-build-properties` による iOS deployment target `16.4`
- `llama.rn` によるオンデバイス Qwen 整形ランタイム
- `assets/models/Qwen3-0.6B-Q8_0.gguf` の Git LFS 管理
- Qwen 未読込時の監修済みテンプレートフォールバック
- 常設免責文と安全ガード
- 各セクションの Stack layout
- 本番アイコン / Splash assets
- EAS production build / submit profiles

施工管理版で意図的に変えている点:

- アプリ名、slug、Bundle ID、Android package は施工管理版用
- 医療・歯科向け安全ガードを、法令・構造・施工可否・事故対応を代替しない方針へ変更
- 相談、トーク、マニュアル、チェックリスト、クイズの監修済み素材を施工管理向けへ変更
- AdMob / Firebase の未設定 placeholder は TestFlight 安定性のため削除
- App Store Connect `ascAppId` は新規アプリ作成後に設定するため未固定

次回同期時は、まず `pocket-senpai-dh` の最新コミットを確認し、基盤ファイルの変更を施工管理版のドメイン文言に合わせて移植してください。
