
$templatePath = Join-Path $PSScriptRoot "Template.html"
$draftsFolder = Join-Path $PSScriptRoot "../drafts"
$outputFolder = Join-Path $PSScriptRoot "pages"

if (Test-Path $templatePath) {
    $template = Get-Content $templatePath -Raw -Encoding UTF8
} else {
    Write-Error "Template.html not found at $templatePath!"
    return
}

if (-not (Test-Path $draftsFolder)) {
    Write-Error "Drafts folder not found at $draftsFolder!"
    return
}
$draftFiles = Get-ChildItem "$draftsFolder/*.html"

$utf8WithBom = New-Object System.Text.UTF8Encoding $true

foreach ($file in $draftFiles) {
    $rawContent = Get-Content $file.FullName -Raw -Encoding UTF8
    
    $pageTitle = $file.BaseName -replace "-", " "
    
    $finalHtml = $template.Replace("{{PAGE_CONTENT}}", $rawContent)
    $finalHtml = $finalHtml.Replace("{{TITLE}}", $pageTitle)
    
    if (-not (Test-Path $outputFolder)) { New-Item -ItemType Directory -Path $outputFolder }
    
    $outputPath = Join-Path $outputFolder $file.Name

    [System.IO.File]::WriteAllText($outputPath, $finalHtml, $utf8WithBom)
    
    Write-Host "✅ Synthesized: $outputPath" -ForegroundColor Cyan
}

Write-Host "`nAll pages updated! 🎀" -ForegroundColor Green
