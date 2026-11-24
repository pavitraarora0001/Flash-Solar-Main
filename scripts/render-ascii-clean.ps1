Add-Type -AssemblyName System.Drawing
$file = "flashsolar-platform\public\images\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($file)

$w = 120
$h = 30
$scaleX = $bmp.Width / $w
$scaleY = $bmp.Height / $h

$output = @()
for ($y = 0; $y -lt $h; $y++) {
    $line = ""
    for ($x = 0; $x -lt $w; $x++) {
        $origX = [int]($x * $scaleX)
        $origY = [int]($y * $scaleY)
        $p = $bmp.GetPixel($origX, $origY)
        if ($p.A -gt 50) {
            $line += "#"
        } else {
            $line += " "
        }
    }
    $output += $line
}
$bmp.Dispose()
$output | Out-File -FilePath "flashsolar-platform/scripts/ascii-clean.txt" -Encoding utf8
Write-Host "Done"
