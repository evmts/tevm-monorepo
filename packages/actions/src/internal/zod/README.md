# Zod Adapters

## Deprecation Notice

The zod library is being deprecated in this codebase. These files serve as adapter layers to make the transition away from zod smoother without requiring large-scale refactoring.

## Purpose

This directory and other `z*.js` files throughout the codebase contain zod schema adapters that:

1. Maintain the existing API and validation behavior
2. Allow for a gradual, non-breaking migration away from zod
3. Abstract the validation implementation details from the rest of the codebase

## Usage

These adapters should continue to be used as before. The internal implementation may change, but the external API will remain the same during the transition.

## Migration Plan

We are gradually moving away from zod to reduce dependencies and simplify the codebase. The adapter pattern used here allows us to:

1. Replace the underlying implementation without changing consumer code
2. Test new validation approaches in isolation
3. Maintain backward compatibility throughout the transition

Once the migration is complete, these adapter files may be simplified further or consolidated into a custom validation solution.