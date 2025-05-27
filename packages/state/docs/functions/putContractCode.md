[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / putContractCode

# Function: putContractCode()

> **putContractCode**(`baseState`): (`address`, `value`) => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/putContractCode.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractCode.js#L11)

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

## Returns

> (`address`, `value`): `Promise`\<`void`\>

### Parameters

#### address

`Address`

#### value

`Uint8Array`

### Returns

`Promise`\<`void`\>
