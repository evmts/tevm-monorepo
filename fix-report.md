# Tevm Monorepo Fix Report

Generated 2026-05-20 20:03:21 EDT after running 16-at-a-time parallel codex fix agents across all 32 review slices, with auto-repair passes for typecheck regressions.

## Headline numbers

- **Findings fixed:** 186 (across 32 slices)
- **Findings deferred:** 26 (false-positives, too-risky, out-of-scope)
- **Total commits:** 49 (32 slice commits + 17 repair commits + 1 review-prep)
- **Files changed:** 343
- **Post-fix typecheck:** `pnpm nx run-many --target=typecheck` exits 0

## Slice-by-slice

| ID | Type | Slice | Commit | Fixed | Deferred |
|----|------|-------|--------|-------|----------|
| H01 | horizontal | EVM core opcodes & execution | `f718654c5` | 5 | 0 |
| H02 | horizontal | VM runner (block/tx execution) | `0518e1e4f` | 7 | 0 |
| H03 | horizontal | State manager | `3173262fd` | 7 | 0 |
| H04 | horizontal | Blockchain + receipts + persistence | `8967f253d` | 7 | 0 |
| H05 | horizontal | Block, Tx, TxPool | `9598f4860` | 6 | 0 |
| H06 | horizontal | Trie, RLP, utils, address | `efa4ee161` | 5 | 0 |
| H07 | horizontal | Errors, logger, common, consensus, effect | `2f762862e` | 6 | 1 |
| H08 | horizontal | JSON-RPC transport (jsonrpc + http-client + server) | `c18a7e69a` | 7 | 0 |
| H09 | horizontal | Actions (handlers backing every method) | `b89e0f6d5` | 9 | 0 |
| H10 | horizontal | Procedures, decorators, memory-client, node, client-types | `63e04a9fa` | 6 | 0 |
| H11 | horizontal | Contract, predeploys, precompiles | `225e00e11` | 6 | 0 |
| H12 | horizontal | Bundler core | `e49880753` | 9 | 0 |
| H13 | horizontal | Bundler plugins (esbuild/vite/webpack/rollup/etc.) | `d982062bc` | 7 | 0 |
| H14 | horizontal | Rust bundler components | `d8a52666e` | 9 | 0 |
| H15 | horizontal | Extensions + LSP + CLI | `920c7dcc6` | 8 | 0 |
| H16 | horizontal | Top-level tevm package + test infra | `43a5498af` | 6 | 0 |
| V01 | vertical | Forking & state proxying end-to-end | `de2502bac` | 6 | 0 |
| V02 | vertical | JSON-RPC eth_* method surface | `007bc040e` | 7 | 2 |
| V03 | vertical | JSON-RPC anvil_* method surface | `1e91d5f1a` | 5 | 2 |
| V04 | vertical | JSON-RPC debug_* and tevm_* methods | `160a995ee` | 4 | 3 |
| V05 | vertical | Solidity bundler pipeline (resolve→compile→codegen) | `54de2df16` | 3 | 3 |
| V06 | vertical | Bundler caching strategy | `98fd6299b` | 4 | 1 |
| V07 | vertical | Hardfork readiness, gates, transitions | `7efd45b77` | 4 | 1 |
| V08 | vertical | EIP-7702 (delegated authorization) e2e | `9c356c0c3` | 3 | 2 |
| V09 | vertical | EIP-3155 trace comparison tooling | `913f9ae97` | 5 | 0 |
| V10 | vertical | TypeScript LSP / Solidity type inference | `af1738220` | 4 | 2 |
| V11 | vertical | Test infrastructure (matchers, conformance, hive) | `aea6d19be` | 5 | 1 |
| V12 | vertical | Memory client public API | `f4f4acd27` | 3 | 3 |
| V13 | vertical | Predeploys & precompiles correctness | `7d765205a` | 5 | 3 |
| V14 | vertical | Viem extension integration | `685264310` | 6 | 1 |
| V15 | vertical | Ethers compatibility shim | `9cdbb329d` | 6 | 0 |
| V16 | vertical | CLI commands & UX | `64da235f2` | 6 | 1 |

## Repair pass log

Each fix wave introduced TypeScript regressions in downstream packages that the typecheck unmasked incrementally (nx fails fast). Wave 1 required 11 repair rounds; wave 2 required 6. All commits are atomic and emoji-conventional.

- 49f0f61d1 🐛 fix(repair): widen tevm_call rpcParams array to any[] for blockOverrideSet push
- a426db4c6 🐛 fix(repair): correctly cast createMemoryClient to CreateMemoryClientFn
- e433909ae 🐛 fix(repair): resolve memory-client typecheck — exactOptionalPropertyTypes + viem extend cast
- 77b207c4f 🐛 fix(repair): resolve actions+node typecheck regressions from wave 2
- 4016c11a1 🐛 fix(repair): narrow fileAccessObject stat/statSync return types in ts-plugin
- 3ca5873b7 🐛 fix(repair): guard solc input source content access in @tevm/bundler-cache
- cd8f3383d 🐛 fix(repair): remove duplicate createJsonRpcFetcher export in tevm barrel
- c83e83abd 🐛 fix(repair): break HttpClient circular type alias
- 8538dbe87 🐛 fix(repair): align tevm_getAccount viem extension request shape
- 7f0f1614a 🐛 fix(repair): add missing JSDoc option types in @tevm/server
- eab1c4352 🐛 fix(repair): resolve @tevm/memory-client TevmNodeOptions exactOptionalPropertyTypes error
- ab0f9c35a 🐛 fix(repair): resolve @tevm/actions + @tevm/node typecheck regressions (71 errors)
- 8f122fa6c 🐛 fix(repair): resolve @tevm/evm + @tevm/txpool typecheck regressions
- d3a5863b0 🐛 fix(repair): resolve @tevm/blockchain + @tevm/precompiles typecheck regressions
- cc126766e 🐛 fix(repair): resolve @tevm/base-bundler typecheck regressions
- d4de49e74 🐛 fix(repair): resolve remaining typecheck regressions from fix wave 1
- d51ffc175 🐛 fix(repair): resolve typecheck regressions from fix wave 1

## Critical findings status

All four CRITICAL findings from the review were verified real and fixed:

1. **EIP-2935 history state non-mainnet constants + invalid fork backfill** (`packages/vm/src/actions/accumulateParentBlockHash.ts`) — fixed in H02
2. **Header integer serialization drops first two data bytes** (`packages/block/src/header.ts`) — fixed in H05
3. **EIP-7685 requests use trie root instead of requests hash** (`packages/block/src/block.ts`) — fixed in H05
4. **Foundry config loader executes config-controlled shell text** (`bundler-packages/config/src/foundry/loadFoundryConfig.js`) — fixed in H12

## Per-slice fix reports (appendix)

### Wave 1 — horizontal slices

<details>
<summary><strong>H01 — EVM core opcodes & execution</strong></summary>

# EVM core opcodes & execution fix report

**Slice:** H01
**Type:** horizontal
**Scope:** packages/evm

## Summary

All five findings were verified against the current code and addressed with scoped changes under `packages/evm`. The fixes normalize custom precompile arrays at construction, avoid mutating shared private arrays, route trace logging through a real step-event sink, and correct the public option docs. No findings were deferred.

## Fixes applied

### [HIGH] Custom precompile state is shared and mutated across EVM instances
**Location:** packages/evm/src/createEvm.js:66
**Files modified:** packages/evm/src/createEvm.js, packages/evm/src/Evm.js, packages/evm/src/createEvm.spec.ts
**Issue:** Caller-provided custom precompile arrays could be retained and mutated by EVM instances.
**Fix:** Clone `customPrecompiles` before passing them to EthereumJS and replace `_customPrecompiles` arrays immutably in add/remove.

### [MEDIUM] Exported `Evm.create()` creates instances whose Tevm methods immediately fail
**Location:** packages/evm/src/Evm.js:74
**Files modified:** packages/evm/src/Evm.js, packages/evm/src/createEvm.spec.ts
**Issue:** `Evm.create()` could leave `_customPrecompiles` undefined while exposing Tevm custom-precompile mutators.
**Fix:** Normalize `Evm.create()` options so every created instance receives a cloned `customPrecompiles` array.

### [MEDIUM] `loggingLevel: 'trace'` enables EthereumJS debug overhead without wiring logs to Tevm
**Location:** packages/evm/src/createEvm.js:71
**Files modified:** packages/evm/src/createEvm.js, packages/evm/src/createEvm.spec.ts
**Issue:** Trace mode set EthereumJS `DEBUG` and `_debug`, but the logs were not routed to Tevm's logger.
**Fix:** Attach a `step` event listener in trace mode and emit compact opcode/gas records through `logger.trace` without setting EthereumJS `DEBUG`.

### [LOW] Custom precompile docs say dynamic installation is impossible, but the runtime exposes it
**Location:** packages/evm/src/CreateEvmOptions.ts:64
**Files modified:** packages/evm/src/CreateEvmOptions.ts
**Issue:** The custom precompile option docs claimed precompiles could only be added at VM creation.
**Fix:** Updated the docs to state precompiles can be added at creation or later through `addCustomPrecompile`.

### [LOW] Custom predeploy docs show a shape that `createEvm` cannot consume
**Location:** packages/evm/src/CreateEvmOptions.ts:105
**Files modified:** packages/evm/src/CreateEvmOptions.ts
**Issue:** The custom predeploy example used top-level contract fields instead of the `Predeploy` shape consumed by `createEvm`.
**Fix:** Updated the example to pass a `definePredeploy(MyContract.withAddress(...))` entry.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H02 — VM runner (block/tx execution)</strong></summary>

# VM runner (block/tx execution) fix report

**Slice:** H02
**Type:** horizontal
**Scope:** packages/vm

## Summary

All seven reviewed findings were verified as real and addressed with narrow changes inside `packages/vm`. The fixes keep block execution state changes within one checkpoint, restore temporary state-root and hardfork changes on failure, and align builder behavior with runner/consensus expectations. No findings were deferred or skipped.

## Fixes applied

### [CRITICAL] EIP-2935 history state is written with non-mainnet constants and an invalid fork backfill
**Location:** packages/vm/src/actions/accumulateParentBlockHash.ts:19
**Files modified:** packages/vm/src/actions/accumulateParentBlockHash.ts
**Issue:** The helper wrote EIP-2935 history to the wrong address/window and backfilled pre-fork ancestors.
**Fix:** Switched to canonical mainnet defaults with Common-param lookup where available, used an 8191-slot ring, and removed fork-block ancestor backfill.

### [HIGH] `runBlock` exposes `setHardfork` but never applies it to the VM/EVM execution context
**Location:** packages/vm/src/actions/runBlock.ts:25
**Files modified:** packages/vm/src/actions/runBlock.ts
**Issue:** `setHardfork` was documented but ignored, so execution used the VM's existing hardfork.
**Fix:** Added temporary hardfork selection by block number/timestamp, aligned VM/EVM/block Common instances for execution, and restored prior hardforks in `finally`.

### [HIGH] Failed `runBlock({ root })` calls leave the VM on the requested root
**Location:** packages/vm/src/actions/runBlock.ts:39
**Files modified:** packages/vm/src/actions/runBlock.ts
**Issue:** A failing block run after `setStateRoot(root)` left the VM state manager on the requested root.
**Fix:** Captured the previous root before switching and restored it on execution failure after journal revert.

### [HIGH] DAO fork balance moves are committed even when the block fails
**Location:** packages/vm/src/actions/runBlock.ts:49
**Files modified:** packages/vm/src/actions/runBlock.ts
**Issue:** DAO balance transfers were committed before the main block execution checkpoint.
**Fix:** Moved DAO fork application inside the same checkpoint that wraps block execution and validation.

### [HIGH] BlockBuilder caps blob gas at the target instead of the maximum
**Location:** packages/vm/src/actions/BlockBuilder.ts:236
**Files modified:** packages/vm/src/actions/BlockBuilder.ts
**Issue:** The builder rejected blob transactions once cumulative blob gas exceeded the target.
**Fix:** Changed the builder limit check to use `getBlobGasSchedule().maxBlobGasPerBlock`.

### [MEDIUM] Block execution disables tx/block hardfork validation by default
**Location:** packages/vm/src/actions/applyTransactions.ts:45
**Files modified:** packages/vm/src/actions/applyTransactions.ts
**Issue:** `runBlock` transaction application defaulted to skipping hardfork validation.
**Fix:** Changed the default `skipHardForkValidation` value to `false`, matching `runTx`.

### [MEDIUM] Builder and runner disagree on zero-amount withdrawals
**Location:** packages/vm/src/actions/BlockBuilder.ts:202
**Files modified:** packages/vm/src/actions/BlockBuilder.ts
**Issue:** The builder skipped zero-amount withdrawals while the runner still touched those accounts.
**Fix:** Removed the zero-amount skip so builder withdrawal processing mirrors runner touch semantics.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H03 — State manager</strong></summary>

# State manager fix report

**Slice:** H03
**Type:** horizontal
**Scope:** packages/state

## Summary

All seven reviewed findings were verified as real and addressed with scoped changes under `packages/state`. The fixes tighten state consistency around storage cache clearing, account deletion, canonical dumps, forked missing-account detection, root loading, storage-range pagination, and fork proof block pinning. No findings were deferred or treated as false positives.

## Fixes applied

### [HIGH] Original storage cache never clears between executions
**Location:** packages/state/src/actions/originalStorageCache.js:44
**Files modified:** packages/state/src/actions/originalStorageCache.js
**Issue:** `originalStorageCache.clear()` was a no-op, leaving stale first-seen storage values across execution boundaries.
**Fix:** Implemented `clear()` by clearing the closure-scoped storage map.

### [HIGH] Deleting an account leaves old storage readable
**Location:** packages/state/src/actions/deleteAccount.js:7
**Files modified:** packages/state/src/actions/deleteAccount.js, packages/state/src/actions/getContractStorage.js
**Issue:** Account deletion did not clear cached storage, and storage reads checked the cache before account tombstones.
**Fix:** Deletion now clears contract storage and storage reads return empty for account tombstones before checking cached slots.

### [HIGH] Deleted accounts are dumped as live empty accounts
**Location:** packages/state/src/actions/dumpCannonicalGenesis.js:26
**Files modified:** packages/state/src/actions/dumpCannonicalGenesis.js
**Issue:** Canonical dumping converted `undefined` account-cache entries into live empty accounts.
**Fix:** Canonical dumps now skip addresses whose account lookup returns `undefined`.

### [HIGH] Forked missing accounts are cached as existing accounts
**Location:** packages/state/src/actions/getAccount.js:65
**Files modified:** packages/state/src/actions/getAccount.js
**Issue:** Fork-mode missing account detection compared code and storage roots to all-zero bytes instead of Ethereum's canonical empty hashes.
**Fix:** Missing-account detection now compares zero nonce/balance with the canonical empty code hash and empty storage root.

### [MEDIUM] Loading a state root does not clear old tombstones
**Location:** packages/state/src/actions/generateCannonicalGenesis.js:20
**Files modified:** packages/state/src/actions/generateCannonicalGenesis.js
**Issue:** Loading replacement caches left prior account and storage tombstones active.
**Fix:** `generateCanonicalGenesis()` now resets tombstones with the cache replacement and restores the old tombstones on load failure.

### [MEDIUM] `dumpStorageRange` only works when the start key already exists
**Location:** packages/state/src/actions/dumpStorageRange.js:26
**Files modified:** packages/state/src/actions/dumpStorageRange.js
**Issue:** Storage-range dumping required an exact start-key hit and depended on cache iteration order.
**Fix:** Storage entries are now sorted numerically, and pagination starts at the first key greater than or equal to the requested start key.

### [MEDIUM] `getProof` can read a different fork block than cached state
**Location:** packages/state/src/actions/getProof.js:19
**Files modified:** packages/state/src/actions/getProof.js
**Issue:** Fork proofs used the current fork block tag without first resolving and pinning it.
**Fix:** `getProof()` now calls `resolveForkBlockTag()` before creating the client block tag.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H04 — Blockchain + receipts + persistence</strong></summary>

# Blockchain + receipts + persistence fix report

**Slice:** H04
**Type:** horizontal
**Scope:** packages/blockchain packages/receipt-manager packages/sync-storage-persister

## Summary

All seven findings were verified as real and addressed with scoped changes. The fixes tighten deletion invariants in the blockchain cache, make forked chain creation await initialization, prevent stale throttled persistence writes after removal, and improve receipt/log index hygiene.

## Fixes applied

### [HIGH] Forked block can be deleted through its RPC hash alias
**Location:** packages/blockchain/src/actions/delBlock.js:40
**Files modified:** packages/blockchain/src/actions/delBlock.js
**Issue:** The fork boundary check compared only the caller-provided hash against the internal fork hash, so an RPC hash alias could bypass it.
**Fix:** Reject deletion after resolving the block whenever the resolved block object is the forked block.

### [HIGH] Deleting a block leaves iterator/custom tags pointing at removed blocks
**Location:** packages/blockchain/src/actions/delBlock.js:57
**Files modified:** packages/blockchain/src/actions/delBlock.js
**Issue:** Deleted blocks could remain reachable through non-`latest` entries in `blocksByTag`.
**Fix:** Scan all block tags before removing indexes and move tags that point into the deleted set to the deleted root's parent, or remove the tag if no parent exists.

### [HIGH] Forked `createChain` resolves before the chain is initialized
**Location:** packages/blockchain/src/createChain.js:42
**Files modified:** packages/blockchain/src/createChain.js
**Issue:** `createChain` returned a decorated chain before fork RPC bootstrap completed.
**Fix:** Create the base chain, await `baseChain.ready()`, then decorate and return it.

### [HIGH] Pending throttled persist can resurrect removed state
**Location:** packages/sync-storage-persister/src/createSyncStoragePersister.js:69
**Files modified:** packages/sync-storage-persister/src/createSyncStoragePersister.js, packages/sync-storage-persister/src/throttle.js, packages/sync-storage-persister/src/ThrottleFn.ts
**Issue:** A scheduled throttled save could run after `removePersistedState` and write removed state back to storage.
**Fix:** Add a `cancel` method to the throttled function and call it before removing persisted state.

### [MEDIUM] Receipt tx-hash deletion can erase a newer replacement index
**Location:** packages/receipt-manager/src/ReceiptManager.ts:471
**Files modified:** packages/receipt-manager/src/ReceiptManager.ts
**Issue:** Deleting receipts removed transaction-hash indexes without checking whether the index still belonged to the deleted block.
**Fix:** Read the current transaction-hash index and delete it only when both the indexed block hash and transaction index match the block being removed.

### [MEDIUM] `includeTxType` omits legacy transaction type `0`
**Location:** packages/receipt-manager/src/ReceiptManager.ts:322
**Files modified:** packages/receipt-manager/src/ReceiptManager.ts
**Issue:** The transaction type guard treated valid type `0` as absent.
**Fix:** Change the guard to preserve any type value other than `undefined`.

### [MEDIUM] `getLogs` defines but never enforces the block-range limit
**Location:** packages/receipt-manager/src/ReceiptManager.ts:392
**Files modified:** packages/receipt-manager/src/ReceiptManager.ts
**Issue:** `getLogs` could scan ranges larger than `GET_LOGS_BLOCK_RANGE_LIMIT`.
**Fix:** Check the requested block count before scanning and throw when it exceeds the configured limit.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H05 — Block, Tx, TxPool</strong></summary>

# Block, Tx, TxPool fix report

**Slice:** H05
**Type:** horizontal
**Scope:** packages/block packages/tx packages/txpool

## Summary

All six findings were addressed with scoped fixes. The block fixes correct consensus-visible header integer encoding, EIP-7685 request commitments, fork field decoding, transaction construction, and request type validation. The txpool fix corrects effective priority fee ordering for capped fee-market transactions.

## Fixes applied

### [CRITICAL] Header integer serialization drops the first two data bytes
**Location:** packages/block/src/header.ts:31
**Files modified:** packages/block/src/header.ts
**Issue:** Header bigint fields were serialized with `toBytes(n).slice(2)`, dropping real bytes from a `Uint8Array`.
**Fix:** Serialize zero as empty bytes and nonzero values directly with `toBytes(n)`.

### [CRITICAL] EIP-7685 requests use a trie root instead of the requests hash
**Location:** packages/block/src/block.ts:96
**Files modified:** packages/block/src/block.ts, packages/block/src/header.ts
**Issue:** Requests were committed and validated with an index-keyed trie root, including an incorrect empty commitment.
**Fix:** Added EIP-7685 request hash computation over SHA-256 request hashes, filtered one-byte empty requests, preserved the old async helper as a compatibility alias, and defaulted empty request commitments to `sha256("")`.

### [HIGH] RLP header decoding accepts missing fork-activated fields
**Location:** packages/block/src/header.ts:113
**Files modified:** packages/block/src/header.ts
**Issue:** RLP decoding accepted missing London base fee fields after activation and missing Shanghai withdrawals roots.
**Fix:** `fromValuesArray()` now rejects missing `baseFeePerGas` for all London+ headers and missing `withdrawalsRoot` for all Shanghai+ headers before returning a decoded header.

### [HIGH] `createBlock()` stores transaction-shaped data as non-transaction objects
**Location:** packages/block/src/block.ts:130
**Files modified:** packages/block/src/block.ts
**Issue:** Plain transaction data passed to `fromBlockData()` was inserted into `Block.transactions` without constructing transaction instances.
**Fix:** Existing transaction instances are preserved, while transaction data dictionaries are constructed with `TransactionFactory` using the block header common.

### [HIGH] TxPool overstates effective priority fee for capped fee-market transactions
**Location:** packages/txpool/src/TxPool.ts:69
**Files modified:** packages/txpool/src/TxPool.ts
**Issue:** Fee-market transaction ordering used `maxPriorityFeePerGas` even when `maxFeePerGas - baseFee` capped the effective tip.
**Fix:** Normalized gas price now returns `min(maxPriorityFeePerGas, maxFeePerGas - baseFee)` clamped to zero, and legacy priority fees are also clamped at zero.

### [MEDIUM] `ClRequest` silently wraps invalid request type numbers
**Location:** packages/block/src/ClRequest.ts:78
**Files modified:** packages/block/src/ClRequest.ts, packages/block/src/ClRequest.spec.ts
**Issue:** Request types outside the byte range, negative values, and non-integers were accepted and silently coerced during serialization.
**Fix:** The constructor now requires integer request types in `[0, 255]`, preserving the existing undefined-type error.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H06 — Trie, RLP, utils, address</strong></summary>

# Trie, RLP, utils, address fix report

**Slice:** H06
**Type:** horizontal
**Scope:** packages/trie packages/rlp packages/utils packages/address

## Summary

All five findings were verified against the cited source and addressed with narrow in-scope fixes. The changes harden address creation and contract address prediction inputs, prevent indexed mutation of the exported empty state root, and normalize seeded memory DB keys. No findings were skipped or deferred.

## Fixes applied

### [HIGH] Short hex address strings are accepted and right-padded into the wrong address
**Location:** packages/address/src/createAddress.js:83
**Files modified:** packages/address/src/createAddress.js
**Issue:** Short string inputs such as `0x123` were accepted and padded into a different 20-byte address.
**Fix:** Added exact 40-hex-character validation for prefixed and unprefixed string inputs before decoding.

### [HIGH] Exported empty state root can still be mutated through indexed writes
**Location:** packages/trie/src/EMPTY_STATE_ROOT.js:56
**Files modified:** packages/trie/src/EMPTY_STATE_ROOT.js
**Issue:** The exported `Uint8Array` blocked mutating methods but still allowed assignments like `EMPTY_STATE_ROOT[0] = 0`.
**Fix:** Wrapped the singleton in a `Proxy` that rejects numeric index writes, deletes, and definitions while preserving existing immutable method behavior.

### [HIGH] Address instances alias caller-owned byte arrays
**Location:** packages/address/src/createAddress.js:77
**Files modified:** packages/address/src/createAddress.js
**Issue:** `createAddress` reused caller-owned bytes from raw `Uint8Array` and existing `EthjsAddress` inputs.
**Fix:** Copied bytes with `Uint8Array.from(...)` before constructing the returned `Address`.

### [MEDIUM] Contract address helpers accept non-address byte lengths
**Location:** packages/address/src/createContractAddress.js:70
**Files modified:** packages/address/src/assertAddress.js, packages/address/src/createContractAddress.js, packages/address/src/create2ContractAddress.js
**Issue:** CREATE and CREATE2 helpers accepted malformed objects with a non-20-byte `bytes` field.
**Fix:** Added a shared private `assertAddress` helper and used it in both contract address helpers before hashing.

### [MEDIUM] Seeded memory DBs cannot read Uint8Array keys supplied by the public type
**Location:** packages/utils/src/createMemoryDb.js:23
**Files modified:** packages/utils/src/createMemoryDb.js
**Issue:** Initial maps with `Uint8Array` keys were stored without the same key normalization used by later operations.
**Fix:** Normalized all initial map entries through `encodeKey` while constructing the backing map.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H07 — Errors, logger, common, consensus, effect</strong></summary>

# Errors, logger, common, consensus, effect fix report

**Slice:** H07
**Type:** horizontal
**Scope:** packages/errors packages/logger packages/common packages/consensus packages/effect

## Summary

Six findings were addressed with narrow fixes in the in-scope packages, covering unsafe default KZG wiring, mock KZG output shape, light-client readiness invariants, resolver error-channel behavior, and error diagnostics metadata. One high-severity chain preset accuracy finding was verified as real but deferred because a correct fix requires chain-specific EthereumJS configuration and hardfork policy across generated presets, not a safe local patch.

## Fixes applied

### [HIGH] Default Common trusts all KZG proofs
**Location:** packages/common/src/createCommon.js:66
**Files modified:** packages/common/src/createCommon.js, packages/common/src/CommonOptions.ts, packages/common/src/MockKzg.ts, packages/common/src/createMockKzg.js
**Issue:** `createCommon` installed `createMockKzg()` whenever callers omitted `customCrypto`, causing Cancun/Prague KZG paths to trust proofs by default.
**Fix:** Removed the implicit mock KZG injection and documented the mock as an explicit opt-in only.

### [MEDIUM] Mock KZG returns malformed commitment and proof sizes
**Location:** packages/common/src/createMockKzg.js:24
**Files modified:** packages/common/src/createMockKzg.js, packages/common/src/createMockKzg.spec.ts, packages/common/src/__snapshots__/createMockKzg.spec.ts.snap
**Issue:** The mock returned bytes32-shaped hashes for KZG commitments and proofs, which should be bytes48-shaped values.
**Fix:** Changed mock commitment/proof/cell helpers to return a deterministic bytes48 dummy value and added length assertions to the mock tests.

### [MEDIUM] Light-client readiness can be marked ready while still errored or syncing
**Location:** packages/consensus/src/createLightClientConsensusService.ts:35
**Files modified:** packages/consensus/src/createLightClientConsensusService.ts
**Issue:** Partial status updates could produce inconsistent states such as `ready: true` with `status: 'syncing'` or `status: 'error'`.
**Fix:** Normalization now derives `ready` from `status === 'ready'`, so `isReady()` cannot diverge from lifecycle status.

### [MEDIUM] `resolveSync` can defect instead of returning a typed resolution error
**Location:** packages/effect/src/resolve.js:49
**Files modified:** packages/effect/src/resolve.js
**Issue:** The sync resolver catch path referenced ESM-undefined `__dirname` when `options.basedir` was absent.
**Fix:** Replaced the fallback with `options?.basedir ?? process.cwd()` in both sync and async resolution errors.

### [LOW] Subclass error docs paths are overwritten by base classes
**Location:** packages/errors/src/ethereum/ResourceNotFoundError.js:60
**Files modified:** packages/errors/src/ethereum/ResourceNotFoundError.js, packages/errors/src/__snapshots__/errors.spec.ts.snap, packages/errors/src/__snapshots__/rpcErrors.spec.ts.snap
**Issue:** `ResourceNotFoundError` overwrote subclass-provided `docsBaseUrl` and `docsPath`.
**Fix:** Preserved caller-provided docs metadata and only applied the generic resource-not-found docs values as defaults.

### [LOW] Error messages report a stale package version
**Location:** packages/errors/src/ethereum/BaseError.js:6
**Files modified:** packages/errors/src/ethereum/BaseError.js, packages/errors/src/ethereum/BaseError.spec.ts, packages/errors/src/__snapshots__/errors.spec.ts.snap, packages/errors/src/__snapshots__/rpcErrors.spec.ts.snap, packages/common/src/__snapshots__/createCommon.spec.ts.snap
**Issue:** `BaseError` messages reported `1.1.0.next-73` while the package version is `1.0.0-next.148`.
**Fix:** Updated the reported version string to match `packages/errors/package.json`.

## Skipped / deferred

### [HIGH] Chain presets execute with Mainnet Prague rules
**Reason:** too-risky-to-auto-fix
**Explanation:** The issue is real: generated presets pass `hardfork: 'prague'` and `createCommon` builds an EthereumJS Common from `Mainnet` with only chain id/name overrides. A correct fix requires explicit EthereumJS chain/base configs, hardfork schedules, and L2 behavior policy for many generated chains; a narrow patch would risk replacing one consensus mismatch with another.

</details>

<details>
<summary><strong>H08 — JSON-RPC transport (jsonrpc + http-client + server)</strong></summary>

# JSON-RPC transport (jsonrpc + http-client + server) fix report

**Slice:** H08
**Type:** horizontal
**Scope:** packages/jsonrpc packages/http-client packages/server

## Summary

All seven findings in this slice were verified as real and addressed with scoped fixes. The server transport now handles pre-parsed framework bodies, caps oversized stream buffering, preserves falsy request ids in errors, enforces strict JSON-RPC envelopes in compatibility mode, and returns per-item errors for malformed batch elements. The framework adapters now return the handler promise, and the deprecated JSON-RPC fetcher now matches its exported response type.

## Fixes applied

### [HIGH] Express and Next handlers break when the framework has already parsed JSON
**Location:** packages/server/src/internal/getRequestBody.js:13
**Files modified:** packages/server/src/internal/getRequestBody.js, packages/server/src/createHttpHandler.js
**Issue:** Pre-parsed `req.body` values from Express or Next were passed to `JSON.parse` as non-strings.
**Fix:** Normalized string, Buffer, and JSON-serializable body values before parsing, and surfaced unsupported body values as `InvalidRequestError`.

### [HIGH] Error responses drop valid falsy JSON-RPC ids
**Location:** packages/server/src/internal/handleError.js:14
**Files modified:** packages/server/src/internal/handleError.js
**Issue:** Error responses only included `id` when the value was truthy, dropping valid ids like `0`, `""`, and `null`.
**Fix:** Changed id preservation to check `id !== undefined`.

### [HIGH] Oversized bodies continue buffering after the size limit fires
**Location:** packages/server/src/internal/getRequestBody.js:25
**Files modified:** packages/server/src/internal/getRequestBody.js, packages/server/src/createHttpHandler.js
**Issue:** The request stream kept appending chunks after the max body size error resolved.
**Fix:** Added a completion guard, detached stream listeners, paused the request on limit overflow, and returned 413 with `Connection: close`.

### [MEDIUM] One malformed batch element rejects the whole batch
**Location:** packages/server/src/internal/parseRequest.js:40
**Files modified:** packages/server/src/internal/parseRequest.js, packages/server/src/internal/handleBulkRequest.js
**Issue:** Batch parsing rejected the full batch when any single element was malformed.
**Fix:** Parsed batch elements independently and passed malformed elements through as item-level JSON-RPC error responses while still executing valid elements.

### [MEDIUM] The compatibility parser accepts requests without `jsonrpc: "2.0"`
**Location:** packages/server/src/internal/parseRequest.js:6
**Files modified:** packages/server/src/internal/parseRequest.js, packages/server/src/createHttpHandler.js
**Issue:** Compatibility mode accepted request envelopes missing the required JSON-RPC version.
**Fix:** Added a strict parser mode requiring `jsonrpc: "2.0"` and enabled it only when `createHttpHandler` runs in compatibility mode.

### [MEDIUM] Framework adapters drop the handler promise
**Location:** packages/server/src/adapters/createNextApiHandler.js:19
**Files modified:** packages/server/src/adapters/createNextApiHandler.js, packages/server/src/adapters/createExpressMiddleware.js
**Issue:** The Next and Express adapters invoked the async HTTP handler without returning its promise.
**Fix:** Returned the handler promise from both adapters.

### [LOW] `createJsonRpcFetcher` violates its exported response type
**Location:** packages/jsonrpc/src/createJsonRpcFetcher.js:24
**Files modified:** packages/jsonrpc/src/createJsonRpcFetcher.js
**Issue:** Runtime responses omitted the `method` field required by the exported `JsonRpcResponse` type.
**Fix:** Added `method: request.method` to success and error responses.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H09 — Actions (handlers backing every method)</strong></summary>

# Actions (handlers backing every method) fix report

**Slice:** H09
**Type:** horizontal
**Scope:** packages/actions

## Summary

All nine findings were verified against the current code and addressed with scoped changes under `packages/actions`. The fixes focus on preserving prepared trace state, making state/RPC mutations transactional or error-aware, correcting receipt fields, enriching log filter events, cleaning up trace listeners, preserving JSON-RPC id `0`, and fixing the `earliest` block tag. No build or test commands were run, per the slice constraints.

## Fixes applied

### [HIGH] Block and transaction tracing uses post-block state for the transaction being traced
**Location:** packages/actions/src/debug/debugTraceTransactionProcedure.js:158
**Files modified:** packages/actions/src/debug/debugTraceTransactionProcedure.js, packages/actions/src/debug/debugTraceBlockProcedure.js, packages/actions/src/debug/debugTraceChainProcedure.js
**Issue:** Prepared VM state was discarded because tracing passed a block tag that reset the trace VM to the block post-state.
**Fix:** Removed those block tags from prepared-VM trace calls so tracing runs against the replayed pre-transaction state.

### [HIGH] `tevm_setAccount` can partially mutate state and still return an error
**Location:** packages/actions/src/SetAccount/setAccountHandler.js:122
**Files modified:** packages/actions/src/SetAccount/setAccountHandler.js
**Issue:** Account, code, and storage writes could partially succeed before an error was returned.
**Fix:** Added a state checkpoint before mutation, made writes ordered, committed only after success, and reverted on failure.

### [HIGH] `eth_sendRawTransaction` reports success even when the tx pool rejects the transaction
**Location:** packages/actions/src/eth/ethSendRawTransactionProcedure.js:31
**Files modified:** packages/actions/src/eth/ethSendRawTransactionProcedure.js
**Issue:** The procedure ignored `txPool.add` rejection results and returned the tx hash anyway.
**Fix:** Checked `addResult.error` and returned a JSON-RPC error before automining or returning success.

### [HIGH] `eth_getTransactionReceipt` underreports EIP-1559 effective gas price
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:111
**Files modified:** packages/actions/src/eth/ethGetTransactionReceipt.js
**Issue:** The local receipt path returned only the priority fee in one EIP-1559 branch.
**Fix:** Computed `min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)` and retained the legacy `gasPrice` branch.

### [HIGH] `eth_newFilter` captures every future log and returns fake metadata
**Location:** packages/actions/src/eth/ethNewFilterHandler.js:57
**Files modified:** packages/actions/src/eth/ethNewFilterHandler.js, packages/actions/src/Mine/emitEvents.js
**Issue:** Future log filters ignored address/topic criteria and stored placeholder block/transaction metadata.
**Fix:** Emitted mined log metadata from mining and applied address/topic filtering before storing future filter logs.

### [MEDIUM] Trace listeners are not always unregistered
**Location:** packages/actions/src/internal/runCallWithTrace.js:61
**Files modified:** packages/actions/src/internal/runCallWithTrace.js, packages/actions/src/Call/executeCall.js, packages/actions/src/internal/runCallWithCallTrace.js, packages/actions/src/internal/runCallWithFlatCallTrace.js, packages/actions/src/internal/runCallWithFourbyteTrace.js
**Issue:** Lazy and non-default trace helpers could leave EVM event listeners registered after tracing.
**Fix:** Added paired cleanup functions and `try/finally` listener removal, including lazy trace cleanup from `executeCall`.

### [MEDIUM] Forked transaction receipts are mapped with wrong field names
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:52
**Files modified:** packages/actions/src/eth/ethGetTransactionReceipt.js
**Issue:** Fork receipt mapping read `blockHash` and `cumulativeGasUsed` from non-RPC field names.
**Fix:** Mapped `blockHash` from `r.blockHash`, `cumulativeGasUsed` from `r.cumulativeGasUsed`, and normalized fork log indexes to bigint.

### [MEDIUM] Valid JSON-RPC id `0` is dropped by many handlers
**Location:** packages/actions/src/createHandlers.js:227
**Files modified:** packages/actions/src/createHandlers.js and JSON-RPC procedure files under packages/actions/src/anvil, packages/actions/src/debug, and packages/actions/src/eth
**Issue:** Many responses used truthiness checks that dropped valid falsy ids such as `0`.
**Fix:** Replaced those checks with `id !== undefined` across the affected action procedures.

### [MEDIUM] `earliest` resolves to block 1 in log range parsing
**Location:** packages/actions/src/eth/utils/parseBlockParam.js:46
**Files modified:** packages/actions/src/eth/utils/parseBlockParam.js
**Issue:** The `earliest` block tag resolved to block `1` instead of genesis block `0`.
**Fix:** Changed `earliest` to return `0n`.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H10 — Procedures, decorators, memory-client, node, client-types</strong></summary>

# Procedures, decorators, memory-client, node, client-types fix report

**Slice:** H10
**Type:** horizontal
**Scope:** packages/procedures packages/decorators packages/memory-client packages/client-types packages/node

## Summary

Addressed all six reviewed findings. The fixes stabilize the EIP-1193 request handler, stop retrying local JSON-RPC semantic errors, make documented/client options behave as advertised, and restore the public procedures compatibility surface. No findings were skipped or deferred.

## Fixes applied

### [HIGH] EIP-1193 requests leak interval-mining timers
**Location:** packages/decorators/src/request/requestEip1193.js:23
**Files modified:** packages/decorators/src/request/requestEip1193.js
**Issue:** The request decorator created a fresh `requestProcedure(client)` for every request, recreating handler-owned interval mining timers.
**Fix:** Hoisted `requestProcedure(client)` into the decorator closure so every request uses one stable handler set.

### [MEDIUM] Semantic JSON-RPC errors are retried by default
**Location:** packages/decorators/src/request/requestEip1193.js:22
**Files modified:** packages/decorators/src/request/requestEip1193.js
**Issue:** Local procedure errors were wrapped in viem `withRetry`, so validation and JSON-RPC failures were retried as transient failures.
**Fix:** Removed `withRetry` from the in-process request path and now execute the stable handler directly.

### [MEDIUM] `cacheTime` is exposed but always overwritten
**Location:** packages/memory-client/src/createMemoryClient.js:316
**Files modified:** packages/memory-client/src/createMemoryClient.js
**Issue:** `createMemoryClient` spread user options before forcing `cacheTime: 0`, making configured cache times ineffective.
**Fix:** Preserve a caller-provided `cacheTime` while keeping `0` as the default when it is omitted.

### [MEDIUM] Published mining examples use an ignored option shape
**Location:** packages/memory-client/src/createMemoryClient.js:35
**Files modified:** packages/memory-client/src/createMemoryClient.js, packages/memory-client/src/createTevmTransport.js, packages/memory-client/src/tevmMine.js, packages/memory-client/src/tevmDeploy.js, packages/memory-client/src/MemoryClientOptions.ts
**Issue:** Public examples documented `mining: { auto | interval }`, but the node reads `miningConfig`.
**Fix:** Updated public examples to `miningConfig` and added deprecated `mining` compatibility translation in `createMemoryClient` for JavaScript callers following the old docs.

### [MEDIUM] EIP-1193 request typing omits runtime TEVM methods
**Location:** packages/decorators/src/request/Eip1193RequestProvider.ts:17
**Files modified:** packages/decorators/src/request/Eip1193RequestProvider.ts
**Issue:** The provider request type omitted runtime-supported `tevm_mine`.
**Fix:** Added `JsonRpcSchemaTevm['tevm_mine']` to the EIP-1193 request schema.

### [LOW] `@tevm/procedures` is a public package with no usable API
**Location:** packages/procedures/src/index.ts:1
**Files modified:** packages/procedures/src/index.ts, packages/procedures/package.json
**Issue:** The public package entry point only logged a deprecation message and exported no compatibility API.
**Fix:** Replaced the stdout side effect with a deprecated compatibility re-export of `@tevm/actions` and declared the workspace dependency.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H11 — Contract, predeploys, precompiles</strong></summary>

# Contract, predeploys, precompiles fix report

**Slice:** H11
**Type:** horizontal
**Scope:** packages/contract packages/predeploys packages/precompiles

## Summary

All six findings were verified against the cited code and addressed with scoped fixes. The changes are mostly type-level corrections and narrow error-boundary fixes, plus the P256 verifier option required for RIP-7212 compatibility. No findings were skipped or deferred, and no build/test commands were run because this slice explicitly disallows them.

## Fixes applied

### [HIGH] P256 verifier rejects valid high-S signatures
**Location:** packages/precompiles/src/p256verify.precompile.ts:68
**Files modified:** packages/precompiles/src/p256verify.precompile.ts
**Issue:** The standard P256 verifier used noble's default low-S verification policy, which is stricter than RIP-7212.
**Fix:** Passed `lowS: false` alongside the existing `prehash: false` option so valid high-S P-256 signatures are accepted.

### [HIGH] Malformed precompile calldata bypasses the revert wrapper
**Location:** packages/precompiles/src/defineCall.ts:62
**Files modified:** packages/precompiles/src/defineCall.ts
**Issue:** ABI decoding ran before the `try` block, so malformed calldata could throw through the host instead of producing an `ExecResult`.
**Fix:** Moved decoding, handler lookup, handler execution, log conversion, and result encoding under the same error boundary, with a clear missing-handler error.

### [MEDIUM] Contract event creators are typed with swapped generic parameters
**Location:** packages/contract/src/Contract.ts:124
**Files modified:** packages/contract/src/Contract.ts
**Issue:** `Contract.events` supplied address, bytecode, and deployed bytecode generics in the wrong order.
**Fix:** Changed the instantiation to `EventActionCreator<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress>`.

### [MEDIUM] Event arg extraction excludes the concrete arg shapes
**Location:** packages/contract/src/event/EventActionCreator.ts:23
**Files modified:** packages/contract/src/event/EventActionCreator.ts
**Issue:** `MaybeExtractEventArgsFromAbi` excluded tuple and object shapes that represent real typed event args.
**Fix:** Removed the broad `Exclude` so known event args are preserved through `GetEventArgs`.

### [MEDIUM] Multi-output precompile functions cannot be represented correctly
**Location:** packages/precompiles/src/CallResult.ts:32
**Files modified:** packages/precompiles/src/CallResult.ts
**Issue:** `CallResult.returnValue` only allowed the first ABI output, making multi-output functions impossible to model correctly.
**Fix:** Added a conditional return-value helper: zero outputs use `undefined`, one output uses the primitive value, and multiple outputs use the full output tuple.

### [LOW] Predeploy docs point users at a non-working API shape
**Location:** packages/predeploys/src/definePredeploy.js:12
**Files modified:** packages/predeploys/src/definePredeploy.js, packages/predeploys/src/DefinePredeployFn.ts, packages/predeploys/docs/functions/definePredeploy.md, packages/predeploys/docs/type-aliases/DefinePredeployFn.md
**Issue:** The examples used the obsolete wrapper-object input and `predeploys: [predeploy.predeploy()]` option.
**Fix:** Updated examples to pass an addressed contract via `.withAddress(...)` and configure `customPredeploys: [predeploy]`.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H12 — Bundler core</strong></summary>

# Bundler core fix report

**Slice:** H12
**Type:** horizontal
**Scope:** bundler-packages/base-bundler bundler-packages/bundler-cache bundler-packages/compiler bundler-packages/config bundler-packages/resolutions bundler-packages/runtime bundler-packages/solc bundler-packages/whatsabi

## Summary

All nine findings were verified against the cited source and addressed with in-scope source changes. The fixes focus on removing shell execution, preserving requested compiler/version semantics, preventing stale cache hits, keeping entry paths stable, avoiding Solidity source constraint rewrites, and aligning generated/runtime TypeScript surfaces. No findings were skipped or deferred.

## Fixes applied

### [CRITICAL] Foundry config loading executes config-controlled shell text
**Location:** bundler-packages/config/src/foundry/loadFoundryConfig.js:88
**Files modified:** bundler-packages/config/src/foundry/loadFoundryConfig.js
**Issue:** `foundryProject` was interpolated into a shell command string before invoking `forge config --json`.
**Fix:** Switched to `execFileSync(forgeCommand, ['config', '--json'])` so the configured string is treated as an executable path, not shell text.

### [HIGH] `createSolc` falls back to bundled solc instead of the requested remote version
**Location:** bundler-packages/solc/src/solc.js:158
**Files modified:** bundler-packages/solc/src/solc.js
**Issue:** The remote compiler wrapper recursively called `solcCompile`, causing callers to hit the bundled-solc fallback.
**Fix:** Removed the bundled-solc fallback and changed the remote wrapper to return raw JSON for string inputs while preserving object-style direct compile calls.

### [HIGH] Artifact cache ignores compiler and config inputs
**Location:** bundler-packages/bundler-cache/src/readArtifacts.js:71
**Files modified:** bundler-packages/base-bundler/src/createCompileFingerprint.js, bundler-packages/base-bundler/src/readCache.js, bundler-packages/base-bundler/src/readCacheSync.js, bundler-packages/base-bundler/src/resolveModuleAsync.js, bundler-packages/base-bundler/src/resolveModuleSync.js, bundler-packages/base-bundler/src/writeCache.js, bundler-packages/base-bundler/src/writeCacheSync.js, bundler-packages/bundler-cache/src/createCache.js, bundler-packages/bundler-cache/src/readArtifacts.js, bundler-packages/bundler-cache/src/readArtifactsSync.js, bundler-packages/bundler-cache/src/types.ts, bundler-packages/bundler-cache/src/writeArtifacts.js, bundler-packages/bundler-cache/src/writeArtifactsSync.js
**Issue:** Cached artifacts were accepted using only cache version and source mtimes.
**Fix:** Added a deterministic compile fingerprint covering resolved config, solc version, and output-selection flags, then stored and validated it in artifact metadata.

### [HIGH] Relative entry modules are read with `basedir` but compiled under the unresolved path
**Location:** bundler-packages/compiler/src/compiler/compileContracts.js:33
**Files modified:** bundler-packages/base-bundler/src/resolveCacheKey.js, bundler-packages/base-bundler/src/resolveModuleAsync.js, bundler-packages/base-bundler/src/resolveModuleSync.js, bundler-packages/compiler/src/compiler/compileContracts.js, bundler-packages/compiler/src/compiler/compileContractsSync.js
**Issue:** The compiler read the resolved entry file but used the original caller spelling for module IDs, source keys, and cache keys.
**Fix:** Resolved and formatted the entry path once for async/sync compilation, and normalized base-bundler cache keys for relative/absolute entry modules.

### [HIGH] Pragma rewriting drops Solidity upper bounds
**Location:** bundler-packages/resolutions/src/utils/updatePragma.js:29
**Files modified:** bundler-packages/resolutions/src/utils/updatePragma.js
**Issue:** Valid pragma constraints were rewritten into open-ended `>=` constraints before solc saw the source.
**Fix:** Changed `updatePragma` to validate that a pragma exists while returning the Solidity source unchanged.

### [HIGH] Generated declaration files contain implementation initializers
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:66
**Files modified:** bundler-packages/runtime/src/generateTevmBodyDts.js
**Issue:** Generated `.d.ts` output contained value initializers for ABI/name constants and artifacts.
**Fix:** Emitted declaration-only syntax using literal types for name/ABI constants and `export declare const artifacts`.

### [MEDIUM] Overlapping remappings resolve by insertion order instead of longest prefix
**Location:** bundler-packages/resolutions/src/utils/resolveImportPath.js:45
**Files modified:** bundler-packages/resolutions/src/utils/resolveImportPath.js
**Issue:** The first inserted remapping won even when a later remapping had a more specific matching prefix.
**Fix:** Sorted remapping entries by descending prefix length before matching, preserving insertion order for equal-length ties.

### [MEDIUM] Unknown chains with custom RPC still dereference `chain`
**Location:** bundler-packages/whatsabi/src/resolveContractUri.js:48
**Files modified:** bundler-packages/whatsabi/src/resolveContractUri.js
**Issue:** Unknown chains with `rpcUrl` still crashed when reading `chain.blockExplorers`.
**Fix:** Used optional chaining for the known-chain explorer URL so custom-RPC unknown chains can proceed without an explorer loader.

### [MEDIUM] Contract URI type rejects the scheme parsed at runtime
**Location:** bundler-packages/whatsabi/src/ContractUri.ts:4
**Files modified:** bundler-packages/whatsabi/src/ContractUri.ts
**Issue:** The public `ContractUri` type used `eth://` while the runtime parser accepts `evm://`.
**Fix:** Updated `ContractUri` to use the runtime-supported `evm://` scheme.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H13 — Bundler plugins (esbuild/vite/webpack/rollup/etc.)</strong></summary>

# Bundler plugins (esbuild/vite/webpack/rollup/etc.) fix report

**Slice:** H13
**Type:** horizontal
**Scope:** bundler-packages/bun bundler-packages/esbuild bundler-packages/rollup bundler-packages/rspack bundler-packages/vite bundler-packages/webpack bundler-packages/unplugin bundler-packages/requirejs bundler-packages/tevm-run bundler-packages/mud

## Summary

All seven findings were verified against the cited code and addressed with scoped changes. The fixes focus on adapter output compatibility, consistent sidecar detection, argv/error handling, and MUD optimistic-state isolation/correctness. No findings were deferred or marked false-positive.

## Fixes applied

### [HIGH] RequireJS evaluates ESM output as RequireJS text
**Location:** bundler-packages/requirejs/src/requirejsPluginTevm.js:200
**Files modified:** bundler-packages/requirejs/src/requirejsPluginTevm.js
**Issue:** The RequireJS loader compiled Solidity to ESM and passed import/export syntax to `onload.fromText`.
**Fix:** Switched compiled output to CJS and wrapped it in an AMD `define(['@tevm/contract'], ...)` factory before evaluation.

### [HIGH] Empty tx pool keeps stale optimistic state
**Location:** bundler-packages/mud/src/createOptimisticHandler.ts:148
**Files modified:** bundler-packages/mud/src/createOptimisticHandler.ts
**Issue:** Empty tx pools returned without clearing optimistic/internal logs or notifying optimistic subscribers.
**Fix:** Clear both log arrays and notify optimistic subscribers with updates back to canonical records when the pool drains.

### [HIGH] Optimistic handler registry aliases different stores using the same client
**Location:** bundler-packages/mud/src/react/useOptimisticWrapper.tsx:36
**Files modified:** bundler-packages/mud/src/react/useOptimisticWrapper.tsx
**Issue:** The React handler registry keyed only by client, so providers for different store addresses or stashes shared the wrong handler.
**Fix:** Keyed handlers by client, store address, and stash, and added reference-counted cleanup/removal on provider unmount.

### [MEDIUM] `tevm-run` does not catch process failures and collapses argv
**Location:** bundler-packages/tevm-run/src/run.js:15
**Files modified:** bundler-packages/tevm-run/src/run.js
**Issue:** The Bun shell promise was returned before awaiting, and forwarded args were joined into one shell interpolation.
**Fix:** Await the shell command inside the `try` block and pass the positional array as its own interpolation to preserve argv boundaries.

### [MEDIUM] Shared unplugin ignores JavaScript sidecars
**Location:** bundler-packages/unplugin/src/tevmUnplugin.js:78
**Files modified:** bundler-packages/unplugin/src/tevmUnplugin.js
**Issue:** The shared unplugin skipped compilation only for `.sol.ts` and `.sol.d.ts` sidecars.
**Fix:** Extended sidecar detection to `.ts`, `.js`, `.mjs`, `.cjs`, and `.d.ts`.

### [MEDIUM] Canonical sync can hang forever after an adapter error
**Location:** bundler-packages/mud/src/internal/mud/createSyncAdapter.ts:25
**Files modified:** bundler-packages/mud/src/internal/mud/createSyncAdapter.ts
**Issue:** Canonical storage work could throw inside the queued callback without resolving or rejecting the promise returned to sync.
**Fix:** Added a `reject` path and wrapped queued canonical work in `try/catch` so failures propagate to the caller.

### [MEDIUM] Global state coordinator drops updates across independent handlers
**Location:** bundler-packages/mud/src/internal/stateUpdateCoordinator.ts:52
**Files modified:** bundler-packages/mud/src/internal/stateUpdateCoordinator.ts, bundler-packages/mud/src/createOptimisticHandler.ts, bundler-packages/mud/src/internal/mud/createSyncAdapter.ts
**Issue:** All optimistic handlers shared one module-level coordinator, so canonical updates in one handler could clear optimistic work from another.
**Fix:** Added a coordinator factory, created one coordinator per optimistic handler, and passed that coordinator into the sync adapter.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H14 — Rust bundler components</strong></summary>

# Rust bundler components fix report

**Slice:** H14
**Type:** horizontal
**Scope:** bundler-packages/resolutions-rs bundler-packages/runtime-rs bundler-packages/solc-rs

## Summary

All eight reviewed findings were verified as real and addressed with scoped source changes. The fixes bring the Rust resolution graph closer to the JS behavior, preserve import metadata across the FFI boundary, make runtime artifacts usable by `createContract`, and loosen solc output deserialization for output-selected compiler responses. No findings were deferred or treated as false positives.

## Fixes applied

### [HIGH] Transitive imports are marked seen before they are processed
**Location:** bundler-packages/resolutions-rs/src/module_factory.rs:106
**Files modified:** bundler-packages/resolutions-rs/src/module_factory.rs
**Issue:** Child imports were inserted into `seen` before `process_module` ran, causing `process_module` to skip them.
**Fix:** Removed the pre-insertion from the worker loop so `process_module` owns the processed-module guard.

### [HIGH] Module code is not rewritten to the resolved import ids
**Location:** bundler-packages/resolutions-rs/src/process_module.rs:35
**Files modified:** bundler-packages/resolutions-rs/src/process_module.rs, bundler-packages/resolutions-rs/src/resolve_imports.rs, bundler-packages/resolutions-rs/src/models.rs, bundler-packages/resolutions-rs/src/lib.rs, bundler-packages/resolutions-rs/src/module_factory.rs
**Issue:** Module code kept raw import specifiers while the graph stored absolute imported ids.
**Fix:** Added detailed resolved import records, rewrote Solidity import specifiers to resolved ids before graph insertion, and preserved unmodified source as `raw_code`.

### [HIGH] Runtime output contains unusable ABI strings
**Location:** bundler-packages/runtime-rs/src/lib.rs:55
**Files modified:** bundler-packages/runtime-rs/src/lib.rs
**Issue:** ABI items were serialized as JSON strings instead of human-readable ABI signatures.
**Fix:** Replaced JSON stringification with human-readable formatting for functions, events, errors, constructors, fallback, receive, and tuple parameters.

### [HIGH] Runtime generation drops all bytecode
**Location:** bundler-packages/runtime-rs/src/lib.rs:75
**Files modified:** bundler-packages/runtime-rs/src/lib.rs
**Issue:** Runtime generation always emitted null bytecode fields.
**Fix:** Added explicit `include_bytecode` handling and extracted linked creation/runtime bytecode from Foundry `evm` artifacts.

### [HIGH] `generateRuntimeJs` accepts the wrong artifact shape
**Location:** bundler-packages/runtime-rs/src/lib.rs:633
**Files modified:** bundler-packages/runtime-rs/src/lib.rs, bundler-packages/runtime-rs/index.d.ts
**Issue:** The N-API function expected tuple arrays and had no bytecode/package parity with the JS runtime API.
**Fix:** Made the N-API function accept object-shaped contract maps, added an `include_bytecode` argument, accepted the contract package as a string, and updated the checked-in declaration.

### [HIGH] `solc-rs` cannot deserialize normal partial solc outputs
**Location:** bundler-packages/solc-rs/src/models.rs:207
**Files modified:** bundler-packages/solc-rs/src/models.rs, bundler-packages/solc-rs/src/examples/basic_usage.rs
**Issue:** Output-selected solc fields such as `metadata`, `evm`, bytecode objects, and `sources[*].ast` were required.
**Fix:** Made output-selected fields optional and adjusted the example access path for optional EVM bytecode.

### [MEDIUM] Valid files with only commented/string `import ` text are reported as resolution failures
**Location:** bundler-packages/resolutions-rs/src/resolve_imports.rs:98
**Files modified:** bundler-packages/resolutions-rs/src/resolve_imports.rs
**Issue:** A raw substring heuristic treated commented or string-literal `import ` text as a resolver failure.
**Fix:** Removed the substring heuristic and now trust Solar AST import items after successful parsing.

### [MEDIUM] Remapping values are joined incorrectly when the prefix lacks a trailing slash
**Location:** bundler-packages/resolutions-rs/src/resolve_import_path.rs:72
**Files modified:** bundler-packages/resolutions-rs/src/resolve_import_path.rs
**Issue:** Remapping suffixes beginning with a separator were joined as absolute paths, discarding the remapping target.
**Fix:** Trimmed leading path separators from the stripped suffix before joining with the remapping value.

### [MEDIUM] `resolveImportsJs` loses the original and updated import strings at the FFI boundary
**Location:** bundler-packages/resolutions-rs/src/lib.rs:78
**Files modified:** bundler-packages/resolutions-rs/src/lib.rs, bundler-packages/resolutions-rs/src/resolve_imports.rs
**Issue:** The exported resolver filled `original`, `absolute`, and `updated` with the same absolute string.
**Fix:** Routed the FFI function through detailed resolved import records that preserve the source specifier as `original` and resolved path as `absolute`/`updated`.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H15 — Extensions + LSP + CLI</strong></summary>

# Extensions + LSP + CLI fix report

**Slice:** H15
**Type:** horizontal
**Scope:** extensions lsp cli

## Summary

All 8 findings were verified against the cited code and addressed with scoped fixes. The changes correct broken RPC wiring, LSP runtime entrypoints and cache construction, CLI parsing/version behavior, and cache key collisions in the test-node extension. No findings were skipped or deferred.

## Fixes applied

### [HIGH] Viem `getAccount` sends the mutating `tevm_setAccount` RPC
**Location:** extensions/viem/src/tevmViemExtension.js:100
**Files modified:** extensions/viem/src/tevmViemExtension.js
**Issue:** `getAccount` dispatched `tevm_setAccount` instead of the read-only get-account RPC.
**Fix:** Changed the JSON-RPC method to `tevm_getAccount`.

### [HIGH] The published LSP binary points at an unshipped `out` directory
**Location:** lsp/lsp/bin/tevm-lsp.cjs:6
**Files modified:** lsp/lsp/bin/tevm-lsp.cjs, lsp/lsp/bin/evmts-lsp.cjs
**Issue:** The shipped binaries loaded `../out/index.js`, but the package publishes `dist`.
**Fix:** Updated both binaries to load `../dist/index.js` via dynamic import for the ESM output.

### [HIGH] The standalone Volar LSP imports and constructs the cache incorrectly
**Location:** lsp/lsp/src/SolFile.ts:3
**Files modified:** lsp/lsp/src/SolFile.ts, lsp/lsp/package.json
**Issue:** `SolFile` imported `createCache` from the wrong package and called it with the wrong arguments.
**Fix:** Imported `createCache` from `@tevm/bundler-cache`, constructed it with cache dir, file access object, and project root, and made the bundler/cache packages runtime dependencies.

### [HIGH] `tevm serve --fork` crashes with the default fork block option
**Location:** cli/src/utils/server.ts:79
**Files modified:** cli/src/utils/server.ts
**Issue:** The server converted the default `"latest"` fork block value with `BigInt`.
**Fix:** Added fork block parsing that uses `BigInt` only for numeric strings and otherwise preserves block tags.

### [HIGH] `multicall --run` maps over a JSON string instead of parsed contracts
**Location:** cli/src/commands/multicall.tsx:178
**Files modified:** cli/src/commands/multicall.tsx
**Issue:** The direct run path called `.map` on the raw contracts JSON string.
**Fix:** Parsed and validated contracts as a JSON array before mapping, and surfaced invalid JSON as an error.

### [MEDIUM] Snapshot cache keys can collide across different transaction fields
**Location:** extensions/test-node/src/internal/normalizeTx.ts:25
**Files modified:** extensions/test-node/src/internal/normalizeTx.ts
**Issue:** Transaction cache keys normalized only values, allowing different fields with the same value to collide.
**Fix:** Added stable field labels to normalized transaction output and sorted object-entry based list fields.

### [MEDIUM] Viem `setAccount` cannot set balance or nonce to zero
**Location:** extensions/viem/src/tevmViemExtension.js:121
**Files modified:** extensions/viem/src/tevmViemExtension.js
**Issue:** `setAccount` dropped `0n` balance and nonce values because it used truthiness checks.
**Fix:** Switched balance and nonce inclusion to nullish-style `undefined` checks.

### [LOW] CLI version output is hardcoded
**Location:** cli/src/cli.tsx:6
**Files modified:** cli/src/cli.tsx
**Issue:** The CLI always reported version `0.0.0`.
**Fix:** Loaded the version from `cli/package.json` with `createRequire`.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>H16 — Top-level tevm package + test infra</strong></summary>

# Top-level tevm package + test infra fix report

**Slice:** H16
**Type:** horizontal
**Scope:** tevm test

## Summary

All six findings were verified against the cited code and addressed with scoped fixes. The changes align the top-level `tevm` public package metadata and runtime barrel with its declarations, repair the benchmark precompile import, and harden the conformance harness filtering and wrappers.

## Fixes applied

### [HIGH] Top-level declarations expose a runtime export that JS does not provide
**Location:** tevm/index.ts:45
**Files modified:** tevm/index.ts, tevm/index.js, tevm/index.cjs
**Issue:** `createJsonRpcFetcher` was exposed by declarations but missing from the generated runtime entrypoints.
**Fix:** Added `createJsonRpcFetcher` to the top-level runtime export block in source, ESM, and CJS entrypoints.

### [HIGH] Benchmark precompile test imports a non-existent local module
**Location:** test/bench/src/precompiles/FsPrecompile.ts:2
**Files modified:** test/bench/src/precompiles/FsPrecompile.ts
**Issue:** The benchmark precompile imported from `../src/index.js`, which resolves to a non-existent path.
**Fix:** Changed the import to the real public precompile subpath, `tevm/precompiles`.

### [MEDIUM] Published `tevm` package does not ship or register its CLI shim
**Location:** tevm/package.json:382
**Files modified:** tevm/package.json
**Issue:** `cli.js` existed but was omitted from both `bin` and the package `files` allowlist.
**Fix:** Added a `tevm` bin entry for `./cli.js` and included `cli.js` in `files`.

### [MEDIUM] JSR manifest omits the precompiles subpath and is version-stale
**Location:** tevm/jsr.json:4
**Files modified:** tevm/jsr.json
**Issue:** The JSR manifest missed `./precompiles` and had a version older than `tevm/package.json`.
**Fix:** Added the `./precompiles` export and synchronized the JSR version to `1.0.0-next.149`.

### [MEDIUM] Named conformance groups do not filter anything
**Location:** test/conformance-utils/run-fixture-suite.mjs:203
**Files modified:** test/conformance-utils/run-fixture-suite.mjs
**Issue:** `boundary` and `eip` groups bypassed the group-name filter and selected arbitrary vectors after sorting and limiting.
**Fix:** Removed the special-case bypass so every `--group` value must match the vector ID.

### [MEDIUM] Conformance wrapper scripts execute unescaped environment and argv through a shell
**Location:** test/ethereum-state-tests/run-general-state-tests.mjs:10
**Files modified:** test/ethereum-state-tests/run-general-state-tests.mjs, test/execution-spec-tests/run-execution-spec-tests.mjs
**Issue:** Wrapper scripts interpolated fixture paths and pass-through args into a shell command.
**Fix:** Replaced shell command strings with `spawnSync(process.execPath, args, ...)` argument arrays.

## Skipped / deferred

None.

</details>

### Wave 2 — vertical slices

<details>
<summary><strong>V01 — Forking & state proxying end-to-end</strong></summary>

# Forking & state proxying end-to-end fix report

**Slice:** V01
**Type:** vertical
**Scope:** packages/state/src packages/blockchain/src packages/node/src packages/actions/src

## Summary

Addressed all six findings with scoped changes. Fork startup now resolves fork anchors to a concrete block hash/number pair, moving tags are pinned before state caching, and lazy fork reads verify that the pinned number still maps to the pinned hash. The RPC selector bugs were fixed, fork URL/reset now rebuilds fork-backed state and block caches, and access-list prefetch no longer stacks shared transport wrappers.

## Fixes applied

### [HIGH] Forks are pinned by block number, not block identity
**Location:** packages/node/src/createTevmNode.js:364
**Files modified:** packages/node/src/createTevmNode.js, packages/state/src/actions/resolveForkBlockTag.js, packages/state/src/state-types/ForkOptions.ts
**Issue:** Fork initialization stored only a block number, allowing later lazy state reads to cache data from a different upstream block at the same height.
**Fix:** Resolve the fork anchor to block number plus hash, initialize the blockchain from the hash, store the hash in fork options, and verify the hash before accepting lazy fork state reads.

### [HIGH] Moving `safe` and `finalized` fork tags poison the fork cache over time
**Location:** packages/node/src/createTevmNode.js:362
**Files modified:** packages/node/src/createTevmNode.js, packages/state/src/actions/resolveForkBlockTag.js
**Issue:** `safe` and `finalized` stayed as moving tags while fork cache entries were stored without versioning.
**Fix:** Resolve fork tags, including `latest`, `safe`, and `finalized`, to a concrete block number/hash before cacheable fork reads; `pending` is rejected for fork anchors.

### [HIGH] `eth_getBalance` ignores hex block numbers
**Location:** packages/actions/src/eth/getBalanceProcedure.js:21
**Files modified:** packages/actions/src/eth/getBalanceProcedure.js, packages/actions/src/eth/getBalanceHandler.js
**Issue:** The procedure passed hex quantities as `blockNumber`, but the handler only consumed `blockTag`.
**Fix:** Pass hex quantities as `blockTag` bigints and route historical balance lookups through `vm.blockchain.getBlockByTag`.

### [HIGH] `eth_getCode` treats short hex block numbers as block hashes on cache miss
**Location:** packages/actions/src/eth/getCodeHandler.js:33
**Files modified:** packages/actions/src/eth/getCodeHandler.js
**Issue:** Short hex quantities were converted to bytes and could be forwarded to the fork fetcher as block hashes.
**Fix:** Use `vm.blockchain.getBlockByTag`, which distinguishes 66-character hashes from shorter block quantities.

### [HIGH] Changing the fork RPC URL keeps old fork state and block caches
**Location:** packages/actions/src/anvil/anvilSetRpcUrlProcedure.js:57
**Files modified:** packages/actions/src/anvil/anvilSetRpcUrlProcedure.js, packages/actions/src/anvil/anvilResetProcedure.js, packages/actions/src/internal/resetForkState.js
**Issue:** Fork URL changes and resets reused old fork caches and blockchain maps.
**Fix:** Added a fork reset helper that rebuilds the fork-backed blockchain and state manager from the current transport and a fresh or explicit anchor, then rewired `anvil_setRpcUrl` and `anvil_reset` to use it.

### [MEDIUM] The storage prefetch proxy captures stale cloned VMs and stacks wrappers
**Location:** packages/actions/src/internal/setupPrefetchProxy.js:21
**Files modified:** packages/actions/src/internal/setupPrefetchProxy.js
**Issue:** Each access-list call permanently wrapped the shared fork transport and retained per-call cloned clients.
**Fix:** Removed transport monkey-patching and prefetch directly against the supplied client/access list.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>V02 — JSON-RPC eth_* method surface</strong></summary>

# JSON-RPC eth_* method surface fix report

**Slice:** V02
**Type:** vertical
**Scope:** packages/actions/src/eth packages/procedures/src packages/decorators/src/eip1193

## Summary

Seven findings were addressed with scoped source changes, covering fork receipt error/null handling, filter behavior, nullable lookup results, log filter ranges, topic wildcards, and the public blob fee schema name. Two findings were skipped as false positives in this checkout because the cited code already uses the conformant behavior. No build or test commands were run due to the slice constraints.

## Fixes applied

### [HIGH] Forked `eth_getTransactionReceipt` maps upstream receipt fields incorrectly
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:52
**Files modified:** packages/actions/src/eth/ethGetTransactionReceipt.js
**Issue:** The fork path did not explicitly handle upstream JSON-RPC errors or null receipt results.
**Fix:** Added fork error propagation and an explicit `null` return for missing upstream receipts; the standard upstream receipt field mapping was already present.

### [HIGH] `eth_newBlockFilter` never receives new blocks
**Location:** packages/actions/src/eth/ethNewBlockFilterProcedure.js:24
**Files modified:** packages/actions/src/eth/ethNewBlockFilterProcedure.js
**Issue:** Block filters stored a listener but never subscribed it to `newBlock` events.
**Fix:** Registered the listener with `client.on('newBlock', listener)` before installing the filter.

### [HIGH] Block filter changes return block numbers instead of hashes
**Location:** packages/actions/src/eth/ethGetFilterChangesProcedure.js:59
**Files modified:** packages/actions/src/eth/ethGetFilterChangesProcedure.js
**Issue:** `eth_getFilterChanges` returned block numbers for block filters.
**Fix:** Changed block filter results to return `bytesToHex(block.hash())`.

### [HIGH] Missing block/transaction-by-index lookups return errors instead of `null`
**Location:** packages/actions/src/eth/ethGetTransactionByBlockNumberAndIndexProcedure.js:32
**Files modified:** packages/actions/src/eth/ethGetBlockByNumberProcedure.js, packages/actions/src/eth/ethGetBlockByHashProcedure.js, packages/actions/src/eth/ethGetTransactionByBlockNumberAndIndexProcedure.js, packages/actions/src/eth/ethGetTransactionByBlockHashAndIndexProcedure.js
**Issue:** Missing blocks or transaction indexes returned JSON-RPC errors or uncaught block lookup exceptions.
**Fix:** Caught not-found block lookups and returned `{ result: null }` for absent blocks or transaction indexes.

### [MEDIUM] `eth_getFilterLogs` ignores the installed filter range
**Location:** packages/actions/src/eth/ethGetFilterLogsProcedure.js:26
**Files modified:** packages/actions/src/eth/ethGetFilterLogsProcedure.js
**Issue:** The procedure treated stored raw block criteria as block objects and fell back to genesis/latest.
**Fix:** Passed stored raw `fromBlock` and `toBlock` criteria through, while preserving compatibility with block-object criteria.

### [MEDIUM] `eth_newFilter` rejects valid `null` topic wildcards
**Location:** packages/actions/src/eth/ethNewFilterHandler.js:89
**Files modified:** packages/actions/src/eth/ethNewFilterHandler.js
**Issue:** Past-log topic conversion passed `null` wildcard topics to `hexToBytes`.
**Fix:** Preserved top-level `null` topics and only converted concrete hex topics.

### [MEDIUM] EIP-1193 public schema exposes the wrong blob fee method
**Location:** packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts:114
**Files modified:** packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts
**Issue:** The public schema advertised `eth_blobGasPrice` instead of the implemented `eth_blobBaseFee`.
**Fix:** Renamed the schema entry and example to `eth_blobBaseFee`.

## Skipped / deferred

### [HIGH] EIP-1559 receipts underreport `effectiveGasPrice`
**Reason:** false-positive
**Explanation:** The current local receipt path already computes `min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)` and falls back to `gasPrice` for legacy transactions.

### [MEDIUM] Falsy JSON-RPC ids are dropped across many eth procedures
**Reason:** false-positive
**Explanation:** The scoped eth procedures already use `id !== undefined` checks in this checkout; no remaining truthiness-based id spreads were found.

</details>

<details>
<summary><strong>V03 — JSON-RPC anvil_* method surface</strong></summary>

# JSON-RPC anvil_* method surface fix report

**Slice:** V03
**Type:** vertical
**Scope:** packages/actions/src/anvil packages/procedures/src

## Summary

Five findings were addressed with scoped source changes, including reset baseline restoration, dump/load round-trip compatibility, positional dropTransaction parameters, setStorageAt success results, and stopImpersonatingAccount account matching. One finding was a false positive because the Anvil procedures already preserve JSON-RPC id `0`. The remaining multi-account impersonation Set/admission behavior is deferred because the transaction admission checks live outside this slice.

## Fixes applied

### [HIGH] `anvil_reset` does not restore a clean chain baseline
**Location:** packages/actions/src/anvil/anvilResetProcedure.js:55
**Files modified:** packages/actions/src/anvil/anvilResetProcedure.js
**Issue:** Reset rebuilt state and blockchain from the live mutated VM.
**Fix:** Captured an initial snapshot when the reset procedure is created and restore that snapshot, metadata, blockchain, txpool, filters, receipts, and snapshots on reset.

### [HIGH] `anvil_dumpState` output cannot be loaded by `anvil_loadState`
**Location:** packages/actions/src/anvil/anvilDumpStateProcedure.js:13
**Files modified:** packages/actions/src/anvil/anvilLoadStateProcedure.js
**Issue:** `anvil_dumpState` returned Tevm serialized account objects while `anvil_loadState` only accepted RLP account hex strings.
**Fix:** Added a load path that detects the dumped object format and delegates to the existing Tevm load-state procedure while preserving the legacy RLP path.

### [HIGH] Impersonation is a single global slot and stop ignores the requested account
**Location:** packages/actions/src/anvil/anvilStopImpersonatingAccountProcedure.js:8
**Files modified:** packages/actions/src/anvil/anvilStopImpersonatingAccountProcedure.js
**Issue:** `anvil_stopImpersonatingAccount` cleared the active impersonation regardless of the supplied account.
**Fix:** Validated the supplied address and only cleared the impersonated account when it matches the currently active account.

### [MEDIUM] `anvil_dropTransaction` uses a non-Anvil parameter shape
**Location:** packages/actions/src/anvil/anvilDropTransactionProcedure.js:13
**Files modified:** packages/actions/src/anvil/anvilDropTransactionProcedure.js, packages/actions/src/anvil/AnvilJsonRpcRequest.ts
**Issue:** The handler expected `{ transactionHash }` instead of Anvil's positional transaction hash.
**Fix:** Accepted the positional hash, retained backward compatibility for the object shape, validated the hash, and returned JSON-RPC errors for invalid or missing txpool entries.

### [MEDIUM] `anvil_setStorageAt` reports `null` instead of success
**Location:** packages/actions/src/anvil/anvilSetStorageAtProcedure.js:32
**Files modified:** packages/actions/src/anvil/anvilSetStorageAtProcedure.js, packages/actions/src/anvil/AnvilResult.ts
**Issue:** Successful writes returned `null` instead of Anvil's boolean success value.
**Fix:** Returned `true` after a successful `tevm_setAccount` storage write and updated the result type.

## Skipped / deferred

### [HIGH] Impersonation is a single global slot and stop ignores the requested account
**Reason:** out-of-scope
**Explanation:** The full Foundry-compatible multi-account Set requires changes to Tevm node impersonation storage and transaction admission checks outside `packages/actions/src/anvil` and `packages/procedures/src`.

### [MEDIUM] Several handlers drop valid JSON-RPC id `0`
**Reason:** false-positive
**Explanation:** The scoped Anvil procedures already use `request.id !== undefined` (or equivalent) rather than truthiness checks, so id `0` is preserved.

</details>

<details>
<summary><strong>V04 — JSON-RPC debug_* and tevm_* methods</strong></summary>

# JSON-RPC debug_* and tevm_* methods fix report

**Slice:** V04
**Type:** vertical
**Scope:** packages/actions/src/debug packages/actions/src/tevm packages/actions/src/tevm-request-handler packages/procedures/src

## Summary

Addressed 4 real findings with narrow source changes and skipped 3 findings that were already absent in the current code. The fixes focus on returning JSON-RPC errors instead of throwing, replaying historical state for `debug_storageRangeAt`, keeping the debug method request map aligned with implemented methods, and failing modified-account requests when required historical state is unavailable.

## Fixes applied

### [HIGH] Missing transactions crash `debug_traceTransaction` instead of returning JSON-RPC errors
**Location:** packages/actions/src/debug/debugTraceTransactionProcedure.js:95
**Files modified:** packages/actions/src/debug/debugTraceTransactionProcedure.js
**Issue:** Unknown transaction hashes returned `result: null`, then the procedure dereferenced `result.blockHash`.
**Fix:** Added a null-result check that returns a JSON-RPC `-32602` "Transaction not found" error with the original request id preserved.

### [HIGH] `debug_storageRangeAt` ignores the requested block state and transaction index
**Location:** packages/actions/src/debug/debugStorageRangeAtHandler.js:76
**Files modified:** packages/actions/src/debug/debugStorageRangeAtHandler.js
**Issue:** The handler resolved the block but dumped storage from the current VM state and ignored `txIndex`.
**Fix:** Reconstructs a cloned VM at the parent state root, replays transactions through the requested index, rejects out-of-range indexes, and dumps storage from the positioned clone.

### [MEDIUM] Implemented debug methods are missing from `JsonRpcRequestTypeFromMethod`
**Location:** packages/actions/src/tevm-request-handler/DebugRequestType.ts:11
**Files modified:** packages/actions/src/tevm-request-handler/DebugRequestType.ts
**Issue:** The debug request method map only included four methods even though the runtime and response maps support the wider debug surface.
**Fix:** Added all implemented debug request types to `DebugRequestType`, matching the existing debug response map.

### [MEDIUM] Missing historical state roots produce false modified-account results
**Location:** packages/actions/src/debug/debugGetModifiedAccountsByNumberHandler.js:76
**Files modified:** packages/actions/src/debug/debugGetModifiedAccountsByNumberHandler.js, packages/actions/src/debug/debugGetModifiedAccountsByHashHandler.js
**Issue:** Missing requested state roots were treated as empty state objects, producing plausible but false diffs.
**Fix:** Both number-based and hash-based handlers now throw when either requested state root is unavailable or not cached.

## Skipped / deferred

### [HIGH] `debug_traceTransaction` traces the transaction against post-block state
**Reason:** duplicate
**Explanation:** Already addressed in the current code before this slice: `debugTraceTransactionProcedure.js` calls `traceCallHandler` with the pre-positioned VM clone and does not pass `blockTag`, so `traceCallHandler` does not reset to the block's final state root.

### [HIGH] Block and chain tracing reset every transaction trace to the block's final state
**Reason:** duplicate
**Explanation:** Already addressed in the current code before this slice: `debugTraceBlockProcedure.js` and `debugTraceChainProcedure.js` call `traceCallHandler` with their replay VM clones and do not pass `blockTag`.

### [MEDIUM] Many debug procedures drop valid JSON-RPC id `0`
**Reason:** false-positive
**Explanation:** The scoped debug procedures now consistently use `request.id !== undefined`; no remaining `request.id ?` truthiness checks were found under the scoped paths.

</details>

<details>
<summary><strong>V05 — Solidity bundler pipeline (resolve→compile→codegen)</strong></summary>

# Solidity bundler pipeline (resolve→compile→codegen) fix report

**Slice:** V05
**Type:** vertical
**Scope:** bundler-packages/base-bundler bundler-packages/compiler bundler-packages/resolutions bundler-packages/runtime bundler-packages/config

## Summary

Three findings were addressed with scoped source changes: bytecode declaration accuracy, indented Solidity import matching, and config merge mutation. Three high-severity findings were skipped as false positives in the current checkout because the cited code had already been changed to avoid the reviewed behavior. No build or test commands were run due to the slice constraints.

## Fixes applied

### [HIGH] Indented Solidity imports are missed by dependency discovery
**Location:** bundler-packages/resolutions/src/resolveImports.js:52
**Files modified:** bundler-packages/resolutions/src/resolveImports.js, bundler-packages/resolutions/src/utils/updateImportPath.js
**Issue:** Import discovery and rewrite regexes only accepted zero or one leading whitespace character before `import`.
**Fix:** Changed both regexes to use `^\s*import\b` with a bounded path capture, while preserving the existing behavior of ignoring imports inside block comments.

### [MEDIUM] Bytecode declarations claim deployability even when artifacts omit bytecode
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:63
**Files modified:** bundler-packages/runtime/src/generateTevmBodyDts.js
**Issue:** Declaration output typed bytecode and deployed bytecode as present for every contract whenever bytecode generation was enabled.
**Fix:** Derived each bytecode generic from the same `evm.bytecode.object` and `evm.deployedBytecode.object` checks used by runtime JS generation.

### [MEDIUM] Config merging mutates precedence while reading scalar options
**Location:** bundler-packages/config/src/config/mergeConfigs.js:21
**Files modified:** bundler-packages/config/src/config/mergeConfigs.js
**Issue:** `mergeConfigs` mutated the input config array with repeated `reverse()` calls, changing precedence for later fields.
**Fix:** Created one reversed copy for scalar last-config-wins lookups and left the original input order intact for remappings and libs.

## Skipped / deferred

### [HIGH] Declaration output uses value initializers that are illegal in `.d.ts`
**Reason:** false-positive
**Explanation:** The current `generateTevmBodyDts.js` already emits ambient `declare const` helper declarations and `export declare const artifacts` without value initializers. No source change was needed for this finding.

### [HIGH] Pragma rewriting can invert or widen the source's compiler constraint
**Reason:** false-positive
**Explanation:** The current `updatePragma.js` validates that a pragma exists and returns the Solidity source unchanged; it no longer rewrites pragmas to `>=${version}`. No source change was needed for this finding.

### [HIGH] Overlapping remappings resolve by insertion order instead of longest prefix
**Reason:** false-positive
**Explanation:** The current `resolveImportPath.js` sorts remapping entries by descending key length before matching, so the longer overlapping prefix wins. No source change was needed for this finding.

</details>

<details>
<summary><strong>V06 — Bundler caching strategy</strong></summary>

# Bundler caching strategy fix report

**Slice:** V06
**Type:** vertical
**Scope:** bundler-packages/bundler-cache bundler-packages/base-bundler

## Summary

Four findings were addressed with scoped cache fixes, and one finding was skipped as already addressed by the current base-bundler fingerprint plumbing. The applied fixes add artifact/source hashing, publish cache metadata after artifact writes, tighten bytecode hit validation, and namespace absolute cache roots by project.

## Fixes applied

### [HIGH] Async writes can publish valid metadata before matching artifacts
**Location:** bundler-packages/bundler-cache/src/writeArtifacts.js:65
**Files modified:** bundler-packages/bundler-cache/src/writeArtifacts.js, bundler-packages/bundler-cache/src/writeArtifactsSync.js, bundler-packages/bundler-cache/src/readArtifacts.js, bundler-packages/bundler-cache/src/readArtifactsSync.js, bundler-packages/bundler-cache/src/types.ts, bundler-packages/bundler-cache/src/cacheHash.js, bundler-packages/bundler-cache/src/writeArtifacts.spec.ts, bundler-packages/bundler-cache/src/writeArtifactsSync.spec.ts, bundler-packages/bundler-cache/src/readArtifacts.spec.ts, bundler-packages/bundler-cache/src/readArtifactsSync.spec.ts, bundler-packages/bundler-cache/src/createCache.spec.ts
**Issue:** `artifacts.json` and `metadata.json` could be written independently, allowing readers to accept mismatched cache pairs.
**Fix:** Artifacts are written before metadata, optional atomic rename is used when available, and metadata now embeds an artifact hash that readers verify before returning a cache hit.

### [HIGH] Bytecode cache hits are accepted without checking bytecode content
**Location:** bundler-packages/base-bundler/src/readCache.js:43
**Files modified:** bundler-packages/base-bundler/src/readCache.js, bundler-packages/base-bundler/src/readCacheSync.js, bundler-packages/base-bundler/src/readCache.spec.ts, bundler-packages/base-bundler/src/readCacheSync.spec.ts
**Issue:** Cache hits with a truthy bytecode container but no bytecode object could satisfy `includeBytecode`.
**Fix:** Bytecode validation now requires non-empty bytecode content in `evm.bytecode` or `evm.deployedBytecode`.

### [MEDIUM] Mtime-only invalidation can miss source content changes
**Location:** bundler-packages/bundler-cache/src/readArtifacts.js:75
**Files modified:** bundler-packages/bundler-cache/src/writeArtifacts.js, bundler-packages/bundler-cache/src/writeArtifactsSync.js, bundler-packages/bundler-cache/src/readArtifacts.js, bundler-packages/bundler-cache/src/readArtifactsSync.js, bundler-packages/bundler-cache/src/cacheHash.js, bundler-packages/bundler-cache/src/writeArtifacts.spec.ts, bundler-packages/bundler-cache/src/writeArtifactsSync.spec.ts, bundler-packages/bundler-cache/src/readArtifacts.spec.ts, bundler-packages/bundler-cache/src/readArtifactsSync.spec.ts, bundler-packages/bundler-cache/src/createCache.spec.ts
**Issue:** Source validation only compared `mtimeMs`, so same-mtime content changes could reuse stale artifacts.
**Fix:** Metadata now stores source `mtimeMs`, `size`, and a content hash when source content is available; readers verify those fields before accepting artifacts.

### [MEDIUM] Absolute shared cache directories can collide across projects
**Location:** bundler-packages/bundler-cache/src/getArtifactsPath.js:44
**Files modified:** bundler-packages/bundler-cache/src/getArtifactsPath.js, bundler-packages/bundler-cache/src/getMetadataPath.js, bundler-packages/bundler-cache/src/cacheHash.js, bundler-packages/bundler-cache/src/getArtifactsPath.spec.ts, bundler-packages/bundler-cache/src/getMetadataPath.spec.ts
**Issue:** Absolute cache roots reused the same relative contract path namespace across projects.
**Fix:** Absolute cache roots now include a stable project-root hash namespace before the relative entry path.

## Skipped / deferred

### [HIGH] Cache validity ignores config and compiler inputs
**Reason:** duplicate
**Explanation:** The current code already computes and passes a `compileFingerprint` through `resolveModuleAsync`, `resolveModuleSync`, `readCache`, `writeCache`, and `bundler-cache` metadata, covering the resolved config fields, remappings/libs, solc version, and output-selection flags. The remaining source-graph validation concern is covered by the source content hash fix above; contract package selection affects regenerated runtime code, not the cached artifacts returned by `readCache`.

</details>

<details>
<summary><strong>V07 — Hardfork readiness, gates, transitions</strong></summary>

# Hardfork readiness, gates, transitions fix report

**Slice:** V07
**Type:** vertical
**Scope:** packages/common packages/vm packages/evm

## Summary

Four findings were addressed with narrow source changes, and one finding was skipped as already addressed in the current tree. The fixes tighten typed transaction EIP gates, prevent pre-Shanghai withdrawal block data and state mutation, make block-level fork effects follow the block common, and provide the missing max blob gas parameter used by Cancun blob admission.

## Fixes applied

### [HIGH] Typed transactions are accepted when EIP-2718 is inactive
**Location:** packages/vm/src/actions/validateRunTx.js:59
**Files modified:** packages/vm/src/actions/validateRunTx.js
**Issue:** Typed transactions could bypass the base EIP-2718 activation check on pre-Berlin forks.
**Fix:** Added an explicit EIP-2718 rejection before per-type gates, and added specific EIP-2930, EIP-1559, EIP-4844, and EIP-7702 checks.

### [HIGH] Pre-Shanghai block building always emits a withdrawals field
**Location:** packages/vm/src/actions/BlockBuilder.ts:364
**Files modified:** packages/vm/src/actions/BlockBuilder.ts
**Issue:** Pre-Shanghai builders emitted `withdrawals: []`, and provided withdrawals could be processed before the block constructor rejected them.
**Fix:** Reject provided withdrawals during builder construction when EIP-4895 is inactive, only process withdrawals when EIP-4895 is active, and only include the block `withdrawals` field for EIP-4895 blocks.

### [HIGH] Blob block building rejects valid blocks above the target blob gas
**Location:** packages/vm/src/actions/BlockBuilder.ts:236
**Files modified:** packages/common/src/createCommon.js
**Issue:** The builder already uses `maxBlobGasPerBlock`, but custom commons did not provide the max blob gas parameter required by that schedule.
**Fix:** Added the Cancun `maxBlobGasPerBlock` parameter to `createCommon` so max blob gas admission has a defined value distinct from the target.

### [MEDIUM] System-contract fork effects are gated by VM common instead of block common
**Location:** packages/vm/src/actions/applyBlock.ts:47
**Files modified:** packages/vm/src/actions/applyBlock.ts
**Issue:** EIP-4788, EIP-2935, and EIP-4895 block-level state effects were selected from the VM common rather than the block common.
**Fix:** Switched these block-level activation checks to `block.common.ethjsCommon`.

## Skipped / deferred

### [HIGH] Block transaction execution bypasses hardfork validation and uses the VM fork
**Reason:** duplicate
**Explanation:** The current code already has the recent audit fix: `runBlock` honors `opts.setHardfork` through `setRunBlockHardfork`, syncs VM/EVM/block commons for the execution scope, and `applyTransactions` defaults `skipHardForkValidation` to `false`.

</details>

<details>
<summary><strong>V08 — EIP-7702 (delegated authorization) e2e</strong></summary>

# EIP-7702 (delegated authorization) e2e fix report

**Slice:** V08
**Type:** vertical
**Scope:** packages/vm/src/actions/runTx.ts packages/tx packages/evm packages/actions packages/memory-client/src/test/viem/setCode.spec.ts

## Summary

Addressed three of the five findings with narrow changes in `packages/actions`. The raw transaction paths now surface automining failures for EIP-7702, and JSON-RPC transaction serialization preserves mined authorization lists. One `eth_sendTransaction` issue was deferred because a correct fix requires a real type-4 signed/impersonated construction path, and one receipt gas finding was a false positive against the current code.

## Fixes applied

### [HIGH] Raw transaction RPC reports success even when pool insertion or automining fails
**Location:** packages/actions/src/eth/ethSendRawTransactionProcedure.js:31
**Files modified:** packages/actions/src/eth/ethSendRawTransactionProcedure.js
**Issue:** The current tree already checked pool insertion, but still ignored `handleAutomining` errors before returning a successful hash.
**Fix:** Checked the automining result and returned a JSON-RPC error with the mining error details when mining fails.

### [HIGH] The exported raw-transaction handler bypasses automining for EIP-7702
**Location:** packages/actions/src/eth/ethSendRawTransactionHandler.js:88
**Files modified:** packages/actions/src/eth/ethSendRawTransactionHandler.js
**Issue:** Type-4 raw transactions were added to the pool and returned immediately even when client automining was enabled.
**Fix:** Ran the shared automining helper after successful type-4 pool insertion and surfaced any mining errors.

### [MEDIUM] Mined 7702 transactions lose `authorizationList` in JSON-RPC transaction objects
**Location:** packages/actions/src/utils/txToJsonRpcTx.js:21
**Files modified:** packages/actions/src/utils/txToJsonRpcTx.js, packages/actions/src/common/TransactionResult.ts
**Issue:** The JSON-RPC transaction serializer omitted `authorizationList` from mined type-4 transactions.
**Fix:** Included `authorizationList` from `tx.toJSON()` when present and added it to the transaction result type.

## Skipped / deferred

### [HIGH] `eth_sendTransaction` drops EIP-7702 authorization lists before execution
**Reason:** too-risky-to-auto-fix
**Explanation:** The issue is real, but forwarding the fields alone would still be wrong because `ethSendTransactionHandler` ultimately routes through `callHandler`, which creates an impersonated EIP-1559 transaction. A correct fix needs a deliberate type-4 signed or impersonated transaction construction path; the existing `createImpersonatedTx` helper only creates EIP-1559 transactions.

### [MEDIUM] Receipt gas accounting underreports `effectiveGasPrice` for 7702 transactions
**Reason:** false-positive
**Explanation:** The current code computes `effectiveGasPrice` as `min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)`, which is equivalent to `min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas) + baseFeePerGas` for EIP-1559/type-4 transactions. It does not return `maxPriorityFeePerGas` directly in the cited branch.

</details>

<details>
<summary><strong>V09 — EIP-3155 trace comparison tooling</strong></summary>

# EIP-3155 trace comparison tooling fix report

**Slice:** V09
**Type:** vertical
**Scope:** test/eip3155 packages/vm/src packages/evm/src

## Summary

All five findings were verified as real and addressed with scoped fixes. The trace comparison tooling now compares final summaries, handles summary-only traces, canonicalizes opcode names, and accepts numeric opcode strings. `RunTxResult.gasRefund` now reports the effective capped refund that is actually applied to gas spent.

## Fixes applied

### [HIGH] Trace comparison ignores final execution summaries
**Location:** test/eip3155/trace-tools.mjs:270
**Files modified:** test/eip3155/trace-tools.mjs, test/eip3155/trace-tools.test.mjs
**Issue:** Matching opcode steps could pass even when normalized final summary fields differed.
**Fix:** Extended divergence detection to compare normalized summary fields after step comparison and added regression coverage.

### [HIGH] `RunTxResult.gasRefund` reports the uncapped refund
**Location:** packages/vm/src/actions/runTx.ts:426
**Files modified:** packages/vm/src/actions/runTx.ts
**Issue:** `results.gasRefund` was assigned before the protocol refund cap was applied.
**Fix:** Moved assignment until after the cap so the public result reports the effective refund used in `totalGasSpent`.

### [MEDIUM] Zero-step executions are marked as no coverage instead of compared
**Location:** test/eip3155/trace-tools.mjs:302
**Files modified:** test/eip3155/trace-tools.mjs, test/eip3155/trace-tools.test.mjs
**Issue:** Summary-only or one-sided step traces were skipped instead of compared.
**Fix:** Only skip traces when both sides have no steps and no normalized summary; otherwise run normal divergence comparison.

### [MEDIUM] Opcode aliases are preserved as false divergences
**Location:** test/eip3155/trace-tools.mjs:199
**Files modified:** test/eip3155/trace-tools.mjs, test/eip3155/trace-tools.test.mjs
**Issue:** Equivalent opcode aliases such as `SHA3` and `KECCAK256` retained different `opName` values.
**Fix:** Canonicalized `opName` from the resolved numeric opcode before comparison.

### [LOW] Numeric string opcodes are rejected despite parser support
**Location:** test/eip3155/trace-tools.mjs:200
**Files modified:** test/eip3155/trace-tools.mjs, test/eip3155/trace-tools.test.mjs
**Issue:** Numeric opcode strings were treated as mnemonics and failed opcode lookup.
**Fix:** Detect numeric opcode strings before mnemonic resolution and convert them to numeric opcodes.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>V10 — TypeScript LSP / Solidity type inference</strong></summary>

# TypeScript LSP / Solidity type inference fix report

**Slice:** V10
**Type:** vertical
**Scope:** lsp/ts-plugin lsp/lsp lsp/vscode bundler-packages/runtime

## Summary

Four findings were addressed with scoped fixes, one finding was already addressed in the inspected code, and one was deferred as too risky for an automatic narrow patch. The applied fixes make editor snapshots participate in Solidity cache invalidation, make the Volar path compile the active snapshot, resolve Foundry-style remap targets as project paths, and keep `.s.sol` declaration bytecode types aligned with artifact contents.

## Fixes applied

### [HIGH] tsserver plugin can serve stale types for unsaved Solidity edits
**Location:** lsp/ts-plugin/src/tsPlugin.ts:49
**Files modified:** lsp/ts-plugin/src/tsPlugin.ts, lsp/ts-plugin/src/factories/fileAccessObject.ts
**Issue:** Cache validation used disk mtimes while compilation could read unsaved language-service snapshots.
**Fix:** The cache file access object now derives source-file mtimes from TypeScript script snapshots, and the plugin passes the language service host into that cache path.

### [HIGH] Volar LSP ignores the document snapshot it is asked to update
**Location:** lsp/lsp/src/SolFile.ts:35
**Files modified:** lsp/lsp/src/SolFile.ts
**Issue:** The embedded TypeScript file was generated from disk reads instead of the active Volar snapshot.
**Fix:** The LSP file access object now serves the active `.sol` file from the current snapshot and uses a snapshot-derived mtime for cache validation.

### [MEDIUM] Foundry-style remapped imports are resolved as npm packages
**Location:** lsp/ts-plugin/src/utils/solidityModuleResolver.ts:37
**Files modified:** lsp/ts-plugin/src/decorators/resolveModuleNameLiterals.ts, lsp/ts-plugin/src/utils/solidityModuleResolver.ts
**Issue:** Remapped path-like Solidity imports such as `lib/...` were sent through Node package resolution.
**Fix:** Remapping selection now uses the longest prefix, and path-like remap targets resolve relative to the project root.

### [MEDIUM] `.s.sol` declarations claim bytecode exists for every artifact
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:63
**Files modified:** bundler-packages/runtime/src/generateTevmBodyDts.js
**Issue:** Declarations for script imports could overstate bytecode availability for interfaces or abstract artifacts.
**Fix:** Bytecode and deployed-bytecode generic parameters are artifact-aware, and artifacts with no usable bytecode are labeled as no-bytecode declarations.

## Skipped / deferred

### [HIGH] Standalone LSP imports a cache API from the wrong package
**Reason:** false-positive
**Explanation:** The inspected code already imports `createCache` from `@tevm/bundler-cache`, and `lsp/lsp/package.json` already lists both `@tevm/base-bundler` and `@tevm/bundler-cache` in `dependencies`.

### [MEDIUM] Go-to-definition matches Solidity members by bare name across all ASTs
**Reason:** too-risky-to-auto-fix
**Explanation:** A correct fix needs contract-symbol, ABI member, overload, and inheritance-linearization context that the current decorator does not carry. A narrow name-filter change would risk dropping valid inherited definitions or preserving wrong jumps for overloaded members.

</details>

<details>
<summary><strong>V11 — Test infrastructure (matchers, conformance, hive)</strong></summary>

# Test infrastructure (matchers, conformance, hive) fix report

**Slice:** V11
**Type:** vertical
**Scope:** test/test-matchers test/conformance-utils test/hardfork-conformance test/eip3155 test/hive extensions/test-matchers extensions/test-node

## Summary

Five findings were addressed with scoped source changes. One EIP-3155 finding was skipped because the current workspace already compares normalized trace summaries by the final verification pass. No tests or build commands were run, per the slice constraints.

## Fixes applied

### [HIGH] Concurrent snapshot autosaves can lose cached RPC entries
**Location:** extensions/test-node/src/snapshot/SnapshotManager.ts:96
**Files modified:** extensions/test-node/src/snapshot/SnapshotManager.ts
**Issue:** Concurrent saves could serialize older snapshot state and rename it after a newer save.
**Fix:** Added a per-manager save promise queue so each write snapshots the latest in-memory map only after earlier writes finish.

### [HIGH] Native balance changes for created or deleted accounts are reported as zero
**Location:** extensions/test-matchers/src/matchers/balance/getBalanceChange.ts:7
**Files modified:** extensions/test-matchers/src/matchers/balance/getBalanceChange.ts
**Issue:** Missing pre or post accounts were treated as no balance change.
**Fix:** Treat a missing side as zero balance and return zero only when both sides are absent.

### [HIGH] `toBeRevertedWithError` throws an internal selector error for successful transactions
**Location:** extensions/test-matchers/src/matchers/errors/toBeRevertedWithError.ts:33
**Files modified:** extensions/test-matchers/src/matchers/errors/toBeRevertedWithError.ts
**Issue:** Selector extraction failed before the matcher handled non-reverted transactions.
**Fix:** Removed the early internal throw and return normal matcher failures when the transaction did not revert or has no selector.

### [MEDIUM] ABI argument matchers reject valid array/tuple arguments by reference
**Location:** extensions/test-matchers/src/matchers/contract/withFunctionArgs.ts:41
**Files modified:** extensions/test-matchers/src/matchers/utils/deepEqual.ts, extensions/test-matchers/src/matchers/contract/withFunctionArgs.ts, extensions/test-matchers/src/matchers/contract/withFunctionNamedArgs.ts, extensions/test-matchers/src/matchers/events/withEventArgs.ts, extensions/test-matchers/src/matchers/events/withEventNamedArgs.ts, extensions/test-matchers/src/matchers/errors/withErrorArgs.ts, extensions/test-matchers/src/matchers/errors/withErrorNamedArgs.ts
**Issue:** Decoded ABI values were compared with reference equality, rejecting equal arrays, tuples, and nested values.
**Fix:** Added a small local deep-equality helper and used it in positional and named function, event, and error argument matchers.

### [MEDIUM] Expected invalid conformance transactions are always marked as runner failures
**Location:** test/conformance-utils/run-fixture-suite.mjs:427
**Files modified:** test/conformance-utils/run-fixture-suite.mjs
**Issue:** Expected transaction exceptions were reported as harness failures instead of validating unchanged post-state evidence.
**Fix:** Detect expected exception metadata and, on transaction construction or runner exceptions, compare the pre-state root and empty logs against the expected post vector.

## Skipped / deferred

### [MEDIUM] EIP-3155 comparisons ignore final summary/output differences
**Reason:** false-positive
**Explanation:** The current `test/eip3155/trace-tools.mjs` already compares normalized summary fields after opcode steps and reports summary divergences with `index: 'summary'`, so no source edit was needed.

</details>

<details>
<summary><strong>V12 — Memory client public API</strong></summary>

# Memory client public API fix report

**Slice:** V12
**Type:** vertical
**Scope:** packages/memory-client packages/node packages/decorators packages/client-types

## Summary

Three findings were addressed with narrow changes in `packages/memory-client`: the fork-without-common return type, public chain id coherence for `fork.chainId`, and a stale mining default doc line. Three findings were skipped as false positives against the current tree because the cited behavior is already corrected.

## Fixes applied

### [HIGH] Forked clients without `common` are typed as having a chain even though runtime omits it
**Location:** packages/memory-client/src/CreateMemoryClientFn.ts:84
**Files modified:** packages/memory-client/src/CreateMemoryClientFn.ts
**Issue:** Forking with a transport but no `common` returned a `MemoryClient<Common & Chain, ...>` type even though runtime omits `client.chain`.
**Fix:** Added a narrow overload for fork-without-common options that returns `MemoryClient<undefined, ...>`.

### [HIGH] `fork.chainId` override changes the node chain id but not the public viem client chain
**Location:** packages/memory-client/src/createMemoryClient.js:322
**Files modified:** packages/memory-client/src/createMemoryClient.js, packages/memory-client/src/createTevmTransport.js
**Issue:** A `fork.chainId` override could leave `client.chain.id` and the transport cache key using the original `common.id`.
**Fix:** Derived the public viem chain/common from the effective `fork.chainId` override and keyed the TEVM transport cache by that override when present.

### [MEDIUM] Public mining examples use an ignored option and describe the wrong default
**Location:** packages/memory-client/src/createMemoryClient.js:177
**Files modified:** packages/memory-client/src/createMemoryClient.js
**Issue:** The mining mode docs still described manual mining as the default even though the runtime default is auto mining.
**Fix:** Removed the stale "default" label from the manual mining example; the current source already documents and normalizes `miningConfig`.

## Skipped / deferred

### [MEDIUM] `cacheTime` is part of the public options but is always overwritten
**Reason:** false-positive
**Explanation:** The current implementation uses `cacheTime: normalizedOptions.cacheTime ?? 0`, so caller-provided `cacheTime` is honored.

### [MEDIUM] The exported EIP-1193 provider type omits runtime-supported TEVM methods
**Reason:** false-positive
**Explanation:** `Eip1193RequestProvider` already includes `JsonRpcSchemaTevm['tevm_mine']` in the request schema.

### [LOW] `requestEip1193` retries every provider error before viem can classify it
**Reason:** false-positive
**Explanation:** `requestEip1193` no longer wraps the request procedure in `withRetry`; it directly invokes the handler and converts JSON-RPC errors to `ProviderRpcError`.

</details>

<details>
<summary><strong>V13 — Predeploys & precompiles correctness</strong></summary>

# Predeploys & precompiles correctness fix report

**Slice:** V13
**Type:** vertical
**Scope:** packages/predeploys packages/precompiles

## Summary

Addressed five findings with source changes in `packages/precompiles`: P-256 gas/failure/signature handling, handler-declared error handling, and overloaded event log encoding. Two findings were skipped as false positives in the current checkout, and the fork-gated P-256 registration concern was deferred because the required registration wiring is outside this slice's allowed paths.

## Fixes applied

### [HIGH] P-256 gas accounting is non-canonical and underfunded calls are not rejected
**Location:** packages/precompiles/src/p256verify.precompile.ts:14
**Files modified:** packages/precompiles/src/p256verify.precompile.ts
**Issue:** The local P-256 precompile charged `3450n` and did not reject calls whose gas limit was below the fixed precompile cost.
**Fix:** Updated the fixed gas cost to `6900n` and added an out-of-gas `ExecResult` that consumes the provided gas limit for underfunded calls.

### [HIGH] P-256 failure return data is wrong
**Location:** packages/precompiles/src/p256verify.precompile.ts:37
**Files modified:** packages/precompiles/src/p256verify.precompile.ts
**Issue:** Invalid input, invalid signatures, and verification exceptions returned a 32-byte zero word instead of empty return data.
**Fix:** Changed every non-success P-256 path to return `new Uint8Array()` while preserving the 32-byte `1` word for successful verification.

### [HIGH] P-256 rejects valid high-S signatures
**Location:** packages/precompiles/src/p256verify.precompile.ts:68
**Files modified:** packages/precompiles/src/p256verify.precompile.ts
**Issue:** The precompile needed explicit P-256 subgroup-order validation while allowing high-S signatures.
**Fix:** Added `0 < r,s < n` validation and kept Noble verification configured with `lowS: false`.

### [MEDIUM] Handler errors are forced through successful return encoding
**Location:** packages/precompiles/src/defineCall.ts:83
**Files modified:** packages/precompiles/src/defineCall.ts
**Issue:** Handler-declared errors were still encoded as successful ABI returns, which could throw and replace the original error.
**Fix:** Bypassed success-result encoding when `error` is present and returned an EVM revert result preserving handler gas usage.

### [MEDIUM] Overloaded events can be encoded with the wrong ABI item
**Location:** packages/precompiles/src/logToEthjsLog.ts:30
**Files modified:** packages/precompiles/src/logToEthjsLog.ts
**Issue:** Log data encoding used the first event ABI item with a matching name, which could differ from the event signature used for topics.
**Fix:** Resolved overloaded event ABI items by matching each candidate's encoded signature topic against the topic emitted for the log, then used that same item for non-indexed data encoding.

## Skipped / deferred

### [HIGH] P-256 gas accounting is non-canonical and underfunded calls are not rejected
**Reason:** out-of-scope
**Explanation:** The fork-gated availability/registration portion requires changing node or VM registration wiring outside `packages/predeploys` and `packages/precompiles`, so it was deferred under the slice constraints.

### [HIGH] Malformed custom precompile calldata escapes as a JavaScript exception
**Reason:** false-positive
**Explanation:** In the current code, `decodeFunctionData` already runs inside the `try` block in `packages/precompiles/src/defineCall.ts`, so malformed calldata is converted into an `ExecResult` instead of escaping as a host exception.

### [LOW] `definePredeploy` examples describe a different API than the implementation
**Reason:** false-positive
**Explanation:** The current examples in both `packages/predeploys/src/definePredeploy.js` and `packages/predeploys/src/DefinePredeployFn.ts` already call `definePredeploy(createContract(...).withAddress(...))` and use `customPredeploys`, matching the implementation.

</details>

<details>
<summary><strong>V14 — Viem extension integration</strong></summary>

# Viem extension integration fix report

**Slice:** V14
**Type:** vertical
**Scope:** extensions/viem packages/memory-client packages/decorators

## Summary

Six findings were addressed with scoped fixes in the viem extension and memory-client runtime barrel. One high-severity finding was a false positive against the current checkout because `getAccount` already used `tevm_getAccount` and forwarded the supplied params. No build or test commands were run per the slice constraints.

## Fixes applied

### [HIGH] Optimistic writes call an unsupported Tevm JSON-RPC method
**Location:** extensions/viem/src/tevmViemExtensionOptimistic.js:83
**Files modified:** extensions/viem/src/tevmViemExtensionOptimistic.js, extensions/viem/src/tevmViemExtensionOptimistic.spec.ts, extensions/viem/src/ViemTevmExtension.ts
**Issue:** `writeContractOptimistic` called unsupported `tevm_contract` with a raw viem action object.
**Fix:** It now encodes the function data, maps viem `address` to Tevm `to`, forwards supported transaction fields, and calls `tevm_call` with array-wrapped params.

### [HIGH] The call adapter silently drops transaction and caller semantics
**Location:** extensions/viem/src/tevmViemExtension.js:135
**Files modified:** extensions/viem/src/tevmViemExtension.js
**Issue:** `getCallArgs` omitted Tevm call fields such as `from`, transaction creation flags, fee fields, and state/block overrides.
**Fix:** The adapter now forwards those fields with explicit `undefined` checks and serializes state/block overrides in the JSON-RPC positions expected by `tevm_call`.

### [HIGH] `setAccount` cannot clear balances/nonces and drops storage updates
**Location:** extensions/viem/src/tevmViemExtension.js:120
**Files modified:** extensions/viem/src/tevmViemExtension.js
**Issue:** The current code already preserved `0n` balances/nonces, but it still dropped `state` and `stateDiff` storage updates.
**Fix:** `setAccount` now includes `state` and `stateDiff` when present.

### [MEDIUM] Runtime and TypeScript barrels disagree on `tevmDeal`
**Location:** packages/memory-client/src/index.js:1
**Files modified:** packages/memory-client/src/index.js
**Issue:** The JS runtime barrel did not export `tevmDeal` even though the TS barrel did.
**Fix:** Added the missing `tevmDeal` named export to `packages/memory-client/src/index.js`.

### [MEDIUM] Undefined block tags are rewritten to `pending`
**Location:** extensions/viem/src/tevmViemExtension.js:8
**Files modified:** extensions/viem/src/tevmViemExtension.js, extensions/viem/src/tevmViemExtension.spec.ts
**Issue:** Omitted block tags in eth read adapters defaulted to `pending` instead of normal latest-state reads.
**Fix:** `formatBlockTag(undefined)` now returns `latest`, and the affected spec expectation was updated.

### [LOW] JSON-RPC id `0` is dropped from wrapped responses
**Location:** extensions/viem/src/tevmViemExtension.js:66
**Files modified:** extensions/viem/src/tevmViemExtension.js
**Issue:** The request wrapper omitted valid falsy ids such as `0`.
**Fix:** Success and error response wrappers now include every id except `undefined`.

## Skipped / deferred

### [HIGH] `tevm.getAccount` sends a mutating set-account request
**Reason:** false-positive
**Explanation:** The current adapter source already calls `tevm_getAccount` and forwards `params`, including `returnStorage` and a formatted `blockTag` when present, so no adapter change was needed for this finding. A stale in-scope spec helper was aligned to the current `tevm_getAccount` behavior while updating affected extension specs.

</details>

<details>
<summary><strong>V15 — Ethers compatibility shim</strong></summary>

# Ethers compatibility shim fix report

**Slice:** V15
**Type:** vertical
**Scope:** extensions/ethers

## Summary

All six findings were verified as real and addressed with scoped changes under `extensions/ethers`. The fixes start the ethers provider lifecycle, widen the compatibility constructor overload, and align typed contract returns/events with ethers v6 runtime shapes. No findings were skipped or deferred.

## Fixes applied

### [HIGH] Provider never starts the JsonRpcApiProvider lifecycle
**Location:** extensions/ethers/src/TevmProvider.js:173
**Files modified:** extensions/ethers/src/TevmProvider.js
**Issue:** `TevmProvider` assigned the Tevm client but never called ethers' required provider startup hook.
**Fix:** Added `this._start()` after `this.tevm` is initialized in the constructor.

### [MEDIUM] Ethers Interface instances are rejected by the typed Contract constructor
**Location:** extensions/ethers/src/contract/Contract.d.ts:21
**Files modified:** extensions/ethers/src/contract/Contract.d.ts
**Issue:** The constructor declaration only accepted ABI literals or Tevm's recast interface shape, rejecting normal ethers `Interface` instances.
**Fix:** Added a fallback constructor overload accepting `EthersInterface | InterfaceAbi` and returning `EthersContract`.

### [MEDIUM] Integer return types use abitype semantics instead of ethers v6 semantics
**Location:** extensions/ethers/src/contract/TypesafeEthersContract.ts:18
**Files modified:** extensions/ethers/src/contract/TypesafeEthersContract.ts, extensions/ethers/src/contract/Contract.spec.ts
**Issue:** Contract outputs reused abitype primitives, so small integer outputs could be typed as `number` even though ethers v6 returns `bigint`.
**Fix:** Added an ethers-specific ABI output mapper that maps all Solidity integer outputs to `bigint` and updated the in-scope type fixture.

### [MEDIUM] Multi-output functions are typed as only their first return value
**Location:** extensions/ethers/src/contract/TypesafeEthersContract.ts:18
**Files modified:** extensions/ethers/src/contract/TypesafeEthersContract.ts
**Issue:** Function outputs were indexed at `[0]`, dropping all additional return values from the type.
**Fix:** Added arity-aware output typing: zero outputs become `void`, one output becomes the scalar value, and multiple outputs become `Result` intersected with the decoded tuple.

### [MEDIUM] queryFilter returns ABI event definitions in the type, not emitted logs
**Location:** extensions/ethers/src/contract/TypesafeEthersContract.ts:40
**Files modified:** extensions/ethers/src/contract/TypesafeEthersContract.ts
**Issue:** Known event filters were typed as ABI event definitions instead of ethers log objects with decoded args.
**Fix:** Changed known event filter results to `EventLog & { args: GetEventArgs<...> }` while preserving `EventLog | Log` for unknown filters.

### [LOW] Tevm JSON-RPC example uses the wrong ethers send parameter shape
**Location:** extensions/ethers/src/TevmProvider.js:92
**Files modified:** extensions/ethers/src/TevmProvider.js, extensions/ethers/docs/classes/TevmProvider.md
**Issue:** The public example passed a params object to `provider.send` instead of a JSON-RPC params array.
**Fix:** Updated both `tevm_setAccount` and `tevm_getAccount` examples to pass single-item params arrays.

## Skipped / deferred

None.

</details>

<details>
<summary><strong>V16 — CLI commands & UX</strong></summary>

# CLI commands & UX fix report

**Slice:** V16
**Type:** vertical
**Scope:** cli

## Summary

Six findings were addressed with focused CLI changes, and one finding was skipped as a false positive against the current code. The fixes make action failures propagate to a failing process status, correct the broken storage-slot parameter mapping, implement the advertised state file paths, and tighten several command argument failure paths. No build or test commands were run per the slice constraints.

## Fixes applied

### [HIGH] Action command failures render red text but still exit successfully
**Location:** cli/src/components/CliAction.tsx:66
**Files modified:** cli/src/components/CliAction.tsx
**Issue:** Shared action errors rendered as red text without marking the process as failed.
**Fix:** `CliAction` now sets `process.exitCode = 1` and exits Ink with the error after rendering the error state.

### [HIGH] `getStorageAt` calls Tevm with `slot`, but the Tevm handler requires `position`
**Location:** cli/src/commands/getStorageAt.tsx:127
**Files modified:** cli/src/commands/getStorageAt.tsx
**Issue:** The CLI passed `slot` to the Tevm memory-client path even though the handler expects `position`.
**Fix:** The command now validates the slot as hex and passes it as `position`.

### [HIGH] `tsc` is a stub that never compiles
**Location:** cli/src/commands/tsc.tsx:35
**Files modified:** cli/src/commands/tsc.tsx
**Issue:** The command only printed selected options and never invoked TypeScript.
**Fix:** The command now spawns `tsc` with `--project`, `--watch`, and `--noEmit` as requested, streams compiler output, and forwards nonzero exit codes.

### [MEDIUM] State file options are advertised but not implemented
**Location:** cli/src/commands/loadState.tsx:95
**Files modified:** cli/src/commands/loadState.tsx, cli/src/commands/dumpState.tsx
**Issue:** `loadState --stateFile` always failed and `dumpState --outputFile` only logged a placeholder message.
**Fix:** `loadState` now reads and parses the state file, while `dumpState` writes dumped state JSON and throws on write failure.

### [MEDIUM] Invalid block numbers are silently downgraded to another query
**Location:** cli/src/commands/getBlock.tsx:106
**Files modified:** cli/src/commands/getBlock.tsx, cli/src/commands/getStorageAt.tsx, cli/src/commands/getEnsAddress.tsx, cli/src/commands/getBytecode.tsx, cli/src/commands/multicall.tsx, cli/src/commands/getEnsName.tsx, cli/src/commands/getEnsText.tsx, cli/src/commands/action/simulateCalls.tsx, cli/src/commands/action/createAccessList.tsx
**Issue:** Invalid block numbers were caught and converted to `undefined`, allowing fallback selectors to run instead.
**Fix:** Block-number parsing now throws validation errors so the shared action error path fails the command.

### [MEDIUM] Editor mode ignores failed editor launches and failed generated scripts
**Location:** cli/src/hooks/useAction.tsx:123
**Files modified:** cli/src/hooks/useAction.tsx, cli/src/utils/templates.js, cli/src/utils/editor.js
**Issue:** Editor failures were ignored, and generated scripts could catch an action error without failing the process.
**Fix:** Editor nonzero exits now abort the action, generated scripts set `process.exitCode = 1` on caught errors, and edited script execution rejects when stderr or a nonzero status is observed.

## Skipped / deferred

### [HIGH] `serve --fork` crashes with the default `forkBlockNumber`
**Reason:** false-positive
**Explanation:** The current `initializeServer` implementation uses `parseForkBlock`, which catches failed `BigInt` conversion and returns `"latest"` instead of evaluating `BigInt("latest")`. The reported startup crash is not present in the cited code.

</details>
