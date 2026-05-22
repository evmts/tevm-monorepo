[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EncodeFunctionDataParameters

# Type Alias: EncodeFunctionDataParameters\<abi, functionName, hasFunctions, allArgs, allFunctionNames\>

> **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\> = `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](Abi.md)\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `UnionEvaluate`\<readonly \[\] *extends* `allArgs` ? `object` : `object`\> & `hasFunctions` *extends* `true` ? `unknown` : `never`

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12

## Type Declaration

### abi

> **abi**: `abi`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| [`Hex`](Hex.md) \| `undefined` | [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> |
| `hasFunctions` | `abi` *extends* [`Abi`](Abi.md) ? [`Abi`](Abi.md) *extends* `abi` ? `true` : \[`ExtractAbiFunctions`\<`abi`\>\] *extends* \[`never`\] ? `false` : `true` : `true` |
| `allArgs` | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> |
| `allFunctionNames` | [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> |
