param(
    [string]$url = "http://localhost:3000",
    [string]$outputPath = "flashsolar-platform/test-screenshot.png",
    [int]$width = 1440,
    [int]$height = 900
)

$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chrome = $null
foreach ($p in $chromePaths) {
    if (Test-Path $p) {
        $chrome = $p
        break
    }
}

if (-not $chrome) {
    Write-Error "Chrome not found"
    exit 1
}

$tempUserData = Join-Path $env:TEMP ("chrome_headless_" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempUserData -Force | Out-Null

$resolvedOutput = [System.IO.Path]::GetFullPath($outputPath)

$cmdArgs = "--headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=$width,$height --virtual-time-budget=3000 --run-all-compositor-stages-before-draw --user-data-dir=`"$tempUserData`" --screenshot=`"$resolvedOutput`" `"$url`""

Write-Host "Running Chrome with: $cmdArgs"
$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = $chrome
$pinfo.Arguments = $cmdArgs
$pinfo.UseShellExecute = $false
$pinfo.RedirectStandardOutput = $true
$pinfo.RedirectStandardError = $true
$pinfo.CreateNoWindow = $true

$proc = [System.Diagnostics.Process]::Start($pinfo)
$stdout = $proc.StandardOutput.ReadToEnd()
$stderr = $proc.StandardError.ReadToEnd()
$proc.WaitForExit(30000)

Write-Host "Chrome finished with exit code $($proc.ExitCode)"
if ($stdout) { Write-Host "STDOUT: $stdout" }
if ($stderr) { Write-Host "STDERR: $stderr" }

Start-Sleep -Milliseconds 500
try { Remove-Item -Path $tempUserData -Recurse -Force -ErrorAction SilentlyContinue } catch {}

if (Test-Path $resolvedOutput) {
    $item = Get-Item $resolvedOutput
    Write-Host "Screenshot saved successfully: $($item.FullName) ($($item.Length) bytes)"
} else {
    Write-Error "Screenshot file was not created"
}
