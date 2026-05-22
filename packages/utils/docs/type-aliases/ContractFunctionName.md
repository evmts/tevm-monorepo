[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / ContractFunctionName

# Type Alias: ContractFunctionName\<abi, mutability\>

> **ContractFunctionName**\<`abi`, `mutability`\> = [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi` *extends* [`Abi`](Abi.md) ? `abi` : [`Abi`](Abi.md), `mutability`\> *extends* infer functionName ? \[`functionName`\] *extends* \[`never`\] ? `string` : `functionName` : `string`

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/contract.d.ts:5

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] | [`Abi`](Abi.md) |
| `mutability` *extends* `AbiStateMutability` | `AbiStateMutability` |
