**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ScriptResult

# Type alias: ScriptResult`<TAbi, TFunctionName, TErrorType>`

> **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`, `TErrorType`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](ScriptError.md) |

## Source

[result/ScriptResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ScriptResult.ts#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
