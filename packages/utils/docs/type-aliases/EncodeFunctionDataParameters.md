[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / EncodeFunctionDataParameters

# Type alias: EncodeFunctionDataParameters\<abi, functionName, hasFunctions, allArgs, allFunctionNames\>

> **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\>: `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, `Abi`\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `UnionEvaluate`\<readonly [] *extends* `allArgs` ? `object` : `object`\> & `hasFunctions` *extends* `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **functionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| [`Hex`](Hex.md) \| `undefined` = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>

• **hasFunctions** = `abi` *extends* `Abi` ? `Abi` *extends* `abi` ? `true` : [`ExtractAbiFunctions`\<`abi`\>] *extends* [`never`] ? `false` : `true` : `true`

• **allArgs** = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\>

• **allFunctionNames** = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>

## Source

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12
