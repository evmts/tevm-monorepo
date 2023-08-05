---
"svelte-ethers": minor
"@evmts/vite-plugin": minor
"@evmts/ts-plugin": minor
---

Added svelte-ethers EVMts example app

This example app is the first using Svelte for direct contract imports. The import happens in the svelte page

```ts
<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { EthersMintExample } from '../contracts/EthersMintExample.sol';
  import {createEthersContract} from '@evmts/ethers'
  import { Contract, JsonRpcProvider } from 'ethers'

  // Create stores for all reactive variables
  let totalSupply = writable('');
  let ownerOf = writable('');
  let balanceOf = writable('');

  const tokenId = BigInt('114511829')

  const provider = new JsonRpcProvider('https://goerli.optimism.io', 420)
  const ethersContract = createEthersContract(EthersMintExample, {
		chainId: 420,
		runner: provider,
	})

  onMount(async () => {
    totalSupply.set(await ethersContract.totalSupply());
    ownerOf.set(await ethersContract.ownerOf(tokenId));
    if ($ownerOf?.toString()) {
      balanceOf.set(await ethersContract.balanceOf($ownerOf?.toString()));
    }
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<div>
  <div>
    <h3>totalSupply():</h3>
    <div>{$totalSupply?.toString()}</div>
    <br />
    <h3>ownerOf(): </h3>
    <div>{$ownerOf?.toString()}</div>
    <br />
    <h3>balanceOf($address):</h3>
    <div>{$balanceOf?.toString()}</div>
  </div>
</div>
```

Here you can see we import a contract directly from EthersMintExample.sol and use it with ethers.js

- The svelte example is powered by `@evmts/vite-plugin` and `@evmts/ts-plugin`
- This svelte example is using js with jsdoc which is now newly enabled
- This is the first example app using the `@evmts/ethers` package which brings typesafe ethers.js contracts to the table
  - *Note* CLI typechecker will not be enabled until Beta release for now typesafety is purely in the editor

App is extremely minimal as I have almost 0 experience using svelte. Contributions are welecome
