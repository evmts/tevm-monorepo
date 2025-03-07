[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / createClient

# Function: createClient()

> **createClient**\<`transport`, `chain`, `accountOrAddress`, `rpcSchema`\>(`parameters`): `Prettify`\<`Client`\<`transport`, `chain`, `accountOrAddress` *extends* `Address` ? `Prettify`\<`JsonRpcAccount`\<`accountOrAddress`\>\> : `accountOrAddress`, `rpcSchema`\>\>

## Type Parameters

• **transport** *extends* `Transport`

• **chain** *extends* `undefined` \| `Chain` = `undefined`

• **accountOrAddress** *extends* `undefined` \| \`0x$\{string\}\` \| `Account` = `undefined`

• **rpcSchema** *extends* `undefined` \| `RpcSchema` = `undefined`

## Parameters

• **parameters**: `ClientConfig`\<`transport`, `chain`, `accountOrAddress`, `rpcSchema`\>

## Returns

`Prettify`\<`Client`\<`transport`, `chain`, `accountOrAddress` *extends* `Address` ? `Prettify`\<`JsonRpcAccount`\<`accountOrAddress`\>\> : `accountOrAddress`, `rpcSchema`\>\>

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.7.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/clients/createClient.d.ts:99
