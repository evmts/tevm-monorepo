[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ContractParams

# Type Alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & `BaseCallParams`\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### code?

> `readonly` `optional` **code**: [`Hex`](Hex.md)

Alias for deployedBytecode

### deployedBytecode?

> `readonly` `optional` **deployedBytecode**: [`Hex`](Hex.md)

Code to execute at the contract address.
If not provideded the code will be fetched from state

### to?

> `readonly` `optional` **to**: `Address`

The address to call.

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

packages/actions/types/Contract/ContractParams.d.ts:7
