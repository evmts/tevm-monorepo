<script lang="ts">
import { createMemoryClient } from 'tevm';

// Initialize Tevm client
let tevmClient = $state(createMemoryClient());

// Store for current block
let currentBlock = $state<any>(null);
let loading = $state(false);
let error = $state<string | null>(null);

// Input for transaction hash or address lookup
let searchInput = $state('');
let searchType = $state<'address' | 'transaction'>('address');
let searchResult = $state<any>(null);
let searchLoading = $state(false);
let searchError = $state<string | null>(null);

// Initial blockchain state
let chainId = $state<number>(1);
let blockNumber = $state<bigint | null>(null);

// Get latest block details
async function fetchLatestBlock() {
  loading = true;
  error = null;
  
  try {
    const blockNum = await tevmClient.getBlockNumber();
    blockNumber = blockNum;
    
    // Get block details
    currentBlock = await tevmClient.getBlock({
      blockNumber: blockNum
    });
    
    // Get chain ID
    const id = await tevmClient.getChainId();
    chainId = Number(id);
  } catch (err) {
    console.error('Error fetching latest block:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  } finally {
    loading = false;
  }
}

// Search for an address or transaction
async function performSearch() {
  if (!searchInput) return;
  
  searchLoading = true;
  searchError = null;
  searchResult = null;
  
  try {
    if (searchType === 'address') {
      // Fetch address details
      const balance = await tevmClient.getBalance({
        address: searchInput as `0x${string}`
      });
      
      // Get code (to check if it's a contract)
      const code = await tevmClient.getCode({
        address: searchInput as `0x${string}`
      });
      
      searchResult = {
        address: searchInput,
        balance: balance.toString(),
        isContract: code !== '0x'
      };
    } else {
      // Fetch transaction details
      searchResult = await tevmClient.getTransaction({
        hash: searchInput as `0x${string}`
      });
    }
  } catch (err) {
    console.error(`Error fetching ${searchType}:`, err);
    searchError = err instanceof Error ? err.message : `Failed to fetch ${searchType}`;
  } finally {
    searchLoading = false;
  }
}

// Initialize by fetching latest block
$effect(() => {
  fetchLatestBlock();
});
</script>

<div class="fork-explorer">
  <header class="explorer-header">
    <h2>Fork Explorer</h2>
    <div class="network-info">
      <span class="label">Chain ID:</span>
      <span class="value">{chainId}</span>
      <span class="separator">|</span>
      <span class="label">Block:</span>
      {#if blockNumber !== null}
        <span class="value">{blockNumber.toString()}</span>
      {:else}
        <span class="not-connected">Not connected</span>
      {/if}
      <button onclick={fetchLatestBlock} disabled={loading} class="refresh-button">
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>
  </header>

  <section class="search-section">
    <div class="search-controls">
      <div class="search-type">
        <label>
          <input type="radio" bind:group={searchType} value="address" />
          Address
        </label>
        <label>
          <input type="radio" bind:group={searchType} value="transaction" />
          Transaction
        </label>
      </div>
      
      <div class="search-input-group">
        <input 
          type="text"
          bind:value={searchInput}
          placeholder={searchType === 'address' ? "Enter address (0x...)" : "Enter transaction hash (0x...)"}
        />
        <button onclick={performSearch} disabled={searchLoading || !searchInput}>
          {searchLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
    
    {#if searchError}
      <div class="error-message">
        {searchError}
      </div>
    {/if}
    
    {#if searchResult}
      <div class="search-results">
        <h3>{searchType === 'address' ? 'Address' : 'Transaction'} Details</h3>
        
        {#if searchType === 'address'}
          <div class="detail-item">
            <span class="detail-label">Address:</span>
            <span class="detail-value">{searchResult.address}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Balance:</span>
            <span class="detail-value">{searchResult.balance} Wei</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">{searchResult.isContract ? 'Contract' : 'EOA'}</span>
          </div>
        {:else}
          <div class="detail-item">
            <span class="detail-label">Hash:</span>
            <span class="detail-value">{searchResult.hash}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">From:</span>
            <span class="detail-value">{searchResult.from}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">To:</span>
            <span class="detail-value">{searchResult.to || '(Contract Creation)'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Value:</span>
            <span class="detail-value">{searchResult.value.toString()} Wei</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Block:</span>
            <span class="detail-value">
              {searchResult.blockNumber !== null ? searchResult.blockNumber.toString() : 'Pending'}
            </span>
          </div>
        {/if}
      </div>
    {/if}
  </section>

  <section class="block-section">
    <h3>Latest Block</h3>
    
    {#if loading}
      <div class="loading-message">Loading block data...</div>
    {:else if error}
      <div class="error-message">{error}</div>
    {:else if currentBlock}
      <div class="block-details">
        <div class="detail-item">
          <span class="detail-label">Block Number:</span>
          <span class="detail-value">{currentBlock.number.toString()}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Hash:</span>
          <span class="detail-value">{currentBlock.hash}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Parent Hash:</span>
          <span class="detail-value">{currentBlock.parentHash}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Timestamp:</span>
          <span class="detail-value">
            {new Date(Number(currentBlock.timestamp) * 1000).toLocaleString()}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Gas Used:</span>
          <span class="detail-value">{currentBlock.gasUsed.toString()}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Gas Limit:</span>
          <span class="detail-value">{currentBlock.gasLimit.toString()}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Transactions:</span>
          <span class="detail-value">{currentBlock.transactions.length}</span>
        </div>
      </div>
    {:else}
      <div class="not-connected">No block data available</div>
    {/if}
  </section>
</div>

<style>
  .fork-explorer {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .explorer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 1rem;
  }

  :global(.dark-mode) .explorer-header {
    border-bottom-color: #333;
  }

  h2, h3 {
    margin: 0;
  }

  h3 {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eaeaea;
  }

  :global(.dark-mode) h3 {
    border-bottom-color: #333;
  }

  .network-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .label {
    font-weight: 500;
    color: #666;
  }

  :global(.dark-mode) .label {
    color: #aaa;
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

  .separator {
    color: #ddd;
  }

  :global(.dark-mode) .separator {
    color: #444;
  }

  .refresh-button {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    color: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  :global(.dark-mode) .refresh-button {
    background-color: #333;
    color: white;
    border-color: #444;
  }

  .search-section, .block-section {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  :global(.dark-mode) .search-section, :global(.dark-mode) .block-section {
    background-color: #252525;
  }

  .search-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-type {
    display: flex;
    gap: 1.5rem;
  }

  .search-type label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .search-input-group {
    display: flex;
    gap: 0.5rem;
  }

  .search-input-group input {
    flex: 1;
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

  .search-input-group button {
    padding: 0.75rem 1.5rem;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
  }

  .search-input-group button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .search-results, .block-details {
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    padding: 1rem;
  }

  :global(.dark-mode) .search-results, :global(.dark-mode) .block-details {
    background-color: #1e1e1e;
    border-color: #333;
  }

  .detail-item {
    display: flex;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
  }

  :global(.dark-mode) .detail-item {
    border-bottom-color: #333;
  }

  .detail-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .detail-label {
    font-weight: 500;
    width: 140px;
    flex-shrink: 0;
  }

  .detail-value {
    font-family: monospace;
    word-break: break-all;
  }

  .loading-message {
    color: #0070f3;
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
  }

  .error-message {
    margin: 1rem 0;
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

  .not-connected {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
  }
</style>