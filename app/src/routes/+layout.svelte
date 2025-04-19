<script lang="ts">
import { QueryClient } from '@tanstack/svelte-query';
import '../styles.css';

// Using $props() rune for component props
let { } = $props();

// Create a query client for TanStack Query
let queryClient = $state(new QueryClient());

// Initialize any global state or effects
$effect(() => {
  console.log('Layout component initialized');
});
</script>

<div class="app-container">
  <header>
    <div class="navbar">
      <div class="logo">
        <span>TEVM</span>
      </div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/fork">Fork</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/addresses">Addresses</a></li>
          <li><a href="/playground">Playground</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    {@render $$slots.default?.()}
  </main>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  header {
    background-color: #1a1a1a;
    border-bottom: 1px solid #333;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    height: 3.5rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0070f3;
  }
  
  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1.5rem;
  }
  
  nav a {
    color: #eaeaea;
    text-decoration: none;
    font-size: 0.9rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  nav a:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  main {
    flex: 1;
    width: 100%;
  }
  
  /* Route-specific styling */
  :global(.home-container) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* Make playground view full width */
  :global(.playground-container) {
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
</style>