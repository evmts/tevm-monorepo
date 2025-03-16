# Zod Removal Progress

This document tracks the progress of removing Zod from the @tevm/actions package.

## Current Status

The package is currently undergoing a transition from Zod-based validation to vanilla JavaScript validation.

TypeScript type checking has been re-enabled. We've fixed several type issues in Call/callHandlerOpts.js and other files, but there are still remaining type errors to be addressed.

## Changes Made So Far

1. Removed Zod as a dependency in package.json
2. Added vanilla JavaScript validation in multiple files including:
   - validateBaseCallParams.js
   - validateCallParams.js
   - zCallParams.js (Zod-compatible interface around vanilla validation)
   - and many others

## Remaining Work

1. Complete validation implementations across all remaining files
2. Fix type definitions and interfaces to work without Zod
3. Address type errors in various files including:
   - Call/callHandlerOpts.js
   - Call/callProcedure.js
   - Contract/validateContractParams.js
   - And others identified in the typecheck logs

## How to Re-enable Type Checking

Once the transition is complete, update the `typecheck` script in package.json:

```json
"typecheck": "tsc --noEmit"
```

And remove the relaxed TypeScript settings from tsconfig.json.

## Validation Approach

The new validation approach uses:

1. Simple JavaScript functions that check types and values
2. Return consistent error objects
3. Maintain Zod-compatible interfaces for backward compatibility during transition

## Benefits of Removing Zod

1. Reduced package size and dependencies
2. Improved performance for validation
3. Simpler, more maintainable code