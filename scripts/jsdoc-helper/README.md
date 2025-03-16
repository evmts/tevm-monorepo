# JSDoc Helper Scripts

These scripts help you find and add JSDoc comments to JavaScript and TypeScript files in the Tevm monorepo.

## Scripts

### 1. `find-missing-jsdoc.js`

Scans files for exported symbols without JSDoc comments and suggests appropriate documentation.

**Usage:**
```
npm run find-missing-jsdoc [directory]
```

**Example:**
```
npm run find-missing-jsdoc packages/state
```

### 2. `add-jsdoc.js`

Adds JSDoc comments to a specific file.

**Usage:**
```
npm run jsdoc:add [file-path]
```

**Example:**
```
npm run jsdoc:add packages/state/src/state-types/ForkOptions.ts
```

### 3. `batch-add-jsdoc.js`

Automatically adds JSDoc comments to all files with missing documentation in a directory.

**Usage:**
```
npm run jsdoc:batch [directory]
```

**Example:**
```
npm run jsdoc:batch packages/state
```

## JSDoc Format

The scripts generate JSDoc comments following the Tevm project's conventions:

- Complete documentation including parameters, return values, and examples
- Working examples with imports
- Proper formatting for different export types (functions, classes, variables, etc.)

## Tips

1. Find missing JSDoc first, then review the suggestions before batch-adding:
   ```
   npm run find-missing-jsdoc packages/my-package
   ```

2. For targeted fixes on specific files:
   ```
   npm run jsdoc:add packages/my-package/src/specific-file.js
   ```

3. To automatically add JSDoc to all files in a package:
   ```
   npm run jsdoc:batch packages/my-package
   ```

4. After adding JSDoc, run the linter to ensure formatting is correct:
   ```
   npm run lint
   ```

5. After adding JSDoc, generate the documentation to see the results:
   ```
   npm run generate:docs
   ```

## Notes

- The generated JSDoc stubs contain placeholders like `[Description]` that should be filled in with actual documentation.
- The examples need to be customized with the actual package path and usage examples.
- Always review and improve the auto-generated JSDoc before committing changes.