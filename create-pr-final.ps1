# Create PR for Error Logging Implementation

Write-Host "Opening GitHub PR creation page..." -ForegroundColor Green
Write-Host ""
Write-Host "Branch 'error-logging-pr' is already pushed to GitHub!" -ForegroundColor Cyan
Write-Host ""
Write-Host "PR Details:" -ForegroundColor Yellow
Write-Host "  Base: StellerCraft/craft:main"
Write-Host "  Head: ayomidearegbeshola29-dev/craft:error-logging-pr"
Write-Host "  Title: Implement error logging with context"
Write-Host "  Closes: #209"
Write-Host ""

# Open the PR creation page
$url = "https://github.com/StellerCraft/craft/compare/main...ayomidearegbeshola29-dev:craft:error-logging-pr?expand=1"
Start-Process $url

Write-Host "Browser opened! Please:" -ForegroundColor Green
Write-Host "1. Fill in the title: 'Implement error logging with context'"
Write-Host "2. Copy the description from PR_DESCRIPTION.md"
Write-Host "3. Make sure it includes 'Closes #209'"
Write-Host "4. Click 'Create pull request'"
Write-Host ""
Write-Host "The PR description is ready in PR_DESCRIPTION.md" -ForegroundColor Cyan
