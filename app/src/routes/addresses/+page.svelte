<script lang="ts">
import { createMemoryClient } from 'tevm';

// Initialize Tevm client
let tevmClient = $state(createMemoryClient());

// Addresses state
let addresses = $state<Array<{
  address: string;
  balance: bigint;
  nonce: number;
  isContract: boolean;
  index: number;
}>>([]);

// Form state
let newAddress = $state('');
let initialBalance = $state('1');
let loading = $state(false);
let error = $state<string | null>(null);

// Form validation
let isValidAddress = $derived(
  newAddress.startsWith('0x') && 
  newAddress.length === 42 &&
  /^0x[0-9a-fA-F]{40}$/.test(newAddress)
);

// Add a new address
async function addAddress() {
  if (!isValidAddress) return;
  
  loading = true;
  error = null;
  
  try {
    // Check if address already exists in our list
    if (addresses.some(a => a.address.toLowerCase() === newAddress.toLowerCase())) {
      error = 'Address already in the list';
      return;
    }
    
    // Set the balance
    const balanceWei = BigInt(parseFloat(initialBalance) * 1e18);
    await tevmClient.setBalance({
      address: newAddress as `0x${string}`,
      value: balanceWei
    });
    
    // Get nonce
    const nonce = await tevmClient.getTransactionCount({
      address: newAddress as `0x${string}`
    });
    
    // Check if it's a contract
    const code = await tevmClient.getCode({
      address: newAddress as `0x${string}`
    });
    
    // Add to list
    addresses = [
      ...addresses,
      {
        address: newAddress,
        balance: balanceWei,
        nonce: Number(nonce),
        isContract: code !== '0x',
        index: addresses.length
      }
    ];
    
    // Reset form
    newAddress = '';
    initialBalance = '1';
    
  } catch (err) {
    console.error('Error adding address:', err);
    error = err instanceof Error ? err.message : 'Failed to add address';
  } finally {
    loading = false;
  }
}

// Remove an address from the list
function removeAddress(index: number) {
  addresses = addresses.filter(a => a.index !== index);
}

// Format Wei to ETH
function formatEth(wei: bigint): string {
  return (Number(wei) / 1e18).toString();
}

// Initialize with a default address
$effect(() => {
  addAddress();
});
</script>

<div class="addresses-container">
  <section class="add-address">
    <h2>Add Address</h2>
    
    <div class="form-group">
      <label for="address">Ethereum Address</label>
      <input 
        id="address"
        type="text"
        bind:value={newAddress}
        placeholder="0x..."
      />
    </div>
    
    <div class="form-group">
      <label for="balance">Initial Balance (ETH)</label>
      <input 
        id="balance"
        type="text"
        bind:value={initialBalance}
        placeholder="1.0"
      />
    </div>
    
    <button 
      onclick={addAddress} 
      disabled={loading || !isValidAddress}
      class="add-button"
    >
      {loading ? 'Adding...' : 'Add Address'}
    </button>
    
    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}
  </section>
  
  <section class="address-list">
    <h2>Managed Addresses</h2>
    
    {#if addresses.length === 0}
      <div class="empty-state">
        No addresses added yet. Use the form to add an address.
      </div>
    {:else}
      <div class="addresses">
        {#each addresses as address (address.index)}
          <div class="address-item">
            <div class="address-info">
              <div class="address-header">
                <div class="address-value" title={address.address}>
                  {address.address}
                </div>
                <div class="address-type">
                  <span class={address.isContract ? 'contract' : 'eoa'}>
                    {address.isContract ? 'Contract' : 'EOA'}
                  </span>
                </div>
              </div>
              
              <div class="address-details">
                <div class="detail-item">
                  <span class="detail-label">Balance:</span>
                  <span class="detail-value">{formatEth(address.balance)} ETH</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Nonce:</span>
                  <span class="detail-value">{address.nonce}</span>
                </div>
                
                <div class="actions">
                  <button class="remove-button" onclick={() => removeAddress(address.index)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .addresses-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .addresses-container {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .add-address, .address-list {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  :global(.dark-mode) .add-address, :global(.dark-mode) .address-list {
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

  .add-button {
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

  .add-button:disabled {
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

  .addresses {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .address-item {
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    padding: 1rem;
  }

  :global(.dark-mode) .address-item {
    background-color: #1e1e1e;
    border-color: #333;
  }

  .address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
  }

  :global(.dark-mode) .address-header {
    border-bottom-color: #333;
  }

  .address-value {
    font-family: monospace;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
  }

  .address-type {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .eoa {
    background-color: #e8f0fe;
    color: #0070f3;
  }

  .contract {
    background-color: #fef0e8;
    color: #ff6b00;
  }

  :global(.dark-mode) .eoa {
    background-color: rgba(0, 112, 243, 0.2);
  }

  :global(.dark-mode) .contract {
    background-color: rgba(255, 107, 0, 0.2);
  }

  .address-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }

  .detail-label {
    color: #666;
  }

  :global(.dark-mode) .detail-label {
    color: #aaa;
  }

  .detail-value {
    font-family: monospace;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .remove-button {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    color: #333;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  :global(.dark-mode) .remove-button {
    background-color: #333;
    color: white;
    border-color: #444;
  }

  .remove-button:hover {
    background-color: #ffebeb;
    border-color: #ffbdbd;
    color: #d00000;
  }

  :global(.dark-mode) .remove-button:hover {
    background-color: #3d2a2a;
    border-color: #5a3636;
    color: #ff6b6b;
  }
</style>