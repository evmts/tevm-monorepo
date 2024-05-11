**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > getContractCode

# Function: getContractCode()

> **getContractCode**(`baseState`): (`address`) => `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.
Returns an empty `Uint8Array` if the account has no associated code.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`): `Promise`\<`Uint8Array`\>
>
> ### Parameters
>
> ▪ **address**: `Address`
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58
>

## Source

[packages/state/src/actions/getContractCode.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractCode.js#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
