param(
  [switch]$Submit
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "Installing dependencies..."
npm install

Write-Host "Configuring iOS credentials. Follow the Apple login prompts."
npx eas credentials:configure-build --platform ios --profile production

Write-Host "Starting iOS production build..."
if ($Submit) {
  npx eas build --platform ios --profile production --auto-submit-with-profile production --what-to-test "建設・土木の施工管理学習アプリの初回TestFlightビルドです。先輩相談、現場トーク、業務別マニュアル、チェックリスト、ミニ学習クイズを確認してください。"
} else {
  npx eas build --platform ios --profile production
}

