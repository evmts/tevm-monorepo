[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / getProof

# Function: getProof()

> **getProof**(`baseState`, `skipFetchingFromFork`?): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Defined in: [packages/state/src/actions/getProof.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getProof.js#L10)

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

`Address`

#### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

### Returns

`Promise`\<`Proof`\>
