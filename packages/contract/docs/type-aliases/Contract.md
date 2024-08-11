[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / Contract

# Type Alias: Contract\<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **Contract**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object`

Represents a specific contract abi and optional bytecode.

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* `ReadonlyArray`\<`string`\>

• **TAddress** *extends* `undefined` \| `Address` = `undefined`

• **TBytecode** *extends* `undefined` \| `Hex` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| `Hex` = `undefined`

• **TCode** *extends* `undefined` \| `Hex` = `undefined`

## Type declaration

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

The json abi of the contract

#### Example

```typescript
import { MyContract } from './MyContract.sol'
console.log(MyContract.abi) // [{name: 'balanceOf', inputs: [...], outputs: [...], ...}]
```

### address

> **address**: `TAddress`

Configured address of the contract. If not set it will be undefined
To set use the `withAddress` method

### bytecode

> **bytecode**: `TBytecode`

The contract bytecode is not defined on Contract objects are expected
to be deployed to the chain. See `Script` type which is a contract with bytecode
It's provided here to allow easier access of the property when using a
`Contract | Script` union type

### code

> **code**: `TCode`

Code i

### deploy()

> **deploy**: (...`args`) => `EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\>

Action creator for deploying the contract

#### Parameters

• ...**args**: `EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\> *extends* `object` ? `TArgs` *extends* `ReadonlyArray`\<`any`\> ? `TArgs` : [] : []

#### Returns

`EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\>

### deployedBytecode

> **deployedBytecode**: `TDeployedBytecode`

The contract deployedBytecode is not defined on Contract objects are expected
to be deployed to the chain. See `Script` type which is a contract with deployedBytecode
It's provided here to allow easier access of the property when using a
`Contract | Script` union type

### events

> **events**: [`EventActionCreator`](EventActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`\>

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

### name?

> `optional` **name**: `TName`

The name of the contract. If imported this will match the name of the contract import

### read

> **read**: [`ReadActionCreator`](ReadActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TCode`\>

Action creators for contract view and pure functions

#### Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

### script

> **script**: [`CreateScript`](CreateScript.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`\>

Creates a deployless instance of the contract that can be used with
tevm and viem as [deployless contracts](https://viem.sh/docs/contract/readContract#deployless-reads)

### withAddress()

> **withAddress**: \<`TAddress`\>(`address`) => [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Adds an address to the contract. All action creators will return
the address property if added. THis method returns a new contract
it does not modify the existing contract.

#### Type Parameters

• **TAddress** *extends* `Address`

#### Parameters

• **address**: `TAddress`

#### Returns

[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

#### Example

```typescript
import { MyContract } from './MyContract.sol'
const MyContractOptimism = MyContract.withAddress('0x420...')
```

### write

> **write**: [`WriteActionCreator`](WriteActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TCode`\>

Action creators for contract payable and nonpayable functions

#### Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Examples

```typescript
import {createContract} from 'tevm/contract'

const contract = createContract({
  address,
  bytecode,
  deployedBytecode,
  humanReadableAbi,
})
```

Contracts have actions creators for read methods, write methods, deploying, and events

```typescript
tevm.contract(
-  { abi: [...], args: ['0x1234...'], functionName: 'balanceOf' },
+  MyContract.read.balanceOf('0x1234...'),
)
```

These contracts can be automatically generated by using [@tevm/bundler](https://todo.todo)
and then importing it. The Tevm bundler will automatically resolve your solidity imports into
tevm contract instances

```typescript
import { MyContract } from './MyContract.sol'

console.log(MyContract.humanReadableAbi)
```
Address can be added to a contract using the `withAddress` method

```typescript
import { MyContract } from './MyContract.sol'

const MyContractOptimism = MyContract.withAddress('0x420...')
```
Contracts can also be used with other libraries such as Viem and ethers.

```typescript
import { MyContract } from './MyContract.sol'
import { createPublicClient } from 'viem'

// see viem docs
const client = createPublicClient({...})

const result = await client.readContract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)

## Defined in

[Contract.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L59)
