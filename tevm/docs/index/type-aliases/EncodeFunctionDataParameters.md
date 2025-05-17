[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EncodeFunctionDataParameters

# Type Alias: EncodeFunctionDataParameters\<abi, functionName, hasFunctions, allArgs, allFunctionNames\>

> **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\> = `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](Abi.md)\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `UnionEvaluate`\<readonly \[\] *extends* `allArgs` ? `object` : `object`\> & `hasFunctions` *extends* `true` ? `unknown` : `never`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12

## Type declaration

### abi

> **abi**: `abi`

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

### functionName

`functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| [`Hex`](Hex.md) \| `undefined` = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>

### hasFunctions

`hasFunctions` = `abi` *extends* [`Abi`](Abi.md) ? [`Abi`](Abi.md) *extends* `abi` ? `true` : \[`ExtractAbiFunctions`\<`abi`\>\] *extends* \[`never`\] ? `false` : `true` : `true`

### allArgs

`allArgs` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\>

### allFunctionNames

`allFunctionNames` = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>
