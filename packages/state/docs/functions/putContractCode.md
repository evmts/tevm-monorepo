**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > putContractCode

# Function: putContractCode()

> **putContractCode**(`baseState`): (`address`, `value`) => `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`, `value`): `Promise`\<`void`\>
>
> ### Parameters
>
> ▪ **address**: `Address`
>
> ▪ **value**: `Uint8Array`
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57
>

## Source

[packages/state/src/actions/putContractCode.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractCode.js#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
