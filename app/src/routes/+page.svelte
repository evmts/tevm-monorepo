<script lang="ts">
import { createMemoryClient } from 'tevm';

let tevmClient = $state(createMemoryClient());
let blockNumber = $state<bigint | null>(null);
let loading = $state(false);
let error = $state<string | null>(null);

// Chain ID for the current fork
let chainId = $state<number>(1); // Default to mainnet

// RPC URL input
let rpcUrl = $state('https://eth.llamarpc.com');

async function fetchBlockNumber() {
  loading = true;
  error = null;
  
  try {
    blockNumber = await tevmClient.getBlockNumber();
  } catch (err) {
    console.error('Error fetching block number:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
    blockNumber = null;
  } finally {
    loading = false;
  }
}

async function forkNetwork() {
  loading = true;
  error = null;
  
  try {
    // Reset the client with a new fork
    tevmClient.resetForking({
      url: rpcUrl,
      blockNumber: undefined, // Use latest
    });
    
    // Fetch current block number to confirm it's working
    blockNumber = await tevmClient.getBlockNumber();
    // Fetch chain ID
    const id = await tevmClient.getChainId();
    chainId = Number(id);
  } catch (err) {
    console.error('Error forking network:', err);
    error = err instanceof Error ? err.message : 'Failed to fork network';
  } finally {
    loading = false;
  }
}

// Initialize by fetching block number
$effect(() => {
  fetchBlockNumber();
});
</script>

<div class="home-container">
  <section class="welcome">
    <h2>Welcome to Tevm Desktop</h2>
    <p>Ethereum virtual machine in JavaScript, now in a desktop app</p>
  </section>

  <section class="fork-panel">
    <h3>Fork a Network</h3>
    <div class="form-group">
      <label for="rpc-url">RPC URL</label>
      <input 
        id="rpc-url" 
        type="text" 
        bind:value={rpcUrl} 
        placeholder="https://eth.llamarpc.com" 
      />
    </div>
    
    <button 
      onclick={forkNetwork} 
      disabled={loading}
      class="fork-button"
    >
      {loading ? 'Connecting...' : 'Fork Network'}
    </button>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}
  </section>

  <section class="status-panel">
    <h3>Network Status</h3>
    
    <div class="status-item">
      <span class="label">Chain ID:</span>
      <span class="value">{chainId}</span>
    </div>
    
    <div class="status-item">
      <span class="label">Latest Block:</span>
      {#if loading}
        <span class="loading">Loading...</span>
      {:else if blockNumber !== null}
        <span class="value">{blockNumber.toString()}</span>
      {:else}
        <span class="not-connected">Not connected</span>
      {/if}
    </div>
    
    <button 
      onclick={fetchBlockNumber} 
      disabled={loading}
      class="refresh-button"
    >
      Refresh
    </button>
  </section>
</div>

<style>
  .home-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .welcome {
    text-align: center;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 0.5rem;
  }

  .fork-panel, .status-panel {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  :global(.dark-mode) .fork-panel, :global(.dark-mode) .status-panel {
    background-color: #252525;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  :global(.dark-mode) input {
    background-color: #333;
    color: white;
    border-color: #444;
  }

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }

  button:hover {
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .fork-button {
    background-color: #0070f3;
    color: white;
    border: none;
    width: 100%;
  }

  .refresh-button {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    color: #333;
    margin-top: 1rem;
  }

  :global(.dark-mode) .refresh-button {
    background-color: #333;
    color: white;
    border-color: #444;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #eaeaea;
  }

  :global(.dark-mode) .status-item {
    border-bottom-color: #333;
  }

  .label {
    font-weight: 500;
  }

  .value {
    font-family: monospace;
    background-color: #f0f0f0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  :global(.dark-mode) .value {
    background-color: #333;
  }

  .loading {
    color: #0070f3;
    font-style: italic;
  }

  .not-connected {
    color: #999;
    font-style: italic;
  }

  .error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #fff0f0;
    border-left: 3px solid #ff4040;
    color: #d00000;
    border-radius: 4px;
  }

  :global(.dark-mode) .error-message {
    background-color: rgba(255, 0, 0, 0.1);
    color: #ff6b6b;
  }
</style>