use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::sync::Arc;
use tokio::sync::Mutex;
use trevm::{
    revm::primitives::{hex, Address, Bytes, ExecutionResult, TransactTo, U256},
    NoopBlock, NoopCfg, TrevmBuilder, Tx,
};

use crate::state_bridge::StateBridge;
use crate::types::{js_to_address, js_to_bytes, js_to_u256, JsAccount};

#[napi(object)]
pub struct TxCallOpts {
    pub caller: Option<String>,
    pub to: Option<String>,
    pub data: Option<String>,
    pub value: Option<BigInt>,
    pub gas_limit: Option<BigInt>,
    pub skip_balance: Option<bool>,
}

struct TxFiller {
    caller: Address,
    to: Option<Address>,
    data: Bytes,
    value: U256,
    gas_limit: Option<U256>,
    skip_balance: bool,
}

impl Tx for TxFiller {
    fn fill_tx_env(&self, tx_env: &mut trevm::revm::primitives::TxEnv) {
        tx_env.caller = self.caller;
        tx_env.kind = match self.to {
            Some(addr) => TransactTo::Call(addr),
            None => TransactTo::Create,
        };
        tx_env.data = self.data.clone();
        tx_env.value = self.value;
        
        if let Some(gas_limit) = self.gas_limit {
            tx_env.gas_limit = gas_limit.try_into().unwrap_or(u64::MAX);
        }
        
        tx_env.skip_balance_check = self.skip_balance;
    }
}

#[napi]
pub struct TrevmWrapper {
    chain_id: u64,
    allow_unlimited_contract_size: bool,
    state_bridge: Arc<StateBridge>,
}

#[napi]
impl TrevmWrapper {
    #[napi(factory)]
    pub fn new(options: Object) -> Promise<TrevmWrapper> {
        // We need to extract callback functions and options from the JavaScript object
        let env = options.env;
        
        let chain_id = options.get::<_, u64>("chainId").unwrap_or(1);
        let allow_unlimited_contract_size = options.get::<_, bool>("allowUnlimitedContractSize").unwrap_or(false);
        
        // Extract state callbacks
        let state_callbacks = options.get::<_, Object>("stateCallbacks").unwrap_or_else(|_| {
            env.get_undefined().unwrap().coerce_to_object().unwrap()
        });
        
        // Create threadsafe functions for state callbacks
        let get_account = state_callbacks
            .get::<_, Function>("getAccount")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                panic!("getAccount callback is required");
            });
            
        let put_account = state_callbacks
            .get::<_, Function>("putAccount")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                panic!("putAccount callback is required");
            });
            
        let get_storage = state_callbacks
            .get::<_, Function>("getStorage")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                panic!("getStorage callback is required");
            });
            
        let put_storage = state_callbacks
            .get::<_, Function>("putStorage")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                panic!("putStorage callback is required");
            });
            
        let get_code = state_callbacks
            .get::<_, Function>("getCode")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                panic!("getCode callback is required");
            });
            
        let put_code = state_callbacks
            .get::<_, Function>("putCode")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                panic!("putCode callback is required");
            });
            
        let get_block_hash = state_callbacks
            .get::<_, Function>("getBlockHash")
            .and_then(|f| f.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value])))
            .unwrap_or_else(|_| {
                // This one is optional, so provide a default that returns empty string
                let env = env.clone();
                Function::new(env.raw(), |ctx| {
                    ctx.env.get_null()
                })
                .unwrap()
                .create_threadsafe_function(0, |ctx| Ok(vec![ctx.value]))
                .unwrap()
            });
        
        // Create state bridge
        let state_bridge = Arc::new(StateBridge::new(
            get_account,
            put_account,
            get_storage,
            put_storage,
            get_code,
            put_code,
            get_block_hash,
        ));
        
        Promise::new(move |env, resolve, reject| {
            let state_bridge = state_bridge.clone();
            let chain_id = chain_id;
            let allow_unlimited_contract_size = allow_unlimited_contract_size;
            
            resolve.resolve(|_| {
                Ok(TrevmWrapper {
                    chain_id,
                    allow_unlimited_contract_size,
                    state_bridge,
                })
            })?;
            
            Ok(())
        })
    }
    
    #[napi]
    pub fn run_call(&self, opts: TxCallOpts) -> Promise<Object> {
        let state_bridge = self.state_bridge.clone();
        let chain_id = self.chain_id;
        let allow_unlimited_contract_size = self.allow_unlimited_contract_size;
        
        // Parse transaction options
        let caller = opts.caller
            .map(js_to_address)
            .transpose()
            .unwrap_or_else(|_| Ok(Address::ZERO))
            .unwrap();
            
        let to = opts.to
            .map(js_to_address)
            .transpose()
            .unwrap_or_else(|_| Ok(Address::ZERO));
            
        let data = opts.data
            .map(js_to_bytes)
            .transpose()
            .unwrap_or_else(|_| Ok(Bytes::default()))
            .unwrap();
            
        let value = opts.value
            .map(js_to_u256)
            .transpose()
            .unwrap_or_else(|_| Ok(U256::ZERO))
            .unwrap();
            
        let gas_limit = opts.gas_limit
            .map(js_to_u256)
            .transpose()
            .unwrap_or(Ok(None))
            .unwrap();
            
        let skip_balance = opts.skip_balance.unwrap_or(false);
        
        let tx_filler = TxFiller {
            caller,
            to: to.ok(),
            data,
            value,
            gas_limit,
            skip_balance,
        };
        
        Promise::new(move |env, resolve, reject| {
            let state_bridge = state_bridge.clone();
            
            // Execute in a tokio runtime
            tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .unwrap()
                .block_on(async move {
                    // Build trevm with our state bridge
                    let trevm_builder = TrevmBuilder::new()
                        .with_db(state_bridge.as_ref().clone())
                        .with_spec_id(chain_id)
                        .with_unlimited_contract_size(allow_unlimited_contract_size);
                        
                    let trevm = match trevm_builder.build_trevm() {
                        Ok(t) => t,
                        Err(e) => {
                            reject.reject(Error::new(
                                Status::GenericFailure,
                                format!("Failed to build trevm: {}", e),
                            ))?;
                            return Ok(());
                        }
                    };
                    
                    // Configure trevm
                    let trevm = trevm.fill_cfg(&NoopCfg).fill_block(&NoopBlock);
                    
                    // Execute transaction
                    let result = trevm.fill_tx(&tx_filler).run();
                    
                    match result {
                        Ok(execution) => {
                            let result = execution.result_and_state();
                            
                            // Create result object
                            let result_obj = env.create_object()?;
                            
                            // Set returnValue
                            match &result.result {
                                ExecutionResult::Success { output, .. } => {
                                    match output {
                                        trevm::revm::primitives::Output::Call(bytes) => {
                                            let return_value = format!("0x{}", hex::encode(bytes));
                                            result_obj.set("returnValue", return_value)?;
                                        }
                                        trevm::revm::primitives::Output::Create(bytes, _) => {
                                            let return_value = format!("0x{}", hex::encode(bytes));
                                            result_obj.set("returnValue", return_value)?;
                                        }
                                    }
                                    result_obj.set("executionGasUsed", result.result.gas_used().to_string())?;
                                }
                                ExecutionResult::Revert { output, .. } => {
                                    let error_value = format!("0x{}", hex::encode(output));
                                    result_obj.set("error", "execution reverted")?;
                                    result_obj.set("returnValue", error_value)?;
                                    result_obj.set("executionGasUsed", result.result.gas_used().to_string())?;
                                }
                                ExecutionResult::Halt { reason, .. } => {
                                    result_obj.set("error", format!("execution halted: {:?}", reason))?;
                                    result_obj.set("executionGasUsed", result.result.gas_used().to_string())?;
                                }
                            }
                            
                            resolve.resolve(|_| Ok(result_obj))?;
                        }
                        Err(e) => {
                            reject.reject(Error::new(
                                Status::GenericFailure,
                                format!("Execution error: {}", e),
                            ))?;
                        }
                    }
                    
                    Ok(())
                })
        })
    }
}