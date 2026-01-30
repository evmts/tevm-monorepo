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

### REVIEW AGENT Review Status: IN PROGRESS (2026-01-29)

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

---

### 1.3 @tevm/interop (New Package)

**Purpose**: Bridges between Promise and Effect worlds during migration

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Create `@tevm/interop` package scaffold | [ ] | | |
| Implement `effectToPromise()` helper | [ ] | | `Effect<A, E> → Promise<A>` |
| Implement `promiseToEffect()` helper | [ ] | | `Promise<A> → Effect<A, unknown>` |
| Implement `wrapWithEffect()` for class instances | [ ] | | Adds `.effect` methods to existing objects |
| Implement `layerFromFactory()` helper | [ ] | | `createFoo(options) → Layer<Foo>` |
| Implement `ManagedRuntime` factory helper | [ ] | | Reusable runtime creation |
| Write comprehensive tests | [ ] | | All helpers with edge cases |
| Document interop patterns | [ ] | | Examples for each scenario |

**Code Pattern** (from RFC):
```typescript
export const effectToPromise = <A, E>(
  effect: Effect.Effect<A, E>,
  runtime: Runtime.Runtime<never> = Runtime.defaultRuntime
): Promise<A> => Runtime.runPromise(runtime)(effect)
```

**Learnings**:
- _None yet_

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
| _None yet_ | | | |

### Process Learnings

| Date | Learning | Impact | Action Taken |
|------|----------|--------|--------------|
| _None yet_ | | | |

### REVIEW AGENT Review Status: NEEDS REVIEW

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

### REVIEW AGENT Review Status: NEEDS REVIEW

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
