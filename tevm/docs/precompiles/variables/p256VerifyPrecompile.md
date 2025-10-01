[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / p256VerifyPrecompile

# Variable: p256VerifyPrecompile()

> `const` **p256VerifyPrecompile**: () => `object`

Defined in: packages/precompiles/dist/index.d.ts:241

Creates the p256verify precompile as specified in RIP-7212
Verifies ECDSA signatures on the secp256r1 (P-256) curve

## Returns

`object`

The p256verify precompile object

### address

> **address**: [`Address`](../../address/classes/Address.md)

### function()

> **function**: (`input`) => `object`

#### Parameters

##### input

###### data

`Uint8Array`

#### Returns

`object`

##### executionGasUsed

> **executionGasUsed**: `bigint`

##### returnValue

> **returnValue**: `viem.ByteArray`
