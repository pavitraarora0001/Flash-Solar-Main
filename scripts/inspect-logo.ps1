Add-Type -AssemblyName System.Drawing
$filePath = "e:\Websites\Flash Solar org\flashsolar-platform\public\images\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($filePath)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"

# Sample every 20px across width to find density
$counts = @()
for ($x = 0; $x -lt $bmp.Width; $x += 20) {
    $c = 0
    for ($y = 0; $y -lt $bmp.Height; $y += 2) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 30) { $c++ }
    }
    $counts += "x${x}:$c"
}
Write-Host ($counts -join " ")
$bmp.Dispose()
