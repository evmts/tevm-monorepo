use revm::{InMemoryDB, EVM as rEVM};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct EVM {
    revm: rEVM<InMemoryDB>,
}

impl Default for EVM {
    fn default() -> Self {
        EVM::new()
    }
}

#[wasm_bindgen]
impl EVM {
    pub fn new() -> EVM {
        console_log!("EVM created");
        let mut evm = EVM { revm: rEVM::new() };
        evm.revm.database(InMemoryDB::default());
        evm
    }
}
