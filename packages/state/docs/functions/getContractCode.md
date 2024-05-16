[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / getContractCode

# Function: getContractCode()

> **getContractCode**(`baseState`): (`address`) => `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.
Returns an empty `Uint8Array` if the account has no associated code.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: `Address`

### Returns

`Promise`\<`Uint8Array`\>

## Source

[packages/state/src/actions/getContractCode.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractCode.js#L11)
