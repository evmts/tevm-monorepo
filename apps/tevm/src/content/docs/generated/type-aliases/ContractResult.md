---
editUrl: false
next: false
prev: false
title: "ContractResult"
---

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](/generated/type-aliases/callresult/), `"errors"`\> & `object` \| [`CallResult`](/generated/type-aliases/callresult/)\<`ErrorType`\> & `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | [`ContractError`](/generated/type-aliases/contracterror/) |

## Source

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/ContractResult.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
