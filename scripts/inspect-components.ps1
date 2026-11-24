Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\FLASH-LEAD-ACID.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($file)

# Let's inspect columns from x=510 to 1980 in steps of 50
for ($x = 510; $x -le 1980; $x += 50) {
    # check colors in this column between y=995 and 1485
    $colors = @()
    for ($y = 995; $y -le 1485; $y += 10) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            $colors += "($($p.R),$($p.G),$($p.B))"
        }
    }
    if ($colors.Count -gt 0) {
        Write-Host "x=$x : count=$($colors.Count), sample=$($colors[0])"
    } else {
        Write-Host "x=$x : GAP"
    }
}
$bmp.Dispose()
