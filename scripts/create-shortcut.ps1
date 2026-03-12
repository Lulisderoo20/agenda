param(
  [string]$Name = "Agenda",
  [string]$Destination = [Environment]::GetFolderPath("Desktop"),
  [string]$Url = "https://lulisderoo20.github.io/agenda/",
  [ValidateSet("Auto", "Edge", "Chrome")]
  [string]$Browser = "Auto",
  [switch]$PinTaskbar
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$iconPath = Join-Path $projectRoot "assets\agenda-icon.ico"
$appUri = $Url

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

function Try-PinTaskbar {
  param([string]$ShortcutPath)

  $folderPath = Split-Path -Parent $ShortcutPath
  $shortcutName = Split-Path -Leaf $ShortcutPath
  $shellApp = New-Object -ComObject Shell.Application
  $folder = $shellApp.Namespace($folderPath)

  if (-not $folder) {
    return $false
  }

  $item = $folder.ParseName($shortcutName)

  if (-not $item) {
    return $false
  }

  $verbs = @($item.Verbs())

  foreach ($verb in $verbs) {
    $label = ($verb.Name -replace "&", "").Trim()

    if ($label -match "Desanclar de la barra de tareas|Unpin from taskbar") {
      return $true
    }

    if ($label -match "Anclar a la barra de tareas|Pin to taskbar") {
      $verb.DoIt()
      Start-Sleep -Milliseconds 900
      return $true
    }
  }

  try {
    $item.InvokeVerb("taskbarpin")
    Start-Sleep -Milliseconds 900
    return $true
  } catch {
    return $false
  }
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

if ($PinTaskbar) {
  if (Try-PinTaskbar -ShortcutPath $shortcutPath) {
    Write-Host "Intento de anclado al taskbar ejecutado."
  } else {
    Write-Warning "Windows no expuso un verbo de anclado automatico para este acceso directo."
  }
}
