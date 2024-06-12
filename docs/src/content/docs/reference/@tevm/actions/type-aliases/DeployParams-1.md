---
editUrl: false
next: false
prev: false
title: "DeployParams"
---

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams-1/)\<`TThrowOnFail`\>, `"to"`\> & `object` & [`EncodeDeployDataParameters`](/reference/tevm/utils/type-aliases/encodedeploydataparameters/)\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Wraps tevm_call to deploy a contract
Unlike most call actions `createTransaction` defaults to true

## Type declaration

### salt?

> `optional` `readonly` **salt**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **THasConstructor** = `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **TAllArgs** = [`ContractConstructorArgs`](/reference/tevm/utils/type-aliases/contractconstructorargs/)\<`TAbi`\>

## Source

[packages/actions/src/Deploy/DeployParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployParams.ts#L9)
