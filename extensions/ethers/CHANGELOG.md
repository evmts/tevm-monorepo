# @evmts/ethers

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/evmts-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/evmts-monorepo/pull/676) [`93cab845`](https://github.com/evmts/evmts-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.0

### Major Changes

- [#485](https://github.com/evmts/evmts-monorepo/pull/485) [`570c4ed6`](https://github.com/evmts/evmts-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933) Thanks [@roninjin10](https://github.com/roninjin10)! - Removed global Address config and external contracts from EVMts to simplify the API

### Patch Changes

- [#548](https://github.com/evmts/evmts-monorepo/pull/548) [`c12528a3`](https://github.com/evmts/evmts-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all packages to automatically generate up to date reference docs

- [#611](https://github.com/evmts/evmts-monorepo/pull/611) [`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- [#573](https://github.com/evmts/evmts-monorepo/pull/573) [`a8248fb5`](https://github.com/evmts/evmts-monorepo/commit/a8248fb5008594a2c5d0797780d7d033a455c442) Thanks [@roninjin10](https://github.com/roninjin10)! - Converted @evmts/ethers to NodeNext. This will help compatibility

- [#492](https://github.com/evmts/evmts-monorepo/pull/492) [`2349d58c`](https://github.com/evmts/evmts-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all NPM dependencies to latest

## 0.11.1

### Patch Changes

- [#481](https://github.com/evmts/evmts-monorepo/pull/481) [`93b222f`](https://github.com/evmts/evmts-monorepo/commit/93b222f909e0a5e90826a20391a504bd677a7d35) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated evmts ethers method to use the new typesafe contract with typesafe events and some bug fixes

## 0.11.0

### Minor Changes

- [#479](https://github.com/evmts/evmts-monorepo/pull/479) [`2ac0b12`](https://github.com/evmts/evmts-monorepo/commit/2ac0b12b34ede63aac3dc1d7b698b61dfd42a5ee) Thanks [@roninjin10](https://github.com/roninjin10)! - Add typesafe event inputs. The input type will have autocomplete but still is widened to accept the ethers type. The return type is extremely difficult to override to being generic

- [#477](https://github.com/evmts/evmts-monorepo/pull/477) [`77ebd92`](https://github.com/evmts/evmts-monorepo/commit/77ebd92c8ca6c6d1c368b680624e740cfc0bd8df) Thanks [@roninjin10](https://github.com/roninjin10)! - Added Contract extends ethers.Contract class that 100% matches the real ethers.Contract. This class actually doesn't use EVMts at all and is meant to be upstreamed to ethers.js

### Patch Changes

- [#477](https://github.com/evmts/evmts-monorepo/pull/477) [`77ebd92`](https://github.com/evmts/evmts-monorepo/commit/77ebd92c8ca6c6d1c368b680624e740cfc0bd8df) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with both read and write functions returning a ContractTransactionResponse | ReturnType object

## 0.8.1

### Patch Changes

- [#453](https://github.com/evmts/evmts-monorepo/pull/453) [`c23302a`](https://github.com/evmts/evmts-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712) Thanks [@roninjin10](https://github.com/roninjin10)! - Started publishing every commit to main so all EVMts changes can be used early. To use the latest main branch release install with `@main` tag. e.g. `npm install @evmts/ts-plugin@main`

## 0.8.0

### Minor Changes

- [#438](https://github.com/evmts/evmts-monorepo/pull/438) [`eedb7e0`](https://github.com/evmts/evmts-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b) Thanks [@roninjin10](https://github.com/roninjin10)! - Improve peformance by 98% (5x) testing against 101 simple NFT contract imports

  Major change: remove bytecode from EVMts. Needing the bytecode is a niche use case and removing it improves peformance of the compiler significantly. In future bytecode will be brought back as an optional prop

  This improves peformance by 98% (50x) testing against 101 simple NFT contract imports

  Because EVMts is still considered in alpha this will not cause a major semver bump

### Patch Changes

- [#442](https://github.com/evmts/evmts-monorepo/pull/442) [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in EVMts is consistently updated to it's latest version using `pnpm up --latest`

## 0.7.0

### Minor Changes

- [#390](https://github.com/evmts/evmts-monorepo/pull/390) [`eabdb46`](https://github.com/evmts/evmts-monorepo/commit/eabdb466582000b0964d87d65da72f93dc4702d2) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @evmts/ethers package for typesafe usage of EVMts with ethers in https://github.com/evmts/evmts-monorepo/pull/385

  ## High level overview

  Previously the best way to get typesafe [contracts](https://docs.ethers.org/v6/api/contract/) with ethers was [typechain](https://github.com/dethcrypto/TypeChain) typechain improved the dev experience of using contracts via creating typesafe contracts via codegen. EVMts builds on this idea by providing the same benifit purely at runtime without any build or codegen steps.

  - `@evmts/ethers` exports a single function `createEthersContract`
  - `@evmts/ethers` only supports ethers v6 at this time

  ## Installation

  To use `@evmts/ethers` simply set up evmts as normal and add the special `@evmts/ethers` package

  ```
  npm install @evmts/ethers ethers@6
  ```

  ## API Reference

  ### createEthersContract function

  **Type**

  ```typescript
  function createEthersContract<
    TAddresses extends Record<number, Address>,
    TAbi extends Abi
  >(
    contract: Pick<
      EvmtsContract<any, TAddresses, TAbi, any>,
      "abi" | "addresses"
    >,
    options: CreateEthersContractOptions<keyof TAddresses & number>
  ): TypesafeEthersContract<TAbi>;
  ```

  **Description**
  Creates a typesafe [ethers contract](https://docs.ethers.org/v6/api/contract/) from an evmts contract. This function provides typesafe contracts for Ethereum development with Ethers.js and EVMts.

  **Params**

  - `contract`: This parameter should be an EVMts contract. It should include the 'abi' and 'addresses' properties.
  - `options`: This parameter should be an object of type `CreateEthersContractOptions`. It should include either a `chainId` or an `address`, along with the `runner`, which should be an Ethers.js provider or signer.

  **Returns**
  The function returns a `TypesafeEthersContract`. This contract is a typed version of the ethers.js contract instance, which provides type safety and autocompletion for contract methods.

  **Example**

  ```typescript
  // import a contract with evmts
  import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  import { providers } from "ethers";
  // create a provider or signer for the ethers contract
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  // create a typesafe contract
  const contract = createEthersContract(myContract, {
    chainId: 1,
    runner: provider,
  });
  // enjoy typesafety and autocompletion in your ethers contract
  const balance = c.balanceOf("0x32307adfFE088e383AFAa721b06436aDaBA47DBE");
  ```

  ## CreateEthersContractOptions Type

  **Type**

  ```typescript
  type CreateEthersContractOptions<TChainIds extends number> =
    | {
        chainId: TChainIds;
        runner: ContractRunner;
      }
    | {
        address: Address;
        runner: ContractRunner;
      };
  ```

  **Description**
  An options object type used by `createEthersContract` function. It can either provide a `chainId` if EVMts config has addresses for contracts configured for that chain or provide the `address` prop to specify the address directly. Both options require a `runner` property which is an Ethers.js provider or signer.

  **Params**

  - `chainId` or `address`: You should provide either the chainId or the address of the contract. If you use the `chainId` option, EVMts should have the addresses for contracts configured for that chain. If you use the `address` option, specify the address directly.
  - `runner`: This is an Ethers.js provider or signer.

  **Example**

  ```typescript
  const optionsWithChainId = { chainId: 1, runner: provider }; // Using chainId
  const optionsWithAddress = { address: "0x1234...abcd", runner: provider }; // Using address
  ```

  ## See also

  [ethers v6 docs](https://docs.ethers.org/v6)

## 0.6.0

### Patch Changes

- [#379](https://github.com/evmts/evmts-monorepo/pull/379) [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated build pipeline to generate .d.ts files
