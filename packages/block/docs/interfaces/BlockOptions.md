[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockOptions

# Interface: BlockOptions

Defined in: [packages/block/src/types.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L12)

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="calcdifficultyfromheader"></a> `calcDifficultyFromHeader?` | [`BlockHeader`](../classes/BlockHeader.md) | If a preceding [BlockHeader](../classes/BlockHeader.md) (usually the parent header) is given the preceding header will be used to calculate the difficulty for this block and the calculated difficulty takes precedence over a provided static `difficulty` value. Note that this option has no effect on networks other than PoW/Ethash networks (respectively also deactivates on the Merge HF switching to PoS/Casper). | [packages/block/src/types.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L43) |
| <a id="cliquesigner"></a> `cliqueSigner?` | `Uint8Array`\<`ArrayBufferLike`\> | Provide a clique signer's privateKey to seal this block. Will throw if provided on a non-PoA chain. | [packages/block/src/types.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L60) |
| <a id="common"></a> `common` | `object` | A Common object defining the chain and the hardfork a block/block header belongs to. Object will be internally copied so that tx behavior don't incidentally change on future HF changes. Default: Common object set to `mainnet` and the HF currently defined as the default hardfork in the Common class. Current default hardfork: `merge` | [packages/block/src/types.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L24) |
| `common.blockExplorers?` | `object` | Collection of block explorers | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:15 |
| `common.blockExplorers.default` | `ChainBlockExplorer` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:17 |
| `common.blockTime?` | `number` | Block time in milliseconds. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:20 |
| `common.contracts?` | `object` | Collection of contracts | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:22 |
| `common.contracts.ensRegistry?` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:27 |
| `common.contracts.ensUniversalResolver?` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:28 |
| `common.contracts.erc6492Verifier?` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:30 |
| `common.contracts.multicall3?` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:29 |
| `common.copy` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | - | packages/common/types/Common.d.ts:28 |
| `common.custom?` | `Record`\<`string`, `unknown`\> | Custom chain data. **Deprecated** use `.extend` instead. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:59 |
| `common.ensTlds?` | readonly `string`[] | Collection of ENS TLDs for the chain. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:33 |
| `common.ethjsCommon` | `Common` | - | packages/common/types/Common.d.ts:27 |
| `common.experimental_preconfirmationTime?` | `number` | Preconfirmation time in milliseconds. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:41 |
| `common.extendSchema?` | `Record`\<`string`, `unknown`\> | Extend schema. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:61 |
| `common.fees?` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | Modifies how fees are derived. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:63 |
| `common.formatters?` | `ChainFormatters` | Modifies how data is formatted and typed (e.g. blocks and transactions) | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:65 |
| `common.id` | `number` | ID in number form | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:35 |
| `common.name` | `string` | Human-readable name | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:37 |
| `common.nativeCurrency` | `ChainNativeCurrency` | Currency used by chain | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:39 |
| `common.prepareTransactionRequest?` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | Function to prepare a transaction request. Runs before the transaction is filled. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:67 |
| `common.rpcUrls` | `object` | Collection of RPC endpoints | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:43 |
| `common.rpcUrls.default` | `ChainRpcUrls` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:45 |
| `common.serializers?` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:81 |
| `common.sourceId?` | `number` | Source Chain ID (ie. the L1 chain) | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:48 |
| `common.testnet?` | `boolean` | Flag for test networks | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:50 |
| `common.verifyHash?` | `ChainVerifyHashFn` | Chain-specific signature verification. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:83 |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) | - | [packages/block/src/types.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L66) |
| <a id="freeze"></a> `freeze?` | `boolean` | A block object by default gets frozen along initialization. This gives you strong additional security guarantees on the consistency of the block parameters. It also enables block hash caching when the `hash()` method is called multiple times. If you need to deactivate the block freeze - e.g. because you want to subclass block and add additional properties - it is strongly encouraged that you do the freeze yourself within your code instead. Default: true | [packages/block/src/types.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L55) |
| <a id="sethardfork"></a> `setHardfork?` | `boolean` \| `BigIntLike` | Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number for older Hfs. Additionally it is possible to pass in a specific TD value to support live-Merge-HF transitions. Note that this should only be needed in very rare and specific scenarios. Default: `false` (HF is set to whatever default HF is set by the Common instance) | [packages/block/src/types.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L34) |
| <a id="skipconsensusformatvalidation"></a> `skipConsensusFormatValidation?` | `boolean` | Skip consensus format validation checks on header if set. Defaults to false. | [packages/block/src/types.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L64) |
