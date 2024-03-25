**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ContractResult

# Type alias: ContractResult`<TAbi, TFunctionName, ErrorType>`

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](CallResult.md), `"errors"`\> & `object` \| [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](../../actions-types/type-aliases/Abi.md) \| readonly `unknown`[] | [`Abi`](../../actions-types/type-aliases/Abi.md) |
| `TFunctionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> | [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> |
| `ErrorType` | [`ContractError`](../../errors/type-aliases/ContractError.md) |

## Source

packages/actions-types/types/result/ContractResult.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
