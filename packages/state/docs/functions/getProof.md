**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > getProof

# Function: getProof()

> **getProof**(`baseState`): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`, `storageSlots`?): `Promise`\<`Proof`\>
>
> ### Parameters
>
> ▪ **address**: `Address`
>
> ▪ **storageSlots?**: `Uint8Array`[]
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80
>

## Source

[packages/state/src/actions/getProof.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getProof.js#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
