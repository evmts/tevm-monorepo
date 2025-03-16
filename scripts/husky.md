# Husky Commands for Tevm Monorepo

## Commit Guidelines

When making commits in this repository, always use emoji prefixes to categorize the type of change:

- 📝 docs: Documentation changes (e.g., JSDoc, README, etc.)
- ✨ feat: New features
- 🐛 fix: Bug fixes
- ♻️ refactor: Code refactoring without functionality changes
- 🚀 perf: Performance improvements
- 🧪 test: Adding or updating tests
- 🔧 chore: Maintenance tasks, dependency updates, etc.
- 💄 style: Code style changes (formatting, etc.)
- 🔥 remove: Removing code or files

Example commit message:
```
📝 docs: improve JSDoc documentation across packages

Enhanced JSDoc documentation in multiple packages, improving type definitions
and documentation markdown files.
```

## Pre-Commit Checks

The husky pre-commit hook will:

1. Verify the repo is in a working state
2. Fix issues if they exist
3. Run through the following checks:
   - Run `pnpm i` to ensure dependencies are up to date
   - Check linter with `pnpm lint`
   - Check types and build with `pnpm nx run-many --targets=typecheck`
   - Check tests with `pnpm nx run-many --target=test:coverage`
   - Verify package.json files are sorted with `pnpm run sort-package-json`
   - Verify packages are linted with `pnpm nx run-many --targets=lint:package,lint:deps`

## Protocol When Something Breaks

When encountering errors during pre-commit checks:

1. Explain why it's broken:
   - Provide a complete explanation with source code and logs
   - Add console logs if needed to gather more information

2. Fix the issue:
   - Propose a specific fix
   - Explain why you believe it will work
   - If the fix doesn't work, go back to step 1

3. Consider if the same bug exists elsewhere:
   - Check if the bug might appear in other places
   - Fix all instances

4. Clean up:
   - Remove any added console.logs
   - Run checks again to verify the fix