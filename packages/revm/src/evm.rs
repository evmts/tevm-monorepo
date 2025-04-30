use crate::types::{EvmCallResult, TevmRevmVersion};
use crate::utils::{parse_data, parse_u256};
use bytes::Bytes as BytesType;
use revm::primitives::{alloy_primitives, Address};
use revm::{
    db::{CacheDB, DatabaseRef, EmptyDB},
    primitives::{
        AccountInfo, Bytecode, Bytes, Env, ExecutionResult, Output, TransactTo, TxEnv, U256,
    },
    EVM,
};
use std::cmp::min;
use std::str::FromStr;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn debug(s: &str);
}

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

        log("===== INITIALIZING TEVM EVM INSTANCE =====");
        log(&format!("REVM Version: {}", env!("CARGO_PKG_VERSION")));

        let db = CacheDB::new(EmptyDB::default());
        log("Database: CacheDB<EmptyDB> initialized");

        log("Creating EVM ");
        let mut evm = EVM::new();

        evm.database(db.clone());

        let mut env = Env::default();

        env.cfg.spec_id = revm::primitives::SpecId::SHANGHAI;
        log(&format!("Setting EVM spec ID to: {:?}", env.cfg.spec_id));

        env.block.number = U256::from(1);
        env.block.timestamp = U256::from(1);
        env.cfg.chain_id = 1;

        evm.env = env;

        log("===== REVM CONFIGURATION DETAILS =====");
        log(&format!("Database type: CacheDB<EmptyDB>"));
        log(&format!("Spec ID: {:?}", evm.env.cfg.spec_id));
        log(&format!("Chain ID: {}", evm.env.cfg.chain_id));
        log(&format!("Block number: {}", evm.env.block.number));

        TevmEVM { db, evm }
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
        let address = alloy_primitives::Address::from_str(address)?;
        let balance = parse_u256(balance)?;

        let mut account_info = match self.db.basic(address) {
            Ok(Some(info)) => info,
            _ => AccountInfo::default(),
        };

        account_info.balance = balance;

        self.db.insert_account_info(address, account_info);

        Ok(())
    }

    #[wasm_bindgen]
    pub fn set_account_code(&mut self, address: &str, code: &str) -> Result<(), JsValue> {
        let address = alloy_primitives::Address::from_str(address).unwrap();

        let mut account_info = match self.db.basic(address) {
            Ok(Some(info)) => info,
            _ => AccountInfo::default(),
        };

        let code_bytes = match hex::decode(&code[2..]) {
            Ok(bytes) => bytes,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid hex code: {}", e))),
        };

        let mut has_return = false;
        let mut return_positions = Vec::new();

        account_info.code = Some(Bytecode::new_raw(Bytes(BytesType::from(code_bytes))));

        self.db.insert_account_info(address, account_info);

        log(&format!("Account code set for address {}", address));

        Ok(())
    }

    #[wasm_bindgen]
    pub fn call(&mut self, input_json: &str) -> String {
        String::new()
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.db = CacheDB::new(EmptyDB::default());

        self.evm = EVM::new();
        self.evm.database(self.db.clone());
    }
}

