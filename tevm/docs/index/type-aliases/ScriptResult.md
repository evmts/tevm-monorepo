**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ScriptResult

# Type alias: ScriptResult`<TAbi, TFunctionName, TErrorType>`

> **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`, `TErrorType`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](../../errors/type-aliases/ScriptError.md) |

## Source

packages/actions-types/types/result/ScriptResult.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
