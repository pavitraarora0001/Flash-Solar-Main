Add-Type -AssemblyName System.Drawing
$file = "flashsolar-platform\public\images\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($file)

for ($x = 10; $x -lt 250; $x += 20) {
    for ($y = 20; $y -lt 220; $y += 20) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 30) {
            $msg = "x=" + $x + ", y=" + $y + " -> A=" + $p.A + " R=" + $p.R + " G=" + $p.G + " B=" + $p.B
            Write-Host $msg
            break
        }
    }
}
$bmp.Dispose()
