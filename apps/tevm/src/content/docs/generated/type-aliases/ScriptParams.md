---
editUrl: false
next: false
prev: false
title: "ScriptParams"
---

> **ScriptParams**\<`TAbi`, `TFunctionName`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/generated/type-aliases/basecallparams/) & `object`

Tevm params for deploying and running a script

## Type declaration

### deployedBytecode

> **deployedBytecode**: `Hex`

The EVM code to run.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |

## Source

vm/api/dist/index.d.ts:183

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
