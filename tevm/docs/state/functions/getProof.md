[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getProof

# Function: getProof()

> **getProof**(`baseState`, `skipFetchingFromFork`?): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Defined in: packages/state/dist/index.d.ts:315

Get an EIP-1186 proof from the provider

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

### Parameters

#### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

### Returns

`Promise`\<`Proof`\>
