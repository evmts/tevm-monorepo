[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / getContractStorage

# Function: getContractStorage()

> **getContractStorage**(`baseState`): (`address`, `key`) => `Promise`\<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

### Returns

`Promise`\<`Uint8Array`\>

## Source

[packages/state/src/actions/getContractStorage.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractStorage.js#L13)
