[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMOpts

# Interface: VMOpts

Defined in: packages/vm/types/utils/VMOpts.d.ts:10

Options for instantiating a VM.

## Properties

### activatePrecompiles?

> `optional` **activatePrecompiles**: `boolean`

Defined in: packages/vm/types/utils/VMOpts.d.ts:54

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, each call to each of them has to pay an extra 25000 gas
for creating the account. If the account is still empty after this call, it will be deleted,
such that this extra cost has to be paid again.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
the very first call, which is intended for testing networks.

Default: `false`

***

### blockchain?

> `optional` **blockchain**: [`Chain`](../../blockchain/type-aliases/Chain.md)

Defined in: packages/vm/types/utils/VMOpts.d.ts:40

A Blockchain object for storing/retrieving blocks

***

### common?

> `optional` **common**: `object`

Defined in: packages/vm/types/utils/VMOpts.d.ts:32

Use a [Common](../../common/type-aliases/Common.md) instance
if you want to change the chain setup.

### Possible Values

- `chain`: all chains supported by `Common` or a custom chain
- `hardfork`: `mainnet` hardforks up to the `Paris` hardfork
- `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)

Note: check the associated `@ethereumjs/evm` instance options
documentation for supported EIPs.

### Default Setup

Default setup if no `Common` instance is provided:

- `chain`: `mainnet`
- `hardfork`: `paris`
- `eips`: `[]`

#### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

##### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

##### blockExplorers.default

> **default**: `ChainBlockExplorer`

#### blockTime?

> `optional` **blockTime**: `number`

Block time in milliseconds.

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

##### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{\[`sourceId`: `number`\]: `undefined` \| `ChainContract`; \}

##### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

##### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

##### contracts.erc6492Verifier?

> `optional` **erc6492Verifier**: `ChainContract`

##### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 13 more ...; copy: () =\> ...; \}

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 13 more ...; copy: () =\> ...; \}

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

> **ethjsCommon**: `Common`

#### experimental\_preconfirmationTime?

> `optional` **experimental\_preconfirmationTime**: `number`

Preconfirmation time in milliseconds.

#### fees?

> `optional` **fees**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

#### formatters?

> `optional` **formatters**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

#### id

> **id**: `number`

ID in number form

#### name

> **name**: `string`

Human-readable name

#### nativeCurrency

> **nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

#### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

##### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

##### rpcUrls.default

> **default**: `ChainRpcUrls`

#### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

#### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

***

### evm?

> `optional` **evm**: [`Evm`](../../evm/classes/Evm.md)

Defined in: packages/vm/types/utils/VMOpts.d.ts:73

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

***

### genesisState?

> `optional` **genesisState**: [`GenesisState`](../../utils/type-aliases/GenesisState.md)

Defined in: packages/vm/types/utils/VMOpts.d.ts:59

A genesisState to generate canonical genesis for the "in-house" created stateManager if external
stateManager not provided for the VM, defaults to an empty state

***

### profilerOpts?

> `optional` **profilerOpts**: [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md)

Defined in: packages/vm/types/utils/VMOpts.d.ts:74

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Defined in: packages/vm/types/utils/VMOpts.d.ts:69

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance)

***

### stateManager?

> `optional` **stateManager**: [`StateManager`](../../state/interfaces/StateManager.md)

Defined in: packages/vm/types/utils/VMOpts.d.ts:36

A [StateManager](../../state/interfaces/StateManager.md) instance to use as the state store
