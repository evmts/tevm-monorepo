**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DeployHandler

# Type alias: DeployHandler

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](DeployResult.md)\>

## Type parameters

▪ **TThrowOnFail** extends `boolean` = `boolean`

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **THasConstructor** = `TAbi` extends `Abi` ? `Abi` extends `TAbi` ? `true` : [`Extract`\<`TAbi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`

▪ **TAllArgs** = `ContractConstructorArgs`\<`TAbi`\>

## Parameters

▪ **action**: [`DeployParams`](DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

## Source

[handlers/DeployHandler.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DeployHandler.ts#L5)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
