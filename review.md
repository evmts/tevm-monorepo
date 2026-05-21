# Tevm Monorepo Comprehensive Review

Generated 2026-05-20 17:28:11 EDT by 32 parallel codex (GPT-5.x) agents across 16 horizontal (layer) and 16 vertical (feature) slices.

- **Horizontal slices** review one architectural layer at a time.
- **Vertical slices** trace one feature end-to-end across layers.

**Total findings:** 210 — Critical: 4, High: 107, Medium: 86, Low: 13, Nit: 0

## Slice coverage

| ID | Type | Slice | Status | Findings |
|----|------|-------|--------|----------|
| H01 | horizontal | [EVM core opcodes & execution](#h01-evm-core-opcodes-execution) | ok | 5 |
| H02 | horizontal | [VM runner (block/tx execution)](#h02-vm-runner-block-tx-execution) | ok | 7 |
| H03 | horizontal | [State manager](#h03-state-manager) | ok | 7 |
| H04 | horizontal | [Blockchain + receipts + persistence](#h04-blockchain-receipts-persistence) | ok | 7 |
| H05 | horizontal | [Block, Tx, TxPool](#h05-block-tx-txpool) | ok | 6 |
| H06 | horizontal | [Trie, RLP, utils, address](#h06-trie-rlp-utils-address) | ok | 5 |
| H07 | horizontal | [Errors, logger, common, consensus, effect](#h07-errors-logger-common-consensus-effect) | ok | 7 |
| H08 | horizontal | [JSON-RPC transport (jsonrpc + http-client + server)](#h08-json-rpc-transport-jsonrpc-http-client-server) | ok | 7 |
| H09 | horizontal | [Actions (handlers backing every method)](#h09-actions-handlers-backing-every-method) | ok | 9 |
| H10 | horizontal | [Procedures, decorators, memory-client, node, client-types](#h10-procedures-decorators-memory-client-node-client-types) | ok | 6 |
| H11 | horizontal | [Contract, predeploys, precompiles](#h11-contract-predeploys-precompiles) | ok | 6 |
| H12 | horizontal | [Bundler core](#h12-bundler-core) | ok | 9 |
| H13 | horizontal | [Bundler plugins (esbuild/vite/webpack/rollup/etc.)](#h13-bundler-plugins-esbuild-vite-webpack-rollup-etc) | ok | 7 |
| H14 | horizontal | [Rust bundler components](#h14-rust-bundler-components) | ok | 9 |
| H15 | horizontal | [Extensions + LSP + CLI](#h15-extensions-lsp-cli) | ok | 8 |
| H16 | horizontal | [Top-level tevm package + test infra](#h16-top-level-tevm-package-test-infra) | ok | 6 |
| V01 | vertical | [Forking & state proxying end-to-end](#v01-forking-state-proxying-end-to-end) | ok | 6 |
| V02 | vertical | [JSON-RPC eth_* method surface](#v02-json-rpc-eth-method-surface) | ok | 9 |
| V03 | vertical | [JSON-RPC anvil_* method surface](#v03-json-rpc-anvil-method-surface) | ok | 6 |
| V04 | vertical | [JSON-RPC debug_* and tevm_* methods](#v04-json-rpc-debug-and-tevm-methods) | ok | 7 |
| V05 | vertical | [Solidity bundler pipeline (resolve→compile→codegen)](#v05-solidity-bundler-pipeline-resolve-compile-codegen) | ok | 6 |
| V06 | vertical | [Bundler caching strategy](#v06-bundler-caching-strategy) | ok | 5 |
| V07 | vertical | [Hardfork readiness, gates, transitions](#v07-hardfork-readiness-gates-transitions) | ok | 5 |
| V08 | vertical | [EIP-7702 (delegated authorization) e2e](#v08-eip-7702-delegated-authorization-e2e) | ok | 5 |
| V09 | vertical | [EIP-3155 trace comparison tooling](#v09-eip-3155-trace-comparison-tooling) | ok | 5 |
| V10 | vertical | [TypeScript LSP / Solidity type inference](#v10-typescript-lsp-solidity-type-inference) | ok | 6 |
| V11 | vertical | [Test infrastructure (matchers, conformance, hive)](#v11-test-infrastructure-matchers-conformance-hive) | ok | 6 |
| V12 | vertical | [Memory client public API](#v12-memory-client-public-api) | ok | 6 |
| V13 | vertical | [Predeploys & precompiles correctness](#v13-predeploys-precompiles-correctness) | ok | 7 |
| V14 | vertical | [Viem extension integration](#v14-viem-extension-integration) | ok | 7 |
| V15 | vertical | [Ethers compatibility shim](#v15-ethers-compatibility-shim) | ok | 6 |
| V16 | vertical | [CLI commands & UX](#v16-cli-commands-ux) | ok | 7 |

---

## Executive summary by severity

### Critical (4)

- **[CRITICAL]** EIP-2935 history state is written with non-mainnet constants and an invalid fork backfill — `packages/vm/src/actions/accumulateParentBlockHash.ts:19` _(from H02)_
- **[CRITICAL]** Header integer serialization drops the first two data bytes — `packages/block/src/header.ts:31` _(from H05)_
- **[CRITICAL]** EIP-7685 requests use a trie root instead of the requests hash — `packages/block/src/block.ts:96` _(from H05)_
- **[CRITICAL]** Foundry config loading executes config-controlled shell text — `bundler-packages/config/src/foundry/loadFoundryConfig.js:88` _(from H12)_

### High (107)

- **[HIGH]** Custom precompile state is shared and mutated across EVM instances — `packages/evm/src/createEvm.js:66` _(from H01)_
- **[HIGH]** `runBlock` exposes `setHardfork` but never applies it to the VM/EVM execution context — `packages/vm/src/actions/runBlock.ts:25` _(from H02)_
- **[HIGH]** Failed `runBlock({ root })` calls leave the VM on the requested root — `packages/vm/src/actions/runBlock.ts:39` _(from H02)_
- **[HIGH]** DAO fork balance moves are committed even when the block fails — `packages/vm/src/actions/runBlock.ts:49` _(from H02)_
- **[HIGH]** BlockBuilder caps blob gas at the target instead of the maximum — `packages/vm/src/actions/BlockBuilder.ts:236` _(from H02)_
- **[HIGH]** Original storage cache never clears between executions — `packages/state/src/actions/originalStorageCache.js:44` _(from H03)_
- **[HIGH]** Deleting an account leaves old storage readable — `packages/state/src/actions/deleteAccount.js:7` _(from H03)_
- **[HIGH]** Deleted accounts are dumped as live empty accounts — `packages/state/src/actions/dumpCannonicalGenesis.js:26` _(from H03)_
- **[HIGH]** Forked missing accounts are cached as existing accounts — `packages/state/src/actions/getAccount.js:65` _(from H03)_
- **[HIGH]** Forked block can be deleted through its RPC hash alias — `packages/blockchain/src/actions/delBlock.js:40` _(from H04)_
- **[HIGH]** Deleting a block leaves iterator/custom tags pointing at removed blocks — `packages/blockchain/src/actions/delBlock.js:57` _(from H04)_
- **[HIGH]** Forked `createChain` resolves before the chain is initialized — `packages/blockchain/src/createChain.js:42` _(from H04)_
- **[HIGH]** Pending throttled persist can resurrect removed state — `packages/sync-storage-persister/src/createSyncStoragePersister.js:69` _(from H04)_
- **[HIGH]** RLP header decoding accepts missing fork-activated fields — `packages/block/src/header.ts:113` _(from H05)_
- **[HIGH]** `createBlock()` stores transaction-shaped data as non-transaction objects — `packages/block/src/block.ts:130` _(from H05)_
- **[HIGH]** TxPool overstates effective priority fee for capped fee-market transactions — `packages/txpool/src/TxPool.ts:69` _(from H05)_
- **[HIGH]** Short hex address strings are accepted and right-padded into the wrong address — `packages/address/src/createAddress.js:83` _(from H06)_
- **[HIGH]** Exported empty state root can still be mutated through indexed writes — `packages/trie/src/EMPTY_STATE_ROOT.js:56` _(from H06)_
- **[HIGH]** Address instances alias caller-owned byte arrays — `packages/address/src/createAddress.js:77` _(from H06)_
- **[HIGH]** Chain presets execute with Mainnet Prague rules — `packages/common/src/createCommon.js:71` _(from H07)_
- **[HIGH]** Default Common trusts all KZG proofs — `packages/common/src/createCommon.js:66` _(from H07)_
- **[HIGH]** Express and Next handlers break when the framework has already parsed JSON — `packages/server/src/internal/getRequestBody.js:13` _(from H08)_
- **[HIGH]** Error responses drop valid falsy JSON-RPC ids — `packages/server/src/internal/handleError.js:14` _(from H08)_
- **[HIGH]** Oversized bodies continue buffering after the size limit fires — `packages/server/src/internal/getRequestBody.js:25` _(from H08)_
- **[HIGH]** Block and transaction tracing uses post-block state for the transaction being traced — `packages/actions/src/debug/debugTraceTransactionProcedure.js:158` _(from H09)_
- **[HIGH]** `tevm_setAccount` can partially mutate state and still return an error — `packages/actions/src/SetAccount/setAccountHandler.js:122` _(from H09)_
- **[HIGH]** `eth_sendRawTransaction` reports success even when the tx pool rejects the transaction — `packages/actions/src/eth/ethSendRawTransactionProcedure.js:31` _(from H09)_
- **[HIGH]** `eth_getTransactionReceipt` underreports EIP-1559 effective gas price — `packages/actions/src/eth/ethGetTransactionReceipt.js:111` _(from H09)_
- **[HIGH]** `eth_newFilter` captures every future log and returns fake metadata — `packages/actions/src/eth/ethNewFilterHandler.js:57` _(from H09)_
- **[HIGH]** EIP-1193 requests leak interval-mining timers — `packages/decorators/src/request/requestEip1193.js:23` _(from H10)_
- **[HIGH]** P256 verifier rejects valid high-S signatures — `packages/precompiles/src/p256verify.precompile.ts:68` _(from H11)_
- **[HIGH]** Malformed precompile calldata bypasses the revert wrapper — `packages/precompiles/src/defineCall.ts:62` _(from H11)_
- **[HIGH]** `createSolc` falls back to bundled solc instead of the requested remote version — `bundler-packages/solc/src/solc.js:158` _(from H12)_
- **[HIGH]** Artifact cache ignores compiler and config inputs — `bundler-packages/bundler-cache/src/readArtifacts.js:71` _(from H12)_
- **[HIGH]** Relative entry modules are read with `basedir` but compiled under the unresolved path — `bundler-packages/compiler/src/compiler/compileContracts.js:33` _(from H12)_
- **[HIGH]** Pragma rewriting drops Solidity upper bounds — `bundler-packages/resolutions/src/utils/updatePragma.js:29` _(from H12)_
- **[HIGH]** Generated declaration files contain implementation initializers — `bundler-packages/runtime/src/generateTevmBodyDts.js:66` _(from H12)_
- **[HIGH]** RequireJS evaluates ESM output as RequireJS text — `bundler-packages/requirejs/src/requirejsPluginTevm.js:200` _(from H13)_
- **[HIGH]** Empty tx pool keeps stale optimistic state — `bundler-packages/mud/src/createOptimisticHandler.ts:148` _(from H13)_
- **[HIGH]** Optimistic handler registry aliases different stores using the same client — `bundler-packages/mud/src/react/useOptimisticWrapper.tsx:36` _(from H13)_
- **[HIGH]** Transitive imports are marked seen before they are processed — `bundler-packages/resolutions-rs/src/module_factory.rs:106` _(from H14)_
- **[HIGH]** Module code is not rewritten to the resolved import ids — `bundler-packages/resolutions-rs/src/process_module.rs:35` _(from H14)_
- **[HIGH]** Runtime output contains unusable ABI strings — `bundler-packages/runtime-rs/src/lib.rs:55` _(from H14)_
- **[HIGH]** Runtime generation drops all bytecode — `bundler-packages/runtime-rs/src/lib.rs:75` _(from H14)_
- **[HIGH]** `generateRuntimeJs` accepts the wrong artifact shape — `bundler-packages/runtime-rs/src/lib.rs:633` _(from H14)_
- **[HIGH]** `solc-rs` cannot deserialize normal partial solc outputs — `bundler-packages/solc-rs/src/models.rs:207` _(from H14)_
- **[HIGH]** Viem `getAccount` sends the mutating `tevm_setAccount` RPC — `extensions/viem/src/tevmViemExtension.js:100` _(from H15)_
- **[HIGH]** The published LSP binary points at an unshipped `out` directory — `lsp/lsp/bin/tevm-lsp.cjs:6` _(from H15)_
- **[HIGH]** The standalone Volar LSP imports and constructs the cache incorrectly — `lsp/lsp/src/SolFile.ts:3` _(from H15)_
- **[HIGH]** `tevm serve --fork` crashes with the default fork block option — `cli/src/utils/server.ts:79` _(from H15)_
- **[HIGH]** `multicall --run` maps over a JSON string instead of parsed contracts — `cli/src/commands/multicall.tsx:178` _(from H15)_
- **[HIGH]** Top-level declarations expose a runtime export that JS does not provide — `tevm/index.ts:45` _(from H16)_
- **[HIGH]** Benchmark precompile test imports a non-existent local module — `test/bench/src/precompiles/FsPrecompile.ts:2` _(from H16)_
- **[HIGH]** Forks are pinned by block number, not block identity — `packages/node/src/createTevmNode.js:364` _(from V01)_
- **[HIGH]** Moving `safe` and `finalized` fork tags poison the fork cache over time — `packages/node/src/createTevmNode.js:362` _(from V01)_
- **[HIGH]** `eth_getBalance` ignores hex block numbers — `packages/actions/src/eth/getBalanceProcedure.js:21` _(from V01)_
- **[HIGH]** `eth_getCode` treats short hex block numbers as block hashes on cache miss — `packages/actions/src/eth/getCodeHandler.js:33` _(from V01)_
- **[HIGH]** Changing the fork RPC URL keeps old fork state and block caches — `packages/actions/src/anvil/anvilSetRpcUrlProcedure.js:57` _(from V01)_
- **[HIGH]** EIP-1559 receipts underreport `effectiveGasPrice` — `packages/actions/src/eth/ethGetTransactionReceipt.js:111` _(from V02)_
- **[HIGH]** Forked `eth_getTransactionReceipt` maps upstream receipt fields incorrectly — `packages/actions/src/eth/ethGetTransactionReceipt.js:52` _(from V02)_
- **[HIGH]** `eth_newBlockFilter` never receives new blocks — `packages/actions/src/eth/ethNewBlockFilterProcedure.js:24` _(from V02)_
- **[HIGH]** Block filter changes return block numbers instead of hashes — `packages/actions/src/eth/ethGetFilterChangesProcedure.js:59` _(from V02)_
- **[HIGH]** Missing block/transaction-by-index lookups return errors instead of `null` — `packages/actions/src/eth/ethGetTransactionByBlockNumberAndIndexProcedure.js:32` _(from V02)_
- **[HIGH]** `anvil_reset` does not restore a clean chain baseline — `packages/actions/src/anvil/anvilResetProcedure.js:55` _(from V03)_
- **[HIGH]** `anvil_dumpState` output cannot be loaded by `anvil_loadState` — `packages/actions/src/anvil/anvilDumpStateProcedure.js:13` _(from V03)_
- **[HIGH]** Impersonation is a single global slot and stop ignores the requested account — `packages/actions/src/anvil/anvilStopImpersonatingAccountProcedure.js:8` _(from V03)_
- **[HIGH]** `debug_traceTransaction` traces the transaction against post-block state — `packages/actions/src/debug/debugTraceTransactionProcedure.js:158` _(from V04)_
- **[HIGH]** Block and chain tracing reset every transaction trace to the block's final state — `packages/actions/src/debug/debugTraceBlockProcedure.js:128` _(from V04)_
- **[HIGH]** Missing transactions crash `debug_traceTransaction` instead of returning JSON-RPC errors — `packages/actions/src/debug/debugTraceTransactionProcedure.js:95` _(from V04)_
- **[HIGH]** `debug_storageRangeAt` ignores the requested block state and transaction index — `packages/actions/src/debug/debugStorageRangeAtHandler.js:76` _(from V04)_
- **[HIGH]** Declaration output uses value initializers that are illegal in `.d.ts` — `bundler-packages/runtime/src/generateTevmBodyDts.js:66` _(from V05)_
- **[HIGH]** Pragma rewriting can invert or widen the source's compiler constraint — `bundler-packages/resolutions/src/utils/updatePragma.js:25` _(from V05)_
- **[HIGH]** Indented Solidity imports are missed by dependency discovery — `bundler-packages/resolutions/src/resolveImports.js:52` _(from V05)_
- **[HIGH]** Overlapping remappings resolve by insertion order instead of longest prefix — `bundler-packages/resolutions/src/utils/resolveImportPath.js:45` _(from V05)_
- **[HIGH]** Cache validity ignores config and compiler inputs — `bundler-packages/bundler-cache/src/writeArtifacts.js:73` _(from V06)_
- **[HIGH]** Async writes can publish valid metadata before matching artifacts — `bundler-packages/bundler-cache/src/writeArtifacts.js:65` _(from V06)_
- **[HIGH]** Bytecode cache hits are accepted without checking bytecode content — `bundler-packages/base-bundler/src/readCache.js:43` _(from V06)_
- **[HIGH]** Block transaction execution bypasses hardfork validation and uses the VM fork — `packages/vm/src/actions/applyTransactions.ts:45` _(from V07)_
- **[HIGH]** Typed transactions are accepted when EIP-2718 is inactive — `packages/vm/src/actions/validateRunTx.js:59` _(from V07)_
- **[HIGH]** Pre-Shanghai block building always emits a withdrawals field — `packages/vm/src/actions/BlockBuilder.ts:364` _(from V07)_
- **[HIGH]** Blob block building rejects valid blocks above the target blob gas — `packages/vm/src/actions/BlockBuilder.ts:236` _(from V07)_
- **[HIGH]** `eth_sendTransaction` drops EIP-7702 authorization lists before execution — `packages/actions/src/eth/ethSendTransactionProcedure.js:14` _(from V08)_
- **[HIGH]** Raw transaction RPC reports success even when pool insertion or automining fails — `packages/actions/src/eth/ethSendRawTransactionProcedure.js:31` _(from V08)_
- **[HIGH]** The exported raw-transaction handler bypasses automining for EIP-7702 — `packages/actions/src/eth/ethSendRawTransactionHandler.js:88` _(from V08)_
- **[HIGH]** Trace comparison ignores final execution summaries — `test/eip3155/trace-tools.mjs:270` _(from V09)_
- **[HIGH]** `RunTxResult.gasRefund` reports the uncapped refund — `packages/vm/src/actions/runTx.ts:426` _(from V09)_
- **[HIGH]** Standalone LSP imports a cache API from the wrong package — `lsp/lsp/src/SolFile.ts:3` _(from V10)_
- **[HIGH]** tsserver plugin can serve stale types for unsaved Solidity edits — `lsp/ts-plugin/src/tsPlugin.ts:49` _(from V10)_
- **[HIGH]** Volar LSP ignores the document snapshot it is asked to update — `lsp/lsp/src/SolFile.ts:35` _(from V10)_
- **[HIGH]** Concurrent snapshot autosaves can lose cached RPC entries — `extensions/test-node/src/snapshot/SnapshotManager.ts:96` _(from V11)_
- **[HIGH]** Native balance changes for created or deleted accounts are reported as zero — `extensions/test-matchers/src/matchers/balance/getBalanceChange.ts:7` _(from V11)_
- **[HIGH]** `toBeRevertedWithError` throws an internal selector error for successful transactions — `extensions/test-matchers/src/matchers/errors/toBeRevertedWithError.ts:33` _(from V11)_
- **[HIGH]** Forked clients without `common` are typed as having a chain even though runtime omits it — `packages/memory-client/src/CreateMemoryClientFn.ts:84` _(from V12)_
- **[HIGH]** `fork.chainId` override changes the node chain id but not the public viem client chain — `packages/memory-client/src/createMemoryClient.js:322` _(from V12)_
- **[HIGH]** P-256 gas accounting is non-canonical and underfunded calls are not rejected — `packages/precompiles/src/p256verify.precompile.ts:14` _(from V13)_
- **[HIGH]** P-256 failure return data is wrong — `packages/precompiles/src/p256verify.precompile.ts:37` _(from V13)_
- **[HIGH]** P-256 rejects valid high-S signatures — `packages/precompiles/src/p256verify.precompile.ts:68` _(from V13)_
- **[HIGH]** Malformed custom precompile calldata escapes as a JavaScript exception — `packages/precompiles/src/defineCall.ts:62` _(from V13)_
- **[HIGH]** `tevm.getAccount` sends a mutating set-account request — `extensions/viem/src/tevmViemExtension.js:103` _(from V14)_
- **[HIGH]** Optimistic writes call an unsupported Tevm JSON-RPC method — `extensions/viem/src/tevmViemExtensionOptimistic.js:83` _(from V14)_
- **[HIGH]** The call adapter silently drops transaction and caller semantics — `extensions/viem/src/tevmViemExtension.js:135` _(from V14)_
- **[HIGH]** `setAccount` cannot clear balances/nonces and drops storage updates — `extensions/viem/src/tevmViemExtension.js:120` _(from V14)_
- **[HIGH]** Provider never starts the JsonRpcApiProvider lifecycle — `extensions/ethers/src/TevmProvider.js:173` _(from V15)_
- **[HIGH]** Action command failures render red text but still exit successfully — `cli/src/components/CliAction.tsx:66` _(from V16)_
- **[HIGH]** `getStorageAt` calls Tevm with `slot`, but the Tevm handler requires `position` — `cli/src/commands/getStorageAt.tsx:127` _(from V16)_
- **[HIGH]** `serve --fork` crashes with the default `forkBlockNumber` — `cli/src/utils/server.ts:79` _(from V16)_
- **[HIGH]** `tsc` is a stub that never compiles — `cli/src/commands/tsc.tsx:35` _(from V16)_

### Medium (86)

- **[MEDIUM]** Exported `Evm.create()` creates instances whose Tevm methods immediately fail — `packages/evm/src/Evm.js:74` _(from H01)_
- **[MEDIUM]** `loggingLevel: 'trace'` enables EthereumJS debug overhead without wiring logs to Tevm — `packages/evm/src/createEvm.js:71` _(from H01)_
- **[MEDIUM]** Block execution disables tx/block hardfork validation by default — `packages/vm/src/actions/applyTransactions.ts:45` _(from H02)_
- **[MEDIUM]** Builder and runner disagree on zero-amount withdrawals — `packages/vm/src/actions/BlockBuilder.ts:202` _(from H02)_
- **[MEDIUM]** Loading a state root does not clear old tombstones — `packages/state/src/actions/generateCannonicalGenesis.js:20` _(from H03)_
- **[MEDIUM]** `dumpStorageRange` only works when the start key already exists — `packages/state/src/actions/dumpStorageRange.js:26` _(from H03)_
- **[MEDIUM]** `getProof` can read a different fork block than cached state — `packages/state/src/actions/getProof.js:19` _(from H03)_
- **[MEDIUM]** Receipt tx-hash deletion can erase a newer replacement index — `packages/receipt-manager/src/ReceiptManager.ts:471` _(from H04)_
- **[MEDIUM]** `includeTxType` omits legacy transaction type `0` — `packages/receipt-manager/src/ReceiptManager.ts:322` _(from H04)_
- **[MEDIUM]** `getLogs` defines but never enforces the block-range limit — `packages/receipt-manager/src/ReceiptManager.ts:392` _(from H04)_
- **[MEDIUM]** `ClRequest` silently wraps invalid request type numbers — `packages/block/src/ClRequest.ts:78` _(from H05)_
- **[MEDIUM]** Contract address helpers accept non-address byte lengths — `packages/address/src/createContractAddress.js:70` _(from H06)_
- **[MEDIUM]** Seeded memory DBs cannot read Uint8Array keys supplied by the public type — `packages/utils/src/createMemoryDb.js:23` _(from H06)_
- **[MEDIUM]** Mock KZG returns malformed commitment and proof sizes — `packages/common/src/createMockKzg.js:24` _(from H07)_
- **[MEDIUM]** Light-client readiness can be marked ready while still errored or syncing — `packages/consensus/src/createLightClientConsensusService.ts:35` _(from H07)_
- **[MEDIUM]** `resolveSync` can defect instead of returning a typed resolution error — `packages/effect/src/resolve.js:49` _(from H07)_
- **[MEDIUM]** One malformed batch element rejects the whole batch — `packages/server/src/internal/parseRequest.js:40` _(from H08)_
- **[MEDIUM]** The compatibility parser accepts requests without `jsonrpc: "2.0"` — `packages/server/src/internal/parseRequest.js:6` _(from H08)_
- **[MEDIUM]** Framework adapters drop the handler promise — `packages/server/src/adapters/createNextApiHandler.js:19` _(from H08)_
- **[MEDIUM]** Trace listeners are not always unregistered — `packages/actions/src/internal/runCallWithTrace.js:61` _(from H09)_
- **[MEDIUM]** Forked transaction receipts are mapped with wrong field names — `packages/actions/src/eth/ethGetTransactionReceipt.js:52` _(from H09)_
- **[MEDIUM]** Valid JSON-RPC id `0` is dropped by many handlers — `packages/actions/src/createHandlers.js:227` _(from H09)_
- **[MEDIUM]** `earliest` resolves to block 1 in log range parsing — `packages/actions/src/eth/utils/parseBlockParam.js:46` _(from H09)_
- **[MEDIUM]** Semantic JSON-RPC errors are retried by default — `packages/decorators/src/request/requestEip1193.js:22` _(from H10)_
- **[MEDIUM]** `cacheTime` is exposed but always overwritten — `packages/memory-client/src/createMemoryClient.js:316` _(from H10)_
- **[MEDIUM]** Published mining examples use an ignored option shape — `packages/memory-client/src/createMemoryClient.js:35` _(from H10)_
- **[MEDIUM]** EIP-1193 request typing omits runtime TEVM methods — `packages/decorators/src/request/Eip1193RequestProvider.ts:17` _(from H10)_
- **[MEDIUM]** Contract event creators are typed with swapped generic parameters — `packages/contract/src/Contract.ts:124` _(from H11)_
- **[MEDIUM]** Event arg extraction excludes the concrete arg shapes — `packages/contract/src/event/EventActionCreator.ts:23` _(from H11)_
- **[MEDIUM]** Multi-output precompile functions cannot be represented correctly — `packages/precompiles/src/CallResult.ts:32` _(from H11)_
- **[MEDIUM]** Overlapping remappings resolve by insertion order instead of longest prefix — `bundler-packages/resolutions/src/utils/resolveImportPath.js:45` _(from H12)_
- **[MEDIUM]** Unknown chains with custom RPC still dereference `chain` — `bundler-packages/whatsabi/src/resolveContractUri.js:48` _(from H12)_
- **[MEDIUM]** Contract URI type rejects the scheme parsed at runtime — `bundler-packages/whatsabi/src/ContractUri.ts:4` _(from H12)_
- **[MEDIUM]** `tevm-run` does not catch process failures and collapses argv — `bundler-packages/tevm-run/src/run.js:15` _(from H13)_
- **[MEDIUM]** Shared unplugin ignores JavaScript sidecars — `bundler-packages/unplugin/src/tevmUnplugin.js:78` _(from H13)_
- **[MEDIUM]** Canonical sync can hang forever after an adapter error — `bundler-packages/mud/src/internal/mud/createSyncAdapter.ts:25` _(from H13)_
- **[MEDIUM]** Global state coordinator drops updates across independent handlers — `bundler-packages/mud/src/internal/stateUpdateCoordinator.ts:52` _(from H13)_
- **[MEDIUM]** Valid files with only commented/string `import ` text are reported as resolution failures — `bundler-packages/resolutions-rs/src/resolve_imports.rs:98` _(from H14)_
- **[MEDIUM]** Remapping values are joined incorrectly when the prefix lacks a trailing slash — `bundler-packages/resolutions-rs/src/resolve_import_path.rs:72` _(from H14)_
- **[MEDIUM]** `resolveImportsJs` loses the original and updated import strings at the FFI boundary — `bundler-packages/resolutions-rs/src/lib.rs:78` _(from H14)_
- **[MEDIUM]** Snapshot cache keys can collide across different transaction fields — `extensions/test-node/src/internal/normalizeTx.ts:25` _(from H15)_
- **[MEDIUM]** Viem `setAccount` cannot set balance or nonce to zero — `extensions/viem/src/tevmViemExtension.js:121` _(from H15)_
- **[MEDIUM]** Published `tevm` package does not ship or register its CLI shim — `tevm/package.json:382` _(from H16)_
- **[MEDIUM]** JSR manifest omits the precompiles subpath and is version-stale — `tevm/jsr.json:4` _(from H16)_
- **[MEDIUM]** Named conformance groups do not filter anything — `test/conformance-utils/run-fixture-suite.mjs:203` _(from H16)_
- **[MEDIUM]** Conformance wrapper scripts execute unescaped environment and argv through a shell — `test/ethereum-state-tests/run-general-state-tests.mjs:10` _(from H16)_
- **[MEDIUM]** The storage prefetch proxy captures stale cloned VMs and stacks wrappers — `packages/actions/src/internal/setupPrefetchProxy.js:21` _(from V01)_
- **[MEDIUM]** `eth_getFilterLogs` ignores the installed filter range — `packages/actions/src/eth/ethGetFilterLogsProcedure.js:26` _(from V02)_
- **[MEDIUM]** `eth_newFilter` rejects valid `null` topic wildcards — `packages/actions/src/eth/ethNewFilterHandler.js:89` _(from V02)_
- **[MEDIUM]** Falsy JSON-RPC ids are dropped across many eth procedures — `packages/actions/src/eth/blockNumberProcedure.js:9` _(from V02)_
- **[MEDIUM]** EIP-1193 public schema exposes the wrong blob fee method — `packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts:114` _(from V02)_
- **[MEDIUM]** `anvil_dropTransaction` uses a non-Anvil parameter shape — `packages/actions/src/anvil/anvilDropTransactionProcedure.js:13` _(from V03)_
- **[MEDIUM]** `anvil_setStorageAt` reports `null` instead of success — `packages/actions/src/anvil/anvilSetStorageAtProcedure.js:32` _(from V03)_
- **[MEDIUM]** Several handlers drop valid JSON-RPC id `0` — `packages/actions/src/anvil/anvilImpersonateAccountProcedure.js:15` _(from V03)_
- **[MEDIUM]** Many debug procedures drop valid JSON-RPC id `0` — `packages/actions/src/debug/debugTraceCallProcedure.js:40` _(from V04)_
- **[MEDIUM]** Implemented debug methods are missing from `JsonRpcRequestTypeFromMethod` — `packages/actions/src/tevm-request-handler/DebugRequestType.ts:11` _(from V04)_
- **[MEDIUM]** Missing historical state roots produce false modified-account results — `packages/actions/src/debug/debugGetModifiedAccountsByNumberHandler.js:76` _(from V04)_
- **[MEDIUM]** Bytecode declarations claim deployability even when artifacts omit bytecode — `bundler-packages/runtime/src/generateTevmBodyDts.js:63` _(from V05)_
- **[MEDIUM]** Config merging mutates precedence while reading scalar options — `bundler-packages/config/src/config/mergeConfigs.js:21` _(from V05)_
- **[MEDIUM]** Mtime-only invalidation can miss source content changes — `bundler-packages/bundler-cache/src/readArtifacts.js:75` _(from V06)_
- **[MEDIUM]** Absolute shared cache directories can collide across projects — `bundler-packages/bundler-cache/src/getArtifactsPath.js:44` _(from V06)_
- **[MEDIUM]** System-contract fork effects are gated by VM common instead of block common — `packages/vm/src/actions/applyBlock.ts:47` _(from V07)_
- **[MEDIUM]** Mined 7702 transactions lose `authorizationList` in JSON-RPC transaction objects — `packages/actions/src/utils/txToJsonRpcTx.js:21` _(from V08)_
- **[MEDIUM]** Receipt gas accounting underreports `effectiveGasPrice` for 7702 transactions — `packages/actions/src/eth/ethGetTransactionReceipt.js:111` _(from V08)_
- **[MEDIUM]** Zero-step executions are marked as no coverage instead of compared — `test/eip3155/trace-tools.mjs:302` _(from V09)_
- **[MEDIUM]** Opcode aliases are preserved as false divergences — `test/eip3155/trace-tools.mjs:199` _(from V09)_
- **[MEDIUM]** Foundry-style remapped imports are resolved as npm packages — `lsp/ts-plugin/src/utils/solidityModuleResolver.ts:37` _(from V10)_
- **[MEDIUM]** `.s.sol` declarations claim bytecode exists for every artifact — `bundler-packages/runtime/src/generateTevmBodyDts.js:63` _(from V10)_
- **[MEDIUM]** Go-to-definition matches Solidity members by bare name across all ASTs — `lsp/ts-plugin/src/decorators/getDefinitionAtPosition.ts:80` _(from V10)_
- **[MEDIUM]** EIP-3155 comparisons ignore final summary/output differences — `test/eip3155/trace-tools.mjs:270` _(from V11)_
- **[MEDIUM]** ABI argument matchers reject valid array/tuple arguments by reference — `extensions/test-matchers/src/matchers/contract/withFunctionArgs.ts:41` _(from V11)_
- **[MEDIUM]** Expected invalid conformance transactions are always marked as runner failures — `test/conformance-utils/run-fixture-suite.mjs:427` _(from V11)_
- **[MEDIUM]** Public mining examples use an ignored option and describe the wrong default — `packages/memory-client/src/createMemoryClient.js:177` _(from V12)_
- **[MEDIUM]** `cacheTime` is part of the public options but is always overwritten — `packages/memory-client/src/createMemoryClient.js:316` _(from V12)_
- **[MEDIUM]** The exported EIP-1193 provider type omits runtime-supported TEVM methods — `packages/decorators/src/request/Eip1193RequestProvider.ts:17` _(from V12)_
- **[MEDIUM]** Handler errors are forced through successful return encoding — `packages/precompiles/src/defineCall.ts:83` _(from V13)_
- **[MEDIUM]** Overloaded events can be encoded with the wrong ABI item — `packages/precompiles/src/logToEthjsLog.ts:30` _(from V13)_
- **[MEDIUM]** Runtime and TypeScript barrels disagree on `tevmDeal` — `packages/memory-client/src/index.js:1` _(from V14)_
- **[MEDIUM]** Undefined block tags are rewritten to `pending` — `extensions/viem/src/tevmViemExtension.js:8` _(from V14)_
- **[MEDIUM]** Ethers Interface instances are rejected by the typed Contract constructor — `extensions/ethers/src/contract/Contract.d.ts:21` _(from V15)_
- **[MEDIUM]** Integer return types use abitype semantics instead of ethers v6 semantics — `extensions/ethers/src/contract/TypesafeEthersContract.ts:18` _(from V15)_
- **[MEDIUM]** Multi-output functions are typed as only their first return value — `extensions/ethers/src/contract/TypesafeEthersContract.ts:18` _(from V15)_
- **[MEDIUM]** queryFilter returns ABI event definitions in the type, not emitted logs — `extensions/ethers/src/contract/TypesafeEthersContract.ts:40` _(from V15)_
- **[MEDIUM]** State file options are advertised but not implemented — `cli/src/commands/loadState.tsx:95` _(from V16)_
- **[MEDIUM]** Invalid block numbers are silently downgraded to another query — `cli/src/commands/getBlock.tsx:106` _(from V16)_
- **[MEDIUM]** Editor mode ignores failed editor launches and failed generated scripts — `cli/src/hooks/useAction.tsx:123` _(from V16)_

### Low (13)

- **[LOW]** Custom precompile docs say dynamic installation is impossible, but the runtime exposes it — `packages/evm/src/CreateEvmOptions.ts:64` _(from H01)_
- **[LOW]** Custom predeploy docs show a shape that `createEvm` cannot consume — `packages/evm/src/CreateEvmOptions.ts:105` _(from H01)_
- **[LOW]** Subclass error docs paths are overwritten by base classes — `packages/errors/src/ethereum/ResourceNotFoundError.js:60` _(from H07)_
- **[LOW]** Error messages report a stale package version — `packages/errors/src/ethereum/BaseError.js:6` _(from H07)_
- **[LOW]** `createJsonRpcFetcher` violates its exported response type — `packages/jsonrpc/src/createJsonRpcFetcher.js:24` _(from H08)_
- **[LOW]** `@tevm/procedures` is a public package with no usable API — `packages/procedures/src/index.ts:1` _(from H10)_
- **[LOW]** Predeploy docs point users at a non-working API shape — `packages/predeploys/src/definePredeploy.js:12` _(from H11)_
- **[LOW]** CLI version output is hardcoded — `cli/src/cli.tsx:6` _(from H15)_
- **[LOW]** Numeric string opcodes are rejected despite parser support — `test/eip3155/trace-tools.mjs:200` _(from V09)_
- **[LOW]** `requestEip1193` retries every provider error before viem can classify it — `packages/decorators/src/request/requestEip1193.js:22` _(from V12)_
- **[LOW]** `definePredeploy` examples describe a different API than the implementation — `packages/predeploys/src/definePredeploy.js:12` _(from V13)_
- **[LOW]** JSON-RPC id `0` is dropped from wrapped responses — `extensions/viem/src/tevmViemExtension.js:66` _(from V14)_
- **[LOW]** Tevm JSON-RPC example uses the wrong ethers send parameter shape — `extensions/ethers/src/TevmProvider.js:92` _(from V15)_

---

## Appendix — per-slice reports

### Horizontal slices (layer reviews)

<details>
<summary><strong>H01 — EVM core opcodes & execution</strong></summary>

# EVM core opcodes & execution review

**Slice:** H01
**Type:** horizontal
**Scope:** packages/evm
**Reviewed by:** codex (GPT-5.4)

## Summary

`packages/evm` exists, but it is not where Tevm implements opcodes, gas accounting, journal handling, or message-frame execution; this package is a facade over `@evmts/zevm/evm` / EthereumJS EVM. The highest-risk issue in this slice is that custom precompile arrays are retained and mutated by reference, which can leak runtime precompile changes across copied or separately-created EVMs. The rest of the findings are public-surface mismatches: the exported `Evm.create()` does not honor Tevm's own custom-precompile invariant, trace logging turns on expensive EthereumJS debug paths without actually routing those logs to Tevm's logger, and the option docs describe shapes/constraints the runtime does not enforce.

## Findings

### [HIGH] Custom precompile state is shared and mutated across EVM instances
**Location:** packages/evm/src/createEvm.js:66
**Issue:** `createEvm` passes the caller's `customPrecompiles` array directly into EthereumJS, and `addCustomPrecompile` / `removeCustomPrecompile` later mutate `this._customPrecompiles` in place with `push`, replacement, and `splice`. Any caller that reuses the same array, or any VM copy that passes through the existing private array, now shares mutable precompile configuration between EVM instances.
**Why it matters:** `packages/vm/src/actions/deepCopy.js` passes `baseVm.evm._customPrecompiles` into `createEvm`, so a copied VM and its source can share the same backing array. A later `addCustomPrecompile` or `removeCustomPrecompile` on one VM silently changes the other's private configuration; the other VM's active `_precompiles` map may remain stale until a hardfork change recomputes it, creating inconsistent behavior between `getPrecompile`, future hardfork transitions, and copied VMs.
**Suggested fix:** Clone custom precompile arrays at the boundary, e.g. `customPrecompiles: [...(customPrecompiles ?? [])]`, and make `Evm.create` apply the same normalization. Prefer replacing `_customPrecompiles` with a new array in add/remove instead of mutating it in place, or otherwise document and prevent sharing when deep-copying.

### [MEDIUM] Exported `Evm.create()` creates instances whose Tevm methods immediately fail
**Location:** packages/evm/src/Evm.js:74
**Issue:** `Evm.create()` accepts optional raw `EVMOpts` and forwards them unchanged to `createEVM`. If the caller omits `customPrecompiles`, EthereumJS leaves `_customPrecompiles` undefined, but Tevm still binds `addCustomPrecompile` and `removeCustomPrecompile`; calling either method then throws `MisconfiguredClientError` instead of adding/removing a precompile.
**Why it matters:** `Evm.create` is exported as public API and typed as returning Tevm's `Evm` with working custom-precompile mutators. Users who construct through `Evm.create()` rather than `createEvm()` get an object that satisfies the type but violates the runtime contract.
**Suggested fix:** Normalize options inside `Evm.create`, e.g. call `createEVM({ ...options, customPrecompiles: [...(options?.customPrecompiles ?? [])] })`, so the invariant does not depend on the higher-level `createEvm` wrapper.

### [MEDIUM] `loggingLevel: 'trace'` enables EthereumJS debug overhead without wiring logs to Tevm
**Location:** packages/evm/src/createEvm.js:71
**Issue:** The trace branch sets `evmAny.DEBUG = true` and assigns `evmAny._debug = logger`, but EthereumJS EVM does not use that `_debug` property for opcode/gas traces. Its interpreter checks `DEBUG` and then calls module-level `debug` loggers, so Tevm's pino logger is bypassed.
**Why it matters:** A user requesting trace logs can pay per-opcode debug overhead, including step-hook construction on every opcode, without receiving those traces through Tevm's configured logger. This is especially risky for long-running simulations where `trace` is enabled to diagnose gas/execution behavior.
**Suggested fix:** Either bridge EthereumJS `step` events into `logger.trace` explicitly, or configure the `debug` namespaces deliberately and document that behavior. Do not set `DEBUG` unless there is a real trace sink.

### [LOW] Custom precompile docs say dynamic installation is impossible, but the runtime exposes it
**Location:** packages/evm/src/CreateEvmOptions.ts:64
**Issue:** The option docs state that "For security precompiles can only be added statically when the vm is created," while the exported EVM type and runtime expose `addCustomPrecompile` and `removeCustomPrecompile`.
**Why it matters:** Custom precompiles run arbitrary JavaScript, so stale security guidance around when they can be installed is a real API footgun for embedders deciding whether an EVM instance can be mutated after construction.
**Suggested fix:** Update the docs to match the runtime, or remove/privatize the dynamic mutators if static-only registration is the intended security model.

### [LOW] Custom predeploy docs show a shape that `createEvm` cannot consume
**Location:** packages/evm/src/CreateEvmOptions.ts:105
**Issue:** The `customPredeploys` example shows entries with top-level `address`, `abi`, and `deployedBytecode`, but `createEvm` reads `predeploy.contract.address` and `predeploy.contract.deployedBytecode`.
**Why it matters:** TypeScript users are protected by `Predeploy`, but JavaScript users following the docs will hit a runtime `TypeError` before EVM creation. This is a public configuration surface for installing code into state, so the example should be exact.
**Suggested fix:** Change the example to use `definePredeploy(contract)` / the actual `Predeploy` shape, or make `createEvm` validate the shape and throw a targeted configuration error.

</details>

<details>
<summary><strong>H02 — VM runner (block/tx execution)</strong></summary>

# VM runner (block/tx execution) review

**Slice:** H02
**Type:** horizontal
**Scope:** packages/vm
**Reviewed by:** codex (GPT-5.4)

## Summary

The biggest issue is that post-Pectra block execution writes EIP-2935 history state with the wrong constants and an extra backfill behavior, which will produce non-mainnet state roots. Hardfork selection is also effectively caller-managed despite public `setHardfork` options, so the VM can execute blocks under stale rules or fail older blocks when the VM common is left at the package default. Failure paths are not fully atomic: `runBlock` mutates the state root and DAO fork state outside the main execution checkpoint. The builder has a few divergences from the runner, most notably rejecting valid blob blocks above target blob gas and handling zero withdrawals differently.

## Findings

### [CRITICAL] EIP-2935 history state is written with non-mainnet constants and an invalid fork backfill
**Location:** packages/vm/src/actions/accumulateParentBlockHash.ts:19
**Issue:** The EIP-2935 helper hardcodes `0x0aae40965e6800cd9b1f4b05ff21581047e3f91e` and `8192n`, then backfills up to `historyServeWindow - 1` ancestors when the parent predates the fork. Mainnet EIP-2935 uses `HISTORY_STORAGE_ADDRESS = 0x0000F90827F1C53a10cb7A02335B175320002935`, a ring size of 8191, and explicitly does not prepopulate hashes before the fork block.
**Why it matters:** Any block executed with EIP-2935 active writes the parent hash into the wrong account/slot schedule, and fork-block execution writes thousands of extra storage slots. That is consensus-level state-root divergence for Pectra-era blocks and also breaks contracts that read the canonical history storage contract.
**Suggested fix:** Load `historyStorageAddress` and `historyServeWindow` from canonical Common params with mainnet defaults of `0x0000F90827F1C53a10cb7A02335B175320002935` and `8191n`, write only `(block.number - 1) % HISTORY_SERVE_WINDOW`, and delete the ancestor backfill branch at lines 42-54.

### [HIGH] `runBlock` exposes `setHardfork` but never applies it to the VM/EVM execution context
**Location:** packages/vm/src/actions/runBlock.ts:25
**Issue:** `RunBlockOpts` documents `setHardfork`, but `runBlock` only reads `root`, `clearCache`, `block`, and `generate`. All execution gates in `applyBlock` and `runTx` use `vm.common.ethjsCommon`, so block processing follows whatever hardfork the VM happened to have before the call.
**Why it matters:** Running historical blocks with the default `prague` common can incorrectly enable withdrawals/system-contract writes for pre-fork blocks, while running newer blocks on an older common skips required fork logic. With `generate: true`, this can silently generate roots/receipts under the wrong rules.
**Suggested fix:** At the start of `runBlock`, implement the documented hardfork selection by block number/timestamp/TD, align `vm.common.ethjsCommon` and `vm.evm.common` for the duration of execution, and restore the previous hardfork in a `finally`.

### [HIGH] Failed `runBlock({ root })` calls leave the VM on the requested root
**Location:** packages/vm/src/actions/runBlock.ts:39
**Issue:** `runBlock` calls `state.setStateRoot(root, clearCache)` before creating the journal checkpoint at line 60. If `applyBlock` or post-execution validation throws, the catch block reverts only the journaled changes and never restores the state root that was active before line 41.
**Why it matters:** A caller that tries to execute or validate a block from a specific parent root can poison the VM for subsequent calls when execution fails. This is a public API footgun because the method appears transactional but leaves global state pointed at a different root on error.
**Suggested fix:** Capture the previous root before `setStateRoot`, and in the catch path restore it after `journal.revert()`. Alternatively require callers to set the root outside `runBlock` and remove the option.

### [HIGH] DAO fork balance moves are committed even when the block fails
**Location:** packages/vm/src/actions/runBlock.ts:49
**Issue:** The DAO hardfork is applied in its own checkpoint and committed before the main block checkpoint is created. If the DAO fork block later fails transaction execution or header/state validation, the catch path reverts only the later checkpoint, leaving the DAO balance transfers in state.
**Why it matters:** A failed `runBlock` call can still mutate balances on the DAO fork block. Retrying with corrected inputs starts from an already-forked state, and callers cannot rely on failed block execution being side-effect-free.
**Suggested fix:** Move DAO application inside the same checkpoint that wraps `applyBlock`, or defer the DAO commit until after all block validation passes.

### [HIGH] BlockBuilder caps blob gas at the target instead of the maximum
**Location:** packages/vm/src/actions/BlockBuilder.ts:236
**Issue:** `addTransaction` uses `targetBlobGasPerBlock` as the hard limit for blob gas. EIP-4844 has a lower target used for fee adjustment and a higher maximum used for validity; valid blocks may exceed the target up to the max.
**Why it matters:** The builder rejects valid blob transactions once cumulative blob gas crosses the target, so it cannot build full valid Cancun/Prague blocks and will under-fill blob capacity.
**Suggested fix:** Use the canonical maximum blob gas parameter for the validity check, and keep `targetBlobGasPerBlock` only for excess blob gas/base-fee calculations.

### [MEDIUM] Block execution disables tx/block hardfork validation by default
**Location:** packages/vm/src/actions/applyTransactions.ts:45
**Issue:** `applyTransactions` destructures `skipHardForkValidation = true`, then passes that to `runTx`. This reverses the public `runTx` default and makes `runBlock` skip tx/block/vm hardfork compatibility checks unless the caller explicitly passes `skipHardForkValidation: false`.
**Why it matters:** Invalid combinations of block hardfork, VM hardfork, and transaction common can execute far enough to mutate state or produce confusing validation failures. It also hides the hardfork-selection bug above instead of failing early.
**Suggested fix:** Default this option to `false`, matching `runTx`, and only bypass it in narrowly documented internal paths where the block has already been normalized.

### [MEDIUM] Builder and runner disagree on zero-amount withdrawals
**Location:** packages/vm/src/actions/BlockBuilder.ts:202
**Issue:** `BlockBuilder.processWithdrawals` skips zero-amount withdrawals, while `assignWithdrawals` intentionally calls `rewardAccount` even for zero amounts so the account is touched and eligible for empty-account cleanup.
**Why it matters:** A block built through `buildBlock` can produce a different state root than the same block executed through `runBlock` when it contains a zero-amount withdrawal to an empty account.
**Suggested fix:** Make builder withdrawal processing call the same `assignWithdrawals` helper or mirror its zero-amount touch semantics exactly.

## Architectural observations

Fork-specific system operations are split between `runBlock`, `applyBlock`, `BlockBuilder.initState`, and local hardcoded params. That makes it easy for the runner and builder to drift, as EIP-2935 and withdrawals already show. A single fork-transition module that takes `(vm, block/header, mode)` and is shared by block execution and block building would reduce consensus surface area and force constants to come from Common instead of local literals.

</details>

<details>
<summary><strong>H03 — State manager</strong></summary>

# State manager review

**Slice:** H03
**Type:** horizontal
**Scope:** packages/state
**Reviewed by:** codex (GPT-5.4)

## Summary

The state manager has several real state-consistency bugs around deletion, dumping, and fork overlays. The highest-risk issue is that `originalStorageCache.clear()` is a no-op, so EVM storage gas accounting can keep using a stale "original" value after the transaction/execution boundary where it should be reset. Account deletion is also incomplete: storage survives the delete path, and persisted/dumped state can re-materialize deleted accounts as empty accounts. Fork mode has a separate correctness hole where non-existent remote accounts are recognized using all-zero roots instead of Ethereum's canonical empty code/storage hashes, so probing a missing account can cache it as a real account.

## Findings

### [HIGH] Original storage cache never clears between executions
**Location:** packages/state/src/actions/originalStorageCache.js:44
**Issue:** `originalStorageCache()` keeps a closure-scoped `Map` of first-seen storage values, but its public `clear()` method is empty. The EVM expects this cache to be clearable at transaction/execution boundaries so the "original" SSTORE value is the value at the start of the current execution, not the first value ever observed by this state manager.
**Why it matters:** After one transaction reads a slot, later transactions can keep using that stale pre-transaction value for SSTORE gas/refund decisions even after commits and local writes changed the slot. That is an EVM semantic divergence, and it directly affects gas accounting for repeated calls against the same state manager.
**Suggested fix:** Implement `clear()` as `state.clear()` and add a regression where slot `k` is read, changed/committed, `originalStorageCache.clear()` is called, and the next `get(address, k)` returns the new committed value.

### [HIGH] Deleting an account leaves old storage readable
**Location:** packages/state/src/actions/deleteAccount.js:7
**Issue:** `deleteAccount()` tombstones the account and writes empty code, but it never clears `baseState.caches.storage` or marks `tombstones.storageCleared`. `getContractStorage()` checks the storage cache before any account-deletion state, so any cached slot for that address remains readable after deletion.
**Why it matters:** A deleted account can still expose its pre-delete storage through `getStorage`, `dumpStorage`, `dumpCanonicalGenesis`, and future commits. Recreating an account at the same address can also inherit stale slots, which breaks the account/storage invariant callers expect from deletion.
**Suggested fix:** Make `deleteAccount()` call the same storage-clearing path as `clearContractStorage()` and ensure `getContractStorage()` cannot return cached storage for an address in `tombstones.accounts`.

### [HIGH] Deleted accounts are dumped as live empty accounts
**Location:** packages/state/src/actions/dumpCannonicalGenesis.js:26
**Issue:** `dumpCanonicalGenesis()` iterates raw account-cache addresses and turns `undefined` accounts into `fromAccountData({})`. Both `deleteAccount()` and `putAccount(address, undefined)` intentionally leave an account-cache entry with `accountRLP: undefined`, so dumps/deep copies/commits serialize that deleted account as a live empty account instead of omitting it.
**Why it matters:** Deletions do not survive persistence boundaries cleanly. A `deepCopy()` or `commit()` can re-materialize a deleted address as an empty account, and if stale storage/code is still cached for that address, the serialized state can contain an impossible account shape.
**Suggested fix:** Skip addresses whose `getAccount(baseState, true)(address)` returns `undefined`; do not synthesize an empty account during dumping. If empty-account materialization is needed for a separate API, keep it out of canonical state persistence.

### [HIGH] Forked missing accounts are cached as existing accounts
**Location:** packages/state/src/actions/getAccount.js:65
**Issue:** The empty-account check treats a remote proof as non-existent only when `codeHash` and `storageRoot` are all zero bytes. Ethereum's canonical empty account uses the empty code hash and empty trie root, not all-zero hashes, and the package's own state examples use those canonical values.
**Why it matters:** In fork mode, reading a missing address can cache and return an `EthjsAccount` instead of `undefined`. That pollutes account enumeration and canonical dumps with probed missing addresses, and it can make later APIs behave as if an account exists locally when it does not exist in the forked state.
**Suggested fix:** Compare zero nonce/balance with the canonical empty code hash (`0xc5d246...a470`) and empty storage root (`0x56e81f...b421`), or use a shared account helper that matches Ethereum's empty-account definition.

### [MEDIUM] Loading a state root does not clear old tombstones
**Location:** packages/state/src/actions/generateCannonicalGenesis.js:20
**Issue:** `generateCanonicalGenesis()` replaces the account/code/storage caches, but it leaves `baseState.tombstones.accounts` and `baseState.tombstones.storageCleared` untouched. `setStateRoot()` calls this loader, so tombstones from the previous root remain active after switching to a root that may contain the account or storage again.
**Why it matters:** State-root switching can produce a state whose caches contain an account but whose tombstone set still makes `getAccount()` return `undefined`, or whose loaded fork/local storage is masked by an old storage-clear tombstone. This is a fragile cross-root leak in the persistence API.
**Suggested fix:** Snapshot and reset tombstones when replacing caches in `generateCanonicalGenesis()`, and restore both caches and tombstones in the catch path.

### [MEDIUM] `dumpStorageRange` only works when the start key already exists
**Location:** packages/state/src/actions/dumpStorageRange.js:26
**Issue:** Pagination starts only when a stored key is exactly equal to `_startKey`; if `_startKey` is between two populated slots, the method skips the rest of the storage and returns an empty page. It also relies on cache iteration order instead of sorting keys numerically, so "range" output depends on insertion/cache order rather than key order.
**Why it matters:** Callers using arbitrary range starts, or resuming from a key not currently present, get incomplete storage dumps. This is especially easy to hit in debug/storage-range style APIs where the next request's start key is a lower bound, not necessarily a populated slot.
**Suggested fix:** Sort dumped storage keys by numeric value and start when `key >= _startKey`; set `nextKey` to the first key after the returned page.

### [MEDIUM] `getProof` can read a different fork block than cached state
**Location:** packages/state/src/actions/getProof.js:19
**Issue:** Forked account/code/storage reads call `resolveForkBlockTag()` before caching remote data, but `getProof()` directly calls `getForkBlockTag()`. With `fork.blockTag` omitted or set to `latest`, proofs can be served from a moving latest block instead of pinning the fork block first.
**Why it matters:** A state manager can return account/storage/code from one fork block and EIP-1186 proofs from another, depending on call order and remote chain progress. That breaks the fork snapshot invariant consumers expect from a state manager.
**Suggested fix:** Call `await resolveForkBlockTag(baseState)` before creating the client/block tag in `getProof()`, matching the other fork-backed read paths.

</details>

<details>
<summary><strong>H04 — Blockchain + receipts + persistence</strong></summary>

# Blockchain + receipts + persistence review

**Slice:** H04
**Type:** horizontal
**Scope:** packages/blockchain packages/receipt-manager packages/sync-storage-persister
**Reviewed by:** codex (GPT-5.4)

## Summary

The highest-risk issues are in deletion and persistence invariants: the fork boundary can be deleted through its JSON-RPC hash alias, deleted blocks can remain reachable through non-`latest` tags, and a pending throttled persist can rewrite state after explicit removal. Forked chains also expose a readiness race because `createChain` resolves before RPC bootstrap completes, so immediate calls can run against an uninitialized chain. The receipt manager has weaker reorg hygiene than the blockchain layer: transaction-hash indexes are deleted unconditionally and can erase a replacement mapping, while legacy transaction type `0` is dropped from typed receipt responses. The source paths all exist; I did not run tests or builds.

## Findings

### [HIGH] Forked block can be deleted through its RPC hash alias
**Location:** packages/blockchain/src/actions/delBlock.js:40
**Issue:** `delBlock` only protects the fork boundary when the caller passes `bytesToHex(forkedBlock.hash())`. Forked RPC blocks with filtered transactions are also stored under `jsonRpcBlock.hash`, and passing that alias resolves to the same forked block but bypasses the equality check.
**Why it matters:** The forked block is the immutable anchor for remote historical lookup. Deleting it breaks the fork boundary and leaves later code assuming `blocksByTag.get('forked')` still points at a valid cached block.
**Suggested fix:** After resolving `block`, reject when `block === forkedBlock`, or compare against every hash alias returned by the same `getBlockHashes` helper used for descendant traversal.

### [HIGH] Deleting a block leaves iterator/custom tags pointing at removed blocks
**Location:** packages/blockchain/src/actions/delBlock.js:57
**Issue:** When a deleted block is tagged in `blocksByTag`, only `latest` is repaired. Tags set by `setIteratorHead` or any cached/custom tag continue to return the deleted block even after its hash and number indexes have been removed.
**Why it matters:** Chain consumers can keep iterating or querying from blocks that are no longer in the chain. This violates the public `delBlock` contract in `Chain.ts`, which says encountered heads are set to the parent block.
**Suggested fix:** For each block in `blocksToDelete`, scan `blocksByTag`; for matching values, set the tag to the deleted root's parent if it still exists, or delete the tag. Keep the special forked-block protection intact.

### [HIGH] Forked `createChain` resolves before the chain is initialized
**Location:** packages/blockchain/src/createChain.js:42
**Issue:** `createChain` is `async`, but it returns `decorate(createBaseChain(options))` without awaiting `baseChain.ready()`. With `fork.transport`, `createBaseChain` is still awaiting RPC bootstrap, so immediate public calls can observe empty maps; for example `getBlock` casts `blocksByTag.get('forked')` to a block and then reads `.header`.
**Why it matters:** `await createChain({ fork })` looks ready to callers but is not. This creates timing-dependent failures during startup and can surface as TypeErrors or inconsistent cache fetches instead of domain errors.
**Suggested fix:** In `createChain`, create the base chain, `await baseChain.ready()`, then decorate and return it. If `createBaseChain` must remain lazy, each public action that reads initialized state should await `baseChain.ready()` first.

### [HIGH] Pending throttled persist can resurrect removed state
**Location:** packages/sync-storage-persister/src/createSyncStoragePersister.js:69
**Issue:** `persistTevmState` schedules a trailing write through `throttle`, but `removePersistedState` only calls `storage.removeItem(key)`. If removal happens during the throttle window, the already scheduled callback later writes the old state back.
**Why it matters:** Reset/logout-style flows can appear to clear persisted state and then silently restore stale account/storage data milliseconds later. For browser persistence, this is both data-loss-prone and a privacy footgun.
**Suggested fix:** Make the throttle cancelable and have `removePersistedState` cancel any pending write before removing, or flush/serialize writes through a version token so callbacks scheduled before removal become no-ops.

### [MEDIUM] Receipt tx-hash deletion can erase a newer replacement index
**Location:** packages/receipt-manager/src/ReceiptManager.ts:471
**Issue:** `updateIndex(Delete, TxHash, block)` deletes every transaction hash from `TxHash` without checking that the stored index still points to the block being deleted.
**Why it matters:** During reorg-like replacement, the same transaction can be indexed for a newer/canonical block after also existing in an old side block. Deleting the old block later removes the shared tx hash and makes `getReceiptByTxHash` return `null` for the still-saved replacement receipt.
**Suggested fix:** Before deleting each `TxHash`, read the current index and only delete it if the encoded block hash matches `block.hash()` and the transaction index matches the transaction being removed.

### [MEDIUM] `includeTxType` omits legacy transaction type `0`
**Location:** packages/receipt-manager/src/ReceiptManager.ts:322
**Issue:** `getReceipts(..., includeTxType = true)` assigns `txType` only inside `if (type)`, so a valid transaction type value of `0` is treated as absent.
**Why it matters:** Consumers requesting typed receipts get inconsistent metadata: type `1` and `2` receipts include `txType`, while legacy/type-0 receipts do not. Downstream JSON-RPC formatting can then emit malformed or ambiguous receipt data.
**Suggested fix:** Change the guard to `if (type !== undefined)` or the package's exact transaction-type presence check, and cover `0` explicitly.

### [MEDIUM] `getLogs` defines but never enforces the block-range limit
**Location:** packages/receipt-manager/src/ReceiptManager.ts:392
**Issue:** `GET_LOGS_BLOCK_RANGE_LIMIT` is set to `2500`, but `getLogs` loops from `from.header.number` through `to.header.number` with no range check.
**Why it matters:** A caller can request a very large range and force sequential block and receipt lookups until the log-count or response-size limit happens to trip. Empty or sparse ranges do the most work and bypass those output limits entirely.
**Suggested fix:** Reject or clamp requests where `to.header.number - from.header.number + 1n` exceeds `GET_LOGS_BLOCK_RANGE_LIMIT` before entering the loop.

</details>

<details>
<summary><strong>H05 — Block, Tx, TxPool</strong></summary>

# Block, Tx, TxPool review

**Slice:** H05
**Type:** horizontal
**Scope:** packages/block packages/tx packages/txpool
**Reviewed by:** codex (GPT-5.4)

## Summary

The block package has two consensus-visible commitment bugs: header integer serialization truncates actual bytes, and EIP-7685 request commitments are computed as a trie root instead of the protocol hash. Deserialization is also too permissive for fork-activated header fields, because it fills defaults where RLP input should be rejected. The public block factory advertises transaction data input but stores that data as transactions without constructing transaction objects. TxPool's local fee-market override preserves a pricing bug that overstates effective priority fees for capped EIP-1559-style transactions.

## Findings

### [CRITICAL] Header integer serialization drops the first two data bytes
**Location:** packages/block/src/header.ts:31
**Issue:** `bigIntToUnpaddedBytes()` calls `toBytes(n).slice(2)`. `toBytes()` returns a `Uint8Array`, not a hex string, so this removes two real bytes from every integer field rather than removing a `0x` prefix. Small values like `1n` serialize as empty bytes, and larger values lose their two most-significant bytes.
**Why it matters:** `BlockHeader.raw()`, `serialize()`, and `hash()` use this helper for difficulty, number, gas limit, gas used, timestamp, base fee, and blob gas fields. Any nonzero header can get a non-canonical RLP encoding and therefore a wrong block hash, which is consensus divergence for imported or produced blocks.
**Suggested fix:** Encode Ethereum integers as unpadded bytes directly, with only zero mapped to an empty byte array, e.g. `n === 0n ? new Uint8Array() : toBytes(n)`. Add fixed known-header hash fixtures that exercise one-byte, two-byte, and multi-byte integer fields.

### [CRITICAL] EIP-7685 requests use a trie root instead of the requests hash
**Location:** packages/block/src/block.ts:96
**Issue:** `genRequestsTrieRoot()` builds an index-keyed RLP trie and `requestsTrieIsValid()` treats the empty value as `KECCAK256_RLP`. EIP-7685 defines `requests_hash` as a SHA-256 commitment over the SHA-256 hashes of non-empty serialized requests, not a Merkle Patricia trie root.
**Why it matters:** Prague/EIP-7685 blocks with requests will be committed, validated, and serialized against a value other clients do not use. Empty requests are also wrong: the stable empty commitment is `sha256("")`, not the empty RLP trie hash.
**Suggested fix:** Replace the trie helper with `computeRequestsHash(requests)` that filters one-byte empty requests, enforces ascending request type order, updates a SHA-256 hasher with each `sha256(request.serialize())`, and compares the result to the header field. Consider renaming internal `requestsRoot` APIs to `requestsHash` while preserving compatibility aliases.

### [HIGH] RLP header decoding accepts missing fork-activated fields
**Location:** packages/block/src/header.ts:113
**Issue:** `fromValuesArray()` only rejects a missing `baseFeePerGas` on the London activation block, and it does not reject a missing `withdrawalsRoot` at all. The constructor then supplies fork defaults such as `baseFeePerGas: 7n` and `withdrawalsRoot: KECCAK256_RLP`, so malformed post-London/post-Shanghai RLP headers can be accepted and rewritten as different headers.
**Why it matters:** Decoding network or persisted block data should reject headers with the wrong field count for the active fork. Accepting them creates synthetic headers and masks invalid input, and subsequent `hash()`/`serialize()` calls no longer represent the bytes that were decoded.
**Suggested fix:** In `fromValuesArray()`, validate the exact required field count and presence for the active fork before constructing the header. Require `baseFeePerGas` for all London+ headers and `withdrawalsRoot` for all Shanghai+ headers; keep constructor defaults only for programmatic `fromHeaderData()` creation.

### [HIGH] `createBlock()` stores transaction-shaped data as non-transaction objects
**Location:** packages/block/src/block.ts:130
**Issue:** `fromBlockData()` types `transactions` as transaction data, but the loop pushes each `txData` with `as any` instead of constructing a transaction with the header common. Plain transaction input therefore lands in `Block.transactions` without methods like `serialize()`, `supports()`, `hash()`, or `getValidationErrors()`.
**Why it matters:** The public `createBlock()` API can return a block that crashes later in `raw()`, trie generation, JSON conversion, or validation. It also skips hardfork-specific transaction normalization for exactly the path where callers are most likely to pass data dictionaries.
**Suggested fix:** Detect already-instantiated transaction objects separately, but otherwise construct with the zevm transaction factory using `header.common.ethjsCommon`. Keep the impersonated transaction exception explicit rather than broadening the whole path to `any`.

### [HIGH] TxPool overstates effective priority fee for capped fee-market transactions
**Location:** packages/txpool/src/TxPool.ts:69
**Issue:** With a nonzero base fee, `normalizedGasPrice()` returns `maxPriorityFeePerGas` for every fee-market-shaped transaction. The effective priority fee is `min(maxPriorityFeePerGas, maxFeePerGas - baseFee)`, clamped to zero for non-viable transactions.
**Why it matters:** `txsByPriceAndNonce()` uses this value for ordering. A transaction with `maxFeePerGas == baseFee` and a huge `maxPriorityFeePerGas` can be ranked ahead of transactions that actually pay the block producer, which breaks block-construction economics and affects EIP-7702 transactions through this facade.
**Suggested fix:** Return `min(tx.maxPriorityFeePerGas, tx.maxFeePerGas - baseFee)` when `baseFee` is provided, and clamp or filter negative values consistently with admission. Cover the capped-at-base-fee case explicitly.

### [MEDIUM] `ClRequest` silently wraps invalid request type numbers
**Location:** packages/block/src/ClRequest.ts:78
**Issue:** The constructor accepts any `number`, and serialization uses `Uint8Array.from([this.type])`. JavaScript coerces that value to a byte, so `256` serializes as `0`, `-1` as `255`, and non-integers are truncated.
**Why it matters:** Callers can sort and validate one request type while committing a different byte to the block body. That is a subtle public-API footgun for request construction and for decoded request data that is later reserialized.
**Suggested fix:** Validate `Number.isInteger(type) && type >= 0 && type <= 255` in the constructor before storing it, and reject decoded request byte arrays that do not contain a first byte.

</details>

<details>
<summary><strong>H06 — Trie, RLP, utils, address</strong></summary>

# Trie, RLP, utils, address review

**Slice:** H06
**Type:** horizontal
**Scope:** packages/trie packages/rlp packages/utils packages/address
**Reviewed by:** codex (GPT-5.4)

## Summary

The biggest local risk is that address and trie primitives expose mutable or non-canonical values while documenting them as safe foundational objects. `createAddress` silently accepts short hex strings and right-pads them into a different 20-byte address, directly contradicting its own invalid-address example. `EMPTY_STATE_ROOT` is marketed and partially guarded as immutable, but callers can still mutate the exported typed array through numeric index assignment. The local `trie` and `rlp` packages are mostly facades over `@evmts/zevm` / `@ethereumjs/trie`, so there is little local trie/RLP algorithm surface in these paths; the sharp edges are in the wrappers and shared primitives.

## Findings

### [HIGH] Short hex address strings are accepted and right-padded into the wrong address
**Location:** packages/address/src/createAddress.js:83
**Issue:** `createAddress('0x123')` does not reject a too-short address. `viem`'s `hexToBytes(hex, { size: 20 })` only enforces a maximum size and pads hex strings on the right, so this path produces bytes for `0x123000...` instead of rejecting or left-padding. The same behavior applies to unprefixed strings at line 86.
**Why it matters:** This is a public address factory whose docs explicitly show `createAddress('0x123')` as invalid. Accepting short strings silently turns user input into a different account/contract address, which can misroute calls, balances, storage lookups, or predicted deployment addresses.
**Suggested fix:** For string address inputs, require exactly 40 hex characters after the optional `0x` prefix and reject anything else. If numeric-style short addresses are intentionally supported, route them through bigint/number parsing and left-padding explicitly rather than using `hexToBytes(..., { size: 20 })`.

### [HIGH] Exported empty state root can still be mutated through indexed writes
**Location:** packages/trie/src/EMPTY_STATE_ROOT.js:56
**Issue:** The exported `Uint8Array` overrides methods like `set`, `fill`, and `reverse`, but typed array elements remain writable. A caller can still run `EMPTY_STATE_ROOT[0] = 0` and mutate the singleton root for every subsequent consumer in the process.
**Why it matters:** This value is a foundational trie constant and is documented as immutable. A single accidental indexed write can poison genesis/empty-root comparisons or any code that passes the exported singleton around by reference.
**Suggested fix:** Do not export a mutable typed-array instance as the canonical constant. Export a function that returns a fresh copy, or wrap the typed array in a `Proxy` that rejects numeric `set` operations and returns copies for buffer/view-producing accessors.

### [HIGH] Address instances alias caller-owned byte arrays
**Location:** packages/address/src/createAddress.js:77
**Issue:** `createAddress` passes caller-provided `Uint8Array` objects directly into `new Address(address)`, and the inherited `EthjsAddress` constructor stores that array reference. The same aliasing happens for existing `EthjsAddress` inputs at line 74.
**Why it matters:** Code can create an `Address`, use it as a stable account identity, then later mutate the original byte array and silently change `address.bytes` and `address.toString()`. This breaks the value-object expectation for addresses and is especially dangerous in caches, maps, contract-address prediction, and state access paths.
**Suggested fix:** Copy bytes at the boundary: `new Address(Uint8Array.from(address))` for raw bytes and `new Address(Uint8Array.from(address.bytes))` for `EthjsAddress` inputs. Consider making `Address` itself defensive by copying in its constructor or overriding `toBytes`/accessors to avoid exposing mutable internals.

### [MEDIUM] Contract address helpers accept non-address byte lengths
**Location:** packages/address/src/createContractAddress.js:70
**Issue:** `createContractAddress` only checks that `from.bytes` is a `Uint8Array`; it does not require an `EthjsAddress`/`Address` instance or a 20-byte value. `create2ContractAddress` has the same unchecked `from.bytes` assumption before concatenating at packages/address/src/create2ContractAddress.js:92.
**Why it matters:** JavaScript callers can pass `{ bytes: new Uint8Array(19) }` or another malformed object and receive a deterministic but invalid CREATE/CREATE2 prediction instead of an error. These helpers are commonly used to precompute addresses before deployment, so silent bad input is a public API footgun.
**Suggested fix:** Add a shared `assertAddress(from)` helper that verifies `from instanceof EthjsAddress` or `from.bytes instanceof Uint8Array && from.bytes.length === 20`, and use it in both CREATE and CREATE2 helpers before hashing.

### [MEDIUM] Seeded memory DBs cannot read Uint8Array keys supplied by the public type
**Location:** packages/utils/src/createMemoryDb.js:23
**Issue:** `createMemoryDb(initialDb)` stores the supplied `Map` as-is, but all later `get`/`put`/`del` operations normalize `Uint8Array` keys to hex strings via `encodeKey`. If `initialDb` is a `Map<Uint8Array, TValue>` as allowed by `CreateMemoryDbFn`, lookups with an equivalent `Uint8Array` miss because the stored key object was never normalized.
**Why it matters:** Callers seeding a DB with byte keys get an apparently empty database, while `shallowCopy()` works only because its internal map already contains normalized keys. That makes initialization behavior inconsistent and fragile for trie/state-manager callers using byte keys.
**Suggested fix:** Normalize `initialDb` entries on construction, e.g. build a new `Map` and insert each `[key, value]` as `[encodeKey(key), value]`, or narrow the public type so seeded maps must already use encoded string keys.

## Architectural observations

`packages/trie/src/index.ts` and `packages/rlp/src/Rlp.ts` are public barrels over `@evmts/zevm`, with trie ultimately re-exporting `@ethereumjs/trie`. That is fine as a facade, but it means local tests in these packages mostly verify wiring; any intended Tevm-specific trie/RLP invariants need to live either in the upstream dependency review or in wrapper-level contract tests around the exposed Tevm API.

</details>

<details>
<summary><strong>H07 — Errors, logger, common, consensus, effect</strong></summary>

# Errors, logger, common, consensus, effect review

**Slice:** H07
**Type:** horizontal
**Scope:** packages/errors packages/logger packages/common packages/consensus packages/effect
**Reviewed by:** codex (GPT-5.4)

## Summary

The main risk is in `@tevm/common`: every generated chain preset is converted into an EthereumJS Common using Mainnet as the base and `prague` as the default hardfork, so non-mainnet presets can silently execute under the wrong EVM rules. The same path installs an always-accepting mock KZG implementation by default, which makes Cancun/Prague blob validation non-authoritative unless users know to override it. Consensus light-client status is also too easy to mark ready inconsistently, which can let proof-backed reads proceed while the lifecycle says the client is not actually ready. The errors/effect issues are lower blast-radius but still public API footguns: effect resolution can defect outside the typed error channel, and some error metadata points users at stale or wrong diagnostics.

## Findings

### [HIGH] Chain presets execute with Mainnet Prague rules
**Location:** packages/common/src/createCommon.js:71
**Issue:** `createCommon` calls `createCustomCommon` with only `{ chainId, name }` and `Mainnet` as the base, while all generated presets pass `hardfork: 'prague'`. None of the viem chain metadata is translated into EthereumJS chain parameters, hardfork schedules, consensus settings, or L2-specific fork behavior.
**Why it matters:** A caller importing `optimism`, `base`, `bsc`, `polygon`, or any other preset gets an object whose `ethjsCommon` is effectively Mainnet-at-Prague with a different chain id. That can silently activate EIPs the target chain does not support and use mainnet gas/validation parameters, producing simulations and block/tx validation that diverge from the selected chain.
**Suggested fix:** Make presets carry an explicit EthereumJS common/base config and hardfork policy per chain, or require callers to opt into a generic mainnet-derived common. At minimum, stop defaulting all presets to `prague` and document/encode unsupported-chain behavior instead of presenting these as chain-accurate presets.

### [HIGH] Default Common trusts all KZG proofs
**Location:** packages/common/src/createCommon.js:66
**Issue:** When `customCrypto` is omitted, `createCommon` installs `createMockKzg()` as the default KZG implementation. That mock returns `true` from every proof verifier, and the default hardfork is `prague`, so EIP-4844 paths are enabled with a verifier that never verifies.
**Why it matters:** Users can accept or simulate blob transactions and KZG-dependent execution with invalid blob proofs without opting into an unsafe test double. This is a consensus-critical invariant for Cancun/Prague behavior and can hide invalid data in any local execution, fork, or mempool path that relies on `ethjsCommon.customCrypto.kzg`.
**Suggested fix:** Do not install the mock KZG by default for hardforks with blob support. Require a real KZG implementation, throw when a KZG-dependent operation is reached without one, or make the mock an explicit test-only opt-in with unsafe naming.

### [MEDIUM] Mock KZG returns malformed commitment and proof sizes
**Location:** packages/common/src/createMockKzg.js:24
**Issue:** `mockHash` is a 32-byte keccak hash, but KZG commitments and proofs are 48-byte values. `blobToKzgCommitment`, `computeBlobKzgProof`, `computeBlobProof`, and the cell/proof helpers all return that same bytes32-shaped value.
**Why it matters:** Even as a mock, this produces non-spec 4844 data. Code or tests that derive blob versioned hashes, enforce commitment/proof lengths, or round-trip blob transactions against this mock can pass with shapes that real KZG implementations would reject.
**Suggested fix:** If the mock remains, return correctly shaped bytes48 dummy commitments/proofs and add shape assertions around the mock API. Prefer throwing for commitment/proof production unless the mock is only being used for verifier bypass tests.

### [MEDIUM] Light-client readiness can be marked ready while still errored or syncing
**Location:** packages/consensus/src/createLightClientConsensusService.ts:35
**Issue:** `updateLightSyncStatus` accepts arbitrary partial status updates and only normalizes slot ordering. It allows inconsistent states such as `{ ready: true, status: 'error' }` or `{ ready: true, status: 'syncing' }`, and `isReady` reads only the boolean.
**Why it matters:** The action layer gates light-client reads on `isReady()`/`.ready`, not the lifecycle status. A light-client integration that accidentally sets `ready` true before the lifecycle reaches `ready` can allow proof-backed reads to proceed while the service is still syncing or has errored.
**Suggested fix:** Enforce the invariant in the consensus service: derive `ready` from `status === 'ready'`, or force `ready: false` whenever status is `idle`, `starting`, `syncing`, or `error`. Consider making `ready` read-only derived state instead of caller-supplied state.

### [MEDIUM] `resolveSync` can defect instead of returning a typed resolution error
**Location:** packages/effect/src/resolve.js:49
**Issue:** The sync resolver catch path falls back to `__dirname` when `options.basedir` is absent. This package is ESM (`type: module`), so `__dirname` is undefined; on a failed resolution without `basedir`, the catch handler itself throws `ReferenceError` instead of returning `CouldNotResolveImportError` in the Effect error channel.
**Why it matters:** Callers using Effect error handling cannot reliably catch failed module resolution. A missing import can bypass the declared `CouldNotResolveImportError` path and surface as an untyped defect.
**Suggested fix:** Replace the fallback with `options?.basedir ?? process.cwd()` or a directory derived from `import.meta.url`, and guard `options` consistently in both sync and async resolvers.

### [LOW] Subclass error docs paths are overwritten by base classes
**Location:** packages/errors/src/ethereum/ResourceNotFoundError.js:60
**Issue:** `ResourceNotFoundError` hard-codes `docsBaseUrl` and `docsPath` instead of preserving `args.docsBaseUrl` and `args.docsPath`. For example, `AccountNotFoundError` passes `/reference/tevm/errors/classes/accountnotfounderror/`, but the base constructor replaces it with the generic resource-not-found docs path.
**Why it matters:** The public error taxonomy exposes specific subclasses, but their rendered messages can link to the wrong docs. That makes production diagnostics and user-facing error handling less trustworthy.
**Suggested fix:** Use `docsBaseUrl: args.docsBaseUrl ?? 'https://tevm.sh'` and `docsPath: args.docsPath ?? '/reference/tevm/errors/classes/resourcenotfounderror/'` in base error classes that are intended to be subclassed, and audit the other base JSON-RPC errors for the same pattern.

### [LOW] Error messages report a stale package version
**Location:** packages/errors/src/ethereum/BaseError.js:6
**Issue:** `getVersion()` is hard-coded to `1.1.0.next-73`, while `@tevm/errors` is currently `1.0.0-next.148` in `packages/errors/package.json`. Every `BaseError` message includes this stale version.
**Why it matters:** Versioned error output is meant to make bug reports and support actionable. A stale version string sends maintainers and users to the wrong release when debugging failures.
**Suggested fix:** Generate or import the package version at build time, or remove the version line if it cannot be kept in sync reliably.

</details>

<details>
<summary><strong>H08 — JSON-RPC transport (jsonrpc + http-client + server)</strong></summary>

# JSON-RPC transport (jsonrpc + http-client + server) review

**Slice:** H08
**Type:** horizontal
**Scope:** packages/jsonrpc packages/http-client packages/server
**Reviewed by:** codex (GPT-5.4)

## Summary

The main risk in this slice is that the server transport is only partially JSON-RPC-compatible: several request/response framing details fail for common clients or edge-case ids. The Express and Next adapters are especially fragile because they pass pre-parsed `req.body` values into code that expects a raw JSON string, which breaks the documented Express setup and the default Next API route behavior. Body-size enforcement also returns a 413 without stopping the stream or clearing listeners, so an oversized request can still keep appending to memory after the limit fires. The HTTP client package is mostly a thin viem wrapper; I did not find a distinct transport bug there in the reviewed source.

## Findings

### [HIGH] Express and Next handlers break when the framework has already parsed JSON
**Location:** packages/server/src/internal/getRequestBody.js:13
**Issue:** `getRequestBody` returns `req.body` as-is whenever it exists, but `parseRequest` later calls `JSON.parse(body)`. In real Express setups using the documented `app.use(express.json())`, and in Next API routes with the default body parser enabled, `req.body` is already an object, not a JSON string. That object path produces an invalid JSON error instead of handling the JSON-RPC request.
**Why it matters:** The public adapters fail in normal framework configurations, including the Express example in `packages/server/src/adapters/createExpressMiddleware.js:16`. Users following the docs can get 400 responses for valid JSON-RPC calls.
**Suggested fix:** Make `getRequestBody` return a discriminated raw-or-parsed value, or normalize `req.body` with `typeof req.body === 'string' ? req.body : JSON.stringify(req.body)` before parsing. Add explicit handling for Buffers and reject unsupported body types with `InvalidRequestError`, not `InvalidJsonError`.

### [HIGH] Error responses drop valid falsy JSON-RPC ids
**Location:** packages/server/src/internal/handleError.js:14
**Issue:** `handleError` includes the request id only when `jsonRpcReq.id` is truthy. JSON-RPC ids may legally be `0`, `""`, or `null`, and those are omitted from error responses.
**Why it matters:** Clients correlate responses by id. A request such as `{ "jsonrpc": "2.0", "id": 0, "method": "bad_method" }` receives an error without `id`, which can be treated as an unmatchable response or notification-like error.
**Suggested fix:** Use `jsonRpcReq.id !== undefined` instead of a truthiness check. Preserve `null` when it came from the request; for parse errors where no id is knowable, emit `id: null` if strict JSON-RPC compatibility is desired.

### [HIGH] Oversized bodies continue buffering after the size limit fires
**Location:** packages/server/src/internal/getRequestBody.js:25
**Issue:** When `Buffer.byteLength(body, 'utf8') > maxBodySize`, the promise resolves with `ReadRequestBodyError`, but the request stream is not destroyed, paused, or detached. The `data` listener keeps appending chunks to `body` until the client stops sending.
**Why it matters:** The configured body limit does not actually cap memory usage for hostile or buggy clients. A large upload can trigger a 413 and still continue growing the in-process string behind the already-resolved promise.
**Suggested fix:** Track a `done` flag, remove listeners, and destroy or pause the request once the limit is exceeded. Avoid appending additional chunks after the limit, and make the handler close the connection consistently for 413 responses.

### [MEDIUM] One malformed batch element rejects the whole batch
**Location:** packages/server/src/internal/parseRequest.js:40
**Issue:** Batch parsing validates the entire array with `zBulkRequest.safeParse(raw)`. If any element is malformed, `parseRequest` returns one `InvalidRequestError` for the whole batch instead of processing valid entries and returning per-element errors for invalid entries.
**Why it matters:** JSON-RPC batch callers can lose valid responses because a single bad element poisons the entire batch. This is especially visible for wallets or tooling that coalesce unrelated RPC calls into one HTTP request.
**Suggested fix:** Parse batch items independently. Return a normalized internal representation that can carry either a valid request or an item-level JSON-RPC error, then have `handleBulkRequest` execute valid requests and include item errors in the response array.

### [MEDIUM] The compatibility parser accepts requests without `jsonrpc: "2.0"`
**Location:** packages/server/src/internal/parseRequest.js:6
**Issue:** `jsonrpc` is optional in the Zod schema even when `createHttpHandler` runs in compatibility mode. A payload with only `{ "method": "eth_chainId" }` passes transport validation and is executed as JSON-RPC 2.0.
**Why it matters:** Compatibility mode enforces HTTP method, path, content type, batch size, and notification semantics, but still accepts non-JSON-RPC request envelopes. That weakens the mode that is otherwise positioned as strict transport compatibility.
**Suggested fix:** Make `jsonrpc: z.literal('2.0')` required for compatibility mode. If legacy Tevm behavior needs the optional field, pass a parser option and keep that looseness only outside compatibility mode.

### [MEDIUM] Framework adapters drop the handler promise
**Location:** packages/server/src/adapters/createNextApiHandler.js:19
**Issue:** The Next and Express adapters call `handler(req, res)` without returning or awaiting it. Any synchronous throw before the handler's own awaits, or any rejected promise outside the local catches, becomes detached from the framework handler.
**Why it matters:** Next can consider the API route resolved before the response is written, and both adapters make unexpected transport failures harder for the framework to observe or report. The same pattern appears in `packages/server/src/adapters/createExpressMiddleware.js:37`.
**Suggested fix:** `return handler(req, res)` in both adapters. For Express, either return the promise or catch and pass failures to `next` by accepting the third middleware argument.

### [LOW] `createJsonRpcFetcher` violates its exported response type
**Location:** packages/jsonrpc/src/createJsonRpcFetcher.js:24
**Issue:** `createJsonRpcFetcher` is declared to return `JsonRpcClient`, whose `JsonRpcResponse` type requires a `method` field, but the runtime success and error responses omit `method`. The tests assert the method-less shape, so the type and runtime contract disagree.
**Why it matters:** Consumers using the package types can write code that assumes `response.method` exists, then receive `undefined` at runtime. This is a public API footgun even though the helper is deprecated.
**Suggested fix:** Either remove `method` from `JsonRpcResponse` if the package intends to model standard JSON-RPC responses, or add `method: request.method` to every `createJsonRpcFetcher` response and keep the nonstandard Tevm response shape consistent.

</details>

<details>
<summary><strong>H09 — Actions (handlers backing every method)</strong></summary>

# Actions (handlers backing every method) review

**Slice:** H09
**Type:** horizontal
**Scope:** packages/actions
**Reviewed by:** codex (GPT-5.4)

## Summary

The main risk in this slice is not missing methods; it is that several implemented handlers return confidently wrong chain data or mutate state before they know the operation has succeeded. The debug tracing paths are especially fragile: block and transaction tracing can execute against the target block's post-state rather than the pre-transaction state, and trace listeners can leak across calls. State/RPC mutation paths also have real correctness hazards around partial `setAccount` writes and raw transaction admission. I found no evidence that `packages/actions` was missing, so the review covered the intended scope.

## Findings

### [HIGH] Block and transaction tracing uses post-block state for the transaction being traced
**Location:** packages/actions/src/debug/debugTraceTransactionProcedure.js:158
**Issue:** `debug_traceTransaction` replays prior transactions into `vmClone`, then calls `traceCallHandler` with `blockTag: transactionByHashResponse.result.blockHash`. `traceCallHandler` deep-copies that VM and resets the state root to the supplied block's state root, which is the final post-block state, discarding the carefully prepared pre-transaction state. The same pattern appears in `debug_traceBlock` and `debug_traceChain` when they pass the current block hash while tracing each transaction.
**Why it matters:** Debug traces for historical transactions can be impossible traces: storage reads, balances, nonces, revert behavior, and nested calls are evaluated against state after the transaction/block already executed. Anyone using `debug_traceTransaction`, `debug_traceBlock*`, or `debug_traceChain` for debugging, indexing, or verification gets misleading results.
**Suggested fix:** When a caller supplies a prepared VM, trace directly against its current state and do not pass a block tag that resets state. Split `traceCallHandler` into "resolve block state" and "trace this VM state" helpers, then have block/transaction tracing use the latter.

### [HIGH] `tevm_setAccount` can partially mutate state and still return an error
**Location:** packages/actions/src/SetAccount/setAccountHandler.js:122
**Issue:** The handler queues `putAccount`, `putCode`, and storage writes before any checkpoint is created, waits with `Promise.allSettled`, and returns errors if any write rejects. There is no rollback for writes that already succeeded.
**Why it matters:** `tevm_setAccount` backs direct account editing plus state overrides and several anvil helpers. A failed storage/code/account update can leave the VM in a partially modified state even though the API reports failure, which is silent state corruption for tests and simulations.
**Suggested fix:** Create a state checkpoint before the first mutation, execute the writes, commit only after all succeed, and revert on any error. Avoid parallel writes if the state manager requires ordered account/code/storage updates.

### [HIGH] `eth_sendRawTransaction` reports success even when the tx pool rejects the transaction
**Location:** packages/actions/src/eth/ethSendRawTransactionProcedure.js:31
**Issue:** The JSON-RPC procedure calls `await txPool.add(tx, true)` and ignores the returned result. Other code paths treat `addResult.error` as a rejection, but this one always returns the transaction hash unless parsing or signing failed.
**Why it matters:** Invalid signed raw transactions can get a successful `eth_sendRawTransaction` response without being admitted to the pool. In automine mode this can cascade into mining behavior that is inconsistent with the RPC response.
**Suggested fix:** Capture the return value from `txPool.add`, return a JSON-RPC error when `addResult.error` is non-null, and only emit/mine/return the hash after admission succeeds.

### [HIGH] `eth_getTransactionReceipt` underreports EIP-1559 effective gas price
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:111
**Issue:** The local receipt path computes `effectiveGasPrice` as `maxPriorityFeePerGas` when the priority fee is below `maxFeePerGas - baseFeePerGas`. It omits the base fee in that branch.
**Why it matters:** Receipts for EIP-1559 transactions can report only the tip instead of `baseFeePerGas + min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas)`. Fee accounting, explorer output, and clients comparing Tevm receipts to Ethereum JSON-RPC receipts will be wrong.
**Suggested fix:** Use the same formula as the block receipts path: `min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)`, with a legacy `gasPrice` branch for legacy transactions.

### [HIGH] `eth_newFilter` captures every future log and returns fake metadata
**Location:** packages/actions/src/eth/ethNewFilterHandler.js:57
**Issue:** The listener installed for new logs never applies the filter's address/topics criteria. It also stores placeholder block/transaction metadata (`blockNumber: 0n`, `transactionHash: '0x'`, etc.) and `eth_getFilterChanges` returns those placeholders unchanged.
**Why it matters:** A log filter is correct for historical logs but becomes incorrect as soon as new blocks are mined: unrelated logs are returned, and related logs have unusable block and transaction fields. Consumers relying on filter polling will see false positives and invalid log identities.
**Suggested fix:** Emit enough context from mining to build a full filter log, or have the filter listener receive enriched log events. Apply the same address/topics matching used by subscriptions before pushing to `filter.logs`.

### [MEDIUM] Trace listeners are not always unregistered
**Location:** packages/actions/src/internal/runCallWithTrace.js:61
**Issue:** `runCallWithTrace` registers `step` and `afterMessage` listeners, but the `lazilyRun` branch returns before the `finally` cleanup. `executeCall` uses this branch for `createTrace`, so every traced call leaves listeners on the VM. Other trace helpers such as `runCallWithCallTrace` and `runCallWithFlatCallTrace` also register listeners without a cleanup path.
**Why it matters:** Repeated tracing increases memory and per-step work over time, and stale listeners keep mutating closed-over trace objects on later executions. This is a latent performance and correctness hazard for long-lived clients using `tevm_call({ createTrace: true })` or debug tracing.
**Suggested fix:** Return a cleanup function from lazy trace setup and call it in `executeCall`'s `finally`, or wrap the later `runTx` in the same helper so listener registration and removal are paired. Add `try/finally` cleanup to every trace helper.

### [MEDIUM] Forked transaction receipts are mapped with wrong field names
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:52
**Issue:** The fork fallback maps `blockHash` from `r.hex` instead of `r.blockHash`, and maps `cumulativeGasUsed` from `r.cumulativeBlockGasUsed` even though Ethereum JSON-RPC receipts use `cumulativeGasUsed`.
**Why it matters:** On forked clients, receipts fetched from upstream are returned with an invalid/missing block hash and can throw or produce a bad cumulative gas value. This breaks a common fork workflow where the transaction exists upstream but not in the local receipt cache.
**Suggested fix:** Map the upstream receipt schema directly: `blockHash: r.blockHash`, `cumulativeGasUsed: BigInt(r.cumulativeGasUsed)`, and keep the field-name conversion covered alongside `eth_getBlockReceipts`.

### [MEDIUM] Valid JSON-RPC id `0` is dropped by many handlers
**Location:** packages/actions/src/createHandlers.js:227
**Issue:** Many JSON-RPC responses use `...(request.id ? { id: request.id } : {})`, which omits valid falsy IDs such as `0` and `''`. Some handlers use the correct `request.id !== undefined` check, so behavior is inconsistent across methods.
**Why it matters:** JSON-RPC clients match responses by `id`; dropping `0` makes a normal request look like a notification response. This affects broad public RPC surface area, including `eth_mining`, `eth_syncing`, many eth/debug/anvil methods, and fork fallback errors.
**Suggested fix:** Replace truthiness checks with `request.id !== undefined` or a small shared helper used by all procedures.

### [MEDIUM] `earliest` resolves to block 1 in log range parsing
**Location:** packages/actions/src/eth/utils/parseBlockParam.js:46
**Issue:** `parseBlockParam` returns `1n` for `earliest`, but Ethereum's `earliest` tag refers to the genesis block, block `0`.
**Why it matters:** `eth_getLogs` and other users of this parser silently skip genesis-block data when callers request ranges from `earliest`. It is an off-by-one semantic bug in a public JSON-RPC block tag.
**Suggested fix:** Return `0n` for `earliest` and make callers handle chains whose genesis block is unavailable explicitly.

</details>

<details>
<summary><strong>H10 — Procedures, decorators, memory-client, node, client-types</strong></summary>

# Procedures, decorators, memory-client, node, client-types review

**Slice:** H10
**Type:** horizontal
**Scope:** packages/procedures packages/decorators packages/memory-client packages/client-types packages/node
**Reviewed by:** codex (GPT-5.4)

## Summary

The main correctness risk is in the EIP-1193 request decorator: it constructs a fresh JSON-RPC handler for every request, but handler construction starts and owns interval-mining timers. That makes interval mining leak timers, multiply block production, and leave old timers running after later `anvil_setAutomine` calls. I also found public-surface footguns where documented options are silently ignored, local JSON-RPC errors are retried as if they were transport failures, and request typing omits runtime-supported TEVM methods. The `@tevm/procedures` package still exists as a public package, but its only source is a side-effecting deprecation log with no compatibility exports.

## Findings

### [HIGH] EIP-1193 requests leak interval-mining timers
**Location:** packages/decorators/src/request/requestEip1193.js:23
**Issue:** `requestEip1193` calls `requestProcedure(client)` inside the per-request function. `requestProcedure` builds `createHandlers(client)`, and handler construction starts an interval-mining timer when `client.miningConfig.type === 'interval'`. Every `client.request(...)` on an interval-mining Tevm client therefore creates another timer. Because each timer is captured by a different handler closure, a later `anvil_setAutomine` or `anvil_setIntervalMining` request only stops/replaces the timer owned by that one fresh closure, not the timers created by earlier requests.
**Why it matters:** MemoryClient routes viem actions through this EIP-1193 request path, so a normal interval-mining client can silently accelerate block production and keep mining after the caller believes interval mining was disabled. This is a broken node invariant and a hard-to-debug public API bug.
**Suggested fix:** Hoist `const handleRequest = requestProcedure(client)` into the decorator closure, like `tevmSend` does for `send`, and have `request` call that stable handler. Also avoid creating handler sets with timer side effects anywhere in hot request paths.

### [MEDIUM] Semantic JSON-RPC errors are retried by default
**Location:** packages/decorators/src/request/requestEip1193.js:22
**Issue:** The EIP-1193 provider wraps all local JSON-RPC execution in viem's `withRetry`. With no options, viem retries twice and `shouldRetry` defaults to retrying every thrown error. This code throws `ProviderRpcError` for ordinary JSON-RPC failures such as validation errors, unsupported methods, reverts, or other procedure errors, so those semantic failures are retried as if they were transient network failures.
**Why it matters:** This is an in-process EVM, not a flaky HTTP transport. Retrying local semantic errors wastes execution, can duplicate expensive fork reads, and is dangerous for non-idempotent methods if a procedure returns an error after partial state changes.
**Suggested fix:** Do not retry by default in `requestEip1193`, or pass a `shouldRetry` that excludes `ProviderRpcError`/JSON-RPC errors and only retries explicit transport-level failures from a fork transport.

### [MEDIUM] `cacheTime` is exposed but always overwritten
**Location:** packages/memory-client/src/createMemoryClient.js:316
**Issue:** `createMemoryClient` spreads user options and then unconditionally sets `cacheTime: 0`, so a caller-provided `cacheTime` can never take effect even though `MemoryClientOptions` exposes it and the docs describe it as configurable.
**Why it matters:** Users tuning viem caching for polling/watch-heavy clients get a silently different client than requested. This is especially misleading because the public options type says the knob is supported.
**Suggested fix:** Either move the default before `...options` so user input wins, or remove `cacheTime` from the public options/docs if MemoryClient intentionally forbids viem caching.

### [MEDIUM] Published mining examples use an ignored option shape
**Location:** packages/memory-client/src/createMemoryClient.js:35
**Issue:** The public JSDoc repeatedly documents `mining: { auto: true }`, `mining: { auto: false }`, and `mining: { interval: 5000 }`, but the node only reads `options.miningConfig` and expects `{ type: 'auto' | 'manual' | 'interval', blockTime?: number }`.
**Why it matters:** JavaScript users following the docs get the default `{ type: 'auto' }` regardless of their requested mode. The worst case is a test suite that thinks it disabled automining with `mining: { auto: false }` but actually mines every transaction.
**Suggested fix:** Update the examples to `miningConfig`, and either add a runtime compatibility translation for the documented `mining` shape or reject it with a clear configuration error.

### [MEDIUM] EIP-1193 request typing omits runtime TEVM methods
**Location:** packages/decorators/src/request/Eip1193RequestProvider.ts:17
**Issue:** `Eip1193RequestProvider.request` includes `tevm_call`, `tevm_dumpState`, `tevm_loadState`, `tevm_getAccount`, and `tevm_setAccount`, but omits `JsonRpcSchemaTevm['tevm_mine']` even though the runtime handler exposes `tevm_mine` and `packages/memory-client/src/TevmRpcSchema.ts` includes it.
**Why it matters:** The public provider type rejects a method that the public provider actually supports. Typed users either cannot call `provider.request({ method: 'tevm_mine' })` directly or have to cast around the package's own types.
**Suggested fix:** Keep `Eip1193RequestProvider` in sync with the runtime request handler and `TevmRpcSchema`; at minimum include `JsonRpcSchemaTevm['tevm_mine']`, and consider deriving this schema from one shared source.

### [LOW] `@tevm/procedures` is a public package with no usable API
**Location:** packages/procedures/src/index.ts:1
**Issue:** The package entry point only executes `console.log('@tevm/procedures has been merged with @tevm/actions. Please use @tevm/actions instead.')` and exports nothing, while `packages/procedures/package.json` still publishes the package as public.
**Why it matters:** Existing consumers get broken named imports instead of a compatibility layer, and any runtime import emits unsolicited stdout from a library package. The package also declares `"sideEffects": false`, which conflicts with the entry point's only behavior.
**Suggested fix:** Either make this package a real compatibility barrel that re-exports `@tevm/actions` with deprecation docs, or stop publishing it. If it remains only a warning shim, remove `sideEffects: false` and avoid stdout side effects in normal imports.

</details>

<details>
<summary><strong>H11 — Contract, predeploys, precompiles</strong></summary>

# Contract, predeploys, precompiles review

**Slice:** H11
**Type:** horizontal
**Scope:** packages/contract packages/predeploys packages/precompiles
**Reviewed by:** codex (GPT-5.4)

## Summary

The highest-risk issue is in the default P256 verifier: it delegates to noble-curves with the default low-S policy, which is stricter than RIP-7212 and will reject otherwise valid high-S P-256 signatures. Custom precompile calls also let malformed calldata escape `defineCall` before the EVM-style error boundary, so arbitrary calls to a JS precompile can throw through the host instead of returning a deterministic revert result. The contract package has multiple event typing defects: event creators are instantiated with the generic parameters in the wrong order, and event argument extraction excludes the concrete tuple/object shapes it is supposed to preserve. Predeploys are mechanically small, but their public examples still describe an obsolete shape that does not match the exported function or the node option that consumes it.

## Findings

### [HIGH] P256 verifier rejects valid high-S signatures
**Location:** packages/precompiles/src/p256verify.precompile.ts:68
**Issue:** `p256.verify(signature, msgHash, publicKey, { prehash: false })` uses noble-curves' default signature verification policy. Current noble-curves defaults to low-S verification, but RIP-7212/EIP-7212 only requires `r` and `s` to be in `(0, n)` and does not impose `s <= n / 2`.
**Why it matters:** Tevm installs this as the standard P256VERIFY implementation. A high-S P-256 signature that an OP-stack/RIP-7212 chain accepts will be returned as invalid in Tevm, causing fork simulations and account-abstraction/passkey validation paths to diverge from the target chain.
**Suggested fix:** Pass `lowS: false` to noble verification and add explicit boundary tests for both low-S and high-S variants of the same valid signature. Keep the existing `prehash: false` behavior.

### [HIGH] Malformed precompile calldata bypasses the revert wrapper
**Location:** packages/precompiles/src/defineCall.ts:62
**Issue:** `decodeFunctionData` runs before the `try` block. Unknown selectors, truncated calldata, and malformed ABI-encoded inputs throw before `defineCall` can convert the failure into an `ExecResult`.
**Why it matters:** Precompiles are callable by arbitrary EVM code and user RPC calls. Bad calldata should behave like an EVM call failure, but this path can reject/throw through the JavaScript host and destabilize `tevmCall`/VM execution instead of returning a deterministic revert-shaped result.
**Suggested fix:** Move decode, handler lookup, handler execution, log conversion, and result encoding under one error boundary. Return a consistent `ExecResult` for decode failures, and distinguish missing handlers from handler-thrown errors if the message is surfaced.

### [MEDIUM] Contract event creators are typed with swapped generic parameters
**Location:** packages/contract/src/Contract.ts:124
**Issue:** `Contract.events` instantiates `EventActionCreator<THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode>`, but `EventActionCreator` declares its parameters as ABI, bytecode, deployedBytecode, address.
**Why it matters:** Runtime event filters include the correct `address`, `bytecode`, and `deployedBytecode`, but the public TypeScript type assigns those fields to the wrong generic slots. Addressed contracts can appear to have no typed event `address`, and bytecode/deployed-bytecode fields are reported with address-derived types.
**Suggested fix:** Change the instantiation to `EventActionCreator<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress>` and add a type assertion covering `createContract(...).withAddress(...).events.Transfer({}).address`.

### [MEDIUM] Event arg extraction excludes the concrete arg shapes
**Location:** packages/contract/src/event/EventActionCreator.ts:23
**Issue:** `MaybeExtractEventArgsFromAbi` wraps `GetEventArgs` in `Exclude<..., readonly unknown[] | Record<string, unknown>>`. Concrete event arg tuples and named-argument objects are assignable to those excluded shapes, so the helper erases the useful event argument type instead of preserving it.
**Why it matters:** The public event factory is supposed to provide type-safe log filters, but this makes `args` degrade toward `never`/unusable shapes for precisely the named or tuple event arguments callers need to filter on. Users either lose type safety or have to cast around contract events.
**Suggested fix:** Remove this broad `Exclude` and return `GetEventArgs<TAbi, TEventName>` directly for known events. If the goal is only to remove viem's broad fallback, use a narrower helper that detects `unknown`/broad ABI inputs without excluding concrete object and tuple results.

### [MEDIUM] Multi-output precompile functions cannot be represented correctly
**Location:** packages/precompiles/src/CallResult.ts:32
**Issue:** `CallResult.returnValue` is typed as only `AbiParametersToPrimitiveTypes<...['outputs']>[0]`. For ABI functions with two or more outputs, `encodeFunctionResult` needs the full output tuple, but the handler type only permits the first return value.
**Why it matters:** Custom precompiles are meant to mirror contract ABIs. Any precompile method returning multiple values is either impossible to implement type-safely or requires `as any`, which defeats the main reason to use `defineCall` and can produce misencoded return data at runtime.
**Suggested fix:** Model `returnValue` conditionally: no outputs => `undefined`, one output => that primitive, multiple outputs => the full `AbiParametersToPrimitiveTypes<outputs>` tuple. Keep `defineCall`'s encoding aligned with that type.

### [LOW] Predeploy docs point users at a non-working API shape
**Location:** packages/predeploys/src/definePredeploy.js:12
**Issue:** The example calls `definePredeploy({ address, contract: createContract(...) })` and then passes `predeploy.predeploy()` to a `predeploys` option. The exported function actually expects an addressed `Contract`, and downstream node/EVM options consume `customPredeploys: [predeploy]`, not the `{ address }` object returned by `predeploy.predeploy()`.
**Why it matters:** This is public package documentation in the source JSDoc and generated docs. Following it either fails immediately because `contract.address` is undefined on the wrapper object, or produces an object with no contract bytecode for the code-loading path.
**Suggested fix:** Update the examples to `definePredeploy(MyContract.withAddress(...))` and `createMemoryClient({ customPredeploys: [predeploy] })`. Consider removing or deprecating `predeploy.predeploy()` unless there is still a real consumer for the address-only shape.

</details>

<details>
<summary><strong>H12 — Bundler core</strong></summary>

# Bundler core review

**Slice:** H12
**Type:** horizontal
**Scope:** bundler-packages/base-bundler bundler-packages/bundler-cache bundler-packages/compiler bundler-packages/config bundler-packages/resolutions bundler-packages/runtime bundler-packages/solc bundler-packages/whatsabi
**Reviewed by:** codex (GPT-5.4)

## Summary

The highest-risk issue is that `foundryProject` is executed through a shell command assembled from project config, so opening or compiling an untrusted project can run arbitrary commands. The compiler/cache path also has correctness hazards that can silently return stale or wrong ABI/bytecode: the requested remote solc version is effectively bypassed, and cache validity ignores compiler/config inputs. The resolver rewrites Solidity source in ways that can change version constraints and select the wrong remapping when prefixes overlap. All scoped paths existed; I reviewed the `src` trees and only consulted tests where they clarified intended behavior.

## Findings

### [CRITICAL] Foundry config loading executes config-controlled shell text
**Location:** bundler-packages/config/src/foundry/loadFoundryConfig.js:88
**Issue:** `foundryProject` may be a string from `tevm.config.json`, `tevm.json`, or the tsconfig plugin config, and it is interpolated directly into `execSync(`${forgeCommand} config --json`, ...)`. A value like `"forge; arbitrary-command"` is executed by the shell before config loading finishes.
**Why it matters:** Tevm config is loaded by bundler/editor tooling against the current project. A malicious repository can turn config discovery into command execution, including in TypeScript server or bundler processes where users may not expect project config to execute shell text.
**Suggested fix:** Use `execFileSync`/`spawnSync` with an argv array, e.g. executable plus `['config', '--json']`, and treat the string as an executable path only. Reject shell metacharacters or split the API into `{ command, args }` with explicit validation.

### [HIGH] `createSolc` falls back to bundled solc instead of the requested remote version
**Location:** bundler-packages/solc/src/solc.js:158
**Issue:** `createSolc` wraps the loaded compiler with `compile: (input) => solcCompile(s, input)`, but callers later pass that wrapper back into `solcCompile`. The outer `solcCompile` calls `wrapper.compile(JSON.stringify(input))`; the wrapper then calls `solcCompile` on an already-stringified input and returns an object, causing the outer `JSON.parse(...)` to throw and hit the fallback at line 138. The fallback compiles with the package-level `_solc`, not the requested remote compiler.
**Why it matters:** Consumers asking for a specific solc release can silently compile with whatever bundled `solc` version is installed. That can produce different ABI, bytecode, metadata, errors, and pragma compatibility than the selected compiler.
**Suggested fix:** Make `createSolc` return the raw loaded compiler shape expected by `solcCompile`, or make `solcCompile` accept both JSON strings and parsed outputs without wrapping `compile` recursively. Remove the fallback or restrict it to a clearly detected TS-plugin compatibility case that cannot mask a version mismatch.

### [HIGH] Artifact cache ignores compiler and config inputs
**Location:** bundler-packages/bundler-cache/src/readArtifacts.js:71
**Issue:** Cache validity checks only the cache `version` string and source-file mtimes. The cache key and metadata do not include the solc version, resolved compiler config, remappings/libs, output settings, or source-rewrite behavior that produced the cached `solcInput`.
**Why it matters:** Changing remappings, libraries, compiler version, optimizer/settings, or other compile inputs can return old artifacts as long as source mtimes are unchanged. That is silent stale ABI/bytecode, and the public base bundler reads cache before recompiling in `resolveModuleAsync`/`resolveModuleSync`.
**Suggested fix:** Store and validate a deterministic compile fingerprint in metadata: solc identity/version, resolved config fields that affect resolution/compilation, solc input settings, and codegen-affecting options. Treat a fingerprint mismatch as a cache miss.

### [HIGH] Relative entry modules are read with `basedir` but compiled under the unresolved path
**Location:** bundler-packages/compiler/src/compiler/compileContracts.js:33
**Issue:** The async compiler resolves `filePath` against `basedir` only for the initial read, then passes the original `filePath` into `moduleFactory` and looks up `moduleMap.get(filePath)`. The sync compiler has the same pattern in `compileContractsSync.js`. For a public call like `resolveTsModule('./contracts/Counter.sol', process.cwd(), ...)`, local imports are resolved from `dirname('./contracts/Counter.sol')` relative to `process.cwd`, not from the resolved entry path, and the solc source key remains the unresolved string.
**Why it matters:** The base-bundler docs show relative module paths, so this is a realistic public API path. It can resolve dependencies differently depending on process cwd, produce mismatched source IDs, and miss cache entries for the same physical file under different spellings.
**Suggested fix:** Resolve the entry module once at the compiler boundary, normalize it to the formatted absolute path, and use that path consistently for `moduleFactory`, entry-module lookup, solc source keys, and cache keys in both async and sync paths.

### [HIGH] Pragma rewriting drops Solidity upper bounds
**Location:** bundler-packages/resolutions/src/utils/updatePragma.js:29
**Issue:** `updatePragma` rewrites `pragma solidity ^0.8.0;`, `~0.8.0`, `<0.8.0`, and bounded forms like `>=0.8.0 <0.8.9` into an open-ended `pragma solidity >=...;`. The tests assert this behavior, so it is intentional in the current implementation rather than an accidental edge case.
**Why it matters:** This changes the contract's declared compiler compatibility before solc sees it. Sources that intentionally exclude newer compiler versions can compile anyway, producing bytecode or diagnostics under a compiler the author explicitly ruled out.
**Suggested fix:** Do not rewrite pragma constraints. Select a compiler that satisfies the original pragma, or fail with a clear error when the configured compiler does not satisfy it. If an override is needed, validate the override against the original constraint instead of replacing the constraint with `>=`.

### [HIGH] Generated declaration files contain implementation initializers
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:66
**Issue:** The `.d.ts` generator emits declarations such as `const _abiMyContract = [...] as const;` and `const _nameMyContract = "MyContract" as const;`. Declaration files cannot contain array/object implementation initializers like this; the snapshots lock in strings that TypeScript will reject as declaration-file syntax.
**Why it matters:** `resolveDts`/`resolveDtsSync` are the TypeScript-facing outputs used by the ts-plugin. Returning syntactically invalid `.d.ts` content breaks editor/typecheck integration even when Solidity compilation succeeded.
**Suggested fix:** Emit declaration syntax only, for example `declare const _abiMyContract: readonly [...]` and `declare const _nameMyContract: "MyContract"`, or inline the literal ABI/name types directly into the exported `Contract<...>` declaration.

### [MEDIUM] Overlapping remappings resolve by insertion order instead of longest prefix
**Location:** bundler-packages/resolutions/src/utils/resolveImportPath.js:45
**Issue:** Remappings are applied by iterating `Object.entries(remappings)` and returning the first key where `importPath.startsWith(key)`. Foundry-style remappings can overlap, and the most specific prefix should win; with the current code, a broader prefix inserted earlier captures imports that should map to the narrower prefix.
**Why it matters:** Projects with nested vendor packages or generated tsconfig path remappings can compile against the wrong dependency tree. The failure can be silent if both targets contain a matching Solidity file.
**Suggested fix:** Normalize remappings into an ordered list and sort by descending prefix length before matching, preserving insertion order only as a tie-breaker.

### [MEDIUM] Unknown chains with custom RPC still dereference `chain`
**Location:** bundler-packages/whatsabi/src/resolveContractUri.js:48
**Issue:** `resolveContractUri` allows an unknown chain when `rpcUrl` is supplied, but then evaluates `chain.blockExplorers?.default.url`. When `chain` is undefined, that throws before the custom RPC path can proceed.
**Why it matters:** The error message explicitly tells users to pass `?rpcUrl=...` for unknown chains, but that documented escape hatch still crashes. This blocks ABI loading for chains not present in `knownChains`.
**Suggested fix:** Use `chain?.blockExplorers?.default.url` and only add an explorer loader when either `etherscanBaseUrl` or a known-chain explorer URL exists.

### [MEDIUM] Contract URI type rejects the scheme parsed at runtime
**Location:** bundler-packages/whatsabi/src/ContractUri.ts:4
**Issue:** The public `ContractUri` type is `eth://${KnownChainIds}/...`, while `contractUriPattern` only accepts `evm://...`.
**Why it matters:** TypeScript users are guided toward URIs that `parseUri` will reject, and the actually supported runtime scheme is a type error. That makes the public API self-contradictory.
**Suggested fix:** Pick one scheme and make `ContractUri`, `contractUriPattern`, docs, and examples agree. If both should be supported, update the regex and type union together.

</details>

<details>
<summary><strong>H13 — Bundler plugins (esbuild/vite/webpack/rollup/etc.)</strong></summary>

# Bundler plugins (esbuild/vite/webpack/rollup/etc.) review

**Slice:** H13
**Type:** horizontal
**Scope:** bundler-packages/bun bundler-packages/esbuild bundler-packages/rollup bundler-packages/rspack bundler-packages/vite bundler-packages/webpack bundler-packages/unplugin bundler-packages/requirejs bundler-packages/tevm-run bundler-packages/mud
**Reviewed by:** codex (GPT-5.4)

## Summary

The highest-risk issue is that the RequireJS adapter compiles Solidity to ESM and hands that text to `onload.fromText`, so the advertised RequireJS path cannot evaluate normal generated contracts. The shared unplugin also has adapter drift: it only honors `.sol.ts`/`.sol.d.ts` sidecars while the Bun and RequireJS adapters honor JavaScript sidecars too, so Vite/Rollup/esbuild/webpack users get different behavior for the same import. The MUD optimistic-state code has multiple stale-state hazards, most notably leaving old optimistic logs active after the tx pool drains. All scope paths existed.

## Findings

### [HIGH] RequireJS evaluates ESM output as RequireJS text
**Location:** bundler-packages/requirejs/src/requirejsPluginTevm.js:200
**Issue:** The loader calls `moduleResolver.resolveEsmModule(...)` and passes the resulting ESM source directly to `onload.fromText(contents)`. RequireJS `fromText` evaluates AMD/browser script text, but Tevm ESM output contains `import`/`export` syntax rather than a `define(...)` wrapper.
**Why it matters:** `tevm-sol!./Contract.sol` imports will fail at runtime with syntax errors instead of returning the contract object, making the RequireJS adapter effectively unusable for compiled contracts.
**Suggested fix:** Generate AMD-compatible text for this adapter, or at minimum CJS wrapped in a `define(['@tevm/contract'], ...)` factory. Add a load test that asserts the text passed to `fromText` is executable by RequireJS and exports the contract.

### [HIGH] Empty tx pool keeps stale optimistic state
**Location:** bundler-packages/mud/src/createOptimisticHandler.ts:148
**Issue:** `processTransactionsAndUpdateLogs` logs "clearing logs and returning canonical state" when `txPool.txsInPool === 0`, but it just returns. `optimisticLogs` and `internalLogs` are not cleared, and subscribers are not notified.
**Why it matters:** When the last optimistic transaction is removed, rejected, or drained outside the canonical-sync path, `getOptimisticState` continues applying old pending updates. Consumers can show contract state that no longer corresponds to either the mempool or the canonical stash.
**Suggested fix:** In the empty-pool branch, reset both log arrays, notify optimistic subscribers with updates that reflect the transition back to canonical state, and cover the `txremoved` last-transaction case.

### [HIGH] Optimistic handler registry aliases different stores using the same client
**Location:** bundler-packages/mud/src/react/useOptimisticWrapper.tsx:36
**Issue:** `handlerRegistry` is keyed only by `client`, but `createOptimisticHandler` also captures `storeAddress`, `stash`, `sync`, `config`, and `loggingLevel`. A second provider using the same client for a different store or stash receives the first handler.
**Why it matters:** Multi-world or multi-store React apps will read and write through the wrong store address and stash. The second `SyncProvider` also receives the first handler's `syncAdapter`, so canonical updates can be applied to the wrong state container.
**Suggested fix:** Key the registry by the full handler identity, at least `(client, storeAddress, stash)`, and release entries on cleanup when no providers remain.

### [MEDIUM] `tevm-run` does not catch process failures and collapses argv
**Location:** bundler-packages/tevm-run/src/run.js:15
**Issue:** The function returns the Bun shell promise from inside `try` without awaiting it, so asynchronous command failures bypass the `catch` block. It also interpolates `positionals.join(' ')` as one shell interpolation, which passes all user arguments as a single argv value rather than preserving argument boundaries.
**Why it matters:** Failed scripts do not get the intended diagnostic wrapping, and scripts invoked as `tevm-run script.ts --flag value` can receive `"--flag value"` as one argument. That is a public CLI footgun and breaks normal argument forwarding.
**Suggested fix:** `await` the shell promise inside the `try`, and pass args as separate argv values instead of joining. If Bun shell interpolation cannot spread arrays safely here, use `Bun.spawn`/`spawnSync` style argv construction.

### [MEDIUM] Shared unplugin ignores JavaScript sidecars
**Location:** bundler-packages/unplugin/src/tevmUnplugin.js:78
**Issue:** `loadInclude` skips Tevm compilation only when `${id}.ts` or `${id}.d.ts` exists. The Bun and RequireJS adapters check `.ts`, `.js`, `.mjs`, and `.cjs`, and the Bun comments document that behavior.
**Why it matters:** The same `.sol` import behaves differently across adapters. A project that ships `Contract.sol.js` or `Contract.sol.mjs` as a pre-generated module will be respected by Bun but silently recompiled by Vite/Rollup/esbuild/webpack.
**Suggested fix:** Centralize sidecar detection and use the same extension list for every adapter. Prefer returning the sidecar contents through the bundler plugin rather than only using `loadInclude` as a skip gate.

### [MEDIUM] Canonical sync can hang forever after an adapter error
**Location:** bundler-packages/mud/src/internal/mud/createSyncAdapter.ts:25
**Issue:** `storageAdapter` wraps queued canonical work in `new Promise<void>((resolve) => { ... })`, but there is no `reject` path. If `storageAdapter(block)`, `onTx`, `applyStashUpdates`, or `notifyStashSubscribers` throws, the queued async function rejects inside `stateUpdateCoordinator`, while the promise returned to `createStoreSync` never resolves or rejects.
**Why it matters:** One malformed log or transient RPC failure can wedge MUD sync indefinitely with no error propagated to the caller.
**Suggested fix:** Capture `reject` in the promise and wrap the queued body in `try/catch`, rejecting on failure. The coordinator should also handle per-update failures so one rejected update does not silently stop processing later queued work.

### [MEDIUM] Global state coordinator drops updates across independent handlers
**Location:** bundler-packages/mud/src/internal/stateUpdateCoordinator.ts:52
**Issue:** `stateUpdateCoordinator` is a module-level singleton. When any handler queues a canonical update, it removes all pending optimistic updates from the shared queue, including updates belonging to other clients, stores, or React providers.
**Why it matters:** Independent optimistic handlers can interfere with each other. A canonical sync event in one store can drop a pending optimistic recalculation in another store, leaving the second UI stale until another event happens to retrigger it.
**Suggested fix:** Instantiate a coordinator per optimistic handler, or partition the queue by handler/store identity and only clear optimistic work in the same partition.

</details>

<details>
<summary><strong>H14 — Rust bundler components</strong></summary>

# Rust bundler components review

**Slice:** H14
**Type:** horizontal
**Scope:** bundler-packages/resolutions-rs bundler-packages/runtime-rs bundler-packages/solc-rs
**Reviewed by:** codex (GPT-5.4)

## Summary

The Rust ports are not behaviorally equivalent to the JS bundler stack yet; the highest-risk issues are in dependency graph construction and runtime code generation. `resolutions-rs` can silently omit transitive Solidity dependencies, and even the modules it does return keep the original import strings instead of the absolute paths the compiler pipeline expects. `runtime-rs` currently emits contracts that cannot faithfully be used by `createContract`: ABI entries are serialized as JSON strings, bytecode is always dropped, and the N-API boundary does not accept the same artifact shape as the JS runtime. `solc-rs` also deserializes normal Tevm compiler outputs too strictly, so common `outputSelection` settings fail before callers can inspect compiler output.

## Findings

### [HIGH] Transitive imports are marked seen before they are processed
**Location:** bundler-packages/resolutions-rs/src/module_factory.rs:106
**Issue:** The worker loop inserts each child import into `state.seen` before spawning `process_module`, but `process_module` immediately returns when the id is already in `seen` at `process_module.rs:19`. That means first-level imports are read, but their children are skipped and never inserted into `state.graph`.
**Why it matters:** Any contract with dependencies deeper than one level can compile with an incomplete source set. The JS compiler path walks the returned graph to build `sources`, so this Rust replacement would drop transitive dependencies and fail compilation or, worse, compile a different source graph if another source key happens to match.
**Suggested fix:** Let `process_module` own the `seen` insertion, or split the state into `queued` and `processed` sets. Do not pre-insert an import into the same set that `process_module` uses as its "already processed" guard.

### [HIGH] Module code is not rewritten to the resolved import ids
**Location:** bundler-packages/resolutions-rs/src/process_module.rs:35
**Issue:** The Rust module graph stores the raw source code directly after resolving imports. The JS implementation rewrites import specifiers to `resolvedImport.updated` and then updates the pragma before storing `code` (`bundler-packages/resolutions/src/moduleFactory.js:73`), which is what lets solc match imports against the absolute source ids passed in standard JSON.
**Why it matters:** The Rust graph can contain absolute `imported_ids` while each module's `code` still says `import "./Foo.sol"` or `import "pkg/Foo.sol"`. Feeding that graph into the existing compiler pipeline produces a source map whose keys do not match the import strings solc sees.
**Suggested fix:** Preserve `ResolvedImport { original, absolute, updated }` through `resolve_imports`, apply the same import-path rewrite as JS before inserting `ModuleInfo`, and only set `raw_code` to the unmodified source.

### [HIGH] Runtime output contains unusable ABI strings
**Location:** bundler-packages/runtime-rs/src/lib.rs:55
**Issue:** `format_abi` converts each JSON ABI item with `item.to_string()`, producing strings like `{"type":"function",...}`. `createContract` treats `humanReadableAbi` as human-readable ABI and passes it to `parseAbi`, while the JS runtime uses `abitype`'s `formatAbi` to emit strings like `function balanceOf(address) view returns (uint256)`.
**Why it matters:** Generated Rust runtime modules can throw at import time or create contracts without usable read/write/event factories. This breaks the central public artifact of the runtime package.
**Suggested fix:** Either emit an `abi` JSON field instead of `humanReadableAbi`, or use a real ABI formatter equivalent to `formatAbi` for functions, events, errors, constructors, and fallback/receive entries.

### [HIGH] Runtime generation drops all bytecode
**Location:** bundler-packages/runtime-rs/src/lib.rs:75
**Issue:** Both `bytecode_hex` and `deployed_bytecode_hex` are hard-coded to `None`, so every generated contract serializes bytecode as null regardless of the Foundry artifact contents.
**Why it matters:** `.s.sol` modules and any `includeBytecode` path lose deploy/runtime bytecode. `contract.deploy()` then throws because `createContract` has no `bytecode`, and script-style modules cannot execute against Tevm with their deployed code.
**Suggested fix:** Extract `evm.bytecode.object` and `evm.deployed_bytecode.object` from `foundry_compilers::artifacts::Contract`, normalize them to `0x` hex strings/bytes, and make bytecode inclusion explicit to match the JS `includeBytecode` parameter.

### [HIGH] `generateRuntimeJs` accepts the wrong artifact shape
**Location:** bundler-packages/runtime-rs/src/lib.rs:633
**Issue:** The N-API function parses `contracts_json` as `Vec<(String, Contract)>`, but the JS runtime and compiler pass artifacts as an object keyed by contract name. The generated type also names the parameter `solcOutputJson` and has no `includeBytecode` argument, so it cannot be a drop-in replacement for `generateRuntime(artifacts, moduleType, includeBytecode, package)`.
**Why it matters:** Passing the same JSON shape used by the current bundler path will fail deserialization before any code is generated. Even callers that adapt to the tuple array shape cannot request the no-bytecode vs bytecode behavior that the rest of the bundler relies on.
**Suggested fix:** Accept `HashMap<String, Contract>` or a serde model matching `@tevm/compiler` artifacts, expose an `include_bytecode` boolean, and align the generated `.d.ts` signature with the JS runtime API.

### [HIGH] `solc-rs` cannot deserialize normal partial solc outputs
**Location:** bundler-packages/solc-rs/src/models.rs:207
**Issue:** `SolcContractOutput` requires `metadata`, `userdoc`, `devdoc`, and `evm`; `SolcSourceEntry` also requires `ast` at line 199. Tevm's normal async compiler path requests only `abi`, `userdoc`, and optional bytecode unless ASTs are requested, so solc legitimately omits many of those fields.
**Why it matters:** `solc_compile` can return `SerializationError` for successful solc runs using common `outputSelection` settings. That prevents callers from receiving warnings, ABI-only artifacts, or partial outputs that the JS wrapper currently returns.
**Suggested fix:** Make output-selected fields optional throughout the solc output model, especially `SolcContractOutput`, `SolcEVMOutput`, bytecode subfields, and `SolcSourceEntry.ast`.

### [MEDIUM] Valid files with only commented/string `import ` text are reported as resolution failures
**Location:** bundler-packages/resolutions-rs/src/resolve_imports.rs:98
**Issue:** After successfully parsing with Solar, the resolver returns an error whenever no AST imports were found but the raw code contains the substring `import `. Comments and string literals can contain that substring without declaring an import.
**Why it matters:** A valid Solidity file with a comment such as `// import "./old.sol";` or a string containing `import ` fails resolution even though the parser already proved there are no import directives.
**Suggested fix:** Remove the raw substring heuristic. If parsing succeeds, trust the AST item list; unresolved imports should be represented only by actual `ItemKind::Import` resolution failures.

### [MEDIUM] Remapping values are joined incorrectly when the prefix lacks a trailing slash
**Location:** bundler-packages/resolutions-rs/src/resolve_import_path.rs:72
**Issue:** For a remapping key like `@openzeppelin` and import `@openzeppelin/contracts/token/ERC20/ERC20.sol`, `strip_prefix` returns `/contracts/...`. `PathBuf::join` treats a leading slash as absolute and discards the remapping target.
**Why it matters:** Valid prefix remappings without trailing slashes resolve to filesystem-root paths such as `/contracts/...` instead of the configured dependency directory. This is a parity gap with the JS resolver's string replacement behavior.
**Suggested fix:** Strip leading path separators from `rest` before joining, or perform a single prefix replacement and then normalize the resulting path.

### [MEDIUM] `resolveImportsJs` loses the original and updated import strings at the FFI boundary
**Location:** bundler-packages/resolutions-rs/src/lib.rs:78
**Issue:** The exported resolver receives only `Vec<PathBuf>` and fills `original`, `absolute`, and `updated` with the same absolute path string. The declared JS type promises the same shape as the JS resolver, where `original` is the source specifier and `updated` is the rewritten specifier.
**Why it matters:** Consumers cannot use the Rust resolver result to rewrite imports or explain resolution decisions. Any code expecting parity with `@tevm/resolutions` will silently lose the source import string.
**Suggested fix:** Change the Rust resolver to return `ResolvedImport` records, preserving `import_dir.path.value` as `original` and the resolved path as `absolute`/`updated`.

## Architectural observations

The Rust packages currently duplicate the JS package names but not their contracts: error types are flattened to generic N-API failures, `runtime-rs` accepts a different artifact shape, and `resolutions-rs` no longer carries enough data to perform the JS rewrite step. Before these can safely back the bundler, the Rust APIs need explicit parity targets for `moduleFactory`, `resolveImports`, `generateRuntime`, and `solcCompile` rather than independent "similar" models.

</details>

<details>
<summary><strong>H15 — Extensions + LSP + CLI</strong></summary>

# Extensions + LSP + CLI review

**Slice:** H15
**Type:** horizontal
**Scope:** extensions lsp cli
**Reviewed by:** codex (GPT-5.4)

## Summary

The most important issue is that the LSP package has multiple entrypoint/runtime breaks: the published binary points at `out/` while the package publishes `dist/`, and the Volar server source imports/calls the bundler cache incorrectly. The viem extension also has a dangerous API bug where `getAccount` is wired to the mutating `tevm_setAccount` RPC method. The CLI has several user-facing commands that fail on normal inputs, including `serve --fork` with its own default fork block option and `multicall --run` with JSON contracts. All requested scope paths exist; I focused on source files and only consulted tests where they clarified behavior.

## Findings

### [HIGH] Viem `getAccount` sends the mutating `tevm_setAccount` RPC
**Location:** extensions/viem/src/tevmViemExtension.js:100
**Issue:** The `getAccount` handler is typed as `GetAccountHandler`, but it sends `method: 'tevm_setAccount'` with the caller's params instead of `tevm_getAccount`.
**Why it matters:** Consumers calling `client.extend(tevmViemExtension()).tevm.getAccount(...)` expect a read. Instead, the extension dispatches a state-writing RPC with a partial account object, so reads can return the wrong shape and may create or overwrite account state depending on handler behavior.
**Suggested fix:** Change the method to `tevm_getAccount`, keep the get-account params shape, and add a regression that `getAccount` returns account data without changing balance/nonce/code.

### [HIGH] The published LSP binary points at an unshipped `out` directory
**Location:** lsp/lsp/bin/tevm-lsp.cjs:6
**Issue:** The binary executes `require('../out/index.js')`, but `package.json` declares `main: "dist/index.js"` and only includes `dist/**/*.js` plus `bin/**/*.cjs` in published files.
**Why it matters:** Installing `@tevm/lsp` and running `tevm-lsp` will fail with `MODULE_NOT_FOUND` unless an unpublished `out/index.js` happens to exist. This breaks the package's primary CLI entrypoint.
**Suggested fix:** Point both `tevm-lsp.cjs` and `evmts-lsp.cjs` at `../dist/index.js`, or change the build/package layout so `out/index.js` is actually emitted and included.

### [HIGH] The standalone Volar LSP imports and constructs the cache incorrectly
**Location:** lsp/lsp/src/SolFile.ts:3
**Issue:** `SolFile` imports `createCache` from `@tevm/base-bundler`, but that package's source barrel exports `bundler` and `getContractPath`, not `createCache`. The call site then invokes `createCache(console)` even though the cache factory used elsewhere expects cache directory, file access object, and cwd.
**Why it matters:** Opening a Solidity file through the standalone LSP hits this path during `SolFile.update`; the server either cannot build, cannot load, or constructs an invalid cache before it can generate the embedded TypeScript file. The package also lists `@tevm/base-bundler` only in `devDependencies` even though this source path uses it at runtime.
**Suggested fix:** Import `createCache` from `@tevm/bundler-cache`, add the actual runtime bundler/cache packages to `dependencies`, and construct the cache with `c.cacheDir`, the file access object, and `projectRoot`.

### [HIGH] `tevm serve --fork` crashes with the default fork block option
**Location:** cli/src/utils/server.ts:79
**Issue:** The CLI default for `forkBlockNumber` is the string `"latest"`, but `initializeServer` converts any truthy value with `BigInt(forkBlockNumber)` whenever a fork URL is provided.
**Why it matters:** The documented/default path `tevm serve --fork <url>` throws `Cannot convert latest to a BigInt` before the server starts. Users must discover that the default only works when no fork is used.
**Suggested fix:** Treat `"latest"` and other named tags as block tags, only call `BigInt` for numeric strings, or make the option a discriminated `forkBlockTag`/`forkBlockNumber` pair.

### [HIGH] `multicall --run` maps over a JSON string instead of parsed contracts
**Location:** cli/src/commands/multicall.tsx:178
**Issue:** `contracts` is read from CLI/env/defaults as a string, with the default set to `'[]'`, but `createParams` immediately calls `contracts.map(...)` without using the existing `parseContracts` helper.
**Why it matters:** The direct execution path for `tevm multicall --run` fails with `contracts.map is not a function` for both the default and normal JSON-string inputs, so the command is effectively unusable outside the interactive editor path.
**Suggested fix:** Parse `enhancedOptions['contracts']` before mapping, validate that the result is an array, and reject invalid JSON instead of silently substituting an empty array.

### [MEDIUM] Snapshot cache keys can collide across different transaction fields
**Location:** extensions/test-node/src/internal/normalizeTx.ts:25
**Issue:** `normalizeTx` returns an ordered list of present values without field names. Requests such as `{ from: X }` and `{ to: X }`, or single-value `chainId`, `data`, `gas`, and `value` variants, can normalize to the same array.
**Why it matters:** `eth_createAccessList`, `eth_estimateGas`, and other cached methods use this output in their snapshot keys. A collision can replay a cached RPC response for a different transaction shape, producing incorrect gas/access-list snapshots that look deterministic.
**Suggested fix:** Return a canonical object or `[fieldName, normalizedValue]` tuples for every transaction field, with stable sorting for list-like fields.

### [MEDIUM] Viem `setAccount` cannot set balance or nonce to zero
**Location:** extensions/viem/src/tevmViemExtension.js:121
**Issue:** `setAccount` includes `balance` and `nonce` only when they are truthy, so `0n` is dropped from the JSON-RPC params.
**Why it matters:** Resetting an account balance or nonce to zero is a normal state-management operation. Through this extension the call appears successful but leaves the previous value unchanged, which is a hard-to-spot state bug in tests and local simulations.
**Suggested fix:** Use nullish checks, e.g. `params.balance !== undefined`, for all numeric fields where zero is valid.

### [LOW] CLI version output is hardcoded
**Location:** cli/src/cli.tsx:6
**Issue:** The Pastel app reports version `0.0.0` instead of reading the package version.
**Why it matters:** `tevm --version` and generated help output are misleading for every published CLI build, which makes bug reports and compatibility checks harder.
**Suggested fix:** Load the version from `package.json` at build/runtime, or inject it during the CLI build.

</details>

<details>
<summary><strong>H16 — Top-level tevm package + test infra</strong></summary>

# Top-level tevm package + test infra review

**Slice:** H16
**Type:** horizontal
**Scope:** tevm test
**Reviewed by:** codex (GPT-5.4)

## Summary

The most important issue is public API drift in the top-level `tevm` package: the generated declarations advertise a runtime export that the generated JS does not provide. The test infra also has a hard broken import in the benchmark precompile test path, so that slice cannot load as written. The conformance harness is not just incomplete; some filters are wired in a way that silently executes an unscoped subset while reporting named coverage, and the wrapper scripts build shell commands from environment and CLI input. Both requested scope paths exist.

## Findings

### [HIGH] Top-level declarations expose a runtime export that JS does not provide
**Location:** tevm/index.ts:45
**Issue:** `createJsonRpcFetcher` is included in a type-only export block from `@tevm/jsonrpc`, while the generated declaration file advertises it as a normal named export from `tevm` and the generated JS only exports `http`, `rateLimit`, `webSocket`, and `loadBalance` from `@tevm/jsonrpc`.
**Why it matters:** TypeScript consumers can write `import { createJsonRpcFetcher } from 'tevm'` without a type error, but the ESM/CJS runtime entrypoints do not actually provide that binding. This is a public barrel footgun that turns into an import-time failure for users following the published types.
**Suggested fix:** Either move `createJsonRpcFetcher` into the runtime export block next to `http`/`rateLimit`, or remove it from the top-level declarations if it is intentionally not part of the `tevm` barrel. Regenerate and verify `tevm/index.js`, `tevm/index.cjs`, and `tevm/index.d.ts` agree.

### [HIGH] Benchmark precompile test imports a non-existent local module
**Location:** test/bench/src/precompiles/FsPrecompile.ts:2
**Issue:** The file imports `defineCall` and `definePrecompile` from `../src/index.js`, which resolves to `test/bench/src/src/index.js` from this directory. That path does not exist.
**Why it matters:** `test/bench/src/precompiles/Fs.spec.ts` imports this module, so the precompile benchmark/spec path fails during module resolution before it can exercise the custom precompile behavior.
**Suggested fix:** Import from the real public surface, e.g. `tevm/precompiles`, or add/use a direct `@tevm/precompiles` dependency if the benchmark package should avoid the top-level barrel.

### [MEDIUM] Published `tevm` package does not ship or register its CLI shim
**Location:** tevm/package.json:382
**Issue:** `tevm/cli.js` exists, but `package.json` has no `bin` field and the `files` allowlist starts with `index*` and subdirectories, omitting `cli.js`.
**Why it matters:** The changelog says the top-level package owns a CLI shim, but an npm install of `tevm` will not expose a `tevm` executable and may not include the shim file at all. Users relying on the documented/package-level CLI get a missing command instead of `@tevm/cli`.
**Suggested fix:** Add a `bin` entry such as `"tevm": "./cli.js"` and include `cli.js` in `files`, or delete the shim and remove the implied CLI surface from the top-level package.

### [MEDIUM] JSR manifest omits the precompiles subpath and is version-stale
**Location:** tevm/jsr.json:4
**Issue:** `tevm/package.json` exports `./precompiles` and the package contains `tevm/precompiles/index.ts`, but `tevm/jsr.json` does not export `./precompiles`. The JSR manifest is also still at `1.0.0-next.139` while `tevm/package.json` is `1.0.0-next.149`.
**Why it matters:** JSR users get a different public surface from npm users, and the version drift makes it easy to publish or dry-run the wrong artifact metadata. The missing subpath specifically blocks `@tevm/tevm/precompiles` even though the top-level npm package supports `tevm/precompiles`.
**Suggested fix:** Generate JSR exports from the same source as npm exports, add `./precompiles`, and keep the manifest version synchronized during release/versioning.

### [MEDIUM] Named conformance groups do not filter anything
**Location:** test/conformance-utils/run-fixture-suite.mjs:203
**Issue:** `vectorMatches` special-cases `group === 'boundary'` and `group === 'eip'` by skipping the only group-name filter. The root scripts use `--group=boundary` and `--group=eip`, so those commands actually run the first `--limit` vectors matching the hardfork, not a boundary or EIP subset.
**Why it matters:** Fast conformance jobs can report artifacts named as boundary/EIP coverage while exercising an arbitrary sorted prefix of the fixture corpus. That creates false confidence and makes regressions depend on fixture ordering rather than the intended target group.
**Suggested fix:** Back `boundary` and `eip` with explicit target lists/patterns, or remove the special cases and require `--pattern`/real group identifiers that are actually matched against vector IDs.

### [MEDIUM] Conformance wrapper scripts execute unescaped environment and argv through a shell
**Location:** test/ethereum-state-tests/run-general-state-tests.mjs:10
**Issue:** The wrapper builds a single command string from `TEVM_GENERAL_STATE_TESTS_FIXTURES` and `process.argv`, then passes it to `spawnSync(..., { shell: true })`. `test/execution-spec-tests/run-execution-spec-tests.mjs` has the same pattern for `TEVM_EXECUTION_SPEC_TESTS_FIXTURES`.
**Why it matters:** Fixture paths and pass-through flags are often CI/job inputs. A value containing shell metacharacters can execute additional commands on the developer or CI machine running the conformance harness.
**Suggested fix:** Call `spawnSync(process.execPath, [script, '--suite=general-state-tests', ...(fixtures ? [\`--fixtures=${fixtures}\`] : []), ...argv], { stdio: 'inherit' })` and do the same for execution-spec tests.

</details>

### Vertical slices (feature reviews)

<details>
<summary><strong>V01 — Forking & state proxying end-to-end</strong></summary>

# Forking & state proxying end-to-end review

**Slice:** V01
**Type:** vertical
**Scope:** packages/state/src packages/blockchain/src packages/node/src packages/actions/src
**Reviewed by:** codex (GPT-5.4)

## Summary

Forked state is cached as if it were pinned to one immutable upstream state, but the pinning is only by block number or by still-moving tags in several paths. That leaves Tevm able to combine a cached fork block/header with account and storage reads from a different upstream canonical block after a reorg or after `safe`/`finalized` advances. I also found two concrete RPC selector bugs where historical `eth_getBalance`/`eth_getCode` reads do not actually query the requested fork block. Resetting or changing the fork RPC URL keeps old fork caches and block maps alive, so a reset can silently continue serving state from the previous upstream. The prefetch proxy is also installed globally and captures stale cloned VMs, making the optimization ineffective and retaining old call state.

## Findings

### [HIGH] Forks are pinned by block number, not block identity
**Location:** packages/node/src/createTevmNode.js:364
**Issue:** A fork created with no `blockTag` or with `blockTag: 'latest'` resolves the fork anchor by calling `eth_blockNumber` and storing only that number. Later state reads use that number for `eth_getProof`/`eth_getStorageAt`, while the blockchain has separately cached a block header/state root for that height.
**Why it matters:** If the upstream reorgs at the fork height between startup and a lazy account/storage fetch, Tevm can execute against block A's header/stateRoot while caching account or storage values from block B at the same number. That is silent fork-state corruption and can produce wrong simulation results.
**Suggested fix:** Pin forks to a block hash plus number at initialization. Fetch the fork block once, store its hash/stateRoot, and either use EIP-1898 block-hash selectors for upstream reads or re-fetch/verify the block hash before accepting lazy state for a numbered selector.

### [HIGH] Moving `safe` and `finalized` fork tags poison the fork cache over time
**Location:** packages/node/src/createTevmNode.js:362
**Issue:** The initialization path only resolves `latest`; `safe` and `finalized` are passed through unchanged. The state manager then repeatedly uses the moving tag for lazy remote reads while storing all results in one unversioned `forkCache`.
**Why it matters:** A fork configured at `safe` or `finalized` can cache an account from one safe block and a storage slot from a later safe block under the same local fork state. Users who choose these tags specifically for reorg safety get a hybrid state that never existed upstream.
**Suggested fix:** Treat every moving tag as an anchor request, not as a cache key. Resolve `latest`, `safe`, and `finalized` to a concrete block identity before constructing the blockchain/state manager, and reject or explicitly define `pending` for fork anchors.

### [HIGH] `eth_getBalance` ignores hex block numbers
**Location:** packages/actions/src/eth/getBalanceProcedure.js:21
**Issue:** The JSON-RPC procedure maps a hex block quantity to `{ blockNumber: BigInt(req.params[1]) }`, but `getBalanceHandler` only reads `blockTag`. The requested historical block number is therefore dropped and the handler defaults to `latest`.
**Why it matters:** `eth_getBalance(address, "0x123")` on a fork returns the local latest/fork overlay balance instead of the requested historical balance. This is a direct RPC correctness bug and is especially bad for forked reads where the fallback transport could have answered the requested block.
**Suggested fix:** Pass `blockTag: BigInt(req.params[1])` or parse via the shared block-tag parser. Also route non-latest balance lookups through `vm.blockchain.getBlockByTag` so hex quantities and cached/fork-fetched blocks follow the same path as storage/account reads.

### [HIGH] `eth_getCode` treats short hex block numbers as block hashes on cache miss
**Location:** packages/actions/src/eth/getCodeHandler.js:33
**Issue:** For any hex `tag`, `getCodeHandler` calls `vm.blockchain.getBlock(hexToBytes(tag))`. On a cache miss, `getBlock` forwards that byte array back to the fork fetcher as a hex string, and `getBlockFromRpc` sends it as `eth_getBlockByHash`, not `eth_getBlockByNumber`.
**Why it matters:** `eth_getCode(address, "0x1")` can fail or query an invalid hash instead of fetching block 1 from the fork. Historical code reads are part of the same fork-state surface as balance and storage, so this breaks end-to-end consistency for RPC clients.
**Suggested fix:** Use `vm.blockchain.getBlockByTag(tag)` here, or mirror its length check: 66-byte hex is a hash, shorter hex is a block quantity converted to a number/bigint.

### [HIGH] Changing the fork RPC URL keeps old fork state and block caches
**Location:** packages/actions/src/anvil/anvilSetRpcUrlProcedure.js:57
**Issue:** `anvil_setRpcUrl` mutates `client.forkTransport.url` and clears snapshots, but it does not clear or rebuild the state manager fork cache or blockchain block maps. `anvil_reset` has the same problem: it can update the URL, then uses `vm.stateManager.shallowCopy()` and `vm.blockchain.shallowCopy()`, both of which share the existing fork cache/maps.
**Why it matters:** After switching the fork backend, later lazy state reads can be satisfied from the previous chain/provider while missing slots come from the new provider. That silently mixes two upstreams in one fork and makes reset semantics unreliable.
**Suggested fix:** Recreate the forked blockchain and state manager from the new transport and a new resolved fork anchor. At minimum, clear `forkCache`, normal state caches, `blocks`, `blocksByTag`, and `blocksByNumber` when the fork URL changes, then repopulate the forked/latest block from the new backend.

### [MEDIUM] The storage prefetch proxy captures stale cloned VMs and stacks wrappers
**Location:** packages/actions/src/internal/setupPrefetchProxy.js:21
**Issue:** Each call that produces an access list permanently replaces `client.forkTransport.request`. The closure captures the temporary client passed from `executeCall`, whose `getVm` returns that call's cloned VM, and the wrapper is never restored or de-duplicated.
**Why it matters:** Future fork storage/proof requests trigger prefetches into old cloned VMs instead of the live node, so the cache warming often misses the state manager that needs it. Repeated calls also build nested wrappers and retain old VMs/access lists, creating avoidable memory and request overhead under load.
**Suggested fix:** Do not monkey-patch the shared transport from a per-call clone. Either run prefetch directly against the current VM before returning the call result, or install one node-scoped proxy that looks up the current access-list work item and can be unregistered/cleared.


</details>

<details>
<summary><strong>V02 — JSON-RPC eth_* method surface</strong></summary>

# JSON-RPC eth_* method surface review

**Slice:** V02
**Type:** vertical
**Scope:** packages/actions/src/eth packages/procedures/src packages/decorators/src/eip1193
**Reviewed by:** codex (GPT-5.4)

## Summary

The most serious issues are in receipt/filter behavior: `eth_getTransactionReceipt` can report the wrong effective gas price for EIP-1559 transactions and its fork path appears to crash on normal upstream receipt shapes. Block filters are also effectively broken because `eth_newBlockFilter` never attaches its listener, and even if it did, `eth_getFilterChanges` returns block numbers where Ethereum JSON-RPC clients expect block hashes. Several not-found paths return JSON-RPC errors or uncaught exceptions where the `eth_*` surface should return `null`, which will break clients that probe blocks or transaction indexes spec-compliantly. `packages/procedures/src` is only a deprecation shim, so the substantive review was in `packages/actions/src/eth` and `packages/decorators/src/eip1193`.

## Findings

### [HIGH] EIP-1559 receipts underreport `effectiveGasPrice`
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:111
**Issue:** The local receipt path computes `effectiveGasPrice` as `maxPriorityFeePerGas` when the priority fee is below `maxFeePerGas - baseFeePerGas`, omitting the block base fee entirely. The correct EIP-1559 effective gas price is `baseFeePerGas + min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas)`, or equivalently `min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)`.
**Why it matters:** `eth_getTransactionReceipt` is a public accounting API. Indexers, explorers, wallets, and tests that calculate transaction cost from `gasUsed * effectiveGasPrice` will silently undercount every typical EIP-1559 transaction by the base fee.
**Suggested fix:** Reuse the formula already used in `ethGetBlockReceiptsHandler` for EIP-1559 transactions, and fall back to `gasPrice` for legacy transactions.

### [HIGH] Forked `eth_getTransactionReceipt` maps upstream receipt fields incorrectly
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:52
**Issue:** The fork path reads `r.hex` for `blockHash` and `r.cumulativeBlockGasUsed` for cumulative gas. Standard JSON-RPC receipts use `blockHash` and `cumulativeGasUsed`, so `BigInt(r.cumulativeBlockGasUsed)` will throw for normal upstream receipts before the procedure can return a response.
**Why it matters:** Any Tevm node with `forkTransport` that asks for a receipt not already cached locally can fail instead of proxying the upstream receipt. This breaks a core fork-mode read path.
**Suggested fix:** Map the standard upstream fields (`blockHash`, `cumulativeGasUsed`, `effectiveGasPrice`, etc.), handle `result.error`, and normalize hex log indexes to the internal bigint form before the procedure serializes them.

### [HIGH] `eth_newBlockFilter` never receives new blocks
**Location:** packages/actions/src/eth/ethNewBlockFilterProcedure.js:24
**Issue:** The procedure creates a `listener` and stores it in `registeredListeners`, but never calls `client.on('newBlock', listener)`. Pending-transaction filters and subscriptions register their listeners; block filters do not.
**Why it matters:** `eth_newBlockFilter` returns a valid-looking filter id, but `eth_getFilterChanges` will remain empty forever for that filter. Polling clients that rely on block filters never observe mined blocks.
**Suggested fix:** Register the listener with `client.on('newBlock', listener)` before or while installing the filter, matching the uninstall path that already removes `newBlock` listeners.

### [HIGH] Block filter changes return block numbers instead of hashes
**Location:** packages/actions/src/eth/ethGetFilterChangesProcedure.js:59
**Issue:** For `filter.type === 'Block'`, the result is `blocks.map((block) => numberToHex(block.header.number))`. Ethereum JSON-RPC block filters return an array of block hashes, not block numbers.
**Why it matters:** Consumers commonly pass returned values to `eth_getBlockByHash`; Tevm will instead hand them quantities like `0x1`, causing downstream lookups and polling logic to fail.
**Suggested fix:** Return `blocks.map((block) => bytesToHex(block.hash()))` and keep transaction filters returning transaction hashes.

### [HIGH] Missing block/transaction-by-index lookups return errors instead of `null`
**Location:** packages/actions/src/eth/ethGetTransactionByBlockNumberAndIndexProcedure.js:32
**Issue:** `eth_getTransactionByBlockNumberAndIndex` returns `-32602` when the transaction index is absent, and `eth_getBlockByNumber` similarly returns `-32602` for an unknown block. The hash variants also call `getBlock(...)` without catching not-found cases.
**Why it matters:** The Ethereum JSON-RPC contract for these lookup methods is nullable results for absent blocks or transactions. Returning errors or throwing makes normal client probing look like invalid requests and can crash higher-level polling code.
**Suggested fix:** Catch not-found block lookups and return `{ result: null }` for `eth_getBlockBy*` and `eth_getTransactionByBlock*AndIndex`; reserve `-32602` for malformed params.

### [MEDIUM] `eth_getFilterLogs` ignores the installed filter range
**Location:** packages/actions/src/eth/ethGetFilterLogsProcedure.js:26
**Issue:** The procedure reads `filter.logsCriteria.fromBlock?.header?.number` and `toBlock?.header?.number`, but `ethNewFilterHandler` stores `logsCriteria.fromBlock`/`toBlock` as the original tag/number values, not block objects. That means `fromBlock` falls back to `0n` and `toBlock` falls back to `'latest'` for ordinary filters.
**Why it matters:** A filter installed for a narrow range can later return logs from genesis through latest, producing false positives and potentially expensive scans.
**Suggested fix:** Store resolved block numbers in `logsCriteria`, or pass the stored raw block params through directly instead of expecting `.header.number`.

### [MEDIUM] `eth_newFilter` rejects valid `null` topic wildcards
**Location:** packages/actions/src/eth/ethNewFilterHandler.js:89
**Issue:** Topic conversion maps every non-array topic through `hexToBytes(topic)`, so a valid `null` wildcard topic is passed to `hexToBytes` and throws. `eth_getLogsHandler` already handles `null` correctly.
**Why it matters:** Topic wildcards are common JSON-RPC filter syntax. Clients can use the same filter object successfully with `eth_getLogs` but fail to install it with `eth_newFilter`.
**Suggested fix:** Mirror the `eth_getLogsHandler` conversion: preserve `null`, map arrays element-wise, and only call `hexToBytes` for concrete hex topics.

### [MEDIUM] Falsy JSON-RPC ids are dropped across many eth procedures
**Location:** packages/actions/src/eth/blockNumberProcedure.js:9
**Issue:** Many responses include ids with `...(req.id ? { id: req.id } : {})`. JSON-RPC ids may be `0`, but this pattern omits `id: 0`; examples include block number, chain id, gas price, account, transaction, and filter procedures.
**Why it matters:** Batched or multiplexed clients use the id to correlate responses. Dropping `0` produces a response that looks like a notification response and can leave requests unresolved.
**Suggested fix:** Replace truthiness checks with `req.id !== undefined` or `request.id !== undefined` everywhere JSON-RPC responses are built.

### [MEDIUM] EIP-1193 public schema exposes the wrong blob fee method
**Location:** packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts:114
**Issue:** The typed public schema defines `eth_blobGasPrice`, while the action surface implements and exports `eth_blobBaseFee`. The standard method is `eth_blobBaseFee`; the schema omits it and advertises an unimplemented method name.
**Why it matters:** Type-safe EIP-1193 users are guided away from the method Tevm actually supports and toward a method that the `eth_*` actions do not implement.
**Suggested fix:** Rename the schema entry to `eth_blobBaseFee` and keep the return type as `Quantity`; add an alias only if Tevm intentionally supports a non-standard compatibility method.

</details>

<details>
<summary><strong>V03 — JSON-RPC anvil_* method surface</strong></summary>

# JSON-RPC anvil_* method surface review

**Slice:** V03
**Type:** vertical
**Scope:** packages/actions/src/anvil packages/procedures/src
**Reviewed by:** codex (GPT-5.4)

## Summary

The highest-risk issues are in state lifecycle methods: `anvil_reset` rebuilds from live structures instead of a clean baseline, and `anvil_dumpState`/`anvil_loadState` do not share a compatible format. The impersonation surface is also materially narrower than Anvil's: it stores one global account and `stopImpersonatingAccount` clears it regardless of the address supplied. Several JSON-RPC methods advertise Anvil names but use Tevm-specific parameter or return shapes, which will break clients that call them with Foundry-compatible payloads. `packages/procedures/src` is only a deprecation stub, so the effective surface reviewed is `packages/actions/src/anvil`.

## Findings

### [HIGH] `anvil_reset` does not restore a clean chain baseline
**Location:** packages/actions/src/anvil/anvilResetProcedure.js:55
**Issue:** Reset constructs `newStateManager` and `newBlockchain` from the current live VM (`vm.stateManager.shallowCopy()` and `vm.blockchain.shallowCopy()`), then assigns those back to the same VM. The blockchain shallow copy is especially suspect because it is derived from the already-mutated chain, so mined blocks and the current head can survive what is supposed to be a reset to genesis or the fork point.
**Why it matters:** Any test or fork workflow that relies on `anvil_reset` to remove prior transactions, blocks, and state can continue from contaminated chain history. That is a public API footgun for Foundry-compatible suites and can make later assertions run against state from previous tests.
**Suggested fix:** Capture an initial/fork baseline snapshot when the node becomes ready and restore that exact state, blockchain maps, receipts, txpool, filters, and block-environment metadata on reset. Avoid shallow-copying the current VM as the source of truth for reset.

### [HIGH] `anvil_dumpState` output cannot be loaded by `anvil_loadState`
**Location:** packages/actions/src/anvil/anvilDumpStateProcedure.js:13
**Issue:** `anvil_dumpState` delegates to `tevm_dumpState` and returns `{ state: ... }` with serialized account objects, while `anvil_loadState` expects each account value to be an RLP-encoded account hex string and decodes it with `fromRlp`.
**Why it matters:** The paired persistence API is internally incompatible: dumping state and then passing that result to `anvil_loadState` fails, and even the load path only writes account fields, not the dumped storage/code object shape. Users relying on Anvil-style dump/load for test isolation or process persistence cannot round-trip state.
**Suggested fix:** Define one Anvil-compatible codec for both methods. Return a hex buffer from dump and have load consume that same buffer, or deliberately expose a Tevm object format under a Tevm method and make the Anvil methods match Foundry's byte-buffer contract.

### [HIGH] Impersonation is a single global slot and stop ignores the requested account
**Location:** packages/actions/src/anvil/anvilStopImpersonatingAccountProcedure.js:8
**Issue:** `anvil_impersonateAccount` overwrites one `client.setImpersonatedAccount(...)` value, and `anvil_stopImpersonatingAccount` always clears that value without checking `request.params[0]`.
**Why it matters:** Foundry-compatible callers can impersonate multiple accounts and stop one account without affecting others. Here, impersonating B after A loses A, and stopping A while B is active disables B, so multi-account tests can silently send transactions under the wrong authorization assumptions.
**Suggested fix:** Store impersonated accounts as a `Set<Address>`, make stop remove only the supplied address, and have transaction admission check membership or `autoImpersonate`.

### [MEDIUM] `anvil_dropTransaction` uses a non-Anvil parameter shape
**Location:** packages/actions/src/anvil/anvilDropTransactionProcedure.js:13
**Issue:** The procedure reads `request.params[0].transactionHash`, but Anvil's method takes the transaction hash directly as the first positional parameter. A Foundry-shaped call with `params: [hash]` makes `txHash` undefined and then `hexToBytes(txHash)` throws outside a JSON-RPC error response.
**Why it matters:** Existing Anvil clients will fail against Tevm even when they send a valid transaction hash. Because the exception is not caught in the procedure, the failure mode depends on outer request handling instead of returning a method-level JSON-RPC error.
**Suggested fix:** Change the request type and implementation to `readonly [transactionHash: Hex]`, validate the hash before touching the txpool, and return the Anvil-compatible result shape.

### [MEDIUM] `anvil_setStorageAt` reports `null` instead of success
**Location:** packages/actions/src/anvil/anvilSetStorageAtProcedure.js:32
**Issue:** The handler performs the storage write through `tevm_setAccount` but returns `result: null`. Anvil's `anvil_setStorageAt` returns a boolean success value for the write.
**Why it matters:** Clients that check the JSON-RPC result for `true` will treat a successful Tevm write as failure. This is exactly the sort of small surface mismatch that breaks drop-in Foundry parity even when the underlying mutation happened.
**Suggested fix:** Validate the slot/value as Anvil does (`slot` as U256, value as bytes32) and return `result: true` when the write succeeds.

### [MEDIUM] Several handlers drop valid JSON-RPC id `0`
**Location:** packages/actions/src/anvil/anvilImpersonateAccountProcedure.js:15
**Issue:** Many anvil procedures include the response id with `...(request.id ? { id: request.id } : {})`. JSON-RPC ids may be `0`, but that branch treats `0` as absent.
**Why it matters:** Batch clients and low-level transports often start numeric ids at zero. Responses without the id cannot be reliably correlated to the request, so otherwise successful Anvil calls become protocol-invalid for those clients.
**Suggested fix:** Use a shared response helper or consistently check `request.id !== undefined` for every anvil procedure.

</details>

<details>
<summary><strong>V04 — JSON-RPC debug_* and tevm_* methods</strong></summary>

# JSON-RPC debug_* and tevm_* methods review

**Slice:** V04
**Type:** vertical
**Scope:** packages/actions/src/debug packages/actions/src/tevm packages/actions/src/tevm-request-handler packages/procedures/src
**Reviewed by:** codex (GPT-5.4)

## Summary

The largest issue is that the historical tracing code reconstructs a pre-transaction VM and then accidentally asks `traceCallHandler` to reset that clone to the target block's final state root, so `debug_traceTransaction`, `debug_traceBlock`, and `debug_traceChain` can silently return traces from the wrong state. Several debug methods also expose JSON-RPC-shaped APIs but drop valid falsy ids such as `0`, which breaks response correlation for conforming clients. `debug_storageRangeAt` currently resolves the requested block but ignores both that block's state and `txIndex`, so its result is for the node's current state rather than the requested execution point. The request/return type maps have drifted from the runtime handler table, which leaves many implemented debug methods unaddressable through exported method-to-request utility types. `packages/procedures/src` exists but is only a deprecation stub.

## Findings

### [HIGH] `debug_traceTransaction` traces the transaction against post-block state
**Location:** packages/actions/src/debug/debugTraceTransactionProcedure.js:158
**Issue:** The procedure correctly builds `vmClone` at the parent state root and replays prior transactions, but then passes the transaction's `blockHash` as `blockTag` into `traceCallHandler`. `traceCallHandler` deep-copies that VM and, when `blockTag` is present, resets the copy to `block.header.stateRoot`, which is the final state after the whole block, not the state immediately before this transaction.
**Why it matters:** Any transaction whose behavior depends on state changed earlier in the same block, or on state changed by the transaction itself in a previous attempt, can produce a silently wrong trace. This defeats the main purpose of `debug_traceTransaction` for debugging historical execution.
**Suggested fix:** Do not pass `blockTag` when tracing from an already-positioned VM clone. If block metadata is needed for execution context, thread it separately from state-root selection so `traceCallHandler` does not overwrite the reconstructed pre-transaction state.

### [HIGH] Block and chain tracing reset every transaction trace to the block's final state
**Location:** packages/actions/src/debug/debugTraceBlockProcedure.js:128
**Issue:** `debug_traceBlock` advances `vmClone` transaction by transaction, but each call to `traceCallHandler` includes `blockTag: bytesToHex(block.header.hash())`. That makes `traceCallHandler` reset its copy to the target block's final state root before every trace. `debug_traceChain` repeats the same pattern at `debugTraceChainProcedure.js:170`.
**Why it matters:** Traces for every transaction in a block are computed from the wrong state, and later transactions do not see the cumulative state produced by earlier transactions despite the outer loop appearing to maintain that state. This can corrupt call traces, prestate/diff traces, gas behavior, and revert behavior.
**Suggested fix:** Remove `blockTag` from the trace params when the caller supplies a pre-positioned VM. Add an explicit helper/API for tracing against a provided VM state so block lookup for `debug_traceCall` cannot be accidentally reused by historical replay paths.

### [HIGH] Missing transactions crash `debug_traceTransaction` instead of returning JSON-RPC errors
**Location:** packages/actions/src/debug/debugTraceTransactionProcedure.js:95
**Issue:** `eth_getTransactionByHash` returns `{ result: null }` when a transaction is not found, but this code only checks `transactionByHashResponse.error` and then immediately reads `transactionByHashResponse.result.blockHash`.
**Why it matters:** A normal request for an unknown hash rejects the handler promise with a null dereference instead of returning a JSON-RPC error response. Direct `request()` callers can see an exception rather than an RPC response, and bulk callers get a generic internal error.
**Suggested fix:** Check `transactionByHashResponse.result == null` before dereferencing it and return a `-32602` or geth-compatible "transaction not found" error using the original request id.

### [HIGH] `debug_storageRangeAt` ignores the requested block state and transaction index
**Location:** packages/actions/src/debug/debugStorageRangeAtHandler.js:76
**Issue:** The handler resolves `blockTag` to a block, but never sets the state manager to that block's state root or replays transactions up to `txIndex`. It then calls `vm.stateManager.dumpStorageRange(...)` on the node's current state, and `txIndex` is unused after logging.
**Why it matters:** Callers asking for storage at a historical block/transaction receive storage from whatever state the node currently has loaded. This is a silent correctness bug for a debug RPC whose parameters are specifically meant to select an execution point.
**Suggested fix:** Clone the VM, set it to the parent block state, replay transactions through the requested `txIndex` as required by the method semantics, and dump storage from that clone. Reject out-of-range `txIndex` values instead of ignoring them.

### [MEDIUM] Many debug procedures drop valid JSON-RPC id `0`
**Location:** packages/actions/src/debug/debugTraceCallProcedure.js:40
**Issue:** Several procedures include ids with `...(request.id ? { id: request.id } : {})`, so valid falsy ids such as `0` and `''` are omitted from responses. The same pattern appears in raw block/header/receipt/transaction, modified-account, dumpBlock, storageRangeAt, traceState, and traceTransaction procedures.
**Why it matters:** JSON-RPC clients rely on the response id to correlate calls, and `0` is a valid id. Dropping it makes responses look like notifications or uncorrelated responses, which is especially painful for batched requests.
**Suggested fix:** Replace the truthiness checks with `request.id !== undefined` or `'id' in request` consistently across debug procedures, matching the methods in this slice that already preserve falsy ids.

### [MEDIUM] Implemented debug methods are missing from `JsonRpcRequestTypeFromMethod`
**Location:** packages/actions/src/tevm-request-handler/DebugRequestType.ts:11
**Issue:** `DebugRequestType` only maps `debug_traceTransaction`, `debug_traceCall`, `debug_traceBlock`, and `debug_traceState`, while the runtime handler table and `DebugJsonRpcRequest` union include `debug_traceBlockByNumber`, `debug_traceBlockByHash`, `debug_traceChain`, `debug_dumpBlock`, `debug_getModifiedAccountsBy*`, `debug_storageRangeAt`, `debug_intermediateRoots`, `debug_preimage`, and raw block/header/transaction/receipt methods.
**Why it matters:** Exported utility types like `JsonRpcRequestTypeFromMethod<'debug_getRawTransaction'>` reject methods that the runtime supports and for which response types already exist. That creates a public API footgun for typed callers building generic JSON-RPC clients.
**Suggested fix:** Populate `DebugRequestType` from the same set as `DebugJsonRpcRequest`/`DebugReturnType`, or derive the method map from a single source so the runtime handler table, request union, and method utility types cannot drift.

### [MEDIUM] Missing historical state roots produce false modified-account results
**Location:** packages/actions/src/debug/debugGetModifiedAccountsByNumberHandler.js:76
**Issue:** If either requested state root is unavailable, the handler silently leaves that side as `{}` and still computes a diff. The hash-based variant has the same behavior in `debugGetModifiedAccountsByHashHandler.js`.
**Why it matters:** On pruned, forked, or otherwise non-archival state, the method can report every end-state account as modified, every start-state account as deleted, or no changes at all, depending on which root is missing. Callers receive plausible-looking but false data.
**Suggested fix:** Treat a missing requested state root as an error, or fetch/cache the needed state through `forkTransport` before diffing. Do not substitute an empty state unless the block's actual state is known to be empty.

## Architectural observations

The debug surface is maintained in several parallel tables: runtime handlers, request unions, response maps, request maps, procedure types, and docs examples. The current drift in `DebugRequestType` shows this is already brittle; deriving method maps from one canonical debug method registry would reduce public API inconsistencies.

</details>

<details>
<summary><strong>V05 — Solidity bundler pipeline (resolve→compile→codegen)</strong></summary>

# Solidity bundler pipeline (resolve→compile→codegen) review

**Slice:** V05
**Type:** vertical
**Scope:** bundler-packages/base-bundler bundler-packages/compiler bundler-packages/resolutions bundler-packages/runtime bundler-packages/config
**Reviewed by:** codex (GPT-5.4)

## Summary

The main risk in this slice is that Tevm rewrites Solidity before compiling it, but the rewrite layer is regex- and prefix-based in ways that can silently compile the wrong source graph or with the wrong compiler constraints. The generated declaration output also appears syntactically invalid as a `.d.ts` module, so users can get broken TypeScript types even when Solidity compilation succeeds. Remappings are especially fragile for Foundry-style projects with overlapping prefixes. All requested scope paths exist.

## Findings

### [HIGH] Declaration output uses value initializers that are illegal in `.d.ts`
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:66
**Issue:** `generateDtsBody` emits declarations such as `const _nameMyContract = "MyContract" as const;`, `const _abiMyContract = [...] as const;`, and `export const artifacts = {...};` into the `.d.ts` body. Declaration files cannot contain those runtime initializers or `as const` value expressions; they need ambient declarations and type annotations.
**Why it matters:** A successful Solidity compile can still produce a declaration module that TypeScript rejects, breaking editor support and `checkJs`/typecheck for every consumer importing the generated `.sol` module.
**Suggested fix:** Generate valid ambient declarations, for example `declare const _nameFoo: "Foo";`, `declare const _abiFoo: readonly [...]`, and `export declare const artifacts: ...`, or avoid private helper values and inline literal types through generated `type` aliases.

### [HIGH] Pragma rewriting can invert or widen the source's compiler constraint
**Location:** bundler-packages/resolutions/src/utils/updatePragma.js:25
**Issue:** `updatePragma` rewrites the first Solidity pragma to `pragma solidity >=${versionToUse};` regardless of the original operator, and the bounds path drops the upper bound entirely. Inputs like `pragma solidity <0.8.0;` or `pragma solidity >=0.8.0 <0.8.9;` are transformed into constraints that allow a compiler the source explicitly rejected.
**Why it matters:** Tevm compiles modified source, not the user's source. Multi-file projects with older dependencies can silently be accepted under a different compiler range, producing bytecode/types for a contract that was never meant to compile under the active solc version.
**Suggested fix:** Do not rewrite pragmas to bypass solc's version checks. Select a compatible solc version, or fail with a clear unsupported-version error when the active compiler does not satisfy every source's original pragma.

### [HIGH] Indented Solidity imports are missed by dependency discovery
**Location:** bundler-packages/resolutions/src/resolveImports.js:52
**Issue:** The import regex starts with `^\s?import`, which only permits zero or one leading whitespace character. Solidity files formatted with two spaces, tabs, or nested indentation before `import` statements are not discovered; `updateImportPaths` uses the same `^\s?import` shape, so those imports are not rewritten either.
**Why it matters:** The compiler input is assembled from discovered imports. A missed import leaves the dependency out of `sources` and leaves the original import path in the rewritten source, so otherwise valid multi-file projects fail with missing-source errors depending only on formatting.
**Suggested fix:** Replace regex-based Solidity import discovery with a Solidity parser. As a minimal stopgap, use `^\s*import\b` consistently in both discovery and rewrite code, and add coverage for tabs, multiple spaces, multiline import lists, and import-line comments.

### [HIGH] Overlapping remappings resolve by insertion order instead of longest prefix
**Location:** bundler-packages/resolutions/src/utils/resolveImportPath.js:45
**Issue:** Remappings are applied by iterating `Object.entries(remappings)` and returning the first `startsWith` match. Foundry remappings are prefix rules where the longest matching prefix should win; with both `@foo/` and `@foo/bar/`, `@foo/bar/Baz.sol` can resolve through the broader `@foo/` entry if it was inserted first.
**Why it matters:** Large Solidity projects commonly layer remappings for vendored libraries and subpackages. This can compile against the wrong dependency tree while still succeeding if a similarly named file exists, which is a silent correctness bug.
**Suggested fix:** Normalize remapping keys and choose the longest matching prefix, with a boundary-aware match. Add an explicit deterministic tie-breaker for equal-length keys and preserve Foundry's expected semantics.

### [MEDIUM] Bytecode declarations claim deployability even when artifacts omit bytecode
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:63
**Issue:** When `includeBytecode` is true, the `.d.ts` generator always types each contract as having `` `0x${string}` `` bytecode and deployed bytecode. The JS generator, however, only includes those fields when `evm.bytecode.object` and `evm.deployedBytecode.object` are non-empty.
**Why it matters:** Files can contain interfaces, abstract contracts, or otherwise non-deployable artifacts alongside deployable contracts. TypeScript then permits deploy-style usage that the generated runtime object cannot satisfy.
**Suggested fix:** Derive the bytecode type per artifact from the same checks used by `generateTevmBody`; emit `undefined` for empty or missing bytecode and `` `0x${string}` `` only when the generated runtime value includes the field.

### [MEDIUM] Config merging mutates precedence while reading scalar options
**Location:** bundler-packages/config/src/config/mergeConfigs.js:21
**Issue:** `mergeConfigs` calls `configs.reverse()` three times while building one result object. Because `reverse()` mutates the input array, `foundryProject`, `debug`, and `cacheDir` are selected from alternating precedence orders, and the later `libs` calculation also runs after the first mutation.
**Why it matters:** The resolved compiler config can differ by property for the same input list, making cache/debug/foundry behavior depend on implementation order instead of the documented "last config wins" rule. This is especially confusing when JSON config, Foundry config, and `remappings.txt` are all present.
**Suggested fix:** Never mutate the input array during merge. Use `configs.toReversed()` or `[...configs].reverse()` once for scalar precedence, and compute array/object merges from the original order intentionally.

</details>

<details>
<summary><strong>V06 — Bundler caching strategy</strong></summary>

# Bundler caching strategy review

**Slice:** V06
**Type:** vertical
**Scope:** bundler-packages/bundler-cache bundler-packages/base-bundler
**Reviewed by:** codex (GPT-5.4)

## Summary

The artifact cache is materially under-keyed: it validates only the Tevm cache version and source mtimes, while the actual output also depends on compiler configuration, dependency resolution, contract package selection, and the solc implementation. That can return stale ABI/bytecode/type data after configuration-only changes with no source edits. The write path also publishes `artifacts.json` and `metadata.json` independently, so concurrent readers or writers can observe a validated but mismatched cache entry. A smaller but concrete bug is that bytecode-capable cache entries are detected by object presence rather than bytecode content, which can reuse artifacts that only contain source-map metadata.

## Findings

### [HIGH] Cache validity ignores config and compiler inputs
**Location:** bundler-packages/bundler-cache/src/writeArtifacts.js:73
**Issue:** The metadata written for an artifact cache entry contains only `version` and source-file mtimes, and `readCache` later asks `cache.readArtifacts(modulePath)` without passing the active compiler config, remappings, solc version, or contract package. A cache entry compiled with one set of remappings/libs or one solc build remains valid as long as the previously recorded source files have the same mtimes.
**Why it matters:** Changing `tevm.config`, foundry remappings, library paths, or the solc implementation can alter the ABI, bytecode, module graph, and generated runtime without touching the entry Solidity file. Users can get silently stale contract artifacts until they manually delete the cache or edit a tracked source.
**Suggested fix:** Include a deterministic cache key or metadata fingerprint for all compilation-affecting inputs: normalized resolved config, remappings/libs, solc version or binary identity, module type/runtime generator version where relevant, and the resolved source graph. Validate that fingerprint before returning artifacts.

### [HIGH] Async writes can publish valid metadata before matching artifacts
**Location:** bundler-packages/bundler-cache/src/writeArtifacts.js:65
**Issue:** `writeArtifacts` writes `artifacts.json` and `metadata.json` in the same `Promise.all`. If `metadata.json` for a new compile lands before `artifacts.json`, a concurrent reader can see the old artifact file plus new metadata, validate the source mtimes, and return stale artifacts. Cross-process writers can also interleave the two files and leave a metadata/artifact pair from different compilations.
**Why it matters:** Bundler plugins commonly run in watch mode and can resolve the same Solidity module concurrently. This is a real race that can produce silent wrong ABI/bytecode rather than just a cache miss.
**Suggested fix:** Write artifacts to a unique temp file, fsync/close if available, atomically rename it into place, then publish metadata last with the artifact digest embedded. Readers should verify that digest, and writers should avoid sharing the same final entry without atomic replacement or a lock.

### [HIGH] Bytecode cache hits are accepted without checking bytecode content
**Location:** bundler-packages/base-bundler/src/readCache.js:43
**Issue:** `isCachedBytecode` treats any truthy `artifact.evm.deployedBytecode` as satisfying `includeBytecode`. The synchronous compiler path can request AST/source-map fields without bytecode object fields, and solc artifacts may still contain an `evm.deployedBytecode` object that lacks `.object`.
**Why it matters:** A later `includeBytecode=true` resolve can reuse a cache entry that does not contain deployable bytecode. Script-style imports can then generate runtime/types without the bytecode the caller explicitly requested.
**Suggested fix:** Mirror this fix in `readCacheSync`: require concrete bytecode content, for example `artifact.evm?.bytecode?.object` and/or `artifact.evm?.deployedBytecode?.object`, and treat empty strings or missing objects as a cache miss when bytecode is requested.

### [MEDIUM] Mtime-only invalidation can miss source content changes
**Location:** bundler-packages/bundler-cache/src/readArtifacts.js:75
**Issue:** Cache validation compares only `mtimeMs` for each source path. It never hashes or compares source content, even though the full source content is already available in `resolvedArtifacts.solcInput.sources` at write time.
**Why it matters:** Filesystems with coarse timestamp resolution, rapid edit/write sequences, restored files with preserved mtimes, or generated Solidity files can change content while keeping the same observed mtime. In those cases Tevm returns stale artifacts with no warning.
**Suggested fix:** Store a content digest for each source, or at least `{mtimeMs, size}` as a fast precheck plus a digest on equality. Prefer hashing the exact source text used for solc input so generated or virtual source handling stays consistent.

### [MEDIUM] Absolute shared cache directories can collide across projects
**Location:** bundler-packages/bundler-cache/src/getArtifactsPath.js:44
**Issue:** The cache root can be absolute, but entries inside the cache are keyed by the source path relative to that invocation's `cwd`. Two projects using the same absolute cache directory and the same relative contract path, such as `contracts/Token.sol`, write to the same cache entry even though they are different source roots.
**Why it matters:** Shared CI caches or user-configured absolute cache paths can cause one project to read another project's artifacts if the other project's recorded files still validate. This is especially risky because package configs and solc versions are also not part of the cache key.
**Suggested fix:** Either reject absolute/shared `cacheDir` values for this cache layout, or include a stable project-root hash in the cache namespace before the relative entry path.

</details>

<details>
<summary><strong>V07 — Hardfork readiness, gates, transitions</strong></summary>

# Hardfork readiness, gates, transitions review

**Slice:** V07
**Type:** vertical
**Scope:** packages/common packages/vm packages/evm
**Reviewed by:** codex (GPT-5.4)

## Summary

The main hardfork risk is that block execution is still driven by the VM's current `Common` instead of the block's transition-selected hardfork, so historical and boundary blocks can silently run with Prague-era rules. Transaction type gates catch some post-fork types, but they miss the base EIP-2718 gate and therefore allow typed transactions on pre-Berlin forks. Block building has two concrete hardfork regressions: pre-Shanghai block construction always includes a withdrawals field, and Cancun blob blocks are capped at the target blob gas instead of the maximum. These are not just API rough edges; they can produce rejected valid blocks, accepted invalid transactions, or wrong state transitions around fork boundaries.

## Findings

### [HIGH] Block transaction execution bypasses hardfork validation and uses the VM fork
**Location:** packages/vm/src/actions/applyTransactions.ts:45
**Issue:** `applyTransactions` defaults every `runTx` call to `skipHardForkValidation = true`, and `runBlock` never applies the documented `RunBlockOpts.setHardfork` option before execution. The transaction then runs against `vm.common` and `vm.evm.common`, not necessarily the block's hardfork-selected common.
**Why it matters:** A VM initialized with the default Prague common can execute pre-Cancun or pre-Prague blocks with newer opcode, gas refund, precompile, `SELFDESTRUCT`, blob, and system-contract semantics. Conversely, a VM left on an older hardfork can miss required post-fork behavior. That is a consensus-divergence class bug for block replay and fork-boundary execution.
**Suggested fix:** Honor `RunBlockOpts.setHardfork` at the start of `runBlock` by deriving the hardfork from block number/timestamp and synchronizing the VM/EVM common for the execution scope. Do not default block transaction execution to `skipHardForkValidation: true`; require an explicit opt-out and assert that block, VM, and tx execution hardforks agree.

### [HIGH] Typed transactions are accepted when EIP-2718 is inactive
**Location:** packages/vm/src/actions/validateRunTx.js:59
**Issue:** The typed-transaction validation only runs when both the transaction supports EIP-2718 and `isActivatedEIP(2718)` is true. If EIP-2718 is inactive, the condition is false and no error is thrown, so type-1/type-2/type-3/type-4 transactions can proceed on pre-Berlin forks.
**Why it matters:** This admits transaction encodings that did not exist at that fork. In particular, EIP-1559 transactions can pass through old-fork execution paths and still use the EIP-1559 gas calculation later in `runTx`, producing invalid execution and receipts instead of rejecting the transaction.
**Suggested fix:** Split the gate: if `tx.supports(Capability.EIP2718TypedTransaction)` and EIP-2718 is not active, throw `EipNotEnabledError`. Then validate the specific typed transaction capabilities, including EIP-2930, EIP-1559, EIP-4844, and EIP-7702.

### [HIGH] Pre-Shanghai block building always emits a withdrawals field
**Location:** packages/vm/src/actions/BlockBuilder.ts:364
**Issue:** `BlockBuilder.build()` passes `withdrawals: this.withdrawals ?? []` for every block, even when EIP-4895 is not active. The block constructor rejects any defined withdrawals field on pre-Shanghai hardforks, so building an old-fork block fails even when the caller did not provide withdrawals.
**Why it matters:** This breaks block construction for Frontier through Paris/early-Shanghai transition scenarios. If a caller does pass withdrawals on a non-Shanghai builder, `processWithdrawals()` runs before block construction validates the hardfork, so state can be touched before the build throws.
**Suggested fix:** Only include `withdrawals` in `blockData` when EIP-4895 is active. Reject `opts.withdrawals` up front when EIP-4895 is inactive, before `processWithdrawals()` or any state mutation.

### [HIGH] Blob block building rejects valid blocks above the target blob gas
**Location:** packages/vm/src/actions/BlockBuilder.ts:236
**Issue:** `addTransaction()` uses `targetBlobGasPerBlock` as the per-block blob gas limit. EIP-4844 has a lower target and a higher maximum; the target is for excess blob gas accounting, not the validity cap.
**Why it matters:** Valid Cancun/Prague blocks with blob gas above the target but below the maximum are rejected by Tevm's block builder. This makes the builder underfill blob blocks and diverge from valid chain behavior under blob load.
**Suggested fix:** Use the common parameter for maximum blob gas per block for admission checks, and keep `targetBlobGasPerBlock` only for excess blob gas calculation. Ensure `createCommon` provides or preserves the max blob gas parameter for custom commons.

### [MEDIUM] System-contract fork effects are gated by VM common instead of block common
**Location:** packages/vm/src/actions/applyBlock.ts:47
**Issue:** EIP-4788, EIP-2935, and EIP-4895 state effects are selected with `vm.common.ethjsCommon.isActivatedEIP(...)`. The block object already carries a common that can be set by block number/timestamp, but these gates ignore it.
**Why it matters:** A Prague VM applying an older block will attempt beacon-root/history/withdrawal state effects too early; an older VM applying a post-fork block will skip mandatory effects. These writes happen outside normal transaction execution, so mismatches directly change the post-block state root.
**Suggested fix:** Use the block's hardfork-selected common for block-level system effects, and make `runBlock` set/scope the VM and EVM common to the same execution hardfork before applying the block.

</details>

<details>
<summary><strong>V08 — EIP-7702 (delegated authorization) e2e</strong></summary>

# EIP-7702 (delegated authorization) e2e review

**Slice:** V08
**Type:** vertical
**Scope:** packages/vm/src/actions/runTx.ts packages/tx packages/evm packages/actions packages/memory-client/src/test/viem/setCode.spec.ts
**Reviewed by:** codex (GPT-5.4)

## Summary

The VM has a real EIP-7702 authorization loop, including chain-id filtering, signature recovery, nonce checks, delegation writes, and EIP-3607 relaxation for delegation-designator code. The weaker part is the public action/RPC layer: several 7702 paths either drop the authorization list, report success after failed pool/mining operations, or expose mined type-4 transactions without their authorization tuples. That makes delegated authorization unreliable for viem/JSON-RPC users even if `runTx` itself can execute a hand-built type-4 transaction. All scoped paths existed.

## Findings

### [HIGH] `eth_sendTransaction` drops EIP-7702 authorization lists before execution
**Location:** packages/actions/src/eth/ethSendTransactionProcedure.js:14
**Issue:** The JSON-RPC request type allows `authorizationList`, `type`, EIP-1559 fee fields, `accessList`, and `nonce`, but the procedure only forwards `from`, `data`, `to`, `gas`, `gasPrice`, and `value` into `ethSendTransactionHandler`. The handler then calls `callHandler` with those params, so an EIP-7702 `eth_sendTransaction` request is converted into a normal impersonated transaction with no authorization list.
**Why it matters:** Wallet-style clients can submit 7702 transactions through `eth_sendTransaction` in local/dev flows. Tevm will return a transaction hash for a different transaction than requested, leaving the authority code unchanged and making delegated authorization appear to succeed at the RPC boundary while silently doing nothing.
**Suggested fix:** Forward all transaction fields from `JsonRpcTransaction`, including `authorizationList`, `type`, `nonce`, `accessList`, `maxFeePerGas`, and `maxPriorityFeePerGas`; then route 7702 requests through a transaction-construction path that preserves `EOACode7702Tx` instead of `callHandler`'s impersonated 1559 transaction builder.

### [HIGH] Raw transaction RPC reports success even when pool insertion or automining fails
**Location:** packages/actions/src/eth/ethSendRawTransactionProcedure.js:31
**Issue:** `ethSendRawTransactionJsonRpcProcedure` awaits `txPool.add(tx, true)` but ignores the returned `{ error, hash }`, then ignores any `errors` returned by `handleAutomining`. The exported non-RPC handler checks `addResult.error`, so the two raw-transaction paths already disagree on failure handling.
**Why it matters:** For type-4 transactions this weakens the hardfork and validity gates at the JSON-RPC boundary: a rejected 7702 transaction, or one that fails during automining, can still produce a successful `eth_sendRawTransaction` response with a hash. Clients then wait for a receipt for a transaction that was never accepted or mined.
**Suggested fix:** Check the `txPool.add` result and return/throw an `InvalidTransactionError` on error; if automining returns errors, surface them instead of returning the hash.

### [HIGH] The exported raw-transaction handler bypasses automining for EIP-7702
**Location:** packages/actions/src/eth/ethSendRawTransactionHandler.js:88
**Issue:** The EIP-7702 branch adds the transaction to the pool, emits `newPendingTransaction`, and immediately returns the hash. Unlike the non-7702 path, it never invokes `callHandler` or `handleAutomining`, so `miningConfig.type === 'auto'` is ignored for type-4 raw transactions submitted through the exported handler API.
**Why it matters:** `ethSendRawTransactionHandler` is publicly exported from `packages/actions/src/eth/index.ts`, and the in-scope 7702 test has to call `mineHandler(client)()` manually after using it. Users of the handler API get different behavior from JSON-RPC and from other transaction types: 7702 transactions remain pending in auto-mining clients.
**Suggested fix:** Unify the handler and JSON-RPC procedure around one raw-transaction implementation, or call the same automining helper after successful pool insertion in the 7702 branch.

### [MEDIUM] Mined 7702 transactions lose `authorizationList` in JSON-RPC transaction objects
**Location:** packages/actions/src/utils/txToJsonRpcTx.js:21
**Issue:** `txToJsonRpcTx` copies `accessList` from `tx.toJSON()` but never copies `authorizationList`. Mined type-4 transactions returned by `eth_getTransactionByHash`, block transaction expansion, and any other action using this serializer therefore omit the defining EIP-7702 payload.
**Why it matters:** Indexers, viem clients, and debugging tools cannot reconstruct which authorities were delegated from Tevm's transaction JSON, even though the original block transaction is type `0x4`. This is a public API data-loss bug for 7702 transactions.
**Suggested fix:** Include `authorizationList` when present in `txJSON`, and add a focused assertion on `eth_getTransactionByHash` or expanded block output for a mined type-4 transaction.

### [MEDIUM] Receipt gas accounting underreports `effectiveGasPrice` for 7702 transactions
**Location:** packages/actions/src/eth/ethGetTransactionReceipt.js:111
**Issue:** The effective gas price calculation returns `maxPriorityFeePerGas` directly when it is below `maxFeePerGas - baseFeePerGas`, instead of adding the base fee. Type-4 transactions use EIP-1559 fee fields, so they hit this branch under normal base-fee blocks.
**Why it matters:** 7702 receipts can report an `effectiveGasPrice` that is lower than the amount charged by exactly the block base fee. Fee accounting, explorers, and test assertions built on receipts will disagree with the actual VM charge.
**Suggested fix:** Compute `effectiveGasPrice` as `min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas) + baseFeePerGas`, with a separate legacy path for transactions that only have `gasPrice`.

## Architectural observations

There are currently two raw transaction implementations (`ethSendRawTransactionHandler` and `ethSendRawTransactionJsonRpcProcedure`) with different validation, automining, event, and 7702 behavior. EIP-7702 makes that split harder to keep correct because preserving the typed transaction object is essential; consolidating these paths would remove several of the e2e inconsistencies above.

</details>

<details>
<summary><strong>V09 — EIP-3155 trace comparison tooling</strong></summary>

# EIP-3155 trace comparison tooling review

**Slice:** V09
**Type:** vertical
**Scope:** test/eip3155 packages/vm/src packages/evm/src
**Reviewed by:** codex (GPT-5.4)

## Summary

The trace comparison tooling can produce false green results because it normalizes final summaries but never compares them. That means step-identical traces with different final output, status, gas used, or state root are reported as passed, and zero-opcode executions are skipped even when their summaries are available. In the VM, `RunTxResult.gasRefund` is published before the protocol refund cap is applied, so callers see a refund value that does not match the charged gas invariant documented by the public type. The remaining trace-format issues are normalization edge cases that can either reject valid reference traces or create false divergences for opcode aliases.

## Findings

### [HIGH] Trace comparison ignores final execution summaries
**Location:** test/eip3155/trace-tools.mjs:270
**Issue:** `compareNormalizedTraces` only calls `firstDivergence` over `actual.steps` and `reference.steps`; the normalized `summary` fields built at lines 224-236 are never compared. A trace with identical opcode steps but different `output`, `gasUsed`, `pass`, `fork`, or `stateRoot` returns `status: "passed"`.
**Why it matters:** This is a silent false positive in the conformance trace path. Step traces can match while final gas accounting, returned bytes, failure status, or state root diverges, which is exactly the class of bug trace comparison should catch.
**Suggested fix:** Extend divergence detection to compare normalized summaries after step comparison, or explicitly include summary fields in the compared document. Report the first summary-field mismatch with the same `firstDivergence` shape.

### [HIGH] `RunTxResult.gasRefund` reports the uncapped refund
**Location:** packages/vm/src/actions/runTx.ts:426
**Issue:** `results.gasRefund` is assigned before `gasRefund` is capped by `maxRefundQuotient`; `totalGasSpent` is then reduced by the capped local value. When the raw refund exceeds the cap, the public result reports a refund larger than the amount actually applied.
**Why it matters:** The public `RunTxResult` type documents `gasRefund` as the amount used in `gasUsed = totalGasConsumed - gasRefund`. Consumers building receipts, debug output, or EIP-3155 summaries from `RunTxResult` will observe an internally inconsistent gas report even though balances and receipts use the capped value.
**Suggested fix:** Move `results.gasRefund = gasRefund` after the cap is applied, or expose separate `rawGasRefund` and `gasRefund` fields with `gasRefund` reserved for the effective capped refund.

### [MEDIUM] Zero-step executions are marked as no coverage instead of compared
**Location:** test/eip3155/trace-tools.mjs:302
**Issue:** `compareTraceFiles` returns `status: "skipped"` whenever either normalized trace has zero opcode steps, even if both files contain normalized summaries.
**Why it matters:** Calls with no bytecode, empty initcode, or other valid executions can still have meaningful final status, output, gas, and state-root expectations. Treating them as `coverage: "none"` hides mismatches and undercounts real fixture coverage.
**Suggested fix:** If both step arrays are empty, compare summaries instead of skipping. If exactly one side has steps, return a normal failed divergence rather than a skipped no-coverage result.

### [MEDIUM] Opcode aliases are preserved as false divergences
**Location:** test/eip3155/trace-tools.mjs:199
**Issue:** String opcode names are uppercased and preserved in `opName`, while `firstDivergence` compares every field including `opName`. Equivalent aliases such as `SHA3`/`KECCAK256` and `DIFFICULTY`/`PREVRANDAO` normalize to the same numeric `op` but still fail comparison because `opName` differs.
**Why it matters:** References generated by different clients or hardfork-era names can be semantically identical but fail at the first alias, obscuring real trace differences.
**Suggested fix:** Derive `op` first, then canonicalize `opName` from `opcodeName(op)` for comparison, or exclude `opName` from divergence checks when numeric `op` matches.

### [LOW] Numeric string opcodes are rejected despite parser support
**Location:** test/eip3155/trace-tools.mjs:200
**Issue:** `opcodeName` supports numeric strings, but `normalizeTraceStep` treats any string `step.op` as a mnemonic by assigning it to `opName` first. Inputs like `{ op: "96" }` or `{ op: "0x60" }` therefore call `opcodeNumber("96")`/`opcodeNumber("0X60")` and throw `Unable to map opcode`.
**Why it matters:** This makes the normalizer brittle for EIP-3155/reference artifacts that serialize opcode numbers as strings, even though the helper code appears intended to handle that shape.
**Suggested fix:** Detect numeric strings before mnemonic strings, convert them with `Number(step.op)`, and then canonicalize `opName` from the numeric opcode.

</details>

<details>
<summary><strong>V10 — TypeScript LSP / Solidity type inference</strong></summary>

# TypeScript LSP / Solidity type inference review

**Slice:** V10
**Type:** vertical
**Scope:** lsp/ts-plugin lsp/lsp lsp/vscode bundler-packages/runtime
**Reviewed by:** codex (GPT-5.4)

## Summary

The Solidity editor path has several correctness bugs caused by mixing TypeScript's virtual editor state with real filesystem reads and cache invalidation. Unsaved Solidity edits can be ignored or served from stale artifacts in both the tsserver plugin and the Volar language server path, so users can see type information for code that is no longer in their editor. The standalone LSP path also has broken package/API wiring around the bundler cache, which can prevent it from starting outside the monorepo build environment. Type generation is mostly ABI-driven, but the `.s.sol` declaration path over-promises bytecode for every artifact and go-to-definition resolves by bare member name across all compiled ASTs.

## Findings

### [HIGH] Standalone LSP imports a cache API from the wrong package
**Location:** lsp/lsp/src/SolFile.ts:3
**Issue:** `SolFile` imports `createCache` from `@tevm/base-bundler`, but that package's public source barrel only exports `bundler` and `getContractPath`; `createCache` lives in `@tevm/bundler-cache`. The `@tevm/lsp` package also keeps `@tevm/base-bundler` in `devDependencies`, so the runtime import is not declared for published consumers.
**Why it matters:** The VS Code extension build bundles `../lsp/src/index.ts`, and the published `@tevm/lsp` package exposes the language server directly. Either route can fail at build/startup when module resolution enforces package exports or production dependencies, disabling Solidity language features entirely.
**Suggested fix:** Import `createCache` from `@tevm/bundler-cache`, keep `bundler` from `@tevm/base-bundler`, and move both runtime packages into `lsp/lsp/package.json` `dependencies`.

### [HIGH] tsserver plugin can serve stale types for unsaved Solidity edits
**Location:** lsp/ts-plugin/src/tsPlugin.ts:49
**Issue:** The compiler file access object is backed by `languageServiceHost`, but the cache passed to the bundler is created with `createRealFileAccessObject()`. Cache validity is therefore based on on-disk mtimes, while compilation can read unsaved editor buffers from the language service.
**Why it matters:** After a `.sol` file has a warm cache, changing an ABI in the editor without saving leaves the disk mtime unchanged. `resolveDtsSync` can reuse the old artifacts and TypeScript will continue offering stale `read`, `write`, and `events` members for the previous ABI.
**Suggested fix:** Disable persistent artifact reads for dirty language-service snapshots, or make cache keys/metadata include the current script version or content hash from the TypeScript host. At minimum, route cache validation through the same virtual file view used for compilation.

### [HIGH] Volar LSP ignores the document snapshot it is asked to update
**Location:** lsp/lsp/src/SolFile.ts:35
**Issue:** `update(newSnapshot)` stores the snapshot, but then builds the embedded TypeScript file through a bundler file access object wired directly to `node:fs` `readFileSync`/`readFile`. The current editor snapshot is never exposed to the compiler.
**Why it matters:** In the VS Code language server path, unsaved Solidity edits do not affect the generated embedded `.ts` file. Diagnostics, completions, and types can remain tied to the last saved file, which is especially misleading while editing ABI-affecting function signatures or inheritance.
**Suggested fix:** Build the LSP `FileAccessObject` around Volar/TypeScript snapshots for the active `.sol` file, falling back to disk only for unrelated imports. The cache should likewise be bypassed or keyed by snapshot content for dirty documents.

### [MEDIUM] Foundry-style remapped imports are resolved as npm packages
**Location:** lsp/ts-plugin/src/utils/solidityModuleResolver.ts:37
**Issue:** `resolveModuleNameLiteralsDecorator` rewrites matching imports with `config.remappings`, then `solidityModuleResolver` sends any non-relative `.sol` specifier to `createRequire(...).resolve(moduleName)`. Typical Foundry remaps such as `@solmate-utils/=lib/solmate/src/utils/` become `lib/solmate/src/utils/Foo.sol`, which Node treats as a package specifier named `lib` rather than a project-relative path.
**Why it matters:** Solidity compilation may understand the remapping, but the TypeScript plugin cannot resolve the same import in TS/JS source, so editor typing fails for common Foundry dependency layouts unless the remap happens to point at a real package name.
**Suggested fix:** Preserve whether a specifier was remapped and resolve remap targets as filesystem paths relative to the project root/config file when they are absolute or path-like. Also choose the longest matching remapping prefix deterministically before resolving.

### [MEDIUM] `.s.sol` declarations claim bytecode exists for every artifact
**Location:** bundler-packages/runtime/src/generateTevmBodyDts.js:63
**Issue:** When `includeBytecode` is true, `generateDtsBody` emits `Contract<..., \`0x${string}\`, \`0x${string}\`, ...>` for every artifact without checking that the artifact has non-empty `evm.bytecode.object` and `evm.deployedBytecode.object`. The runtime generator performs that check and can omit bytecode by setting it to `undefined`.
**Why it matters:** Script files that compile interfaces, abstract contracts, or artifacts with unavailable bytecode are typed as deployable even though the generated runtime object does not actually contain deployable bytecode. This is a public API footgun in editor inference and can lead users into deploy paths that fail later.
**Suggested fix:** Compute bytecode/deployed-bytecode generic parameters per artifact from the actual artifact shape, matching the runtime generator's omission rules. Emit `undefined` generics for artifacts without usable bytecode even when the entry file is `.s.sol`.

### [MEDIUM] Go-to-definition matches Solidity members by bare name across all ASTs
**Location:** lsp/ts-plugin/src/decorators/getDefinitionAtPosition.ts:80
**Issue:** The definition decorator scans every compiled AST and returns every `EventDefinition` or `FunctionDefinition` whose `name` equals the TypeScript node text. It does not constrain the search to the selected contract, ABI item, overload signature, inherited linearization, or whether the member is actually exposed on the imported contract object.
**Why it matters:** Projects with inheritance or common names such as `Transfer`, `owner`, `transfer`, or `supportsInterface` can jump to unrelated functions/events from dependencies or sibling contracts. The more contracts a Solidity file imports, the more likely editor navigation returns noisy or wrong definitions.
**Suggested fix:** Resolve the contract symbol first, then match against that contract's ABI/signature and its linearized bases. For overloaded functions/events, include parameter types from the selected TypeScript property or ABI entry instead of matching only `node.getText()`.

## Architectural observations

The tsserver plugin and the Volar language server implement separate Solidity-to-TypeScript generation paths with different file access, config loading, and cache behavior. That split is already producing divergent semantics: the tsserver path partially uses the TypeScript virtual file system, while the Volar path only uses disk. A shared editor-aware resolver abstraction would make cache invalidation, remappings, unsaved buffers, and generated declaration shape much harder to drift.

</details>

<details>
<summary><strong>V11 — Test infrastructure (matchers, conformance, hive)</strong></summary>

# Test infrastructure (matchers, conformance, hive) review

**Slice:** V11
**Type:** vertical
**Scope:** test/test-matchers test/conformance-utils test/hardfork-conformance test/eip3155 test/hive extensions/test-matchers extensions/test-node
**Reviewed by:** codex (GPT-5.4)

## Summary

The biggest risk in this slice is that the test infrastructure can report stable results from corrupted or incomplete evidence: snapshot autosave can silently drop RPC entries, balance matchers miss account creation/deletion deltas, and EIP-3155 comparisons ignore final trace summaries. The matcher API also has normal failure paths that throw internal errors or reject valid ABI values because it uses reference equality for decoded arrays/tuples. The conformance runner is intentionally lightweight, but it currently treats expected invalid-transaction fixtures as runner exceptions instead of comparing the expected unchanged post-state. All scoped paths exist; `test/hardfork-conformance` contains documentation rather than executable source.

## Findings

### [HIGH] Concurrent snapshot autosaves can lose cached RPC entries
**Location:** extensions/test-node/src/snapshot/SnapshotManager.ts:96
**Issue:** `save()` serializes the in-memory map before the async write/rename, but calls are not queued. With default `autosave: 'onRequest'`, two parallel cache misses can start overlapping saves; if the older save renames after the newer save, the snapshot file is rolled back to the older JSON payload and silently loses later entries.
**Why it matters:** Test suites commonly issue fork RPCs in parallel. A lost snapshot makes the next run hit the live fork unexpectedly or regenerate different data, defeating the purpose of deterministic snapshot tests.
**Suggested fix:** Serialize saves through a per-manager promise queue, or coalesce dirty writes so only the latest map state can be renamed. At minimum, make `save()` await any in-flight save before snapshotting `this.snapshots`.

### [HIGH] Native balance changes for created or deleted accounts are reported as zero
**Location:** extensions/test-matchers/src/matchers/balance/getBalanceChange.ts:7
**Issue:** `getBalanceChange` returns `0n` whenever either `prestateTrace.pre[address]` or `prestateTrace.post[address]` is missing. In prestate diff traces, accounts that are newly created/funded may only exist in `post`, and accounts that are emptied/deleted may only exist in `pre`; both cases are real balance changes.
**Why it matters:** `toChangeBalance` and `toChangeBalances` can pass or fail incorrectly for transfers to new accounts, contract creations with value, selfdestruct/deletion paths, and any fixture where the account did not exist on one side of the transaction.
**Suggested fix:** Treat a missing side as an empty account with balance zero, and only return `0n` when both sides are absent. Add targeted coverage for zero-to-nonzero and nonzero-to-absent account transitions.

### [HIGH] `toBeRevertedWithError` throws an internal selector error for successful transactions
**Location:** extensions/test-matchers/src/matchers/errors/toBeRevertedWithError.ts:33
**Issue:** The matcher computes `actualSelector` and throws `Could not get selector from revert data` before it branches on `isRevert`. A successful transaction has no revert data, so the normal assertion failure path is replaced by an internal error.
**Why it matters:** `await expect(successfulTx).toBeRevertedWithError(...)` should produce a matcher failure with expected/actual context. Instead, users get a misleading infrastructure exception, and `.not` behavior depends on avoiding this throw.
**Suggested fix:** If `!isRevert`, return `{ pass: false, ... }` before selector extraction. Only require a selector after the transaction is known to have reverted with data.

### [MEDIUM] EIP-3155 comparisons ignore final summary/output differences
**Location:** test/eip3155/trace-tools.mjs:270
**Issue:** `compareNormalizedTraces` only calls `firstDivergence` over opcode steps. `normalizeTraceDocument` preserves summary fields such as `output`, `gasUsed`, `pass`, and `stateRoot`, but those fields are never compared.
**Why it matters:** Two traces with identical step streams but different final return data, gas used, failure status, or state root are reported as `passed`. That can hide exactly the kind of execution divergence this tool is meant to surface.
**Suggested fix:** After step comparison succeeds, compare normalized summaries field-by-field and report the first summary divergence with a distinct `field` such as `summary.output`.

### [MEDIUM] ABI argument matchers reject valid array/tuple arguments by reference
**Location:** extensions/test-matchers/src/matchers/contract/withFunctionArgs.ts:41
**Issue:** Decoded ABI arguments are compared with `===`. That works for primitives, but array, tuple, and nested struct values decode to fresh objects, so a user-provided equal array/tuple will not match. The same pattern exists in event and error argument matchers.
**Why it matters:** Public matchers like `.withFunctionArgs`, `.withFunctionNamedArgs`, `.withEventArgs`, `.withEventNamedArgs`, `.withErrorArgs`, and `.withErrorNamedArgs` are typed to accept ABI arrays/tuples but fail for them at runtime.
**Suggested fix:** Use a deep equality helper consistent with Vitest/Chai semantics for decoded ABI values, including nested arrays, tuples, and bigint-containing objects.

### [MEDIUM] Expected invalid conformance transactions are always marked as runner failures
**Location:** test/conformance-utils/run-fixture-suite.mjs:427
**Issue:** `runVector` catches any `vm.runTx` exception and returns `status: 'failed'` with `failures: ['exception']`. Upstream GeneralStateTest post vectors can encode expected transaction exceptions; those should be validated against the expected unchanged state/logs instead of treated as harness failures.
**Why it matters:** The conformance runner will over-report failures for valid negative fixtures, especially around transaction validity and hardfork boundary cases. That makes the generated conformance signal noisy and can mask real regressions among expected rejects.
**Suggested fix:** Parse the post-vector expected-exception field, and when `vm.runTx` throws for an expected invalid transaction, compare the pre-state-derived root/log hash to the expected post values and mark the vector passed only when they match.

</details>

<details>
<summary><strong>V12 — Memory client public API</strong></summary>

# Memory client public API review

**Slice:** V12
**Type:** vertical
**Scope:** packages/memory-client packages/node packages/decorators packages/client-types
**Reviewed by:** codex (GPT-5.4)

## Summary

The biggest risk in this slice is that `createMemoryClient` exposes a viem client whose static chain identity can disagree with the TEVM node behind `client.request`. That shows up both when forking without `common` and when using the explicit `fork.chainId` override that the node supports. The public option surface also has drift: `cacheTime` is typed and documented but always discarded, while several first-party examples still use a non-existent `mining` option and describe the wrong default mining mode. The decorator layer has smaller but real API coherence issues where the public EIP-1193 provider type omits runtime-supported methods and the request wrapper retries every provider error before viem's own retry policy can classify it.

## Findings

### [HIGH] Forked clients without `common` are typed as having a chain even though runtime omits it
**Location:** packages/memory-client/src/CreateMemoryClientFn.ts:84
**Issue:** `CreateMemoryClientFn` defaults `TCommon` to `Common & Chain` and returns `MemoryClient<TCommon, ...>` even when callers pass `{ fork: { transport } }` without `common`. At runtime, `createMemoryClient` intentionally returns `common = undefined` for that case and only adds `chain` when `common !== undefined`, so `client.chain` is undefined.
**Why it matters:** TypeScript will allow fork users to read `client.chain.id` or pass the client to code requiring a chain, but the same code crashes at runtime. This is especially easy to hit because forking without `common` is supported by the runtime and documented as a path where TEVM auto-detects chain id.
**Suggested fix:** Add overloads or conditional generics so fork-without-common returns `MemoryClient<undefined, ...>`, or populate a viem chain/common once the chain id is known. Avoid defaulting the return chain generic to `Common & Chain` when the option object does not include `common`.

### [HIGH] `fork.chainId` override changes the node chain id but not the public viem client chain
**Location:** packages/memory-client/src/createMemoryClient.js:322
**Issue:** The viem client gets `chain: common` from the original `options.common`, but `createTevmNode` gives `options.fork.chainId` priority over `common.id` when building the VM common. With `common.id = 10` and `fork.chainId = 1337`, `client.chain.id` remains `10` while `eth_chainId` and `client.transport.tevm.getVm().common.id` report `1337`.
**Why it matters:** The override exists specifically for wallet compatibility, but viem wallet/public actions use `client.chain` for chain assertions, transaction preparation, and signing context. Users can get false chain mismatch errors or sign/prepare transactions against the wrong chain id while the backing node accepts a different id.
**Suggested fix:** When `fork.chainId` is present, derive the public chain/common passed to viem from the effective node chain id, or reject `common.id` plus `fork.chainId` combinations unless the public `chain` is also overridden consistently. Use the same effective id for the transport cache key.

### [MEDIUM] Public mining examples use an ignored option and describe the wrong default
**Location:** packages/memory-client/src/createMemoryClient.js:177
**Issue:** The JSDoc repeatedly documents `createMemoryClient({ mining: { auto: false } })`, `mining: { auto: true }`, and interval forms, but the runtime option is `miningConfig`, and `createTevmNode` defaults to `{ type: 'auto' }`. Passing the documented `mining` object is silently ignored.
**Why it matters:** Users following the public docs can believe they created a manual-mining client while the default auto-mining mode mines transactions immediately. That changes transaction lifecycle semantics and can invalidate tests that expect pending mempool state before `tevmMine`.
**Suggested fix:** Replace the public examples with `miningConfig: { type: 'manual' | 'auto' }` and `miningConfig: { type: 'interval', blockTime: seconds }`. If the old `mining` shape is intended to remain public, normalize it in `createMemoryClient` and make the type accept it.

### [MEDIUM] `cacheTime` is part of the public options but is always overwritten
**Location:** packages/memory-client/src/createMemoryClient.js:316
**Issue:** `MemoryClientOptions` picks `cacheTime` from viem's `ClientConfig` and documents it as configurable, but `createMemoryClient` spreads `options` and then unconditionally sets `cacheTime: 0`.
**Why it matters:** This is a silent public API no-op. Callers trying to tune viem request caching or polling behavior cannot do so, and the type/docs give no indication that TEVM forbids cache usage.
**Suggested fix:** Either honor `options.cacheTime ?? 0` or remove `cacheTime` from `MemoryClientOptions` and document that memory clients deliberately disable viem caching.

### [MEDIUM] The exported EIP-1193 provider type omits runtime-supported TEVM methods
**Location:** packages/decorators/src/request/Eip1193RequestProvider.ts:17
**Issue:** `Eip1193RequestProvider.request` includes `tevm_call`, dump/load state, get/set account, and viem test/public methods, but omits `JsonRpcSchemaTevm['tevm_mine']`. The runtime `requestProcedure` and memory-client `TevmRpcSchema` both support `tevm_mine`.
**Why it matters:** Users composing `createTevmNode().extend(requestEip1193())` get a provider whose TypeScript type rejects a request that the provider can actually execute. That pushes users toward casts for valid RPC calls and makes the decorator type less trustworthy than the memory-client wrapper type.
**Suggested fix:** Keep `Eip1193RequestProvider` in sync with the runtime handler set, at minimum by adding `JsonRpcSchemaTevm['tevm_mine']`. Prefer deriving this schema from the same TEVM RPC schema used by memory-client to avoid future drift.

### [LOW] `requestEip1193` retries every provider error before viem can classify it
**Location:** packages/decorators/src/request/requestEip1193.js:22
**Issue:** The decorator wraps `requestProcedure(client)` in viem `withRetry` with default `shouldRetry = () => true`. That means JSON-RPC errors converted to `ProviderRpcError`, including invalid params and method-not-found errors, are retried internally before viem's transport-level `buildRequest` retry policy sees the error.
**Why it matters:** Deterministic user errors are executed three times by default and delayed unnecessarily. For state-changing procedures, an unexpected throw after partial mutation would be replayed by this blanket retry wrapper, which is the wrong default for an in-memory node.
**Suggested fix:** Remove the inner retry and let viem's transport retry policy handle retries, or pass a `shouldRetry` that mirrors viem's RPC retry classification and defaults `retryCount` to `0` for local in-memory execution.

</details>

<details>
<summary><strong>V13 — Predeploys & precompiles correctness</strong></summary>

# Predeploys & precompiles correctness review

**Slice:** V13
**Type:** vertical
**Scope:** packages/predeploys packages/precompiles
**Reviewed by:** codex (GPT-5.4)

## Summary

The biggest problem is the local P-256 precompile: it is exported as a RIP-7212 implementation but diverges from the EVM precompile behavior on gas, failure return data, high-S signatures, and fork-gated availability. Because the node layer registers this custom precompile by default, it can shadow the upstream EthereumJS 0x0100 precompile even when the active fork already has a canonical implementation. The generic `defineCall` helper also lets malformed calldata escape as a JavaScript exception before an `ExecResult` exists, which makes custom precompile addresses brittle under arbitrary external calls. I did not find substantive OP-stack predeploy implementations in `packages/predeploys`; that package is currently only the generic `definePredeploy` wrapper.

## Findings

### [HIGH] P-256 gas accounting is non-canonical and underfunded calls are not rejected
**Location:** packages/precompiles/src/p256verify.precompile.ts:14
**Issue:** `P256_VERIFY_GAS_COST` is fixed at `3450n`, and the precompile body never checks `input.gasLimit` before returning success or failure. The EthereumJS precompile at the same address in this repo is EIP-7951-gated, charges `6900`, and returns an out-of-gas `ExecResult` when the provided gas is lower than the fixed cost.
**Why it matters:** Tevm registers this custom precompile by default in the node path, so calls to `0x0000000000000000000000000000000000000100` can succeed with half the canonical gas, and can report non-exceptional execution even when the caller did not provide enough gas. That is a direct simulation/consensus divergence for any chain or fork where the standard P-256 precompile is active.
**Suggested fix:** Prefer deleting this custom implementation and relying on EthereumJS' active precompile. If Tevm keeps its own implementation, update the cost to the active spec value, check `input.gasLimit < P256_VERIFY_GAS_COST`, return an OOG `exceptionError` consuming `input.gasLimit`, and only register it when the active `common`/chain rules actually enable P-256.

### [HIGH] P-256 failure return data is wrong
**Location:** packages/precompiles/src/p256verify.precompile.ts:37
**Issue:** Invalid input length, invalid signatures, and verification exceptions return a 32-byte zero word. The EVM precompile behavior is to return empty bytes for failure and only return the 32-byte `1` word for success.
**Why it matters:** Contracts can distinguish empty return data from ABI-encoded `false` via `RETURNDATASIZE`, low-level calls, and `abi.decode` behavior. Tevm will therefore execute different branches than a real chain for failed P-256 verification.
**Suggested fix:** Return `new Uint8Array()` for all non-success cases and reserve `toBytes(1, { size: 32 })` for the valid signature path.

### [HIGH] P-256 rejects valid high-S signatures
**Location:** packages/precompiles/src/p256verify.precompile.ts:68
**Issue:** The call to `p256.verify` passes only `{ prehash: false }`. Noble's ECDSA verifier rejects high-S signatures by default, while the P-256 precompile accepts any `s` satisfying `0 < s < n`; the upstream EthereumJS implementation explicitly passes `lowS: false`.
**Why it matters:** A valid on-chain P-256 signature with a high-S value is reported invalid by Tevm. Any account abstraction, passkey, or RIP/EIP-7212 workflow simulated through this precompile can fail locally while succeeding on the target chain.
**Suggested fix:** Validate `r` and `s` against the P-256 subgroup order and call `p256.verify(..., { prehash: false, lowS: false })`.

### [HIGH] Malformed custom precompile calldata escapes as a JavaScript exception
**Location:** packages/precompiles/src/defineCall.ts:62
**Issue:** `decodeFunctionData` runs before the `try` block. Unknown selectors, short calldata, or malformed ABI payloads thrown by the decoder reject the precompile function instead of being converted into an `ExecResult`.
**Why it matters:** Precompile addresses are externally callable. A single bad call to a `defineCall` precompile can bubble a host exception through `runCall`/`tevmCall` instead of producing an EVM revert-style result, which is a public API footgun and a denial-of-service surface for code that expects arbitrary calldata to be sandboxed by the EVM.
**Suggested fix:** Move decode and handler lookup inside the `try`, and return a deterministic EVM error result for invalid calldata. Preserve sensible gas accounting for that failure instead of letting the host exception escape.

### [MEDIUM] Handler errors are forced through successful return encoding
**Location:** packages/precompiles/src/defineCall.ts:83
**Issue:** Even when a handler returns `error`, `defineCall` still calls `encodeFunctionResult` with the normal function output type. If the handler has no valid success-shaped `returnValue`, the encoding throws and the catch block replaces the original error with a generic revert using `executionGasUsed: 0n`.
**Why it matters:** Custom precompile authors cannot reliably return typed errors or raw revert data unless they also fabricate a valid success return. Real handler failures can be masked, and gas/error information from the handler can be lost.
**Suggested fix:** If `error` is present, bypass normal success-result encoding and return the supplied revert payload or empty bytes while preserving `executionGasUsed` and `exceptionError`. Keep the catch block for unexpected host failures only.

### [MEDIUM] Overloaded events can be encoded with the wrong ABI item
**Location:** packages/precompiles/src/logToEthjsLog.ts:30
**Issue:** `logToEthjsLog` finds the event ABI item by `item.name === log.eventName` and uses the first match to decide which inputs are non-indexed. ABIs can contain overloaded events with the same name but different parameter lists.
**Why it matters:** A custom precompile emitting an overloaded event can produce topics for one event signature but data encoded against another event's inputs. Receipts and filters then expose logs that cannot be decoded correctly by clients.
**Suggested fix:** Require the log descriptor to carry the exact ABI event item or canonical event signature, and use that same resolved item for both topic generation and data encoding.

### [LOW] `definePredeploy` examples describe a different API than the implementation
**Location:** packages/predeploys/src/definePredeploy.js:12
**Issue:** The public example calls `definePredeploy({ address, contract: createContract(...) })`, but the implementation and `DefinePredeployFn` type accept the contract object directly and read `contract.address`.
**Why it matters:** Users following the package docs will pass an object without `address` at the expected level, causing `createAddress(contract.address)` to fail at runtime.
**Suggested fix:** Update the examples in `definePredeploy.js` and `DefinePredeployFn.ts` to call `definePredeploy(createContract({ ..., address }))`, and align the option name with the current node/client option if the docs are still using an old `predeploys` field.

</details>

<details>
<summary><strong>V14 — Viem extension integration</strong></summary>

# Viem extension integration review

**Slice:** V14
**Type:** vertical
**Scope:** extensions/viem packages/memory-client packages/decorators
**Reviewed by:** codex (GPT-5.4)

## Summary

The main risk is semantic drift in the legacy `extensions/viem` adapters: they advertise Tevm action APIs but hand-roll JSON-RPC payloads and silently call the wrong method or drop action parameters. The optimistic extension is effectively broken against the current runtime because it calls `tevm_contract`, which the runtime marks unsupported. The newer memory-client path is much safer because it delegates to Tevm handlers through `client.transport.tevm`, but its source runtime barrel is out of sync with the TypeScript barrel for `tevmDeal`. All scoped paths exist.

## Findings

### [HIGH] `tevm.getAccount` sends a mutating set-account request
**Location:** extensions/viem/src/tevmViemExtension.js:103
**Issue:** The `getAccount` adapter calls `request({ method: 'tevm_setAccount', ... })` instead of `tevm_getAccount`.
**Why it matters:** Consumers calling a read API get the set-account result shape rather than account state, and the request goes through the mutating account procedure. Even when the payload only contains an address, this is a public API footgun and breaks callers expecting balance, nonce, bytecode, or storage.
**Suggested fix:** Change the method to `tevm_getAccount`, forward `returnStorage` and `blockTag` if present, and add a regression case that asserts the JSON-RPC method and returned account shape.

### [HIGH] Optimistic writes call an unsupported Tevm JSON-RPC method
**Location:** extensions/viem/src/tevmViemExtensionOptimistic.js:83
**Issue:** `writeContractOptimistic` sends `client.request({ method: 'tevm_contract', params: action })`. The current Tevm request handler intentionally returns an unsupported-method error for `tevm_contract`, and JSON-RPC params for Tevm methods are array-wrapped, not the raw action object.
**Why it matters:** The first yield from the optimistic API cannot perform the advertised local simulation against a real Tevm backend. Users either get an error before the hash/receipt path or, with mocks, test a method shape that production rejects.
**Suggested fix:** Encode the viem write parameters into a supported `tevm_call` payload, use `params: [payload]`, and map viem's `address` to Tevm's `to`. If contract JSON-RPC is intentionally unsupported, remove this adapter path rather than exposing it as optimistic state.

### [HIGH] The call adapter silently drops transaction and caller semantics
**Location:** extensions/viem/src/tevmViemExtension.js:135
**Issue:** `getCallArgs` only forwards a subset of `CallParams`; it omits `from`, `nonce`, `maxFeePerGas`, `maxPriorityFeePerGas`, `createTransaction`, `addToMempool`, `addToBlockchain`, `createTrace`, `createAccessList`, `stateOverrideSet`, and `blockOverrideSet`.
**Why it matters:** `decorated.tevm.call(...)` is typed as a Tevm call handler, but common Tevm options are ignored. A user asking to impersonate `from`, create a transaction, add it to the chain, or run with state overrides gets a read-like call under default caller/origin instead, which can produce plausible but wrong results.
**Suggested fix:** Stop manually serializing `CallParams`; either delegate through a Tevm client/handler or serialize every supported JSON-RPC field with explicit `undefined` checks. Add focused coverage for `from`, transaction creation, and state/block overrides.

### [HIGH] `setAccount` cannot clear balances/nonces and drops storage updates
**Location:** extensions/viem/src/tevmViemExtension.js:120
**Issue:** The adapter uses truthiness checks for `balance` and `nonce`, so `0n` is omitted, and it never forwards `state` or `stateDiff`.
**Why it matters:** Resetting an account to zero balance or zero nonce is a normal test setup operation, and setting storage is part of the documented account-management surface. The call succeeds while leaving previous state in place, which is exactly the kind of silent setup corruption that makes viem/Tevm integration tests lie.
**Suggested fix:** Use property-presence checks such as `'balance' in params` and `'nonce' in params`, and include `state` and `stateDiff` in the serialized payload.

### [MEDIUM] Runtime and TypeScript barrels disagree on `tevmDeal`
**Location:** packages/memory-client/src/index.js:1
**Issue:** `src/index.ts` exports `tevmDeal`, but the runtime `src/index.js` barrel does not.
**Why it matters:** This package is primarily JavaScript at runtime, so a named import that appears in the TS barrel can be absent from the JS entry and generated dist entry. Consumers can get type-visible API surface that fails at runtime.
**Suggested fix:** Add `export { tevmDeal } from './tevmDeal.js'` to `packages/memory-client/src/index.js` and ensure the built dist/types barrels include the same named export.

### [MEDIUM] Undefined block tags are rewritten to `pending`
**Location:** extensions/viem/src/tevmViemExtension.js:8
**Issue:** `formatBlockTag(undefined)` returns `'pending'`, and the eth adapters use it for `getBalance`, `getCode`, and `getStorageAt` when callers omit `blockTag`.
**Why it matters:** Tevm's eth handlers and normal Ethereum JSON-RPC reads default to latest-state semantics, while `pending` can include mempool changes. The extension therefore makes default reads observe a different state than the corresponding viem or memory-client action.
**Suggested fix:** Default omitted block tags to `'latest'` for eth read adapters. If Tevm-specific methods need pending semantics, handle that at those call sites explicitly.

### [LOW] JSON-RPC id `0` is dropped from wrapped responses
**Location:** extensions/viem/src/tevmViemExtension.js:66
**Issue:** The response wrapper uses `...(req.id ? { id: req.id } : {})`, so valid JSON-RPC ids such as `0` are omitted on both success and error responses.
**Why it matters:** This violates JSON-RPC correlation semantics for clients that use numeric ids starting at zero. It is narrow, but it makes the low-level `tevm.request` wrapper less spec-compatible than advertised.
**Suggested fix:** Use `req.id === undefined ? {} : { id: req.id }` in both response paths.

## Architectural observations

The legacy viem extension reimplements Tevm action serialization by hand while the memory-client viem actions delegate to real Tevm handlers. The manual path is already missing methods, fields, defaults, and supported-method behavior. If the extension remains public, it should be rewritten around the same handler/request machinery as `createTevmTransport` or reduced to a thin transport-only compatibility shim.

</details>

<details>
<summary><strong>V15 — Ethers compatibility shim</strong></summary>

# Ethers compatibility shim review

**Slice:** V15
**Type:** vertical
**Scope:** extensions/ethers
**Reviewed by:** codex (GPT-5.4)

## Summary

The biggest runtime issue is that `TevmProvider` subclasses ethers' `JsonRpcApiProvider` but never starts it, so normal ethers calls can remain stuck before `_send` is invoked. The typed contract layer is mostly a cast over ethers v6, and several of those casts describe viem/abitype shapes instead of ethers runtime shapes. That makes the public API look safer than it is: integer return values, multi-return functions, event logs, and `Interface` inputs are all typed in ways that can compile while failing at runtime or reject valid ethers usage. The package also has stale public docs that point users at APIs and call shapes that no longer match the implementation.

## Findings

### [HIGH] Provider never starts the JsonRpcApiProvider lifecycle
**Location:** extensions/ethers/src/TevmProvider.js:173
**Issue:** `TevmProvider` extends `JsonRpcApiProvider` but the constructor only calls `super(...)` and assigns `this.tevm`; it never calls `this._start()`. Ethers documents `_start()` as mandatory for subclasses, and `send()` waits for it before passing payloads to `_send`.
**Why it matters:** `TevmProvider.createMemoryProvider()` returns the public provider type, but normal ethers calls such as `provider.send`, `getBlockNumber`, `getBalance`, contract reads, and signer flows can hang indefinitely instead of reaching Tevm. This is a core compatibility break for the shim.
**Suggested fix:** Call `this._start()` after `this.tevm` is assigned in the constructor, or override `_start()` only if needed and delegate to `super._start()`.

### [MEDIUM] Ethers Interface instances are rejected by the typed Contract constructor
**Location:** extensions/ethers/src/contract/Contract.d.ts:21
**Issue:** The runtime export is ethers' `Contract`, which accepts an `Interface` instance, but the declaration narrows `abi` to `{ fragments: TAbi } | TAbi` where `TAbi extends Abi`. A normal ethers `Interface` has `fragments: Fragment[]`, not JSON ABI items, so valid ethers code like `new Contract(address, new ethers.Interface(abi), runner)` is not accepted by this shim's types.
**Why it matters:** This is a compatibility regression in a compatibility package. Existing ethers v6 users who pre-parse interfaces must either cast through `any` or use Tevm's re-cast `Interface`, even though the underlying constructor works.
**Suggested fix:** Add overloads for `EthersInterface`/`InterfaceAbi`. Keep the typed ABI-literal overload for `TAbi`, but fall back to `EthersContract` or a less-specific `TypesafeEthersContract<Abi>` when the caller passes a normal ethers `Interface`.

### [MEDIUM] Integer return types use abitype semantics instead of ethers v6 semantics
**Location:** extensions/ethers/src/contract/TypesafeEthersContract.ts:18
**Issue:** Return types are derived from `AbiParametersToPrimitiveTypes`, which can type small integer outputs such as `uint8` as `number`. Ethers v6 decodes integer outputs as `bigint`; the local test fixture even expects `decimals()` to type as `number` while the runtime snapshot is `18n`.
**Why it matters:** Consumers can write code that typechecks but fails at runtime, for example number arithmetic, JSON serialization assumptions, or strict equality checks on `decimals()`, `uint32`, `int24`, and similar outputs.
**Suggested fix:** Use an ethers-specific ABI output mapper for contract return values where every `int*`/`uint*` output maps to `bigint` recursively, instead of reusing abitype's default primitive mapping.

### [MEDIUM] Multi-output functions are typed as only their first return value
**Location:** extensions/ethers/src/contract/TypesafeEthersContract.ts:18
**Issue:** Both read and write method metadata index `AbiParametersToPrimitiveTypes<...['outputs']>[0]`, so a function returning multiple values is typed as the first output only. Ethers returns a `Result` tuple-like object for multi-output calls.
**Why it matters:** Common ABIs such as AMM reserves, position data, oracle rounds, and struct-like tuple returns are misrepresented. Callers can drop values at the type level or write scalar code against a runtime tuple.
**Suggested fix:** Model outputs by arity: zero outputs as `void`/`undefined`, one output as the scalar ethers-decoded type, and multiple outputs as a tuple/`Result` shape containing every decoded output.

### [MEDIUM] queryFilter returns ABI event definitions in the type, not emitted logs
**Location:** extensions/ethers/src/contract/TypesafeEthersContract.ts:40
**Issue:** The typed branch returns `ExtractAbiEvent<TAbi, TContractEventName>`, which is the ABI event item. Ethers `queryFilter` returns `EventLog`/`Log` objects with log metadata and decoded `args`, not ABI definitions.
**Why it matters:** Event consumers lose typed access to the fields they actually receive, such as `args`, `blockNumber`, `transactionHash`, and `logIndex`, while being told ABI-only fields are the result. Indexing code can typecheck against the wrong object shape.
**Suggested fix:** Return `Array<EventLog & { args: GetEventArgs<TAbi, TContractEventName> }>` for known ABI event names, and preserve `EventLog | Log` for unknown filters.

### [LOW] Tevm JSON-RPC example uses the wrong ethers send parameter shape
**Location:** extensions/ethers/src/TevmProvider.js:92
**Issue:** The JSDoc example calls `provider.send('tevm_setAccount', { ... })`, but ethers `send` passes JSON-RPC params, and the tests use an array: `provider.send('tevm_setAccount', [{ ... }])`.
**Why it matters:** Users copying the documented example send an object where Tevm handlers expect positional JSON-RPC params. That makes the first Tevm-specific example a runtime footgun.
**Suggested fix:** Change the examples to `provider.send('tevm_setAccount', [{ ... }])` and `provider.send('tevm_getAccount', [{ address }])`.

## Architectural observations

The extension currently gets most of its contract "typesafety" by re-casting ethers classes rather than adapting ethers' actual decoded value model. That is inexpensive, but it mixes viem/abitype conventions with ethers v6 conventions in the public surface. A small internal ethers-specific ABI type mapper would remove several of these mismatches without adding runtime code.

</details>

<details>
<summary><strong>V16 — CLI commands & UX</strong></summary>

# CLI commands & UX review

**Slice:** V16
**Type:** vertical
**Scope:** cli
**Reviewed by:** codex (GPT-5.4)

## Summary

The CLI has several user-visible command paths that report failure as normal output instead of failing the process, which makes the commands unsafe in scripts and CI. A few advertised commands/options are also nonfunctional: `tsc` never invokes TypeScript, state file load/save is stubbed, and `serve --fork` crashes with its own default block value. The most concrete action correctness bug is `getStorageAt`, which passes the wrong parameter name to the Tevm handler. Overall, the slice feels like an Ink prototype with many commands wired to happy-path rendering but not to CLI-grade validation, process status, or implemented side effects.

## Findings

### [HIGH] Action command failures render red text but still exit successfully
**Location:** cli/src/components/CliAction.tsx:66
**Issue:** `CliAction` handles `interactiveError`/`actionError` by rendering the message, but it never throws, calls `useApp().exit(error)`, or sets `process.exitCode`. The same pattern is used by the action command family through `useAction`, so rejected RPC calls and parameter errors become normal React output instead of failed CLI invocations.
**Why it matters:** Users running `tevm get-block --run`, `tevm read-contract --run`, or any other action command from scripts can get a red error message while the process status still indicates success. That breaks CI, shell conditionals, and automation that relies on exit codes.
**Suggested fix:** In the shared action UI path, convert action errors into failing process status. For Ink/Pastel commands, prefer a single shared error boundary or `useApp().exit(error)`/`process.exitCode = 1` plus a controlled exit after rendering, and apply the same policy to non-`useAction` commands that render error states.

### [HIGH] `getStorageAt` calls Tevm with `slot`, but the Tevm handler requires `position`
**Location:** cli/src/commands/getStorageAt.tsx:127
**Issue:** The command constructs params as `{ address, slot }` and then calls `client.getStorageAt(params)`. The Tevm `EthGetStorageAtParams` type and handler use `position`, and the handler immediately normalizes `params.position`; `slot` is not a recognized field for this client path.
**Why it matters:** The command either throws internally when `params.position` is undefined or reads the wrong value depending on the downstream implementation. Users cannot reliably inspect storage through this CLI command.
**Suggested fix:** Either route this command through a viem public client where `slot` is the expected name, or keep the memory-client path and translate the CLI option to `{ position: slotHex }`. Add validation that the value is a hex storage slot before executing.

### [HIGH] `serve --fork` crashes with the default `forkBlockNumber`
**Location:** cli/src/utils/server.ts:79
**Issue:** `serve` defaults `forkBlockNumber` to the string `"latest"`, but `initializeServer` passes any truthy value through `BigInt(forkBlockNumber)`. Starting with `--fork <url>` and no explicit numeric `--forkBlockNumber` therefore evaluates `BigInt("latest")`.
**Why it matters:** The documented default fork configuration cannot start. Anyone trying the natural `tevm serve --fork https://...` path hits a startup exception before the server listens.
**Suggested fix:** Treat `"latest"` as absence of a numeric block override, or pass a real block tag through the fork configuration if the memory client supports tags. Only call `BigInt` after validating a decimal/hex block number.

### [HIGH] `tsc` is a stub that never compiles
**Location:** cli/src/commands/tsc.tsx:35
**Issue:** The command description says it compiles TypeScript with the Tevm plugin, but the implementation only renders a sentence reflecting the selected options. It never spawns `tsc`, loads a project, streams compiler output, or forwards the compiler exit code.
**Why it matters:** This is a public command surface that silently does no work. Users can believe type generation/checking succeeded while no files were checked and no diagnostics were produced.
**Suggested fix:** Implement the command by invoking the local or packaged TypeScript compiler with the requested `--project`, `--watch`, and `--noEmit` flags, and propagate the child process exit code. If this command is intentionally not supported, remove it from the command surface until it is.

### [MEDIUM] State file options are advertised but not implemented
**Location:** cli/src/commands/loadState.tsx:95
**Issue:** `loadState` advertises `--stateFile` and the command description says it loads state from a file, but the `stateFile` branch always throws `File reading not implemented in this context`. The matching `dumpState --outputFile` path only logs `State would be saved...` and never writes the file.
**Why it matters:** The dump/load workflow is the main durable-state UX for a local EVM, and the file-based path is the one users will naturally automate. Right now one half always fails and the other half claims a file destination without creating it.
**Suggested fix:** Use Node `fs` in both commands: read and parse `stateFile` before `tevmLoadState`, and write `result.state` to `outputFile` after `tevmDumpState`. Fail with a nonzero exit code when parsing or writing fails.

### [MEDIUM] Invalid block numbers are silently downgraded to another query
**Location:** cli/src/commands/getBlock.tsx:106
**Issue:** `parseBlockNumber` catches invalid input, prints a warning, and returns `undefined`. Since these commands also carry defaults such as `blockTag: "latest"`, an invocation like `--blockNumber typo` can proceed without the requested block number and query the fallback block instead.
**Why it matters:** This is a CLI argument-parsing footgun: the user supplied a specific block selector, but the command can return data for a different block rather than failing. Similar helper copies appear in other block-aware commands.
**Suggested fix:** Treat an invalid block number as a validation error. Return a rejected command/action error instead of `undefined`, and centralize block selector parsing so all commands share the same strict behavior.

### [MEDIUM] Editor mode ignores failed editor launches and failed generated scripts
**Location:** cli/src/hooks/useAction.tsx:123
**Issue:** `openEditor` returns the editor exit code, but `useAction` discards it and continues to dependency install and script execution. The generated script templates also end with `.catch(console.error)` without setting a failing exit code, so a failing action inside the editor script can exit `0` with only stderr output.
**Why it matters:** Interactive mode is the default path for action commands. If `$EDITOR` is invalid, the editor crashes, or the edited action rejects, the CLI can continue as though the session succeeded and may surface an empty result instead of an actionable failure.
**Suggested fix:** Abort when the editor exits nonzero. In generated scripts, catch errors by printing them and setting `process.exitCode = 1` or rethrowing, then make `executeTsFile` treat stderr/nonzero status as command failure.

## Architectural observations

The CLI repeats option schemas, environment fallback parsing, block parsing, and action-to-client routing across many command files. That repetition is already producing drift: `TEVM_RUN` is documented but not consistently parsed into the actual `enabled` checks, block parsing differs by command, and the hand-maintained viem action list does not express each command's real parameter contract. A small command descriptor layer that owns client selection, strict parameter parsing, exit behavior, and editor-template generation would reduce the current copy/paste failure modes.

</details>
