[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ContractHandler

# Type Alias: ContractHandler()

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI type.

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

The function name type from the ABI.

## Parameters

• **action**: [`ContractParams`](ContractParams.md)\<`TAbi`, `TFunctionName`\>

The parameters for the contract call, including ABI, function name, and arguments.

## Returns

`Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

The result of the contract call, including execution details and any returned data.

## Defined in

[packages/actions/src/Contract/ContractHandlerType.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractHandlerType.ts#L45)
