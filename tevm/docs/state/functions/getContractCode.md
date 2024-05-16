[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / getContractCode

# Function: getContractCode()

> **getContractCode**(`baseState`): (`address`) => `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.
Returns an empty `Uint8Array` if the account has no associated code.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

### Returns

`Promise`\<`Uint8Array`\>

## Source

packages/state/dist/index.d.ts:271
