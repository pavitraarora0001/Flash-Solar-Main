$artDir = "C:\Users\YOGESH\.gemini\antigravity\brain\71c02a14-c03c-40aa-88b1-4edec385c925"

& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000" -outputPath "$artDir\before-desktop-1440px.png" -width 1440 -height 900

& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000" -outputPath "$artDir\before-mobile-390px.png" -width 390 -height 844

& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000/admin/login" -outputPath "$artDir\before-admin-login-1440px.png" -width 1440 -height 900

Write-Host "All BEFORE screenshots captured."
