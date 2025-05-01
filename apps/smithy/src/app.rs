use alloy::{primitives::Address, providers::ProviderBuilder, sol};
use leptos::ev::{Event, SubmitEvent}; // Fixed import
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos::wasm_bindgen::JsCast;
use leptos::web_sys;
use std::str::FromStr;

// Generate the contract bindings for the ERC20 interface
sol! {
    #[sol(rpc)]
    contract ERC20 {
        function balanceOf(address owner) public view returns (uint256);
    }
}

// Define the WETH contract address
const WETH_ADDRESS: &str = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

#[component]
pub fn App() -> impl IntoView {
    // Create signals for the input address and the balance result
    let (input_address, set_input_address) = create_signal(String::new());
    let (balance, set_balance) = create_signal(String::new());
    let (error_msg, set_error_msg) = create_signal(String::new());
    let (is_loading, set_is_loading) = create_signal(false);
    let (provider_status, set_provider_status) = create_signal("Disconnected".to_string());

    // A signal to store our provider
    let (provider, set_provider) = create_signal(None);

    // Initialize the provider on mount
    let initialize_provider = move || {
        set_provider_status.set("Connecting to Ethereum network...".to_string());

        spawn_local(async move {
            match ProviderBuilder::new()
                .connect("https://reth-ethereum.ithaca.xyz/rpc")
                .await
            {
                Ok(p) => {
                    set_provider.set(Some(p));
                    set_provider_status.set("Connected to Ethereum network".to_string());
                }
                Err(e) => {
                    set_provider_status.set(format!("Failed to connect: {}", e));
                }
            }
        });
    };

    // Call initialize on mount
    initialize_provider();

    // Handle input changes
    let on_address_change = move |ev: Event| {
        set_input_address.set(event_target_value(&ev));
    };

    // Handle form submission
    let fetch_balance = move |ev: SubmitEvent| {
        ev.prevent_default();

        let current_provider = provider.get();
        if current_provider.is_none() {
            set_error_msg
                .set("Provider not connected. Please wait or refresh the page.".to_string());
            return;
        }

        // Don't do anything if empty address or already loading
        if input_address.get().is_empty() || is_loading.get() {
            return;
        }

        // Clear previous results
        set_balance.set(String::new());
        set_error_msg.set(String::new());
        set_is_loading.set(true);

        // Get the address value to use in the async task
        let address_value = input_address.get();
        let provider_instance = current_provider.unwrap().clone();

        // Spawn an async task to fetch the balance
        spawn_local(async move {
            // Parse the Ethereum address
            let owner = match Address::from_str(&address_value) {
                Ok(addr) => addr,
                Err(_) => {
                    set_error_msg.set("Invalid Ethereum address format".to_string());
                    set_is_loading.set(false);
                    return;
                }
            };

            // Set up the contract
            let weth = match Address::from_str(WETH_ADDRESS) {
                Ok(addr) => addr,
                Err(_) => {
                    set_error_msg.set("Internal error: Invalid WETH address".to_string());
                    set_is_loading.set(false);
                    return;
                }
            };

            let erc20 = ERC20::new(weth, provider_instance);

            // Call the contract method
            match erc20.balanceOf(owner).call().await {
                Ok(balance_result) => {
                    // Format the balance for display (convert to ETH)
                    // Need to convert to a string first and then parse as f64
                    let balance_str = balance_result.to_string();
                    let balance_val = balance_str.parse::<f64>().unwrap_or(0.0);
                    let eth_balance = balance_val / 1_000_000_000_000_000_000.0;
                    set_balance.set(format!("{:.6} WETH", eth_balance));
                }
                Err(e) => {
                    set_error_msg.set(format!("Error fetching balance: {}", e));
                }
            }

            // Always set loading to false at the end
            set_is_loading.set(false);
        });
    };

    view! {
        <main class="container">
            <h1>"WETH Balance Checker"</h1>

            <div>
                <p>{move || provider_status.get()}</p>
            </div>

            <form class="row" on:submit=fetch_balance>
                <input
                    id="address-input"
                    placeholder="Enter an Ethereum address (0x...)..."
                    prop:value=move || input_address.get()
                    on:input=on_address_change
                />
                <button
                    type="submit"
                    disabled=move || is_loading.get() || provider.get().is_none()
                >
                    {move || if is_loading.get() { "Loading..." } else { "Check Balance" }}
                </button>
            </form>

            <div class="result-section">
                // Fixed Show component
                <Show
                    when=move || !balance.get().is_empty()
                    fallback=move || view! { <p>"Enter an address and submit to check balance"</p> }
                >
                    <div>
                        <h3>"Balance for: " {move || input_address.get()}</h3>
                        <p>{move || balance.get()}</p>
                    </div>
                </Show>

                // Fixed Show component
                <Show
                    when=move || !error_msg.get().is_empty()
                    fallback=move || view! { <div></div> }
                >
                    <div>
                        <p class="error">{move || error_msg.get()}</p>
                    </div>
                </Show>
            </div>
        </main>
    }
}

// Custom event_target_value function that uses JsCast
fn event_target_value(ev: &Event) -> String {
    ev.target()
        .and_then(|t| t.dyn_into::<web_sys::HtmlInputElement>().ok())
        .map(|input| input.value())
        .unwrap_or_default()
}
