[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / getProof

# Function: getProof()

> **getProof**(`baseState`, `skipFetchingFromFork`?): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: `Address`

• **storageSlots?**: `Uint8Array`[]

### Returns

`Promise`\<`Proof`\>

## Source

[packages/state/src/actions/getProof.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getProof.js#L10)
