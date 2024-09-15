[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ContractFunctionName

# Type Alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\>: `ExtractAbiFunctionNames`\<`abi` *extends* `Abi` ? `abi` : `Abi`, `mutability`\> *extends* infer functionName ? [`functionName`] *extends* [`never`] ? `string` : `functionName` : `string`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **mutability** *extends* `AbiStateMutability` = `AbiStateMutability`

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/types/contract.d.ts:5
