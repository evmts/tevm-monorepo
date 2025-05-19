extern "C" {
    // src/utils/keccak256.zig
    fn keccak256(input: *const u8, input_len: usize, output: *mut u8);

    // src/root.zig EVM functions
    fn loadBytecode_zig(bytecode_hex: *const u8, bytecode_hex_len: usize);
    fn resetEvm_zig();
    fn stepEvm_zig(state: *mut u8, state_len: *mut usize);
    fn toggleRunPause_zig(state: *mut u8, state_len: *mut usize);
    fn getEvmState_zig(state: *mut u8, state_len: *mut usize);
}

#[tauri::command]
fn greet(name: &str) -> String {
    let mut output = [0u8; 32];

    unsafe {
        keccak256(name.as_ptr(), name.len(), output.as_mut_ptr());
    }

    let hash = output
        .iter()
        .map(|byte| format!("{:02x}", byte))
        .collect::<String>();

    format!(
        "Hello, {}! You've been greeted from Zig via rust! Your Kekkak256 of your name is {}",
        name, hash
    )
}

#[tauri::command]
fn loadBytecode(bytecode_hex: String) {
    unsafe {
        loadBytecode_zig(bytecode_hex.as_ptr(), bytecode_hex.len());
    }
}

#[tauri::command]
fn resetEvm() {
    unsafe {
        resetEvm_zig();
    }
}

#[tauri::command]
fn stepEvm() -> serde_json::Value {
    // Buffer to hold state JSON
    let mut buffer = vec![0u8; 1024]; // Allocate a reasonable buffer size
    let mut buffer_len = buffer.len();

    unsafe {
        stepEvm_zig(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        // Error occurred, return empty object
        return serde_json::json!({});
    }

    // Parse and return JSON
    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => {
            serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({}))
        }
        Err(_) => serde_json::json!({}),
    }
}

#[tauri::command]
fn toggleRunPause() -> serde_json::Value {
    // Buffer to hold state JSON
    let mut buffer = vec![0u8; 1024]; // Allocate a reasonable buffer size
    let mut buffer_len = buffer.len();

    unsafe {
        toggleRunPause_zig(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        // Error occurred, return empty object
        return serde_json::json!({});
    }

    // Parse and return JSON
    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => {
            serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({}))
        }
        Err(_) => serde_json::json!({}),
    }
}

#[tauri::command]
fn getEvmState() -> serde_json::Value {
    // Buffer to hold state JSON
    let mut buffer = vec![0u8; 1024]; // Allocate a reasonable buffer size
    let mut buffer_len = buffer.len();

    unsafe {
        getEvmState_zig(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        // Error occurred, return empty object
        return serde_json::json!({});
    }

    // Parse and return JSON
    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => {
            serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({}))
        }
        Err(_) => serde_json::json!({}),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            loadBytecode,
            resetEvm,
            stepEvm,
            toggleRunPause,
            getEvmState
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
