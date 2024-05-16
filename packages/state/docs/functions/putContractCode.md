[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / putContractCode

# Function: putContractCode()

> **putContractCode**(`baseState`): (`address`, `value`) => `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: `Address`

• **value**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/putContractCode.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractCode.js#L6)
