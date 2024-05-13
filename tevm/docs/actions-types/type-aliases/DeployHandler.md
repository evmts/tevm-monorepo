**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DeployHandler

# Type alias: DeployHandler

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](DeployResult.md)\>

## Type parameters

▪ **TThrowOnFail** extends `boolean` = `boolean`

▪ **TAbi** extends [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

▪ **THasConstructor** = `TAbi` extends [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) extends `TAbi` ? `true` : [`Extract`\<`TAbi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`

▪ **TAllArgs** = [`ContractConstructorArgs`](../../utils/type-aliases/ContractConstructorArgs.md)\<`TAbi`\>

## Parameters

▪ **action**: [`DeployParams`](DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

## Source

packages/actions-types/types/handlers/DeployHandler.d.ts:4

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
