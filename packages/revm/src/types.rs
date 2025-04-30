use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct EvmCallInput {
    pub from: String,
    pub to: String,
    pub gas_limit: String,
    pub value: String,
    pub data: String,
}

// Call result
#[derive(Serialize, Deserialize)]
pub struct EvmCallResult {
    pub success: bool,
    pub gas_used: String,
    pub return_value: String,
    pub error: Option<String>,
}

// Version info
#[derive(Serialize, Deserialize)]
pub struct TevmRevmVersion {
    pub version: String,
}

