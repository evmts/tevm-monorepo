[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / putContractCode

# Function: putContractCode()

> **putContractCode**(`baseState`, `skipFetchingFromFork`?): (`address`, `value`) => `Promise`\<`void`\>

Defined in: packages/state/dist/index.d.ts:370

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

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

#### value

`Uint8Array`

### Returns

`Promise`\<`void`\>
