**@tevm/actions-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ScriptParams

# Type alias: ScriptParams`<TAbi, TFunctionName>`

> **ScriptParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md) & `object`

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

## Source

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-spec/src/params/ScriptParams.ts#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
