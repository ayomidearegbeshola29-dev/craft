# Script to create PR for issue #209
# Run this script if the browser didn't open automatically

$prUrl = "https://github.com/ayomidearegbeshola29-dev/craft/pull/new/implement-error-logging-with-context"

Write-Host "Opening PR creation page in browser..." -ForegroundColor Green
Write-Host "URL: $prUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "PR Details:" -ForegroundColor Yellow
Write-Host "  Title: Implement error logging with context"
Write-Host "  Base: main"
Write-Host "  Head: implement-error-logging-with-context"
Write-Host ""
Write-Host "Copy the description from PR_DESCRIPTION.md file" -ForegroundColor Yellow
Write-Host ""

Start-Process $prUrl
