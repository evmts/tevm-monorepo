---
editUrl: false
next: false
prev: false
title: "ContractParams"
---

> **ContractParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/generated/tevm/actions-types/type-aliases/basecallparams/) & `object`

Tevm params to execute a call on a contract

## Type declaration

### to

> **to**: `Address`

The address to call.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |

## Source

[params/ContractParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ContractParams.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
