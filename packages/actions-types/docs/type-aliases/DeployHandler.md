[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / DeployHandler

# Type alias: DeployHandler()

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](DeployResult.md)\>

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **TAllArgs** = `ContractConstructorArgs`\<`TAbi`\>

## Parameters

• **action**: [`DeployParams`](DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

## Returns

`Promise`\<[`DeployResult`](DeployResult.md)\>

## Source

[handlers/DeployHandler.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DeployHandler.ts#L5)
