[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / txLogsBloom

# Function: txLogsBloom()

> **txLogsBloom**(`logs`, `common`): `Bloom`

Defined in: [packages/vm/src/actions/txLogsBloom.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/txLogsBloom.js#L11)

**`Internal`**

Creates a bloom filter from the logs.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `logs` | `any`[] \| `undefined` | The logs to create the bloom filter from. |
| `common` | \{ `blockExplorers?`: \{\[`key`: `string`\]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}; `blockTime?`: `number`; `contracts?`: \{\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `erc6492Verifier?`: `ChainContract`; `multicall3?`: `ChainContract`; \}; `copy`: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \}; `custom?`: `Record`\<`string`, `unknown`\>; `ensTlds?`: readonly `string`[]; `ethjsCommon`: `Common`; `experimental_preconfirmationTime?`: `number`; `extendSchema?`: `Record`\<`string`, `unknown`\>; `fees?`: `ChainFees`\<`ChainFormatters` \| `undefined`\>; `formatters?`: `ChainFormatters`; `id`: `number`; `name`: `string`; `nativeCurrency`: `ChainNativeCurrency`; `prepareTransactionRequest?`: `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\]; `rpcUrls`: \{\[`key`: `string`\]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}; `serializers?`: `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\>; `sourceId?`: `number`; `testnet?`: `boolean`; `verifyHash?`: `ChainVerifyHashFn`; \} | The common object.')} |
| `common.blockExplorers?` | \{\[`key`: `string`\]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \} | Collection of block explorers |
| `common.blockExplorers.default` | `ChainBlockExplorer` | - |
| `common.blockTime?` | `number` | Block time in milliseconds. |
| `common.contracts?` | \{\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `erc6492Verifier?`: `ChainContract`; `multicall3?`: `ChainContract`; \} | Collection of contracts |
| `common.contracts.ensRegistry?` | `ChainContract` | - |
| `common.contracts.ensUniversalResolver?` | `ChainContract` | - |
| `common.contracts.erc6492Verifier?` | `ChainContract` | - |
| `common.contracts.multicall3?` | `ChainContract` | - |
| `common.copy` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | - |
| `common.custom?` | `Record`\<`string`, `unknown`\> | Custom chain data. **Deprecated** use `.extend` instead. |
| `common.ensTlds?` | readonly `string`[] | Collection of ENS TLDs for the chain. |
| `common.ethjsCommon` | `Common` | - |
| `common.experimental_preconfirmationTime?` | `number` | Preconfirmation time in milliseconds. |
| `common.extendSchema?` | `Record`\<`string`, `unknown`\> | Extend schema. |
| `common.fees?` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | Modifies how fees are derived. |
| `common.formatters?` | `ChainFormatters` | Modifies how data is formatted and typed (e.g. blocks and transactions) |
| `common.id` | `number` | ID in number form |
| `common.name` | `string` | Human-readable name |
| `common.nativeCurrency` | `ChainNativeCurrency` | Currency used by chain |
| `common.prepareTransactionRequest?` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | Function to prepare a transaction request. Runs before the transaction is filled. |
| `common.rpcUrls` | \{\[`key`: `string`\]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \} | Collection of RPC endpoints |
| `common.rpcUrls.default` | `ChainRpcUrls` | - |
| `common.serializers?` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). |
| `common.sourceId?` | `number` | Source Chain ID (ie. the L1 chain) |
| `common.testnet?` | `boolean` | Flag for test networks |
| `common.verifyHash?` | `ChainVerifyHashFn` | Chain-specific signature verification. |

## Returns

`Bloom`

## Throws
