**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ScriptResult

# Type alias: ScriptResult`<TAbi, TFunctionName, TErrorType>`

> **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`, `TErrorType`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](../../api/type-aliases/ScriptError.md) |

## Source

vm/api/dist/index.d.ts:1150

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
