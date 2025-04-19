<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import { RustBridge } from "../lib/rust-bridge.js";
  import BlockTable from "../components/BlockTable.svelte";
  import ReactWrapper from "../react/ReactWrapper.svelte";
  import { RainbowKitButton } from "../react/RainbowKitWrapper";
  import { getDefaultConfig } from "@rainbow-me/rainbowkit";
  import { mainnet, optimism, base } from "wagmi/chains";
  import { createElement } from "react";
  import { useQueryClient, type QueryClient } from "@tanstack/svelte-query";
    import { http } from "viem";

  const queryClient = useQueryClient()

  const appState = $state({
    rpcUrl: "https://rpc.ankr.com/eth",
    consensusRpc: "https://www.lightclientdata.org",
    chainId: 1,
    statusMsg: "",
    latestBlock: "",
    loading: false,
  });

  const wagmiConfig = $state(
    getDefaultConfig({
      appName: "Krome",
      projectId: "898f836c53a18d0661340823973f0cb4",
      chains: [mainnet, optimism, base],
      ssr: false,
      appDescription: "A svelte/tauri based framework",
      transports: {
        [mainnet.id]: http(appState.rpcUrl),
      }
    }),
  );

  const rustBridge = RustBridge.getInstance();

  let blockIterator: AsyncGenerator<any, void, unknown> | null = null;

  async function onsubmit(event: Event) {
    event.preventDefault();

    if (blockIterator) {
      await blockIterator.return();
      blockIterator = null;
    }

    appState.loading = true;
    appState.statusMsg = "";

    try {
      await rustBridge.start({
        rpcUrl: appState.rpcUrl,
        consensusRpc: appState.consensusRpc,
        chainId: appState.chainId,
      });
      appState.statusMsg = "Helios started successfully.";
    } catch (e) {
      appState.statusMsg = "Error starting Helios: " + e;
      appState.loading = false;
      return;
    }

    appState.loading = false;

    blockIterator = rustBridge.getLatestBlock();

    (async () => {
      try {
        for await (const block of blockIterator!) {
          appState.latestBlock = JSON.stringify(block, null, 2);
        }
      } catch (e) {
        console.error("Polling terminated:", e);
      }
    })();
  }

  onDestroy(() => {
    if (blockIterator) {
      blockIterator.return();
    }
  });
</script>

<main class="container">
  <h1>Helios with Svelte Runes</h1>

  <div class="rainbow-wrapper">
    <ReactWrapper
      element={createElement(RainbowKitButton, {
        config: wagmiConfig,
        queryClient: queryClient,
      })}
    />
  </div>

  <form {onsubmit}>
    <div>
      <label for="rpcUrl">RPC URL:</label>
      <input
        id="rpcUrl"
        type="text"
        placeholder="Enter RPC URL..."
        bind:value={appState.rpcUrl}
      />
    </div>
    <div>
      <label for="consensusRpc">Consensus RPC:</label>
      <input
        id="consensusRpc"
        type="text"
        placeholder="Enter Consensus RPC..."
        bind:value={appState.consensusRpc}
      />
    </div>
    <div>
      <label for="chainId">Chain ID:</label>
      <input
        id="chainId"
        type="number"
        placeholder="Enter Chain ID..."
        bind:value={appState.chainId}
      />
    </div>
    <button type="submit" disabled={appState.loading}>
      {appState.loading
        ? "Starting Helios..."
        : "Start Helios and Get Latest Block"}
    </button>
  </form>

  {#if appState.loading}
    <p>Loading Helios, please wait...</p>
  {/if}

  <p>{appState.statusMsg}</p>
  <BlockTable
    block={appState.latestBlock ? JSON.parse(appState.latestBlock) : {}}
  />
</main>

<style>
  .container {
    margin: 0;
    padding-top: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
  }
  .rainbow-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  form > div {
    margin-bottom: 10px;
  }
  label {
    margin-right: 10px;
  }
  input {
    padding: 0.6em 1.2em;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  button {
    padding: 0.6em 1.2em;
    border-radius: 8px;
    border: none;
    background-color: #24c8db;
    color: white;
    cursor: pointer;
  }
  button:hover {
    background-color: #1aa1c9;
  }
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
