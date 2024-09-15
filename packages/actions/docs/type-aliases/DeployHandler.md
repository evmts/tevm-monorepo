[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DeployHandler

# Type Alias: DeployHandler()

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](DeployResult.md)\>

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

Indicates whether to throw an error on failure.

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI type of the contract.

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

Indicates whether the contract has a constructor.

• **TAllArgs** = `ContractConstructorArgs`\<`TAbi`\>

The types of the constructor arguments.

## Parameters

• **action**: [`DeployParams`](DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

The deployment parameters.

## Returns

`Promise`\<[`DeployResult`](DeployResult.md)\>

The result of the deployment.

## Defined in

[packages/actions/src/Deploy/DeployHandlerType.ts:39](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployHandlerType.ts#L39)
