Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\FLASH-LEAD-ACID.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($file)
Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"

# Check pixel color at top-left corner
$tl = $bmp.GetPixel(10, 10)
Write-Host "Top-Left Color: R=$($tl.R), G=$($tl.G), B=$($tl.B)"

# Find bounding box of non-white content (assuming white background)
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y += 5) {
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        $p = $bmp.GetPixel($x, $y)
        # If not pure white (e.g. brightness < 240 or any channel < 240)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Content bounds in 2481x2481: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY (width=$($maxX-$minX), height=$($maxY-$minY))"
$bmp.Dispose()
