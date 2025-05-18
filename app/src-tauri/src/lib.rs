extern "C" {
    // src/utils/keccak256.zig
    fn keccak256(input: *const u8, input_len: usize, output: *mut u8);
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
