<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { EthersMintExample } from '../contracts/EthersMintExample.sol';
  import {Contract} from '@evmts/ethers'
  import { JsonRpcProvider } from 'ethers'
  import { addresses } from '../addresses';

  // Create stores for all reactive variables
  let totalSupply = writable('');
  let ownerOf = writable('');
  let balanceOf = writable('');

  const tokenId = BigInt('114511829')

  const provider = new JsonRpcProvider('https://goerli.optimism.io', 420)
  const ethersContract = new Contract(
    addresses[420],
    EthersMintExample.abi, 
		provider
	)

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

