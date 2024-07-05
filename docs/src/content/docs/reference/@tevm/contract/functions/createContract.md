---
editUrl: false
next: false
prev: false
title: "createContract"
---

> **createContract**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>(`__namedParameters`): [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Creates a tevm Contract instance from human readable abi

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TCode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](/reference/tevm/contract/type-aliases/createcontractparams/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Defined in

[createContract.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createContract.js#L34)
