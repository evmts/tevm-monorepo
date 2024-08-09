[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / DecodeFunctionResultReturnType

# Type Alias: DecodeFunctionResultReturnType\<abi, functionName, args\>

> **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>, `args`\>

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **functionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| `undefined` = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>

• **args** *extends* `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\>

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:23
