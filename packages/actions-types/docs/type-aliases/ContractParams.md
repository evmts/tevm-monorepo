**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractParams

# Type alias: ContractParams`<TAbi, TFunctionName, TThrowOnFail>`

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### to

> **to**: [`Address`](Address.md)

The address to call.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/ContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ContractParams.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
