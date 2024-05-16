[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / getContractStorage

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

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

### Returns

`Promise`\<`Uint8Array`\>

## Source

packages/state/dist/index.d.ts:280
