**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DeployParams

# Type alias: DeployParams`<TThrowOnFail, TAbi, THasConstructor, TAllArgs>`

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<[`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\>, `"to"`\> & `object` & [`EncodeDeployDataParameters`](../../utils/type-aliases/EncodeDeployDataParameters.md)\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Wraps tevm_call to deploy a contract
Unlike most call actions `createTransaction` defaults to true

## Type declaration

### salt

> **salt**?: [`Hex`](Hex.md)

An optional CREATE2 salt.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |
| `TAbi` extends [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] | [`Abi`](../../index/type-aliases/Abi.md) |
| `THasConstructor` | `TAbi` extends [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) extends `TAbi` ? `true` : [`Extract`\<`TAbi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true` |
| `TAllArgs` | [`ContractConstructorArgs`](../../utils/type-aliases/ContractConstructorArgs.md)\<`TAbi`\> |

## Source

packages/actions-types/types/params/DeployParams.d.ts:8

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
