**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ScriptParams

# Type alias: ScriptParams`<TAbi, TFunctionName, TThrowOnFail>`

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params for deploying and running a script

## Type declaration

### deployedBytecode

> **deployedBytecode**: `Hex`

The EVM code to run.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/ScriptParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ScriptParams.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
