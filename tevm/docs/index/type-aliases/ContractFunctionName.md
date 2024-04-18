**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / ContractFunctionName

# Type alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\>: `ExtractAbiFunctionNames`\<`abi` extends `Abi` ? `abi` : `Abi`, `mutability`\> extends infer functionName ? [`functionName`] extends [`never`] ? `string` : `functionName` : `string`

## Type parameters

• **abi** extends `Abi` \| readonly `unknown`[] = `Abi`

• **mutability** extends `AbiStateMutability` = `AbiStateMutability`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/types/contract.d.ts:5
