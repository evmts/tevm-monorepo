// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod helios;

use std::sync::Mutex;
use helios::HeliosState;

fn main() {
    tauri::Builder::default()
        .manage(HeliosState(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            helios::start_helios,
            helios::get_latest_block,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
