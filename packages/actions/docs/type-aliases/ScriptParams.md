[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ScriptParams

# Type Alias: ~~ScriptParams\<TAbi, TFunctionName, TThrowOnFail\>~~

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

## Type declaration

### ~~deployedBytecode~~

> `readonly` **deployedBytecode**: `Hex`

The EVM code to run.

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Deprecated

Can use `ContraactParams` instead
Tevm params for deploying and running a script

## Defined in

[packages/actions/src/Script/ScriptParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptParams.ts#L9)
