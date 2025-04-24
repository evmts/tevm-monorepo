use wasm_bindgen::prelude::*;
use js_sys::{Promise, Array, Object};
use serde::{Serialize, Deserialize};
use once_cell::sync::Lazy;
use std::sync::{Mutex, Arc};

// REVM imports
use revm::{
    context::Context,
    primitives::{address, TxKind, TxStorage, Address, U256, Bytes, B256, AccountInfo, KECCAK_EMPTY},
    db::{CacheDB, EmptyDB, Database},
    ExecuteEvm, MainBuilder, MainContext,
};

// Necessary to properly handle panics in WebAssembly
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

// ------ Types and Models ------

#[derive(Serialize, Deserialize, Clone)]
pub struct CreateEvmOptions {
    pub common: Option<serde_json::Value>,
    pub state_manager: Option<JsValue>,
    pub blockchain: Option<JsValue>,
    pub custom_precompiles: Option<Vec<serde_json::Value>>,
    pub profiler: Option<bool>,
    pub allow_unlimited_contract_size: Option<bool>,
    pub logging_level: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CallData {
    pub to: Option<String>,
    pub caller: Option<String>,
    pub data: Option<String>,
    pub value: Option<String>,
    pub gas_limit: Option<u64>,
    pub access_list: Option<Vec<AccessListItem>>,
    pub skip_balance: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AccessListItem {
    pub address: String,
    pub storage_keys: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CallResult {
    pub result: String,
    pub gas_used: u64,
    pub logs: Vec<LogEntry>,
}

#[derive(Serialize, Deserialize)]
pub struct LogEntry {
    pub address: String,
    pub topics: Vec<String>,
    pub data: String,
}

// ------ EVM Implementation ------

// JS proxy database that forwards requests to JavaScript state manager and blockchain
pub struct JsProxyDB {
    state_manager: JsValue,
    blockchain: JsValue,
}

impl JsProxyDB {
    pub fn new(state_manager: JsValue, blockchain: JsValue) -> Self {
        JsProxyDB {
            state_manager,
            blockchain,
        }
    }
    
    // Helper method to call methods on the state manager
    fn call_state_manager_method(&self, method: &str, args: &JsValue) -> Result<JsValue, JsValue> {
        let state_manager = self.state_manager.clone();
        
        // Call the method on the state manager
        let method_js = js_sys::Reflect::get(&state_manager, &method.into())?;
        
        if !method_js.is_function() {
            return Err(JsValue::from_str(&format!("Method '{}' not found on state manager", method)));
        }
        
        let method_func = method_js.dyn_into::<js_sys::Function>().unwrap();
        js_sys::Reflect::apply(&method_func, &state_manager, &js_sys::Array::of1(args))
    }
    
    // Helper method to call methods on the blockchain
    fn call_blockchain_method(&self, method: &str, args: &JsValue) -> Result<JsValue, JsValue> {
        let blockchain = self.blockchain.clone();
        
        // Call the method on the blockchain
        let method_js = js_sys::Reflect::get(&blockchain, &method.into())?;
        
        if !method_js.is_function() {
            return Err(JsValue::from_str(&format!("Method '{}' not found on blockchain", method)));
        }
        
        let method_func = method_js.dyn_into::<js_sys::Function>().unwrap();
        js_sys::Reflect::apply(&method_func, &blockchain, &js_sys::Array::of1(args))
    }
}

// Implement the Database trait for our JS proxy
impl Database for JsProxyDB {
    type Error = String;
    
    // Get basic account info
    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error> {
        // Convert the address to a JavaScript-friendly format
        let address_hex = format!("0x{}", hex::encode(address.0));
        let address_js = JsValue::from_str(&address_hex);
        
        // Call the getAccount method on the state manager
        match self.call_state_manager_method("getAccount", &address_js) {
            Ok(js_account) => {
                if js_account.is_null() || js_account.is_undefined() {
                    return Ok(None);
                }
                
                // Parse the account info from JavaScript
                let balance = match js_sys::Reflect::get(&js_account, &"balance".into()) {
                    Ok(val) => {
                        let balance_str = val.as_string().unwrap_or_default();
                        parse_u256(&balance_str).unwrap_or(U256::ZERO)
                    },
                    Err(_) => U256::ZERO,
                };
                
                let nonce = match js_sys::Reflect::get(&js_account, &"nonce".into()) {
                    Ok(val) => val.as_f64().unwrap_or(0.0) as u64,
                    Err(_) => 0,
                };
                
                let code_hash = match js_sys::Reflect::get(&js_account, &"codeHash".into()) {
                    Ok(val) => {
                        let code_hash_str = val.as_string().unwrap_or_default();
                        if code_hash_str.starts_with("0x") && code_hash_str.len() > 2 {
                            let hash_bytes = hex::decode(&code_hash_str[2..]).unwrap_or_default();
                            let mut hash = [0u8; 32];
                            if hash_bytes.len() == 32 {
                                hash.copy_from_slice(&hash_bytes);
                                B256::from(hash)
                            } else {
                                KECCAK_EMPTY
                            }
                        } else {
                            KECCAK_EMPTY
                        }
                    },
                    Err(_) => KECCAK_EMPTY,
                };
                
                // Check if there's code
                let code = match js_sys::Reflect::get(&js_account, &"code".into()) {
                    Ok(val) => {
                        if !val.is_null() && !val.is_undefined() {
                            let code_str = val.as_string().unwrap_or_default();
                            if code_str.starts_with("0x") && code_str.len() > 2 {
                                let code_bytes = hex::decode(&code_str[2..]).unwrap_or_default();
                                Some(revm::primitives::Bytecode::new_raw(Bytes::from(code_bytes)))
                            } else {
                                None
                            }
                        } else {
                            None
                        }
                    },
                    Err(_) => None,
                };
                
                // Create account info
                let account_info = AccountInfo {
                    balance,
                    nonce,
                    code_hash,
                    code,
                };
                
                Ok(Some(account_info))
            },
            Err(e) => Err(format!("Failed to get account: {:?}", e)),
        }
    }
    
    // Store account info
    fn insert_account_info(&mut self, address: Address, account: AccountInfo) -> Result<(), Self::Error> {
        // Convert the address to a JavaScript-friendly format
        let address_hex = format!("0x{}", hex::encode(address.0));
        
        // Convert the account to a JavaScript-friendly format
        let balance_hex = format!("0x{:x}", account.balance);
        let code_hex = account.code.as_ref().map(|c| format!("0x{}", hex::encode(c.original_bytes())));
        let code_hash_hex = format!("0x{}", hex::encode(account.code_hash.0));
        
        // Create the JavaScript account object
        let js_account = js_sys::Object::new();
        js_sys::Reflect::set(&js_account, &"address".into(), &JsValue::from_str(&address_hex)).unwrap();
        js_sys::Reflect::set(&js_account, &"balance".into(), &JsValue::from_str(&balance_hex)).unwrap();
        js_sys::Reflect::set(&js_account, &"nonce".into(), &JsValue::from_f64(account.nonce as f64)).unwrap();
        js_sys::Reflect::set(&js_account, &"codeHash".into(), &JsValue::from_str(&code_hash_hex)).unwrap();
        if let Some(code) = code_hex {
            js_sys::Reflect::set(&js_account, &"code".into(), &JsValue::from_str(&code)).unwrap();
        } else {
            js_sys::Reflect::set(&js_account, &"code".into(), &JsValue::NULL).unwrap();
        }
        
        // Call the putAccount method on the state manager
        match self.call_state_manager_method("putAccount", &js_account) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to put account: {:?}", e)),
        }
    }
    
    // Get storage at a specific slot
    fn storage(&mut self, address: Address, index: U256) -> Result<U256, Self::Error> {
        // Convert the address and index to JavaScript-friendly format
        let address_hex = format!("0x{}", hex::encode(address.0));
        let index_hex = format!("0x{:x}", index);
        
        // Create the arguments object
        let args = js_sys::Object::new();
        js_sys::Reflect::set(&args, &"address".into(), &JsValue::from_str(&address_hex)).unwrap();
        js_sys::Reflect::set(&args, &"key".into(), &JsValue::from_str(&index_hex)).unwrap();
        
        // Call the getStorageAt method on the state manager
        match self.call_state_manager_method("getStorageAt", &args) {
            Ok(value) => {
                let value_str = value.as_string().unwrap_or_default();
                parse_u256(&value_str).map_err(|e| format!("Failed to parse storage value: {}", e))
            },
            Err(e) => Err(format!("Failed to get storage: {:?}", e)),
        }
    }
    
    // Set storage at a specific slot
    fn insert_account_storage(&mut self, address: Address, index: U256, value: U256) -> Result<(), Self::Error> {
        // Convert the address, index, and value to JavaScript-friendly format
        let address_hex = format!("0x{}", hex::encode(address.0));
        let index_hex = format!("0x{:x}", index);
        let value_hex = format!("0x{:x}", value);
        
        // Create the arguments object
        let args = js_sys::Object::new();
        js_sys::Reflect::set(&args, &"address".into(), &JsValue::from_str(&address_hex)).unwrap();
        js_sys::Reflect::set(&args, &"key".into(), &JsValue::from_str(&index_hex)).unwrap();
        js_sys::Reflect::set(&args, &"value".into(), &JsValue::from_str(&value_hex)).unwrap();
        
        // Call the putStorageAt method on the state manager
        match self.call_state_manager_method("putStorageAt", &args) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to put storage: {:?}", e)),
        }
    }
    
    // Block methods - forward to blockchain
    fn block_hash(&mut self, number: U256) -> Result<B256, Self::Error> {
        // Convert block number to JavaScript-friendly format
        let block_number_hex = format!("0x{:x}", number);
        
        // Call the getBlockHash method on the blockchain
        match self.call_blockchain_method("getBlockHashByNumber", &JsValue::from_str(&block_number_hex)) {
            Ok(hash) => {
                let hash_str = hash.as_string().unwrap_or_default();
                if hash_str.starts_with("0x") && hash_str.len() > 2 {
                    let hash_bytes = hex::decode(&hash_str[2..]).unwrap_or_default();
                    let mut hash_array = [0u8; 32];
                    if hash_bytes.len() == 32 {
                        hash_array.copy_from_slice(&hash_bytes);
                        Ok(B256::from(hash_array))
                    } else {
                        Err(format!("Invalid block hash length: {}", hash_bytes.len()))
                    }
                } else {
                    Err(format!("Invalid block hash format: {}", hash_str))
                }
            },
            Err(e) => Err(format!("Failed to get block hash: {:?}", e)),
        }
    }
}

#[wasm_bindgen]
pub struct Evm {
    // Using Either a JS proxy DB or a local cache DB
    db: Mutex<Option<Box<dyn Database<Error = String>>>>,
    options: Mutex<CreateEvmOptions>,
    is_ready: Mutex<bool>,
}

#[wasm_bindgen]
impl Evm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let options = CreateEvmOptions {
            common: None,
            state_manager: None,
            blockchain: None,
            custom_precompiles: None,
            profiler: None,
            allow_unlimited_contract_size: None,
            logging_level: None,
        };

        Evm {
            db: Mutex::new(None),
            options: Mutex::new(options),
            is_ready: Mutex::new(false),
        }
    }
    
    // Initialize the database based on options
    fn initialize_db(&self) -> Result<(), JsValue> {
        let mut db_lock = match self.db.lock() {
            Ok(lock) => lock,
            Err(_) => return Err(JsValue::from_str("Failed to acquire database lock")),
        };
        
        // If already initialized, we're done
        if db_lock.is_some() {
            return Ok(());
        }
        
        let options_lock = match self.options.lock() {
            Ok(lock) => lock,
            Err(_) => return Err(JsValue::from_str("Failed to acquire options lock")),
        };
        
        // Check if we have stateManager and blockchain
        if options_lock.state_manager.is_some() && options_lock.blockchain.is_some() {
            let state_manager = options_lock.state_manager.clone().unwrap();
            let blockchain = options_lock.blockchain.clone().unwrap();
            
            // Create a JS proxy database
            let js_proxy_db = JsProxyDB::new(state_manager, blockchain);
            *db_lock = Some(Box::new(js_proxy_db) as Box<dyn Database<Error = String>>);
        } else {
            // Fall back to in-memory database
            let cache_db = CacheDB::new(EmptyDB::default());
            *db_lock = Some(Box::new(cache_db) as Box<dyn Database<Error = String>>);
        }
        
        Ok(())
    }

    // Ready method to signal when the EVM is initialized
    #[wasm_bindgen]
    pub fn ready(&self) -> Promise {
        let is_ready = match self.is_ready.lock() {
            Ok(guard) => *guard,
            Err(_) => {
                return Promise::reject(&JsValue::from_str("Failed to acquire ready state lock"));
            }
        };
        
        if is_ready {
            // Return resolved promise if already ready
            return Promise::resolve(&JsValue::null());
        }
        
        // Initialize the database
        match self.initialize_db() {
            Ok(_) => {
                // Update the ready state
                match self.is_ready.lock() {
                    Ok(mut ready_state) => {
                        *ready_state = true;
                        Promise::resolve(&JsValue::null())
                    },
                    Err(_) => {
                        Promise::reject(&JsValue::from_str("Failed to update ready state"))
                    }
                }
            },
            Err(e) => {
                Promise::reject(&JsValue::from_str(&format!("Failed to initialize database: {:?}", e)))
            }
        }
    }

    // Add a custom precompile
    #[wasm_bindgen]
    pub fn add_custom_precompile(&self, precompile: JsValue) -> Result<(), JsValue> {
        // This is a placeholder - in a full implementation, this would register a custom precompile
        Err(JsValue::from_str("Custom precompiles not implemented yet"))
    }

    // Remove a custom precompile
    #[wasm_bindgen]
    pub fn remove_custom_precompile(&self, precompile: JsValue) -> Result<(), JsValue> {
        // This is a placeholder - in a full implementation, this would unregister a custom precompile
        Err(JsValue::from_str("Custom precompiles not implemented yet"))
    }

    // Run an EVM call
    #[wasm_bindgen]
    pub fn run_call(&self, call_data_js: JsValue) -> Promise {
        let call_data: CallData = match serde_wasm_bindgen::from_value(call_data_js) {
            Ok(data) => data,
            Err(e) => {
                let error_msg = format!("Failed to parse call data: {}", e);
                return Promise::reject(&JsValue::from_str(&error_msg));
            }
        };

        // Ensure the EVM is initialized
        match self.initialize_db() {
            Ok(_) => {},
            Err(e) => {
                return Promise::reject(&JsValue::from_str(&format!("Failed to initialize database: {:?}", e)));
            }
        }

        // Get database lock
        let mut db_lock = match self.db.lock() {
            Ok(lock) => lock,
            Err(e) => {
                let error_msg = format!("Failed to acquire database lock: {}", e);
                return Promise::reject(&JsValue::from_str(&error_msg));
            }
        };
        
        // Ensure we have a database
        let db_ref = match db_lock.as_mut() {
            Some(db) => db,
            None => {
                return Promise::reject(&JsValue::from_str("Database not initialized"));
            }
        };

        // Parse addresses and data
        let caller = match parse_address(&call_data.caller, "0x0000000000000000000000000000000000000000") {
            Ok(addr) => addr,
            Err(e) => return Promise::reject(&JsValue::from_str(&e)),
        };

        // Determine transaction kind (call or create)
        let kind = if let Some(to_str) = &call_data.to {
            match parse_address(&Some(to_str.clone()), "") {
                Ok(to_addr) => TxKind::Call(to_addr),
                Err(e) => return Promise::reject(&JsValue::from_str(&e)),
            }
        } else {
            TxKind::Create
        };

        // Parse call data
        let data = match call_data.data {
            Some(ref data_str) => {
                match parse_bytes(data_str) {
                    Ok(bytes) => bytes,
                    Err(e) => return Promise::reject(&JsValue::from_str(&e)),
                }
            },
            None => Bytes::default(),
        };

        // Parse value
        let value = match call_data.value {
            Some(ref value_str) => {
                match parse_u256(value_str) {
                    Ok(v) => v,
                    Err(e) => return Promise::reject(&JsValue::from_str(&e)),
                }
            },
            None => U256::ZERO,
        };

        // Get the options
        let options = match self.options.lock() {
            Ok(opts) => opts.clone(),
            Err(e) => {
                let error_msg = format!("Failed to acquire options lock: {}", e);
                return Promise::reject(&JsValue::from_str(&error_msg));
            }
        };

        // Create EVM context with chain configuration
        let chain_id = match &options.common {
            Some(common) => {
                match js_sys::Reflect::get(&JsValue::from_serde(&common).unwrap(), &"chainId".into()) {
                    Ok(chain_id_val) => {
                        if let Some(chain_id_str) = chain_id_val.as_string() {
                            if chain_id_str.starts_with("0x") {
                                u64::from_str_radix(&chain_id_str[2..], 16).unwrap_or(1)
                            } else {
                                chain_id_str.parse::<u64>().unwrap_or(1)
                            }
                        } else {
                            1
                        }
                    },
                    Err(_) => 1,
                }
            },
            None => 1,
        };

        // Create EVM context with the specified chain ID
        let ctx = Context::builder()
            .with_chain_id(chain_id)
            .modify_tx_chained(|tx| {
                tx.caller = caller;
                tx.kind = kind;
                tx.data = data;
                tx.value = value;
                tx.gas_limit = call_data.gas_limit.unwrap_or(10000000);
                tx.storage = if call_data.skip_balance.unwrap_or(false) {
                    TxStorage::Skip
                } else {
                    TxStorage::Private
                };
            });

        // Build the EVM with our database
        let mut evm = ctx.build().unwrap();
        
        // Set the database
        evm.db = db_ref.as_mut();
        
        // Set unlimited contract size if specified
        if let Some(unlimited) = options.allow_unlimited_contract_size {
            if unlimited {
                evm.spec().constraint_size = false;
            }
        }

        // Execute the transaction
        let result = match evm.transact() {
            Ok(result) => {
                // Check if execution succeeded or reverted
                match &result.result.is_success {
                    true => result,
                    false => {
                        // Get revert reason if available
                        let revert_reason = match &result.result.output {
                            revm::primitives::context_interface::result::Output::Call(bytes) => {
                                if bytes.len() >= 4 && bytes[0..4] == [0x08, 0xc3, 0x79, 0xa0] {
                                    // This is the Error(string) selector, try to extract the string
                                    if bytes.len() > 68 {
                                        let data_offset = 36; // Skip selector and offset word
                                        let data_length_bytes = &bytes[data_offset..data_offset+32];
                                        let mut data_length_array = [0u8; 32];
                                        data_length_array.copy_from_slice(data_length_bytes);
                                        let data_length = u64::from_be_bytes(data_length_array[24..32].try_into().unwrap_or([0; 8]));
                                        
                                        if data_length > 0 && data_length < 1000 && bytes.len() >= (data_offset + 32 + data_length as usize) {
                                            let message_bytes = &bytes[data_offset+32..data_offset+32+data_length as usize];
                                            String::from_utf8_lossy(message_bytes).to_string()
                                        } else {
                                            "Unknown revert reason".to_string()
                                        }
                                    } else {
                                        "Transaction reverted".to_string()
                                    }
                                } else {
                                    format!("Transaction reverted with bytes: 0x{}", hex::encode(bytes))
                                }
                            },
                            _ => "Transaction reverted".to_string()
                        };
                        
                        let error_msg = format!("Execution reverted: {}", revert_reason);
                        return Promise::reject(&JsValue::from_str(&error_msg));
                    }
                }
            },
            Err(e) => {
                let error_msg = format!("Transaction execution failed: {:?}", e);
                return Promise::reject(&JsValue::from_str(&error_msg));
            }
        };

        // Extract result data
        let output = match &result.result.output {
            revm::primitives::context_interface::result::Output::Call(bytes) => {
                hex::encode(bytes)
            },
            revm::primitives::context_interface::result::Output::Create(bytes, _) => {
                hex::encode(bytes)
            },
            _ => "".to_string(),
        };

        // Extract logs from the result
        let logs = result.result.logs.iter().map(|log| {
            // Convert log topics to hex strings
            let topics = log.topics.iter()
                .map(|topic| format!("0x{}", hex::encode(topic.0)))
                .collect::<Vec<String>>();
            
            // Convert log data to hex string
            let data = format!("0x{}", hex::encode(&log.data));
            
            // Create log entry
            LogEntry {
                address: format!("0x{}", hex::encode(log.address.0)),
                topics,
                data,
            }
        }).collect::<Vec<LogEntry>>();
        
        // Create our result object
        let call_result = CallResult {
            result: format!("0x{}", output),
            gas_used: result.result.gas_used,
            logs,
        };

        // Convert to JS value and return
        match serde_wasm_bindgen::to_value(&call_result) {
            Ok(js_value) => Promise::resolve(&js_value),
            Err(e) => {
                let error_msg = format!("Failed to serialize result: {}", e);
                Promise::reject(&JsValue::from_str(&error_msg))
            }
        }
    }

    // Set account state directly (useful for testing)
    #[wasm_bindgen]
    pub fn set_account(&mut self, address_str: String, balance_str: Option<String>, code_str: Option<String>, nonce: Option<u64>) -> Result<(), JsValue> {
        // Parse address
        let address = match parse_address(&Some(address_str), "") {
            Ok(addr) => addr,
            Err(e) => return Err(JsValue::from_str(&e)),
        };

        // Parse balance
        let balance = match balance_str {
            Some(ref b_str) => {
                match parse_u256(b_str) {
                    Ok(b) => b,
                    Err(e) => return Err(JsValue::from_str(&e)),
                }
            },
            None => U256::ZERO,
        };

        // Parse code
        let (code, code_hash) = match code_str {
            Some(ref c_str) => {
                match parse_bytes(c_str) {
                    Ok(bytes) => {
                        let hash = revm::primitives::keccak256(&bytes);
                        (Some(bytes), hash)
                    },
                    Err(e) => return Err(JsValue::from_str(&e)),
                }
            },
            None => (None, KECCAK_EMPTY),
        };

        // Create account info
        let account_info = AccountInfo {
            nonce: nonce.unwrap_or(0),
            balance,
            code_hash,
            code: code.map(|c| revm::primitives::Bytecode::new_raw(c)),
        };

        // Insert into database
        let mut db = self.db.lock().unwrap();
        db.insert_account_info(address, account_info);

        Ok(())
    }

    // Get account info
    #[wasm_bindgen]
    pub fn get_account(&self, address_str: String) -> Result<JsValue, JsValue> {
        // Parse address
        let address = match parse_address(&Some(address_str), "") {
            Ok(addr) => addr,
            Err(e) => return Err(JsValue::from_str(&e)),
        };

        // Get from database
        let mut db = self.db.lock().unwrap();
        let account_info = match db.basic(address) {
            Ok(Some(info)) => info,
            Ok(None) => {
                // Account doesn't exist, return empty account
                return Ok(serde_wasm_bindgen::to_value(&serde_json::json!({
                    "balance": "0x0",
                    "nonce": 0,
                    "codeHash": format!("0x{}", hex::encode(KECCAK_EMPTY.0)),
                    "code": null
                })).unwrap())
            },
            Err(e) => return Err(JsValue::from_str(&format!("Database error: {:?}", e))),
        };

        // Convert to JS-friendly format - ensure proper hex formatting for the balance
        let balance_hex = format!("0x{:x}", account_info.balance);
        let result = serde_json::json!({
            "balance": balance_hex,
            "nonce": account_info.nonce,
            "codeHash": format!("0x{}", hex::encode(account_info.code_hash.0)),
            "code": account_info.code.as_ref().map(|c| format!("0x{}", hex::encode(c.original_bytes())))
        });

        Ok(serde_wasm_bindgen::to_value(&result).unwrap())
    }
}

// Factory function to create a new EVM instance
#[wasm_bindgen]
pub fn create_evm(options_js: JsValue) -> Promise {
    let options_result: Result<CreateEvmOptions, _> = serde_wasm_bindgen::from_value(options_js);
    
    match options_result {
        Ok(options) => {
            let mut evm = Evm::new();
            match evm.options.lock() {
                Ok(mut opts) => {
                    *opts = options;
                },
                Err(_) => {
                    return Promise::reject(&JsValue::from_str("Failed to acquire lock for options"));
                }
            }
            
            // Mark as ready
            match evm.is_ready.lock() {
                Ok(mut ready) => {
                    *ready = true;
                },
                Err(_) => {
                    return Promise::reject(&JsValue::from_str("Failed to acquire lock for ready state"));
                }
            }
            
            // Convert to JsValue and return as resolved promise
            match serde_wasm_bindgen::to_value(&evm) {
                Ok(js_evm) => Promise::resolve(&js_evm),
                Err(e) => Promise::reject(&JsValue::from_str(&format!("Failed to convert EVM to JS value: {}", e))),
            }
        },
        Err(e) => Promise::reject(&JsValue::from_str(&format!("Invalid options: {}", e))),
    }
}

// ------ Helper Functions ------

fn parse_address(address_opt: &Option<String>, default: &str) -> Result<Address, String> {
    match address_opt {
        Some(addr_str) => {
            let addr_str = if addr_str.starts_with("0x") {
                &addr_str[2..]
            } else {
                addr_str
            };
            
            match hex::decode(addr_str) {
                Ok(bytes) => {
                    if bytes.len() != 20 {
                        return Err(format!("Invalid address length: {}", bytes.len()));
                    }
                    let mut address_bytes = [0u8; 20];
                    address_bytes.copy_from_slice(&bytes);
                    Ok(Address::from(address_bytes))
                },
                Err(e) => Err(format!("Failed to decode address: {}", e)),
            }
        },
        None => {
            if default.is_empty() {
                Err("Address is required".to_string())
            } else {
                let default_str = if default.starts_with("0x") {
                    &default[2..]
                } else {
                    default
                };
                
                match hex::decode(default_str) {
                    Ok(bytes) => {
                        if bytes.len() != 20 {
                            return Err(format!("Invalid default address length: {}", bytes.len()));
                        }
                        let mut address_bytes = [0u8; 20];
                        address_bytes.copy_from_slice(&bytes);
                        Ok(Address::from(address_bytes))
                    },
                    Err(e) => Err(format!("Failed to decode default address: {}", e)),
                }
            }
        }
    }
}

fn parse_bytes(hex_str: &str) -> Result<Bytes, String> {
    let hex_str = if hex_str.starts_with("0x") {
        &hex_str[2..]
    } else {
        hex_str
    };
    
    match hex::decode(hex_str) {
        Ok(bytes) => Ok(Bytes::from(bytes)),
        Err(e) => Err(format!("Failed to decode bytes: {}", e)),
    }
}

fn parse_u256(value_str: &str) -> Result<U256, String> {
    let value_str = if value_str.starts_with("0x") {
        let hex_str = &value_str[2..];
        // Convert hex to U256
        match hex::decode(hex_str) {
            Ok(bytes) => {
                // Pad to 32 bytes
                let mut padded = vec![0u8; 32];
                let start = if bytes.len() > 32 { bytes.len() - 32 } else { 0 };
                let copy_start = 32 - bytes.len().min(32);
                padded[copy_start..].copy_from_slice(&bytes[start..]);
                
                let mut be_bytes = [0u8; 32];
                be_bytes.copy_from_slice(&padded);
                return Ok(U256::from_be_bytes(be_bytes));
            },
            Err(e) => return Err(format!("Failed to decode hex value: {}", e)),
        }
    } else {
        // Try to parse as decimal
        match value_str.parse::<u128>() {
            Ok(num) => return Ok(U256::from(num)),
            Err(_) => return Err(format!("Failed to parse value: {}", value_str)),
        }
    };
}