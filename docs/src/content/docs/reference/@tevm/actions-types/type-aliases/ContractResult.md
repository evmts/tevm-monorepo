---
editUrl: false
next: false
prev: false
title: "ContractResult"
---

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](/reference/tevm/actions-types/type-aliases/callresult/), `"errors"`\> & `object` \| [`CallResult`](/reference/tevm/actions-types/type-aliases/callresult/)\<`ErrorType`\> & `object`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) \| readonly `unknown`[] | [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `ErrorType` | [`ContractError`](/reference/tevm/errors/type-aliases/contracterror/) |

## Source

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ContractResult.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
