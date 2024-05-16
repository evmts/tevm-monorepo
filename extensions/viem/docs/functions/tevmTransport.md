[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / tevmTransport

# Function: tevmTransport()

> **tevmTransport**(`tevm`, `options`?): `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

## Parameters

• **tevm**: `Pick`\<`object`, `"request"`\>

The Tevm instance

• **options?**: `Pick`\<`TransportConfig`\<`string`, `EIP1193RequestFn`\>, `"name"` \| `"key"` \| `"timeout"` \| `"retryDelay"` \| `"retryCount"`\>

## Returns

`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

The transport function

## Source

[extensions/viem/src/tevmTransport.js:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmTransport.js#L8)
