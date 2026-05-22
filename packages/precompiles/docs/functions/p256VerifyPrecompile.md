[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / p256VerifyPrecompile

# Function: p256VerifyPrecompile()

> **p256VerifyPrecompile**(): `object`

Defined in: [p256verify.precompile.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/p256verify.precompile.ts#L30)

Creates the p256verify precompile as specified in RIP-7212
Verifies ECDSA signatures on the secp256r1 (P-256) curve

## Returns

`object`

The p256verify precompile object

### address

> **address**: `Address` = `P256_VERIFY_ADDRESS`

### function

> **function**: (`input`) => \{ `exceptionError`: `EVMError`; `executionGasUsed`: `bigint`; `returnValue`: `Uint8Array`\<`ArrayBuffer`\>; \} \| \{ `exceptionError?`: `undefined`; `executionGasUsed`: `bigint`; `returnValue`: `ByteArray`; \}

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `data`: `Uint8Array`; `gasLimit`: `bigint`; \} |
| `input.data` | `Uint8Array` |
| `input.gasLimit` | `bigint` |

#### Returns

\{ `exceptionError`: `EVMError`; `executionGasUsed`: `bigint`; `returnValue`: `Uint8Array`\<`ArrayBuffer`\>; \} \| \{ `exceptionError?`: `undefined`; `executionGasUsed`: `bigint`; `returnValue`: `ByteArray`; \}
