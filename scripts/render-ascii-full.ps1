Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\FLASH-LEAD-ACID.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($file)

# The content bounds are minX=510, maxX=1980, minY=995, maxY=1485
$w = 120
$h = 35
$scaleX = ($bmp.Width) / $w
$scaleY = ($bmp.Height) / $h

$output = @()
for ($y = 0; $y -lt $h; $y++) {
    $line = ""
    for ($x = 0; $x -lt $w; $x++) {
        $origX = [int]($x * $scaleX)
        $origY = [int]($y * $scaleY)
        $p = $bmp.GetPixel($origX, $origY)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            $line += "#"
        } else {
            $line += " "
        }
    }
    $output += $line
}
$bmp.Dispose()
$output | Out-File -FilePath "flashsolar-platform/scripts/ascii-full.txt" -Encoding utf8
Write-Host "Done writing ascii-full.txt"
