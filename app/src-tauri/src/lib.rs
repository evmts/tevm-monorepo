// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod helios;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Register the Helios state. This will be used by `start_helios` and `get_latest_block`.
        .manage(helios::HeliosState(std::sync::Mutex::new(None)))
        .plugin(tauri_plugin_opener::init())
        // Add the commands from helios.rs to the handler list.
        .invoke_handler(tauri::generate_handler![
            helios::start_helios,
            helios::get_latest_block
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
