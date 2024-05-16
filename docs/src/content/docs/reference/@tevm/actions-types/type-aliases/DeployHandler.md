---
editUrl: false
next: false
prev: false
title: "DeployHandler"
---

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](/reference/tevm/actions-types/type-aliases/deployresult/)\>

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **THasConstructor** = `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **TAllArgs** = [`ContractConstructorArgs`](/reference/tevm/utils/type-aliases/contractconstructorargs/)\<`TAbi`\>

## Parameters

• **action**: [`DeployParams`](/reference/tevm/actions-types/type-aliases/deployparams/)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

## Returns

`Promise`\<[`DeployResult`](/reference/tevm/actions-types/type-aliases/deployresult/)\>

## Source

[handlers/DeployHandler.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DeployHandler.ts#L5)
