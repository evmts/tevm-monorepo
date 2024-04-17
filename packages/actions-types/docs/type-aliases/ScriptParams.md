**@tevm/actions-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/actions-types](../README.md) / ScriptParams

# Type alias: ScriptParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params for deploying and running a script

## Type declaration

### deployedBytecode

> **deployedBytecode**: `Hex`

The EVM code to run.

## Type parameters

• **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

• **TThrowOnFail** extends `boolean` = `boolean`

## Source

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ScriptParams.ts#L12)
