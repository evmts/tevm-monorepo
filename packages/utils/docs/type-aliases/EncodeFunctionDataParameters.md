**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EncodeFunctionDataParameters

# Type alias: EncodeFunctionDataParameters`<abi, functionName, hasFunctions, allArgs, allFunctionNames>`

> **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\>: `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](Abi.md)\> extends `true` ? `abi`[`"length"`] extends `1` ? `object` : `object` : `object`\> & `UnionEvaluate`\<readonly [] extends `allArgs` ? `object` : `object`\> & `hasFunctions` extends `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| `undefined` | [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> |
| `hasFunctions` | `abi` extends [`Abi`](Abi.md) ? [`Abi`](Abi.md) extends `abi` ? `true` : [`ExtractAbiFunctions`\<`abi`\>] extends [`never`] ? `false` : `true` : `true` |
| `allArgs` | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> |
| `allFunctionNames` | [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> |

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
