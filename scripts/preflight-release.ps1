param(
  [switch]$SkipInstall,
  [switch]$SkipBuildInspect
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
$env:EAS_BUILD_NO_EXPO_GO_WARNING = "true"

function Run-Step {
  param(
    [string]$Name,
    [scriptblock]$Command
  )

  Write-Host ""
  Write-Host "==> $Name"
  & $Command
}

if (-not $SkipInstall) {
  Run-Step "Install dependencies" { npm install }
}

Run-Step "Typecheck" { npm run typecheck }
Run-Step "Lint" { npm run lint }
Run-Step "Expo Doctor" { npm run doctor }
Run-Step "Release readiness" { npm run check:release }
Run-Step "Public URLs" { npm run check:public-urls }
Run-Step "Privacy implementation" { npm run check:privacy }
Run-Step "EAS Metadata lint" { npm run metadata:lint }

if (-not $SkipBuildInspect) {
  Run-Step "EAS iOS build inspect" { npx eas-cli@latest build:inspect --platform ios --profile production --stage archive --output ./dist/eas-inspect-ios --force }
}

Write-Host ""
Write-Host "Preflight release checks completed."
