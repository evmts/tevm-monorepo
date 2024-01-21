**@tevm/actions-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractParams

# Type alias: ContractParams`<TAbi, TFunctionName>`

> **ContractParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md) & `object`

Tevm params to execute a call on a contract

## Type declaration

### to

> **to**: `Address`

The address to call.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |

## Source

[params/ContractParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-spec/src/params/ContractParams.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
