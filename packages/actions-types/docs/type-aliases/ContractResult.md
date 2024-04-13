**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractResult

# Type alias: ContractResult`<TAbi, TFunctionName, ErrorType>`

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](CallResult.md), `"errors"`\> & `object` \| [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | `ContractError` |

## Source

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ContractResult.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
