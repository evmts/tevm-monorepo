**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ContractResult

# Type alias: ContractResult`<TAbi, TFunctionName, ErrorType>`

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](CallResult.md), `"errors"`\> & `object` \| [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | [`ContractError`](ContractError.md) |

## Source

vm/api/types/result/ContractResult.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
