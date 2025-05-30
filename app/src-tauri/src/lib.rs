extern "C" {
    // src/root.zig EVM functions
    fn loadBytecode(bytecode_hex: *const u8, bytecode_hex_len: usize);
    fn resetEvm();
    fn stepEvm(state: *mut u8, state_len: *mut usize);
    fn toggleRunPause(state: *mut u8, state_len: *mut usize);
    fn getEvmState(state: *mut u8, state_len: *mut usize);
}

#[tauri::command]
fn load_bytecode(bytecode_hex: String) {
    unsafe {
        loadBytecode(bytecode_hex.as_ptr(), bytecode_hex.len());
    }
}

#[tauri::command]
fn reset_evm() {
    unsafe {
        resetEvm();
    }
}

#[tauri::command]
fn step_evm() -> serde_json::Value {
    let mut buffer = vec![0u8; 1024];
    let mut buffer_len = buffer.len();

    unsafe {
        stepEvm(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        return serde_json::json!({});
    }

    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({})),
        Err(_) => serde_json::json!({}),
    }
}

#[tauri::command]
fn toggle_run_pause() -> serde_json::Value {
    let mut buffer = vec![0u8; 1024];
    let mut buffer_len = buffer.len();

    unsafe {
        toggleRunPause(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        return serde_json::json!({});
    }

    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({})),
        Err(_) => serde_json::json!({}),
    }
}

#[tauri::command]
fn get_evm_state() -> serde_json::Value {
    let mut buffer = vec![0u8; 1024];
    let mut buffer_len = buffer.len();
    unsafe {
        getEvmState(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }
    if buffer_len == 0 {
        return serde_json::json!({});
    }
    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({})),
        Err(_) => serde_json::json!({}),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_bytecode,
            reset_evm,
            step_evm,
            toggle_run_pause,
            get_evm_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
