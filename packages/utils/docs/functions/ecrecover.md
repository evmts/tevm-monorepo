**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ecrecover

# Function: ecrecover()

> **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId`?): `Uint8Array`

ECDSA public key recovery from signature.
NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions

## Parameters

▪ **msgHash**: `Uint8Array`

▪ **v**: `bigint`

▪ **r**: `Uint8Array`

▪ **s**: `Uint8Array`

▪ **chainId?**: `bigint`

## Returns

Recovered public key

## Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/signature.d.ts:19

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
