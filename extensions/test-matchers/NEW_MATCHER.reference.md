# Vitest Matcher Implementation Guide

## 1. Introduction

This document provides the definitive architectural blueprint for creating new `vitest` matchers within this framework. It is a self-contained guide intended to provide all necessary context for building everything from simple, synchronous assertions to complex, asynchronous, stateful, and chainable matchers.

Following this guide will ensure that new matchers are consistent, maintainable, and seamlessly integrate with the existing infrastructure and TypeScript environment.

## 2. Core Architecture

Our matcher system is built on a modular, category-based structure that plugs into `vitest`'s `expect` API.

### 2.1. Key Directories & Files

-   `src/index.ts`: The central entry point. This file is responsible for importing all matcher categories and registering them with `vitest`.
-   `src/common/`: Contains shared TypeScript types that might be useful across different matcher categories.
-   `src/chainable/`: The core engine that enables chainable assertions. **This directory should not be modified.** It provides the necessary tools to create fluent APIs like `expect(...).toDoSomething().withSomethingElse(...)`.
-   `src/matchers/`: The root directory for all matcher implementations.
-   `src/matchers/<category>/`: Each subdirectory here represents a logical grouping of related matchers (a "category").
-   `src/matchers/<category>/index.ts`: The entry point for a category. It exports all public matchers and TypeScript interfaces for that category.

### 2.2. The Chainable Engine (`src/chainable/`)

The power of our chainable matchers comes from a small set of core utilities and types. You don't need to modify these, but understanding their role is crucial.

**Key Exports from `src/chainable/types.ts`**:

-   `MatcherResult<TState>`: The standard return type for any matcher function.
    ```typescript
    type MatcherResult<TState = unknown> = {
    	pass: boolean; // Did the assertion pass?
    	message: () => string; // The error message to show on failure.
    	actual?: unknown; // The value that was received.
    	expected?: unknown; // The value that was expected.
    	state?: TState; // An optional object to pass to the next matcher in a chain.
    };
    ```
-   `ChainState<TData, TState>`: An object passed implicitly to every secondary matcher in a chain, containing the result of the previous one.
    ```typescript
    interface ChainState<TData = unknown, TState = unknown> {
    	chainedFrom: string | undefined; // Name of the previous matcher.
    	previousPassed: boolean | undefined; // `pass` result of the previous matcher.
    	previousValue: TData | undefined; // The object being asserted on.
    	previousState: TState | undefined; // The `state` object from the previous matcher.
    	previousArgs: readonly unknown[] | undefined; // The arguments passed to the previous matcher.
    }
    ```
-   `ChainableAssertion<T>`: A special return type for `async` chainable matchers, allowing `.then()` and further chaining. It's essentially `Promise<Assertion<T>> & Assertion<T>`.

**Key Exports from `src/chainable/chainable.ts`**:

-   `createChainableFromVitest`: A factory function that wraps your matcher logic into the chainable system.
-   `registerChainableMatchers`: Registers a collection of chainable matchers with `vitest`.
-   `parseChainArgs`: A helper for secondary matchers that accept a variable number of arguments.

---

## 3. Tutorial: Creating a Simple Matcher

Simple matchers are standalone assertions that don't chain. They are added directly to `vitest` via `expect.extend`.

**Goal**: Implement `toBeOfLength(number)`, which asserts that an array or string has a specific length.

### Step 1: Scaffolding

1.  Create category directory: `src/matchers/collection/`
2.  Create matcher file: `src/matchers/collection/toBeOfLength.ts`
3.  Create spec file: `src/matchers/collection/toBeOfLength.spec.ts`
4.  Create category index: `src/matchers/collection/index.ts`

### Step 2: Implement the Matcher Logic

**File: `src/matchers/collection/toBeOfLength.ts`**
```typescript
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

### Step 3: Type and Export from Category

**File: `src/matchers/collection/index.ts`**
```typescript
import { toBeOfLength } from './toBeOfLength.js'

// Export the raw matcher function
export { toBeOfLength }

// Define the TypeScript interface for this category
export interface CollectionMatchers {
	toBeOfLength(expectedLength: number): void
}
```

### Step 4: Register Globally

**File: `src/index.ts`**
```typescript
import { expect } from 'vitest'
import { type CollectionMatchers, toBeOfLength } from './matchers/collection/index.js'
// ... other imports

// Add the matcher function to expect.extend
expect.extend({
	toBeOfLength,
	// ... other simple matchers
})

// Add the matcher interface to the vitest module declaration
declare module 'vitest' {
	interface Assertion<T = any> extends CollectionMatchers /*, OtherMatchers */ {}
	interface AsymmetricMatchersContaining extends CollectionMatchers /*, OtherMatchers */ {}
}
```

### Step 5: Write Tests

**File: `src/matchers/collection/toBeOfLength.spec.ts`**
```typescript
import { describe, expect, it } from 'vitest'

describe('toBeOfLength', () => {
	it('should pass for an array with the correct length', () => {
		expect([1, 2, 3]).toBeOfLength(3)
	})

	it('should pass for a string with the correct length', () => {
		expect('hello').toBeOfLength(5)
	})

	it('should fail for an array with the incorrect length', () => {
		expect(() => expect([1, 2]).toBeOfLength(3)).toThrow('Expected value to have length 3, but it was 2')
	})

	it('.not should pass for an incorrect length', () => {
		expect([1, 2, 3]).not.toBeOfLength(4)
	})

	it('.not should fail for a correct length', () => {
		expect(() => expect('abc').not.toBeOfLength(3)).toThrow('Expected value not to have length 3')
	})
})
```

---

## 4. Tutorial: Creating a Chainable Matcher

Chainable matchers provide a fluent API for more complex, multi-part assertions. This is the core pattern for async operations and stateful tests.

**Goal**: Implement `toFindItem(id).withProperty('name', 'Alice')`, which finds an item from a simulated async database and then asserts properties on that item.

### Step 1: Scaffolding

1.  Create category directory: `src/matchers/database/`
2.  Create files:
    -   `src/matchers/database/toFindItem.ts` (primary matcher)
    -   `src/matchers/database/withProperty.ts` (secondary matcher)
    -   `src/matchers/database/types.ts` (shared state type)
    -   `src/matchers/database/index.ts` (category index)
    -   `src/matchers/database/toFindItem.spec.ts` (test file)

### Step 2: Define the Shared State

The primary matcher needs to pass the found item to the secondary one. We define a state object for this.

**File: `src/matchers/database/types.ts`**
```typescript
export interface FoundItem {
	id: number
	name: string
	value: bigint
}

// This state will be returned by toFindItem and received by withProperty
export interface ToFindItemState {
	foundItem: FoundItem | undefined
}
```

### Step 3: Implement the Primary Matcher (`toFindItem`)

This matcher is `async`. It takes an ID, performs a lookup, and returns a `MatcherResult` containing the `state`.

**File: `src/matchers/database/toFindItem.ts`**
```typescript
import type { MatcherResult } from '../../chainable/types.js'
import type { FoundItem, ToFindItemState } from './types.js'

// A mock async data fetcher for the example
const fetchItem = async (id: number): Promise<FoundItem | undefined> => {
	const db: FoundItem[] = [{ id: 1, name: 'Alice', value: 100n }]
	return db.find((item) => item.id === id)
}

export const toFindItem = async (
	receivedPromise: Promise<number>,
): Promise<MatcherResult<ToFindItemState>> => {
	try {
		const id = await receivedPromise
		const foundItem = await fetchItem(id)
		const pass = foundItem !== undefined

		return {
			pass,
			message: () => (pass ? `Expected item with id ${id} not to be found` : `Expected item with id ${id} to be found, but it was not`),
			state: { foundItem }, // Pass the found item in the state
		}
	} catch (e) {
		return { pass: false, message: () => `Promise for ID rejected: ${e}` }
	}
}
```

### Step 4: Implement the Secondary Matcher (`withProperty`)

This matcher receives the state from `toFindItem`.

**File: `src/matchers/database/withProperty.ts`**
```typescript
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { FoundItem, ToFindItemState } from './types.js'

export const withProperty = <K extends keyof FoundItem>(
	// received is the value from the previous chain link (the ID promise result).
	// We can ignore it as our logic depends only on the state.
	// @ts-expect-error - unused variable
	received: unknown,
	// The matcher's own arguments:
	key: K,
	expectedValue: FoundItem[K],
	// The final argument is ALWAYS the chain state.
	chainState?: ChainState<unknown, ToFindItemState>,
): MatcherResult => {
	if (!chainState || !chainState.previousState) {
		throw new Error('withProperty() must be chained after toFindItem()')
	}

	const { foundItem } = chainState.previousState
	if (!foundItem) {
		// This can happen if the primary matcher failed. The framework handles the thrown error.
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

### Step 5: Type and Register in the Category

This is the most crucial step for wiring up chainable matchers.

**File: `src/matchers/database/index.ts`**
```typescript
import { createChainableFromVitest } from '../../chainable/chainable.js'
import type { ChainableAssertion } from '../../chainable/types.js'
import type { FoundItem } from './types.js'
import { toFindItem } from './toFindItem.js'
import { withProperty } from './withProperty.js'

// 1. Create chainable versions of our matchers using the factory.
export const toFindItemChainable = createChainableFromVitest({
	name: 'toFindItem' as const,
	vitestMatcher: toFindItem,
})

export const withPropertyChainable = createChainableFromVitest({
	name: 'withProperty' as const,
	vitestMatcher: withProperty,
})

// 2. Group them into a registration object.
export const chainableDatabaseMatchers = {
	toFindItem: toFindItemChainable,
	withProperty: withPropertyChainable,
}

// 3. Define the TypeScript interfaces for the fluent chain.
// This is what the user will see on `expect(...)`.
export interface DatabaseMatchers {
	toFindItem(): Promise<DatabaseAssertion> & DatabaseAssertion
}

// This interface defines what can be chained *after* `toFindItem()`.
interface DatabaseAssertion {
	withProperty<K extends keyof FoundItem>(key: K, value: FoundItem[K]): ChainableAssertion
}
```

### Step 6: Register Globally

Update `src/index.ts` to register the new chain.

**File: `src/index.ts`**
```typescript
// ... other imports from previous example
import {
	type DatabaseMatchers,
	chainableDatabaseMatchers,
} from './matchers/database/index.js'

// ... expect.extend call

// Register the chainable matchers object
registerChainableMatchers(chainableDatabaseMatchers)
// ... other registerChainableMatchers calls

// Add the matcher's type to the vitest module declaration
declare module 'vitest' {
	interface Assertion<T = any> extends CollectionMatchers, DatabaseMatchers /*, etc */ {}
	interface AsymmetricMatchersContaining extends CollectionMatchers, DatabaseMatchers /*, etc */ {}
}
```

### Step 7: Write Tests

The test file for the primary matcher (`toFindItem.spec.ts`) should test the entire chain.

**File: `src/matchers/database/toFindItem.spec.ts`**
```typescript
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
			await expect(Promise.resolve(1)).toFindItem().withProperty('value', 100n)
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

### 4.1 Advanced: Handling Variable Arguments

If a secondary matcher accepts a variable number of arguments, you must use the `parseChainArgs` utility.

**Example**: A matcher `withProperties(...properties)` that takes multiple key-value pairs.
The implementation would look like this:

**File: `src/matchers/database/withProperties.ts`**
```typescript
import { parseChainArgs } from '../../chainable/chainable.js'
//... other imports

export const withProperties = (
	// @ts-expect-error - unused variable
	received: unknown,
	// Use a rest parameter for all arguments, including the chain state
	...argsAndChainState: readonly [string, any, ...Array<string | any>, ChainState<...>]
): MatcherResult => {
	const { args, chainState } = parseChainArgs(argsAndChainState)
	//...
}
```
You would use a typed tuple (`readonly [...]`) for `argsAndChainState` to ensure type-safety. See the codebase for real-world examples.