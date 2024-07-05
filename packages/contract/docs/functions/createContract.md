[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / createContract

# Function: createContract()

> **createContract**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>(`__namedParameters`): [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Creates a tevm Contract instance from human readable abi

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TCode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](../type-aliases/CreateContractParams.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Defined in

[createContract.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createContract.js#L34)
