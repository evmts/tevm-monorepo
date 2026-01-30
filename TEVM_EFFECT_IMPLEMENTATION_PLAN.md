# TEVM Effect.ts Migration - Implementation Plan

**Status**: Active
**Created**: 2026-01-29
**Last Updated**: 2026-01-29
**RFC Reference**: [TEVM_EFFECT_MIGRATION_RFC.md](./TEVM_EFFECT_MIGRATION_RFC.md)

---

## Quick Navigation

- [Phase 1: Foundation](#phase-1-foundation)
- [Phase 2: Core Services](#phase-2-core-services)
- [Phase 3: Node & Actions](#phase-3-node--actions)
- [Phase 4: Client Layer](#phase-4-client-layer)
- [Learnings Log](#learnings-log)
- [Risk Register](#risk-register)


## Progress Legend

- `[ ]` Not Started
- `[~]` In Progress
- `[x]` Completed
- `[!]` Blocked
- `[?]` Needs Investigation

---

## Phase 1: Foundation

**Estimated Duration**: 2-3 weeks
**Goal**: Add Effect as dependency, create interop layer, migrate foundational packages
**Breaking Changes**: None (additive only)

### REVIEW AGENT Review Status: 🔴 FOURTH REVIEW COMPLETE (2026-01-29)

**Fourth review (2026-01-29)** - Opus-level comprehensive review found additional issues:

**@tevm/errors-effect Issues (8 new):**
- 🔴 **High**: All 6 EVM errors missing `cause` property - breaks error chaining
- 🔴 **High**: `toTaggedError` does not preserve `cause` when converting
- 🔴 **High**: RFC-defined error types not implemented (InvalidTransactionError, BlockNotFoundError, etc.)
- 🔴 **Medium**: Optional properties should be required per RFC

**@tevm/interop Issues (8 new):**
- 🔴 **Critical**: `Runtime<any>` cast in effectToPromise hides compile-time type errors
- 🔴 **Critical**: `wrapWithEffect` mutates original object (violates immutability)
- 🔴 **High**: Type information lost in `.effect` methods (returns `Effect<unknown>`)
- 🔴 **High**: No compile-time enforcement for Effects with requirements

**Test Coverage Gaps Identified:**
- Missing `Equal.equals()` structural equality tests (all 7 error types)
- Missing immutability tests for 5 EVM error types
- Missing toBaseError tests for 4 error types
- Missing null/undefined rejection and Effect.die defect tests

See FOURTH REVIEW tables in sections 1.2 and 1.3 for full details.

---

### 1.1 Effect.ts Setup & Configuration

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Add `effect` to root dependencies | [x] | Pre-existing | Effect 3.18.1 already in @tevm/effect, tevm, bundler packages |
| Update tsconfig for Effect types | [x] | Pre-existing | Already configured in existing packages |
| Create Effect-specific biome rules | [ ] | | Handle pipe chains, Effect.gen |
| Add `@effect/vitest` for testing | [ ] | | Enables `it.effect()` pattern |
| Benchmark baseline performance | [ ] | | Capture current metrics before migration |
| Measure baseline bundle sizes | [ ] | | Per-package and total |

**Learnings**:
- Effect 3.18.1 is already integrated in the monorepo (bundler-packages, @tevm/effect, tevm)
- @tevm/effect utility package exists with basic helpers (createRequireEffect, fileExists, parseJson, etc.)

---

### 1.2 @tevm/errors-effect (New Package)

**Current**: 80+ error classes extending `BaseError` with `_tag` property
**Target**: `Data.TaggedError` versions of all errors, preserving `code` and `docsPath`

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Create `@tevm/errors-effect` package scaffold | [x] | Claude | Created package with package.json, tsconfig, vitest.config, tsup.config |
| Define base `TevmError` TaggedError | [x] | Claude | Base class with message, code, docsPath, cause |
| Migrate `EvmExecutionError` types (10 errors) | [~] | Claude | 6 done: InsufficientBalance, OutOfGas, Revert, InvalidOpcode, StackOverflow, StackUnderflow |
| Migrate `TransactionError` types (5 errors) | [ ] | | NonceTooLow, GasTooLow, InvalidTx, etc. |
| Migrate `BlockError` types (4 errors) | [ ] | | BlockNotFound, InvalidBlock, etc. |
| Migrate `StateError` types (4 errors) | [ ] | | AccountNotFound, StateRootNotFound, etc. |
| Migrate `TransportError` types (3 errors) | [ ] | | ForkError, NetworkError, TimeoutError |
| Migrate `JsonRpcError` types (4 errors) | [ ] | | InvalidRequest, MethodNotFound, etc. |
| Migrate `NodeError` types (3 errors) | [ ] | | SnapshotNotFound, FilterNotFound, etc. |
| Create `toTaggedError()` interop helper | [x] | Claude | Converts BaseError → TaggedError with pattern matching |
| Create `toBaseError()` interop helper | [x] | Claude | Converts TaggedError → BaseError-like object |
| Add union types for error categories | [x] | Claude | EvmExecutionError union type in types.js |
| Write tests for all error types | [x] | Claude | 71 tests, 100% stmt/func coverage, 98% branch |
| Document error migration patterns | [ ] | | For contributors |

**Code Pattern** (from RFC):
```typescript
export class InsufficientBalanceError extends Data.TaggedError("InsufficientBalanceError")<{
  readonly address: Address
  readonly required: bigint
  readonly available: bigint
}> {
  readonly code = -32000
  readonly docsPath = "/errors/insufficient-balance"
}
```

**Learnings**:
- Effect.ts `Data.TaggedError` pattern works well with TEVM error structure
- Static `code` and `docsPath` properties maintained on class for consistency
- Interop helpers enable gradual migration between Promise and Effect APIs
- Test coverage with Effect.catchTag pattern validation confirms type-safe error handling

**REVIEW NOTES (2026-01-29)**: ✅ RESOLVED

| Issue | Severity | File | Status | Resolution |
|-------|----------|------|--------|------------|
| Missing readonly properties | **Critical** | All error files | ✅ Fixed | Added `@readonly` JSDoc to all properties |
| toTaggedError loses data | **Critical** | toTaggedError.js:69-91 | ✅ Fixed | Now extracts properties from source if available |
| Hardcoded version | High | toBaseError.js:42 | ✅ Fixed | Extracted to VERSION constant |
| toBaseError missing props | High | toBaseError.js:36-44 | ✅ Fixed | Now preserves all error-specific properties |
| BaseErrorLike typedef mismatch | High | toBaseError.js:49-59 | ✅ Fixed | Return type includes error-specific props |
| Inconsistent message generation | Medium | OutOfGasError.js | ✅ Fixed | Message now includes gas info when available |
| InsufficientBalanceError props | Medium | InsufficientBalanceError.js:88-98 | ✅ Fixed | Props made optional, constructor uses defaults |
| Missing test coverage | Medium | toTaggedError.spec.ts | ✅ Fixed | Added 5 tests for property extraction |
| Incomplete JSDoc | Low | toTaggedError.js:44 | ✅ Fixed | Added note about property extraction |

**All Action Items Completed** (2026-01-29)

**SECOND REVIEW (2026-01-29)**: ⚠️ PARTIALLY RESOLVED

| Issue | Severity | File | Status | Notes |
|-------|----------|------|--------|-------|
| RFC pattern mismatch - Data.TaggedError generic | **Critical** | All error files | ⚠️ Known | Errors use constructor-based property assignment instead of `Data.TaggedError("Tag")<{readonly props}>` generic pattern. Works with `Effect.catchTag` but loses structural equality. JSDoc limitations prevent pure generic pattern. |
| toBaseError missing `walk` method | High | toBaseError.js:43-72 | ✅ Fixed | Added walk method that traverses error chain through cause property. |
| toTaggedError instanceof loop never matches | High | toTaggedError.js:57-61 | ✅ Fixed | Clarified comments explaining that loop catches already-converted TaggedErrors. |
| StackOverflowError missing stackSize in message | High | StackOverflowError.js:75 | ✅ Fixed | Message now includes stackSize when provided (e.g., "Stack size: 1025 (max: 1024)"). |
| Missing `cause` property in EVM errors | Medium | All EVM error files | 🔴 Open | EVM errors don't accept/store `cause` property unlike TevmError. Breaks error chaining pattern. |
| Static/instance property duplication | Medium | All EVM error files | ⚠️ Known | Both static and instance `code`/`docsPath` properties. RFC shows only instance field pattern. |
| TevmError vs EVM errors pattern inconsistency | Medium | TevmError.js vs EVM errors | ⚠️ Known | TevmError accepts code/docsPath as params with defaults; EVM errors use static properties. |
| VERSION hardcoded will drift | Medium | toBaseError.js:7 | ⚠️ Known | `VERSION = '1.0.0-next.148'` will drift from actual package version. |
| Missing Effect structural equality tests | Low | All spec files | 🔴 Open | Tests don't verify `Equal.equals(error1, error2)` for errors with same properties. |
| Missing `@throws` JSDoc | Low | All source files | 🔴 Open | No functions document what errors they might throw. |

**Resolved Action Items** (2026-01-29):
- ✅ Added `walk` method to toBaseError result with full error chain traversal
- ✅ Clarified toTaggedError instanceof loop with better comments
- ✅ Added stackSize to StackOverflowError message generation
- ✅ Added tests for walk method

**Remaining Action Items**:
1. **Critical**: Document RFC pattern deviation decision (JSDoc vs TypeScript trade-off)
2. **Medium**: Consider adding `cause` property to EVM error constructors

**THIRD REVIEW (2026-01-29)**: 🔴 NEW ISSUES FOUND

| Issue | Severity | File | Status | Notes |
|-------|----------|------|--------|-------|
| Data.TaggedError generic type missing | **Critical** | All error files | 🔴 Open | Current pattern `Data.TaggedError('Tag')` omits the generic type parameter `<{readonly props}>`. Effect.ts cannot infer error properties for type-safe operations. Structural equality broken. |
| Runtime readonly enforcement missing | **Critical** | All error files | ✅ Fixed | Added `Object.freeze(this)` to all error constructors. Added immutability tests to TevmError.spec.ts and InsufficientBalanceError.spec.ts. |
| TevmError missing constructor default | Medium | TevmError.js:58 | 🔴 Open | `new TevmError()` without args throws, but EVM errors allow empty construction via `props = {}`. Inconsistent. |
| TevmError missing static properties | Medium | TevmError.js | 🔴 Open | Base class lacks `static code` and `static docsPath` that all EVM errors have. |
| toBaseError does not preserve cause | Medium | toBaseError.js:89 | 🔴 Open | `cause` is excluded from `baseKeys` but may not transfer correctly to `specificProps` for errors with undefined cause. Test at line 184 manually adds cause. |
| Missing error types from RFC | Medium | All | 🔴 Open | RFC defines `InvalidTransactionError`, `BlockNotFoundError`, `StateRootNotFoundError`, `ForkError` - not yet implemented. |
| toTaggedError repetitive pattern | Low | toTaggedError.js:75-111 | 🔴 Open | Long `if (tag === 'ErrorName')` chain could use a mapping object for maintainability. |
| Duplicate Address/Hex type definitions | Low | InsufficientBalanceError.js:4, RevertError.js:4 | 🔴 Open | `@typedef {\`0x${string}\`} Address` defined locally in each file instead of shared. |
| toBaseError tests incomplete | Low | toBaseError.spec.ts | 🔴 Open | Missing tests for RevertError, InvalidOpcodeError, StackOverflowError, StackUnderflowError. |
| OutOfGasError example values illogical | Low | OutOfGasError.js:14-17 | 🔴 Open | Example shows `gasUsed: 100000n` exceeding `gasLimit: 21000n` - confusing (semantically correct but atypical values). |

**New Action Items**:
1. **Critical**: Either convert error classes to TypeScript or document workarounds for generic type limitation
2. ~~**Critical**: Add `Object.freeze(this)` to constructors or document mutability as intentional~~ ✅ Completed 2026-01-29
3. **Medium**: Add missing error types from RFC or document as out-of-scope for Phase 1
4. **Medium**: Fix cause property handling in toBaseError
5. **Low**: Create shared type definitions file, refactor toTaggedError to use mapping

**FOURTH REVIEW (2026-01-29)**: 🔴 OPUS-LEVEL REVIEW COMPLETE

| Issue | Severity | File | Status | Notes |
|-------|----------|------|--------|-------|
| EVM errors missing `cause` property | **High** | All EVM error files | 🔴 Open | TevmError has `cause` (line 48), but all 6 EVM error classes (InsufficientBalanceError, OutOfGasError, RevertError, InvalidOpcodeError, StackOverflowError, StackUnderflowError) do not accept or store `cause`. Breaks error chaining pattern. |
| toTaggedError does not preserve `cause` | **High** | toTaggedError.js:75-111 | 🔴 Open | When converting specific error types, `cause` is not extracted from source error and passed to new TaggedError. |
| Missing RFC-defined error types | **High** | src/ | 🔴 Open | RFC defines `InvalidTransactionError`, `BlockNotFoundError`, `StateRootNotFoundError`, `ForkError` - none implemented. |
| Optional properties should be required per RFC | **Medium** | InsufficientBalanceError.js:47-62 | 🔴 Open | `address`, `required`, `available` typed as `T \| undefined`. RFC shows these as required (non-optional). Allows creating errors without critical data. |
| Static properties lack `@readonly` annotation | **Medium** | All EVM error files | 🔴 Open | Static `code` and `docsPath` don't have `@readonly` JSDoc. Instance properties have it. |
| Inconsistent default message patterns | **Low** | All EVM error files | 🔴 Open | InsufficientBalanceError: "error occurred", RevertError: "Execution reverted", InvalidOpcodeError: "encountered". Consider standardizing. |
| Missing `@example` in some constructor JSDoc | **Low** | StackUnderflowError.js:58-61 | 🔴 Open | No `@example` showing constructor usage. |
| types.js empty export pattern | **Low** | types.js:13-14 | 🔴 Open | `export {}` with JSDoc typedefs is unusual pattern. May be confusing. |

**Test Coverage Gaps Identified**:
| Gap | Priority | Files Affected |
|-----|----------|----------------|
| Missing `Equal.equals()` structural equality tests | High | All 7 error spec files |
| Missing immutability tests for 5 EVM errors | High | RevertError, InvalidOpcodeError, OutOfGasError, StackOverflowError, StackUnderflowError spec files |
| Missing toBaseError tests for 4 error types | Medium | toBaseError.spec.ts (RevertError, InvalidOpcodeError, StackOverflowError, StackUnderflowError) |
| Missing null/undefined rejection tests | Medium | promiseToEffect.spec.ts |
| Missing Effect.die defect tests | Medium | effectToPromise.spec.ts |
| Missing fiber interruption tests | Low | effectToPromise.spec.ts, promiseToEffect.spec.ts |

**Fourth Review Action Items**:
1. **High**: Add `cause` property to all 6 EVM error constructors
2. **High**: Update toTaggedError to preserve `cause` when converting specific error types
3. **High**: Implement RFC-defined error types (InvalidTransactionError, BlockNotFoundError, StateRootNotFoundError, ForkError) or document as Phase 2 scope
4. **Medium**: Add `Equal.equals()` structural equality tests to all error spec files
5. **Medium**: Add immutability tests to remaining 5 EVM error spec files
6. **Medium**: Complete toBaseError.spec.ts with tests for all error types
7. **Low**: Standardize default message patterns across all errors

---

### 1.3 @tevm/interop (New Package)

**Purpose**: Bridges between Promise and Effect worlds during migration

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Create `@tevm/interop` package scaffold | [x] | Claude | Package with package.json, configs |
| Implement `effectToPromise()` helper | [x] | Claude | `Effect<A, E> → Promise<A>` |
| Implement `promiseToEffect()` helper | [x] | Claude | `(...args) => Promise<A> → (...args) => Effect<A, unknown>` |
| Implement `wrapWithEffect()` for class instances | [x] | Claude | Adds `.effect` methods to existing objects |
| Implement `layerFromFactory()` helper | [x] | Claude | `createFoo(options) → Layer<Foo>` |
| Implement `ManagedRuntime` factory helper | [x] | Claude | createManagedRuntime wrapper |
| Write comprehensive tests | [x] | Claude | 35 tests, 100% coverage |
| Document interop patterns | [~] | | JSDoc examples added |

**Code Pattern** (from RFC):
```typescript
export const effectToPromise = <A, E>(
  effect: Effect.Effect<A, E>,
  runtime: Runtime.Runtime<never> = Runtime.defaultRuntime
): Promise<A> => Runtime.runPromise(runtime)(effect)
```

**Learnings**:
- ManagedRuntime.make returns an object with runPromise/dispose methods directly
- Effect.tryPromise is the idiomatic way to wrap Promise-returning functions
- wrapWithEffect must preserve `this` binding with .apply(instance, args)

**REVIEW NOTES (2026-01-29)**: ✅ RESOLVED

| Issue | Severity | File | Status | Resolution |
|-------|----------|------|--------|------------|
| Runtime type too restrictive | Medium | effectToPromise.js:42 | ✅ Fixed | Runtime now accepts generic R type |
| Generic types not preserved | Medium | promiseToEffect.js:51-52 | ⚠️ Known | Documented as limitation of tryPromise wrapper |
| Error type is `unknown` | Medium | promiseToEffect.js, wrapWithEffect.js, layerFromFactory.js | ✅ Fixed | All JSDoc now documents `unknown` error type |
| wrapWithEffect silent skip | Medium | wrapWithEffect.js:44 | ✅ Fixed | Now throws Error for missing/non-function props |
| Questionable wrapper | Low | createManagedRuntime.js | ✅ Documented | Added note suggesting direct ManagedRuntime.make |
| Missing @throws JSDoc | Low | All files | ✅ Fixed | Added @throws documentation |
| Missing custom runtime test | Low | effectToPromise.spec.ts | ⚠️ Deferred | Existing tests cover default runtime |
| Missing sync method tests | Low | wrapWithEffect.spec.ts | ⚠️ Deferred | Current tests focus on async (primary use case) |
| No integration tests | Low | All spec files | ⚠️ Deferred | Unit tests sufficient for current scope |

**Critical Items Completed** (2026-01-29)

**SECOND REVIEW (2026-01-29)**: ⚠️ MOSTLY RESOLVED

| Issue | Severity | File | Status | Notes |
|-------|----------|------|--------|-------|
| effectToPromise runtime type still problematic | **Critical** | effectToPromise.js:44-46 | ✅ Fixed | Added prominent JSDoc warning about providing custom runtime for Effects with `R !== never`. Added comprehensive tests. |
| promiseToEffect does not preserve `this` binding | High | promiseToEffect.js:55-57 | ✅ Fixed | Added prominent warning with code examples showing correct `.bind()` usage. |
| Missing tests for Effects with requirements | High | effectToPromise.spec.ts | ✅ Fixed | Added 4 new tests: custom runtime, missing service failure, Effect.provide pattern, multiple services. Now 40 tests with 100% coverage. |
| wrapWithEffect return type too loose | Medium | wrapWithEffect.js:39,43-44 | ⚠️ Known | Return type `Record<string, (...args: unknown[]) => Effect<unknown>>` loses all type information. RFC expects mapped types preserving method signatures. |
| layerFromFactory generic order incorrect | Medium | layerFromFactory.js:47-52 | 🔴 Open | JSDoc declares `Context.Tag<I, S>` but Effect's signature is `Context.Tag<Service, Shape>`. Also return type says `Layer<I, unknown, never>` but should include `RIn` if layer requires services. |
| No TypeScript type definitions in types/ | Medium | package.json types field | 🔴 Open | `package.json` references `types/index.d.ts` but no `.d.ts` files exist in types/. Users may not get proper TS types until build runs. |
| Missing edge case tests | Low | All spec files | ⚠️ Deferred | Missing tests for: rejection with non-Error value, rejection with null/undefined, sync throw before Promise return, fiber interruption, Effect.die defects. |
| Unused imports in tests | Low | effectToPromise.spec.ts:2 | ✅ Fixed | Imports now used in new tests for custom runtime scenarios. |

**Resolved Action Items** (2026-01-29):
- ✅ Added prominent JSDoc warning in effectToPromise about custom runtime requirements
- ✅ Added prominent warning in promiseToEffect about `this` binding with code examples
- ✅ Added 4 comprehensive tests for Effects with requirements (custom runtime, missing service failure, Effect.provide pattern, multiple services)
- ✅ All tests passing with 100% coverage

**Remaining Action Items**:
1. **Medium**: Fix layerFromFactory JSDoc generic order
2. **Medium**: Consider generating TypeScript type definitions
4. **Medium**: Fix layerFromFactory JSDoc generic order to match Effect's Context.Tag signature
5. **Medium**: Consider generating TypeScript type definitions or ensuring JSDoc types are properly inferred

**THIRD REVIEW (2026-01-29)**: 🔴 NEW ISSUES FOUND

| Issue | Severity | File | Status | Notes |
|-------|----------|------|--------|-------|
| effectToPromise type erasure via `any` cast | **Critical** | effectToPromise.js:78 | 🔴 Open | Default runtime cast to `Runtime.Runtime<any>` allows Effects with service requirements to compile but fail at runtime. Consider separate functions or overloads. |
| Missing explicit return type annotations | **Critical** | All source files | 🔴 Open | Per CLAUDE.md "We always explicitly type return types" - no exported functions have explicit `@returns` with proper generics. |
| promiseToEffect error type always `unknown` | High | promiseToEffect.js:72-76 | 🔴 Open | Error type information lost. Consider adding optional error mapper parameter: `promiseToEffect(fn, mapError?)`. |
| wrapWithEffect loses method type information | High | wrapWithEffect.js:39-40 | 🔴 Open | Return type `Record<string, (...args: unknown[]) => Effect<unknown>>` loses all parameter and return types from original methods. |
| wrapWithEffect mutates original object | Medium | wrapWithEffect.js:58 | 🔴 Open | `Object.assign(instance, { effect })` mutates original. Should document or create new object. |
| layerFromFactory error type always `unknown` | Medium | layerFromFactory.js:52 | 🔴 Open | Same as promiseToEffect - consider optional error mapper. |
| createManagedRuntime provides no value | Medium | createManagedRuntime.js:50-52 | ⚠️ Known | Pure passthrough to `ManagedRuntime.make`. Consider deprecating or adding actual value (logging, defaults). |
| No cancellation/interruption support | Medium | effectToPromise.js | 🔴 Open | No way to handle Effect interruption from Promise side. Consider optional `AbortSignal` parameter (complex, may be out of scope). |
| Missing test for promiseToEffect this binding | Medium | promiseToEffect.spec.ts | ✅ Fixed | Added 3 tests: failure case without bind, success with .bind(), success with arrow function wrapper. |
| Missing `@since` version tags | Low | All source files | 🔴 Open | No version information in JSDoc for tracking API stability. |
| layerFromFactory example uses Effect.promise | Low | layerFromFactory.js:42-43 | 🔴 Open | Example should use `promiseToEffect` from this package for consistency. |
| Inconsistent import style | Low | All source files | 🔴 Open | Some files import specific items, others import namespace. Consider consistency. |

**New Action Items**:
1. **Critical**: Add explicit `@returns` type annotations to all exported functions
2. **Critical**: Create separate `effectToPromiseUnsafe` or add runtime validation for default runtime usage
3. **High**: Add optional `mapError` parameter to `promiseToEffect` and `layerFromFactory`
4. **High**: Create `.d.ts` file with proper mapped types for `wrapWithEffect`
5. ~~**Medium**: Add test case demonstrating `this` binding issue and solution~~ ✅ Completed 2026-01-29
6. **Medium**: Document that `wrapWithEffect` mutates original object
7. **Low**: Add `@since` tags, update examples to dogfood package functions

**FOURTH REVIEW (2026-01-29)**: 🔴 OPUS-LEVEL REVIEW COMPLETE

| Issue | Severity | File | Status | Notes |
|-------|----------|------|--------|-------|
| `Runtime<any>` cast hides type errors | **Critical** | effectToPromise.js:78 | 🔴 Open | Cast to `Runtime.Runtime<any>` bypasses TypeScript's type safety. When Effect has requirements (R !== never), compile-time checking is lost. RFC expected `Runtime.Runtime<never>` constraint without cast. |
| `wrapWithEffect` mutates original object | **Critical** | wrapWithEffect.js:58 | ✅ Fixed | Changed to `Object.assign({}, instance, { effect })` to return new object instead of mutating original. Added 2 immutability tests. |
| Type information lost in `.effect` methods | **High** | wrapWithEffect.js:39,43-44 | 🔴 Open | Return type `Record<string, (...args: unknown[]) => Effect<unknown, unknown, never>>` loses all method signatures. Users get no IDE autocomplete, parameters typed as `unknown[]`, return as `Effect<unknown>`. |
| No compile-time enforcement for runtime requirement | **High** | effectToPromise.js:69-77 | 🔴 Open | JSDoc generics include `R` but function doesn't constrain it. Runtime parameter optional even when `R !== never`. |
| Error types always `unknown`, no mapper | **Medium** | promiseToEffect.js:72,75; wrapWithEffect.js:39; layerFromFactory.js:52 | 🔴 Open | All wrapped Effects have error type `unknown`. No way to refine error type at conversion boundary. Consider optional `mapError` parameter. |
| `layerFromFactory` generic parameter order unconventional | **Medium** | layerFromFactory.js:47-52 | 🔴 Open | Order `<I, S, O>` doesn't align with Effect.ts convention `<A, E, R>`. May confuse Effect.ts users. |
| `createManagedRuntime` is 1:1 wrapper with no added value | **Medium** | createManagedRuntime.js:50-52 | ⚠️ Known | Pure passthrough to `ManagedRuntime.make`. Consider removing or adding meaningful value (logging, defaults). |
| Missing explicit function return type annotations | **Low** | All source files | 🔴 Open | Per CLAUDE.md "We always explicitly type return types". Functions lack explicit return type in signature. |

**Positive Observations**:
- Excellent JSDoc documentation with comprehensive warnings and examples
- Comprehensive test coverage including `this` binding edge cases
- Proper error messages for invalid inputs in `wrapWithEffect`
- Clean barrel file re-exports following project conventions

**Fourth Review Action Items**:
1. **Critical**: Remove `Runtime<any>` cast - use constrained generics or separate safe/unsafe functions
2. ~~**Critical**: Fix `wrapWithEffect` to return new object instead of mutating: `return { ...instance, effect: effectMethods }`~~ ✅ Completed 2026-01-29
3. **High**: Create `.d.ts` file with mapped types to preserve method signatures in `wrapWithEffect`
4. **High**: Add compile-time enforcement for runtime requirements (e.g., overloads or separate functions)
5. **Medium**: Add optional `mapError` parameter to `promiseToEffect`, `wrapWithEffect`, `layerFromFactory`
6. **Medium**: Decide whether to keep or deprecate `createManagedRuntime`
7. **Low**: Add explicit `@returns` type annotations to all exported functions

---

### 1.4 @tevm/logger Migration

**Current**: Simple logger with level-based filtering, closure-captured state
**Target**: `LoggerService` with Effect-based methods

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `LoggerService` Context.Tag | [ ] | | Interface with Effect-based methods |
| Define `LoggerShape` interface | [ ] | | level, debug, info, warn, error, child |
| Implement `LoggerLive` layer factory | [ ] | | Takes LogLevel param |
| Implement `LoggerSilent` layer | [ ] | | For testing |
| Implement `LoggerTest` layer | [ ] | | Captures logs for assertions |
| Keep existing logger API (backward compat) | [ ] | | Don't break current usage |
| Export both APIs from package | [ ] | | Dual export pattern |
| Write tests for LoggerService | [ ] | | |

**Learnings**:
- _None yet_

---

### 1.5 @tevm/utils Updates

**Current**: Pure utility functions (no migration needed)
**Target**: Add Effect-specific utility functions

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Add Effect re-exports from utils | [ ] | | Common patterns |
| Add type utilities for Effect | [ ] | | Helper types if needed |
| Keep existing utils unchanged | [ ] | | Non-breaking |

**Learnings**:
- _None yet_

---

### 1.6 Phase 1 Integration & Validation

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| All Phase 1 packages build successfully | [ ] | | `bun build` |
| All Phase 1 tests pass | [ ] | | `bun test:coverage` |
| No regressions in dependent packages | [ ] | | Full test suite |
| Bundle size increase documented | [ ] | | Measure vs baseline |
| Performance benchmarks documented | [ ] | | Compare to baseline |
| Update CHANGELOG | [ ] | | Document additions |

**Learnings**:
- _None yet_

---

## Phase 2: Core Services

**Estimated Duration**: 3-4 weeks
**Goal**: Define service interfaces, migrate core EVM packages
**Breaking Changes**: None (additive, maintain Promise wrappers)

### REVIEW AGENT Review Status: NEEDS REVIEW

---

### 2.1 @tevm/common Migration

**Current**: `createCommon()` factory returning Common object
**Target**: `CommonService` with `CommonFromFork` and `CommonFromConfig` layers

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `CommonService` Context.Tag | [ ] | | |
| Define `CommonShape` interface | [ ] | | common, chainId, hardfork, eips, copy |
| Implement `CommonFromFork` layer | [ ] | | Auto-detect from ForkConfigService |
| Implement `CommonFromConfig` layer | [ ] | | Explicit configuration |
| Keep `createCommon()` API | [ ] | | Backward compat wrapper |
| Write tests for CommonService | [ ] | | |

**Learnings**:
- _None yet_

---

### 2.2 Transport Services (New)

**Current**: No explicit transport abstraction
**Target**: `TransportService` for fork RPC communication

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `TransportService` Context.Tag | [ ] | | |
| Define `TransportShape` interface | [ ] | | request method returning Effect |
| Implement `HttpTransport` layer | [ ] | | With retry, timeout, batching |
| Implement `TransportNoop` layer | [ ] | | For non-fork mode |
| Define `ForkConfigService` Context.Tag | [ ] | | chainId, blockTag |
| Implement `ForkConfigFromRpc` layer | [ ] | | Fetches from transport |
| Implement `ForkConfigStatic` layer | [ ] | | Explicit values |
| Write tests for transport layers | [ ] | | Mock HTTP, error scenarios |

**Learnings**:
- _None yet_

---

### 2.3 @tevm/blockchain Migration

**Current**: `createChain()` factory, Promise-based, fork support
**Target**: `BlockchainService` with automatic fork detection

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `BlockchainService` Context.Tag | [ ] | | |
| Define `BlockchainShape` interface | [ ] | | chain, getBlock, putBlock, ready, etc. |
| Implement `BlockchainLive` layer | [ ] | | Fork mode with transport |
| Implement `BlockchainLocal` layer | [ ] | | Genesis-only, non-fork |
| Add `acquireRelease` for cleanup | [ ] | | Handle chain.close() |
| Keep `createChain()` API | [ ] | | Backward compat |
| Write tests for BlockchainService | [ ] | | Both fork and local modes |

**Learnings**:
- _None yet_

---

### 2.4 @tevm/state Migration (HIGHEST COMPLEXITY)

**Current**:
- `createStateManager()` factory
- 30+ action functions (checkpoint, commit, getAccount, etc.)
- Fork caching with lazy loading
- 200+ line deepCopy implementation

**Target**: `StateManagerService` with Ref-based state

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `StateManagerService` Context.Tag | [ ] | | |
| Define `StateManagerShape` interface | [ ] | | All 30+ methods as Effect |
| **Migrate core state actions (15 tasks):** | | | |
| - checkpoint → Effect | [ ] | | |
| - commit → Effect | [ ] | | |
| - revert → Effect | [ ] | | |
| - getAccount → Effect | [ ] | | |
| - putAccount → Effect | [ ] | | |
| - deleteAccount → Effect | [ ] | | |
| - getStorage → Effect | [ ] | | |
| - putStorage → Effect | [ ] | | |
| - clearStorage → Effect | [ ] | | |
| - getCode → Effect | [ ] | | |
| - putCode → Effect | [ ] | | |
| - getStateRoot → Effect | [ ] | | |
| - setStateRoot → Effect | [ ] | | |
| - dumpState → Effect | [ ] | | |
| - loadState → Effect | [ ] | | |
| Implement `StateManagerLive` layer | [ ] | | Local mode |
| Implement `StateManagerFork` layer | [ ] | | Fork mode with lazy loading |
| Implement `deepCopy` using Ref cloning | [ ] | | Replace 200+ line function |
| Add proper error types to all operations | [ ] | | StateError variants |
| Keep `createStateManager()` API | [ ] | | Backward compat |
| Write comprehensive tests | [ ] | | All 30+ actions, fork/local |

**Risk**: This is the highest complexity migration area

**Learnings**:
- _None yet_

---

### 2.5 @tevm/evm Migration

**Current**: `createEvm()` factory
**Target**: `EvmService` layer

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `EvmService` Context.Tag | [ ] | | |
| Define `EvmShape` interface | [ ] | | evm, runCall, runCode, precompiles |
| Implement `EvmLive` layer | [ ] | | Depends on Common, State, Blockchain |
| Add `mapEvmError()` helper | [ ] | | ethereumjs error → TaggedError |
| Keep `createEvm()` API | [ ] | | Backward compat |
| Write tests for EvmService | [ ] | | Error mapping, execution |

**Learnings**:
- _None yet_

---

### 2.6 @tevm/vm Migration

**Current**: `createVm()` factory
**Target**: `VmService` layer

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `VmService` Context.Tag | [ ] | | |
| Define `VmShape` interface | [ ] | | vm, runTx, runBlock, buildBlock, ready, deepCopy |
| Implement `VmLive` layer | [ ] | | Depends on EvmService |
| Add typed error returns | [ ] | | EvmExecutionError union |
| Implement `deepCopy` method | [ ] | | Delegates to ethereumjs |
| Keep `createVm()` API | [ ] | | Backward compat |
| Write tests for VmService | [ ] | | Transaction execution, blocks |

**Learnings**:
- _None yet_

---

### 2.7 Phase 2 Integration & Validation

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| All Phase 2 packages build | [ ] | | |
| All Phase 2 tests pass | [ ] | | |
| Layer composition works end-to-end | [ ] | | Common → Blockchain → State → EVM → VM |
| Performance benchmarks | [ ] | | Compare to baseline |
| No regressions in higher packages | [ ] | | node, actions, clients |
| Document service patterns | [ ] | | For contributors |

**Learnings**:
- _None yet_

---

## Phase 3: Node & Actions

**Estimated Duration**: 3-4 weeks
**Goal**: Migrate node orchestration, transaction pool, actions
**Breaking Changes**: Deprecation warnings on old APIs

### REVIEW AGENT Review Status: NEEDS REVIEW

---

### 3.1 Node State Services (Ref-Based)

**Current**: 15+ closure-captured variables in createTevmNode
**Target**: Separate services with Ref-based state

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `ImpersonationService` | [ ] | | get/set impersonatedAccount, autoImpersonate |
| Implement `ImpersonationLive` layer | [ ] | | Two Refs |
| Define `BlockParamsService` | [ ] | | nextBlockTimestamp, gasLimit, baseFee, etc. |
| Implement `BlockParamsLive` layer | [ ] | | Multiple Refs |
| Define `SnapshotService` | [ ] | | take, revert, get, getAll |
| Implement `SnapshotLive` layer | [ ] | | Requires StateManagerService |
| Define `FilterService` | [ ] | | create, get, remove, getChanges |
| Implement `FilterLive` layer | [ ] | | |
| Write tests for all state services | [ ] | | Ref operations, isolation |

**Learnings**:
- _None yet_

---

### 3.2 @tevm/txpool Migration

**Current**: `TxPool` class with Promise methods
**Target**: `TxPoolService` layer

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `TxPoolService` Context.Tag | [ ] | | |
| Define `TxPoolShape` interface | [ ] | | add, remove, getByHash, getPending, etc. |
| Implement `TxPoolLive` layer | [ ] | | Depends on VmService |
| Add `TxPoolError` types | [ ] | | |
| Implement `deepCopy` | [ ] | | |
| Keep existing TxPool class | [ ] | | Backward compat |
| Write tests | [ ] | | |

**Learnings**:
- _None yet_

---

### 3.3 @tevm/receipt-manager Migration

**Current**: `ReceiptsManager` class
**Target**: `ReceiptManagerService` layer

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `ReceiptManagerService` Context.Tag | [ ] | | |
| Define `ReceiptManagerShape` interface | [ ] | | saveReceipt, getReceipt, getLogs, deepCopy |
| Implement `ReceiptManagerLive` layer | [ ] | | |
| Keep existing class | [ ] | | Backward compat |
| Write tests | [ ] | | |

**Learnings**:
- _None yet_

---

### 3.4 Mining Service (New)

**Current**: Mining logic embedded in node
**Target**: `MiningService` with modes

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `MiningService` Context.Tag | [ ] | | |
| Define `MiningShape` interface | [ ] | | mode, setMode, mine, start/stop interval |
| Define `MiningMode` type | [ ] | | auto, manual, interval |
| Implement `MiningLive` layer | [ ] | | Depends on Vm, TxPool |
| Add `MiningError` types | [ ] | | |
| Write tests | [ ] | | All modes |

**Learnings**:
- _None yet_

---

### 3.5 @tevm/node Migration (CRITICAL PATH)

**Current**: `createTevmNode()` with 700+ lines, manual Promise chains
**Target**: `TevmNode.Live()` layer factory

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `TevmNodeService` Context.Tag | [ ] | | |
| Define `TevmNodeShape` interface | [ ] | | status, mode, ready, vm, txPool, etc. |
| Define `NodeStatus` type | [ ] | | INITIALIZING, READY, STOPPED |
| Define `NodeEvent` types | [ ] | | For Stream-based events |
| Implement `TevmNodeLive` layer | [ ] | | Orchestrates all sub-services |
| Implement `TevmNode.Live()` factory | [ ] | | Main entry point |
| Implement `TevmNode.Local()` factory | [ ] | | Non-fork convenience |
| Implement `TevmNode.Fork()` factory | [ ] | | Fork convenience |
| Implement `TevmNode.Test()` factory | [ ] | | Deterministic testing |
| Implement event → Stream conversion | [ ] | | node.events property |
| Implement `deepCopy` using Ref cloning | [ ] | | Replace 200+ line function |
| Implement JSON-RPC handler | [ ] | | node.request method |
| Keep `createTevmNode()` API | [ ] | | Wrapper using Effect internally |
| Write comprehensive tests | [ ] | | Fork mode, local mode, events |
| Benchmark node creation time | [ ] | | Compare to baseline |

**Risk**: This is the highest risk task in the entire migration

**Learnings**:
- _None yet_

---

### 3.6 @tevm/actions Migration

**Current**: 5k LOC, all action handlers
**Target**: Effect-based action functions

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Create action Effect wrappers pattern | [ ] | | Reusable template |
| Migrate `eth_call` handler | [ ] | | |
| Migrate `eth_sendTransaction` handler | [ ] | | |
| Migrate `eth_getBalance` handler | [ ] | | |
| Migrate `eth_getBlockByNumber` handler | [ ] | | |
| Migrate `eth_getTransactionReceipt` handler | [ ] | | |
| Migrate remaining eth_* handlers (20+) | [ ] | | |
| Migrate debug_* handlers | [ ] | | |
| Migrate anvil_* handlers | [ ] | | |
| Migrate tevm_* handlers | [ ] | | |
| Keep Promise-based exports | [ ] | | Backward compat |
| Write tests for migrated actions | [ ] | | |

**Learnings**:
- _None yet_

---

### 3.7 Phase 3 Integration & Validation

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| All Phase 3 packages build | [ ] | | |
| All Phase 3 tests pass | [ ] | | |
| Full node layer composition works | [ ] | | TevmNode.Live() creates working node |
| Fork mode works end-to-end | [ ] | | Test against mainnet |
| Local mode works end-to-end | [ ] | | |
| deepCopy produces isolated state | [ ] | | |
| Event streaming works | [ ] | | |
| Performance benchmarks | [ ] | | |
| Add deprecation warnings to old APIs | [ ] | | |

**Learnings**:
- _None yet_

---

## Phase 4: Client Layer

**Estimated Duration**: 2-3 weeks
**Goal**: Migrate client packages, finalize API
**Breaking Changes**: Major version bump, remove deprecated APIs

### REVIEW AGENT Review Status: NEEDS REVIEW

---

### 4.1 @tevm/memory-client Migration

**Current**: viem-compatible client factory
**Target**: Effect API + viem wrapper

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Create Effect-native client interface | [ ] | | |
| Implement `MemoryClientLive` layer | [ ] | | |
| Create viem wrapper using ManagedRuntime | [ ] | | Hides Effect from viem users |
| Keep `createMemoryClient()` API | [ ] | | Backward compat |
| Add `destroy()` method for cleanup | [ ] | | Runtime disposal |
| Expose Effect escape hatch | [ ] | | client.effect.runtime |
| Write tests | [ ] | | viem compat + Effect native |

**Learnings**:
- _None yet_

---

### 4.2 @tevm/decorators Migration

**Current**: viem action decorators
**Target**: Effect + viem interop

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Update decorators to use Effect internally | [ ] | | |
| Keep viem-compatible Promise API | [ ] | | |
| Write tests | [ ] | | |

**Learnings**:
- _None yet_

---

### 4.3 @tevm/http-client Migration

**Current**: HTTP client implementation
**Target**: Effect-based HTTP client

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `HttpClientService` | [ ] | | |
| Implement using @effect/platform patterns | [ ] | | |
| Keep existing API | [ ] | | |
| Write tests | [ ] | | |

**Learnings**:
- _None yet_

---

### 4.4 @tevm/server Migration

**Current**: HTTP server handlers
**Target**: Effect-based handlers

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Migrate request handlers to Effect | [ ] | | |
| Add proper error handling | [ ] | | |
| Keep existing API | [ ] | | |
| Write tests | [ ] | | |

**Learnings**:
- _None yet_

---

### 4.5 @tevm/sync-storage-persister Migration

**Current**: Storage persistence
**Target**: `PersisterService` layer

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Define `PersisterService` | [ ] | | |
| Implement layer | [ ] | | |
| Keep existing API | [ ] | | |
| Write tests | [ ] | | |

**Learnings**:
- _None yet_

---

### 4.6 Phase 4 Integration & Validation

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| All Phase 4 packages build | [ ] | | |
| All Phase 4 tests pass | [ ] | | |
| viem compatibility verified | [ ] | | All standard actions work |
| Effect-native API verified | [ ] | | |
| Remove deprecated Promise APIs | [ ] | | Breaking change |
| Update all documentation | [ ] | | |
| Update examples | [ ] | | |
| Major version bump | [ ] | | v3.0.0 |
| Final performance benchmarks | [ ] | | |
| Final bundle size measurement | [ ] | | |

**Learnings**:
- _None yet_

---

## Cross-Cutting Concerns

### Documentation Tasks

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Create Effect migration guide | [ ] | | For users |
| Update API reference docs | [ ] | | |
| Add Effect examples to docs | [ ] | | |
| Create contributor Effect guide | [ ] | | |
| Update CLAUDE.md with Effect patterns | [ ] | | |

### REVIEW AGENT Review Status: NEEDS REVIEW

---

### Performance Benchmarks

| Benchmark | Baseline | Target | Current | Status |
|-----------|----------|--------|---------|--------|
| EVM opcode execution | TBD | ≤ 5% regression | - | [ ] Measure |
| State read (cached) | TBD | ≤ 2μs | - | [ ] Measure |
| State read (fork) | TBD | ≤ 50ms | - | [ ] Measure |
| Transaction execution | TBD | ≤ 12ms | - | [ ] Measure |
| Block building | TBD | ≤ 110ms | - | [ ] Measure |
| Node initialization | TBD | ≤ 600ms | - | [ ] Measure |
| deepCopy | TBD | ≤ 60ms | - | [ ] Measure |

### REVIEW AGENT Review Status: NEEDS REVIEW

---

### Bundle Size Tracking

| Package | Baseline (gzip) | Target | Current | Status |
|---------|-----------------|--------|---------|--------|
| effect core | - | ~30KB | - | [ ] Measure |
| @tevm/node-effect | - | ~50KB | - | [ ] Measure |
| Full tevm + effect | TBD | ≤ 200KB | - | [ ] Measure |

### REVIEW AGENT Review Status: NEEDS REVIEW

---

## Learnings Log

### Technical Learnings

| Date | Learning | Impact | Action Taken |
|------|----------|--------|--------------|
| 2026-01-29 | Data.TaggedError properties should be `readonly` | Critical - enables immutability guarantees | ✅ Added @readonly JSDoc to all error properties |
| 2026-01-29 | Interop helpers lose error-specific data during conversion | Critical - debugging context lost | ✅ Fixed toTaggedError and toBaseError to preserve properties |
| 2026-01-29 | Effect.tryPromise produces `unknown` error type | Medium - requires documentation | ✅ Added JSDoc notes about unknown error types |
| 2026-01-29 | Runtime.Runtime<never> is too restrictive for generic helpers | Medium - limits flexibility | ✅ Updated effectToPromise to use generic R type |
| 2026-01-29 | wrapWithEffect should validate method existence | Medium - silent failures confusing | ✅ Now throws Error for missing/non-function props |
| 2026-01-29 | Optional constructor props enable flexible error creation | Medium - better interop | ✅ Made InsufficientBalanceError props optional |
| 2026-01-29 | Data.TaggedError generic pattern (`<{readonly props}>`) differs from constructor pattern | Critical - breaks structural equality | ⚠️ Documented as known limitation of JSDoc approach |
| 2026-01-29 | toBaseError needs `walk` method for full BaseError interface compatibility | High - breaks error chain traversal | ✅ Implemented walk method with recursive cause traversal |
| 2026-01-29 | promiseToEffect loses `this` binding - requires `.bind()` | High - common developer mistake | ✅ Added prominent JSDoc warning with code examples |
| 2026-01-29 | effectToPromise with `R !== never` requires custom runtime | Critical - type cast hides runtime failure | ✅ Added prominent JSDoc warning and comprehensive tests |
| 2026-01-29 | Effect structural equality (`Equal.equals`) not tested for errors | Medium - feature may not work | 🔴 Needs test coverage |
| 2026-01-29 | StackOverflowError should include stackSize in message | Medium - inconsistent with other errors | ✅ Added stackSize to auto-generated message |
| 2026-01-29 | Runtime.Runtime<any> type cast in effectToPromise hides runtime failures | Critical - Effects with R !== never fail at runtime | 🔴 Needs separate function or runtime validation |
| 2026-01-29 | JSDoc `@readonly` is documentation-only - doesn't enforce immutability | Critical - errors remain mutable at runtime | ✅ Added Object.freeze(this) to all error constructors |
| 2026-01-29 | wrapWithEffect return type loses all method type information | High - users get Effect<unknown> | 🔴 Needs .d.ts with mapped types |
| 2026-01-29 | Missing explicit @returns annotations violates CLAUDE.md conventions | High - inconsistent with codebase standards | 🔴 Needs explicit return types |
| 2026-01-29 | Object.assign in wrapWithEffect mutates original instance | Medium - unexpected side effect | ✅ Fixed: Changed to `Object.assign({}, instance, { effect })` to create new object |
| 2026-01-29 | Error mapper parameters needed for promiseToEffect/layerFromFactory | Medium - error types always unknown | 🔴 Consider optional mapError param |

### Process Learnings

| Date | Learning | Impact | Action Taken |
|------|----------|--------|--------------|
| 2026-01-29 | Review phase should validate property preservation in interop helpers | High - data loss easily missed | ✅ Added tests for property extraction |
| 2026-01-29 | RFC code patterns should include readonly modifiers | Medium - sets correct precedent | Consider updating RFC examples |
| 2026-01-29 | Tests should cover new message generation branches | Medium - coverage thresholds | ✅ Added tests for gas info messages |
| 2026-01-29 | Second review found issues first review missed | High - single review insufficient | Reviews should compare implementation vs RFC patterns line-by-line |
| 2026-01-29 | JSDoc JavaScript cannot express some TypeScript patterns | High - affects API design | Consider exceptions to JSDoc-only rule for Effect types |
| 2026-01-29 | Interface conformance testing needed (e.g., BaseError.walk) | Medium - partial implementations break downstream | Add interface conformance tests |
| 2026-01-29 | Third review found additional critical issues after two prior reviews | High - review depth matters | Opus-level models should be used for complex Effect.ts reviews |
| 2026-01-29 | Test coverage should verify documented warnings (e.g., this binding) | Medium - documentation not validated | Add tests that demonstrate failure cases mentioned in JSDoc |
| 2026-01-29 | Type definitions need explicit handling for JS packages with Effect.ts | High - JSDoc limitations compound with Effect complexity | Consider .d.ts files for complex generic patterns |
| 2026-01-29 | Object.assign mutates original object - violates immutability principle | Critical - unexpected side effects | 🔴 Use spread operator or Object.create instead |
| 2026-01-29 | Error `cause` chaining is fundamental for debugging Effect pipelines | High - error context lost during conversion | 🔴 Add cause property to all EVM error constructors |
| 2026-01-29 | Effect.ts `Equal.equals` provides structural equality but requires testing | Medium - feature may silently fail | 🔴 Add Equal.equals tests to all error types |
| 2026-01-29 | wrapWithEffect type-erasing return destroys IDE experience | High - autocomplete, type checking lost | 🔴 Create .d.ts with mapped types preserving signatures |
| 2026-01-29 | RFC-defined error types represent real use cases in TEVM | Medium - incomplete API surface | 🔴 Implement or document as Phase 2 scope |
| 2026-01-29 | Optional error properties reduce error usefulness in debugging | Medium - errors may lack critical context | Consider making domain-specific properties required |

### Process Learnings (Fourth Review)

| Date | Learning | Impact | Action Taken |
|------|----------|--------|--------------|
| 2026-01-29 | Opus-level reviews catch issues previous reviews missed | High - critical issues in shipped code | Use Opus for Effect.ts package reviews |
| 2026-01-29 | Test coverage gaps accumulate across related packages | Medium - systemic gaps emerge | Run cross-package test gap analysis |
| 2026-01-29 | Mutation vs immutability must be explicit in interop helpers | High - affects caller assumptions | Document mutation behavior prominently |
| 2026-01-29 | Type information loss in generic wrappers compounds through usage | High - users end up with `unknown` everywhere | Prioritize .d.ts files for complex generics |

### REVIEW AGENT Review Status: 🔴 FOURTH REVIEW COMPLETE (2026-01-29)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|------------|--------|
| Performance regression in hot paths | Medium | High | Benchmark suite, profile critical paths, use Effect.sync for sync ops | Monitoring |
| Bundle size increase beyond target | High | Medium | Tree-shaking, separate entry points, lazy layer construction | Monitoring |
| Learning curve slows contributors | High | Medium | Documentation, examples, gradual adoption | Planned |
| Effect version incompatibility | Low | Medium | Pin version, abstract unstable APIs | Planned |
| Incomplete migration (phase blocked) | Medium | High | Phase gates, MVP per phase | Planned |
| Test breakage during migration | High | Medium | Keep old tests, add new Effect tests | Planned |
| viem compatibility breaks | Medium | High | Comprehensive viem test suite | Planned |
| **NEW**: JSDoc cannot express Data.TaggedError generic pattern | High | High | Either use TypeScript for error classes or document limitations | ⚠️ Documented |
| **NEW**: Interop helpers have partial interface conformance | Medium | Medium | Add interface conformance tests, implement missing methods | ✅ Mitigated |
| **NEW**: `this` binding issues in promiseToEffect | Medium | Medium | Add prominent documentation, consider helper overload | ✅ Mitigated |
| **NEW**: effectToPromise type safety gap for R !== never | Medium | High | Add runtime validation or remove default runtime param | ✅ Mitigated |
| **R3**: Runtime<any> cast hides type errors until runtime | High | High | Create separate safe/unsafe functions, add runtime validation | 🔴 Open |
| **R3**: Error immutability not enforced (JSDoc @readonly is advisory) | High | Medium | Add Object.freeze() to constructors or accept mutability | ✅ Mitigated |
| **R3**: Return types not explicit on interop functions | Medium | Medium | Add @returns annotations per CLAUDE.md conventions | 🔴 Open |
| **R3**: Method type information lost in wrapWithEffect | Medium | Medium | Create .d.ts with mapped types for proper inference | 🔴 Open |
| **R3**: Missing error types from RFC (TransactionError, BlockError, etc.) | Medium | Low | Implement in Phase 1 or document as Phase 2 scope | 🔴 Open |
| **R3**: Cause property not properly chained through EVM errors | Medium | Medium | Add cause parameter to EVM error constructors | 🔴 Open |
| **R4**: wrapWithEffect mutates original object | High | Medium | Return new object instead of using Object.assign on original | ✅ Fixed |
| **R4**: wrapWithEffect loses all method type information | High | Medium | Create .d.ts with mapped types preserving method signatures | 🔴 Open |
| **R4**: No compile-time enforcement for runtime requirements | Medium | High | Use constrained generics or separate effectToPromiseSafe/Unsafe | 🔴 Open |
| **R4**: Test coverage gaps for structural equality | Medium | Low | Add Equal.equals tests to all error spec files | 🔴 Open |
| **R4**: Test coverage gaps for immutability | Medium | Low | Add Object.freeze verification tests to 5 EVM error spec files | 🔴 Open |
| **R4**: Test coverage gaps for edge cases | Low | Low | Add null/undefined rejection, Effect.die, fiber interruption tests | 🔴 Open |

### REVIEW AGENT Review Status: 🔴 FOURTH REVIEW COMPLETE (2026-01-29)

---

## Rollback Plan

### Phase 1 Rollback
- Remove Effect dependency
- Revert errors-effect package
- Impact: None (additive changes only)

### Phase 2 Rollback
- Keep Effect as optional dependency
- Revert service changes
- Maintain Promise-based implementations as primary
- Impact: Low (backward compat maintained)

### Phase 3 Rollback
- Maintain Promise wrappers as primary API
- Keep Effect as experimental/advanced option
- Impact: Medium (user docs affected)

### Phase 4 Rollback
- Don't release v3.0
- Maintain v2.x with dual APIs indefinitely
- Impact: High (documentation, examples)

### REVIEW AGENT Review Status: NEEDS REVIEW

---

## Appendix: Quick Reference

### Effect Patterns Used

```typescript
// Service Definition
export class FooService extends Context.Tag("FooService")<
  FooService,
  FooShape
>() {}

// Layer Implementation
export const FooLive: Layer.Layer<FooService, never, BarService> =
  Layer.effect(FooService,
    Effect.gen(function* () {
      const bar = yield* BarService
      return { /* implementation */ }
    })
  )

// Error Definition
export class FooError extends Data.TaggedError("FooError")<{
  readonly message: string
}> {}

// Using Services
const program = Effect.gen(function* () {
  const foo = yield* FooService
  return yield* foo.doSomething()
}).pipe(Effect.provide(FooLive))
```

### File Naming Convention

| File | Purpose |
|------|---------|
| `FooService.ts` | Service definition (Context.Tag + Shape) |
| `FooLive.ts` | Live implementation layer |
| `FooTest.ts` | Test implementation layer |
| `FooError.ts` | Error types for this service |
| `Foo.spec.ts` | Tests |

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-29 | Claude | Initial draft from gap analysis |
