**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > getContractCode

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
> ▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58
>

## Source

packages/state/dist/index.d.ts:257

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
