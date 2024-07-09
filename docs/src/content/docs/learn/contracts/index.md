---
title: Contract action creators
description: Guide on using contract action creators
---

## Contracts

The [`@tevm/contracts`](/reference/tevm/contract/api) package is an optional api in `tevm` that makes interacting with tevm, viem, and wagmi simple. Contracts can be created in two ways:

- Manually via [`createContract`](/reference/tevm/contract/functions/createcontract/)
- Automatically via [the Tevm bundler](../bundler/)

## Example

In the following diff the added code shows how to dispatch a [`script`](/reference/tevm/actions-types/type-aliases/scripthandler) action with a contract action creator. The removed code is both how you would do it without an action creator and also the returned value of the action creator.

```typescript
- const scriptResult = await tevm.tevmContract({
-   abi: HelloWorld.abi,
-   functionName: 'greet',
-   args: ['Vitalik'],
-   deployedBytecode: HelloWorld.deployedBytecode
- });
+ const scriptResult = await tevm.tevmContract(
+   HelloWorld.script().read.greet('Vitalik')
+ );
```

## Creating a contract with createContract

To create a contract instance pass in it's human readable ABI and name into `createContract`. If creating a script you will also need to pass `bytecode` and `deployedBytecode`.

```typescript
import { createContract} from 'tevm'

const contract = createContract({
  // make sure you use as const!!!
  humanReadableAbi: ['function exampleRead() returns (uint256)', ...] as const,
})
```

Contracts are created with humanReadableAbi but you can also use a JSON abi via the [`formatAbi` utility](/reference/tevm/contract/functions/formatabi) utility or using the `abi` param with `createContract`. Make sure you `as const` the abi. The types will not work if the abi is imported from a json file.

```typescript
import { createContract } from 'tevm'

const abi = [
  ...
] as const

const script = createContract({
  name: 'MyScript',
  abi,
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})
```

:::caution
Because of how TypeScript processes JSON files you will lose typesafety if you import your ABI from a json file or don't use `as const`. A solution to the JSON import problem will exist in a future version.
:::

See the [contract reference docs](/reference/tevm/contract/api) for more generated type information contracts.

## Creating a contract with a solidity import

Tevm supports creating contracts via importing directly from the solidity file. This makes for very nice dx.

```typescript
import { HelloWorld } from "../contracts/HelloWorld.sol";

const scriptResult = await tevm.tevmContract(
  HelloWorld.script().read.greet("Vitalik"),
);
```

## Addresses

Addresses are optional on contracts. If you want your action creators to return addresses you must add the address to the contract in one of two ways

1. Add address when calling `createContract`

```typescript
const script = createContract({
  abi: abi,
  address: "0x...",
});
```

2. Create a new contract from `withAddress`

If you already have a non addressed contract you can create an addressed one via `withAddress` utility. This is especially useful since contract imports do not come addressed.

```typescript
import { HelloWorld } from "../contracts/HelloWorld.sol";

const contract = HelloWorld.withAddress(`0x...`);
```

- `withAddress` will create a new contract and not modify the existing one.

## Standard library

A standard library of contracts is exported from `tevm/contract`. All contracts include bytecode.

- SimpleContract - A simple contract with only a getter and a setter
- ERC20 - Open zeppelin ERC20 compiled with tevm
- ERC721 - Open zeppelin ERC20 compiled with tevm

## Deployless Scripts

A deployless script is a contract that doesn't need to be deployed first. It self-deploys itself. Deployless scripts are supported by tevm actions like `MemoryClient.call` and `MemoryClient.contract`. They are also supported by [viem](https://viem.sh/docs/actions/public/call#deployless-calls) methods like `readContract`.

Tevm contracts can be turned into deployless scripts via the `script` method. Unlike normal contracts `scripts` have a `code` property.

```typescript
import { ERC20 } from "tevm/contracts";

const script = ERC20.script({
  bytecode: "0x6....",
  args: ["TokenName", "SYMBOL"],
});
```

Scripts will have a special `code` property that is the encoded `bytecode` to self deploy the contract. Now when using action creators you can supply the code. Viem and tevm will self deploy.

```typescript
import { ERC20 } from "tevm/contracts";

const script = ERC20.script({
  bytecode: "0x6....",
  args: ["TokenName", "SYMBOL"],
});

// can be used with memory client
memoryClient.contract(script.read.name()); // TokenName

// can also be used with viem
publicClient.readContract(script.read.name()); // TokenName
```

## Warning about scripts and addresses.

You can also add an address to scripts. Tevm will respect the address property and self deploy to the specified address. This may cause wierd behavior with viem however as not all RPCs support this.
