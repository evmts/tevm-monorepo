[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / createContract

# Function: createContract()

> **createContract**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Creates a tevm Contract instance from human readable abi

## Type Parameters

• **TName** *extends* `string`

• **TAbi** *extends* readonly `string`[] \| `Abi`

• **TAddress** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TCode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **THumanReadableAbi** *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi`\<`TAbi`\> : `TAbi` *extends* `Abi` ? `FormatAbi`\<`TAbi`\<`TAbi`\>\> : `never`

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](../type-aliases/CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Defined in

[createContract.js:35](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/contract/src/createContract.js#L35)
