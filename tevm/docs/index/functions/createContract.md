[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / createContract

# Function: createContract()

> **createContract**\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Creates a tevm Contract instance from human readable abi

## Type Parameters

• **TName** *extends* `string`

• **TAbi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `string`[]

• **TAddress** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **TCode** *extends* `undefined` \| \`0x$\{string\}\` = `undefined`

• **THumanReadableAbi** *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi`\<`TAbi`\> : `TAbi` *extends* [`Abi`](../type-aliases/Abi.md) ? [`FormatAbi`](../type-aliases/FormatAbi.md)\<`TAbi`\<`TAbi`\>\> : `never`

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](../type-aliases/CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Defined in

packages/contract/types/createContract.d.ts:29
