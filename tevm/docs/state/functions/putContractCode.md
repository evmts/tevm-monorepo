[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / putContractCode

# Function: putContractCode()

> **putContractCode**(`baseState`): (`address`, `value`) => `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **value**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Source

packages/state/dist/index.d.ts:327
