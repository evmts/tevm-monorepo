[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / getProof

# Function: getProof()

> **getProof**(`baseState`, `skipFetchingFromFork`?): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **storageSlots?**: `Uint8Array`[]

### Returns

`Promise`\<`Proof`\>

## Source

packages/state/dist/index.d.ts:301
