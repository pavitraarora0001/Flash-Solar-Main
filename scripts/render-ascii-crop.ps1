Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\FLASH-LEAD-ACID.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($file)

# Crop region: minX=510, maxX=1980 (width=1470), minY=995, maxY=1485 (height=490)
$minX = 500
$maxX = 1990
$minY = 990
$maxY = 1490
$w = 120
$h = 40
$scaleX = ($maxX - $minX) / $w
$scaleY = ($maxY - $minY) / $h

$output = @()
for ($y = 0; $y -lt $h; $y++) {
    $line = ""
    for ($x = 0; $x -lt $w; $x++) {
        $origX = [int]($minX + ($x * $scaleX))
        $origY = [int]($minY + ($y * $scaleY))
        $p = $bmp.GetPixel($origX, $origY)
        $brightness = ($p.R + $p.G + $p.B) / 3
        if ($brightness -lt 220) {
            $line += "#"
        } else {
            $line += " "
        }
    }
    $output += $line
}
$bmp.Dispose()
$output | Out-File -FilePath "flashsolar-platform/scripts/ascii-crop.txt" -Encoding utf8
Write-Host "Done"
