[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / VMOpts

# Interface: VMOpts

Defined in: [packages/vm/src/utils/VMOpts.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L11)

Options for instantiating a VM.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="activateprecompiles"></a> `activatePrecompiles?` | `boolean` | If true, create entries in the state tree for the precompiled contracts, saving some gas the first time each of them is called. If this parameter is false, each call to each of them has to pay an extra 25000 gas for creating the account. If the account is still empty after this call, it will be deleted, such that this extra cost has to be paid again. Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from the very first call, which is intended for testing networks. Default: `false` | [packages/vm/src/utils/VMOpts.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L55) |
| <a id="blockchain"></a> `blockchain?` | `Chain` | A Blockchain object for storing/retrieving blocks | [packages/vm/src/utils/VMOpts.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L41) |
| <a id="common"></a> `common?` | `object` | Use a Common instance if you want to change the chain setup. ### Possible Values - `chain`: all chains supported by `Common` or a custom chain - `hardfork`: `mainnet` hardforks from `chainstart` (Frontier) through `osaka` - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`) Note: check the associated EVM instance options documentation for supported EIPs. ### Default Setup Default setup if no `Common` instance is provided: - `chain`: `mainnet` - `hardfork`: `prague` - `eips`: `[]` | [packages/vm/src/utils/VMOpts.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L33) |
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
| <a id="evm"></a> `evm?` | `Evm` | Use a custom EVM to run Messages on. If this is not present, use the default EVM. | [packages/vm/src/utils/VMOpts.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L76) |
| <a id="genesisstate"></a> `genesisState?` | `GenesisState` | A genesisState to generate canonical genesis for the "in-house" created stateManager if external stateManager not provided for the VM, defaults to an empty state | [packages/vm/src/utils/VMOpts.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L60) |
| <a id="profileropts"></a> `profilerOpts?` | [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md) | - | [packages/vm/src/utils/VMOpts.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L78) |
| <a id="sethardfork"></a> `setHardfork?` | `boolean` \| `BigIntLike` | Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number for older Hfs. Additionally it is possible to pass in a specific TD value to support live-Merge-HF transitions. Note that this should only be needed in very rare and specific scenarios. Default: `false` (HF is set to whatever default HF is set by the Common instance) | [packages/vm/src/utils/VMOpts.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L71) |
| <a id="statemanager"></a> `stateManager?` | `StateManager` | A StateManager instance to use as the state store | [packages/vm/src/utils/VMOpts.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L37) |
