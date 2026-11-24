Add-Type -AssemblyName System.Drawing

$artDir = "C:\Users\YOGESH\.gemini\antigravity\brain\71c02a14-c03c-40aa-88b1-4edec385c925"

function Crop-Image($srcPath, $dstPath, $cropX, $cropY, $cropW, $cropH) {
    if (-not (Test-Path $srcPath)) { return }
    $src = [System.Drawing.Bitmap]::FromFile($srcPath)
    $actualW = [Math]::Min($cropW, $src.Width - $cropX)
    $actualH = [Math]::Min($cropH, $src.Height - $cropY)
    $rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $actualW, $actualH)
    $dst = $src.Clone($rect, $src.PixelFormat)
    $src.Dispose()
    $dst.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
    Write-Host "Created crop: $dstPath ($actualW x $actualH)"
}

# Crop Header on 1440px (x: 0, y: 0, w: 1440, h: 140)
Crop-Image "$artDir\before-desktop-1440px.png" "$artDir\crop-header-before-1440px.png" 0 0 1440 140
Crop-Image "$artDir\after-desktop-1440px.png" "$artDir\crop-header-after-1440px.png" 0 0 1440 140

# Crop Header on 390px (x: 0, y: 0, w: 390, h: 130)
Crop-Image "$artDir\before-mobile-390px.png" "$artDir\crop-header-before-390px.png" 0 0 390 130
Crop-Image "$artDir\after-mobile-390px.png" "$artDir\crop-header-after-390px.png" 0 0 390 130

# Crop Admin Login Header
Crop-Image "$artDir\before-admin-login-1440px.png" "$artDir\crop-admin-login-before.png" 420 120 600 240
Crop-Image "$artDir\after-admin-login-1440px.png" "$artDir\crop-admin-login-after.png" 420 120 600 240

Write-Host "All comparison crops generated."
