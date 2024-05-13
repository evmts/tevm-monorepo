**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > tevmTransport

# Function: tevmTransport()

> **tevmTransport**(`tevm`, `options`?): `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

## Parameters

▪ **tevm**: `Pick`\<`object`, `"request"`\>

The Tevm instance

▪ **options?**: `Pick`\<`TransportConfig`\<`string`, `EIP1193RequestFn`\>, `"name"` \| `"key"` \| `"timeout"` \| `"retryDelay"` \| `"retryCount"`\>

## Returns

The transport function

## Source

[extensions/viem/src/tevmTransport.js:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmTransport.js#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
