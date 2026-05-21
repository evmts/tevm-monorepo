# ZEVM, Guillotine Mini, and Voltaire Feature Gaps in Tevm

Date: 2026-05-20

## Scope

This report compares the current Tevm worktree against the local sibling checkouts of `zevm`, `guillotine-mini`, and `voltaire`, with public docs checked against the upstream GitHub/docs pages.

Status terms:

- Missing: no current Tevm runtime handler, package export, or first-class API found.
- Alias-only: Tevm has a differently named Anvil/Hardhat/Ganache/EVM/Tevm method, but not ZEVM's canonical method name.
- Partial: Tevm has lower-level types or related behavior, but not the full feature contract.
- Needs verification: Tevm likely has some backing support through ZEVM utilities, but no Tevm-facing contract or tests matching the compared project were found.

Primary Tevm runtime authority:

- `packages/actions/src/createHandlers.js`
- `packages/actions/src/requestProcedure.js`
- `packages/server/src/createHttpHandler.js`
- `packages/blockchain/src/utils/CUSTOM_Tx_TYPES.js`
- `packages/effect/src/index.js`
- `packages/utils/src/index.ts`
- `tevm/package.json`

External source anchors:

- https://github.com/evmts/zevm
- https://zevm.sh/docs
- https://github.com/evmts/zevm/blob/main/docs/specs/prd.md
- https://github.com/evmts/zevm/blob/main/docs/specs/json-rpc-contract.md
- https://github.com/evmts/guillotine-mini
- https://github.com/evmts/voltaire
- https://voltaire.tevm.sh

## High-Level Findings

Tevm has integrated many ZEVM npm subpackages as implementation building blocks, but it does not expose the ZEVM client product contract. Most notably, Tevm does not have ZEVM's two runtime modes, light-client proof-backed read mode, canonical `zevm_*` RPC namespace, Engine API listener, txpool RPC methods, strict HTTP JSON-RPC transport contract, startup/configuration contract, or release/provenance artifacts.

For ZEVM RPC specifically, the local ZEVM JSON-RPC contract currently names 135 in-contract methods. Tevm's `createHandlers` registers exact runtime handlers for 42 of those names. 93 exact ZEVM method names are missing. If Tevm's generated `tevm_*`, `anvil_*`, `hardhat_*`, `ganache_*`, and `evm_*` aliases are treated as equivalent for `zevm_*` controls, 52 ZEVM methods still have no Tevm runtime equivalent.

Guillotine Mini overlaps with Tevm at the EVM execution layer, but its unsupported features in Tevm are mostly packaging, execution-engine, conformance, and diagnostics features: native Zig/WASM engine usage, C ABI/FFI execution API, async yield/resume storage injection, EIP-3155 trace capture/comparison, ethereum/tests and execution-specs based target matrix, and explicit Frontier-through-Osaka spec targets.

Voltaire is broader than Tevm's current utility surface. Tevm reexports useful viem/ZEVM utilities, but it does not provide Voltaire's cross-language primitive library, native/WASM acceleration package, C API, Effect service stack, first-class branded primitive modules, broad crypto suite, stream/provider service ecosystem, bytecode/fork-backend primitives, or standalone standard helpers.

## ZEVM Gaps

### Runtime And Product Model

Missing:

- One `zevm` Zig binary as a client product.
- Trusted mode as a named runtime mode with ZEVM's startup/config contract.
- Light mode as a read-only, proof-backed, consensus-anchored runtime.
- Forking as trusted-mode configuration rather than Tevm's in-memory fork option only.
- Mode gating with ZEVM-specific error codes `-32010`, `-32011`, `-32014`, and `-32015`.
- `zevm_lightSyncStatus` and light-mode readiness/head-coherence state.
- Light-mode selector semantics:
  - `latest` as verified optimistic execution head.
  - `safe` as consensus-backed safe execution head.
  - `finalized` as consensus-finalized execution head.
  - retained numeric history window of 8191 verified execution blocks.
  - `pending` rejected with `-32010` instead of aliased.
- Proof-backed reads for only `eth_getBalance`, `eth_getCode`, `eth_getStorageAt`, and `eth_getTransactionCount`.
- Startup checkpoint selection and provenance:
  - explicit checkpoint.
  - persisted checkpoint file.
  - baked default checkpoint.
  - checkpoint age validation.
  - `strictCheckpointAge`.
  - startup-only checkpoint file semantics.
- Light-mode unsupported method behavior for trusted-only methods.

### Startup, Configuration, And Release Provenance

Missing:

- ZEVM CLI/config contract for trusted and light mode.
- Source-build contract around a single Zig binary.
- Dependency pin tuple: `(zevmGitRevision, voltaireGitRevision, guillotineMiniGitRevision, zigVersion)`.
- `zig build release-binaries`, `zig build c-ffi`, and `zig build npm-platform-artifacts` release artifact flow as a Tevm-facing feature.
- Release metadata assets:
  - `release-tuple.json`.
  - `light-default-checkpoints.json`.
  - correction-release supersession notes.
  - metadata-backed published-release provenance.
  - operator-recorded unreleased-commit provenance.
- Runtime configuration parity for:
  - mode selection.
  - chain ID.
  - hardfork policy.
  - trusted node mining mode.
  - managed dev accounts.
  - fork URL/block.
  - light-mode network, consensus RPC, execution RPC, checkpoint, checkpoint dir, checkpoint age, strict age policy.

### HTTP JSON-RPC Transport Contract

Tevm has `@tevm/server`, but it does not match ZEVM's transport contract.

Missing or partial:

- Endpoint path `/` only.
- `POST` only.
- Non-`/` path -> HTTP 404 with no JSON-RPC body.
- Non-POST `/` -> HTTP 405 with no JSON-RPC body.
- Required `application/json` content type with HTTP 415 for missing/unsupported content type.
- Notification-only requests/batches -> HTTP 204 and empty body.
- Request body limit of 8,388,608 bytes.
- Header buffer limit of 8,192 bytes.
- 64 active TCP connection cap.
- 15 second read/write socket timeouts.
- Serialized handler dispatch inside the process so parallel HTTP connections cannot race runtime state.
- ZEVM-owned transport/parser stack as the canonical production path.

### Exact ZEVM Runtime Method Surface

Exact ZEVM contract methods Tevm already registers by name:

```text
debug_getRawBlock
debug_getRawHeader
debug_getRawReceipts
debug_getRawTransaction
eth_accounts
eth_blobBaseFee
eth_blockNumber
eth_call
eth_chainId
eth_coinbase
eth_createAccessList
eth_estimateGas
eth_feeHistory
eth_gasPrice
eth_getBalance
eth_getBlockByHash
eth_getBlockByNumber
eth_getBlockReceipts
eth_getBlockTransactionCountByHash
eth_getBlockTransactionCountByNumber
eth_getCode
eth_getFilterChanges
eth_getFilterLogs
eth_getLogs
eth_getProof
eth_getStorageAt
eth_getTransactionByBlockHashAndIndex
eth_getTransactionByBlockNumberAndIndex
eth_getTransactionByHash
eth_getTransactionCount
eth_getTransactionReceipt
eth_maxPriorityFeePerGas
eth_mining
eth_newBlockFilter
eth_newFilter
eth_newPendingTransactionFilter
eth_protocolVersion
eth_sendRawTransaction
eth_sendTransaction
eth_simulateV1
eth_syncing
eth_uninstallFilter
```

Exact ZEVM contract methods missing in Tevm, with no equivalent handler found:

| Group | Missing methods |
| --- | --- |
| RPC namespace discovery | `rpc_modules` |
| Engine API | `engine_exchangeCapabilities`, `engine_exchangeTransitionConfigurationV1`, `engine_getClientVersionV1`, `engine_forkchoiceUpdatedV1`, `engine_forkchoiceUpdatedV2`, `engine_forkchoiceUpdatedV3`, `engine_forkchoiceUpdatedV4`, `engine_newPayloadV1`, `engine_newPayloadV2`, `engine_newPayloadV3`, `engine_newPayloadV4`, `engine_newPayloadV5`, `engine_getPayloadV1`, `engine_getPayloadV2`, `engine_getPayloadV3`, `engine_getPayloadV4`, `engine_getPayloadV5`, `engine_getPayloadV6`, `engine_getPayloadBodiesByHashV1`, `engine_getPayloadBodiesByHashV2`, `engine_getPayloadBodiesByRangeV1`, `engine_getPayloadBodiesByRangeV2`, `engine_getBlobsV1`, `engine_getBlobsV2`, `engine_getBlobsV3` |
| Block access lists | `eth_getBlockAccessList` |
| Storage batch reads | `eth_getStorageValues` |
| Uncle compatibility | `eth_getUncleByBlockHashAndIndex`, `eth_getUncleByBlockNumberAndIndex`, `eth_getUncleCountByBlockHash`, `eth_getUncleCountByBlockNumber` |
| PoW compatibility | `eth_getWork`, `eth_hashrate`, `eth_submitHashrate`, `eth_submitWork` |
| Signing RPC | `eth_sign`, `eth_signTransaction` |
| Network and web3 compatibility | `net_listening`, `net_peerCount`, `net_version`, `web3_clientVersion`, `web3_sha3` |
| Txpool RPC | `txpool_content`, `txpool_contentFrom`, `txpool_inspect`, `txpool_status` |
| Debug/raw compatibility | `debug_getBadBlocks` |
| Builder/testing RPC | `testing_buildBlockV1` |
| Light mode | `zevm_lightSyncStatus` |
| ZEVM dev controls with no handler equivalent | `zevm_addCompilationResult`, `zevm_setPrevRandao` |

Note: `eth_sign` and `eth_signTransaction` have Tevm type/doc traces, but they are not registered in `createHandlers.js`, so they are missing from the current runtime request path.

### Canonical `zevm_*` Namespace

Tevm does not register the canonical ZEVM `zevm_*` method names. It does generate many `tevm_*` aliases from its Anvil handlers, and it separately exposes some `tevm_*` methods, but exact ZEVM namespace compatibility is missing.

Alias-only or partial canonical ZEVM controls:

```text
zevm_getAccount
zevm_setAccount
zevm_dumpState
zevm_loadState
zevm_setBalance
zevm_addBalance
zevm_setCode
zevm_setNonce
zevm_setStorageAt
zevm_setChainId
zevm_getAutomine
zevm_setAutomine
zevm_getIntervalMining
zevm_setIntervalMining
zevm_mine
zevm_mineDetailed
zevm_dropTransaction
zevm_dropAllTransactions
zevm_removePoolTransactions
zevm_snapshot
zevm_revert
zevm_impersonateAccount
zevm_stopImpersonatingAccount
zevm_autoImpersonateAccount
zevm_increaseTime
zevm_setNextBlockTimestamp
zevm_setTime
zevm_setBlockTimestampInterval
zevm_removeBlockTimestampInterval
zevm_reset
zevm_setRpcUrl
zevm_setCoinbase
zevm_setBlockGasLimit
zevm_setNextBlockBaseFeePerGas
zevm_setMinGasPrice
zevm_deal
zevm_dealErc20
zevm_setErc20Allowance
zevm_enableTraces
zevm_metadata
zevm_nodeInfo
```

Semantic gaps inside alias-only controls:

- `zevm_setChainId`: Tevm's `anvil_setChainId` handler validates the input, then returns `MethodNotSupportedError`; ZEVM expects success and a mutable chain ID.
- `zevm_snapshot` and `zevm_revert`: ZEVM captures and restores local chain/state/journal, receipt/log indexes, pending tx pool, mining/block-environment overrides, impersonation, and time controls. Tevm's `evm_snapshot` path captures a state root and dumped state, so the ZEVM boundary is broader.
- `zevm_reset`: ZEVM defines exact fork config forms, snapshot invalidation, pool clearing, impersonation clearing, and fork replacement semantics. Tevm has an Anvil-style reset but not the ZEVM contract.
- `zevm_setRpcUrl`: ZEVM requires active fork backing and updates fork upstream URL without local reset or snapshot invalidation. Tevm has an Anvil-style handler, but exact ZEVM behavior is not exposed under the canonical method.
- `zevm_dumpState` and `zevm_loadState`: ZEVM specifies a stable versioned UTF-8 JSON state blob encoded as `HexData`. Tevm has dump/load handlers, but exact blob compatibility should be treated as unverified.
- Mining and time controls: Tevm has many Anvil-style controls, but ZEVM's exact mining mode, timestamp precedence, interval timer ownership, and explicit multi-block mining semantics are not declared as Tevm contract behavior.

### Transaction And Query Semantics

Partial or missing relative to ZEVM:

- `rpc_modules` namespace discovery.
- ZEVM's exact `TransactionRequest` validation surface for simulation versus submission/signing.
- ZEVM's phase-1 submission rule: legacy-only transaction envelopes for `eth_sendTransaction`, `eth_sendRawTransaction`, and `eth_signTransaction`.
- Unmanaged impersonated `eth_sendTransaction` with explicit sender metadata preserved through txpool, mined tx, block hydration, and receipt responses.
- ZEVM's exact `eth_feeHistory` validation, truncation, and reward-shape behavior.
- `eth_getStorageValues` batch storage reads.
- `eth_getBlockAccessList`.
- `testing_buildBlockV1` builder payload envelope.
- `eth_sign` and `eth_signTransaction` runtime registration.
- PoW compatibility helpers returning ZEVM's specified no-op values.
- Geth-style txpool content/status/inspect runtime methods.
- Network/web3 compatibility methods.
- `debug_getBadBlocks`.

### Engine API Listener

Missing:

- Separate trusted-mode Engine API listener enabled by `engineRpc` or `--engine-host` / `--engine-port`.
- Capability exchange.
- Transition configuration exchange.
- Client version identity.
- Forkchoice update V1 through V4.
- Payload import V1 through V5.
- Payload building/retrieval V1 through V6.
- Payload bodies by hash/range V1/V2.
- Blob retrieval V1 through V3.
- Engine-specific payload status handling such as `VALID`, `SYNCING`, `INVALID`, and `INVALID_BLOCK_HASH`.
- Payload ID lifecycle tied to reset/process lifetime.

### Unsupported And Deferred Surface Differences

ZEVM's phase-1 contract explicitly leaves debug tracing methods, subscriptions, and WebSocket transport out of contract. Tevm does expose `debug_trace*` handlers and `eth_subscribe`/`eth_unsubscribe` handlers, but those are not ZEVM parity features. If Tevm wants ZEVM-compatible behavior, it also needs a mode/profile that returns ZEVM's specified `-32601` for deferred/out-of-contract method names.

## Guillotine Mini Gaps

### Native Execution Engine

Missing:

- First-class native Zig EVM backend selectable from Tevm.
- First-class WebAssembly EVM backend built from Guillotine Mini.
- C ABI/FFI execution API surfaced through Tevm packages.
- Direct FFI lifecycle and execution calls such as:
  - `evm_create`
  - `evm_destroy`
  - `evm_set_bytecode`
  - `evm_set_execution_context`
  - `evm_set_blockchain_context`
  - `evm_execute`
  - `evm_call_ffi`
  - `evm_continue_ffi`
  - gas/output/log/storage-change getters.
- Native transaction-scoped arena allocation model as a Tevm engine contract.

### Async Execution And Storage Injection

Missing:

- Guillotine Mini's async yield/resume protocol for external state fetching.
- Storage injector support that lets execution pause, request account/storage/code data, and continue with host-provided responses.
- TypeScript/WASM examples and API surface for async execution against external state.

### EIP-3155 Tracing And Debugging

Missing:

- EIP-3155 trace generation as a Tevm-facing trace format.
- Trace capture/comparison workflow against reference implementations.
- `zig build test-trace` style trace test target.
- Isolation helpers that identify trace divergence by program counter, opcode, gas, stack, memory, and storage changes.

Tevm has `debug_trace*` procedures, but no EIP-3155 trace contract or Guillotine-style conformance comparison harness was found.

### Spec Conformance Harness

Missing:

- `zig build specs` style ethereum/tests GeneralStateTests runner.
- Generated hardfork/EIP/opcode filtered target matrix.
- Optional Engine-format tests gated by `INCLUDE_ENGINE_TESTS=1`.
- Direct use of `execution-specs` Python references as the debugging authority.
- The seven-checkpoint spec-fixer workflow in `scripts/fix-specs.ts`.
- Reports and known-issues database around spec-fix debugging.

Specific Guillotine Mini target families Tevm does not currently mirror:

- Frontier granular targets: precompiles, identity, create, call, calldata, dup, push, stack, opcodes.
- Berlin targets: access lists and intrinsic gas costs.
- Shanghai targets: PUSH0, warm coinbase, initcode, withdrawals.
- Cancun targets: transient storage, MCOPY, SELFDESTRUCT, blob base fee, blob precompile, blob opcodes, blob transaction cases.
- Prague targets: calldata-cost variants, BLS G1/G2/pairing/map/misc, set-code calls/gas/txs/advanced.
- Osaka targets: ModExp variable gas, EIP vectors, legacy vectors, misc, and other cases.

### Hardfork And EIP Execution Coverage

Partial or needs verification:

- Tevm's types and ZEVM-derived utilities include many modern hardfork capabilities, but Tevm does not publish a Guillotine Mini equivalent "Full hardfork support Frontier -> Osaka" execution test contract.
- Tevm has EIP-7702 utilities and transaction types, but `packages/blockchain/src/utils/CUSTOM_Tx_TYPES.js` explicitly comments `0x4` as "EIP-7702 EOA Code tx (not yet supported)" for custom transaction type handling.
- Full Prague EIP-7702 set-code transaction execution, delegated-code handling, and fork/block ingestion parity should be treated as partial.
- Prague BLS12-381 and EIP-2537 behavior may be available through the underlying EVM stack, but Tevm does not expose Guillotine Mini's explicit BLS spec target matrix as a Tevm conformance feature.
- Osaka ModExp variable-gas behavior is not surfaced as a Tevm-supported hardfork/conformance claim.

### Bytecode And Precompile Tooling

Missing as first-class Tevm features:

- Guillotine Mini bytecode analysis with prevalidated jump destinations.
- Bytecode traversal helpers and immediate-data reading as engine-level exposed utilities.
- Custom precompile override configuration in the native engine.
- WASM examples for tracing and custom precompiles.

### Execution-Client Building Blocks

Missing or not Tevm-facing:

- `client-ts` building blocks from the Guillotine Mini repo:
  - blockchain block tree/store/header validation.
  - DB abstractions.
  - Engine capability/client-version services.
  - txpool sorter/admission validator.
  - sync request planning and peer limits.
  - trie/node loader/storage.
  - RLPx/devp2p helper modules.

Some of these overlap with Tevm packages conceptually, but Tevm does not expose the Guillotine Mini client-ts architecture or Engine API path as its runtime contract.

## Voltaire Gaps

### Cross-Language Primitive Library

Missing:

- Voltaire's multi-platform primitive stack as a Tevm deliverable:
  - Zig.
  - TypeScript TS/WASM.
  - Native Bun FFI.
  - C ABI.
  - Python beta.
  - Rust beta.
  - Go beta.
  - Swift beta.
  - Kotlin planned surface.
- `@tevm/voltaire/native`, `@tevm/voltaire/wasm`, `@tevm/zig`, and C header style APIs as Tevm package exports.
- Consistent primitive API across TypeScript, Zig, and C-FFI environments.

### Native, WASM, And C ABI Acceleration

Missing:

- Bun native FFI loader for primitives.
- WASM primitive modules as a Tevm utility backend.
- C ABI for primitive operations.
- Native C APIs for:
  - address parsing/checksum/create/create2.
  - hash and hex conversion.
  - secp256k1 recovery/sign/verify/public-key derivation.
  - signature parsing/serialization/normalization.
  - RLP.
  - ABI encode/decode/selector computation.
  - EIP-4844 blob/KZG operations.
  - bytecode jumpdest/validation/fusion detection.
  - EIP-7702 authorization.
  - event log filter matching.
  - Ed25519, P256, X25519.
  - AES-GCM.
  - HD wallet derivation.
  - state manager and blockchain fork caches.

Tevm has JS/TS utilities and some ZEVM reexports, but not this native/WASM/C ABI surface.

### Branded Primitive Modules

Missing as first-class Tevm modules:

- Voltaire's runtime-validated branded primitive modules and uppercase subpath exports:
  - `./Abi`
  - `./AccessList`
  - `./Address`
  - `./Authorization`
  - `./Base64`
  - `./BinaryTree`
  - `./Blob`
  - `./BloomFilter`
  - `./Bytecode`
  - `./Bytes`
  - `./Chain`
  - `./ContractCode`
  - `./Denomination`
  - `./Ens`
  - `./EventLog`
  - `./FeeMarket`
  - `./GasConstants`
  - `./Hardfork`
  - `./Hash`
  - `./Hex`
  - `./InitCode`
  - `./LogFilter`
  - `./Opcode`
  - `./PrivateKey`
  - `./PublicKey`
  - `./Signature`
  - `./Siwe`
  - `./State`
  - `./Transaction`
  - `./Trie`
  - `./Uint`
- Type-safe denominations such as Wei/Gwei/Ether as branded values rather than generic bigint/string helpers.
- Fixed-size byte brands as standalone modules.
- Brand-preserving functional API under `./functional` and `./Address/functional`.

Tevm has lower-case packages such as `tevm/address`, `tevm/utils`, `tevm/tx`, and `tevm/trie`, but not Voltaire's branded primitive package contract.

### Crypto Suite

Missing or partial as Tevm-first APIs:

- `AesGcm`.
- `Bip39`.
- `Blake2`.
- `Bls12381`.
- `BN254`.
- `ChaCha20Poly1305`.
- `Ed25519`.
- `EIP712`.
- `HDWallet`.
- `HMAC`.
- `Keccak256/native`.
- `Keccak256/wasm`.
- `Keystore`.
- `KZG`.
- `ModExp`.
- `P256`.
- `Ripemd160`.
- `Secp256k1`.
- `SHA256`.
- `X25519`.
- `signers`.

Partial overlap exists in `@tevm/utils` through viem and ZEVM helpers for keccak, RLP, ABI encode/decode, message signing, mnemonic-to-account, and EIP-7702 authorization helpers. That is not the same as Voltaire's broad crypto module set, native/WASM acceleration, typed error model, or C ABI.

### Effect.ts Application Layer

Tevm's `@tevm/effect` currently exports small filesystem/module-resolution helpers. It does not match `voltaire-effect`.

Missing:

- Effect services and layers:
  - `ProviderService`.
  - `RawProviderService`.
  - `TransportService`.
  - `DebugService`.
  - `EngineApiService`.
  - `SignerService`.
  - `AccountService`.
  - `Contract`.
  - `EnsService`.
  - `FeeEstimatorService`.
  - `FormatterService`.
  - `KzgService`.
  - `Multicall`.
  - `NonceManagerService`.
  - `RateLimiterService`.
  - `RpcBatchService`.
  - `TransactionSerializerService`.
  - `BlockExplorerApiService`.
  - `CcipService`.
  - `CacheService`.
  - `BlockchainService`.
- Effect transports:
  - `HttpTransport`.
  - `WebSocketTransport`.
  - `BrowserTransport`.
  - `CustomTransport`.
  - `TestTransport`.
  - `RateLimitedTransport`.
  - timeout/retry/tracing/cache references and wrappers.
- Provider factories:
  - `HttpProvider`.
  - `WebSocketProvider`.
  - `BrowserProvider`.
  - `IpcProvider`.
  - `TestProvider`.
- Layer presets:
  - `MainnetProvider`.
  - `MainnetFullProvider`.
  - `BaseProvider`.
  - `OptimismProvider`.
  - `ArbitrumProvider`.
  - `PolygonProvider`.
  - `SepoliaProvider`.
- Typed error unions and `catchTag`-friendly errors for provider, transport, signer, contract, crypto, block explorer, rate-limit, nonce, fee-estimation, and formatting operations.
- Test layers for crypto, transport, signer, and provider services.

### Provider, Contract, And Stream Features

Missing as Voltaire-style APIs:

- Type-safe `makeContractRegistry`.
- Contract read/write/simulate/event abstraction with Effect dependency injection.
- Multicall3 `aggregate3` and batch balance resolver.
- ENS resolution service.
- CCIP Read service.
- Block explorer ABI/source/proxy resolution service.
- Block streaming with reorg handling.
- Transaction streaming:
  - pending transaction watch.
  - confirmed transaction watch.
  - transaction tracking.
- Contract event streaming:
  - backfill.
  - live watch.
  - Effect stream integration.
- RPC batching resolver and request grouping.
- Nonce manager service.
- L2-aware formatters and provider presets.

Tevm has memory clients, viem extensions, and contract helpers, but not this Voltaire Effect service graph.

### JSON-RPC Schema And Compatibility Library

Missing or partial:

- Standalone JSON-RPC schema modules for:
  - `eth`.
  - `anvil`.
  - `hardhat`.
  - `wallet`.
  - `net`.
  - `web3`.
  - `txpool`.
  - `debug`.
  - `engine`.
- Voltaire's JSON-RPC request/response/error/id/batch primitive package.
- Engine API service integration.

Tevm has action request/response types and handlers for many methods, but missing runtime methods overlap heavily with Voltaire/ZEVM's JSON-RPC schemas: Engine API, txpool, `net_*`, `web3_*`, `rpc_modules`, and several standard compatibility helpers.

### Wallet, Auth, Standards, And Account Features

Missing or partial:

- Local account and JSON-RPC browser account services as Effect layers.
- Mnemonic account factory.
- Voltaire native signers.
- EIP-712 service.
- SIWE helpers as first-class primitives.
- ERC-6492 signature wrapping/unwrapping/verification.
- ERC-20, ERC-721, ERC-1155, and ERC-165 standalone standards helpers.
- Hardware wallet directories and wallet package surfaces.

Tevm can call contracts and reexports some viem account/signature utilities, but not Voltaire's wallet/auth/standards package structure.

### State Manager, Fork Backend, Blockchain, And Bytecode

Missing:

- Voltaire C ABI state manager:
  - create/destroy.
  - fork backend create/destroy.
  - next request/continue request.
  - balance/nonce/storage/code sync getters.
  - setters.
  - checkpoint/revert/commit.
  - snapshots.
  - cache clearing.
- Voltaire fork backend cache model:
  - transport vtable abstraction.
  - account/storage/code LRU caches.
  - configurable eviction policy.
  - async host-driven RPC request continuation.
- Voltaire blockchain C API:
  - canonical chain length.
  - orphan count.
  - head block number.
  - fork block detection.
  - block by number/hash.
  - canonical hash.
  - put block.
  - set canonical head.
- Bytecode analysis/fusion APIs:
  - analyze jump destinations.
  - validate jump boundaries.
  - scan instructions.
  - detect fusions.

Tevm has `@tevm/state`, `@tevm/blockchain`, `@tevm/trie`, and fork support, but not this native/C ABI and vtable-driven fork backend surface.

## Priority Recommendation

For ZEVM parity, implement in this order:

1. Add a ZEVM compatibility profile and register exact canonical `zevm_*`, `rpc_modules`, `net_*`, `web3_*`, `txpool_*`, signing, PoW no-op, uncle, and missing debug compatibility methods.
2. Add or explicitly scope out semantic parity for ZEVM dev controls, especially `setChainId`, snapshot/revert boundary, reset, setRpcUrl, state blob format, mining/time controls, and impersonation sender metadata.
3. Add Engine API listener methods and `testing_buildBlockV1`.
4. Add light-mode runtime as a separate Tevm/ZEVM client mode, including `zevm_lightSyncStatus`, proof-backed read gating, selector semantics, checkpoint startup/config, and error codes.
5. Align `@tevm/server` with ZEVM's HTTP JSON-RPC transport contract or introduce a ZEVM-compatible server entrypoint.

For Guillotine Mini parity, the highest-value gap is a selectable native/WASM Guillotine execution backend plus its conformance and EIP-3155 trace harness.

For Voltaire parity, the highest-value gap is not to fold all primitives into Tevm immediately. It is to decide whether Tevm should depend on and reexport `@tevm/voltaire`/`voltaire-effect` as first-class Tevm surfaces, or keep them separate and only use selected native/WASM primitives internally.
