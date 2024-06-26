[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ContractResult

# Type Alias: ContractResult\<TAbi, TFunctionName, ErrorType\>

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](CallResult.md), `"errors"`\> & `object` \| [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

## Type Parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

• **ErrorType** = [`TevmContractError`](TevmContractError.md)

## Defined in

[packages/actions/src/Contract/ContractResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractResult.ts#L6)
