Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\cropped-FLASH-LEAD-ACID-removebg-preview.png"
$bmp = [System.Drawing.Bitmap]::FromFile($file)

# Downsample to 80 chars wide x 24 chars high
$w = 100
$h = 25
$scaleX = $bmp.Width / $w
$scaleY = $bmp.Height / $h

$output = @()
for ($y = 0; $y -lt $h; $y++) {
    $line = ""
    for ($x = 0; $x -lt $w; $x++) {
        $origX = [int]($x * $scaleX)
        $origY = [int]($y * $scaleY)
        $p = $bmp.GetPixel($origX, $origY)
        if ($p.A -gt 100) {
            # Check color
            if ($p.B -gt 150 -and $p.R -lt 100) {
                $line += "#"
            } else {
                $line += "*"
            }
        } else {
            $line += " "
        }
    }
    $output += $line
}
$bmp.Dispose()
$output | Out-File -FilePath "flashsolar-platform/scripts/ascii-logo.txt" -Encoding utf8
Write-Host "Done writing ascii-logo.txt"
