---
editUrl: false
next: false
prev: false
title: "createContract"
---

> **createContract**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Creates a Tevm Contract instance from a human-readable ABI or JSON ABI.
This function is the core of Tevm's contract interaction capabilities,
allowing for type-safe and easy-to-use contract interfaces.

## Type Parameters

• **TName** *extends* `string`

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `string`[]

• **TAddress** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TCode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **THumanReadableAbi** *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi`\<`TAbi`\> : `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`FormatAbi`](/reference/tevm/utils/type-aliases/formatabi/)\<`TAbi`\<`TAbi`\>\> : `never`

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](/reference/tevm/contract/type-aliases/createcontractparams/)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Defined in

[createContract.js:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createContract.js#L73)
