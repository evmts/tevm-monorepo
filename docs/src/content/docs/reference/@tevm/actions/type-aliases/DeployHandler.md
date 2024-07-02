---
editUrl: false
next: false
prev: false
title: "DeployHandler"
---

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](/reference/tevm/actions/type-aliases/deployresult/)\>

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

Indicates whether to throw an error on failure.

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

The ABI type of the contract.

• **THasConstructor** = `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

Indicates whether the contract has a constructor.

• **TAllArgs** = [`ContractConstructorArgs`](/reference/tevm/utils/type-aliases/contractconstructorargs/)\<`TAbi`\>

The types of the constructor arguments.

## Parameters

• **action**: [`DeployParams`](/reference/tevm/actions/type-aliases/deployparams/)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

The deployment parameters.

## Returns

`Promise`\<[`DeployResult`](/reference/tevm/actions/type-aliases/deployresult/)\>

The result of the deployment.

## Defined in

[packages/actions/src/Deploy/DeployHandlerType.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployHandlerType.ts#L39)
