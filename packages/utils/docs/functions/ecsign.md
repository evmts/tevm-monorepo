**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ecsign

# Function: ecsign()

> **ecsign**(`msgHash`, `privateKey`, `chainId`?): `ECDSASignature`

Returns the ECDSA signature of a message hash.

If `chainId` is provided assume an EIP-155-style signature and calculate the `v` value
accordingly, otherwise return a "static" `v` just derived from the `recovery` bit

## Parameters

▪ **msgHash**: `Uint8Array`

▪ **privateKey**: `Uint8Array`

▪ **chainId?**: `bigint`

## Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/signature.d.ts:12

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
