[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / getProof

# Function: getProof()

> **getProof**(`baseState`): (`address`, `storageSlots?`) => `Promise`\<`Proof`\>

Defined in: packages/state/src/actions/getProof.js:12

Get an EIP-1186 proof from the provider

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

## Returns

> (`address`, `storageSlots?`): `Promise`\<`Proof`\>

### Parameters

#### address

`Address`

#### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

### Returns

`Promise`\<`Proof`\>
