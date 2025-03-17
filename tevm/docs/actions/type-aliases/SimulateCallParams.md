[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SimulateCallParams

# Type Alias: SimulateCallParams

> **SimulateCallParams**: `object` & `Partial`\<[`CallParams`](../../index/type-aliases/CallParams.md)\>

Defined in: packages/actions/types/SimulateCall/SimulateCallParams.d.ts:8

Parameters for the [simulateCallHandler](../functions/simulateCallHandler.md)

Used to simulate a call transaction in the context of a specific block, with the option
to simulate after specific transactions in the block.

## Type declaration

### blockHash?

> `optional` **blockHash**: `` `0x${string}` ``

Block hash to simulate on

### blockNumber?

> `optional` **blockNumber**: `number` \| `bigint`

Block number to simulate on

### blockTag?

> `optional` **blockTag**: `string`

Block tag to simulate on ('latest', 'earliest', 'pending', 'safe', 'finalized')

### onAfterMessage()?

> `optional` **onAfterMessage**: (`data`, `next`?) => `void`

Function to execute after a message is processed

#### Parameters

##### data

`any`

##### next?

() => `void`

#### Returns

`void`

### onBeforeMessage()?

> `optional` **onBeforeMessage**: (`data`, `next`?) => `void`

Function to execute before a message is processed

#### Parameters

##### data

`any`

##### next?

() => `void`

#### Returns

`void`

### onNewContract()?

> `optional` **onNewContract**: (`data`, `next`?) => `void`

Function to execute when a new contract is created

#### Parameters

##### data

`any`

##### next?

() => `void`

#### Returns

`void`

### onStep()?

> `optional` **onStep**: (`data`, `next`?) => `void`

Function to execute during the `step` event of the EVM

#### Parameters

##### data

`any`

##### next?

() => `void`

#### Returns

`void`

### transactionHash?

> `optional` **transactionHash**: `` `0x${string}` ``

Transaction hash in the block to simulate
If provided, will override the transaction with the given parameters

### transactionIndex?

> `optional` **transactionIndex**: `number` \| `bigint`

Transaction index in the block to simulate after (optional)
If provided, will simulate after this transaction
