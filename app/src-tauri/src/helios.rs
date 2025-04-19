use std::sync::Mutex;
use serde_json::Value;
use tauri::{AppHandle, State};

use helios::ethereum::EthereumClient;
use helios::ethereum::database::FileDB;
use helios::core::types::BlockTag;
use helios::ethereum::{
    config::networks::Network,
    EthereumClientBuilder,
};


pub struct HeliosState(pub Mutex<Option<EthereumClient<FileDB>>>);

fn get_network(chain_id: u64) -> Result<Network, String> {
    match chain_id {
        1 => Ok(Network::Mainnet),
        _ => Err(format!("Unsupported chain ID: {}", chain_id)),
    }
}

#[tauri::command]
pub async fn start_helios(
    state: State<'_, HeliosState>,
    _app_handle: AppHandle,
    rpc_url: String,
    consensus_rpc: Option<String>,
    chain_id: u64,
) -> Result<(), String> {
    let data_dir = "./helios-data".to_string();
    let consensus_rpc = consensus_rpc.unwrap_or_else(|| "https://www.lightclientdata.org".to_string());
    
    let result: Result<EthereumClient<FileDB>, String> = async {
        let network = get_network(chain_id)?;
        
        let mut client = EthereumClientBuilder::new()
            .network(network)
            .execution_rpc(&rpc_url)
            .consensus_rpc(&consensus_rpc)
            .data_dir(std::path::PathBuf::from(data_dir))
            .build()
            .map_err(|e| format!("Failed to build client: {:?}", e))?;

        client.start().await.map_err(|e| format!("Failed to start client: {:?}", e))?;
        client.wait_synced().await;
        Ok(client)
    }.await;

    match result {
        Ok(client) => {
            let mut guard = state.0.lock().unwrap();
            *guard = Some(client);
            Ok(())
        },
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn get_latest_block(state: State<'_, HeliosState>) -> Result<Value, String> {
    let client = {
        let mut guard = state.0.lock().unwrap();
        guard.take().ok_or_else(|| "Client not started".to_string())?
    };

    let block = client
        .get_block_by_number(BlockTag::Latest, false)
        .await
        .map_err(|e| format!("Failed to get block: {:?}", e))?;

    {
        let mut guard = state.0.lock().unwrap();
        *guard = Some(client);
    }

    serde_json::to_value(block)
        .map_err(|e| format!("Serialization error: {:?}", e))
} 
