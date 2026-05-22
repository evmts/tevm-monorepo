[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ContractFunctionName

# Type Alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\> = [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi` *extends* [`Abi`](Abi.md) ? `abi` : [`Abi`](Abi.md), `mutability`\> *extends* infer functionName ? \[`functionName`\] *extends* \[`never`\] ? `string` : `functionName` : `string`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `mutability` *extends* `AbiStateMutability` | `AbiStateMutability` |
