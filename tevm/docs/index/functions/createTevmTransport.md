[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / createTevmTransport

# Function: createTevmTransport()

> **createTevmTransport**(`options?`): [`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>

Defined in: tevm-monorepo/packages/memory-client/types/createTevmTransport.d.ts:1

## Parameters

### options?

[`TevmNodeOptions`](../type-aliases/TevmNodeOptions.md)\<\{ `blockExplorers?`: \{\[`key`: `string`\]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `blockTime?`: `number`; `contracts?`: \{\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `erc6492Verifier?`: `ChainContract`; `multicall3?`: `ChainContract`; \}; `copy`: () => `object`; `custom?`: `Record`\<`string`, `unknown`\>; `ensTlds?`: readonly `string`[]; `ethjsCommon`: `Common`; `experimental_preconfirmationTime?`: `number`; `extendSchema?`: `Record`\<`string`, `unknown`\>; `fees?`: `ChainFees`\<`ChainFormatters` \| `undefined`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `prepareTransactionRequest?`: `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\]; `rpcUrls`: \{\[`key`: `string`\]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; `verifyHash?`: `ChainVerifyHashFn`; \}\>

## Returns

[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>
