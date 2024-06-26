[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DeployHandler

# Type Alias: DeployHandler()

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](DeployResult.md)\>

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **TAllArgs** = `ContractConstructorArgs`\<`TAbi`\>

## Parameters

• **action**: [`DeployParams`](DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

## Returns

`Promise`\<[`DeployResult`](DeployResult.md)\>

## Defined in

[packages/actions/src/Deploy/DeployHandlerType.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployHandlerType.ts#L5)
