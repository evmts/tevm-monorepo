<script lang="ts">
  import { onMount } from "svelte";
  import ReactWrapper from "../react/ReactWrapper.svelte";
  import { RainbowKitButton } from "../react/RainbowKitWrapper";
  import { createElement } from "react";
  import { useQueryClient } from "@tanstack/svelte-query";
  import { http } from "viem";
  import { mainnet, optimism, base } from "wagmi/chains";
  import { getDefaultConfig } from "@rainbow-me/rainbowkit";
  import { browser } from "$app/environment";

  // Import the debugger directly - we've already made it SSR compatible
  import SolidityDebugger from "../components/SolidityDebugger.svelte";

  const queryClient = useQueryClient();

  // Create Wagmi config
  const wagmiConfig = $state(
    getDefaultConfig({
      appName: "Tevm Solidity Debugger",
      projectId: "898f836c53a18d0661340823973f0cb4",
      chains: [mainnet, optimism, base],
      ssr: false,
      appDescription: "A Solidity debugger powered by Tevm",
      transports: {
        [mainnet.id]: http("https://rpc.ankr.com/eth"),
      }
    }),
  );

</script>

<main class="container">
  <div class="header">
    <h1>Tevm Solidity Debugger</h1>
    
    <div class="rainbow-wrapper">
      <ReactWrapper
        element={createElement(RainbowKitButton, {
          config: wagmiConfig,
          queryClient: queryClient,
        })}
      />
    </div>
  </div>

  {#if browser}
    <SolidityDebugger />
  {:else}
    <div class="loading">Loading debugger...</div>
  {/if}
</main>

<style>
  .container {
    margin: 0;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  h1 {
    margin: 0;
    font-size: 2rem;
  }
  
  .rainbow-wrapper {
    display: flex;
    align-items: center;
  }
  
  .loading {
    padding: 40px;
    text-align: center;
    font-size: 18px;
    color: #666;
  }
</style>