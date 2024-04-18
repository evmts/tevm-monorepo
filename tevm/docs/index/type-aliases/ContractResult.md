**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / ContractResult

# Type alias: ContractResult\<TAbi, TFunctionName, ErrorType\>

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](CallResult.md), `"errors"`\> & `object` \| [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

## Type parameters

• **TAbi** extends [`Abi`](../../actions-types/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../actions-types/type-aliases/Abi.md)

• **TFunctionName** extends [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

• **ErrorType** = [`ContractError`](../../errors/type-aliases/ContractError.md)

## Source

packages/actions-types/types/result/ContractResult.d.ts:5
