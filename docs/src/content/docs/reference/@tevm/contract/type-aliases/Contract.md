---
editUrl: false
next: false
prev: false
title: "Contract"
---

> **Contract**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>: `object`

Represents a specific contract with its ABI and optional bytecode.
Contracts provide type-safe interfaces for interacting with smart contracts,
including read and write methods, event filtering, and deployment.

## Type Parameters

• **TName** *extends* `string`

The name of the contract

• **THumanReadableAbi** *extends* `ReadonlyArray`\<`string`\>

The human-readable ABI of the contract

• **TAddress** *extends* `undefined` \| [`Address`](/reference/tevm/utils/type-aliases/address/) = `undefined`

The address of the contract (optional)

• **TBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) = `undefined`

The creation bytecode of the contract (optional)

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) = `undefined`

The deployed bytecode of the contract (optional)

• **TCode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) = `undefined`

The runtime bytecode of the contract (optional)

## Type declaration

### abi

> **abi**: [`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`THumanReadableAbi`\>

The JSON ABI of the contract.

#### Example

```typescript
console.log(MyContract.abi)
// [{name: 'balanceOf', inputs: [...], outputs: [...], ...}]
```

### address

> **address**: `TAddress`

The configured address of the contract. If not set, it will be undefined.
Use the `withAddress` method to set or change the address.

### bytecode

> **bytecode**: `TBytecode`

The creation bytecode of the contract.

### code

> **code**: `TCode`

The runtime bytecode of the contract, encoded with constructor arguments.

### deploy()

> **deploy**: (...`args`) => [`EncodeDeployDataParameters`](/reference/tevm/utils/type-aliases/encodedeploydataparameters/)\<[`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`THumanReadableAbi`\>\>

Action creator for deploying the contract.

#### Parameters

• ...**args**: [`EncodeDeployDataParameters`](/reference/tevm/utils/type-aliases/encodedeploydataparameters/)\<[`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`THumanReadableAbi`\>\> *extends* `object` ? `TArgs` *extends* `ReadonlyArray`\<`any`\> ? `TArgs` : [] : []

#### Returns

[`EncodeDeployDataParameters`](/reference/tevm/utils/type-aliases/encodedeploydataparameters/)\<[`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`THumanReadableAbi`\>\>

#### Example

```typescript
const deployAction = MyContract.deploy('Constructor', 'Args')
const deployedContract = await tevm.contract(deployAction)
```

### deployedBytecode

> **deployedBytecode**: `TDeployedBytecode`

The deployed bytecode of the contract.

### events

> **events**: [`EventActionCreator`](/reference/tevm/contract/type-aliases/eventactioncreator/)\<`THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`\>

Action creators for events. Used to create event filters in a type-safe way.

#### Example

```typescript
const transferFilter = MyContract.events.Transfer({ from: '0x1234...' })
const logs = await tevm.eth.getLogs(transferFilter)
```

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

The human-readable ABI of the contract.

#### Example

```typescript
console.log(MyContract.humanReadableAbi)
// ['function balanceOf(address): uint256', ...]
```

### name?

> `optional` **name**: `TName`

The name of the contract. If imported, this will match the name of the contract import.

### read

> **read**: [`ReadActionCreator`](/reference/tevm/contract/type-aliases/readactioncreator/)\<`THumanReadableAbi`, `TAddress`, `TCode`\>

Action creators for contract view and pure functions.

#### Example

```typescript
const balanceAction = MyContract.read.balanceOf('0x1234...')
const balance = await tevm.contract(balanceAction)
```

### withAddress()

> **withAddress**: \<`TNewAddress`\>(`address`) => [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TNewAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Adds an address to the contract. All action creators will include
the address property if added. This method returns a new contract;
it does not modify the existing contract.

#### Type Parameters

• **TNewAddress** *extends* [`Address`](/reference/tevm/utils/type-aliases/address/)

#### Parameters

• **address**: `TNewAddress`

#### Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TNewAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

#### Example

```typescript
const MyContractWithAddress = MyContract.withAddress('0x1234...')
```

### withCode()

> **withCode**: (`encodedBytecode`) => [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

Updates the bytecode of the contract.
Returns a new contract instance with the updated code.

#### Parameters

• **encodedBytecode**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

The encoded bytecode of the contract

#### Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

A new contract instance with updated code

#### Example

```typescript
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

const ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const UpdatedContract = Contract.withCode('0x60806040...')
const {data, abi, code, args} = UpdatedContract.read.balanceOf('0x1234567890123456789012345678901234567890')
const balance = await client.call({
  to: ADDRESS,
  data,
  abi,
  code,
  args
})
```

### write

> **write**: [`WriteActionCreator`](/reference/tevm/contract/type-aliases/writeactioncreator/)\<`THumanReadableAbi`, `TAddress`, `TCode`\>

Action creators for contract payable and nonpayable functions.

#### Example

```typescript
const transferAction = MyContract.write.transfer('0x5678...', 1000n)
const result = await tevm.contract(transferAction)
```

## Examples

Creating and using a Contract instance:
```typescript
import { createContract } from 'tevm/contract'

const MyContract = createContract({
  name: 'MyToken',
  humanReadableAbi: [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ],
  address: '0x1234567890123456789012345678901234567890'
})

// Read contract state
const balanceAction = MyContract.read.balanceOf('0xabcdef...')
const balance = await tevm.contract(balanceAction)

// Write to contract
const transferAction = MyContract.write.transfer('0xfedcba...', 1000n)
const result = await tevm.contract(transferAction)

// Create event filter
const transferFilter = MyContract.events.Transfer({ fromBlock: 'latest' })
const logs = await tevm.eth.getLogs(transferFilter)
```

Using with other libraries:
```typescript
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

const balance = await client.readContract(
  MyContract.read.balanceOf('0xabcdef...')
)
```

## Defined in

[Contract.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L62)
