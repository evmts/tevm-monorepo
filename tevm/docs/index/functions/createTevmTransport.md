[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createTevmTransport

# Function: createTevmTransport()

> **createTevmTransport**(`options?`): [`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

Defined in: packages/memory-client/types/createTevmTransport.d.ts:1

## Parameters

### options?

[`TevmNodeOptions`](../type-aliases/TevmNodeOptions.md)\<\{ `blockExplorers?`: \{[`key`: `string`]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `contracts?`: \{[`key`: `string`]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `multicall3?`: `ChainContract`; `universalSignatureVerifier?`: `ChainContract`; \}; `copy`: () => `object`; `custom?`: `Record`\<`string`, `unknown`\>; `ethjsCommon`: `Common`; `fees?`: `ChainFees`\<`undefined` \| `ChainFormatters`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `rpcUrls`: \{[`key`: `string`]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; \}\>

## Returns

[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>
