**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / ContractFunctionName

# Type alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\>: `ExtractAbiFunctionNames`\<`abi` extends `Abi` ? `abi` : `Abi`, `mutability`\> extends infer functionName ? [`functionName`] extends [`never`] ? `string` : `functionName` : `string`

## Type parameters

• **abi** extends `Abi` \| readonly `unknown`[] = `Abi`

• **mutability** extends `AbiStateMutability` = `AbiStateMutability`

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/types/contract.d.ts:5
