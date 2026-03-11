param(
  [string]$Name = "Agenda",
  [string]$Destination = [Environment]::GetFolderPath("Desktop"),
  [ValidateSet("Auto", "Edge", "Chrome")]
  [string]$Browser = "Auto"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$appFile = Join-Path $projectRoot "index.html"
$iconPath = Join-Path $projectRoot "assets\agenda-icon.ico"
$appUri = "file:///" + (($appFile -replace "\\", "/") -replace " ", "%20")

function Resolve-BrowserPath {
  param([string]$Choice)

  $edgeCandidates = @(
    "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
  )

  $chromeCandidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
  )

  if ($Choice -eq "Edge" -or $Choice -eq "Auto") {
    foreach ($candidate in $edgeCandidates) {
      if (Test-Path $candidate) {
        return $candidate
      }
    }
  }

  if ($Choice -eq "Chrome" -or $Choice -eq "Auto") {
    foreach ($candidate in $chromeCandidates) {
      if (Test-Path $candidate) {
        return $candidate
      }
    }
  }

  return $null
}

$browserPath = Resolve-BrowserPath -Choice $Browser

if (-not $browserPath) {
  throw "No se encontro Edge ni Chrome para crear el acceso directo."
}

$shortcutPath = Join-Path $Destination "$Name.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $browserPath
$shortcut.Arguments = "--app=""$appUri"""
$shortcut.WorkingDirectory = $projectRoot
$shortcut.IconLocation = "$iconPath,0"
$shortcut.Description = "Agenda personal minimalista"
$shortcut.Save()

Write-Host "Acceso directo creado en: $shortcutPath"
