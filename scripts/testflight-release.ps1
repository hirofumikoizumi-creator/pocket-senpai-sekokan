param(
  [switch]$Submit
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
$env:EAS_BUILD_NO_EXPO_GO_WARNING = "true"

Write-Host "Installing dependencies..."
npm install

Write-Host "Configuring iOS credentials. Follow the Apple login prompts."
npx eas-cli@latest credentials:configure-build --platform ios --profile production

Write-Host "Starting iOS production build..."
if ($Submit) {
  npx eas-cli@latest build --platform ios --profile production --auto-submit-with-profile production --what-to-test "建設・土木の施工管理学習アプリの初回TestFlightビルドです。先輩相談、現場トーク、業務別マニュアル、チェックリスト、ミニ学習クイズを確認してください。"
} else {
  npx eas-cli@latest build --platform ios --profile production
}
