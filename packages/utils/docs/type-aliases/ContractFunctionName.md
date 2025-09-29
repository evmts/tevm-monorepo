[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / ContractFunctionName

# Type Alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\> = [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi` *extends* [`Abi`](Abi.md) ? `abi` : [`Abi`](Abi.md), `mutability`\> *extends* infer functionName ? \[`functionName`\] *extends* \[`never`\] ? `string` : `functionName` : `string`

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/types/contract.d.ts:5

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

### mutability

`mutability` *extends* `AbiStateMutability` = `AbiStateMutability`
