# @evmts/ts-plugin

## 1.0.0-next.17

### Patch Changes

- [#716](https://github.com/evmts/evmts-monorepo/pull/716) [`65462ea7`](https://github.com/evmts/evmts-monorepo/commit/65462ea79eff3abf9c7d95324d1c8c696fa0e785) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with not using remappings in ts files

- Updated dependencies []:
  - @evmts/base@1.0.0-next.17

## 1.0.0-next.16

### Minor Changes

- [#714](https://github.com/evmts/evmts-monorepo/pull/714) [`95b534c3`](https://github.com/evmts/evmts-monorepo/commit/95b534c39c3ee637c1b4d8fdc6f9b6fd3193ce80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability to resolve most paths in tsconfig that look similar to '@/_': ['./_']

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.16

## 1.0.0-next.15

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.15

## 1.0.0-next.14

### Patch Changes

- [#699](https://github.com/evmts/evmts-monorepo/pull/699) [`42e62fc7`](https://github.com/evmts/evmts-monorepo/commit/42e62fc78627db45533d495e0f320547312d2322) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with node module imports not resolving correctly

## 1.0.0-next.13

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.13

## 1.0.0-next.12

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.12

## 1.0.0-next.11

### Minor Changes

- [#690](https://github.com/evmts/evmts-monorepo/pull/690) [`3af18276`](https://github.com/evmts/evmts-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployedBytecode to evmts contract instances

### Patch Changes

- Updated dependencies [[`3af18276`](https://github.com/evmts/evmts-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d)]:
  - @evmts/base@1.0.0-next.11

## 1.0.0-next.9

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.9

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/evmts-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/evmts-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

- Updated dependencies [[`e5a6b24c`](https://github.com/evmts/evmts-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830)]:
  - @evmts/base@1.0.0-next.8

## 1.0.0-next.6

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.6

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/evmts-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

- Updated dependencies [[`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2)]:
  - @evmts/base@1.0.0-next.5

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/evmts-monorepo/pull/676) [`93cab845`](https://github.com/evmts/evmts-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

- Updated dependencies []:
  - @evmts/base@1.0.0-next.4

## 1.0.0-next.3

### Minor Changes

- [#674](https://github.com/evmts/evmts-monorepo/pull/674) [`eddcef02`](https://github.com/evmts/evmts-monorepo/commit/eddcef024aebc62b713a1fd51304e12f0b093d18) Thanks [@roninjin10](https://github.com/roninjin10)! - Added debug option to evmts config. When turned on the output of evmts contract imports will be written to disk and can be debugged. In future logging for the bundler will also be printed to a debug log file

### Patch Changes

- Updated dependencies []:
  - @evmts/base@1.0.0-next.3

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/evmts-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/evmts-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to EVMts bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

### Patch Changes

- [#671](https://github.com/evmts/evmts-monorepo/pull/671) [`2f13396d`](https://github.com/evmts/evmts-monorepo/commit/2f13396d5b64687e56d4618aaff88a67a05df7e2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with @evmts/core imports resolving the wrong types sometimes when ts-plugin is used.

- Updated dependencies [[`31ed39a5`](https://github.com/evmts/evmts-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785)]:
  - @evmts/base@1.0.0-next.2

## 1.0.0-next.0

### Major Changes

- [#485](https://github.com/evmts/evmts-monorepo/pull/485) [`570c4ed6`](https://github.com/evmts/evmts-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933) Thanks [@roninjin10](https://github.com/roninjin10)! - Removed global Address config and external contracts from EVMts to simplify the API

### Patch Changes

- [#548](https://github.com/evmts/evmts-monorepo/pull/548) [`c12528a3`](https://github.com/evmts/evmts-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all packages to automatically generate up to date reference docs

- [#572](https://github.com/evmts/evmts-monorepo/pull/572) [`eee7e7f5`](https://github.com/evmts/evmts-monorepo/commit/eee7e7f58934c5cd7d70e3dfc704408a4dfbfda8) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated @evmts/ts-plugin to NodeNext. This will improve compatibility

- [#611](https://github.com/evmts/evmts-monorepo/pull/611) [`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- [#492](https://github.com/evmts/evmts-monorepo/pull/492) [`2349d58c`](https://github.com/evmts/evmts-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all NPM dependencies to latest

- [#499](https://github.com/evmts/evmts-monorepo/pull/499) [`bc4b5a4f`](https://github.com/evmts/evmts-monorepo/commit/bc4b5a4f92ff5e1bbf3dd6acd8b5a69b84ac603d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added in memory caching to all EVMts bundlers and LSP

- Updated dependencies []:
  - @evmts/base@1.0.0-next.0

## 0.11.2

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.11.2

## 0.10.0

### Patch Changes

- [#466](https://github.com/evmts/evmts-monorepo/pull/466) [`1c4cbd2`](https://github.com/evmts/evmts-monorepo/commit/1c4cbd2b87abd1c2174fb0d2e7a684367e074440) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated @evmts/ts-plugin to use LSP to get files

  Previously EVMts relied on `fs.readFileSync` to implement the LSP. By replacing this with using `typescriptLanguageServer.readFile` we are able to rely on the LSP to get the file instead of the file system

  In future versions of EVMts when we add a vscode plugin this will make the LSP smart enough to update before the user even clicks `save`

- [#418](https://github.com/evmts/evmts-monorepo/pull/418) [`fbf8f49`](https://github.com/evmts/evmts-monorepo/commit/fbf8f4907d942b0a1aecdb781dcaf748d806a9aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with LSP potentially not resolving EVMts correctly in nested node module

- Updated dependencies [[`dbc2da6`](https://github.com/evmts/evmts-monorepo/commit/dbc2da6092eae3a7ec2d2519ea8c04505aa911f6), [`1c4cbd2`](https://github.com/evmts/evmts-monorepo/commit/1c4cbd2b87abd1c2174fb0d2e7a684367e074440), [`e99fcd0`](https://github.com/evmts/evmts-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30), [`cb83c0c`](https://github.com/evmts/evmts-monorepo/commit/cb83c0c81fae63decd7bbdb79b9c3cce2c7e0b8e)]:
  - @evmts/base@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.9.0

## 0.8.1

### Patch Changes

- [#453](https://github.com/evmts/evmts-monorepo/pull/453) [`c23302a`](https://github.com/evmts/evmts-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712) Thanks [@roninjin10](https://github.com/roninjin10)! - Started publishing every commit to main so all EVMts changes can be used early. To use the latest main branch release install with `@main` tag. e.g. `npm install @evmts/ts-plugin@main`

- Updated dependencies [[`c23302a`](https://github.com/evmts/evmts-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712)]:
  - @evmts/base@0.8.1

## 0.8.0

### Minor Changes

- [#444](https://github.com/evmts/evmts-monorepo/pull/444) [`793798e`](https://github.com/evmts/evmts-monorepo/commit/793798ec3782e4081840bcd77242104c9546e70c) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for go-to-definition.

  ![Untitled_ Sep 3, 2023 6_52 AM](https://github.com/evmts/evmts-monorepo/assets/35039927/ac46caf3-32cc-4ec5-8b3b-5e1df3f7819a)

  After right clicking on a symbol and selecting go-to-definition with the language server protocol the editor will show the exact file and line of code a solidity method or event is defined on. This includes both the implementation and the interface.

### Patch Changes

- [#442](https://github.com/evmts/evmts-monorepo/pull/442) [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in EVMts is consistently updated to it's latest version using `pnpm up --latest`
- Updated dependencies [[`91e43e9`](https://github.com/evmts/evmts-monorepo/commit/91e43e952a440f037d52146511ed2508d289874e), [`eedb7e0`](https://github.com/evmts/evmts-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b), [`e1903df`](https://github.com/evmts/evmts-monorepo/commit/e1903df625c54b2447ce2bc2318f4c74f9a02bb5), [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43), [`8cceec7`](https://github.com/evmts/evmts-monorepo/commit/8cceec7409a5fc0e72168a10821a64203ba374ab), [`793798e`](https://github.com/evmts/evmts-monorepo/commit/793798ec3782e4081840bcd77242104c9546e70c)]:
  - @evmts/base@0.8.0

## 0.7.1

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.7.1

## 0.7.0

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

- [#420](https://github.com/evmts/evmts-monorepo/pull/420) [`2e85338`](https://github.com/evmts/evmts-monorepo/commit/2e85338a58ca31500ddc849903d816ce9d9f432b) Thanks [@roninjin10](https://github.com/roninjin10)! - Added solc as a peer dependency for ts-plugin

- Updated dependencies [[`8dbc952`](https://github.com/evmts/evmts-monorepo/commit/8dbc952d2dc2ca97e89bad55b162056d4f6b31a6), [`644e8fd`](https://github.com/evmts/evmts-monorepo/commit/644e8fda95d2824c9145f8d6278cbdb6272b0609), [`d7e6158`](https://github.com/evmts/evmts-monorepo/commit/d7e61583dc1529569de92868ffe49d75c045dc1f), [`4f532eb`](https://github.com/evmts/evmts-monorepo/commit/4f532ebab51004603b1a41f956729fec4a3dbd2d), [`fc28f54`](https://github.com/evmts/evmts-monorepo/commit/fc28f545635a23a76e4acce0ff48d0902eed484c)]:
  - @evmts/base@0.7.0

## 0.6.0

### Patch Changes

- [#387](https://github.com/evmts/evmts-monorepo/pull/387) [`20f941e`](https://github.com/evmts/evmts-monorepo/commit/20f941e0d79ce0f0280469992c190eb3049d5286) Thanks [@roninjin10](https://github.com/roninjin10)! - Increased test coverage of ts-plugin to >98%

- [#379](https://github.com/evmts/evmts-monorepo/pull/379) [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated build pipeline to generate .d.ts files

- Updated dependencies [[`97d7aec`](https://github.com/evmts/evmts-monorepo/commit/97d7aec9844b370129b9c46ab8c19fe9d13880ec), [`0a87d1a`](https://github.com/evmts/evmts-monorepo/commit/0a87d1a290e6cdd6902d6c1c84ea56d8bc227c45), [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142), [`58862a6`](https://github.com/evmts/evmts-monorepo/commit/58862a6ebe6ec1e04961dbc2da6e846a02ef0692)]:
  - @evmts/base@0.6.0

## 0.5.7

### Patch Changes

- [#351](https://github.com/evmts/evmts-monorepo/pull/351) [`ca58f7a`](https://github.com/evmts/evmts-monorepo/commit/ca58f7a66b01a68d93585d664a77a43f67ce5bbc) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for reload when any contract in the import graph changes

- Updated dependencies [[`4fc4872`](https://github.com/evmts/evmts-monorepo/commit/4fc48722380d4390ef527ccbb27a63f73503c750), [`97cb0c1`](https://github.com/evmts/evmts-monorepo/commit/97cb0c1381f3a0b3ffa92dfcb09c397cff3190dd), [`ca58f7a`](https://github.com/evmts/evmts-monorepo/commit/ca58f7a66b01a68d93585d664a77a43f67ce5bbc)]:
  - @evmts/base@0.5.7

## 0.5.6

### Patch Changes

- [#345](https://github.com/evmts/evmts-monorepo/pull/345) [`31186f7`](https://github.com/evmts/evmts-monorepo/commit/31186f749ce5cd3c6e0ca4d4885975aa74512c45) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed typo breaking TS language server

- [#346](https://github.com/evmts/evmts-monorepo/pull/346) [`6d9365d`](https://github.com/evmts/evmts-monorepo/commit/6d9365db3ab197ea4ad53f777d755ee3ad562b21) Thanks [@roninjin10](https://github.com/roninjin10)! - Change naming to Evmts from EVMts

- Updated dependencies [[`31186f7`](https://github.com/evmts/evmts-monorepo/commit/31186f749ce5cd3c6e0ca4d4885975aa74512c45), [`6d9365d`](https://github.com/evmts/evmts-monorepo/commit/6d9365db3ab197ea4ad53f777d755ee3ad562b21)]:
  - @evmts/base@0.5.6

## 0.5.5

### Patch Changes

- Updated dependencies [[`bec7e33`](https://github.com/evmts/evmts-monorepo/commit/bec7e3303e8b241213804c42f6673a38dc7a954c)]:
  - @evmts/base@0.5.5

## 0.5.4

### Patch Changes

- [#340](https://github.com/evmts/evmts-monorepo/pull/340) [`9f2c254`](https://github.com/evmts/evmts-monorepo/commit/9f2c2548beaf45baf3f2c91c80751ef9cc71a81f) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies

- Updated dependencies [[`c9dec08`](https://github.com/evmts/evmts-monorepo/commit/c9dec084df5c5a9999a8f917405a15b11a004c02)]:
  - @evmts/base@0.5.4

## 0.5.3

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.5.3

## 0.5.2

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.5.2

## 0.5.1

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.5.1

## 0.5.0

### Minor Changes

- [#283](https://github.com/evmts/evmts-monorepo/pull/283) [`05a8efe`](https://github.com/evmts/evmts-monorepo/commit/05a8efede4acad157e3820bdba24d92f598699e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated config schema to support etherscan

  - Solc version is now listed under `compiler.solcVersion` instead of `solc`
  - Foundry projects are now listed under `compiler.foundryProject` instead of `forge`
  - Local contracts are now specified under `localContracts.contracts` instead of `deployments`
  - New external option (unimplemented) `externalContracts` which is used to specifify contracts imported from etherscan in the next release

- [#297](https://github.com/evmts/evmts-monorepo/pull/297) [`85c340d`](https://github.com/evmts/evmts-monorepo/commit/85c340dc4a63afdbc6bd92fb4b2cf3fe0ffdc6e7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added suport for non relative imports including absolute imports with baseUrl in tsconfig, imports of contracts in node_modules, and imports of contracts in foundry lib

### Patch Changes

- [#298](https://github.com/evmts/evmts-monorepo/pull/298) [`841d6a8`](https://github.com/evmts/evmts-monorepo/commit/841d6a89f4995e4f666902d27cb7dbfc3efd77e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with etherscan links showing as undefined if they didn't exist

- Updated dependencies [[`841d6a8`](https://github.com/evmts/evmts-monorepo/commit/841d6a89f4995e4f666902d27cb7dbfc3efd77e5), [`83bf23b`](https://github.com/evmts/evmts-monorepo/commit/83bf23b0cb2eb5860f9dfb63a773541e48c62abc), [`05a8efe`](https://github.com/evmts/evmts-monorepo/commit/05a8efede4acad157e3820bdba24d92f598699e5)]:
  - @evmts/base@0.5.0

## 0.4.2

### Patch Changes

- Updated dependencies [[`fd6b482`](https://github.com/evmts/evmts-monorepo/commit/fd6b4825417fa81d601e9a3c5078131bc1f816c0)]:
  - @evmts/base@0.4.2

## 0.4.1

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.4.1

## 0.4.0

### Minor Changes

- [#268](https://github.com/evmts/evmts-monorepo/pull/268) [`a37844f`](https://github.com/evmts/evmts-monorepo/commit/a37844faa425d1eaca112b9a09640b7ec7e288de) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for detecting foundry.toml and remappings as tsconfig option. Set forge: true in plugin tsconfig options or forge: '/path/to/binary/forge' for a custom forge binary

### Patch Changes

- Updated dependencies [[`a37844f`](https://github.com/evmts/evmts-monorepo/commit/a37844faa425d1eaca112b9a09640b7ec7e288de)]:
  - @evmts/base@0.4.0

## 0.3.0

### Minor Changes

- [#259](https://github.com/evmts/evmts-monorepo/pull/259) [`7ad7463`](https://github.com/evmts/evmts-monorepo/commit/7ad746347d3e127f001abdc28fff2a10c1ffed65) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bytecode to Evmts contracts

### Patch Changes

- Updated dependencies [[`7ad7463`](https://github.com/evmts/evmts-monorepo/commit/7ad746347d3e127f001abdc28fff2a10c1ffed65), [`9a9b963`](https://github.com/evmts/evmts-monorepo/commit/9a9b96327cd2f8415cf09a471a7589fa3df90394)]:
  - @evmts/base@0.3.0

## 0.2.0

### Minor Changes

- [#252](https://github.com/evmts/evmts-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed Evmts configuration to be purely from tsconfig

### Patch Changes

- [#251](https://github.com/evmts/evmts-monorepo/pull/251) [`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing src folder in npm packages

- Updated dependencies [[`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67), [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813)]:
  - @evmts/base@0.2.0

## 0.1.0

### Minor Changes

- [#249](https://github.com/evmts/evmts-monorepo/pull/249) [`fda2523`](https://github.com/evmts/evmts-monorepo/commit/fda25237cea8a4e94fc6dc043174810ae441fb8e) Thanks [@roninjin10](https://github.com/roninjin10)! - Added etherscan links for most major EVM networks

### Patch Changes

- [#247](https://github.com/evmts/evmts-monorepo/pull/247) [`f7ba6e5`](https://github.com/evmts/evmts-monorepo/commit/f7ba6e5546263d7a94baf50ca1010a2b505580e0) Thanks [@roninjin10](https://github.com/roninjin10)! - Switch to type module and tsup build

- Updated dependencies [[`fda2523`](https://github.com/evmts/evmts-monorepo/commit/fda25237cea8a4e94fc6dc043174810ae441fb8e), [`f7ba6e5`](https://github.com/evmts/evmts-monorepo/commit/f7ba6e5546263d7a94baf50ca1010a2b505580e0)]:
  - @evmts/base@0.1.0

## 0.0.3

### Patch Changes

- [#220](https://github.com/evmts/evmts-monorepo/pull/220) [`b680670`](https://github.com/evmts/evmts-monorepo/commit/b680670341fd6ddc86dabf333adbaf7b19a46fdc) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with detecting relative imports starting with ../

- Updated dependencies []:
  - @evmts/base@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @evmts/base@0.0.2

## 0.0.1

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

- Updated dependencies [[`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec)]:
  - @evmts/base@0.0.1

## 0.0.1-next.0

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

- Updated dependencies [[`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec)]:
  - @evmts/base@0.0.1-next.0
