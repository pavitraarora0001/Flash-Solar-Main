Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\cropped-WhatsApp-Image-2022-01-21-at-5.14.14-PM-2.jpeg"
$bmp = [System.Drawing.Bitmap]::FromFile($file)
Write-Host "WhatsApp custom_logo Dimensions: $($bmp.Width) x $($bmp.Height)"

$w = 80
$h = 24
$scaleX = $bmp.Width / $w
$scaleY = $bmp.Height / $h

$output = @()
for ($y = 0; $y -lt $h; $y++) {
    $line = ""
    for ($x = 0; $x -lt $w; $x++) {
        $origX = [int]($x * $scaleX)
        $origY = [int]($y * $scaleY)
        $p = $bmp.GetPixel($origX, $origY)
        # Check if dark or colored vs white/light
        $brightness = ($p.R + $p.G + $p.B) / 3
        if ($brightness -lt 200) {
            $line += "#"
        } else {
            $line += " "
        }
    }
    $output += $line
}
$bmp.Dispose()
$output | Out-File -FilePath "flashsolar-platform/scripts/ascii-whatsapp.txt" -Encoding utf8
Write-Host "Done"
