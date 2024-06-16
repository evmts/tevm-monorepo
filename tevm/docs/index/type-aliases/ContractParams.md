[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ContractParams

# Type alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & `BaseCallParams`\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### code?

> `optional` `readonly` **code**: [`Hex`](Hex.md)

Alias for deployedBytecode

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](Hex.md)

Code to execute at the contract address.
If not provideded the code will be fetched from state

### to?

> `optional` `readonly` **to**: `Address`

The address to call.

## Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions/types/Contract/ContractParams.d.ts:7
