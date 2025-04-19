<script lang="ts">
import { createMemoryClient } from 'tevm';

// Create a Tevm client
let tevmClient = $state(createMemoryClient());

// Store for dark mode
let darkMode = $state(
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
);

// Toggle dark mode
function toggleDarkMode() {
  darkMode = !darkMode;
}

// Track connected address state
let connectedAddress = $state<string | null>(null);

// Track chain state
let chainId = $state<number>(1); // Default to mainnet

// Handle connection
async function connectWallet() {
  try {
    // In a real app, this would interact with a wallet provider
    connectedAddress = '0x0000000000000000000000000000000000000000';
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
}
</script>

<main class="app-container" class:dark-mode={darkMode}>
    <header>
      <div class="logo">
        <img src="/tauri.svg" alt="Tevm Logo" width="40" height="40" />
        <h1>TEVM Desktop</h1>
      </div>
      <div class="actions">
        <button onclick={toggleDarkMode} class="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onclick={connectWallet} class="connect-button">
          {connectedAddress ? connectedAddress.slice(0, 6) + '...' + connectedAddress.slice(-4) : 'Connect Wallet'}
        </button>
      </div>
    </header>

    <nav>
      <a href="/" class="active">Home</a>
      <a href="/fork">Fork Explorer</a>
      <a href="/transactions">Transactions</a>
      <a href="/addresses">Addresses</a>
      <a href="/playground">Playground</a>
    </nav>

    <div class="content">
      <div id="slot-container"></div>
    </div>

    <footer>
      <p>Powered by Tevm - Ethereum Virtual Machine in JavaScript</p>
    </footer>
  </main>

<style>
  .app-container {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .dark-mode {
    background-color: #1a1a1a;
    color: #f0f0f0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
  }

  .dark-mode header {
    border-bottom-color: #333;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }

  .theme-toggle, .connect-button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .dark-mode .theme-toggle, .dark-mode .connect-button {
    background-color: #333;
    color: white;
    border-color: #444;
  }

  .connect-button {
    background-color: #0070f3;
    color: white;
    border: none;
  }

  nav {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  nav a {
    text-decoration: none;
    color: #666;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }

  .dark-mode nav a {
    color: #aaa;
  }

  nav a.active, nav a:hover {
    background-color: #f0f0f0;
    color: #0070f3;
  }

  .dark-mode nav a.active, .dark-mode nav a:hover {
    background-color: #333;
    color: #4da8ff;
  }

  .content {
    flex-grow: 1;
    padding: 1rem 0;
  }

  footer {
    text-align: center;
    padding: 1rem 0;
    border-top: 1px solid #eaeaea;
    font-size: 0.9rem;
    color: #666;
  }

  .dark-mode footer {
    border-top-color: #333;
    color: #aaa;
  }
</style>