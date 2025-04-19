<script lang="ts">
import { createMemoryClient } from 'tevm';
import { useQueryClient } from '@tanstack/svelte-query';

// Access the query client
const queryClient = useQueryClient();

// Initialize Tevm client
let tevmClient = $state(createMemoryClient());

// Transaction form data
let txData = $state({
  from: '0x0000000000000000000000000000000000000000',
  to: '',
  value: '',
  data: '',
  gasLimit: '21000'
});

// Transaction list
let transactions = $state([]);
let loading = $state(false);
let error = $state<string | null>(null);

// Form validation state
let isFormValid = $derived(
  txData.from && 
  txData.to && 
  txData.to.startsWith('0x') && 
  txData.to.length === 42
);

// Send a transaction
async function sendTransaction() {
  if (!isFormValid) return;
  
  loading = true;
  error = null;
  
  try {
    // Create transaction object
    const tx = {
      from: txData.from as `0x${string}`,
      to: txData.to as `0x${string}`,
      value: txData.value ? BigInt(txData.value) : 0n,
      data: txData.data || '0x',
      gas: txData.gasLimit ? BigInt(txData.gasLimit) : 21000n
    };
    
    // Send transaction
    const txHash = await tevmClient.sendTransaction(tx);
    
    // Mine the transaction
    await tevmClient.mine({ blocks: 1 });
    
    // Get transaction details
    const receipt = await tevmClient.getTransaction({ hash: txHash });
    
    // Add to transaction list
    transactions = [...transactions, {
      ...receipt,
      timestamp: Date.now()
    }];
    
    // Reset form
    txData.to = '';
    txData.value = '';
    txData.data = '';
    
  } catch (err) {
    console.error('Error sending transaction:', err);
    error = err instanceof Error ? err.message : 'Failed to send transaction';
  } finally {
    loading = false;
  }
}

// Format Wei value to ETH
function formatEth(wei: bigint): string {
  const ethValue = Number(wei) / 1e18;
  return ethValue.toFixed(ethValue < 0.0001 ? 18 : 4);
}

// Format timestamp
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

// Truncate address for display
function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
</script>

<div class="transactions-container">
  <section class="tx-form">
    <h2>Send Transaction</h2>
    
    <div class="form-group">
      <label for="from">From Address</label>
      <input 
        id="from"
        type="text"
        bind:value={txData.from}
        placeholder="0x..."
      />
    </div>
    
    <div class="form-group">
      <label for="to">To Address</label>
      <input 
        id="to"
        type="text"
        bind:value={txData.to}
        placeholder="0x..."
      />
    </div>
    
    <div class="form-group">
      <label for="value">Value (Wei)</label>
      <input 
        id="value"
        type="text"
        bind:value={txData.value}
        placeholder="Amount in Wei"
      />
    </div>
    
    <div class="form-group">
      <label for="data">Data (Hex)</label>
      <input 
        id="data"
        type="text"
        bind:value={txData.data}
        placeholder="0x..."
      />
    </div>
    
    <div class="form-group">
      <label for="gas">Gas Limit</label>
      <input 
        id="gas"
        type="text"
        bind:value={txData.gasLimit}
        placeholder="21000"
      />
    </div>
    
    <button 
      onclick={sendTransaction} 
      disabled={loading || !isFormValid}
      class="send-button"
    >
      {loading ? 'Sending...' : 'Send Transaction'}
    </button>
    
    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}
  </section>
  
  <section class="tx-list">
    <h2>Recent Transactions</h2>
    
    {#if transactions.length === 0}
      <div class="empty-state">
        No transactions yet. Use the form to send a transaction.
      </div>
    {:else}
      <div class="transactions">
        {#each transactions as tx (tx.hash)}
          <div class="tx-item">
            <div class="tx-header">
              <div class="tx-hash">{truncateAddress(tx.hash)}</div>
              <div class="tx-status">
                <span class={tx.blockNumber ? 'success' : 'pending'}>
                  {tx.blockNumber ? 'Confirmed' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div class="tx-details">
              <div class="tx-detail">
                <span class="detail-label">From:</span>
                <span class="detail-value">{truncateAddress(tx.from)}</span>
              </div>
              
              <div class="tx-detail">
                <span class="detail-label">To:</span>
                <span class="detail-value">{tx.to ? truncateAddress(tx.to) : '(Contract Creation)'}</span>
              </div>
              
              <div class="tx-detail">
                <span class="detail-label">Value:</span>
                <span class="detail-value">{formatEth(tx.value)} ETH</span>
              </div>
              
              <div class="tx-detail">
                <span class="detail-label">Time:</span>
                <span class="detail-value">{formatTimestamp(tx.timestamp)}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .transactions-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .transactions-container {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .tx-form, .tx-list {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  :global(.dark-mode) .tx-form, :global(.dark-mode) .tx-list {
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
    font-family: monospace;
  }

  :global(.dark-mode) input {
    background-color: #333;
    color: white;
    border-color: #444;
  }

  .send-button {
    background-color: #0070f3;
    color: white;
    border: none;
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1rem;
  }

  .send-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

  .empty-state {
    text-align: center;
    padding: 3rem 0;
    color: #999;
    font-style: italic;
  }

  .transactions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tx-item {
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    padding: 1rem;
    transition: transform 0.1s;
  }

  :global(.dark-mode) .tx-item {
    background-color: #1e1e1e;
    border-color: #333;
  }

  .tx-item:hover {
    transform: translateY(-2px);
  }

  .tx-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
  }

  :global(.dark-mode) .tx-header {
    border-bottom-color: #333;
  }

  .tx-hash {
    font-family: monospace;
    font-weight: bold;
  }

  .tx-status {
    font-size: 0.875rem;
  }

  .success {
    color: #0070f3;
  }

  .pending {
    color: #f5a623;
  }

  .tx-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .tx-detail {
    display: flex;
    flex-direction: column;
  }

  .detail-label {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  :global(.dark-mode) .detail-label {
    color: #aaa;
  }

  .detail-value {
    font-family: monospace;
    font-size: 0.875rem;
  }
</style>