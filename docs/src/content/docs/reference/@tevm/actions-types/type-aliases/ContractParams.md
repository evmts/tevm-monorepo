---
editUrl: false
next: false
prev: false
title: "ContractParams"
---

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/reference/tevm/actions-types/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### to

> **to**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address to call.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) \| readonly `unknown`[] | [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/ContractParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ContractParams.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
