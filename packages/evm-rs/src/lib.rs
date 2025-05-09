use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator to make the WASM bundle smaller.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// A macro to provide `println!(..)` to wasm environments
macro_rules! console_log {
    ($($t:tt)*) => (log(&format!($($t)*)));
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! This is evm-rs from WASM!", name)
}

// Function to initialize panic hook in debug builds
#[wasm_bindgen]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// This will be used as the EVM interpreter in the future
#[wasm_bindgen]
pub struct EvmInterpreter {
    version: String,
}

#[wasm_bindgen]
impl EvmInterpreter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        init(); // Set panic hook
        Self {
            version: "0.1.0".to_string(),
        }
    }

    #[wasm_bindgen]
    pub fn get_version(&self) -> String {
        self.version.clone()
    }

    // Future: This will interpret EVM bytecode
    #[wasm_bindgen]
    pub fn interpret(&self, bytecode: &str) -> String {
        format!("Will interpret bytecode in future: {}", bytecode)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn test_greet() {
        let result = greet("Tevm");
        assert!(result.contains("Hello, Tevm"));
    }

    #[wasm_bindgen_test]
    fn test_interpreter() {
        let interpreter = EvmInterpreter::new();
        assert_eq!(interpreter.get_version(), "0.1.0");
        
        let result = interpreter.interpret("0x60806040");
        assert!(result.contains("Will interpret bytecode"));
    }
}