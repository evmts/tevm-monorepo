[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / p256VerifyPrecompile

# Variable: p256VerifyPrecompile

> `const` **p256VerifyPrecompile**: () => `object`

Creates the p256verify precompile as specified in RIP-7212
Verifies ECDSA signatures on the secp256r1 (P-256) curve

## Returns

`object`

The p256verify precompile object

### address

> **address**: [`Address`](../../address/classes/Address.md)

### function

> **function**: (`input`) => \{ `exceptionError`: [`EVMError`](../../evm/classes/EVMError.md); `executionGasUsed`: `bigint`; `returnValue`: `Uint8Array`\<`ArrayBuffer`\>; \} \| \{ `exceptionError?`: `never`; `executionGasUsed`: `bigint`; `returnValue`: `viem.ByteArray`; \}

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `data`: `Uint8Array`; `gasLimit`: `bigint`; \} |
| `input.data` | `Uint8Array` |
| `input.gasLimit` | `bigint` |

#### Returns

\{ `exceptionError`: [`EVMError`](../../evm/classes/EVMError.md); `executionGasUsed`: `bigint`; `returnValue`: `Uint8Array`\<`ArrayBuffer`\>; \} \| \{ `exceptionError?`: `never`; `executionGasUsed`: `bigint`; `returnValue`: `viem.ByteArray`; \}
