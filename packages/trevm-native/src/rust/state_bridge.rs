use alloy_primitives::{Address, Bytes, U256};
use napi::bindgen_prelude::*;
use std::sync::Arc;
use tokio::sync::Mutex;
use trevm::db::traits::{BlockHashReader, Database};

use crate::types::{js_to_address, js_to_bytes, js_to_u256, Account, JsAccount};

pub struct StateBridge {
    get_account: ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>,
    put_account: ThreadsafeFunction<(String, JsAccount), ErrorStrategy::CalleeHandled>,
    get_storage: ThreadsafeFunction<(String, String), ErrorStrategy::CalleeHandled>,
    put_storage: ThreadsafeFunction<(String, String, String), ErrorStrategy::CalleeHandled>,
    get_code: ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>,
    put_code: ThreadsafeFunction<(String, String), ErrorStrategy::CalleeHandled>,
    get_block_hash: ThreadsafeFunction<u64, ErrorStrategy::CalleeHandled>,
}

impl StateBridge {
    pub fn new(
        get_account: ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>,
        put_account: ThreadsafeFunction<(String, JsAccount), ErrorStrategy::CalleeHandled>,
        get_storage: ThreadsafeFunction<(String, String), ErrorStrategy::CalleeHandled>,
        put_storage: ThreadsafeFunction<(String, String, String), ErrorStrategy::CalleeHandled>,
        get_code: ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>,
        put_code: ThreadsafeFunction<(String, String), ErrorStrategy::CalleeHandled>,
        get_block_hash: ThreadsafeFunction<u64, ErrorStrategy::CalleeHandled>,
    ) -> Self {
        Self {
            get_account,
            put_account,
            get_storage,
            put_storage,
            get_code,
            put_code,
            get_block_hash,
        }
    }
}

#[async_trait::async_trait]
impl Database for StateBridge {
    type Error = Error;

    async fn basic_account(&self, address: Address) -> Result<Option<trevm::revm::primitives::Account>> {
        let address_str = format!("{:#x}", address);
        
        // Call JavaScript to get account
        let js_account = self.get_account
            .call_async(address_str)
            .await?;
            
        // If null was returned, return None
        if js_account.is_undefined() || js_account.is_null() {
            return Ok(None);
        }
        
        // Parse returned account object
        let js_account: JsAccount = serde_json::from_value(js_account).map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Failed to parse account from JavaScript: {}", e),
            )
        })?;
        
        // Convert to Rust account
        let account: Account = js_account.try_into()?;
        
        // Convert to revm Account
        Ok(Some(trevm::revm::primitives::Account {
            balance: account.balance,
            nonce: account.nonce,
            code_hash: account.code_hash.map(|h| h.into()).unwrap_or_default(),
            code: account.code.map(|c| c.into()),
        }))
    }

    async fn code_by_hash(&self, code_hash: trevm::revm::primitives::B256) -> Result<Bytes> {
        // For simplicity in this prototype, we'll fetch the code by address
        // In a full implementation, we would need to maintain a mapping from code_hash to address
        // or directly implement code_by_hash
        Err(Error::new(
            Status::NotImplemented,
            "code_by_hash not implemented in this prototype",
        ))
    }

    async fn storage(
        &self,
        address: Address,
        index: U256,
    ) -> Result<trevm::revm::primitives::U256> {
        let address_str = format!("{:#x}", address);
        let index_str = format!("{:#x}", index);
        
        // Call JavaScript to get storage
        let storage_value = self.get_storage
            .call_async((address_str, index_str))
            .await?;
            
        // Parse returned value
        if storage_value.is_undefined() || storage_value.is_null() {
            return Ok(U256::ZERO);
        }
        
        let storage_hex: String = serde_json::from_value(storage_value).map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Failed to parse storage value from JavaScript: {}", e),
            )
        })?;
        
        // Convert hex string to U256
        let value = U256::from_str_radix(&storage_hex.trim_start_matches("0x"), 16).map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Failed to parse storage hex as U256: {}", e),
            )
        })?;
        
        Ok(value)
    }

    async fn block_hash(&self, number: u64) -> Result<trevm::revm::primitives::B256> {
        // Call JavaScript to get block hash
        let hash = self.get_block_hash.call_async(number).await?;
        
        if hash.is_undefined() || hash.is_null() {
            return Err(Error::new(
                Status::GenericFailure,
                format!("Block hash not found for block {}", number),
            ));
        }
        
        let hash_hex: String = serde_json::from_value(hash).map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Failed to parse block hash from JavaScript: {}", e),
            )
        })?;
        
        // Convert hex string to B256
        let hash_bytes = js_to_bytes(hash_hex)?;
        let mut hash_array = [0u8; 32];
        hash_array.copy_from_slice(&hash_bytes);
        
        Ok(trevm::revm::primitives::B256::from(hash_array))
    }
}

#[async_trait::async_trait]
impl BlockHashReader for StateBridge {
    type Error = Error;

    async fn block_hash(&self, number: u64) -> Result<trevm::revm::primitives::B256> {
        Database::block_hash(self, number).await
    }
}