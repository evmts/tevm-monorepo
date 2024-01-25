---
title: Contract action creators
description: Guide on using contract action creators
---

## Contract action creators

The [`@tevm/contracts`](/reference/tevm/contract/api) package is an optional module in `tevm` for cleaning up your contract code. It represents a contract or script and provides a typesafe api for creating [actions](/learn/actions)

In the following diff the added code shows how to dispatch a [`script`](/reference/tevm/actions-types/type-aliases/scripthandler) action with a contract action creator. The removed code is both how you would do it without an action creator and also the returned value of the action creator.

```typescript
- const scriptResult = await tevm.script({
-   abi: HelloWorld.abi,
-   functionName: 'greet',
-   args: ['Vitalik'],
-   deployedBytecode: HelloWorld.deployedBytecode
- });
+ const scriptResult = await tevm.script(
+   HelloWorld.read.greet('Vitalik')
+ );
```

## Creating a contract with createScript or createContract

There are two ways to create a contract.

1. Using the [`createScript`](/reference/tevm/contract/functions/createscript) or [createContract](/reference/tevm/contract/functions/createcontract) utils.
2. Automatically [generating scripts with the tevm bundler](/learn/solidity-imports)

To create a contract instance pass in it's human readable ABI and name into `createContract`. If creating a script you will also need to pass `bytecode` and `deployedBytecode`

```typescript
import { createScript} from 'tevm/contract'

const script = createScript({
  name: 'MyScript',
  humanReadableAbi: ['function exampleRead() returns (uint256)', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})
```

Contracts and scripts are created with humanReadableAbi but you can also use a JSON abi via the [`formatAbi` utility](/reference/tevm/contract/functions/formatabi).

```typescript
import { createScript, formatAbi } from 'tevm/contract'

const abi = [
  ...
] as const

const script = createScript({
  name: 'MyScript',
  humanReadableAbi: formatAbi(abi),
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})
```

:::caution
Because of how TypeScript processes JSON files you will lose typesafety if you import your ABI from a json file or don't use `as const`. A solution to the JSON import problem will exist in a future version.
:::

See the [contract reference docs](/reference/tevm/contract/api) for more information on creating contracts.

## Contracts vs scripts

There are two types of contracts.  

1. [Contracts](/reference/tevm/contract/type-aliases/contract) which are created with [createContract](/reference/tevm/contract/functions/createcontract)
2. [Scripts](/reference/tevm/contract/type-aliases/script) which are created with [createScript](/reference/tevm/contract/functions/createscript)

The only difference between the two is `Scripts` have bytecode and can run without being deployed first. Contracts can only run with the bytecode already deployed to the chain. Contract actions require a `to` address that is used by the EVM to fetch the bytecode from storage.

Scripts are a superset of contracts and can be used both as scripts (e.g. using their own bytecode) and as contracts (e.g. using their abi against a deployed contract).

## Addresses

Contracts by default don't have any address thus you need to add an address when using a contract action.

```typescript
await client.contract({
  ...MyContract.read.balanceOf(address),
  to: contractAddress
})
```

Tevm contracts have a `withAddress` method that cleans this up.

```typescript
await client.contract(
  MyContract.withAddress(contractAddress).read.balanceOf(address),
)
```

If you want to consistently associate this address with this contract you can export the addressed contract from a typescript file.

```typescript
export {
  MyContract: MyContract.withAddress(contractAddress)
}
```

## Usage with other libraries

Contracts and their action creators are intentionally designed to compose well with other libraries outside of Tevm including `ethers` `viem` and `wagmi`.

Because the `tevm` api tries to stay maximally consistent with the `viem` api the integration with wagmi and viem is first-class.  For example, the below example shows how a read action creator can compose with [viem readContract action](https://viem.sh/docs/contract/readContract.html).

```typescript
import {createClient, http} from 'viem'
import { createContract } from 'tevm/contract'

const client = createClient({transport: http('https://mainnet.optimism.io')})

const contract = createContract({
  name: 'MyScript',
  humanReadableAbi: ['function balanceOf(address owner) returns (uint256)', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})

const balance = client.readContract(
  contract.read.balanceOf('0x122...')
)
```
