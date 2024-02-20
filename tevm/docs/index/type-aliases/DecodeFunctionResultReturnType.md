**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > DecodeFunctionResultReturnType

# Type alias: DecodeFunctionResultReturnType`<abi, functionName, args>`

> **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>, `args`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| `undefined` | [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> |
| `args` extends `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> |

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:23

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
