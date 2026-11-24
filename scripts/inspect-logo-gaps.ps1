Add-Type -AssemblyName System.Drawing
$file = "Solar-BP-Files\domains\flashsolar.org\public_html\wp-content\uploads\2022\01\cropped-FLASH-LEAD-ACID-removebg-preview.png"
$bmp = [System.Drawing.Bitmap]::FromFile($file)
Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"

$gaps = @()
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $count = 0
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        if ($bmp.GetPixel($x, $y).A -gt 25) { $count++ }
    }
    if ($count -eq 0) {
        $gaps += $x
    }
}
Write-Host "Zero-pixel X columns count: $($gaps.Count)"
# Group contiguous gap ranges
$ranges = @()
$start = $null
$prev = $null
foreach ($g in $gaps) {
    if ($null -eq $start) {
        $start = $g
        $prev = $g
    } elseif ($g -eq $prev + 1) {
        $prev = $g
    } else {
        $ranges += "$start-$prev"
        $start = $g
        $prev = $g
    }
}
if ($null -ne $start) {
    $ranges += "$start-$prev"
}
Write-Host "Gap ranges: $($ranges -join ', ')"
$bmp.Dispose()
