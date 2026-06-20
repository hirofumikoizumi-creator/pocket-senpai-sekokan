param(
  [switch]$Submit,
  [switch]$SkipPreflight,
  [switch]$SkipBuildInspect
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
$env:EAS_BUILD_NO_EXPO_GO_WARNING = "true"

if (-not $SkipPreflight) {
  Write-Host "Running release preflight checks..."
  $preflightArgs = @("-File", (Join-Path $PSScriptRoot "preflight-release.ps1"))
  if ($SkipBuildInspect) {
    $preflightArgs += "-SkipBuildInspect"
  }
  powershell -ExecutionPolicy Bypass @preflightArgs
} else {
  Write-Host "Skipping release preflight checks."
}

if ($Submit) {
  $easJson = Get-Content -LiteralPath (Join-Path $projectRoot "eas.json") -Raw | ConvertFrom-Json
  $ascAppId = $easJson.submit.production.ios.ascAppId
  if (-not $ascAppId) {
    throw "eas.json submit.production.ios.ascAppId is required for -Submit. Run: npm run set:asc-app-id -- <App Store Connect Apple ID>"
  }
}

Write-Host "Configuring iOS credentials. Follow the Apple login prompts."
npx eas-cli@latest credentials:configure-build --platform ios --profile production

Write-Host "Starting iOS production build..."
if ($Submit) {
  npx eas-cli@latest build --platform ios --profile production --auto-submit-with-profile production --what-to-test "Initial TestFlight build for Pocket Senpai Construction. Please check consultation, talk examples, manuals, checklists, and quiz flows."
} else {
  npx eas-cli@latest build --platform ios --profile production
}
