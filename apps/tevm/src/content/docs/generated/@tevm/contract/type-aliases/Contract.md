---
editUrl: false
next: false
prev: false
title: "Contract"
---

> **Contract**\<`TName`, `THumanReadableAbi`\>: `object`

An action creator for `Tevm.contract`, `Tevm.eth.getEvents` and more
It also is the type solidity contract imports are turned into.

Contracts generate actions that can be dispatched to tevm methods
such as `contract` `traceContract` and `eth.events`

## Example

```typescript
tevm.contract(
-  { abi: [...], args: ['0x1234...'], functionName: 'balanceOf' },
+  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

A contract can be made via the `createContract` function

## Example

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract: Contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```
These contracts can be automatically generated by using [@tevm/bundler](https://todo.todo)
and then importing it. The Tevm bundler will automatically resolve your solidity imports into
tevm contract instances

## Example

```typescript
import { MyContract } from './MyContract.sol'

console.log(MyContract.humanReadableAbi)
```
Address can be added to a contract using the `withAddress` method

## Example

```typescript
import { MyContract } from './MyContract.sol'

const MyContractOptimism = MyContract.withAddress('0x420...')
```
Contracts can also be used with other libraries such as Viem and ethers.

## Example

```typescript
import { MyContract } from './MyContract.sol'
import { createPublicClient } from 'viem'

// see viem docs
const client = createPublicClient({...})

const result = await client.readContract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends `ReadonlyArray`\<`string`\> |

## Type declaration

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

The json abi of the contract

#### Example

```typescript
import { MyContract } from './MyContract.sol'
console.log(MyContract.abi) // [{name: 'balanceOf', inputs: [...], outputs: [...], ...}]
```

### bytecode

> **bytecode**?: `undefined`

The contract bytecode is not defined on Contract objects are expected
to be deployed to the chain. See `Script` type which is a contract with bytecode
It's provided here to allow easier access of the property when using a
`Contract | Script` union type

### deployedBytecode

> **deployedBytecode**?: `undefined`

The contract deployedBytecode is not defined on Contract objects are expected
to be deployed to the chain. See `Script` type which is a contract with deployedBytecode
It's provided here to allow easier access of the property when using a
`Contract | Script` union type

### events

> **events**: [`EventActionCreator`](/generated/tevm/contract/type-aliases/eventactioncreator/)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

Action creators for events. Can be used to create event filters in a typesafe way

#### Example

```typescript
tevm.eth.getLog(
  MyContract.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

The human readable abi of the contract

#### Example

```typescript
import { MyContract } from './MyContract.sol'
console.log(MyContract.humanReadableAbi) 
// ['function balanceOf(address): uint256', ...]
```

### name

> **name**: `TName`

The name of the contract. If imported this will match the name of the contract import

### read

> **read**: [`ReadActionCreator`](/generated/tevm/contract/type-aliases/readactioncreator/)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

Action creators for contract view and pure functions

#### Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### withAddress

> **withAddress**: \<`TAddress`\>(`address`) => `Omit`\<[`Contract`](/generated/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`\>, `"read"` \| `"write"` \| `"events"` \| `"address"`\> & `object`

Adds an address to the contract. All action creators will return
the address property if added.

#### Type parameters

▪ **TAddress** extends `Address`

#### Parameters

▪ **address**: `TAddress`

#### Returns

#### Example

```typescript
import { MyContract } from './MyContract.sol'
const MyContractOptimism = MyContract.withAddress('0x420...')
```

### write

> **write**: [`WriteActionCreator`](/generated/tevm/contract/type-aliases/writeactioncreator/)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

Action creators for contract payable and nonpayable functions

#### Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Source

[packages/contract/src/Contract.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L61)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)