[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMOpts

# Interface: VMOpts

Options for instantiating a VM.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="activateprecompiles"></a> `activatePrecompiles?` | `boolean` | If true, create entries in the state tree for the precompiled contracts, saving some gas the first time each of them is called. If this parameter is false, each call to each of them has to pay an extra 25000 gas for creating the account. If the account is still empty after this call, it will be deleted, such that this extra cost has to be paid again. Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from the very first call, which is intended for testing networks. Default: `false` |
| <a id="blockchain"></a> `blockchain?` | [`Chain`](../../blockchain/type-aliases/Chain.md) | A Blockchain object for storing/retrieving blocks |
| <a id="common"></a> `common?` | `object` | Use a [Common](../../common/type-aliases/Common.md) instance if you want to change the chain setup. ### Possible Values - `chain`: all chains supported by `Common` or a custom chain - `hardfork`: `mainnet` hardforks from `chainstart` (Frontier) through `osaka` - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`) Note: check the associated EVM instance options documentation for supported EIPs. ### Default Setup Default setup if no `Common` instance is provided: - `chain`: `mainnet` - `hardfork`: `prague` - `eips`: `[]` |
| `common.blockExplorers?` | `object` | Collection of block explorers |
| `common.blockExplorers.default` | `ChainBlockExplorer` | - |
| `common.blockTime?` | `number` | Block time in milliseconds. |
| `common.contracts?` | `object` | Collection of contracts |
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
| `common.rpcUrls` | `object` | Collection of RPC endpoints |
| `common.rpcUrls.default` | `ChainRpcUrls` | - |
| `common.serializers?` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). |
| `common.sourceId?` | `number` | Source Chain ID (ie. the L1 chain) |
| `common.testnet?` | `boolean` | Flag for test networks |
| `common.verifyHash?` | `ChainVerifyHashFn` | Chain-specific signature verification. |
| <a id="evm"></a> `evm?` | [`Evm`](../../evm/classes/Evm.md) | Use a custom EVM to run Messages on. If this is not present, use the default EVM. |
| <a id="genesisstate"></a> `genesisState?` | [`GenesisState`](../../utils/type-aliases/GenesisState.md) | A genesisState to generate canonical genesis for the "in-house" created stateManager if external stateManager not provided for the VM, defaults to an empty state |
| <a id="profileropts"></a> `profilerOpts?` | [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md) | - |
| <a id="sethardfork"></a> `setHardfork?` | `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md) | Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number for older Hfs. Additionally it is possible to pass in a specific TD value to support live-Merge-HF transitions. Note that this should only be needed in very rare and specific scenarios. Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance) |
| <a id="statemanager"></a> `stateManager?` | [`StateManager`](../../state/interfaces/StateManager.md) | A [StateManager](../../state/interfaces/StateManager.md) instance to use as the state store |
