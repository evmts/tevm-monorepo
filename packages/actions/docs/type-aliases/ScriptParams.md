[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ScriptParams

# Type alias: ScriptParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params for deploying and running a script

## Type declaration

### deployedBytecode

> `readonly` **deployedBytecode**: `Hex`

The EVM code to run.

## Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/Script/ScriptParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptParams.ts#L8)