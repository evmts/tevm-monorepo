[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ScriptParams

# Type alias: ~~ScriptParams\<TAbi, TFunctionName, TThrowOnFail\>~~

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & `BaseCallParams`\<`TThrowOnFail`\> & `object`

## Deprecated

Can use `ContraactParams` instead
Tevm params for deploying and running a script

## Type declaration

### ~~deployedBytecode~~

> `readonly` **deployedBytecode**: [`Hex`](Hex.md)

The EVM code to run.

## Type parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

• **TFunctionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions/types/Script/ScriptParams.d.ts:8
