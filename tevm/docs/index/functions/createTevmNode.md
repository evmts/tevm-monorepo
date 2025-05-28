[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createTevmNode

# Function: createTevmNode()

> **createTevmNode**(`options?`): [`TevmNode`](../type-aliases/TevmNode.md)

Defined in: packages/node/dist/index.d.ts:448

## Parameters

### options?

[`TevmNodeOptions`](../type-aliases/TevmNodeOptions.md)\<\{ `blockExplorers?`: \{[`key`: `string`]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `contracts?`: \{[`key`: `string`]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `multicall3?`: `ChainContract`; `universalSignatureVerifier?`: `ChainContract`; \}; `copy`: () => `object`; `custom?`: `Record`\<`string`, `unknown`\>; `ensTlds?`: readonly `string`[]; `ethjsCommon`: `Common`; `fees?`: `ChainFees`\<`undefined` \| `ChainFormatters`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `rpcUrls`: \{[`key`: `string`]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; \}\>

## Returns

[`TevmNode`](../type-aliases/TevmNode.md)
