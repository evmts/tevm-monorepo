[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ContractParams

# Type alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### code?

> `optional` `readonly` **code**: `Hex`

Alias for deployedBytecode

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: `Hex`

Code to execute at the contract address.
If not provideded the code will be fetched from state

### to?

> `optional` `readonly` **to**: [`Address`](Address.md)

The address to call.

## Type parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/Contract/ContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractParams.ts#L8)
