**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / DecodeFunctionResultReturnType

# Type alias: DecodeFunctionResultReturnType\<abi, functionName, args\>

> **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>, `args`\>

## Type parameters

• **abi** extends `Abi` \| readonly `unknown`[] = `Abi`

• **functionName** extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| `undefined` = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>

• **args** extends `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:23
