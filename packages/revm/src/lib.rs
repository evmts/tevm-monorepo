use bytes::Bytes as BytesType;
use primitive_types::U256 as PrimitiveU256;
use revm::{
    db::{DatabaseRef, CacheDB, EmptyDB},
    primitives::{
        AccountInfo, Address, Bytecode, ExecutionResult, Env, TransactTo, TxEnv, Bytes, Output, U256
    },
    EVM,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Call input parameters
#[derive(Serialize, Deserialize)]
pub struct EvmCallInput {
    from: String,
    to: String,
    gas_limit: String,
    value: String,
    data: String,
}

// Call result
#[derive(Serialize, Deserialize)]
pub struct EvmCallResult {
    success: bool,
    gas_used: String,
    return_value: String,
    error: Option<String>,
}

// Version info
#[derive(Serialize, Deserialize)]
pub struct TevmRevmVersion {
    version: String,
}

// Main REVM wrapper
#[wasm_bindgen]
pub struct TevmEVM {
    db: CacheDB<EmptyDB>,
    evm: EVM<CacheDB<EmptyDB>>,
}

#[wasm_bindgen]
impl TevmEVM {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        let db = CacheDB::new(EmptyDB::default());
        let mut evm = EVM::new();
        
        // Initialize with default database
        evm.database(db.clone());
        
        // Create the EVM instance
        TevmEVM { 
            db,
            evm
        }
    }

    #[wasm_bindgen]
    pub fn get_version(&self) -> String {
        let version = TevmRevmVersion {
            version: env!("CARGO_PKG_VERSION").to_string(),
        };

        match serde_json::to_string(&version) {
            Ok(json) => json,
            Err(_) => "{\"version\":\"error\"}".to_string(),
        }
    }
    
    #[wasm_bindgen]
    pub fn set_account_balance(&mut self, address: &str, balance: &str) -> Result<(), JsValue> {
        let address = parse_address(address)?;
        let balance = parse_u256(balance)?;
        
        // Get or create account
        let mut account_info = match self.db.basic(address) {
            Ok(Some(info)) => info,
            _ => AccountInfo::default(),
        };
        
        // Update balance
        account_info.balance = balance;
        
        // Store updated account
        self.db.insert_account_info(address, account_info);
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn set_account_code(&mut self, address: &str, code: &str) -> Result<(), JsValue> {
        let address = parse_address(address)?;
        
        // Get or create account
        let mut account_info = match self.db.basic(address) {
            Ok(Some(info)) => info,
            _ => AccountInfo::default(),
        };
        
        // Parse hex code
        let code_bytes = match hex::decode(&code[2..]) {
            Ok(bytes) => bytes,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid hex code: {}", e))),
        };
        
        // Update code
        account_info.code = Some(Bytecode::new_raw(Bytes(BytesType::from(code_bytes))));
        
        // Store updated account
        self.db.insert_account_info(address, account_info);
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn call(&mut self, input_json: &str) -> String {
        // Parse input
        let input: EvmCallInput = match serde_json::from_str(input_json) {
            Ok(input) => input,
            Err(e) => {
                return serde_json::to_string(&EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Failed to parse input: {}", e)),
                }).unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string());
            }
        };
        
        // Parse addresses
        let from_addr = match parse_address(&input.from) {
            Ok(addr) => addr,
            Err(e) => {
                return serde_json::to_string(&EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Invalid 'from' address: {:?}", e)),
                }).unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string());
            }
        };
        
        let to_addr = match parse_address(&input.to) {
            Ok(addr) => addr,
            Err(e) => {
                return serde_json::to_string(&EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Invalid 'to' address: {:?}", e)),
                }).unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string());
            }
        };
        
        // Parse gas limit
        let gas_limit = match input.gas_limit.parse::<u64>() {
            Ok(gas) => gas,
            Err(e) => {
                return serde_json::to_string(&EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Invalid gas limit: {}", e)),
                }).unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string());
            }
        };
        
        // Parse value
        let value = match parse_u256(&input.value) {
            Ok(val) => val,
            Err(e) => {
                return serde_json::to_string(&EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Invalid value: {:?}", e)),
                }).unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string());
            }
        };
        
        // Parse data
        let data = match parse_data(&input.data) {
            Ok(data) => data,
            Err(e) => {
                return serde_json::to_string(&EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Invalid data: {:?}", e)),
                }).unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string());
            }
        };
        
        // Setup EVM environment
        let mut env = Env::default();
        let mut tx_env = TxEnv::default();
        
        tx_env.caller = from_addr;
        tx_env.transact_to = TransactTo::Call(to_addr);
        tx_env.gas_limit = gas_limit;
        tx_env.value = value;
        tx_env.data = data;
        
        env.tx = tx_env;
        
        // Update EVM environment
        self.evm.env = env;
        
        // Execute the call
        let result = match self.evm.transact() {
            Ok(result) => match result.result {
                ExecutionResult::Success { gas_used, output, .. } => {
                    let output_bytes = match output {
                        Output::Call(bytes) => bytes.0.to_vec(),
                        Output::Create(bytes, _) => bytes.0.to_vec(),
                    };
                    EvmCallResult {
                        success: true,
                        gas_used: gas_used.to_string(),
                        return_value: format!("0x{}", hex::encode(output_bytes)),
                        error: None,
                    }
                },
                ExecutionResult::Revert { gas_used, output } => {
                    EvmCallResult {
                        success: false,
                        gas_used: gas_used.to_string(),
                        return_value: format!("0x{}", hex::encode(output.0.to_vec())),
                        error: Some("Execution reverted".to_string()),
                    }
                },
                ExecutionResult::Halt { gas_used, reason, .. } => {
                    EvmCallResult {
                        success: false,
                        gas_used: gas_used.to_string(),
                        return_value: "0x".to_string(),
                        error: Some(format!("Execution halted: {:?}", reason)),
                    }
                },
            },
            Err(e) => {
                EvmCallResult {
                    success: false,
                    gas_used: "0".to_string(),
                    return_value: "0x".to_string(),
                    error: Some(format!("Transaction failed: {:?}", e)),
                }
            }
        };
        
        // Return result as JSON
        serde_json::to_string(&result)
            .unwrap_or_else(|_| "{\"success\":false,\"error\":\"JSON serialization error\"}".to_string())
    }
    
    #[wasm_bindgen]
    pub fn reset(&mut self) {
        // Reset database
        self.db = CacheDB::new(EmptyDB::default());
        
        // Re-initialize EVM
        self.evm = EVM::new();
        self.evm.database(self.db.clone());
    }
}

// Helper function to parse address from hex string
fn parse_address(addr: &str) -> Result<Address, JsValue> {
    if !addr.starts_with("0x") {
        return Err(JsValue::from_str("Address must start with 0x"));
    }
    
    let addr_str = &addr[2..]; // Remove 0x prefix
    let addr_bytes = match hex::decode(addr_str) {
        Ok(bytes) => bytes,
        Err(e) => return Err(JsValue::from_str(&format!("Invalid hex address: {}", e))),
    };
    
    if addr_bytes.len() != 20 {
        return Err(JsValue::from_str("Address must be 20 bytes"));
    }
    
    let mut addr_array = [0u8; 20];
    addr_array.copy_from_slice(&addr_bytes);
    
    Ok(Address::from(addr_array))
}

// Helper function to parse U256 from decimal string
fn parse_u256(value: &str) -> Result<U256, JsValue> {
    match value.parse::<PrimitiveU256>() {
        Ok(value) => {
            let mut bytes = [0u8; 32];
            value.to_big_endian(&mut bytes);
            Ok(U256::from_be_bytes(bytes))
        },
        Err(e) => Err(JsValue::from_str(&format!("Invalid U256 value: {}", e))),
    }
}

// Helper function to parse data from hex string
fn parse_data(data: &str) -> Result<Bytes, JsValue> {
    if !data.starts_with("0x") {
        return Err(JsValue::from_str("Data must start with 0x"));
    }
    
    let data_str = &data[2..]; // Remove 0x prefix
    let data_bytes = match hex::decode(data_str) {
        Ok(bytes) => bytes,
        Err(e) => return Err(JsValue::from_str(&format!("Invalid hex data: {}", e))),
    };
    
    Ok(Bytes(BytesType::from(data_bytes)))
}