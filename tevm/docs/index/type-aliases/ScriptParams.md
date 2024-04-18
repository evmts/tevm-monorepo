**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / ScriptParams

# Type alias: ScriptParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](../../actions-types/type-aliases/BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params for deploying and running a script

## Type declaration

### deployedBytecode

> **deployedBytecode**: [`Hex`](Hex.md)

The EVM code to run.

## Type parameters

• **TAbi** extends [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

• **TFunctionName** extends [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

• **TThrowOnFail** extends `boolean` = `boolean`

## Source

packages/actions-types/types/params/ScriptParams.d.ts:7
