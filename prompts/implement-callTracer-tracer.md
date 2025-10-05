# Implement callTracer for Tevm Debug Trace Procedures

## Task Description

Implement the missing `callTracer` functionality for Tevm's debug trace procedures. The callTracer should build a hierarchical tree of all EVM calls/creates during execution, tracking gas usage, input/output data, and error states. 

**Requirements:**
- Integrate seamlessly with existing tracer architecture and API patterns
- Follow the same patterns as `prestateTracer` and default tracer implementations  
- Use EVM event hooks (`beforeMessage`/`afterMessage`) to build the call tree
- Return results matching the defined `CallTraceResult` and `TraceCall` TypeScript types
- Support all trace types: CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2, SELFDESTRUCT
- Handle nested calls with proper parent-child relationships and call depth tracking
- Minimize code complexity while maximizing impact and reliability

**Primary Implementation Target:**
- `/packages/actions/src/internal/runCallWithCallTrace.js` - currently throws "not yet implemented" error

## Context: Existing Tevm Tracer Architecture

### Current Tracer Implementations

**✅ Implemented Tracers:**
- **Default tracer**: Returns `TraceResult` with `structLogs` containing opcode-level execution details
- **prestateTracer**: Returns account state before/after execution using access lists and preimages

**❌ Missing Implementation:**
- **callTracer**: Should return hierarchical call tree but currently throws error

### Type System Architecture

**Core Types:**
```typescript
// Top-level result for callTracer
export type CallTraceResult = {
	type: TraceType
	from: Address
	to: Address  
	value: bigint
	gas: bigint
	gasUsed: bigint
	input: Hex
	output: Hex
	calls?: TraceCall[]  // Nested calls
}

// Individual calls in the tree
export type TraceCall = {
	type: TraceType
	from: Address
	to: Address
	value?: bigint
	gas?: bigint
	gasUsed?: bigint
	input: Hex
	output: Hex
	error?: string
	revertReason?: string
	calls?: TraceCall[]  // Recursive nested calls
}

// Call types
export type TraceType = 'CALL' | 'DELEGATECALL' | 'STATICCALL' | 'CREATE' | 'CREATE2' | 'SELFDESTRUCT'
```

### Integration Points

**Debug Procedures (Already Implemented):**
- `debugTraceCallProcedure.js` - handles `debug_traceCall` JSON-RPC
- `debugTraceTransactionProcedure.js` - handles `debug_traceTransaction` JSON-RPC  
- `debugTraceBlockProcedure.js` - handles `debug_traceBlock` JSON-RPC

**Handler Integration (Already Wired):**
```javascript
// In traceCallHandler.js - already routes to callTracer
if (params.tracer === 'callTracer') {
	return getVm()
		.then((vm) => vm.deepCopy())
		.then((vm) => runCallWithCallTrace(vm, logger, callParams))  // ← NEEDS IMPLEMENTATION
		.then((res) => res.trace)
}
```

### EVM Event System Available

**Key Event Hooks:**
```javascript
// Before each call/create - build call tree entry
vm.evm.events.on('beforeMessage', (message, resolve) => {
	// message contains: to, value, caller, gasLimit, data, depth, isStatic, delegatecall
})

// After each call/create - capture results and gas usage  
vm.evm.events.on('afterMessage', (result, resolve) => {
	// result contains: gasUsed, createdAddress, execResult (returnValue, exceptionError)
})

// Each opcode execution
vm.evm.events.on('step', (data, resolve) => {
	// For detailed opcode tracking if needed
})
```

**Message Object Structure:**
```javascript
{
  to?: Address,           // Target address (undefined for CREATE)
  value: bigint,          // Value in wei
  caller: Address,        // Calling address
  gasLimit: bigint,       // Gas limit
  data: Uint8Array,       // Call data
  depth: number,          // Call depth (0 = top level)
  isStatic: boolean,      // Is view call
  delegatecall: boolean,  // Is DELEGATECALL
  // ... additional fields
}
```

### Existing Pattern: prestateTracer Implementation

**Key Implementation Patterns from `runCallWithPrestateTrace.js`:**
```javascript
export const runCallWithPrestateTrace = async (client, evmInput, diffMode = false) => {
	const { logger, getVm } = client
	const vm = await getVm()
	await vm.evm.journal.cleanup()

	// Convert EVM input to transaction
	const tx = await evmInputToImpersonatedTx(client)(evmInput)
	
	// Execute with reporting enabled
	const runTxResult = await vm.runTx({
		tx,
		skipHardForkValidation: true,
		skipBlockGasLimitValidation: true,
		reportAccessList: true,        // Enable access list reporting
		reportPreimages: true,         // Enable preimage reporting  
		preserveJournal: true,         // Preserve state changes
	})

	// Process results and build trace data...
	return {
		...runTxResult,
		trace: processedTraceData
	}
}
```

**Function Signature Pattern:**
```javascript
/**
 * @internal
 * @param {import('@tevm/vm').Vm} vm
 * @param {import('@tevm/node').TevmNode['logger']} logger  
 * @param {import('@tevm/evm').EvmRunCallOpts} params
 * @param {boolean} [lazilyRun]
 * @returns {Promise<import('@tevm/evm').EvmResult & {trace: import('../common/CallTraceResult.js').CallTraceResult}>}
 * @throws {never}
 */
```

### Current File Structure

**Primary Implementation File:**
- `/packages/actions/src/internal/runCallWithCallTrace.js` - **NEEDS IMPLEMENTATION**

**Integration Files (Already Complete):**
- `/packages/actions/src/debug/traceCallHandler.js` - Router logic implemented
- `/packages/actions/src/common/CallTraceResult.ts` - Type definitions complete
- `/packages/actions/src/common/TraceCall.ts` - Type definitions complete
- `/packages/actions/src/common/TraceType.ts` - Type definitions complete

**Test Files (Waiting for Implementation):**
- Multiple test files contain `it.todo()` tests for callTracer functionality

## References

https://github.com/paradigmxyz/reth/blob/bb4bf298/crates/rpc/rpc/src/debug.rs
```rust
use alloy_consensus::{transaction::SignerRecoverable, BlockHeader};
use alloy_eips::{eip2718::Encodable2718, BlockId, BlockNumberOrTag};
use alloy_genesis::ChainConfig;
use alloy_primitives::{Address, Bytes, B256};
use alloy_rlp::{Decodable, Encodable};
use alloy_rpc_types_debug::ExecutionWitness;
use alloy_rpc_types_eth::{
    state::EvmOverrides, transaction::TransactionRequest, Block as RpcBlock, BlockError, Bundle,
    StateContext, TransactionInfo,
};
use alloy_rpc_types_trace::geth::{
    call::FlatCallFrame, BlockTraceResult, FourByteFrame, GethDebugBuiltInTracerType,
    GethDebugTracerType, GethDebugTracingCallOptions, GethDebugTracingOptions, GethTrace,
    NoopFrame, TraceResult,
};
use async_trait::async_trait;
use jsonrpsee::core::RpcResult;
use reth_chainspec::{ChainSpecProvider, EthChainSpec, EthereumHardforks};
use reth_evm::{execute::Executor, ConfigureEvm, EvmEnvFor, TxEnvFor};
use reth_primitives_traits::{
    Block as _, BlockBody, NodePrimitives, ReceiptWithBloom, RecoveredBlock, SignedTransaction,
};
use reth_revm::{
    database::StateProviderDatabase,
    db::{CacheDB, State},
    witness::ExecutionWitnessRecord,
};
use reth_rpc_api::DebugApiServer;
use reth_rpc_eth_api::{
    helpers::{EthTransactions, TraceExt},
    EthApiTypes, FromEthApiError, RpcNodeCore,
};
use reth_rpc_eth_types::{EthApiError, StateCacheDb};
use reth_rpc_server_types::{result::internal_rpc_err, ToRpcResult};
use reth_storage_api::{
    BlockIdReader, BlockReaderIdExt, HeaderProvider, ProviderBlock, ReceiptProviderIdExt,
    StateProofProvider, StateProvider, StateProviderFactory, StateRootProvider, TransactionVariant,
};
use reth_tasks::pool::BlockingTaskGuard;
use reth_trie_common::{updates::TrieUpdates, HashedPostState};
use revm::{context_interface::Transaction, state::EvmState, DatabaseCommit};
use revm_inspectors::tracing::{
    FourByteInspector, MuxInspector, TracingInspector, TracingInspectorConfig, TransactionContext,
};
use std::sync::Arc;
use tokio::sync::{AcquireError, OwnedSemaphorePermit};

/// `debug` API implementation.
///
/// This type provides the functionality for handling `debug` related requests.
pub struct DebugApi<Eth, BlockExecutor> {
    inner: Arc<DebugApiInner<Eth, BlockExecutor>>,
}

// === impl DebugApi ===

impl<Eth, Evm> DebugApi<Eth, Evm> {
    /// Create a new instance of the [`DebugApi`]
    pub fn new(eth: Eth, blocking_task_guard: BlockingTaskGuard, evm_config: Evm) -> Self {
        let inner = Arc::new(DebugApiInner { eth_api: eth, blocking_task_guard, evm_config });
        Self { inner }
    }

    /// Access the underlying `Eth` API.
    pub fn eth_api(&self) -> &Eth {
        &self.inner.eth_api
    }
}

impl<Eth: RpcNodeCore, BlockExecutor> DebugApi<Eth, BlockExecutor> {
    /// Access the underlying provider.
    pub fn provider(&self) -> &Eth::Provider {
        self.inner.eth_api.provider()
    }
}

// === impl DebugApi ===

impl<Eth, Evm> DebugApi<Eth, Evm>
where
    Eth: EthApiTypes + TraceExt + 'static,
    Evm: ConfigureEvm<Primitives: NodePrimitives<Block = ProviderBlock<Eth::Provider>>> + 'static,
{
    /// Acquires a permit to execute a tracing call.
    async fn acquire_trace_permit(&self) -> Result<OwnedSemaphorePermit, AcquireError> {
        self.inner.blocking_task_guard.clone().acquire_owned().await
    }

    /// Trace the entire block asynchronously
    async fn trace_block(
        &self,
        block: Arc<RecoveredBlock<ProviderBlock<Eth::Provider>>>,
        evm_env: EvmEnvFor<Eth::Evm>,
        opts: GethDebugTracingOptions,
    ) -> Result<Vec<TraceResult>, Eth::Error> {
        // replay all transactions of the block
        let this = self.clone();
        self.eth_api()
            .spawn_with_state_at_block(block.parent_hash().into(), move |state| {
                let mut results = Vec::with_capacity(block.body().transactions().len());
                let mut db = CacheDB::new(StateProviderDatabase::new(state));

                this.eth_api().apply_pre_execution_changes(&block, &mut db, &evm_env)?;

                let mut transactions = block.transactions_recovered().enumerate().peekable();
                let mut inspector = None;
                while let Some((index, tx)) = transactions.next() {
                    let tx_hash = *tx.tx_hash();

                    let tx_env = this.eth_api().evm_config().tx_env(tx);

                    let (result, state_changes) = this.trace_transaction(
                        &opts,
                        evm_env.clone(),
                        tx_env,
                        &mut db,
                        Some(TransactionContext {
                            block_hash: Some(block.hash()),
                            tx_hash: Some(tx_hash),
                            tx_index: Some(index),
                        }),
                        &mut inspector,
                    )?;

                    inspector = inspector.map(|insp| insp.fused());

                    results.push(TraceResult::Success { result, tx_hash: Some(tx_hash) });
                    if transactions.peek().is_some() {
                        // need to apply the state changes of this transaction before executing the
                        // next transaction
                        db.commit(state_changes)
                    }
                }

                Ok(results)
            })
            .await
    }

    /// Replays the given block and returns the trace of each transaction.
    ///
    /// This expects a rlp encoded block
    ///
    /// Note, the parent of this block must be present, or it will fail.
    pub async fn debug_trace_raw_block(
        &self,
        rlp_block: Bytes,
        opts: GethDebugTracingOptions,
    ) -> Result<Vec<TraceResult>, Eth::Error> {
        let block: ProviderBlock<Eth::Provider> = Decodable::decode(&mut rlp_block.as_ref())
            .map_err(BlockError::RlpDecodeRawBlock)
            .map_err(Eth::Error::from_eth_err)?;

        let evm_env = self.eth_api().evm_config().evm_env(block.header());

        // Depending on EIP-2 we need to recover the transactions differently
        let senders =
            if self.provider().chain_spec().is_homestead_active_at_block(block.header().number()) {
                block
                    .body()
                    .transactions()
                    .iter()
                    .map(|tx| tx.recover_signer().map_err(Eth::Error::from_eth_err))
                    .collect::<Result<Vec<_>, _>>()?
                    .into_iter()
                    .collect()
            } else {
                block
                    .body()
                    .transactions()
                    .iter()
                    .map(|tx| tx.recover_signer_unchecked().map_err(Eth::Error::from_eth_err))
                    .collect::<Result<Vec<_>, _>>()?
                    .into_iter()
                    .collect()
            };

        self.trace_block(Arc::new(block.into_recovered_with_signers(senders)), evm_env, opts).await
    }

    /// Replays a block and returns the trace of each transaction.
    pub async fn debug_trace_block(
        &self,
        block_id: BlockId,
        opts: GethDebugTracingOptions,
    ) -> Result<Vec<TraceResult>, Eth::Error> {
        let block_hash = self
            .provider()
            .block_hash_for_id(block_id)
            .map_err(Eth::Error::from_eth_err)?
            .ok_or(EthApiError::HeaderNotFound(block_id))?;

        let ((evm_env, _), block) = futures::try_join!(
            self.eth_api().evm_env_at(block_hash.into()),
            self.eth_api().recovered_block(block_hash.into()),
        )?;

        let block = block.ok_or(EthApiError::HeaderNotFound(block_id))?;

        self.trace_block(block, evm_env, opts).await
    }

    /// Trace the transaction according to the provided options.
    ///
    /// Ref: <https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers>
    pub async fn debug_trace_transaction(
        &self,
        tx_hash: B256,
        opts: GethDebugTracingOptions,
    ) -> Result<GethTrace, Eth::Error> {
        let (transaction, block) = match self.eth_api().transaction_and_block(tx_hash).await? {
            None => return Err(EthApiError::TransactionNotFound.into()),
            Some(res) => res,
        };
        let (evm_env, _) = self.eth_api().evm_env_at(block.hash().into()).await?;

        // we need to get the state of the parent block because we're essentially replaying the
        // block the transaction is included in
        let state_at: BlockId = block.parent_hash().into();
        let block_hash = block.hash();

        let this = self.clone();
        self.eth_api()
            .spawn_with_state_at_block(state_at, move |state| {
                let block_txs = block.transactions_recovered();

                // configure env for the target transaction
                let tx = transaction.into_recovered();

                let mut db = CacheDB::new(StateProviderDatabase::new(state));

                this.eth_api().apply_pre_execution_changes(&block, &mut db, &evm_env)?;

                // replay all transactions prior to the targeted transaction
                let index = this.eth_api().replay_transactions_until(
                    &mut db,
                    evm_env.clone(),
                    block_txs,
                    *tx.tx_hash(),
                )?;

                let tx_env = this.eth_api().evm_config().tx_env(&tx);

                this.trace_transaction(
                    &opts,
                    evm_env,
                    tx_env,
                    &mut db,
                    Some(TransactionContext {
                        block_hash: Some(block_hash),
                        tx_index: Some(index),
                        tx_hash: Some(*tx.tx_hash()),
                    }),
                    &mut None,
                )
                .map(|(trace, _)| trace)
            })
            .await
    }

    /// The `debug_traceCall` method lets you run an `eth_call` within the context of the given
    /// block execution using the final state of parent block as the base.
    ///
    /// Differences compare to `eth_call`:
    ///  - `debug_traceCall` executes with __enabled__ basefee check, `eth_call` does not: <https://github.com/paradigmxyz/reth/issues/6240>
    pub async fn debug_trace_call(
        &self,
        call: TransactionRequest,
        block_id: Option<BlockId>,
        opts: GethDebugTracingCallOptions,
    ) -> Result<GethTrace, Eth::Error> {
        let at = block_id.unwrap_or_default();
        let GethDebugTracingCallOptions { tracing_options, state_overrides, block_overrides } =
            opts;
        let overrides = EvmOverrides::new(state_overrides, block_overrides.map(Box::new));
        let GethDebugTracingOptions { config, tracer, tracer_config, .. } = tracing_options;

        let this = self.clone();
        if let Some(tracer) = tracer {
            return match tracer {
                GethDebugTracerType::BuiltInTracer(tracer) => match tracer {
                    GethDebugBuiltInTracerType::FourByteTracer => {
                        let mut inspector = FourByteInspector::default();
                        let inspector = self
                            .eth_api()
                            .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                                this.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
                                Ok(inspector)
                            })
                            .await?;
                        Ok(FourByteFrame::from(&inspector).into())
                    }
                    GethDebugBuiltInTracerType::CallTracer => {
                        let call_config = tracer_config
                            .into_call_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = TracingInspector::new(
                            TracingInspectorConfig::from_geth_call_config(&call_config),
                        );

                        let frame = self
                            .eth_api()
                            .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                                let (res, (_, tx_env)) =
                                    this.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
                                let frame = inspector
                                    .with_transaction_gas_limit(tx_env.gas_limit())
                                    .into_geth_builder()
                                    .geth_call_traces(call_config, res.result.gas_used());
                                Ok(frame.into())
                            })
                            .await?;
                        Ok(frame)
                    }
                    GethDebugBuiltInTracerType::PreStateTracer => {
                        let prestate_config = tracer_config
                            .into_pre_state_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;
                        let mut inspector = TracingInspector::new(
                            TracingInspectorConfig::from_geth_prestate_config(&prestate_config),
                        );

                        let frame = self
                            .eth_api()
                            .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                                // wrapper is hack to get around 'higher-ranked lifetime error',
                                // see <https://github.com/rust-lang/rust/issues/100013>
                                let db = db.0;

                                let (res, (_, tx_env)) = this.eth_api().inspect(
                                    &mut *db,
                                    evm_env,
                                    tx_env,
                                    &mut inspector,
                                )?;
                                let frame = inspector
                                    .with_transaction_gas_limit(tx_env.gas_limit())
                                    .into_geth_builder()
                                    .geth_prestate_traces(&res, &prestate_config, db)
                                    .map_err(Eth::Error::from_eth_err)?;
                                Ok(frame)
                            })
                            .await?;
                        Ok(frame.into())
                    }
                    GethDebugBuiltInTracerType::NoopTracer => Ok(NoopFrame::default().into()),
                    GethDebugBuiltInTracerType::MuxTracer => {
                        let mux_config = tracer_config
                            .into_mux_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = MuxInspector::try_from_config(mux_config)
                            .map_err(Eth::Error::from_eth_err)?;

                        let frame = self
                            .inner
                            .eth_api
                            .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                                // wrapper is hack to get around 'higher-ranked lifetime error', see
                                // <https://github.com/rust-lang/rust/issues/100013>
                                let db = db.0;

                                let tx_info = TransactionInfo {
                                    block_number: Some(evm_env.block_env.number),
                                    base_fee: Some(evm_env.block_env.basefee),
                                    hash: None,
                                    block_hash: None,
                                    index: None,
                                };

                                let (res, _) = this.eth_api().inspect(
                                    &mut *db,
                                    evm_env,
                                    tx_env,
                                    &mut inspector,
                                )?;
                                let frame = inspector
                                    .try_into_mux_frame(&res, db, tx_info)
                                    .map_err(Eth::Error::from_eth_err)?;
                                Ok(frame.into())
                            })
                            .await?;
                        Ok(frame)
                    }
                    GethDebugBuiltInTracerType::FlatCallTracer => {
                        let flat_call_config = tracer_config
                            .into_flat_call_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = TracingInspector::new(
                            TracingInspectorConfig::from_flat_call_config(&flat_call_config),
                        );

                        let frame: FlatCallFrame = self
                            .inner
                            .eth_api
                            .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                                let (_res, (_, tx_env)) =
                                    this.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
                                let tx_info = TransactionInfo::default();
                                let frame: FlatCallFrame = inspector
                                    .with_transaction_gas_limit(tx_env.gas_limit())
                                    .into_parity_builder()
                                    .into_localized_transaction_traces(tx_info);
                                Ok(frame)
                            })
                            .await?;

                        Ok(frame.into())
                    }
                },
                #[cfg(not(feature = "js-tracer"))]
                GethDebugTracerType::JsTracer(_) => {
                    Err(EthApiError::Unsupported("JS Tracer is not enabled").into())
                }
                #[cfg(feature = "js-tracer")]
                GethDebugTracerType::JsTracer(code) => {
                    let config = tracer_config.into_json();

                    let (_, at) = self.eth_api().evm_env_at(at).await?;

                    let res = self
                        .eth_api()
                        .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                            // wrapper is hack to get around 'higher-ranked lifetime error', see
                            // <https://github.com/rust-lang/rust/issues/100013>
                            let db = db.0;

                            let mut inspector =
                                revm_inspectors::tracing::js::JsInspector::new(code, config)
                                    .map_err(Eth::Error::from_eth_err)?;
                            let (res, _) = this.eth_api().inspect(
                                &mut *db,
                                evm_env.clone(),
                                tx_env.clone(),
                                &mut inspector,
                            )?;
                            inspector
                                .json_result(res, &tx_env, &evm_env.block_env, db)
                                .map_err(Eth::Error::from_eth_err)
                        })
                        .await?;

                    Ok(GethTrace::JS(res))
                }
            }
        }

        // default structlog tracer
        let inspector_config = TracingInspectorConfig::from_geth_config(&config);

        let mut inspector = TracingInspector::new(inspector_config);

        let (res, tx_gas_limit, inspector) = self
            .eth_api()
            .spawn_with_call_at(call, at, overrides, move |db, evm_env, tx_env| {
                let (res, (_, tx_env)) =
                    this.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
                Ok((res, tx_env.gas_limit(), inspector))
            })
            .await?;
        let gas_used = res.result.gas_used();
        let return_value = res.result.into_output().unwrap_or_default();
        let frame = inspector
            .with_transaction_gas_limit(tx_gas_limit)
            .into_geth_builder()
            .geth_traces(gas_used, return_value, config);

        Ok(frame.into())
    }

    /// The `debug_traceCallMany` method lets you run an `eth_callMany` within the context of the
    /// given block execution using the first n transactions in the given block as base.
    /// Each following bundle increments block number by 1 and block timestamp by 12 seconds
    pub async fn debug_trace_call_many(
        &self,
        bundles: Vec<Bundle>,
        state_context: Option<StateContext>,
        opts: Option<GethDebugTracingCallOptions>,
    ) -> Result<Vec<Vec<GethTrace>>, Eth::Error> {
        if bundles.is_empty() {
            return Err(EthApiError::InvalidParams(String::from("bundles are empty.")).into())
        }

        let StateContext { transaction_index, block_number } = state_context.unwrap_or_default();
        let transaction_index = transaction_index.unwrap_or_default();

        let target_block = block_number.unwrap_or_default();
        let ((mut evm_env, _), block) = futures::try_join!(
            self.eth_api().evm_env_at(target_block),
            self.eth_api().recovered_block(target_block),
        )?;

        let opts = opts.unwrap_or_default();
        let block = block.ok_or(EthApiError::HeaderNotFound(target_block))?;
        let GethDebugTracingCallOptions { tracing_options, mut state_overrides, .. } = opts;

        // we're essentially replaying the transactions in the block here, hence we need the state
        // that points to the beginning of the block, which is the state at the parent block
        let mut at = block.parent_hash();
        let mut replay_block_txs = true;

        // if a transaction index is provided, we need to replay the transactions until the index
        let num_txs =
            transaction_index.index().unwrap_or_else(|| block.body().transactions().len());
        // but if all transactions are to be replayed, we can use the state at the block itself
        // this works with the exception of the PENDING block, because its state might not exist if
        // built locally
        if !target_block.is_pending() && num_txs == block.body().transactions().len() {
            at = block.hash();
            replay_block_txs = false;
        }

        let this = self.clone();

        self.eth_api()
            .spawn_with_state_at_block(at.into(), move |state| {
                // the outer vec for the bundles
                let mut all_bundles = Vec::with_capacity(bundles.len());
                let mut db = CacheDB::new(StateProviderDatabase::new(state));

                if replay_block_txs {
                    // only need to replay the transactions in the block if not all transactions are
                    // to be replayed
                    let transactions = block.transactions_recovered().take(num_txs);

                    // Execute all transactions until index
                    for tx in transactions {
                        let tx_env = this.eth_api().evm_config().tx_env(tx);
                        let res = this.eth_api().transact(&mut db, evm_env.clone(), tx_env)?;
                        db.commit(res.state);
                    }
                }

                // Trace all bundles
                let mut bundles = bundles.into_iter().peekable();
                while let Some(bundle) = bundles.next() {
                    let mut results = Vec::with_capacity(bundle.transactions.len());
                    let Bundle { transactions, block_override } = bundle;

                    let block_overrides = block_override.map(Box::new);
                    let mut inspector = None;

                    let mut transactions = transactions.into_iter().peekable();
                    while let Some(tx) = transactions.next() {
                        // apply state overrides only once, before the first transaction
                        let state_overrides = state_overrides.take();
                        let overrides = EvmOverrides::new(state_overrides, block_overrides.clone());

                        let (evm_env, tx_env) = this.eth_api().prepare_call_env(
                            evm_env.clone(),
                            tx,
                            &mut db,
                            overrides,
                        )?;

                        let (trace, state) = this.trace_transaction(
                            &tracing_options,
                            evm_env,
                            tx_env,
                            &mut db,
                            None,
                            &mut inspector,
                        )?;

                        inspector = inspector.map(|insp| insp.fused());

                        // If there is more transactions, commit the database
                        // If there is no transactions, but more bundles, commit to the database too
                        if transactions.peek().is_some() || bundles.peek().is_some() {
                            db.commit(state);
                        }
                        results.push(trace);
                    }
                    // Increment block_env number and timestamp for the next bundle
                    evm_env.block_env.number += 1;
                    evm_env.block_env.timestamp += 12;

                    all_bundles.push(results);
                }
                Ok(all_bundles)
            })
            .await
    }

    /// Generates an execution witness for the given block hash. see
    /// [`Self::debug_execution_witness`] for more info.
    pub async fn debug_execution_witness_by_block_hash(
        &self,
        hash: B256,
    ) -> Result<ExecutionWitness, Eth::Error> {
        let this = self.clone();
        let block = this
            .eth_api()
            .recovered_block(hash.into())
            .await?
            .ok_or(EthApiError::HeaderNotFound(hash.into()))?;

        self.debug_execution_witness_for_block(block).await
    }

    /// The `debug_executionWitness` method allows for re-execution of a block with the purpose of
    /// generating an execution witness. The witness comprises of a map of all hashed trie nodes to
    /// their preimages that were required during the execution of the block, including during state
    /// root recomputation.
    pub async fn debug_execution_witness(
        &self,
        block_id: BlockNumberOrTag,
    ) -> Result<ExecutionWitness, Eth::Error> {
        let this = self.clone();
        let block = this
            .eth_api()
            .recovered_block(block_id.into())
            .await?
            .ok_or(EthApiError::HeaderNotFound(block_id.into()))?;

        self.debug_execution_witness_for_block(block).await
    }

    /// Generates an execution witness, using the given recovered block.
    pub async fn debug_execution_witness_for_block(
        &self,
        block: Arc<RecoveredBlock<ProviderBlock<Eth::Provider>>>,
    ) -> Result<ExecutionWitness, Eth::Error> {
        let this = self.clone();
        let block_number = block.header().number();

        let (mut exec_witness, lowest_block_number) = self
            .eth_api()
            .spawn_with_state_at_block(block.parent_hash().into(), move |state_provider| {
                let db = StateProviderDatabase::new(&state_provider);
                let block_executor = this.inner.evm_config.batch_executor(db);

                let mut witness_record = ExecutionWitnessRecord::default();

                let _ = block_executor
                    .execute_with_state_closure(&(*block).clone(), |statedb: &State<_>| {
                        witness_record.record_executed_state(statedb);
                    })
                    .map_err(|err| EthApiError::Internal(err.into()))?;

                let ExecutionWitnessRecord { hashed_state, codes, keys, lowest_block_number } =
                    witness_record;

                let state = state_provider
                    .witness(Default::default(), hashed_state)
                    .map_err(EthApiError::from)?;
                Ok((
                    ExecutionWitness { state, codes, keys, ..Default::default() },
                    lowest_block_number,
                ))
            })
            .await?;

        let smallest = match lowest_block_number {
            Some(smallest) => smallest,
            None => {
                // Return only the parent header, if there were no calls to the
                // BLOCKHASH opcode.
                block_number.saturating_sub(1)
            }
        };

        let range = smallest..block_number;
        // TODO: Check if headers_range errors when one of the headers in the range is missing
        exec_witness.headers = self
            .provider()
            .headers_range(range)
            .map_err(EthApiError::from)?
            .into_iter()
            .map(|header| {
                let mut serialized_header = Vec::new();
                header.encode(&mut serialized_header);
                serialized_header.into()
            })
            .collect();

        Ok(exec_witness)
    }

    /// Returns the code associated with a given hash at the specified block ID. If no code is
    /// found, it returns None. If no block ID is provided, it defaults to the latest block.
    pub async fn debug_code_by_hash(
        &self,
        hash: B256,
        block_id: Option<BlockId>,
    ) -> Result<Option<Bytes>, Eth::Error> {
        Ok(self
            .provider()
            .state_by_block_id(block_id.unwrap_or_default())
            .map_err(Eth::Error::from_eth_err)?
            .bytecode_by_hash(&hash)
            .map_err(Eth::Error::from_eth_err)?
            .map(|b| b.original_bytes()))
    }

    /// Executes the configured transaction with the environment on the given database.
    ///
    /// It optionally takes fused inspector ([`TracingInspector::fused`]) to avoid re-creating the
    /// inspector for each transaction. This is useful when tracing multiple transactions in a
    /// block. This is only useful for block tracing which uses the same tracer for all transactions
    /// in the block.
    ///
    /// Caution: If the inspector is provided then `opts.tracer_config` is ignored.
    ///
    /// Returns the trace frame and the state that got updated after executing the transaction.
    ///
    /// Note: this does not apply any state overrides if they're configured in the `opts`.
    ///
    /// Caution: this is blocking and should be performed on a blocking task.
    fn trace_transaction(
        &self,
        opts: &GethDebugTracingOptions,
        evm_env: EvmEnvFor<Eth::Evm>,
        tx_env: TxEnvFor<Eth::Evm>,
        db: &mut StateCacheDb<'_>,
        transaction_context: Option<TransactionContext>,
        fused_inspector: &mut Option<TracingInspector>,
    ) -> Result<(GethTrace, EvmState), Eth::Error> {
        let GethDebugTracingOptions { config, tracer, tracer_config, .. } = opts;

        let tx_info = TransactionInfo {
            hash: transaction_context.as_ref().map(|c| c.tx_hash).unwrap_or_default(),
            index: transaction_context
                .as_ref()
                .map(|c| c.tx_index.map(|i| i as u64))
                .unwrap_or_default(),
            block_hash: transaction_context.as_ref().map(|c| c.block_hash).unwrap_or_default(),
            block_number: Some(evm_env.block_env.number),
            base_fee: Some(evm_env.block_env.basefee),
        };

        if let Some(tracer) = tracer {
            return match tracer {
                GethDebugTracerType::BuiltInTracer(tracer) => match tracer {
                    GethDebugBuiltInTracerType::FourByteTracer => {
                        let mut inspector = FourByteInspector::default();
                        let (res, _) =
                            self.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
                        return Ok((FourByteFrame::from(&inspector).into(), res.state))
                    }
                    GethDebugBuiltInTracerType::CallTracer => {
                        let call_config = tracer_config
                            .clone()
                            .into_call_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = fused_inspector.get_or_insert_with(|| {
                            TracingInspector::new(TracingInspectorConfig::from_geth_call_config(
                                &call_config,
                            ))
                        });

                        let (res, (_, tx_env)) =
                            self.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;

                        inspector.set_transaction_gas_limit(tx_env.gas_limit());

                        let frame = inspector
                            .geth_builder()
                            .geth_call_traces(call_config, res.result.gas_used());

                        return Ok((frame.into(), res.state))
                    }
                    GethDebugBuiltInTracerType::PreStateTracer => {
                        let prestate_config = tracer_config
                            .clone()
                            .into_pre_state_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = fused_inspector.get_or_insert_with(|| {
                            TracingInspector::new(
                                TracingInspectorConfig::from_geth_prestate_config(&prestate_config),
                            )
                        });
                        let (res, (_, tx_env)) =
                            self.eth_api().inspect(&mut *db, evm_env, tx_env, &mut inspector)?;

                        inspector.set_transaction_gas_limit(tx_env.gas_limit());
                        let frame = inspector
                            .geth_builder()
                            .geth_prestate_traces(&res, &prestate_config, db)
                            .map_err(Eth::Error::from_eth_err)?;

                        return Ok((frame.into(), res.state))
                    }
                    GethDebugBuiltInTracerType::NoopTracer => {
                        Ok((NoopFrame::default().into(), Default::default()))
                    }
                    GethDebugBuiltInTracerType::MuxTracer => {
                        let mux_config = tracer_config
                            .clone()
                            .into_mux_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = MuxInspector::try_from_config(mux_config)
                            .map_err(Eth::Error::from_eth_err)?;

                        let (res, _) =
                            self.eth_api().inspect(&mut *db, evm_env, tx_env, &mut inspector)?;
                        let frame = inspector
                            .try_into_mux_frame(&res, db, tx_info)
                            .map_err(Eth::Error::from_eth_err)?;
                        return Ok((frame.into(), res.state))
                    }
                    GethDebugBuiltInTracerType::FlatCallTracer => {
                        let flat_call_config = tracer_config
                            .clone()
                            .into_flat_call_config()
                            .map_err(|_| EthApiError::InvalidTracerConfig)?;

                        let mut inspector = TracingInspector::new(
                            TracingInspectorConfig::from_flat_call_config(&flat_call_config),
                        );

                        let (res, (_, tx_env)) =
                            self.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
                        let frame: FlatCallFrame = inspector
                            .with_transaction_gas_limit(tx_env.gas_limit())
                            .into_parity_builder()
                            .into_localized_transaction_traces(tx_info);

                        return Ok((frame.into(), res.state));
                    }
                },
                #[cfg(not(feature = "js-tracer"))]
                GethDebugTracerType::JsTracer(_) => {
                    Err(EthApiError::Unsupported("JS Tracer is not enabled").into())
                }
                #[cfg(feature = "js-tracer")]
                GethDebugTracerType::JsTracer(code) => {
                    let config = tracer_config.clone().into_json();
                    let mut inspector =
                        revm_inspectors::tracing::js::JsInspector::with_transaction_context(
                            code.clone(),
                            config,
                            transaction_context.unwrap_or_default(),
                        )
                        .map_err(Eth::Error::from_eth_err)?;
                    let (res, (evm_env, tx_env)) =
                        self.eth_api().inspect(&mut *db, evm_env, tx_env, &mut inspector)?;

                    let state = res.state.clone();
                    let result = inspector
                        .json_result(res, &tx_env, &evm_env.block_env, db)
                        .map_err(Eth::Error::from_eth_err)?;
                    Ok((GethTrace::JS(result), state))
                }
            }
        }

        // default structlog tracer
        let mut inspector = fused_inspector.get_or_insert_with(|| {
            let inspector_config = TracingInspectorConfig::from_geth_config(config);
            TracingInspector::new(inspector_config)
        });
        let (res, (_, tx_env)) = self.eth_api().inspect(db, evm_env, tx_env, &mut inspector)?;
        let gas_used = res.result.gas_used();
        let return_value = res.result.into_output().unwrap_or_default();
        inspector.set_transaction_gas_limit(tx_env.gas_limit());
        let frame = inspector.geth_builder().geth_traces(gas_used, return_value, *config);

        Ok((frame.into(), res.state))
    }

    /// Returns the state root of the `HashedPostState` on top of the state for the given block with
    /// trie updates.
    async fn debug_state_root_with_updates(
        &self,
        hashed_state: HashedPostState,
        block_id: Option<BlockId>,
    ) -> Result<(B256, TrieUpdates), Eth::Error> {
        self.inner
            .eth_api
            .spawn_blocking_io(move |this| {
                let state = this
                    .provider()
                    .state_by_block_id(block_id.unwrap_or_default())
                    .map_err(Eth::Error::from_eth_err)?;
                state.state_root_with_updates(hashed_state).map_err(Eth::Error::from_eth_err)
            })
            .await
    }
}

#[async_trait]
impl<Eth, Evm> DebugApiServer for DebugApi<Eth, Evm>
where
    Eth: EthApiTypes + EthTransactions + TraceExt + 'static,
    Evm: ConfigureEvm<Primitives: NodePrimitives<Block = ProviderBlock<Eth::Provider>>> + 'static,
{
    /// Handler for `debug_getRawHeader`
    async fn raw_header(&self, block_id: BlockId) -> RpcResult<Bytes> {
        let header = match block_id {
            BlockId::Hash(hash) => self.provider().header(&hash.into()).to_rpc_result()?,
            BlockId::Number(number_or_tag) => {
                let number = self
                    .provider()
                    .convert_block_number(number_or_tag)
                    .to_rpc_result()?
                    .ok_or_else(|| {
                    internal_rpc_err("Pending block not supported".to_string())
                })?;
                self.provider().header_by_number(number).to_rpc_result()?
            }
        };

        let mut res = Vec::new();
        if let Some(header) = header {
            header.encode(&mut res);
        }

        Ok(res.into())
    }

    /// Handler for `debug_getRawBlock`
    async fn raw_block(&self, block_id: BlockId) -> RpcResult<Bytes> {
        let block = self
            .provider()
            .block_by_id(block_id)
            .to_rpc_result()?
            .ok_or(EthApiError::HeaderNotFound(block_id))?;
        let mut res = Vec::new();
        block.encode(&mut res);
        Ok(res.into())
    }

    /// Handler for `debug_getRawTransaction`
    ///
    /// If this is a pooled EIP-4844 transaction, the blob sidecar is included.
    ///
    /// Returns the bytes of the transaction for the given hash.
    async fn raw_transaction(&self, hash: B256) -> RpcResult<Option<Bytes>> {
        self.eth_api().raw_transaction_by_hash(hash).await.map_err(Into::into)
    }

    /// Handler for `debug_getRawTransactions`
    /// Returns the bytes of the transaction for the given hash.
    async fn raw_transactions(&self, block_id: BlockId) -> RpcResult<Vec<Bytes>> {
        let block = self
            .provider()
            .block_with_senders_by_id(block_id, TransactionVariant::NoHash)
            .to_rpc_result()?
            .unwrap_or_default();
        Ok(block.into_transactions_recovered().map(|tx| tx.encoded_2718().into()).collect())
    }

    /// Handler for `debug_getRawReceipts`
    async fn raw_receipts(&self, block_id: BlockId) -> RpcResult<Vec<Bytes>> {
        Ok(self
            .provider()
            .receipts_by_block_id(block_id)
            .to_rpc_result()?
            .unwrap_or_default()
            .into_iter()
            .map(|receipt| ReceiptWithBloom::from(receipt).encoded_2718().into())
            .collect())
    }

    /// Handler for `debug_getBadBlocks`
    async fn bad_blocks(&self) -> RpcResult<Vec<RpcBlock>> {
        Ok(vec![])
    }

    /// Handler for `debug_traceChain`
    async fn debug_trace_chain(
        &self,
        _start_exclusive: BlockNumberOrTag,
        _end_inclusive: BlockNumberOrTag,
    ) -> RpcResult<Vec<BlockTraceResult>> {
        Err(internal_rpc_err("unimplemented"))
    }

    /// Handler for `debug_traceBlock`
    async fn debug_trace_block(
        &self,
        rlp_block: Bytes,
        opts: Option<GethDebugTracingOptions>,
    ) -> RpcResult<Vec<TraceResult>> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_trace_raw_block(self, rlp_block, opts.unwrap_or_default())
            .await
            .map_err(Into::into)
    }

    /// Handler for `debug_traceBlockByHash`
    async fn debug_trace_block_by_hash(
        &self,
        block: B256,
        opts: Option<GethDebugTracingOptions>,
    ) -> RpcResult<Vec<TraceResult>> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_trace_block(self, block.into(), opts.unwrap_or_default())
            .await
            .map_err(Into::into)
    }

    /// Handler for `debug_traceBlockByNumber`
    async fn debug_trace_block_by_number(
        &self,
        block: BlockNumberOrTag,
        opts: Option<GethDebugTracingOptions>,
    ) -> RpcResult<Vec<TraceResult>> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_trace_block(self, block.into(), opts.unwrap_or_default())
            .await
            .map_err(Into::into)
    }

    /// Handler for `debug_traceTransaction`
    async fn debug_trace_transaction(
        &self,
        tx_hash: B256,
        opts: Option<GethDebugTracingOptions>,
    ) -> RpcResult<GethTrace> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_trace_transaction(self, tx_hash, opts.unwrap_or_default())
            .await
            .map_err(Into::into)
    }

    /// Handler for `debug_traceCall`
    async fn debug_trace_call(
        &self,
        request: TransactionRequest,
        block_id: Option<BlockId>,
        opts: Option<GethDebugTracingCallOptions>,
    ) -> RpcResult<GethTrace> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_trace_call(self, request, block_id, opts.unwrap_or_default())
            .await
            .map_err(Into::into)
    }

    async fn debug_trace_call_many(
        &self,
        bundles: Vec<Bundle>,
        state_context: Option<StateContext>,
        opts: Option<GethDebugTracingCallOptions>,
    ) -> RpcResult<Vec<Vec<GethTrace>>> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_trace_call_many(self, bundles, state_context, opts).await.map_err(Into::into)
    }

    /// Handler for `debug_executionWitness`
    async fn debug_execution_witness(
        &self,
        block: BlockNumberOrTag,
    ) -> RpcResult<ExecutionWitness> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_execution_witness(self, block).await.map_err(Into::into)
    }

    /// Handler for `debug_executionWitnessByBlockHash`
    async fn debug_execution_witness_by_block_hash(
        &self,
        hash: B256,
    ) -> RpcResult<ExecutionWitness> {
        let _permit = self.acquire_trace_permit().await;
        Self::debug_execution_witness_by_block_hash(self, hash).await.map_err(Into::into)
    }

    async fn debug_backtrace_at(&self, _location: &str) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_account_range(
        &self,
        _block_number: BlockNumberOrTag,
        _start: Bytes,
        _max_results: u64,
        _nocode: bool,
        _nostorage: bool,
        _incompletes: bool,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_block_profile(&self, _file: String, _seconds: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_chaindb_compact(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_chain_config(&self) -> RpcResult<ChainConfig> {
        Ok(self.provider().chain_spec().genesis().config.clone())
    }

    async fn debug_chaindb_property(&self, _property: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_code_by_hash(
        &self,
        hash: B256,
        block_id: Option<BlockId>,
    ) -> RpcResult<Option<Bytes>> {
        Self::debug_code_by_hash(self, hash, block_id).await.map_err(Into::into)
    }

    async fn debug_cpu_profile(&self, _file: String, _seconds: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_db_ancient(&self, _kind: String, _number: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_db_ancients(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_db_get(&self, _key: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_dump_block(&self, _number: BlockId) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_free_os_memory(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_freeze_client(&self, _node: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_gc_stats(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_get_accessible_state(
        &self,
        _from: BlockNumberOrTag,
        _to: BlockNumberOrTag,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_get_modified_accounts_by_hash(
        &self,
        _start_hash: B256,
        _end_hash: B256,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_get_modified_accounts_by_number(
        &self,
        _start_number: u64,
        _end_number: u64,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_go_trace(&self, _file: String, _seconds: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_intermediate_roots(
        &self,
        _block_hash: B256,
        _opts: Option<GethDebugTracingCallOptions>,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_mem_stats(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_mutex_profile(&self, _file: String, _nsec: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_preimage(&self, _hash: B256) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_print_block(&self, _number: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_seed_hash(&self, _number: u64) -> RpcResult<B256> {
        Ok(Default::default())
    }

    async fn debug_set_block_profile_rate(&self, _rate: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_set_gc_percent(&self, _v: i32) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_set_head(&self, _number: u64) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_set_mutex_profile_fraction(&self, _rate: i32) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_set_trie_flush_interval(&self, _interval: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_stacks(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_standard_trace_bad_block_to_file(
        &self,
        _block: BlockNumberOrTag,
        _opts: Option<GethDebugTracingCallOptions>,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_standard_trace_block_to_file(
        &self,
        _block: BlockNumberOrTag,
        _opts: Option<GethDebugTracingCallOptions>,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_start_cpu_profile(&self, _file: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_start_go_trace(&self, _file: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_state_root_with_updates(
        &self,
        hashed_state: HashedPostState,
        block_id: Option<BlockId>,
    ) -> RpcResult<(B256, TrieUpdates)> {
        Self::debug_state_root_with_updates(self, hashed_state, block_id).await.map_err(Into::into)
    }

    async fn debug_stop_cpu_profile(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_stop_go_trace(&self) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_storage_range_at(
        &self,
        _block_hash: B256,
        _tx_idx: usize,
        _contract_address: Address,
        _key_start: B256,
        _max_result: u64,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_trace_bad_block(
        &self,
        _block_hash: B256,
        _opts: Option<GethDebugTracingCallOptions>,
    ) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_verbosity(&self, _level: usize) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_vmodule(&self, _pattern: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_write_block_profile(&self, _file: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_write_mem_profile(&self, _file: String) -> RpcResult<()> {
        Ok(())
    }

    async fn debug_write_mutex_profile(&self, _file: String) -> RpcResult<()> {
        Ok(())
    }
}

impl<Eth, Evm> std::fmt::Debug for DebugApi<Eth, Evm> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("DebugApi").finish_non_exhaustive()
    }
}

impl<Eth, Evm> Clone for DebugApi<Eth, Evm> {
    fn clone(&self) -> Self {
        Self { inner: Arc::clone(&self.inner) }
    }
}

struct DebugApiInner<Eth, Evm> {
    /// The implementation of `eth` API
    eth_api: Eth,
    // restrict the number of concurrent calls to blocking calls
    blocking_task_guard: BlockingTaskGuard,
    /// block executor for debug & trace apis
    evm_config: Evm,
}
```

https://github.com/paradigmxyz/revm-inspectors/blob/c4d7576cb37f0d9b8aab39803cda0c898750e19f/src/tracing/mod.rs
```rust
use crate::{
    opcode::immediate_size,
    tracing::{
        arena::PushTraceKind,
        types::{
            CallKind, CallTraceNode, RecordedMemory, StorageChange, StorageChangeReason,
            TraceMemberOrder,
        },
        utils::gas_used,
    },
};
use alloc::vec::Vec;
use core::borrow::Borrow;
use revm::{
    bytecode::opcode::{self, OpCode},
    context::{JournalTr, LocalContextTr},
    context_interface::ContextTr,
    inspector::JournalExt,
    interpreter::{
        interpreter_types::{Immediates, InputsTr, Jumps, LoopControl, ReturnData, RuntimeFlag},
        CallInput, CallInputs, CallOutcome, CallScheme, CreateInputs, CreateOutcome, Interpreter,
        InterpreterResult,
    },
    primitives::{hardfork::SpecId, Address, Bytes, Log, B256, U256},
    Inspector, JournalEntry,
};

mod arena;
pub use arena::CallTraceArena;

mod builder;
pub use builder::{
    geth::{self, GethTraceBuilder},
    parity::{self, ParityTraceBuilder},
};

mod config;
pub use config::{OpcodeFilter, StackSnapshotType, TracingInspectorConfig};

mod fourbyte;
pub use fourbyte::FourByteInspector;

mod opcount;
pub use opcount::OpcodeCountInspector;

pub mod types;
use types::{CallLog, CallTrace, CallTraceStep};

mod utils;

#[cfg(feature = "std")]
mod writer;
#[cfg(feature = "std")]
pub use writer::{TraceWriter, TraceWriterConfig};

#[cfg(feature = "js-tracer")]
pub mod js;

mod mux;
pub use mux::{Error as MuxError, MuxInspector};

/// An inspector that collects call traces.
///
/// This [Inspector] can be hooked into revm's EVM which then calls the inspector
/// functions, such as [Inspector::call] or [Inspector::call_end].
///
/// The [TracingInspector] keeps track of everything by:
///   1. start tracking steps/calls on [Inspector::step] and [Inspector::call]
///   2. complete steps/calls on [Inspector::step_end] and [Inspector::call_end]
#[derive(Clone, Debug, Default)]
pub struct TracingInspector {
    /// Configures what and how the inspector records traces.
    config: TracingInspectorConfig,
    /// Records all call traces
    traces: CallTraceArena,
    /// Tracks active calls
    trace_stack: Vec<usize>,
    /// Tracks active steps
    step_stack: Vec<StackStep>,
    /// Tracks the return value of the last call
    last_call_return_data: Option<Bytes>,
    /// Tracks the journal len in the step, used in step_end to check if the journal has changed
    last_journal_len: usize,
    /// The spec id of the EVM.
    ///
    /// This is filled during execution.
    spec_id: Option<SpecId>,
}

// === impl TracingInspector ===

impl TracingInspector {
    /// Returns a new instance for the given config
    pub fn new(config: TracingInspectorConfig) -> Self {
        Self { config, ..Default::default() }
    }

    /// Resets the inspector to its initial state of [Self::new].
    /// This makes the inspector ready to be used again.
    ///
    /// Note that this method has no effect on the allocated capacity of the vector.
    #[inline]
    pub fn fuse(&mut self) {
        let Self {
            traces,
            trace_stack,
            step_stack,
            last_call_return_data,
            last_journal_len,
            spec_id,
            // kept
            config: _,
        } = self;
        traces.clear();
        trace_stack.clear();
        step_stack.clear();
        last_call_return_data.take();
        spec_id.take();
        *last_journal_len = 0;
    }

    /// Resets the inspector to it's initial state of [Self::new].
    #[inline]
    pub fn fused(mut self) -> Self {
        self.fuse();
        self
    }

    /// Returns the config of the inspector.
    pub const fn config(&self) -> &TracingInspectorConfig {
        &self.config
    }

    /// Returns a mutable reference to the config of the inspector.
    pub fn config_mut(&mut self) -> &mut TracingInspectorConfig {
        &mut self.config
    }

    /// Updates the config of the inspector.
    pub fn update_config(
        &mut self,
        f: impl FnOnce(TracingInspectorConfig) -> TracingInspectorConfig,
    ) {
        self.config = f(self.config);
    }

    /// Gets a reference to the recorded call traces.
    pub const fn traces(&self) -> &CallTraceArena {
        &self.traces
    }

    #[doc(hidden)]
    #[deprecated = "use `traces` instead"]
    pub const fn get_traces(&self) -> &CallTraceArena {
        &self.traces
    }

    /// Gets a mutable reference to the recorded call traces.
    pub fn traces_mut(&mut self) -> &mut CallTraceArena {
        &mut self.traces
    }

    #[doc(hidden)]
    #[deprecated = "use `traces_mut` instead"]
    pub fn get_traces_mut(&mut self) -> &mut CallTraceArena {
        &mut self.traces
    }

    /// Consumes the inspector and returns the recorded call traces.
    pub fn into_traces(self) -> CallTraceArena {
        self.traces
    }

    /// Manually set the gas used of the root trace.
    ///
    /// This is useful if the root trace's gasUsed should mirror the actual gas used by the
    /// transaction.
    ///
    /// This allows setting it manually by consuming the execution result's gas for example.
    #[inline]
    pub fn set_transaction_gas_used(&mut self, gas_used: u64) {
        if let Some(node) = self.traces.arena.first_mut() {
            node.trace.gas_used = gas_used;
        }
    }

    /// Manually set the gas limit of the debug root trace.
    ///
    /// This is useful if the debug root trace's gasUsed should mirror the actual gas used by the
    /// transaction.
    ///
    /// This allows setting it manually by consuming the execution result's gas for example.
    #[inline]
    pub fn set_transaction_gas_limit(&mut self, gas_limit: u64) {
        if let Some(node) = self.traces.arena.first_mut() {
            node.trace.gas_limit = gas_limit;
        }
    }

    /// Convenience function for [ParityTraceBuilder::set_transaction_gas_used] that consumes the
    /// type.
    #[inline]
    pub fn with_transaction_gas_used(mut self, gas_used: u64) -> Self {
        self.set_transaction_gas_used(gas_used);
        self
    }

    /// Work with [TracingInspector::set_transaction_gas_limit] function
    #[inline]
    pub fn with_transaction_gas_limit(mut self, gas_limit: u64) -> Self {
        self.set_transaction_gas_limit(gas_limit);
        self
    }

    /// Consumes the Inspector and returns a [ParityTraceBuilder].
    #[inline]
    pub fn into_parity_builder(self) -> ParityTraceBuilder {
        ParityTraceBuilder::new(self.traces.arena, self.spec_id, self.config)
    }

    /// Consumes the Inspector and returns a [GethTraceBuilder].
    #[inline]
    pub fn into_geth_builder(self) -> GethTraceBuilder<'static> {
        GethTraceBuilder::new(self.traces.arena)
    }

    /// Returns the  [GethTraceBuilder] for the recorded traces without consuming the type.
    ///
    /// This can be useful for multiple transaction tracing (block) where this inspector can be
    /// reused for each transaction but caller must ensure that the traces are cleared before
    /// starting a new transaction: [`Self::fuse`]
    #[inline]
    pub fn geth_builder(&self) -> GethTraceBuilder<'_> {
        GethTraceBuilder::new_borrowed(&self.traces.arena)
    }

    /// Returns true if we're no longer in the context of the root call.
    fn is_deep(&self) -> bool {
        // the root call will always be the first entry in the trace stack
        !self.trace_stack.is_empty()
    }

    /// Returns true if this a call to a precompile contract.
    ///
    /// Returns true if the `to` address is a precompile contract and the value is zero.
    #[inline]
    fn is_precompile_call<CTX: ContextTr<Journal: JournalExt>>(
        &self,
        context: &CTX,
        to: &Address,
        value: &U256,
    ) -> bool {
        if context.journal_ref().precompile_addresses().contains(to) {
            // only if this is _not_ the root call
            return self.is_deep() && value.is_zero();
        }
        false
    }

    /// Returns the currently active call trace.
    ///
    /// This will be the last call trace pushed to the stack: the call we entered most recently.
    #[track_caller]
    #[inline]
    fn active_trace(&self) -> Option<&CallTraceNode> {
        self.trace_stack.last().map(|idx| &self.traces.arena[*idx])
    }

    /// Returns the last trace [CallTrace] index from the stack.
    ///
    /// This will be the currently active call trace.
    ///
    /// # Panics
    ///
    /// If no [CallTrace] was pushed
    #[track_caller]
    #[inline]
    fn last_trace_idx(&self) -> usize {
        self.trace_stack.last().copied().expect("can't start step without starting a trace first")
    }

    /// Returns a mutable reference to the last trace [CallTrace] from the stack.
    #[track_caller]
    fn last_trace(&mut self) -> &mut CallTraceNode {
        let idx = self.last_trace_idx();
        &mut self.traces.arena[idx]
    }

    /// _Removes_ the last trace [CallTrace] index from the stack.
    ///
    /// # Panics
    ///
    /// If no [CallTrace] was pushed
    #[track_caller]
    #[inline]
    fn pop_trace_idx(&mut self) -> usize {
        self.trace_stack.pop().expect("more traces were filled than started")
    }

    /// Starts tracking a new trace.
    ///
    /// Invoked on [Inspector::call].
    #[allow(clippy::too_many_arguments)]
    fn start_trace_on_call<CTX: ContextTr>(
        &mut self,
        context: &mut CTX,
        address: Address,
        input_data: Bytes,
        value: U256,
        kind: CallKind,
        caller: Address,
        gas_limit: u64,
        maybe_precompile: Option<bool>,
    ) {
        // This will only be true if the inspector is configured to exclude precompiles and the call
        // is to a precompile
        let push_kind = if maybe_precompile.unwrap_or(false) {
            // We don't want to track precompiles
            PushTraceKind::PushOnly
        } else {
            PushTraceKind::PushAndAttachToParent
        };

        self.trace_stack.push(self.traces.push_trace(
            0,
            push_kind,
            CallTrace {
                depth: context.journal().depth(),
                address,
                kind,
                data: input_data,
                value,
                status: None,
                caller,
                maybe_precompile,
                gas_limit,
                ..Default::default()
            },
        ));
    }

    /// Fills the current trace with the outcome of a call.
    ///
    /// Invoked on [Inspector::call_end].
    ///
    /// # Panics
    ///
    /// This expects an existing trace [Self::start_trace_on_call]
    fn fill_trace_on_call_end(
        &mut self,
        result: &InterpreterResult,
        created_address: Option<Address>,
    ) {
        let InterpreterResult { result, ref output, ref gas } = *result;

        let trace_idx = self.pop_trace_idx();
        let trace = &mut self.traces.arena[trace_idx].trace;

        trace.gas_used = gas.spent();

        trace.status = Some(result);
        trace.success = trace.status.is_some_and(|status| status.is_ok());
        trace.output = output.clone();

        self.last_call_return_data = Some(output.clone());

        if let Some(address) = created_address {
            // A new contract was created via CREATE
            trace.address = address;
        }
    }

    /// Starts tracking a step
    ///
    /// Invoked on [Inspector::step]
    ///
    /// # Panics
    ///
    /// This expects an existing [CallTrace], in other words, this panics if not within the context
    /// of a call.
    #[cold]
    fn start_step<CTX: ContextTr<Journal: JournalExt>>(
        &mut self,
        interp: &mut Interpreter,
        context: &mut CTX,
    ) {
        let trace_idx = self.last_trace_idx();
        let trace = &mut self.traces.arena[trace_idx];

        let step_idx = trace.trace.steps.len();
        // We always want an OpCode, even it is unknown because it could be an additional opcode
        // that not a known constant.
        let op = unsafe { OpCode::new_unchecked(interp.bytecode.opcode()) };

        let record = self.config.should_record_opcode(op);

        self.step_stack.push(StackStep { trace_idx, step_idx, record });

        if !record {
            return;
        }

        // Reuse the memory from the previous step if:
        // - there is not opcode filter -- in this case we cannot rely on the order of steps
        // - it exists and has not modified memory
        let memory = self.config.record_memory_snapshots.then(|| {
            if self.config.record_opcodes_filter.is_none() {
                if let Some(prev) = trace.trace.steps.last() {
                    if !prev.op.modifies_memory() {
                        if let Some(memory) = &prev.memory {
                            return memory.clone();
                        }
                    }
                }
            }
            RecordedMemory::new(&interp.memory.borrow().context_memory())
        });

        let stack = if self.config.record_stack_snapshots.is_all()
            || self.config.record_stack_snapshots.is_full()
        {
            Some(interp.stack.data().clone())
        } else {
            None
        };
        let returndata = if self.config.record_returndata_snapshots {
            interp.return_data.buffer().to_vec().into()
        } else {
            Default::default()
        };

        let gas_used = gas_used(
            interp.runtime_flag.spec_id(),
            interp.gas.spent(),
            interp.gas.refunded() as u64,
        );

        let mut immediate_bytes = None;
        if self.config.record_immediate_bytes {
            let size = immediate_size(&interp.bytecode);
            if size != 0 {
                immediate_bytes =
                    Some(interp.bytecode.read_slice(size as usize + 1)[1..].to_vec().into());
            }
        }

        self.last_journal_len = context.journal_ref().journal().len();

        trace.trace.steps.push(CallTraceStep {
            depth: context.journal().depth() as u64,
            pc: interp.bytecode.pc(),
            op,
            contract: interp.input.target_address(),
            stack,
            push_stack: None,
            memory,
            returndata,
            gas_remaining: interp.gas.remaining(),
            gas_refund_counter: interp.gas.refunded() as u64,
            gas_used,
            decoded: None,
            immediate_bytes,

            // fields will be populated end of call
            gas_cost: 0,
            storage_change: None,
            status: None,
        });

        trace.ordering.push(TraceMemberOrder::Step(step_idx));
    }

    /// Fills the current trace with the output of a step.
    ///
    /// Invoked on [Inspector::step_end].
    #[cold]
    fn fill_step_on_step_end<CTX: ContextTr<Journal: JournalExt>>(
        &mut self,
        interp: &mut Interpreter,
        context: &mut CTX,
    ) {
        let StackStep { trace_idx, step_idx, record } =
            self.step_stack.pop().expect("can't fill step without starting a step first");

        if !record {
            return;
        }

        let step = &mut self.traces.arena[trace_idx].trace.steps[step_idx];

        if self.config.record_stack_snapshots.is_all()
            || self.config.record_stack_snapshots.is_pushes()
        {
            // this can potentially underflow if the stack is malformed
            let start = interp.stack.len().saturating_sub(step.op.outputs() as usize);
            step.push_stack = Some(interp.stack.data()[start..].to_vec());
        }

        let journal = context.journal_ref().journal();

        // If journal has not changed, there is no state change to be recorded.
        if self.config.record_state_diff && journal.len() != self.last_journal_len {
            let op = step.op.get();

            let journal_entry = journal.last();

            step.storage_change = match (op, journal_entry) {
                (
                    opcode::SLOAD | opcode::SSTORE,
                    Some(JournalEntry::StorageChanged { address, key, had_value }),
                ) => {
                    // SAFETY: (Address,key) exists if part if StorageChange
                    let value =
                        context.journal_ref().evm_state()[address].storage[key].present_value();
                    let reason = match op {
                        opcode::SLOAD => StorageChangeReason::SLOAD,
                        opcode::SSTORE => StorageChangeReason::SSTORE,
                        _ => unreachable!(),
                    };
                    let change =
                        StorageChange { key: *key, value, had_value: Some(*had_value), reason };
                    Some(change)
                }
                _ => None,
            };
        }

        // The gas cost is the difference between the recorded gas remaining at the start of the
        // step the remaining gas here, at the end of the step.
        // TODO: Figure out why this can overflow. https://github.com/paradigmxyz/revm-inspectors/pull/38
        step.gas_cost = step.gas_remaining.saturating_sub(interp.gas.remaining());

        // set the status
        step.status = interp.bytecode.action().as_ref().and_then(|i| i.instruction_result())
    }
}

impl<CTX> Inspector<CTX> for TracingInspector
where
    CTX: ContextTr<Journal: JournalExt>,
{
    #[inline]
    fn step(&mut self, interp: &mut Interpreter, context: &mut CTX) {
        if self.config.record_steps {
            self.start_step(interp, context);
        }
    }

    #[inline]
    fn step_end(&mut self, interp: &mut Interpreter, context: &mut CTX) {
        if self.config.record_steps {
            self.fill_step_on_step_end(interp, context);
        }
    }

    fn log(&mut self, _interp: &mut Interpreter, _context: &mut CTX, log: Log) {
        if self.config.record_logs {
            let trace = self.last_trace();
            trace.ordering.push(TraceMemberOrder::Log(trace.logs.len()));
            trace.logs.push(CallLog::from(log.clone()).with_position(trace.children.len() as u64));
        }
    }

    fn call(&mut self, context: &mut CTX, inputs: &mut CallInputs) -> Option<CallOutcome> {
        // determine correct `from` and `to` based on the call scheme
        let (from, to) = match inputs.scheme {
            CallScheme::DelegateCall | CallScheme::CallCode => {
                (inputs.target_address, inputs.bytecode_address)
            }
            _ => (inputs.caller, inputs.target_address),
        };

        let value = if matches!(inputs.scheme, CallScheme::DelegateCall) {
            // for delegate calls we need to use the value of the top trace
            if let Some(parent) = self.active_trace() {
                parent.trace.value
            } else {
                inputs.call_value()
            }
        } else {
            inputs.call_value()
        };

        // if calls to precompiles should be excluded, check whether this is a call to a precompile
        let maybe_precompile = self
            .config
            .exclude_precompile_calls
            .then(|| self.is_precompile_call(context, &to, &value));

        let input = inputs.input_data(context);
        self.start_trace_on_call(
            context,
            to,
            input,
            value,
            inputs.scheme.into(),
            from,
            inputs.gas_limit,
            maybe_precompile,
        );

        None
    }

    fn call_end(&mut self, _: &mut CTX, _inputs: &CallInputs, outcome: &mut CallOutcome) {
        self.fill_trace_on_call_end(&outcome.result, None);
    }

    fn create(&mut self, context: &mut CTX, inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        let nonce = context.journal_mut().load_account(inputs.caller).ok()?.info.nonce;
        self.start_trace_on_call(
            context,
            inputs.created_address(nonce),
            inputs.init_code.clone(),
            inputs.value,
            inputs.scheme.into(),
            inputs.caller,
            inputs.gas_limit,
            Some(false),
        );
        None
    }

    fn create_end(
        &mut self,
        _context: &mut CTX,
        _inputs: &CreateInputs,
        outcome: &mut CreateOutcome,
    ) {
        self.fill_trace_on_call_end(&outcome.result, outcome.address);
    }

    fn selfdestruct(&mut self, contract: Address, target: Address, value: U256) {
        let node = self.last_trace();
        node.trace.selfdestruct_address = Some(contract);
        node.trace.selfdestruct_refund_target = Some(target);
        node.trace.selfdestruct_transferred_value = Some(value);
    }
}

/// Struct keeping track of internal inspector steps stack.
#[derive(Clone, Copy, Debug)]
struct StackStep {
    /// Whether this step should be recorded.
    ///
    /// This is set to `false` if [OpcodeFilter] is configured and this step's opcode is not
    /// enabled for tracking
    record: bool,
    /// Idx of the trace node this step belongs.
    trace_idx: usize,
    /// Idx of this step in the [CallTrace::steps].
    ///
    /// Please note that if `record` is `false`, this will still contain a value, but the step will
    /// not appear in the steps list.
    step_idx: usize,
}

/// Contains some contextual infos for a transaction execution that is made available to the JS
/// object.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct TransactionContext {
    /// Hash of the block the tx is contained within.
    ///
    /// `None` if this is a call.
    pub block_hash: Option<B256>,
    /// Index of the transaction within a block.
    ///
    /// `None` if this is a call.
    pub tx_index: Option<usize>,
    /// Hash of the transaction being traced.
    ///
    /// `None` if this is a call.
    pub tx_hash: Option<B256>,
}

impl TransactionContext {
    /// Sets the block hash.
    pub const fn with_block_hash(mut self, block_hash: B256) -> Self {
        self.block_hash = Some(block_hash);
        self
    }

    /// Sets the index of the transaction within a block.
    pub const fn with_tx_index(mut self, tx_index: usize) -> Self {
        self.tx_index = Some(tx_index);
        self
    }

    /// Sets the hash of the transaction.
    pub const fn with_tx_hash(mut self, tx_hash: B256) -> Self {
        self.tx_hash = Some(tx_hash);
        self
    }
}

impl From<alloy_rpc_types_eth::TransactionInfo> for TransactionContext {
    fn from(tx_info: alloy_rpc_types_eth::TransactionInfo) -> Self {
        Self {
            block_hash: tx_info.block_hash,
            tx_index: tx_info.index.map(|idx| idx as usize),
            tx_hash: tx_info.hash,
        }
    }
}

/// A helper extension trait that _clones_ the input data from the shared mem buffer
pub(crate) trait CallInputExt {
    fn input_data<CTX: ContextTr>(&self, ctx: &mut CTX) -> Bytes;
}

impl CallInputExt for CallInputs {
    fn input_data<CTX: ContextTr>(&self, ctx: &mut CTX) -> Bytes {
        let input_bytes = match &self.input {
            CallInput::SharedBuffer(range) => ctx
                .local()
                .shared_memory_buffer_slice(range.clone())
                .map(|slice| Bytes::from(slice.to_vec()))
                .unwrap_or_default(),
            CallInput::Bytes(bytes) => bytes.clone(),
        };
        input_bytes
    }
}
```

https://github.com/paradigmxyz/revm-inspectors/blob/c4d7576cb37f0d9b8aab39803cda0c898750e19f/src/tracing/arena.rs
```rust
use super::types::{CallTrace, CallTraceNode, TraceMemberOrder};
use alloc::{vec, vec::Vec};
use alloy_primitives::Address;

/// An arena of recorded traces.
///
/// This type will be populated via the [TracingInspector](super::TracingInspector).
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallTraceArena {
    /// The arena of recorded trace nodes
    pub(crate) arena: Vec<CallTraceNode>,
}

impl Default for CallTraceArena {
    fn default() -> Self {
        // The first node is the root node
        Self { arena: vec![Default::default()] }
    }
}

impl CallTraceArena {
    /// Returns the nodes in the arena.
    pub fn nodes(&self) -> &[CallTraceNode] {
        &self.arena
    }

    /// Returns a mutable reference to the nodes in the arena.
    pub fn nodes_mut(&mut self) -> &mut Vec<CallTraceNode> {
        &mut self.arena
    }

    /// Consumes the arena and returns the nodes.
    pub fn into_nodes(self) -> Vec<CallTraceNode> {
        self.arena
    }

    /// Clears the arena
    ///
    /// Note that this method has no effect on the allocated capacity of the arena.
    #[inline]
    pub fn clear(&mut self) {
        self.arena.clear();
        self.arena.push(Default::default());
    }

    /// Returns __all__ addresses in the recorded traces, that is addresses of the trace and the
    /// caller address.
    pub fn trace_addresses(&self) -> impl Iterator<Item = Address> + '_ {
        self.nodes().iter().flat_map(|node| [node.trace.address, node.trace.caller].into_iter())
    }

    /// Pushes a new trace into the arena, returning the trace ID
    ///
    /// This appends a new trace to the arena, and also inserts a new entry in the node's parent
    /// node children set if `attach_to_parent` is `true`. E.g. if calls to precompiles should
    /// not be included in the call graph this should be called with [PushTraceKind::PushOnly].
    pub(crate) fn push_trace(
        &mut self,
        mut entry: usize,
        kind: PushTraceKind,
        new_trace: CallTrace,
    ) -> usize {
        loop {
            match new_trace.depth {
                // The entry node, just update it
                0 => {
                    self.arena[0].trace = new_trace;
                    return 0;
                }
                // We found the parent node, add the new trace as a child
                _ if self.arena[entry].trace.depth == new_trace.depth - 1 => {
                    let id = self.arena.len();
                    let node = CallTraceNode {
                        parent: Some(entry),
                        trace: new_trace,
                        idx: id,
                        ..Default::default()
                    };
                    self.arena.push(node);

                    // also track the child in the parent node
                    if kind.is_attach_to_parent() {
                        let parent = &mut self.arena[entry];
                        let trace_location = parent.children.len();
                        parent.ordering.push(TraceMemberOrder::Call(trace_location));
                        parent.children.push(id);
                    }

                    return id;
                }
                _ => {
                    // We haven't found the parent node, go deeper
                    entry = *self.arena[entry].children.last().expect("Disconnected trace");
                }
            }
        }
    }
}

/// How to push a trace into the arena
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum PushTraceKind {
    /// This will _only_ push the trace into the arena.
    PushOnly,
    /// This will push the trace into the arena, and also insert a new entry in the node's parent
    /// node children set.
    PushAndAttachToParent,
}

impl PushTraceKind {
    #[inline]
    const fn is_attach_to_parent(&self) -> bool {
        matches!(self, Self::PushAndAttachToParent)
    }
}
```

https://github.com/paradigmxyz/revm-inspectors/blob/c4d7576cb37f0d9b8aab39803cda0c898750e19f/src/tracing/mux.rs
```rust
use crate::tracing::{FourByteInspector, TracingInspector, TracingInspectorConfig};
use alloc::vec::Vec;
use alloy_primitives::{map::HashMap, Address, Log, U256};
use alloy_rpc_types_eth::TransactionInfo;
use alloy_rpc_types_trace::geth::{
    mux::{MuxConfig, MuxFrame},
    CallConfig, FlatCallConfig, FourByteFrame, GethDebugBuiltInTracerType, NoopFrame,
    PreStateConfig,
};
use revm::{
    context_interface::{
        result::{HaltReasonTr, ResultAndState},
        ContextTr,
    },
    inspector::JournalExt,
    interpreter::{CallInputs, CallOutcome, CreateInputs, CreateOutcome, Interpreter},
    DatabaseRef, Inspector,
};
use thiserror::Error;

/// Mux tracing inspector that runs and collects results of multiple inspectors at once.
#[derive(Clone, Debug)]
pub struct MuxInspector {
    /// An instance of FourByteInspector that can be reused
    four_byte: Option<FourByteInspector>,
    /// An instance of TracingInspector that can be reused
    tracing: Option<TracingInspector>,
    /// Configurations for different Geth trace types
    configs: Vec<(GethDebugBuiltInTracerType, TraceConfig)>,
}

/// Holds all Geth supported trace configurations
#[derive(Clone, Debug)]
enum TraceConfig {
    Call(CallConfig),
    PreState(PreStateConfig),
    FlatCall(FlatCallConfig),
    Noop,
}

impl MuxInspector {
    /// Try creating a new instance of [MuxInspector] from the given [MuxConfig].
    pub fn try_from_config(config: MuxConfig) -> Result<MuxInspector, Error> {
        let mut four_byte = None;
        let mut inspector_config = TracingInspectorConfig::none();
        let mut configs = Vec::new();

        // Process each tracer configuration
        for (tracer_type, tracer_config) in config.0 {
            match tracer_type {
                GethDebugBuiltInTracerType::FourByteTracer => {
                    if tracer_config.is_some() {
                        return Err(Error::UnexpectedConfig(tracer_type));
                    }
                    four_byte = Some(FourByteInspector::default());
                }
                GethDebugBuiltInTracerType::CallTracer => {
                    let call_config = tracer_config
                        .ok_or(Error::MissingConfig(tracer_type))?
                        .into_call_config()?;

                    inspector_config
                        .merge(TracingInspectorConfig::from_geth_call_config(&call_config));
                    configs.push((tracer_type, TraceConfig::Call(call_config)));
                }
                GethDebugBuiltInTracerType::PreStateTracer => {
                    let prestate_config = tracer_config
                        .ok_or(Error::MissingConfig(tracer_type))?
                        .into_pre_state_config()?;

                    inspector_config
                        .merge(TracingInspectorConfig::from_geth_prestate_config(&prestate_config));
                    configs.push((tracer_type, TraceConfig::PreState(prestate_config)));
                }
                GethDebugBuiltInTracerType::NoopTracer => {
                    if tracer_config.is_some() {
                        return Err(Error::UnexpectedConfig(tracer_type));
                    }
                    configs.push((tracer_type, TraceConfig::Noop));
                }
                GethDebugBuiltInTracerType::FlatCallTracer => {
                    let flatcall_config = tracer_config
                        .ok_or(Error::MissingConfig(tracer_type))?
                        .into_flat_call_config()?;

                    inspector_config
                        .merge(TracingInspectorConfig::from_flat_call_config(&flatcall_config));
                    configs.push((tracer_type, TraceConfig::FlatCall(flatcall_config)));
                }
                GethDebugBuiltInTracerType::MuxTracer => {
                    return Err(Error::UnexpectedConfig(tracer_type));
                }
            }
        }

        let tracing = (!configs.is_empty()).then(|| TracingInspector::new(inspector_config));

        Ok(MuxInspector { four_byte, tracing, configs })
    }

    /// Try converting this [MuxInspector] into a [MuxFrame].
    pub fn try_into_mux_frame<DB: DatabaseRef>(
        &self,
        result: &ResultAndState<impl HaltReasonTr>,
        db: &DB,
        tx_info: TransactionInfo,
    ) -> Result<MuxFrame, DB::Error> {
        let mut frame = HashMap::with_capacity_and_hasher(self.configs.len(), Default::default());

        for (tracer_type, config) in &self.configs {
            let trace = match config {
                TraceConfig::Call(call_config) => {
                    if let Some(inspector) = &self.tracing {
                        inspector
                            .geth_builder()
                            .geth_call_traces(*call_config, result.result.gas_used())
                            .into()
                    } else {
                        continue;
                    }
                }
                TraceConfig::PreState(prestate_config) => {
                    if let Some(inspector) = &self.tracing {
                        inspector
                            .geth_builder()
                            .geth_prestate_traces(result, prestate_config, db)?
                            .into()
                    } else {
                        continue;
                    }
                }
                TraceConfig::FlatCall(_flatcall_config) => {
                    if let Some(inspector) = &self.tracing {
                        inspector
                            .clone()
                            .into_parity_builder()
                            .into_localized_transaction_traces(tx_info)
                            .into()
                    } else {
                        continue;
                    }
                }
                TraceConfig::Noop => NoopFrame::default().into(),
            };

            frame.insert(*tracer_type, trace);
        }

        // Add four byte trace if inspector exists
        if let Some(inspector) = &self.four_byte {
            frame.insert(
                GethDebugBuiltInTracerType::FourByteTracer,
                FourByteFrame::from(inspector).into(),
            );
        }

        Ok(MuxFrame(frame))
    }
}

impl<CTX> Inspector<CTX> for MuxInspector
where
    CTX: ContextTr<Journal: JournalExt>,
{
    #[inline]
    fn initialize_interp(&mut self, interp: &mut Interpreter, context: &mut CTX) {
        if let Some(ref mut inspector) = self.four_byte {
            inspector.initialize_interp(interp, context);
        }
        if let Some(ref mut inspector) = self.tracing {
            inspector.initialize_interp(interp, context);
        }
    }

    #[inline]
    fn step(&mut self, interp: &mut Interpreter, context: &mut CTX) {
        if let Some(ref mut inspector) = self.four_byte {
            inspector.step(interp, context);
        }
        if let Some(ref mut inspector) = self.tracing {
            inspector.step(interp, context);
        }
    }

    #[inline]
    fn step_end(&mut self, interp: &mut Interpreter, context: &mut CTX) {
        if let Some(ref mut inspector) = self.four_byte {
            inspector.step_end(interp, context);
        }
        if let Some(ref mut inspector) = self.tracing {
            inspector.step_end(interp, context);
        }
    }

    #[inline]
    fn log(&mut self, interp: &mut Interpreter, context: &mut CTX, log: Log) {
        if let Some(ref mut inspector) = self.four_byte {
            inspector.log(interp, context, log.clone());
        }
        if let Some(ref mut inspector) = self.tracing {
            inspector.log(interp, context, log);
        }
    }

    #[inline]
    fn call(&mut self, context: &mut CTX, inputs: &mut CallInputs) -> Option<CallOutcome> {
        if let Some(ref mut inspector) = self.four_byte {
            let _ = inspector.call(context, inputs);
        }
        if let Some(ref mut inspector) = self.tracing {
            return inspector.call(context, inputs);
        }
        None
    }

    #[inline]
    fn call_end(&mut self, context: &mut CTX, inputs: &CallInputs, outcome: &mut CallOutcome) {
        if let Some(ref mut inspector) = self.four_byte {
            inspector.call_end(context, inputs, outcome);
        }
        if let Some(ref mut inspector) = self.tracing {
            inspector.call_end(context, inputs, outcome);
        }
    }

    #[inline]
    fn create(&mut self, context: &mut CTX, inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        if let Some(ref mut inspector) = self.four_byte {
            let _ = inspector.create(context, inputs);
        }
        if let Some(ref mut inspector) = self.tracing {
            return inspector.create(context, inputs);
        }
        None
    }

    #[inline]
    fn create_end(
        &mut self,
        context: &mut CTX,
        inputs: &CreateInputs,
        outcome: &mut CreateOutcome,
    ) {
        if let Some(ref mut inspector) = self.four_byte {
            inspector.create_end(context, inputs, outcome);
        }
        if let Some(ref mut inspector) = self.tracing {
            inspector.create_end(context, inputs, outcome);
        }
    }

    #[inline]
    fn selfdestruct(&mut self, contract: Address, target: Address, value: U256) {
        if let Some(ref mut inspector) = self.four_byte {
            <FourByteInspector as Inspector<CTX>>::selfdestruct(inspector, contract, target, value);
        }
        if let Some(ref mut inspector) = self.tracing {
            <TracingInspector as Inspector<CTX>>::selfdestruct(inspector, contract, target, value);
        }
    }
}

/// Error type for [MuxInspector]
#[derive(Debug, Error)]
pub enum Error {
    /// Config was provided for a tracer that does not expect it
    #[error("unexpected config for tracer '{0:?}'")]
    UnexpectedConfig(GethDebugBuiltInTracerType),
    /// Expected config is missing
    #[error("expected config is missing for tracer '{0:?}'")]
    MissingConfig(GethDebugBuiltInTracerType),
    /// Error when deserializing the config
    #[error("error deserializing config: {0}")]
    InvalidConfig(#[from] serde_json::Error),
}
```

https://github.com/ethereum/go-ethereum/blob/35dd84ce2999ecf5ca8ace50a4d1a6abc231c370/eth/tracers/native/call.go
```go
// Copyright 2021 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package native

import (
	"encoding/json"
	"errors"
	"math/big"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/eth/tracers"
	"github.com/ethereum/go-ethereum/params"
)

//go:generate go run github.com/fjl/gencodec -type callFrame -field-override callFrameMarshaling -out gen_callframe_json.go

func init() {
	tracers.DefaultDirectory.Register("callTracer", newCallTracer, false)
}

type callLog struct {
	Address common.Address `json:"address"`
	Topics  []common.Hash  `json:"topics"`
	Data    hexutil.Bytes  `json:"data"`
	// Position of the log relative to subcalls within the same trace
	// See https://github.com/ethereum/go-ethereum/pull/28389 for details
	Position hexutil.Uint `json:"position"`
}

type callFrame struct {
	Type         vm.OpCode       `json:"-"`
	From         common.Address  `json:"from"`
	Gas          uint64          `json:"gas"`
	GasUsed      uint64          `json:"gasUsed"`
	To           *common.Address `json:"to,omitempty" rlp:"optional"`
	Input        []byte          `json:"input" rlp:"optional"`
	Output       []byte          `json:"output,omitempty" rlp:"optional"`
	Error        string          `json:"error,omitempty" rlp:"optional"`
	RevertReason string          `json:"revertReason,omitempty"`
	Calls        []callFrame     `json:"calls,omitempty" rlp:"optional"`
	Logs         []callLog       `json:"logs,omitempty" rlp:"optional"`
	// Placed at end on purpose. The RLP will be decoded to 0 instead of
	// nil if there are non-empty elements after in the struct.
	Value            *big.Int `json:"value,omitempty" rlp:"optional"`
	revertedSnapshot bool
}

func (f callFrame) TypeString() string {
	return f.Type.String()
}

func (f callFrame) failed() bool {
	return len(f.Error) > 0 && f.revertedSnapshot
}

func (f *callFrame) processOutput(output []byte, err error, reverted bool) {
	output = common.CopyBytes(output)
	// Clear error if tx wasn't reverted. This happened
	// for pre-homestead contract storage OOG.
	if err != nil && !reverted {
		err = nil
	}
	if err == nil {
		f.Output = output
		return
	}
	f.Error = err.Error()
	f.revertedSnapshot = reverted
	if f.Type == vm.CREATE || f.Type == vm.CREATE2 {
		f.To = nil
	}
	if !errors.Is(err, vm.ErrExecutionReverted) || len(output) == 0 {
		return
	}
	f.Output = output
	if len(output) < 4 {
		return
	}
	if unpacked, err := abi.UnpackRevert(output); err == nil {
		f.RevertReason = unpacked
	}
}

type callFrameMarshaling struct {
	TypeString string `json:"type"`
	Gas        hexutil.Uint64
	GasUsed    hexutil.Uint64
	Value      *hexutil.Big
	Input      hexutil.Bytes
	Output     hexutil.Bytes
}

type callTracer struct {
	callstack []callFrame
	config    callTracerConfig
	gasLimit  uint64
	depth     int
	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
}

type callTracerConfig struct {
	OnlyTopCall bool `json:"onlyTopCall"` // If true, call tracer won't collect any subcalls
	WithLog     bool `json:"withLog"`     // If true, call tracer will collect event logs
}

// newCallTracer returns a native go tracer which tracks
// call frames of a tx, and implements vm.EVMLogger.
func newCallTracer(ctx *tracers.Context, cfg json.RawMessage, chainConfig *params.ChainConfig) (*tracers.Tracer, error) {
	t, err := newCallTracerObject(ctx, cfg)
	if err != nil {
		return nil, err
	}
	return &tracers.Tracer{
		Hooks: &tracing.Hooks{
			OnTxStart: t.OnTxStart,
			OnTxEnd:   t.OnTxEnd,
			OnEnter:   t.OnEnter,
			OnExit:    t.OnExit,
			OnLog:     t.OnLog,
		},
		GetResult: t.GetResult,
		Stop:      t.Stop,
	}, nil
}

func newCallTracerObject(ctx *tracers.Context, cfg json.RawMessage) (*callTracer, error) {
	var config callTracerConfig
	if err := json.Unmarshal(cfg, &config); err != nil {
		return nil, err
	}
	// First callframe contains tx context info
	// and is populated on start and end.
	return &callTracer{callstack: make([]callFrame, 0, 1), config: config}, nil
}

// OnEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (t *callTracer) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	t.depth = depth
	if t.config.OnlyTopCall && depth > 0 {
		return
	}
	// Skip if tracing was interrupted
	if t.interrupt.Load() {
		return
	}

	toCopy := to
	call := callFrame{
		Type:  vm.OpCode(typ),
		From:  from,
		To:    &toCopy,
		Input: common.CopyBytes(input),
		Gas:   gas,
		Value: value,
	}
	if depth == 0 {
		call.Gas = t.gasLimit
	}
	t.callstack = append(t.callstack, call)
}

// OnExit is called when EVM exits a scope, even if the scope didn't
// execute any code.
func (t *callTracer) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if depth == 0 {
		t.captureEnd(output, gasUsed, err, reverted)
		return
	}

	t.depth = depth - 1
	if t.config.OnlyTopCall {
		return
	}

	size := len(t.callstack)
	if size <= 1 {
		return
	}
	// Pop call.
	call := t.callstack[size-1]
	t.callstack = t.callstack[:size-1]
	size -= 1

	call.GasUsed = gasUsed
	call.processOutput(output, err, reverted)
	// Nest call into parent.
	t.callstack[size-1].Calls = append(t.callstack[size-1].Calls, call)
}

func (t *callTracer) captureEnd(output []byte, gasUsed uint64, err error, reverted bool) {
	if len(t.callstack) != 1 {
		return
	}
	t.callstack[0].processOutput(output, err, reverted)
}

func (t *callTracer) OnTxStart(env *tracing.VMContext, tx *types.Transaction, from common.Address) {
	t.gasLimit = tx.Gas()
}

func (t *callTracer) OnTxEnd(receipt *types.Receipt, err error) {
	// Error happened during tx validation.
	if err != nil {
		return
	}
	if receipt != nil {
		t.callstack[0].GasUsed = receipt.GasUsed
	}
	if t.config.WithLog {
		// Logs are not emitted when the call fails
		clearFailedLogs(&t.callstack[0], false)
	}
}

func (t *callTracer) OnLog(log *types.Log) {
	// Only logs need to be captured via opcode processing
	if !t.config.WithLog {
		return
	}
	// Avoid processing nested calls when only caring about top call
	if t.config.OnlyTopCall && t.depth > 0 {
		return
	}
	// Skip if tracing was interrupted
	if t.interrupt.Load() {
		return
	}
	l := callLog{
		Address:  log.Address,
		Topics:   log.Topics,
		Data:     log.Data,
		Position: hexutil.Uint(len(t.callstack[len(t.callstack)-1].Calls)),
	}
	t.callstack[len(t.callstack)-1].Logs = append(t.callstack[len(t.callstack)-1].Logs, l)
}

// GetResult returns the json-encoded nested list of call traces, and any
// error arising from the encoding or forceful termination (via `Stop`).
func (t *callTracer) GetResult() (json.RawMessage, error) {
	if len(t.callstack) != 1 {
		return nil, errors.New("incorrect number of top-level calls")
	}

	res, err := json.Marshal(t.callstack[0])
	if err != nil {
		return nil, err
	}
	return res, t.reason
}

// Stop terminates execution of the tracer at the first opportune moment.
func (t *callTracer) Stop(err error) {
	t.reason = err
	t.interrupt.Store(true)
}

// clearFailedLogs clears the logs of a callframe and all its children
// in case of execution failure.
func clearFailedLogs(cf *callFrame, parentFailed bool) {
	failed := cf.failed() || parentFailed
	// Clear own logs
	if failed {
		cf.Logs = nil
	}
	for i := range cf.Calls {
		clearFailedLogs(&cf.Calls[i], failed)
	}
}
```

## Gemini's Implementation Strategy

**Core Approach: Stack-Based Call Tree Building**

The optimal implementation uses a **call stack** to manage the hierarchical call tree during EVM execution:

1. **Initialize**: Create an empty call stack and root call entry
2. **beforeMessage Event**: 
   - Create new `TraceCall` node with call details (type, from, to, value, gas, input)
   - Push onto call stack
   - Link to parent (previous stack top) if not root call
3. **afterMessage Event**:
   - Pop current call from stack  
   - Populate execution results (gasUsed, output, error, revertReason)
   - Add completed call to parent's `calls[]` array
4. **Return**: Root call becomes the `CallTraceResult`

**Key Implementation Details:**

**Stack Management:**
```javascript
const callStack = []  // Stack of active calls
let rootCall = null   // Top-level call result

// beforeMessage: Push new call
const currentCall = createTraceCall(message)
if (callStack.length === 0) {
  rootCall = currentCall  // First call becomes root
} else {
  const parent = callStack[callStack.length - 1]
  parent.calls = parent.calls || []
  parent.calls.push(currentCall)  // Link to parent
}
callStack.push(currentCall)

// afterMessage: Pop and finalize call
const completedCall = callStack.pop()
populateCallResults(completedCall, result)
```

**Call Type Detection:**
```javascript
function getTraceType(message) {
  if (!message.to) return message.salt ? 'CREATE2' : 'CREATE'
  if (message.delegatecall) return 'DELEGATECALL'
  if (message.isStatic) return 'STATICCALL'
  return 'CALL'
}
```

**Error Handling:**
- Capture `result.execResult.exceptionError` for error messages
- Extract revert reason from `result.execResult.returnValue` if available
- Handle failed calls by setting error fields but maintaining call tree structure

**Advantages of This Approach:**
- ✅ Natural mapping to EVM's call stack behavior
- ✅ Handles arbitrary nesting depth automatically  
- ✅ Maintains parent-child relationships correctly
- ✅ Minimal memory overhead (only active calls in stack)
- ✅ Clean separation between call creation and result population
- ✅ Follows EVM execution lifecycle precisely

**Integration with Existing Patterns:**
- Use same transaction execution pattern as `prestateTracer`
- Follow same event listener setup and cleanup
- Maintain same function signature and return structure
- Use existing utility functions for address/hex conversion

This stack-based approach provides the most reliable and maintainable solution for building the hierarchical call tree that matches the expected `CallTraceResult` structure.

## Final Implementation Plan

Based on the analysis of Tevm's architecture and Gemini's strategy, here's the refined implementation plan:

### Implementation Steps

1. **Setup Event Listeners**
   - Use EVM's `beforeMessage` and `afterMessage` events
   - Initialize call stack and root call tracking
   - Set up proper event cleanup

2. **beforeMessage Handler** 
   - Create `TraceCall` object from message data
   - Determine trace type (CALL, CREATE, etc.)
   - Link to parent call if nested
   - Push to call stack

3. **afterMessage Handler**
   - Pop current call from stack
   - Populate execution results (gas, output, errors)
   - Handle contract creation addresses
   - Process revert reasons

4. **Transaction Execution**
   - Follow existing `prestateTracer` pattern
   - Use `vm.runTx()` with appropriate options
   - Convert EVM input to transaction
   - Return result with trace data

5. **Utility Functions**
   - Call type detection logic
   - Address/hex conversion helpers  
   - Error message extraction
   - Revert reason processing

### Key Files Modified
- `/packages/actions/src/internal/runCallWithCallTrace.js` - Primary implementation
- Tests will automatically work once implementation is complete

### Success Criteria
- ✅ All existing integration points work without changes
- ✅ Returns data matching `CallTraceResult`/`TraceCall` TypeScript types
- ✅ Handles all trace types and nested calls correctly
- ✅ Captures gas usage, I/O data, and error states accurately
- ✅ Follows established codebase patterns and conventions

---

**IMPLEMENTATION PROMPT:**

You are a senior fullstack engineer with deep expertise in the Tevm codebase. You have been tasked with implementing the missing `callTracer` functionality for Tevm's debug trace procedures. 

All the necessary context, type definitions, integration points, existing patterns, and implementation strategy are provided above. The task is focused and well-defined: implement the `runCallWithCallTrace()` function in `/packages/actions/src/internal/runCallWithCallTrace.js` using the stack-based approach outlined by Gemini.

The implementation should be production-ready, follow Tevm's established patterns, and integrate seamlessly with the existing tracer architecture. Focus on code quality, reliability, and maintainability while keeping complexity minimal.

Begin implementation now.