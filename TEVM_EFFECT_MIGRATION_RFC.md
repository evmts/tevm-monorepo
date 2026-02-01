# RFC: TEVM Effect.ts Migration

**Status**: Draft
**Authors**: Engineering Team
**Created**: 2026-01-28
**Target Completion**: TBD (phased rollout)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Motivation & Goals](#2-motivation--goals)
3. [Current Architecture Analysis](#3-current-architecture-analysis)
4. [Target Architecture](#4-target-architecture)
5. [Service Definitions](#5-service-definitions)
6. [Error Handling Strategy](#6-error-handling-strategy)
7. [Layer Composition](#7-layer-composition)
8. [Migration Strategy](#8-migration-strategy)
9. [Package Migration Order](#9-package-migration-order)
10. [Interoperability & Coexistence](#10-interoperability--coexistence)
11. [Testing Strategy](#11-testing-strategy)
12. [Performance Considerations](#12-performance-considerations)
13. [API Compatibility & Breaking Changes](#13-api-compatibility--breaking-changes)
14. [Risk Analysis](#14-risk-analysis)
15. [Success Metrics](#15-success-metrics)
16. [Open Questions](#16-open-questions)
17. [References](#17-references)

---

## 1. Executive Summary

This RFC proposes migrating TEVM's 28 packages (~30k lines of code) from the current Promise-based, closure-captured dependency pattern to Effect.ts's dependency injection system using `Context.Tag`, `Layer`, and `Effect`.

**Key Benefits:**
- Type-safe dependency injection with compile-time verification
- Explicit error channel with typed, recoverable errors
- Simplified testing through layer substitution
- Better resource management with Scope and acquireRelease
- Improved observability with built-in tracing/logging
- Tree-shakable, composable services

**Key Risks:**
- Large migration surface area
- Learning curve for contributors
- Potential bundle size increase
- Breaking changes to public API

**Recommended Approach:** Incremental, bottom-up migration over 4 phases with coexistence layer allowing old and new code to interoperate.

---

## 2. Motivation & Goals

### 2.1 Current Pain Points

| Pain Point | Description | Effect.ts Solution |
|------------|-------------|--------------------|
| **Promise chains** | 10+ promise chains in `createTevmNode` with manual dependency ordering | Automatic dependency resolution via Layers |
| **Closure state** | 15+ mutable variables captured in closures (impersonation, block params, snapshots) | `Ref` for managed mutable state |
| **Error handling** | Try/catch with manual error wrapping, errors not in type signature | Typed error channel, `Data.TaggedError` |
| **Testing** | Must mock entire modules or use DI hacks | Layer substitution (`Live` → `Test`) |
| **Resource cleanup** | Manual cleanup, no guarantees on interruption | `Scope`, `acquireRelease`, finalizers |
| **Observability** | Manual `logger.debug()` calls scattered throughout | Built-in `Effect.log`, tracing spans |
| **Deep copy** | 200+ line `deepCopy` function manually cloning state | Composable `Ref` copying |

### 2.2 Goals

1. **Type-safe DI**: All dependencies declared in type signature, verified at compile time
2. **Explicit errors**: All failure modes visible in types, pattern-matchable
3. **Testability**: Any service swappable without mocking internals
4. **Composability**: Services combine cleanly without manual wiring
5. **Backward compatibility**: Provide migration path, don't break existing users immediately
6. **Performance**: No regression in hot paths (EVM execution, state reads)
7. **Bundle size**: Minimize impact on tree-shaking

### 2.3 Non-Goals

- Rewriting business logic (EVM internals, RLP encoding, etc.)
- Changing external API surface unnecessarily
- Adding new features during migration
- Migrating test files (can use old patterns)

---

## 3. Current Architecture Analysis

### 3.1 Package Dependency Graph

```
                    ┌─────────────────────────────────┐
                    │       memory-client             │
                    │  (viem client + actions)        │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼─────┐   ┌──────▼──────┐   ┌─────▼─────┐
              │ decorators │   │   actions   │   │  server   │
              └─────┬─────┘   └──────┬──────┘   └─────┬─────┘
                    │                │                │
                    └────────────────┼────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │            node                 │
                    │  (TevmNode, state management)   │
                    └────────────────┬────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │           │               │               │           │
    ┌────▼────┐ ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐ ┌───▼───┐
    │   vm    │ │ txpool  │    │  receipt  │   │blockchain │ │ state │
    └────┬────┘ └────┬────┘    │  manager  │   └─────┬─────┘ └───┬───┘
         │           │         └───────────┘         │           │
         └───────────┴───────────────┬───────────────┴───────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │             evm                 │
                    │   (EVM execution engine)        │
                    └────────────────┬────────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────┐
    │        │         │             │            │         │         │
┌───▼───┐ ┌──▼──┐ ┌────▼────┐ ┌──────▼──────┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│ block │ │ tx  │ │ common  │ │ precompiles │ │ trie  │ │  rlp  │ │address│
└───────┘ └─────┘ └────┬────┘ └─────────────┘ └───────┘ └───────┘ └───────┘
                       │
              ┌────────┴────────┐
              │                 │
         ┌────▼────┐       ┌────▼────┐
         │ logger  │       │ errors  │
         └─────────┘       └─────────┘
                                │
                           ┌────▼────┐
                           │  utils  │  (re-exports, primitives)
                           └─────────┘
```

### 3.2 Package Categories

| Category | Packages | Migration Complexity |
|----------|----------|---------------------|
| **Foundation** | `errors`, `utils`, `logger`, `rlp` | Low - pure utilities |
| **Primitives** | `address`, `tx`, `block`, `trie`, `common` | Low - data types |
| **Core EVM** | `state`, `evm`, `blockchain`, `vm` | High - stateful |
| **Transaction** | `txpool`, `receipt-manager` | Medium - stateful |
| **Node** | `node`, `precompiles`, `predeploys` | High - orchestration |
| **Client** | `memory-client`, `http-client`, `decorators`, `server` | Medium - API surface |
| **Support** | `jsonrpc`, `contract`, `actions`, `sync-storage-persister` | Low-Medium |

### 3.3 Current Initialization Flow (createTevmNode)

```javascript
// Current: Manual promise chain with 10 async dependencies
const chainIdPromise = (async () => { ... })()
const blockTagPromise = (async () => { ... })()
const chainCommonPromise = chainIdPromise.then(chainId => createCommon(...))
const blockchainPromise = Promise.all([chainCommonPromise, blockTagPromise]).then(...)
const stateManagerPromise = blockchainPromise.then(blockchain => ...)
const evmPromise = Promise.all([chainCommonPromise, stateManagerPromise, blockchainPromise]).then(...)
const vmPromise = Promise.all([evmPromise, chainCommonPromise]).then(...)
const txPoolPromise = vmPromise.then(vm => new TxPool({ vm }))
const receiptManagerPromise = vmPromise.then(vm => new ReceiptsManager(...))
const readyPromise = (async () => { await all; return true })()

// Plus 15+ closure-captured mutable variables
let impersonatedAccount
let autoImpersonate = false
let tracesEnabled = false
let nextBlockTimestamp
// ... etc
```

### 3.4 Current Error Handling

```javascript
// Current: extends BaseError with _tag
export class InsufficientBalanceError extends BaseError {
  constructor(params) {
    super('Insufficient balance', params, 'InsufficientBalanceError', -32000)
  }
}

// Usage: try/catch or .catch()
try {
  await vm.runTx(tx)
} catch (e) {
  if (e._tag === 'InsufficientBalanceError') { ... }
}
```

---

## 4. Target Architecture

### 4.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER CODE                                   │
│                                                                          │
│   const program = Effect.gen(function* () {                             │
│     const node = yield* TevmNodeService                                 │
│     yield* node.ready                                                   │
│     const result = yield* node.call({ to: '0x...', data: '0x...' })    │
│     return result                                                       │
│   })                                                                     │
│                                                                          │
│   Effect.runPromise(program.pipe(                                       │
│     Effect.provide(TevmNode.Live({ fork: { url: '...' } }))            │
│   ))                                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                   │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │TevmNodeSvc  │  │ JsonRpcSvc  │  │  MiningSvc  │  │ SnapshotSvc │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                                    │                                     │
│  ┌─────────────┐  ┌─────────────┐  │  ┌─────────────┐  ┌─────────────┐  │
│  │    VmSvc    │  │  TxPoolSvc  │◄─┘  │ ReceiptSvc  │  │  FilterSvc  │  │
│  └──────┬──────┘  └──────┬──────┘     └──────┬──────┘  └─────────────┘  │
│         │                │                   │                          │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐                  │
│  │   EvmSvc    │  │ StateMgrSvc │  │ BlockchainSvc   │                  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘                  │
│         │                │                   │                          │
│         └────────────────┴───────────────────┘                          │
│                          │                                              │
│  ┌───────────────────────▼───────────────────────────────────────────┐  │
│  │                      CommonService                                 │  │
│  │  (chain config, hardforks, EIPs, crypto implementations)          │  │
│  └───────────────────────┬───────────────────────────────────────────┘  │
│                          │                                              │
│  ┌───────────────────────▼───────────────────────────────────────────┐  │
│  │                    TransportService                                │  │
│  │  (optional: fork RPC, HTTP/WS transport)                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          LAYER COMPOSITION                               │
│                                                                          │
│   TevmNode.Live(options) = Layer.mergeAll(                              │
│     CommonLive,                                                          │
│     TransportLive,      // or TransportNoop if no fork                  │
│     BlockchainLive,                                                      │
│     StateManagerLive,                                                    │
│     EvmLive,                                                             │
│     VmLive,                                                              │
│     TxPoolLive,                                                          │
│     ReceiptManagerLive,                                                  │
│     NodeStateLive,      // Ref-based mutable state                      │
│     JsonRpcLive,                                                         │
│     MiningLive,                                                          │
│   )                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **One service per concern** | Enables granular testing and substitution |
| **Services hold no state** | State in `Ref`, services are pure behavior |
| **Layers build dependency graph** | Effect resolves initialization order |
| **Errors are TaggedError** | Type-safe, pattern-matchable, yieldable |
| **Resources use Scope** | Automatic cleanup on interruption |
| **Config via Layer parameters** | Not a service, passed at layer creation |

### 4.3 Service vs Layer vs Ref

| Concept | Purpose | Example |
|---------|---------|---------|
| **Service (Context.Tag)** | Declare a capability interface | `VmService` provides `runTx`, `buildBlock` |
| **Layer** | Build a service, potentially from other services | `VmLive` creates `VmService` from `EvmService` + `CommonService` |
| **Ref** | Managed mutable state | `Ref<Address \| undefined>` for impersonated account |
| **Scope** | Resource lifetime | Connection pool, file handles |

---

## 5. Service Definitions

### 5.1 Foundation Services

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/errors-effect - Foundation error types
// ═══════════════════════════════════════════════════════════════════════════

import { Data } from "effect"

// Base class for all TEVM errors
export class TevmError extends Data.TaggedError("TevmError")<{
  readonly message: string
  readonly code: number
  readonly cause?: unknown
  readonly docsPath?: string
}> {}

// Specific error types
export class InsufficientBalanceError extends Data.TaggedError("InsufficientBalanceError")<{
  readonly address: Address
  readonly required: bigint
  readonly available: bigint
}> {}

export class InvalidTransactionError extends Data.TaggedError("InvalidTransactionError")<{
  readonly reason: string
  readonly tx: unknown
}> {}

export class BlockNotFoundError extends Data.TaggedError("BlockNotFoundError")<{
  readonly blockTag: BlockTag
}> {}

export class StateRootNotFoundError extends Data.TaggedError("StateRootNotFoundError")<{
  readonly stateRoot: Hex
}> {}

export class ForkError extends Data.TaggedError("ForkError")<{
  readonly method: string
  readonly cause: unknown
}> {}

// Union type for all EVM execution errors
export type EvmExecutionError =
  | InsufficientBalanceError
  | InvalidTransactionError
  | OutOfGasError
  | RevertError
  | InvalidOpcodeError
  // ... etc

// ═══════════════════════════════════════════════════════════════════════════
// @tevm/logger-effect - Logging service
// ═══════════════════════════════════════════════════════════════════════════

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent"

export interface LoggerShape {
  readonly level: LogLevel
  readonly debug: (message: string, data?: unknown) => Effect.Effect<void>
  readonly info: (message: string, data?: unknown) => Effect.Effect<void>
  readonly warn: (message: string, data?: unknown) => Effect.Effect<void>
  readonly error: (message: string, data?: unknown) => Effect.Effect<void>
  readonly child: (name: string) => LoggerShape
}

export class LoggerService extends Context.Tag("LoggerService")<
  LoggerService,
  LoggerShape
>() {}

// Implementations
export const LoggerLive = (level: LogLevel = "warn"): Layer.Layer<LoggerService> =>
  Layer.succeed(LoggerService, createLogger({ level }))

export const LoggerSilent: Layer.Layer<LoggerService> =
  Layer.succeed(LoggerService, createLogger({ level: "silent" }))
```

### 5.2 Transport & Fork Services

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/transport-effect - Network transport for forking
// ═══════════════════════════════════════════════════════════════════════════

export interface TransportShape {
  readonly request: <T>(
    method: string,
    params?: unknown[]
  ) => Effect.Effect<T, ForkError>
}

export class TransportService extends Context.Tag("TransportService")<
  TransportService,
  TransportShape
>() {}

// HTTP transport with retry, timeout, batching
export const HttpTransport = (config: {
  url: string
  timeout?: Duration.DurationInput
  retrySchedule?: Schedule.Schedule<unknown, ForkError>
  headers?: Record<string, string>
  batch?: { wait: Duration.DurationInput; maxSize: number }
}): Layer.Layer<TransportService> =>
  Layer.scoped(TransportService,
    Effect.gen(function* () {
      const client = yield* Effect.acquireRelease(
        Effect.sync(() => createHttpClient(config)),
        (client) => Effect.sync(() => client.close())
      )
      return {
        request: (method, params) =>
          client.request(method, params).pipe(
            Effect.retry(config.retrySchedule ?? defaultRetrySchedule),
            Effect.timeout(config.timeout ?? "30 seconds"),
            Effect.mapError(e => new ForkError({ method, cause: e }))
          )
      }
    })
  )

// No-op transport for non-fork mode
export const TransportNoop: Layer.Layer<TransportService> =
  Layer.succeed(TransportService, {
    request: (method) => Effect.fail(new ForkError({
      method,
      cause: new Error("No fork transport configured")
    }))
  })

// ═══════════════════════════════════════════════════════════════════════════
// Fork Configuration Service
// ═══════════════════════════════════════════════════════════════════════════

export interface ForkConfigShape {
  readonly chainId: bigint
  readonly blockTag: bigint
}

export class ForkConfigService extends Context.Tag("ForkConfigService")<
  ForkConfigService,
  ForkConfigShape
>() {}

// Resolve chain ID and block tag from RPC
export const ForkConfigFromRpc: Layer.Layer<ForkConfigService, ForkError, TransportService> =
  Layer.effect(ForkConfigService,
    Effect.gen(function* () {
      const transport = yield* TransportService

      const [chainIdHex, blockNumberHex] = yield* Effect.all([
        transport.request<string>("eth_chainId"),
        transport.request<string>("eth_blockNumber")
      ])

      return {
        chainId: BigInt(chainIdHex),
        blockTag: BigInt(blockNumberHex)
      }
    })
  )

// Static fork config (for testing or known values)
export const ForkConfigStatic = (config: ForkConfigShape): Layer.Layer<ForkConfigService> =>
  Layer.succeed(ForkConfigService, config)
```

### 5.3 Chain Configuration Service

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/common-effect - Chain configuration
// ═══════════════════════════════════════════════════════════════════════════

export interface CommonShape {
  readonly common: Common
  readonly chainId: number
  readonly hardfork: Hardfork
  readonly eips: number[]
  readonly copy: () => Common
}

export class CommonService extends Context.Tag("CommonService")<
  CommonService,
  CommonShape
>() {}

// From fork (auto-detect chain)
export const CommonFromFork: Layer.Layer<CommonService, never, ForkConfigService> =
  Layer.effect(CommonService,
    Effect.gen(function* () {
      const { chainId } = yield* ForkConfigService
      const common = createCommon({
        ...tevmDefault,
        id: Number(chainId),
        hardfork: "prague",
        loggingLevel: "warn"
      }).copy() // Always copy to avoid mutation

      return {
        common,
        chainId: Number(chainId),
        hardfork: "prague",
        eips: common.eips(),
        copy: () => common.copy()
      }
    })
  )

// From explicit config
export const CommonFromConfig = (config: {
  chainId?: number
  hardfork?: Hardfork
  eips?: number[]
  customChain?: ChainConfig
}): Layer.Layer<CommonService> =>
  Layer.succeed(CommonService, (() => {
    const common = createCommon({
      ...(config.customChain ?? tevmDefault),
      id: config.chainId ?? 900,
      hardfork: config.hardfork ?? "prague",
      eips: config.eips ?? []
    }).copy()

    return {
      common,
      chainId: common.id,
      hardfork: config.hardfork ?? "prague",
      eips: config.eips ?? [],
      copy: () => common.copy()
    }
  })())
```

### 5.4 Core EVM Services

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/blockchain-effect - Blockchain state
// ═══════════════════════════════════════════════════════════════════════════

export interface BlockchainShape {
  readonly chain: Chain
  readonly getBlock: (tag: BlockTag) => Effect.Effect<Block, BlockNotFoundError>
  readonly getBlockByHash: (hash: Hex) => Effect.Effect<Block, BlockNotFoundError>
  readonly putBlock: (block: Block) => Effect.Effect<void>
  readonly getCanonicalHeadBlock: () => Effect.Effect<Block>
  readonly iterator: (start: bigint, end: bigint) => AsyncIterable<Block>
  readonly ready: Effect.Effect<void>
}

export class BlockchainService extends Context.Tag("BlockchainService")<
  BlockchainService,
  BlockchainShape
>() {}

export const BlockchainLive: Layer.Layer<
  BlockchainService,
  never,
  CommonService | TransportService | ForkConfigService
> = Layer.scoped(BlockchainService,
  Effect.gen(function* () {
    const { common } = yield* CommonService
    const transport = yield* TransportService
    const forkConfig = yield* ForkConfigService

    const chain = yield* Effect.acquireRelease(
      Effect.sync(() => createChain({
        common,
        fork: { transport, blockTag: forkConfig.blockTag }
      })),
      (chain) => Effect.promise(() => chain.close?.() ?? Promise.resolve())
    )

    yield* Effect.promise(() => chain.ready())

    return {
      chain,
      getBlock: (tag) => Effect.tryPromise({
        try: () => chain.getBlock(tag),
        catch: () => new BlockNotFoundError({ blockTag: tag })
      }),
      // ... other methods
      ready: Effect.promise(() => chain.ready())
    }
  })
)

// For non-fork mode (genesis-only blockchain)
export const BlockchainLocal: Layer.Layer<BlockchainService, never, CommonService> =
  Layer.scoped(BlockchainService,
    Effect.gen(function* () {
      const { common } = yield* CommonService

      const chain = createChain({ common })
      yield* Effect.promise(() => chain.ready())

      return { /* ... */ }
    })
  )

// ═══════════════════════════════════════════════════════════════════════════
// @tevm/state-effect - State management
// ═══════════════════════════════════════════════════════════════════════════

export interface StateManagerShape {
  readonly stateManager: StateManager
  readonly getAccount: (address: Address) => Effect.Effect<Account | undefined>
  readonly putAccount: (address: Address, account: Account) => Effect.Effect<void>
  readonly deleteAccount: (address: Address) => Effect.Effect<void>
  readonly getStorage: (address: Address, slot: Bytes32) => Effect.Effect<Uint8Array>
  readonly putStorage: (address: Address, slot: Bytes32, value: Uint8Array) => Effect.Effect<void>
  readonly clearStorage: (address: Address) => Effect.Effect<void>
  readonly getCode: (address: Address) => Effect.Effect<Uint8Array>
  readonly putCode: (address: Address, code: Uint8Array) => Effect.Effect<void>
  readonly getStateRoot: () => Effect.Effect<Uint8Array>
  readonly setStateRoot: (root: Uint8Array) => Effect.Effect<void, StateRootNotFoundError>
  readonly checkpoint: () => Effect.Effect<void>
  readonly commit: () => Effect.Effect<void>
  readonly revert: () => Effect.Effect<void>
  readonly dumpState: () => Effect.Effect<TevmState>
  readonly loadState: (state: TevmState) => Effect.Effect<void>
  readonly ready: Effect.Effect<void>
  readonly deepCopy: () => Effect.Effect<StateManagerShape>
}

export class StateManagerService extends Context.Tag("StateManagerService")<
  StateManagerService,
  StateManagerShape
>() {}

// ═══════════════════════════════════════════════════════════════════════════
// @tevm/evm-effect - EVM execution engine
// ═══════════════════════════════════════════════════════════════════════════

export interface EvmShape {
  readonly evm: Evm
  readonly runCall: (opts: RunCallOpts) => Effect.Effect<EvmResult, EvmExecutionError>
  readonly runCode: (opts: RunCodeOpts) => Effect.Effect<EvmResult, EvmExecutionError>
  readonly getActivePrecompiles: () => Effect.Effect<Map<string, Precompile>>
}

export class EvmService extends Context.Tag("EvmService")<
  EvmService,
  EvmShape
>() {}

export const EvmLive: Layer.Layer<
  EvmService,
  never,
  CommonService | StateManagerService | BlockchainService
> = Layer.effect(EvmService,
  Effect.gen(function* () {
    const { common } = yield* CommonService
    const { stateManager } = yield* StateManagerService
    const { chain } = yield* BlockchainService

    const evm = createEvm({
      common,
      stateManager,
      blockchain: chain,
      allowUnlimitedContractSize: false,
      customPrecompiles: [p256VerifyPrecompile()],
      profiler: false
    })

    return {
      evm,
      runCall: (opts) => Effect.tryPromise({
        try: () => evm.runCall(opts),
        catch: (e) => mapEvmError(e)
      }),
      runCode: (opts) => Effect.tryPromise({
        try: () => evm.runCode(opts),
        catch: (e) => mapEvmError(e)
      }),
      getActivePrecompiles: () => Effect.sync(() => evm.precompiles)
    }
  })
)

// ═══════════════════════════════════════════════════════════════════════════
// @tevm/vm-effect - Virtual machine (orchestrates EVM)
// ═══════════════════════════════════════════════════════════════════════════

export interface VmShape {
  readonly vm: Vm
  readonly runTx: (opts: RunTxOpts) => Effect.Effect<RunTxResult, EvmExecutionError>
  readonly runBlock: (opts: RunBlockOpts) => Effect.Effect<RunBlockResult, EvmExecutionError>
  readonly buildBlock: (opts: BuildBlockOpts) => Effect.Effect<BlockBuilder>
  readonly ready: Effect.Effect<void>
  readonly deepCopy: () => Effect.Effect<VmShape>
}

export class VmService extends Context.Tag("VmService")<
  VmService,
  VmShape
>() {}
```

### 5.5 Node State Services (Ref-based)

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Node-level mutable state - using Ref
// ═══════════════════════════════════════════════════════════════════════════

// Impersonation state
export interface ImpersonationShape {
  readonly getImpersonatedAccount: Effect.Effect<Address | undefined>
  readonly setImpersonatedAccount: (address: Address | undefined) => Effect.Effect<void>
  readonly getAutoImpersonate: Effect.Effect<boolean>
  readonly setAutoImpersonate: (enabled: boolean) => Effect.Effect<void>
}

export class ImpersonationService extends Context.Tag("ImpersonationService")<
  ImpersonationService,
  ImpersonationShape
>() {}

export const ImpersonationLive: Layer.Layer<ImpersonationService> =
  Layer.effect(ImpersonationService,
    Effect.gen(function* () {
      const impersonatedRef = yield* Ref.make<Address | undefined>(undefined)
      const autoImpersonateRef = yield* Ref.make(false)

      return {
        getImpersonatedAccount: Ref.get(impersonatedRef),
        setImpersonatedAccount: (addr) => Ref.set(impersonatedRef, addr),
        getAutoImpersonate: Ref.get(autoImpersonateRef),
        setAutoImpersonate: (enabled) => Ref.set(autoImpersonateRef, enabled)
      }
    })
  )

// Block parameters state
export interface BlockParamsShape {
  readonly getNextBlockTimestamp: Effect.Effect<bigint | undefined>
  readonly setNextBlockTimestamp: (ts: bigint | undefined) => Effect.Effect<void>
  readonly getNextBlockGasLimit: Effect.Effect<bigint | undefined>
  readonly setNextBlockGasLimit: (limit: bigint | undefined) => Effect.Effect<void>
  readonly getNextBlockBaseFeePerGas: Effect.Effect<bigint | undefined>
  readonly setNextBlockBaseFeePerGas: (fee: bigint | undefined) => Effect.Effect<void>
  readonly getMinGasPrice: Effect.Effect<bigint | undefined>
  readonly setMinGasPrice: (price: bigint | undefined) => Effect.Effect<void>
  readonly getBlockTimestampInterval: Effect.Effect<bigint | undefined>
  readonly setBlockTimestampInterval: (interval: bigint | undefined) => Effect.Effect<void>
}

export class BlockParamsService extends Context.Tag("BlockParamsService")<
  BlockParamsService,
  BlockParamsShape
>() {}

export const BlockParamsLive: Layer.Layer<BlockParamsService> =
  Layer.effect(BlockParamsService,
    Effect.gen(function* () {
      const nextTimestamp = yield* Ref.make<bigint | undefined>(undefined)
      const nextGasLimit = yield* Ref.make<bigint | undefined>(undefined)
      const nextBaseFee = yield* Ref.make<bigint | undefined>(undefined)
      const minGasPrice = yield* Ref.make<bigint | undefined>(undefined)
      const timestampInterval = yield* Ref.make<bigint | undefined>(undefined)

      return {
        getNextBlockTimestamp: Ref.get(nextTimestamp),
        setNextBlockTimestamp: (ts) => Ref.set(nextTimestamp, ts),
        getNextBlockGasLimit: Ref.get(nextGasLimit),
        setNextBlockGasLimit: (limit) => Ref.set(nextGasLimit, limit),
        getNextBlockBaseFeePerGas: Ref.get(nextBaseFee),
        setNextBlockBaseFeePerGas: (fee) => Ref.set(nextBaseFee, fee),
        getMinGasPrice: Ref.get(minGasPrice),
        setMinGasPrice: (price) => Ref.set(minGasPrice, price),
        getBlockTimestampInterval: Ref.get(timestampInterval),
        setBlockTimestampInterval: (interval) => Ref.set(timestampInterval, interval)
      }
    })
  )

// Snapshot state
export interface SnapshotShape {
  readonly take: () => Effect.Effect<Hex>
  readonly revert: (id: Hex) => Effect.Effect<void, SnapshotNotFoundError>
  readonly get: (id: Hex) => Effect.Effect<Snapshot | undefined>
  readonly getAll: () => Effect.Effect<Map<Hex, Snapshot>>
}

export class SnapshotService extends Context.Tag("SnapshotService")<
  SnapshotService,
  SnapshotShape
>() {}

export const SnapshotLive: Layer.Layer<SnapshotService, never, StateManagerService> =
  Layer.effect(SnapshotService,
    Effect.gen(function* () {
      const stateManager = yield* StateManagerService
      const snapshotsRef = yield* Ref.make(new Map<Hex, Snapshot>())
      const counterRef = yield* Ref.make(1)

      return {
        take: () => Effect.gen(function* () {
          const id = yield* Ref.getAndUpdate(counterRef, n => n + 1)
          const hexId = `0x${id.toString(16)}` as Hex
          const stateRoot = yield* stateManager.getStateRoot()
          const state = yield* stateManager.dumpState()

          yield* Ref.update(snapshotsRef, map => {
            const newMap = new Map(map)
            newMap.set(hexId, { stateRoot: bytesToHex(stateRoot), state })
            return newMap
          })

          return hexId
        }),

        revert: (id) => Effect.gen(function* () {
          const snapshots = yield* Ref.get(snapshotsRef)
          const snapshot = snapshots.get(id)

          if (!snapshot) {
            return yield* Effect.fail(new SnapshotNotFoundError({ id }))
          }

          yield* stateManager.setStateRoot(hexToBytes(snapshot.stateRoot))

          // Delete this and all subsequent snapshots
          const targetNum = parseInt(id, 16)
          yield* Ref.update(snapshotsRef, map => {
            const newMap = new Map(map)
            for (const [key] of newMap) {
              if (parseInt(key, 16) >= targetNum) {
                newMap.delete(key)
              }
            }
            return newMap
          })
        }),

        get: (id) => Ref.get(snapshotsRef).pipe(Effect.map(m => m.get(id))),
        getAll: () => Ref.get(snapshotsRef)
      }
    })
  )

// Filter state (for eth_newFilter)
export interface FilterShape {
  readonly create: (params: FilterParams) => Effect.Effect<Hex>
  readonly get: (id: Hex) => Effect.Effect<Filter | undefined>
  readonly remove: (id: Hex) => Effect.Effect<boolean>
  readonly getChanges: (id: Hex) => Effect.Effect<Log[], FilterNotFoundError>
  readonly getAll: () => Effect.Effect<Map<Hex, Filter>>
}

export class FilterService extends Context.Tag("FilterService")<
  FilterService,
  FilterShape
>() {}
```

### 5.6 Transaction & Mining Services

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/txpool-effect - Transaction mempool
// ═══════════════════════════════════════════════════════════════════════════

export interface TxPoolShape {
  readonly add: (tx: TypedTransaction) => Effect.Effect<void, TxPoolError>
  readonly addUnverified: (tx: TypedTransaction) => Effect.Effect<void, TxPoolError>
  readonly remove: (hash: Hex) => Effect.Effect<void>
  readonly getByHash: (hash: Hex) => Effect.Effect<TypedTransaction | undefined>
  readonly getPending: () => Effect.Effect<TypedTransaction[]>
  readonly getQueued: () => Effect.Effect<TypedTransaction[]>
  readonly getTxsInPool: Effect.Effect<number>
  readonly clear: () => Effect.Effect<void>
  readonly deepCopy: () => Effect.Effect<TxPoolShape>
}

export class TxPoolService extends Context.Tag("TxPoolService")<
  TxPoolService,
  TxPoolShape
>() {}

// ═══════════════════════════════════════════════════════════════════════════
// Mining service
// ═══════════════════════════════════════════════════════════════════════════

export type MiningMode =
  | { type: "auto" }
  | { type: "manual" }
  | { type: "interval"; ms: number }

export interface MiningShape {
  readonly mode: Effect.Effect<MiningMode>
  readonly setMode: (mode: MiningMode) => Effect.Effect<void>
  readonly mine: (opts?: { blocks?: number; interval?: number }) => Effect.Effect<Block[], MiningError>
  readonly startIntervalMining: (ms: number) => Effect.Effect<void>
  readonly stopIntervalMining: () => Effect.Effect<void>
}

export class MiningService extends Context.Tag("MiningService")<
  MiningService,
  MiningShape
>() {}

// ═══════════════════════════════════════════════════════════════════════════
// Receipt manager service
// ═══════════════════════════════════════════════════════════════════════════

export interface ReceiptManagerShape {
  readonly saveReceipt: (tx: TypedTransaction, receipt: TxReceipt, block: Block) => Effect.Effect<void>
  readonly getReceipt: (txHash: Hex) => Effect.Effect<TxReceipt | undefined>
  readonly getLogs: (filter: LogFilter) => Effect.Effect<Log[]>
  readonly deepCopy: () => Effect.Effect<ReceiptManagerShape>
}

export class ReceiptManagerService extends Context.Tag("ReceiptManagerService")<
  ReceiptManagerService,
  ReceiptManagerShape
>() {}
```

### 5.7 Top-Level Node Service

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/node-effect - TevmNode service (orchestrates everything)
// ═══════════════════════════════════════════════════════════════════════════

export type NodeStatus = "INITIALIZING" | "READY" | "STOPPED"
export type NodeMode = "normal" | "fork"

export interface TevmNodeShape {
  readonly status: Effect.Effect<NodeStatus>
  readonly mode: NodeMode
  readonly ready: Effect.Effect<void>

  // Access sub-services (for advanced use cases)
  readonly vm: Effect.Effect<VmShape>
  readonly txPool: Effect.Effect<TxPoolShape>
  readonly receiptManager: Effect.Effect<ReceiptManagerShape>
  readonly stateManager: Effect.Effect<StateManagerShape>
  readonly blockchain: Effect.Effect<BlockchainShape>

  // JSON-RPC request handler
  readonly request: <T>(req: JsonRpcRequest) => Effect.Effect<T, JsonRpcError>

  // Deep copy for test isolation
  readonly deepCopy: () => Effect.Effect<TevmNodeShape>

  // Event emitter
  readonly on: <E extends NodeEvent>(event: E, handler: NodeEventHandler<E>) => Effect.Effect<void>
  readonly emit: <E extends NodeEvent>(event: E, data: NodeEventData<E>) => Effect.Effect<void>
}

export class TevmNodeService extends Context.Tag("TevmNodeService")<
  TevmNodeService,
  TevmNodeShape
>() {}

// ═══════════════════════════════════════════════════════════════════════════
// TevmNode namespace with layer factories
// ═══════════════════════════════════════════════════════════════════════════

export const TevmNode = {
  /**
   * Create a TevmNode with full configuration
   */
  Live: (options: TevmNodeOptions = {}): Layer.Layer<
    | TevmNodeService
    | VmService
    | EvmService
    | StateManagerService
    | BlockchainService
    | TxPoolService
    | ReceiptManagerService
    | MiningService
    | SnapshotService
    | FilterService
    | ImpersonationService
    | BlockParamsService
    | CommonService
    | LoggerService
  > => {
    const baseLayer = options.fork
      ? ForkLayer(options)
      : LocalLayer(options)

    return baseLayer.pipe(
      Layer.provideMerge(NodeStateLive),
      Layer.provideMerge(TevmNodeLive)
    )
  },

  /**
   * Create a local (non-fork) TevmNode
   */
  Local: (options: Omit<TevmNodeOptions, "fork"> = {}) =>
    TevmNode.Live({ ...options, fork: undefined }),

  /**
   * Create a forked TevmNode
   */
  Fork: (url: string, options: Partial<TevmNodeOptions> = {}) =>
    TevmNode.Live({
      ...options,
      fork: { transport: http(url), ...options.fork }
    }),

  /**
   * Test layer with deterministic behavior
   */
  Test: (options: TestNodeOptions = {}): Layer.Layer<TevmNodeService> =>
    TevmNode.Live({
      ...options,
      miningConfig: { type: "manual" },
      loggingLevel: "silent"
    })
}
```

---

## 6. Error Handling Strategy

### 6.1 Error Hierarchy

```
TevmError (base)
├── TransportError
│   ├── ForkError
│   ├── NetworkError
│   └── TimeoutError
├── StateError
│   ├── AccountNotFoundError
│   ├── StateRootNotFoundError
│   └── StorageError
├── EvmExecutionError
│   ├── InsufficientBalanceError
│   ├── InsufficientFundsError
│   ├── OutOfGasError
│   ├── RevertError
│   ├── InvalidOpcodeError
│   ├── StackUnderflowError
│   ├── StackOverflowError
│   └── InvalidJumpError
├── TransactionError
│   ├── InvalidTransactionError
│   ├── NonceTooLowError
│   ├── NonceTooHighError
│   └── GasTooLowError
├── BlockError
│   ├── BlockNotFoundError
│   ├── InvalidBlockError
│   └── BlockGasLimitExceededError
├── JsonRpcError
│   ├── InvalidRequestError
│   ├── MethodNotFoundError
│   ├── InvalidParamsError
│   └── InternalError
└── NodeError
    ├── SnapshotNotFoundError
    ├── FilterNotFoundError
    └── NodeNotReadyError
```

### 6.2 Error Definition Pattern

```typescript
// Each error is a TaggedError with structured data
export class InsufficientBalanceError extends Data.TaggedError("InsufficientBalanceError")<{
  readonly address: Address
  readonly required: bigint
  readonly available: bigint
  readonly message?: string
}> {
  get message() {
    return this._message ??
      `Insufficient balance: ${this.address} has ${this.available} but needs ${this.required}`
  }

  // JSON-RPC error code
  readonly code = -32000

  // Documentation path for users
  readonly docsPath = "/errors/insufficient-balance"
}

// Errors are yieldable - can be yielded directly in Effect.gen
const program = Effect.gen(function* () {
  const balance = 100n
  const required = 200n

  if (balance < required) {
    yield* new InsufficientBalanceError({
      address: "0x...",
      required,
      available: balance
    })
  }
})
```

### 6.3 Error Handling Patterns

```typescript
// Pattern 1: Catch specific errors
const handleInsufficient = program.pipe(
  Effect.catchTag("InsufficientBalanceError", (e) =>
    Effect.succeed({ funded: false, needed: e.required - e.available })
  )
)

// Pattern 2: Catch multiple error types
const handleMultiple = program.pipe(
  Effect.catchTags({
    InsufficientBalanceError: (e) => Effect.succeed("needs funds"),
    NonceTooLowError: (e) => Effect.succeed("retry with higher nonce"),
    RevertError: (e) => Effect.succeed(`reverted: ${e.reason}`)
  })
)

// Pattern 3: Map all errors to JSON-RPC format
const toJsonRpc = program.pipe(
  Effect.mapError((e) => ({
    code: e.code,
    message: e.message,
    data: { tag: e._tag, ...e }
  }))
)

// Pattern 4: Provide recovery
const withRecovery = program.pipe(
  Effect.catchTag("InsufficientBalanceError", (e) =>
    Effect.gen(function* () {
      const faucet = yield* FaucetService
      yield* faucet.fund(e.address, e.required)
      return yield* program // Retry
    })
  )
)
```

### 6.4 Migration from BaseError

```typescript
// BEFORE: Class extending BaseError
export class InsufficientBalanceError extends BaseError {
  constructor(params) {
    super('Insufficient balance', params, 'InsufficientBalanceError', -32000)
    this.address = params.address
    this.required = params.required
    this.available = params.available
  }
}

// AFTER: Data.TaggedError
export class InsufficientBalanceError extends Data.TaggedError("InsufficientBalanceError")<{
  readonly address: Address
  readonly required: bigint
  readonly available: bigint
}> {
  readonly code = -32000
}

// Interop helper for migration period
export const toTaggedError = (e: BaseError): TevmError => {
  switch (e._tag) {
    case "InsufficientBalanceError":
      return new InsufficientBalanceError({
        address: e.address,
        required: e.required,
        available: e.available
      })
    // ... other cases
    default:
      return new TevmError({
        message: e.message,
        code: e.code,
        cause: e
      })
  }
}
```

---

## 7. Layer Composition

### 7.1 Layer Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TevmNode.Live(options)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                     Layer.provideMerge(TevmNodeLive)
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                           NodeStateLive                                  │
│  Layer.mergeAll(                                                         │
│    ImpersonationLive,                                                    │
│    BlockParamsLive,                                                      │
│    SnapshotLive,   ◄──── requires StateManagerService                   │
│    FilterLive,                                                           │
│    MiningLive      ◄──── requires VmService, TxPoolService              │
│  )                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                     Layer.provideMerge(EvmStackLive)
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                           EvmStackLive                                   │
│                                                                          │
│  TxPoolLive ◄──────── VmLive ◄──────── EvmLive                          │
│      │                  │                │                               │
│      │                  │                ▼                               │
│      │                  │         StateManagerLive                       │
│      │                  │                │                               │
│      │                  ▼                ▼                               │
│      │            CommonLive ◄──── BlockchainLive                       │
│      │                  │                │                               │
│      ▼                  ▼                ▼                               │
│  ReceiptManagerLive ◄───────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
       (if options.fork)                          (if !options.fork)
              │                                           │
              ▼                                           ▼
┌───────────────────────────┐               ┌───────────────────────────┐
│       ForkBaseLive        │               │       LocalBaseLive       │
│                           │               │                           │
│  HttpTransport(url)       │               │  TransportNoop            │
│         │                 │               │         │                 │
│         ▼                 │               │         ▼                 │
│  ForkConfigFromRpc        │               │  ForkConfigStatic({       │
│         │                 │               │    chainId: 900n,         │
│         ▼                 │               │    blockTag: 0n           │
│  CommonFromFork           │               │  })                       │
│         │                 │               │         │                 │
│         ▼                 │               │         ▼                 │
│  BlockchainLive           │               │  CommonFromConfig         │
│         │                 │               │         │                 │
│         ▼                 │               │         ▼                 │
│  StateManagerFork         │               │  BlockchainLocal          │
└───────────────────────────┘               │         │                 │
                                            │         ▼                 │
                                            │  StateManagerLocal        │
                                            └───────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           LoggerLive                                     │
│  (provided at bottom, available to all layers)                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Layer Factory Implementation

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Layer factories for different configurations
// ═══════════════════════════════════════════════════════════════════════════

const ForkBaseLive = (options: ForkOptions) =>
  HttpTransport({
    url: options.url,
    timeout: options.timeout,
    headers: options.headers,
    batch: options.batch
  }).pipe(
    Layer.provideMerge(
      options.blockTag !== undefined
        ? ForkConfigStatic({ chainId: options.chainId ?? 1n, blockTag: options.blockTag })
        : ForkConfigFromRpc
    )
  )

const LocalBaseLive = (options: TevmNodeOptions) =>
  TransportNoop.pipe(
    Layer.provideMerge(ForkConfigStatic({
      chainId: BigInt(options.common?.id ?? 900),
      blockTag: 0n
    })),
    Layer.provideMerge(CommonFromConfig({
      chainId: options.common?.id,
      hardfork: options.hardfork ?? "prague",
      eips: options.eips
    }))
  )

const EvmStackLive: Layer.Layer<
  VmService | EvmService | StateManagerService | BlockchainService | TxPoolService | ReceiptManagerService,
  never,
  CommonService | TransportService | ForkConfigService
> = Layer.empty.pipe(
  Layer.provideMerge(BlockchainLive),
  Layer.provideMerge(StateManagerLive),
  Layer.provideMerge(EvmLive),
  Layer.provideMerge(VmLive),
  Layer.provideMerge(TxPoolLive),
  Layer.provideMerge(ReceiptManagerLive)
)

const NodeStateLive: Layer.Layer<
  ImpersonationService | BlockParamsService | SnapshotService | FilterService | MiningService,
  never,
  StateManagerService | VmService | TxPoolService
> = Layer.mergeAll(
  ImpersonationLive,
  BlockParamsLive
).pipe(
  Layer.provideMerge(SnapshotLive),
  Layer.provideMerge(FilterLive),
  Layer.provideMerge(MiningLive)
)

const TevmNodeLive: Layer.Layer<
  TevmNodeService,
  never,
  | VmService | EvmService | StateManagerService | BlockchainService
  | TxPoolService | ReceiptManagerService | MiningService
  | SnapshotService | FilterService | ImpersonationService | BlockParamsService
  | CommonService | LoggerService
> = Layer.effect(TevmNodeService,
  Effect.gen(function* () {
    const vm = yield* VmService
    const txPool = yield* TxPoolService
    const receiptManager = yield* ReceiptManagerService
    const stateManager = yield* StateManagerService
    const blockchain = yield* BlockchainService
    const common = yield* CommonService
    const logger = yield* LoggerService

    const statusRef = yield* Ref.make<NodeStatus>("INITIALIZING")
    const eventsRef = yield* Ref.make(new Map<NodeEvent, Set<Function>>())

    // Wait for all services to be ready
    yield* Effect.all([
      blockchain.ready,
      stateManager.ready,
      vm.ready
    ])

    yield* Ref.set(statusRef, "READY")
    yield* logger.info("TevmNode initialized", { chainId: common.chainId })

    return {
      status: Ref.get(statusRef),
      mode: /* determined from transport */ "fork",
      ready: Ref.get(statusRef).pipe(
        Effect.flatMap(s => s === "READY"
          ? Effect.void
          : Effect.fail(new NodeNotReadyError({}))
        )
      ),
      vm: Effect.succeed(vm),
      txPool: Effect.succeed(txPool),
      receiptManager: Effect.succeed(receiptManager),
      stateManager: Effect.succeed(stateManager),
      blockchain: Effect.succeed(blockchain),
      request: createJsonRpcHandler(),
      deepCopy: createDeepCopy(),
      on: (event, handler) => /* ... */,
      emit: (event, data) => /* ... */
    }
  })
)
```

### 7.3 Single Provide Pattern

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// User code: Single Effect.provide at the top level
// ═══════════════════════════════════════════════════════════════════════════

// GOOD: Single provide at composition root
const program = Effect.gen(function* () {
  const node = yield* TevmNodeService
  yield* node.ready

  const vm = yield* node.vm
  const result = yield* vm.runTx({ tx: myTx })

  return result
}).pipe(
  Effect.provide(TevmNode.Live({
    fork: { url: "https://mainnet.optimism.io" }
  }))
)

// BAD: Scattered provides
const badProgram = Effect.gen(function* () {
  const vm = yield* VmService  // Where does this come from?
  // ...
}).pipe(
  Effect.provide(VmLive),
  Effect.provide(EvmLive),     // Manual wiring = error prone
  Effect.provide(StateLive),
  // Missing dependencies = runtime error
)
```

---

## 8. Migration Strategy

### 8.1 Guiding Principles

Based on [Inato's successful fp-ts to Effect migration](https://medium.com/inato/how-we-migrated-our-codebase-from-fp-ts-to-effect-b71acd0c5640):

1. **Coexistence over big-bang**: Old and new code must work together
2. **Bottom-up migration**: Start with leaf packages, work up
3. **Interop helpers**: Build bridges between Promise and Effect
4. **Incremental adoption**: New code uses Effect, old code migrates gradually
5. **Test coverage first**: Ensure tests pass before/during/after migration

### 8.2 Four-Phase Approach

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Foundation (2-3 weeks)                                         │
│                                                                          │
│ • Add Effect as dependency                                              │
│ • Create @tevm/errors-effect with TaggedError versions                  │
│ • Create @tevm/interop with Promise ↔ Effect bridges                    │
│ • Migrate: errors, utils, logger, rlp                                   │
│ • No breaking changes to public API                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Core Services (3-4 weeks)                                      │
│                                                                          │
│ • Define all service interfaces (Context.Tag)                           │
│ • Migrate: common, address, tx, block, trie                             │
│ • Migrate: state, blockchain, evm, vm                                   │
│ • Create Live and Test layers                                           │
│ • Maintain Promise-based wrappers for backward compat                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Node & Actions (3-4 weeks)                                     │
│                                                                          │
│ • Migrate: txpool, receipt-manager, precompiles, predeploys             │
│ • Migrate: node (createTevmNode → TevmNode.Live)                        │
│ • Migrate: actions, jsonrpc, procedures                                  │
│ • Update tests to use Effect patterns                                    │
│ • Deprecate old Promise-based APIs                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Client Layer (2-3 weeks)                                       │
│                                                                          │
│ • Migrate: memory-client, http-client, decorators, server               │
│ • Create new Effect-native API alongside viem-compatible API            │
│ • Migrate: sync-storage-persister, contract                             │
│ • Remove deprecated Promise APIs (major version bump)                   │
│ • Update documentation                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Interoperability Layer

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// @tevm/interop - Bridges between Promise and Effect worlds
// ═══════════════════════════════════════════════════════════════════════════

import { Effect, Runtime } from "effect"

/**
 * Convert an Effect program to a Promise.
 * Use at the boundary when calling Effect code from Promise code.
 */
export const effectToPromise = <A, E>(
  effect: Effect.Effect<A, E>,
  runtime: Runtime.Runtime<never> = Runtime.defaultRuntime
): Promise<A> => Runtime.runPromise(runtime)(effect)

/**
 * Convert a Promise-returning function to Effect.
 * Use when wrapping existing Promise-based APIs.
 */
export const promiseToEffect = <A, Args extends unknown[]>(
  fn: (...args: Args) => Promise<A>
): (...args: Args) => Effect.Effect<A, unknown> =>
  (...args) => Effect.tryPromise(() => fn(...args))

/**
 * Wrap an existing class with Effect methods.
 * Maintains backward compatibility while adding Effect API.
 */
export const wrapWithEffect = <T extends object>(
  instance: T,
  methods: (keyof T)[]
): T & { effect: { [K in keyof T]: Effect.Effect<ReturnType<T[K]>> } } => {
  const effectMethods = {} as any

  for (const method of methods) {
    if (typeof instance[method] === "function") {
      effectMethods[method] = (...args: unknown[]) =>
        Effect.tryPromise(() => (instance[method] as Function)(...args))
    }
  }

  return Object.assign(instance, { effect: effectMethods })
}

/**
 * Create a Layer from an existing factory function.
 * Allows gradual migration of create* functions.
 */
export const layerFromFactory = <S, O>(
  tag: Context.Tag<unknown, S>,
  factory: (options: O) => Promise<S>
): (options: O) => Layer.Layer<S> =>
  (options) => Layer.effect(tag, Effect.promise(() => factory(options)))

// ═══════════════════════════════════════════════════════════════════════════
// Example: Wrapping existing createStateManager
// ═══════════════════════════════════════════════════════════════════════════

// BEFORE: Promise-based
const stateManager = await createStateManager(options)
const account = await stateManager.getAccount(address)

// DURING MIGRATION: Both APIs available
const stateManager = await createStateManager(options)
const accountPromise = await stateManager.getAccount(address)
const accountEffect = yield* stateManager.effect.getAccount(address)

// AFTER: Pure Effect
const account = yield* StateManagerService.pipe(
  Effect.flatMap(sm => sm.getAccount(address))
)
```

### 8.4 File-Level Migration Pattern

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Step-by-step migration of a single file
// ═══════════════════════════════════════════════════════════════════════════

// STEP 1: Original file (createStateManager.js)
export const createStateManager = async (options) => {
  const blockchain = await createBlockchain(options)
  // ...
  return {
    getAccount: async (address) => { ... },
    putAccount: async (address, account) => { ... }
  }
}

// STEP 2: Add Effect version alongside (createStateManager.js)
import { Effect, Layer, Context } from "effect"

// Keep old export
export const createStateManager = async (options) => { ... }

// Add new Effect-based service
export class StateManagerService extends Context.Tag("StateManagerService")<...>() {}

export const StateManagerLive = Layer.effect(StateManagerService,
  Effect.gen(function* () {
    const blockchain = yield* BlockchainService
    // Use Effect internally
    return {
      getAccount: (address) => Effect.tryPromise(() => /* old logic */),
      // ...
    }
  })
)

// STEP 3: Migrate internals to Effect
export const StateManagerLive = Layer.effect(StateManagerService,
  Effect.gen(function* () {
    const blockchain = yield* BlockchainService
    const accountsRef = yield* Ref.make(new Map<Address, Account>())

    return {
      getAccount: (address) => Ref.get(accountsRef).pipe(
        Effect.map(m => m.get(address))
      ),
      putAccount: (address, account) => Ref.update(accountsRef, m =>
        new Map(m).set(address, account)
      )
    }
  })
)

// STEP 4: Remove old Promise-based export (breaking change)
// - Delete createStateManager
// - Export only StateManagerService and StateManagerLive
// - Update all callers
```

---

## 9. Package Migration Order

### 9.1 Dependency-Ordered Migration

Migrate bottom-up following the dependency graph:

```
WAVE 1 (No internal dependencies)
├── @tevm/errors      → @tevm/errors-effect     [TaggedError]
├── @tevm/utils       → (keep, add Effect utils)
├── @tevm/logger      → @tevm/logger-effect     [LoggerService]
└── @tevm/rlp         → (keep, pure functions)

WAVE 2 (Depend only on Wave 1)
├── @tevm/address     → (keep, pure functions)
├── @tevm/trie        → (keep, pure functions)
├── @tevm/jsonrpc     → (keep, types only)
└── @tevm/contract    → (keep, pure functions)

WAVE 3 (Core primitives)
├── @tevm/common      → CommonService, CommonLive
├── @tevm/tx          → (keep, pure functions + types)
└── @tevm/block       → (keep, pure functions + types)

WAVE 4 (Stateful core)
├── @tevm/blockchain  → BlockchainService, BlockchainLive/Local
├── @tevm/state       → StateManagerService, StateManagerLive/Fork
├── @tevm/evm         → EvmService, EvmLive
└── @tevm/vm          → VmService, VmLive

WAVE 5 (Transaction layer)
├── @tevm/txpool            → TxPoolService, TxPoolLive
├── @tevm/receipt-manager   → ReceiptManagerService
├── @tevm/precompiles       → (keep, integrate with EvmLive)
└── @tevm/predeploys        → (keep, used in genesis)

WAVE 6 (Node layer)
├── @tevm/node        → TevmNodeService, TevmNode.Live/Fork/Test
├── @tevm/actions     → Effect-based action functions
└── @tevm/procedures  → (types, no migration needed)

WAVE 7 (Client layer)
├── @tevm/decorators        → Effect + viem interop
├── @tevm/memory-client     → Effect API + viem wrapper
├── @tevm/http-client       → HttpClientService
├── @tevm/server            → Effect-based handlers
└── @tevm/sync-storage-persister → PersisterService
```

### 9.2 Package Effort Estimates

| Package | LOC | Complexity | Effort | Notes |
|---------|-----|------------|--------|-------|
| errors | 1.2k | Low | 2 days | Define TaggedErrors |
| utils | 2.5k | Low | 1 day | Keep, add helpers |
| logger | 0.3k | Low | 1 day | LoggerService |
| rlp | 0.2k | Low | 0 | Keep as-is |
| address | 0.5k | Low | 0 | Keep as-is |
| common | 0.8k | Medium | 3 days | CommonService |
| tx | 1.0k | Low | 1 day | Types + helpers |
| block | 1.5k | Low | 1 day | Types + helpers |
| blockchain | 2.0k | High | 5 days | BlockchainService + fork |
| state | 3.5k | High | 7 days | StateManagerService + fork |
| evm | 1.2k | Medium | 3 days | EvmService |
| vm | 1.5k | Medium | 3 days | VmService |
| txpool | 2.0k | Medium | 4 days | TxPoolService + Ref |
| receipt-manager | 1.0k | Medium | 2 days | ReceiptManagerService |
| node | 4.0k | **Very High** | 10 days | Full orchestration |
| actions | 5.0k | High | 7 days | All RPC handlers |
| decorators | 0.8k | Medium | 2 days | viem interop |
| memory-client | 1.0k | Medium | 3 days | Effect + viem API |
| server | 1.5k | Medium | 3 days | HTTP handlers |
| **TOTAL** | ~30k | | ~55 days | |

---

## 10. Interoperability & Coexistence

### 10.1 Dual API Pattern

During migration, packages export both APIs:

```typescript
// @tevm/state/index.ts during migration

// Legacy Promise API (deprecated)
export { createStateManager } from "./createStateManager.js"
export type { StateManager } from "./StateManager.js"

// New Effect API
export { StateManagerService, StateManagerLive, StateManagerTest } from "./StateManagerService.js"
export type { StateManagerShape } from "./StateManagerService.js"

// Interop helpers
export { stateManagerToEffect, effectToStateManager } from "./interop.js"
```

### 10.2 Viem Integration

Memory client continues to work with viem:

```typescript
// New Effect-native usage
const effectProgram = Effect.gen(function* () {
  const node = yield* TevmNodeService
  return yield* node.request({ method: "eth_blockNumber" })
}).pipe(Effect.provide(TevmNode.Live()))

// Existing viem-compatible usage (unchanged for users)
const viemClient = createMemoryClient({
  fork: { transport: http("https://...") }
})
const blockNumber = await viemClient.getBlockNumber()

// Under the hood: viem client wraps Effect runtime
export const createMemoryClient = (options) => {
  const runtime = Runtime.defaultRuntime
  const layer = TevmNode.Live(options)

  const transport = createTevmTransport({
    request: (method, params) =>
      Runtime.runPromise(runtime)(
        Effect.gen(function* () {
          const node = yield* TevmNodeService
          return yield* node.request({ method, params })
        }).pipe(Effect.provide(layer))
      )
  })

  return createClient({ transport })
    .extend(publicActions)
    .extend(walletActions)
    .extend(testActions)
}
```

### 10.3 Backward Compatibility Wrapper

```typescript
// Wrapper that exposes old Promise API using Effect internally

export const createTevmNode = async (options: TevmNodeOptions): Promise<TevmNode> => {
  const layer = TevmNode.Live(options)
  const runtime = ManagedRuntime.make(layer)

  // Wait for initialization
  await Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const node = yield* TevmNodeService
      yield* node.ready
    })
  )

  // Return Promise-based wrapper
  return {
    getVm: () => Runtime.runPromise(runtime)(
      TevmNodeService.pipe(Effect.flatMap(n => n.vm))
    ),

    getTxPool: () => Runtime.runPromise(runtime)(
      TevmNodeService.pipe(Effect.flatMap(n => n.txPool))
    ),

    ready: () => Runtime.runPromise(runtime)(
      TevmNodeService.pipe(Effect.flatMap(n => n.ready))
    ),

    // Expose Effect API for advanced users
    effect: {
      layer,
      runtime,
      node: TevmNodeService
    }
  }
}
```

---

## 11. Testing Strategy

### 11.1 Layer-Based Testing

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Test layers with deterministic behavior
// ═══════════════════════════════════════════════════════════════════════════

// Deterministic state manager (no fork, fixed accounts)
export const StateManagerTest = (initialState: TevmState = {}): Layer.Layer<StateManagerService> =>
  Layer.effect(StateManagerService,
    Effect.gen(function* () {
      const stateRef = yield* Ref.make(initialState)

      return {
        getAccount: (address) => Ref.get(stateRef).pipe(
          Effect.map(s => s[address])
        ),
        putAccount: (address, account) => Ref.update(stateRef, s => ({
          ...s,
          [address]: account
        })),
        dumpState: () => Ref.get(stateRef),
        loadState: (state) => Ref.set(stateRef, state),
        // ...
      }
    })
  )

// Mock transport (record/replay)
export const TransportTest = (responses: Map<string, unknown>): Layer.Layer<TransportService> =>
  Layer.succeed(TransportService, {
    request: (method, params) => {
      const key = JSON.stringify({ method, params })
      const response = responses.get(key)

      return response !== undefined
        ? Effect.succeed(response as any)
        : Effect.fail(new ForkError({ method, cause: new Error("No mock") }))
    }
  })

// Complete test node
export const TestNode = (options: {
  initialState?: TevmState
  chainId?: number
  mockResponses?: Map<string, unknown>
} = {}): Layer.Layer<TevmNodeService> =>
  TevmNode.Live({
    common: { id: options.chainId ?? 900 },
    miningConfig: { type: "manual" },
    loggingLevel: "silent"
  }).pipe(
    Layer.provide(StateManagerTest(options.initialState)),
    Layer.provide(TransportTest(options.mockResponses ?? new Map()))
  )
```

### 11.2 Test Patterns

```typescript
import { it, expect, describe } from "vitest"
import { Effect, TestContext } from "effect"

describe("VmService", () => {
  // Pattern 1: Use TestContext for Effect tests
  it.effect("runs a simple transaction", () =>
    Effect.gen(function* () {
      const vm = yield* VmService

      const result = yield* vm.runTx({
        tx: createTx({ to: RECIPIENT, value: 100n })
      })

      expect(result.execResult.exceptionError).toBeUndefined()
      expect(result.totalGasSpent).toBeGreaterThan(0n)
    }).pipe(
      Effect.provide(TestNode({
        initialState: {
          [SENDER]: { balance: 1000000n, nonce: 0n }
        }
      }))
    )
  )

  // Pattern 2: Test error handling
  it.effect("fails with InsufficientBalanceError when balance too low", () =>
    Effect.gen(function* () {
      const vm = yield* VmService

      const result = yield* vm.runTx({
        tx: createTx({ to: RECIPIENT, value: 999999999999n })
      }).pipe(
        Effect.flip  // Expect failure
      )

      expect(result._tag).toBe("InsufficientBalanceError")
    }).pipe(
      Effect.provide(TestNode({
        initialState: {
          [SENDER]: { balance: 100n, nonce: 0n }
        }
      }))
    )
  )

  // Pattern 3: Test with different layers
  it.effect("uses mock transport in fork mode", () =>
    Effect.gen(function* () {
      const stateManager = yield* StateManagerService
      const account = yield* stateManager.getAccount(VITALIK)

      // Should return mocked response
      expect(account?.balance).toBe(1000000n)
    }).pipe(
      Effect.provide(TestNode({
        mockResponses: new Map([
          [JSON.stringify({ method: "eth_getBalance", params: [VITALIK, "latest"] }), "0xf4240"]
        ])
      }))
    )
  )

  // Pattern 4: Parallel test isolation with deepCopy
  it.concurrent.effect("isolated state per test", () =>
    Effect.gen(function* () {
      const node = yield* TevmNodeService
      const isolated = yield* node.deepCopy

      // Modify isolated state
      const sm = yield* isolated.stateManager
      yield* sm.putAccount(ADDRESS, { balance: 999n, nonce: 0n })

      // Original unchanged
      const originalSm = yield* node.stateManager
      const originalAccount = yield* originalSm.getAccount(ADDRESS)
      expect(originalAccount?.balance).not.toBe(999n)
    }).pipe(
      Effect.provide(TestNode())
    )
  )
})
```

### 11.3 Snapshot Testing with Effect

```typescript
// Deterministic snapshot testing

it.effect("produces consistent state after transactions", () =>
  Effect.gen(function* () {
    const node = yield* TevmNodeService
    const vm = yield* node.vm

    // Run transactions
    yield* vm.runTx({ tx: tx1 })
    yield* vm.runTx({ tx: tx2 })

    // Get state for snapshot
    const sm = yield* node.stateManager
    const state = yield* sm.dumpState()

    // Snapshot comparison (addresses sorted, values normalized)
    expect(normalizeState(state)).toMatchSnapshot()
  }).pipe(
    Effect.provide(TestNode({
      initialState: DETERMINISTIC_GENESIS
    }))
  )
)
```

---

## 12. Performance Considerations

### 12.1 Benchmarks to Maintain

| Benchmark | Current | Target | Notes |
|-----------|---------|--------|-------|
| EVM opcode execution | baseline | ≤ 5% regression | Hot path |
| State read (cached) | ~1μs | ≤ 2μs | Effect.sync overhead |
| State read (fork) | ~50ms | ~50ms | Network bound |
| Transaction execution | ~10ms | ≤ 12ms | Full path |
| Block building | ~100ms | ≤ 110ms | Multiple txs |
| Node initialization | ~500ms | ≤ 600ms | Layer construction |
| deepCopy | ~50ms | ≤ 60ms | State cloning |

### 12.2 Optimization Strategies

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Performance optimizations for Effect
// ═══════════════════════════════════════════════════════════════════════════

// 1. Use Effect.sync for synchronous operations (no async overhead)
const getFromCache = (key: string) =>
  Effect.sync(() => cache.get(key))  // Not Effect.tryPromise

// 2. Use Effect.all for parallel operations
const parallelFetch = Effect.all([
  fetchBalance(addr1),
  fetchBalance(addr2),
  fetchBalance(addr3)
], { concurrency: "unbounded" })

// 3. Cache layer references to avoid repeated lookups
const program = Effect.gen(function* () {
  // Get service reference once
  const vm = yield* VmService

  // Reuse for multiple operations
  for (const tx of transactions) {
    yield* vm.runTx({ tx })
  }
})

// 4. Use Layer.memoize for expensive service construction
const ExpensiveServiceLive = Layer.memoize(
  Layer.scoped(ExpensiveService,
    Effect.acquireRelease(
      Effect.sync(() => createExpensiveResource()),
      (resource) => Effect.sync(() => resource.dispose())
    )
  )
)

// 5. Batch RPC requests when forking
const BatchedTransport = (config: HttpTransportConfig) =>
  Layer.effect(TransportService,
    Effect.gen(function* () {
      const batcher = yield* createBatcher({
        maxBatchSize: 100,
        maxWaitTime: Duration.millis(50)
      })

      return {
        request: (method, params) => batcher.add({ method, params })
      }
    })
  )

// 6. Avoid Effect in innermost loops
// BAD: Effect overhead per iteration
const badLoop = Effect.forEach(largeArray, item =>
  Effect.sync(() => processItem(item))
)

// GOOD: Batch into single Effect
const goodLoop = Effect.sync(() =>
  largeArray.map(processItem)
)
```

### 12.3 Bundle Size Considerations

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Tree-shaking friendly patterns
// ═══════════════════════════════════════════════════════════════════════════

// 1. Import specific modules, not entire package
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Context from "effect/Context"
// NOT: import { Effect, Layer, Context } from "effect"

// 2. Services are tree-shakeable when not used
// If user only imports VmService, other services are not bundled

// 3. Separate entry points for different use cases
// @tevm/node-effect - Full node with all services
// @tevm/vm-effect - Just VM layer (lighter)
// @tevm/state-effect - Just state management

// 4. Lazy layer construction
export const TevmNode = {
  Live: (options: TevmNodeOptions) => {
    // Layers constructed lazily, only when accessed
    return options.fork
      ? ForkLayers(options)
      : LocalLayers(options)
  }
}

// Bundle size targets (gzipped)
// effect core: ~30KB
// @tevm/node-effect: ~50KB (on top of existing)
// Full tevm + effect: ~200KB (current: ~150KB)
```

---

## 13. API Compatibility & Breaking Changes

### 13.1 Compatibility Matrix

| Current API | Migration | Breaking Change? |
|-------------|-----------|------------------|
| `createTevmNode(options)` | Keep as wrapper | No |
| `node.getVm()` | Returns Promise (same) | No |
| `node.ready()` | Returns Promise (same) | No |
| `node.deepCopy()` | Returns Promise (same) | No |
| `createMemoryClient(options)` | Keep as viem wrapper | No |
| `client.tevmCall(...)` | Keep action | No |
| Internal: direct VM access | Use VmService | Yes (internal) |
| Internal: closure state | Use Ref-based services | Yes (internal) |

### 13.2 Deprecation Timeline

```
v1.x (current)
├── Promise-based API (stable)
└── No Effect exports

v2.0 (migration start)
├── Promise-based API (maintained)
├── Effect API (experimental, @tevm/*-effect)
├── Interop helpers
└── Deprecation warnings on internal APIs

v2.x (migration progress)
├── Promise-based API (deprecated, still works)
├── Effect API (stable)
└── Documentation updated

v3.0 (migration complete)
├── Promise-based wrappers (thin layer over Effect)
├── Effect API (primary)
└── Old internal APIs removed
```

### 13.3 Breaking Change Mitigation

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// Codemods for common migrations
// ═══════════════════════════════════════════════════════════════════════════

// Pattern: Replace direct promise usage with Effect
// BEFORE:
const vm = await node.getVm()
const result = await vm.runTx({ tx })

// AFTER (codemod can automate):
const result = await effectToPromise(
  Effect.gen(function* () {
    const node = yield* TevmNodeService
    const vm = yield* node.vm
    return yield* vm.runTx({ tx })
  }).pipe(Effect.provide(layer))
)

// Or use new API directly:
const result = await Effect.runPromise(
  Effect.gen(function* () {
    const vm = yield* VmService
    return yield* vm.runTx({ tx })
  }).pipe(Effect.provide(TevmNode.Live(options)))
)
```

---

## 14. Risk Analysis

### 14.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Performance regression** | Medium | High | Benchmark suite, profile critical paths |
| **Bundle size increase** | High | Medium | Tree-shaking, separate entry points |
| **Learning curve** | High | Medium | Documentation, examples, gradual adoption |
| **Effect version churn** | Low | Medium | Pin version, abstract over unstable APIs |
| **Incomplete migration** | Medium | High | Phase gates, feature flags |
| **Test breakage** | High | Medium | Keep old tests, add new Effect tests |

### 14.2 Project Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Timeline slip** | High | Medium | Phase gates, MVP per phase |
| **Team availability** | Medium | High | Document decisions, async-friendly |
| **External dependencies** | Low | Medium | Minimal new deps (just Effect) |
| **User adoption resistance** | Medium | Medium | Backward compat, clear benefits |
| **Documentation lag** | High | Medium | Doc as you go, examples first |

### 14.3 Rollback Plan

If migration fails at any phase:

1. **Phase 1 rollback**: Remove Effect, revert errors package
2. **Phase 2 rollback**: Keep Effect as optional dep, revert service changes
3. **Phase 3 rollback**: Maintain Promise wrappers as primary, Effect as experimental
4. **Phase 4 rollback**: Don't release v3, maintain v2 with dual APIs

---

## 15. Success Metrics

### 15.1 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test coverage | ≥ 95% | `vitest --coverage` |
| Type coverage | 100% | No `any` in public API |
| Performance | ≤ 10% regression | Benchmark suite |
| Bundle size | ≤ 40% increase | `bundlephobia` |
| Error recovery | 100% typed | No untyped throws |

### 15.2 Process Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Migration velocity | 2 packages/week | Git history |
| Test pass rate | 100% | CI |
| Documentation coverage | All public APIs | Doc generation |
| Breaking changes | Documented | CHANGELOG |

### 15.3 Adoption Metrics (post-release)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Effect API usage | 30% by 6mo | Analytics |
| GitHub issues (Effect) | < 10% of total | Issue tracking |
| User satisfaction | Positive | Community feedback |

---

## 16. Design Decisions (Resolved)

### 16.1 Deep Copy Strategy

**Decision**: Minimal refactor - service method that clones Ref state.

```typescript
// TevmNodeService.deepCopy returns a fresh TevmNodeShape with cloned state
readonly deepCopy: () => Effect.Effect<TevmNodeShape>

// Implementation: clone all Refs, reuse immutable services
const deepCopy = () => Effect.gen(function* () {
  // Clone mutable state (Refs)
  const currentImpersonated = yield* Ref.get(impersonatedRef)
  const currentBlockParams = yield* Ref.get(blockParamsRef)
  const currentSnapshots = yield* Ref.get(snapshotsRef)

  // Create new Refs with cloned values
  const newImpersonatedRef = yield* Ref.make(currentImpersonated)
  const newBlockParamsRef = yield* Ref.make({ ...currentBlockParams })
  const newSnapshotsRef = yield* Ref.make(new Map(currentSnapshots))

  // Clone VM state (delegates to ethereumjs deepCopy)
  const newVm = yield* Effect.promise(() => vm.deepCopy())

  // Return new shape with fresh refs
  return buildNodeShape({
    vm: newVm,
    impersonatedRef: newImpersonatedRef,
    // ...
  })
})
```

**Rationale**: Changes minimal code. Each `deepCopy` call returns isolated state. Tests call `deepCopy` before mutations.

### 16.2 Layer Memoization

**Decision**: Use best practice - fresh layer per test via factory function.

```typescript
// Factory returns NEW layer each call (isolated)
const TestNode = (options = {}) => TevmNode.Live({
  miningConfig: { type: "manual" },
  loggingLevel: "silent",
  ...options
})

// Each test gets fresh state
it.effect("test 1", () =>
  program.pipe(Effect.provide(TestNode()))  // Fresh layer
)

it.effect("test 2", () =>
  program.pipe(Effect.provide(TestNode()))  // Different fresh layer
)

// For shared setup, use Layer.fresh explicitly
const sharedButFresh = Layer.fresh(TevmNode.Live({}))
```

**Rationale**: Standard Effect pattern. `TevmNode.Live()` is a function, not a constant - each call creates new layer.

### 16.3 Transport Lifecycle

**Decision**: Use `Layer.scoped` - transport lives for layer lifetime.

```typescript
export const HttpTransport = (config: HttpTransportConfig): Layer.Layer<
  TransportService,
  never,
  never
> => Layer.scoped(TransportService,
  Effect.gen(function* () {
    // Acquire: create connection/client
    const client = yield* Effect.acquireRelease(
      Effect.sync(() => createHttpClient(config)),
      (client) => Effect.sync(() => {
        client.close?.()
      })
    )

    return {
      request: (method, params) =>
        Effect.tryPromise(() => client.request(method, params))
    }
  })
)
```

**Scope ownership**: The layer's scope. When the program using this layer completes (or is interrupted), cleanup runs automatically.

**Long-lived connections**: User creates `ManagedRuntime` from layer - keeps scope alive:
```typescript
const runtime = ManagedRuntime.make(TevmNode.Fork("https://..."))
// Transport stays open until:
await runtime.dispose()
```

### 16.4 Event Emitter → Stream

**Decision**: Wrap in `Stream` pattern, matching voltaire's `BlockStreamService`.

```typescript
// Service shape includes Stream-returning methods
export interface TevmNodeShape {
  // ... other methods

  /**
   * Stream of node events (connect, disconnect, block, etc.)
   * Replaces node.on('event', handler)
   */
  readonly events: Stream.Stream<NodeEvent, never>
}

// Implementation wraps ethereumjs event emitter
const events = Stream.async<NodeEvent>((emit) => {
  const onConnect = () => emit.single({ type: 'connect' })
  const onBlock = (block: Block) => emit.single({ type: 'block', block })

  eventEmitter.on('connect', onConnect)
  eventEmitter.on('block', onBlock)

  // Cleanup on stream end
  return Effect.sync(() => {
    eventEmitter.off('connect', onConnect)
    eventEmitter.off('block', onBlock)
  })
})

// Usage
yield* Stream.runForEach(node.events, (event) =>
  Effect.log(`Event: ${event.type}`)
)
```

**Rationale**: Consistent with voltaire-effect patterns. Stream is fiber-safe, composable, handles backpressure.

### 16.5 Ethereumjs Interop

**Decision**: Wrap immediately with `Effect.tryPromise`, keep simple, mark with TODO.

```typescript
// TODO: ethereumjs will be replaced with native Effect implementation
// Keep this wrapper minimal - just bridge Promise to Effect
const wrapEthereumjs = <T>(
  fn: () => Promise<T>,
  errorTag: string
): Effect.Effect<T, TevmError> =>
  Effect.tryPromise({
    try: fn,
    catch: (e) => new TevmError({
      message: e instanceof Error ? e.message : String(e),
      code: -32000,
      cause: e,
      _tag: errorTag
    })
  })

// Usage in VmService
export const VmLive = Layer.effect(VmService,
  Effect.gen(function* () {
    const { evm } = yield* EvmService
    const { common } = yield* CommonService

    // TODO: Replace with native Effect VM when ethereumjs migrated
    const vm = createVm({ evm, common, /* ... */ })

    return {
      runTx: (opts) => wrapEthereumjs(
        () => vm.runTx(opts),
        "VmRunTxError"
      ),
      // ...
    }
  })
)
```

**Rationale**: Don't over-engineer the bridge - ethereumjs internals will be replaced. Just make it work with Effect at the boundaries.

### 16.6 Runtime Management

**Decision**: User controls runtime via `ManagedRuntime` or `Effect.runPromise`.

```typescript
// Option A: One-shot execution (simple)
await Effect.runPromise(
  program.pipe(Effect.provide(TevmNode.Live({})))
)
// Layer constructed, program runs, layer disposed

// Option B: Long-lived runtime (advanced)
const runtime = ManagedRuntime.make(TevmNode.Live({
  fork: { url: "https://..." }
}))

// Use runtime for multiple operations
await runtime.runPromise(program1)
await runtime.runPromise(program2)

// Explicit cleanup when done
await runtime.dispose()

// Option C: viem wrapper manages runtime internally
export const createMemoryClient = (options) => {
  // Internal managed runtime - user doesn't see it
  const runtime = ManagedRuntime.make(TevmNode.Live(options))

  return {
    // Viem-compatible Promise API
    getBlockNumber: () => runtime.runPromise(
      Effect.gen(function* () {
        const node = yield* TevmNodeService
        const rpc = yield* node.request({ method: 'eth_blockNumber' })
        return BigInt(rpc)
      })
    ),

    // Cleanup
    destroy: () => runtime.dispose(),

    // Escape hatch to Effect
    effect: { runtime, layer: TevmNode.Live(options) }
  }
}
```

**Rationale**:
- Simple case: `Effect.runPromise` - no runtime management needed
- Advanced case: `ManagedRuntime` - user controls lifecycle
- Viem wrapper: hides runtime, exposes Promise API with `destroy()` method

### 16.7 Implementation Questions (Resolved)

| Question | Decision |
|----------|----------|
| Effect version | Latest 3.x, pin in package.json |
| Test framework | `@effect/vitest` for `it.effect` |
| Context.Tag vs Effect.Service | `Context.Tag` - more explicit, stable |
| Node state services | Keep separate (granular testing) |

---

## 17. References

### 17.1 Effect.ts Resources

- [Effect Documentation](https://effect.website/docs/)
- [Managing Layers](https://effect.website/docs/requirements-management/layers/)
- [Error Management](https://effect.website/docs/error-management/expected-errors/)
- [State Management with Ref](https://effect.website/docs/state-management/ref/)
- [Resource Management](https://effect.website/docs/resource-management/scope/)
- [Effect Patterns Repository](https://github.com/PaulJPhilp/EffectPatterns)

### 17.2 Migration Case Studies

- [Inato: fp-ts to Effect Migration](https://medium.com/inato/how-we-migrated-our-codebase-from-fp-ts-to-effect-b71acd0c5640)
- [Sandro Maglione: fp-ts to Effect Guide](https://www.sandromaglione.com/articles/from-fp-ts-to-effect-ts-migration-guide)
- [Effect Days 2025 Workshop](https://dtech.vision/blog/how-to-effect-ts-best-practices/)

### 17.3 Related Projects

- [voltaire-effect](../voltaire/voltaire-effect/) - Effect-based Ethereum primitives (internal reference)
- [@effect/platform](https://github.com/Effect-TS/effect/tree/main/packages/platform) - HTTP client patterns
- [@effect/sql](https://github.com/Effect-TS/effect/tree/main/packages/sql) - Service patterns for data access

---

## Appendix A: Service Interface Reference

See Section 5 for complete service definitions.

## Appendix B: Layer Composition Reference

See Section 7 for layer factory implementations.

## Appendix C: Error Type Reference

See Section 6 for error hierarchy and definitions.

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-28 | Engineering | Initial draft |

---

**Next Steps**

1. Review RFC with team
2. Prototype Phase 1 (@tevm/errors-effect, @tevm/interop)
3. Benchmark current performance baselines
4. Begin Wave 1 migration
