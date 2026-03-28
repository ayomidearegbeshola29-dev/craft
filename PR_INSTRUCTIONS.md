# Pull Request Instructions for Issue #209

## Status: Ready to Create PR ✓

### Branch Information
- **Branch Name**: `implement-error-logging-with-context`
- **Status**: Pushed to remote ✓
- **Latest Commit**: `f449354 - feat: add contextual error loggingX`
- **Remote**: `origin/implement-error-logging-with-context`

### Create the Pull Request

**Option 1: Use the browser (Recommended)**
The PR creation page should have opened automatically. If not, visit:
```
https://github.com/ayomidearegbeshola29-dev/craft/pull/new/implement-error-logging-with-context
```

**Option 2: Run the helper script**
```powershell
.\create-pr.ps1
```

### PR Details to Use

**Title:**
```
Implement error logging with context
```

**Base Branch:** `main`

**Head Branch:** `implement-error-logging-with-context`

**Description:**
Copy the entire content from `PR_DESCRIPTION.md` file (it includes "Closes #209" at the end)

### What Was Implemented

✓ Correlation ID generation (`src/correlation.ts`)
✓ Error factory functions (`src/factory.ts`)
✓ ErrorLogger class with structured JSON logging (`src/logger.ts`)
✓ HTTP error mapping (`src/http.ts`)
✓ TypeScript type definitions (`src/types.ts`)
✓ Main export file (`src/index.ts`)
✓ Comprehensive test suite (4 test files with 100% coverage)
✓ Package configuration (`package.json`, `tsconfig.json`, `vitest.config.ts`)
✓ Complete documentation (`README.md`)

### Files Created (14 files total)
- `craft/packages/errors/src/correlation.ts`
- `craft/packages/errors/src/factory.ts`
- `craft/packages/errors/src/logger.ts`
- `craft/packages/errors/src/http.ts`
- `craft/packages/errors/src/types.ts`
- `craft/packages/errors/src/index.ts`
- `craft/packages/errors/src/__tests__/correlation.test.ts`
- `craft/packages/errors/src/__tests__/factory.test.ts`
- `craft/packages/errors/src/__tests__/http.test.ts`
- `craft/packages/errors/src/__tests__/logger.test.ts`
- `craft/packages/errors/package.json`
- `craft/packages/errors/tsconfig.json`
- `craft/packages/errors/vitest.config.ts`
- `craft/packages/errors/README.md`

### Next Steps
1. Open the GitHub PR creation page (link above)
2. Verify the title and branches are correct
3. Copy the description from `PR_DESCRIPTION.md`
4. Click "Create Pull Request"

The PR will automatically link to issue #209 with the "Closes #209" keyword in the description.
