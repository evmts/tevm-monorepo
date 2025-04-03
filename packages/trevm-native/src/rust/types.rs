use alloy_primitives::{Address, Bytes, U256};
use napi::bindgen_prelude::*;
use std::str::FromStr;

/// Convert a JavaScript hex string to an Address
pub fn js_to_address(hex: String) -> Result<Address> {
    Address::from_str(&hex).map_err(|e| {
        Error::new(
            Status::InvalidArg,
            format!("Failed to parse address: {}", e),
        )
    })
}

/// Convert an Address to a JavaScript hex string
pub fn address_to_js(address: Address) -> String {
    format!("{:#x}", address)
}

/// Convert a JavaScript hex string to Bytes
pub fn js_to_bytes(hex: String) -> Result<Bytes> {
    if hex.starts_with("0x") {
        let hex = hex.trim_start_matches("0x");
        let bytes = hex::decode(hex).map_err(|e| {
            Error::new(
                Status::InvalidArg,
                format!("Failed to parse hex bytes: {}", e),
            )
        })?;
        Ok(bytes.into())
    } else {
        Err(Error::new(
            Status::InvalidArg,
            "Hex string must start with 0x",
        ))
    }
}

/// Convert Bytes to a JavaScript hex string
pub fn bytes_to_js(bytes: Bytes) -> String {
    format!("0x{}", hex::encode(bytes))
}

/// Convert a JavaScript bigint to U256
pub fn js_to_u256(value: BigInt) -> Result<U256> {
    let bytes = value.to_bytes()?;
    let bytes_vec = bytes.bytes().map_err(|e| {
        Error::new(
            Status::InvalidArg,
            format!("Failed to extract bytes from BigInt: {}", e),
        )
    })?;
    
    // Convert to U256 based on sign
    if bytes.sign_bit {
        // Negative numbers are not supported
        return Err(Error::new(
            Status::InvalidArg,
            "Negative values are not supported for U256",
        ));
    }

    let mut array = [0u8; 32];
    let start = array.len() - bytes_vec.len();
    array[start..].copy_from_slice(&bytes_vec);
    
    Ok(U256::from_be_bytes(array))
}

/// Convert U256 to a JavaScript bigint
pub fn u256_to_js(value: U256) -> BigInt {
    BigInt::from_bytes_be(false, &value.to_be_bytes())
}

#[derive(Debug)]
pub enum StateRequest {
    GetAccount(Address),
    PutAccount(Address, Account),
    GetStorage(Address, U256),
    PutStorage(Address, U256, U256),
    GetCode(Address),
    PutCode(Address, Bytes),
}

#[derive(Debug)]
pub struct Account {
    pub nonce: U256,
    pub balance: U256,
    pub code_hash: Option<Bytes>,
    pub code: Option<Bytes>,
}

#[napi(object)]
pub struct JsAccount {
    pub nonce: Option<BigInt>,
    pub balance: Option<BigInt>,
    pub code_hash: Option<String>,
    pub code: Option<String>,
}

impl TryFrom<JsAccount> for Account {
    type Error = Error;

    fn try_from(js_account: JsAccount) -> Result<Self> {
        Ok(Account {
            nonce: js_account.nonce.map(js_to_u256).transpose()?.unwrap_or_default(),
            balance: js_account.balance.map(js_to_u256).transpose()?.unwrap_or_default(),
            code_hash: js_account.code_hash.map(js_to_bytes).transpose()?,
            code: js_account.code.map(js_to_bytes).transpose()?,
        })
    }
}

impl From<Account> for JsAccount {
    fn from(account: Account) -> Self {
        JsAccount {
            nonce: Some(u256_to_js(account.nonce)),
            balance: Some(u256_to_js(account.balance)),
            code_hash: account.code_hash.map(bytes_to_js),
            code: account.code.map(bytes_to_js),
        }
    }
}