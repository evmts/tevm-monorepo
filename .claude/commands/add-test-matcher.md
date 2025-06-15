# Add Test Matcher

This command helps you create new Vitest matchers for the `@tevm/test-matchers` package. The workflow combines user requirement gathering with comprehensive implementation guidance.

## Step 1: Gather Requirements

Before implementing a new test matcher, I need to understand what you want to create. Please provide the following information:

### A. Matcher Details
- **Primary Matcher Name**: What should the main matcher be called? (e.g., `toBeValidUser`, `toHaveLength`)
- **Category**: What category does this matcher belong to? (e.g., `user`, `collection`, `database`)
- **Chained Matchers**: If this is a chainable matcher, what secondary matchers should be available? (e.g., `withRole`, `withProperty`)

### B. Behavior Description
- **Synchronicity**: Is this matcher synchronous or asynchronous?
- **Chainability**: Is this a simple matcher or a chainable matcher?
- **Functionality**: What should the matcher do? Be specific about arguments, expected behavior, and what constitutes pass/fail conditions.

### C. Example Usage
Provide examples of how you envision using the matcher:
```typescript
// Example:
expect(userId).toBeValidUser()
expect(userId).toBeValidUser().withRole('admin')
```

## Step 2: Implementation Guide

Once you provide the requirements above, I'll implement the matcher following the architectural patterns below.

### Core Architecture

The matcher system is built on a modular, category-based structure that plugs into `vitest`'s `expect` API.

#### Key Directories & Files

- `src/index.ts`: The central entry point for registering matchers with `vitest`
- `src/common/`: Contains shared TypeScript types across matcher categories
- `src/chainable/`: Core engine for chainable assertions (DO NOT modify)
- `src/matchers/`: Root directory for all matcher implementations
- `src/matchers/<category>/`: Each subdirectory represents a logical grouping of related matchers
- `src/matchers/<category>/index.ts`: Entry point for a category, exports all public matchers and interfaces

#### Core Types

**From `src/chainable/types.ts`:**

- `MatcherResult<TState>`: Standard return type for any matcher function
  ```typescript
  type MatcherResult<TState = unknown> = {
    pass: boolean; // Did the assertion pass?
    message: () => string; // Error message to show on failure
    actual?: unknown; // The value that was received
    expected?: unknown; // The value that was expected
    state?: TState; // Optional object to pass to next matcher in chain
  };
  ```

- `ChainState<TData, TState>`: Object passed to secondary matchers in a chain
  ```typescript
  interface ChainState<TData = unknown, TState = unknown> {
    chainedFrom: string | undefined; // Name of previous matcher
    previousPassed: boolean | undefined; // `pass` result of previous matcher
    previousValue: TData | undefined; // The object being asserted on
    previousState: TState | undefined; // The `state` object from previous matcher
    previousArgs: readonly unknown[] | undefined; // Arguments passed to previous matcher
  }
  ```

- `ChainableAssertion<T>`: Special return type for `async` chainable matchers

**From `src/chainable/chainable.ts`:**

- `createChainableFromVitest`: Factory function that wraps matcher logic into the chainable system
- `registerChainableMatchers`: Registers a collection of chainable matchers with `vitest`
- `parseChainArgs`: Helper for secondary matchers with variable arguments

### Implementation Patterns

#### Simple Matcher Pattern

For standalone assertions that don't chain:

1. **Create Files:**
   - `src/matchers/<category>/<matcherName>.ts` (implementation)
   - `src/matchers/<category>/<matcherName>.spec.ts` (tests)
   - `src/matchers/<category>/index.ts` (category exports)

2. **Implementation Example:**
   ```typescript
   // src/matchers/collection/toBeOfLength.ts
   import type { MatcherResult } from '../../chainable/types.js'

   export const toBeOfLength = (received: unknown, expectedLength: number): MatcherResult => {
     if (!received || typeof (received as any).length !== 'number') {
       return {
         pass: false,
         message: () => `Expected value to have a 'length' property, but it was not found.`,
         actual: received,
       }
     }

     const actualLength = (received as any).length
     const pass = actualLength === expectedLength

     return {
       pass,
       message: () =>
         pass
           ? `Expected value not to have length ${expectedLength}`
           : `Expected value to have length ${expectedLength}, but it was ${actualLength}`,
       actual: actualLength,
       expected: expectedLength,
     }
   }
   ```

3. **Register in Category:**
   ```typescript
   // src/matchers/collection/index.ts
   import { toBeOfLength } from './toBeOfLength.js'

   export { toBeOfLength }

   export interface CollectionMatchers {
     toBeOfLength(expectedLength: number): void
   }
   ```

4. **Register Globally:**
   ```typescript
   // src/index.ts
   import { expect } from 'vitest'
   import { type CollectionMatchers, toBeOfLength } from './matchers/collection/index.js'

   expect.extend({
     toBeOfLength,
   })

   declare module 'vitest' {
     interface Assertion<T = any> extends CollectionMatchers {}
     interface AsymmetricMatchersContaining extends CollectionMatchers {}
   }
   ```

#### Chainable Matcher Pattern

For complex, multi-part assertions:

1. **Create Files:**
   - `src/matchers/<category>/types.ts` (shared state types)
   - `src/matchers/<category>/<primaryMatcher>.ts` (primary matcher)
   - `src/matchers/<category>/<secondaryMatcher>.ts` (secondary matcher)
   - `src/matchers/<category>/index.ts` (category exports and types)
   - `src/matchers/<category>/<primaryMatcher>.spec.ts` (tests)

2. **Define Shared State:**
   ```typescript
   // src/matchers/database/types.ts
   export interface FoundItem {
     id: number
     name: string
     value: bigint
   }

   export interface ToFindItemState {
     foundItem: FoundItem | undefined
   }
   ```

3. **Primary Matcher:**
   ```typescript
   // src/matchers/database/toFindItem.ts
   import type { MatcherResult } from '../../chainable/types.js'
   import type { FoundItem, ToFindItemState } from './types.js'

   export const toFindItem = async (
     receivedPromise: Promise<number>,
   ): Promise<MatcherResult<ToFindItemState>> => {
     try {
       const id = await receivedPromise
       const foundItem = await fetchItem(id) // Your lookup logic
       const pass = foundItem !== undefined

       return {
         pass,
         message: () => pass 
           ? `Expected item with id ${id} not to be found` 
           : `Expected item with id ${id} to be found, but it was not`,
         state: { foundItem }, // Pass data to secondary matcher
       }
     } catch (e) {
       return { pass: false, message: () => `Promise for ID rejected: ${e}` }
     }
   }
   ```

4. **Secondary Matcher:**
   ```typescript
   // src/matchers/database/withProperty.ts
   import type { ChainState, MatcherResult } from '../../chainable/types.js'
   import type { FoundItem, ToFindItemState } from './types.js'

   export const withProperty = <K extends keyof FoundItem>(
     received: unknown, // Previous chain result (can be ignored)
     key: K,
     expectedValue: FoundItem[K],
     chainState?: ChainState<unknown, ToFindItemState>, // Always last parameter
   ): MatcherResult => {
     if (!chainState?.previousState) {
       throw new Error('withProperty() must be chained after toFindItem()')
     }

     const { foundItem } = chainState.previousState
     if (!foundItem) {
       return { pass: false, message: () => 'Cannot check property of an unfound item.' }
     }

     const actualValue = foundItem[key]
     const pass = actualValue === expectedValue

     return {
       pass,
       actual: actualValue,
       expected: expectedValue,
       message: () =>
         pass
           ? `Expected property '${key}' not to be '${expectedValue}'`
           : `Expected property '${key}' to be '${expectedValue}', but it was '${actualValue}'`,
     }
   }
   ```

5. **Wire Up Chainable System:**
   ```typescript
   // src/matchers/database/index.ts
   import { createChainableFromVitest } from '../../chainable/chainable.js'
   import type { ChainableAssertion } from '../../chainable/types.js'
   import type { FoundItem } from './types.js'
   import { toFindItem } from './toFindItem.js'
   import { withProperty } from './withProperty.js'

   export const toFindItemChainable = createChainableFromVitest({
     name: 'toFindItem' as const,
     vitestMatcher: toFindItem,
   })

   export const withPropertyChainable = createChainableFromVitest({
     name: 'withProperty' as const,
     vitestMatcher: withProperty,
   })

   export const chainableDatabaseMatchers = {
     toFindItem: toFindItemChainable,
     withProperty: withPropertyChainable,
   }

   export interface DatabaseMatchers {
     toFindItem(): Promise<DatabaseAssertion> & DatabaseAssertion
   }

   interface DatabaseAssertion {
     withProperty<K extends keyof FoundItem>(key: K, value: FoundItem[K]): ChainableAssertion
   }
   ```

6. **Register Globally:**
   ```typescript
   // src/index.ts
   import { registerChainableMatchers } from './chainable/chainable.js'
   import {
     type DatabaseMatchers,
     chainableDatabaseMatchers,
   } from './matchers/database/index.js'

   registerChainableMatchers(chainableDatabaseMatchers)

   declare module 'vitest' {
     interface Assertion<T = any> extends DatabaseMatchers {}
     interface AsymmetricMatchersContaining extends DatabaseMatchers {}
   }
   ```

### Testing Requirements

All matchers MUST include comprehensive tests:

```typescript
// src/matchers/database/toFindItem.spec.ts
import { describe, expect, it } from 'vitest'

describe('toFindItem', () => {
  it('should pass when an item is found', async () => {
    await expect(Promise.resolve(1)).toFindItem()
  })

  it('should fail when an item is not found', async () => {
    await expect(expect(Promise.resolve(99)).toFindItem()).rejects.toThrow(
      'Expected item with id 99 to be found, but it was not',
    )
  })

  describe('chaining with .withProperty()', () => {
    it('should pass if property matches', async () => {
      await expect(Promise.resolve(1)).toFindItem().withProperty('name', 'Alice')
    })

    it('should fail if property does not match', async () => {
      await expect(
        expect(Promise.resolve(1)).toFindItem().withProperty('name', 'Bob'),
      ).rejects.toThrow("Expected property 'name' to be 'Bob', but it was 'Alice'")
    })

    it('.not should pass for a non-matching property', async () => {
      await expect(Promise.resolve(1)).toFindItem().not.withProperty('name', 'Bob')
    })
  })
})
```

### Quality Guidelines

- **Strict Adherence**: Follow the architectural patterns exactly
- **Code Quality**: Write clean, modern, strongly-typed TypeScript. Use `const` over `let`, avoid `any`
- **State Management**: For chainable matchers, define dedicated `TState` interfaces in `types.ts`
- **Comprehensive Testing**: Test happy path, failure scenarios, and `.not` modifier
- **Clear Error Messages**: Provide helpful error messages for both passing and failing assertions
- **No Mocks**: Tests should use real implementations, not mocks

### Variable Arguments

For secondary matchers accepting variable arguments, use `parseChainArgs`:

```typescript
import { parseChainArgs } from '../../chainable/chainable.js'

export const withProperties = (
  received: unknown,
  ...argsAndChainState: readonly [string, any, ...Array<string | any>, ChainState<...>]
): MatcherResult => {
  const { args, chainState } = parseChainArgs(argsAndChainState)
  // Use args and chainState as needed
}
```

## Step 3: Ready to Implement

Once you provide the requirements in **Step 1**, I'll implement the complete matcher following these patterns, including:

- All necessary TypeScript files
- Comprehensive test suite
- Proper registration and type declarations
- Clear error messages and state management

Please provide your matcher requirements and I'll create the complete implementation for you!