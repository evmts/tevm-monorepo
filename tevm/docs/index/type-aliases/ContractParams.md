**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ContractParams

# Type alias: ContractParams`<TAbi, TFunctionName, TThrowOnFail>`

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](../../actions-types/type-aliases/BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### to

> **to**: [`Address`](../../actions-types/type-aliases/Address.md)

The address to call.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](../../actions-types/type-aliases/Abi.md) \| readonly `unknown`[] | [`Abi`](../../actions-types/type-aliases/Abi.md) |
| `TFunctionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> | [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

packages/actions-types/types/params/ContractParams.d.ts:7

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
