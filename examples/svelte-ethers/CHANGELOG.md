# svelte-ethers

## 0.1.3

### Patch Changes

- Updated dependencies [[`cb83c0c`](https://github.com/evmts/evmts-monorepo/commit/cb83c0c81fae63decd7bbdb79b9c3cce2c7e0b8e)]:
  - @evmts/core@0.10.0
  - @evmts/ethers@0.8.1

## 0.1.2

### Patch Changes

- [#453](https://github.com/evmts/evmts-monorepo/pull/453) [`c23302a`](https://github.com/evmts/evmts-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712) Thanks [@roninjin10](https://github.com/roninjin10)! - Started publishing every commit to main so all EVMts changes can be used early. To use the latest main branch release install with `@main` tag. e.g. `npm install @evmts/ts-plugin@main`

- Updated dependencies [[`c23302a`](https://github.com/evmts/evmts-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712)]:
  - @evmts/core@0.8.1
  - @evmts/ethers@0.8.1

## 0.1.1

### Patch Changes

- Updated dependencies [[`eedb7e0`](https://github.com/evmts/evmts-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b), [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43)]:
  - @evmts/ethers@0.8.0
  - @evmts/core@0.8.0

## 0.1.0

### Minor Changes

- [#426](https://github.com/evmts/evmts-monorepo/pull/426) [`0191aee`](https://github.com/evmts/evmts-monorepo/commit/0191aeee553bb1973998ff3a730eceb0af1869f9) Thanks [@roninjin10](https://github.com/roninjin10)! - Added svelte-ethers EVMts example app

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
    - _Note_ CLI typechecker will not be enabled until Beta release for now typesafety is purely in the editor

  App is extremely minimal as I have almost 0 experience using svelte. Contributions are welecome

### Patch Changes

- Updated dependencies [[`eabdb46`](https://github.com/evmts/evmts-monorepo/commit/eabdb466582000b0964d87d65da72f93dc4702d2)]:
  - @evmts/ethers@0.7.0
