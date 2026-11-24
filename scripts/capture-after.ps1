$artDir = "C:\Users\YOGESH\.gemini\antigravity\brain\71c02a14-c03c-40aa-88b1-4edec385c925"

Write-Host "Capturing AFTER screenshots..."

# 1. Desktop 1440px Home
& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000" -outputPath "$artDir\after-desktop-1440px.png" -width 1440 -height 900

# 2. Mobile 390px Home
& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000" -outputPath "$artDir\after-mobile-390px.png" -width 390 -height 844

# 3. Desktop 1440px Admin Login
& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000/admin/login" -outputPath "$artDir\after-admin-login-1440px.png" -width 1440 -height 900

# 4. Mobile 390px Admin Login
& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000/admin/login" -outputPath "$artDir\after-admin-login-390px.png" -width 390 -height 844

# 5. Products Page with Header & Footer
& powershell -ExecutionPolicy Bypass -File "flashsolar-platform/scripts/take-screenshot.ps1" -url "http://localhost:3000/products" -outputPath "$artDir\after-products-1440px.png" -width 1440 -height 900

Write-Host "All AFTER screenshots captured."
