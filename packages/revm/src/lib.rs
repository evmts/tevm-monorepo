use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a simple structure
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct TevmRevmVersion {
    version: String,
}

#[wasm_bindgen]
pub struct TevmRevm {}

#[wasm_bindgen]
impl TevmRevm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        TevmRevm {}
    }

    #[wasm_bindgen]
    pub fn get_version(&self) -> String {
        let version = TevmRevmVersion {
            version: "0.1.0".to_string(),
        };
        
        match serde_json::to_string(&version) {
            Ok(json) => json,
            Err(_) => "{\"version\":\"error\"}".to_string(),
        }
    }
}

// Create a default instance for direct usage
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}