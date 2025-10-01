[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / decodeAbiParameters

# Function: decodeAbiParameters()

> **decodeAbiParameters**\<`params`\>(`params`, `data`): \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(params extends readonly AbiParameter\[\] ? params\<params\> : AbiParameter\[\])\[key\<key\>\], AbiParameterKind\> \}\[key\] \}

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.3\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/abi/decodeAbiParameters.d.ts:15

## Type Parameters

### params

`params` *extends* readonly `AbiParameter`[]

## Parameters

### params

`params`

### data

`` `0x${string}` `` | `ByteArray`

## Returns

\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(params extends readonly AbiParameter\[\] ? params\<params\> : AbiParameter\[\])\[key\<key\>\], AbiParameterKind\> \}\[key\] \}
