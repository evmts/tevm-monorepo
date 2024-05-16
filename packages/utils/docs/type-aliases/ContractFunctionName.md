[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / ContractFunctionName

# Type alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\>: `ExtractAbiFunctionNames`\<`abi` *extends* `Abi` ? `abi` : `Abi`, `mutability`\> *extends* infer functionName ? [`functionName`] *extends* [`never`] ? `string` : `functionName` : `string`

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **mutability** *extends* `AbiStateMutability` = `AbiStateMutability`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/types/contract.d.ts:5
