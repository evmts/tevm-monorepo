---
editUrl: false
next: false
prev: false
title: "createContract"
---

> **createContract**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](/generated/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`\>

Creates a tevm Contract instance from human readable abi
To use a json abi first pass it into `formatAbi` to turn it into human readable

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: [`CreateContractParams`](/generated/tevm/contract/type-aliases/createcontractparams/)\<`TName`, `THumanReadableAbi`\>

## Source

[packages/contract/src/types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
