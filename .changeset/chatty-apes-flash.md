---
"@evmts/ethers": minor
---

Added new @evmts/ethers package for typesafe usage of EVMts with ethers in https://github.com/evmts/evmts-monorepo/pull/385

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
function createEthersContract<TAddresses extends Record<number, Address>, TAbi extends Abi>(
    contract: Pick<EvmtsContract<any, TAddresses, TAbi, any>, 'abi' | 'addresses'>,
    options: CreateEthersContractOptions<keyof TAddresses & number>
): TypesafeEthersContract<TAbi>
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
import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
import {providers} from 'ethers'
// create a provider or signer for the ethers contract
const provider = new providers.JsonRpcProvider('http://localhost:8545')
// create a typesafe contract
const contract = createEthersContract(myContract, {chainId: 1, runner: provider})
// enjoy typesafety and autocompletion in your ethers contract
const balance = c.balanceOf('0x32307adfFE088e383AFAa721b06436aDaBA47DBE'),
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
  }
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
