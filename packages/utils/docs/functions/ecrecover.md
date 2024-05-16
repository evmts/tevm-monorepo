[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / ecrecover

# Function: ecrecover()

> **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId`?): `Uint8Array`

ECDSA public key recovery from signature.
NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions

## Parameters

• **msgHash**: `Uint8Array`

• **v**: `bigint`

• **r**: `Uint8Array`

• **s**: `Uint8Array`

• **chainId?**: `bigint`

## Returns

`Uint8Array`

Recovered public key

## Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/signature.d.ts:19
