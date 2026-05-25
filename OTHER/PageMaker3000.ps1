# =====================================================================
# THE THANGER-NAVIGATOR v1.8 (Logic-Split / Error-Free Edition)
# =====================================================================


$wikiRoot = (Get-Item $PSScriptRoot).Parent.FullName 

$templateFolder = Join-Path $wikiRoot "templates"
$assetsRoot     = Join-Path $wikiRoot "assets"
$wikisFolder    = Join-Path $wikiRoot "wikis"

# FIX: Look for drafts INSIDE website-stuffs instead of outside
$draftsFolder   = Join-Path $wikiRoot "drafts"
$wikisFolder = Join-Path $wikiRoot "wikis"

# --- 2. Select Output Destination ---
Write-Host "`n=== [1] TARGET ACQUISITION ===" -ForegroundColor Cyan
$destinations = Get-ChildItem -Path $wikisFolder -Directory -Recurse | Where-Object { $_.Name -ne "OTHER" }
for ($i = 0; $i -lt $destinations.Count; $i++) {
    Write-Host " [$i] $($destinations[$i].FullName.Substring($wikisFolder.Length + 1))" -ForegroundColor Gray
}
$outputIdx = Read-Host "`n> Select target number"
$outputFolder = $destinations[$outputIdx].FullName
$depth = ($destinations[$outputIdx].FullName.Substring($wikisFolder.Length + 1).Split([System.IO.Path]::DirectorySeparatorChar)).Count
$upDir = "../" * ($depth + 1)

# --- 3. Select Template FIRST ---
Write-Host "`n=== [2] TEMPLATE SELECTION ===" -ForegroundColor Cyan
$templates = Get-ChildItem "$templateFolder\*.html"
for ($i = 0; $i -lt $templates.Count; $i++) { Write-Host " [$i] $($templates[$i].Name)" }
$tIdx = Read-Host "`n> Select template number"
$selectedTemplate = $templates[$tIdx]
$templateContent = Get-Content $selectedTemplate.FullName -Raw -Encoding UTF8

# --- 4. THE CONDITIONAL GATE ---
$chosenIconUrl = ""
$chosenBGUrl = ""

if ($selectedTemplate.Name -like "*wiki*") {
    
    function Get-FileFromExplorer($Type) {
        $currentPath = $assetsRoot
        $selectedFile = $null
        while ($true) {
            Clear-Host
            Write-Host "=== EXPLORING FOR: $Type ===" -ForegroundColor Magenta
            Write-Host "Path: assets/$($currentPath.Substring($assetsRoot.Length).Replace('\','/'))`n" -ForegroundColor Gray
            $items = Get-ChildItem -Path $currentPath
            Write-Host " [..] (Go Up)" -ForegroundColor Yellow
            
            for ($i = 0; $i -lt $items.Count; $i++) {
                # Split logic out to avoid the 'if' cmdlet error
                $tag = "      "
                $itemColor = "Gray"
                if ($items[$i].PSIsContainer) { 
                    $tag = "[DIR] "
                    $itemColor = "Cyan"
                }
                
                Write-Host " [$i] $tag $($items[$i].Name)" -ForegroundColor $itemColor
            }
            
            $input = Read-Host "`n[ 's' to Confirm | Number to Enter | '..' to Go Up ]"
            if ($input -eq "s") {
                if ($selectedFile) { return $selectedFile }
                else { Write-Host "No file selected!" -ForegroundColor Red; Start-Sleep -s 1 }
            }
            elseif ($input -eq "..") { if ($currentPath.Length -gt $assetsRoot.Length) { $currentPath = Split-Path $currentPath -Parent } }
            else { 
                $choice = $items[[int]$input]
                if ($choice.PSIsContainer) { $currentPath = $choice.FullName } 
                else { $selectedFile = $choice; Write-Host "`nSELECTED: $($choice.Name). Press 's' to confirm." -ForegroundColor Green; Start-Sleep -s 1 }
            }
        }
    }

    $iconFile = Get-FileFromExplorer "ICON"
    $bgFile = Get-FileFromExplorer "BACKGROUND"
    
    $chosenIconUrl = $upDir + "assets/" + $iconFile.FullName.Substring($assetsRoot.Length + 1).Replace('\','/')
    $chosenBGUrl = $upDir + "assets/" + $bgFile.FullName.Substring($assetsRoot.Length + 1).Replace('\','/')
}

# --- 5. Final Synthesis ---
Write-Host "`n=== [3] SYNTHESIZING PAGES ===" -ForegroundColor Cyan
$drafts = Get-ChildItem "$draftsFolder\*.html"
foreach ($file in $drafts) {
    $raw = Get-Content $file.FullName -Raw -Encoding UTF8
    $title = $file.BaseName -replace "-", " "
    
    $finalHtml = $templateContent -replace '(?i)\{\{PAGE_CONTENT\}\}', $raw `
                                  -replace '(?i)\{\{TITLE\}\}', $title `
                                  -replace '(?i)\{\{icon\}\}', $chosenIconUrl `
                                  -replace '(?i)\{\{bg\}\}', $chosenBGUrl
    
    $outputPath = Join-Path $outputFolder $file.Name
    [System.IO.File]::WriteAllText($outputPath, $finalHtml, (New-Object System.Text.UTF8Encoding $false))
    Write-Host " [DONE] Created: $($file.Name)" -ForegroundColor Green
}
Write-Host "`nDeployment Complete. 🫡" -ForegroundColor Cyan