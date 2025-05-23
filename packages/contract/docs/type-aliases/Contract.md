[**@tevm/contract**](../README.md)

***

[@tevm/contract](../globals.md) / Contract

# Type Alias: Contract\<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode\>

> **Contract**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\> = `object`

Defined in: [Contract.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L62)

Represents a specific contract with its ABI and optional bytecode.
Contracts provide type-safe interfaces for interacting with smart contracts,
including read and write methods, event filtering, and deployment.

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

## Type Parameters

### TName

`TName` *extends* `string`

The name of the contract

### THumanReadableAbi

`THumanReadableAbi` *extends* `ReadonlyArray`\<`string`\>

The human-readable ABI of the contract

### TAddress

`TAddress` *extends* `undefined` \| `Address` = `undefined`

The address of the contract (optional)

### TBytecode

`TBytecode` *extends* `undefined` \| `Hex` = `undefined`

The creation bytecode of the contract (optional)

### TDeployedBytecode

`TDeployedBytecode` *extends* `undefined` \| `Hex` = `undefined`

The deployed bytecode of the contract (optional)

### TCode

`TCode` *extends* `undefined` \| `Hex` = `undefined`

The runtime bytecode of the contract (optional)

## Properties

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

Defined in: [Contract.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L84)

The JSON ABI of the contract.

#### Example

```typescript
console.log(MyContract.abi)
// [{name: 'balanceOf', inputs: [...], outputs: [...], ...}]
```

***

### address

> **address**: `TAddress`

Defined in: [Contract.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L74)

The configured address of the contract. If not set, it will be undefined.
Use the `withAddress` method to set or change the address.

***

### bytecode

> **bytecode**: `TBytecode`

Defined in: [Contract.ts:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L94)

The creation bytecode of the contract.

***

### code

> **code**: `TCode`

Defined in: [Contract.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L89)

The runtime bytecode of the contract, encoded with constructor arguments.

***

### deploy()

> **deploy**: (...`args`) => `EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\>

Defined in: [Contract.ts:154](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L154)

Action creator for deploying the contract.

#### Parameters

##### args

...`EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\> *extends* `object` ? `TArgs` *extends* `ReadonlyArray`\<`any`\> ? `TArgs` : \[\] : \[\]

#### Returns

`EncodeDeployDataParameters`\<`ParseAbi`\<`THumanReadableAbi`\>\>

#### Example

```typescript
const deployAction = MyContract.deploy('Constructor', 'Args')
const deployedContract = await tevm.contract(deployAction)
```

***

### deployedBytecode

> **deployedBytecode**: `TDeployedBytecode`

Defined in: [Contract.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L99)

The deployed bytecode of the contract.

***

### events

> **events**: [`EventActionCreator`](EventActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`\>

Defined in: [Contract.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L124)

Action creators for events. Used to create event filters in a type-safe way.

#### Example

```typescript
const transferFilter = MyContract.events.Transfer({ from: '0x1234...' })
const logs = await tevm.eth.getLogs(transferFilter)
```

***

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

Defined in: [Contract.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L109)

The human-readable ABI of the contract.

#### Example

```typescript
console.log(MyContract.humanReadableAbi)
// ['function balanceOf(address): uint256', ...]
```

***

### name?

> `optional` **name**: `TName`

Defined in: [Contract.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L114)

The name of the contract. If imported, this will match the name of the contract import.

***

### read

> **read**: [`ReadActionCreator`](ReadActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TCode`\>

Defined in: [Contract.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L134)

Action creators for contract view and pure functions.

#### Example

```typescript
const balanceAction = MyContract.read.balanceOf('0x1234...')
const balance = await tevm.contract(balanceAction)
```

***

### withAddress()

> **withAddress**: \<`TNewAddress`\>(`address`) => `Contract`\<`TName`, `THumanReadableAbi`, `TNewAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Defined in: [Contract.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L171)

Adds an address to the contract. All action creators will include
the address property if added. This method returns a new contract;
it does not modify the existing contract.

#### Type Parameters

##### TNewAddress

`TNewAddress` *extends* `Address`

#### Parameters

##### address

`TNewAddress`

#### Returns

`Contract`\<`TName`, `THumanReadableAbi`, `TNewAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

#### Example

```typescript
const MyContractWithAddress = MyContract.withAddress('0x1234...')
```

***

### withCode()

> **withCode**: (`encodedBytecode`) => `Contract`\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `Hex`\>

Defined in: [Contract.ts:202](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L202)

Updates the bytecode of the contract.
Returns a new contract instance with the updated code.

#### Parameters

##### encodedBytecode

`Hex`

The encoded bytecode of the contract

#### Returns

`Contract`\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `Hex`\>

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

***

### write

> **write**: [`WriteActionCreator`](WriteActionCreator.md)\<`THumanReadableAbi`, `TAddress`, `TCode`\>

Defined in: [Contract.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L144)

Action creators for contract payable and nonpayable functions.

#### Example

```typescript
const transferAction = MyContract.write.transfer('0x5678...', 1000n)
const result = await tevm.contract(transferAction)
```
