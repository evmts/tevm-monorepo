[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / decodeAbiParameters

# Function: decodeAbiParameters()

> **decodeAbiParameters**\<`params`\>(`params`, `data`): \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(params extends readonly AbiParameter\[\] ? params\<params\> : AbiParameter\[\])\[key\<key\>\], AbiParameterKind\> \}\[key\] \}

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.30/node\_modules/viem/\_types/utils/abi/decodeAbiParameters.d.ts:15

## Type Parameters

### params

`params` *extends* readonly `AbiParameter`[]

## Parameters

### params

`params`

### data

`ByteArray` | `` `0x${string}` ``

## Returns

\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(params extends readonly AbiParameter\[\] ? params\<params\> : AbiParameter\[\])\[key\<key\>\], AbiParameterKind\> \}\[key\] \}
