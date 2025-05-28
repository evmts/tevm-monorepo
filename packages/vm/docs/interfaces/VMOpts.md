[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / VMOpts

# Interface: VMOpts

Defined in: [packages/vm/src/utils/VMOpts.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L11)

Options for instantiating a VM.

## Properties

### activatePrecompiles?

> `optional` **activatePrecompiles**: `boolean`

Defined in: [packages/vm/src/utils/VMOpts.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L55)

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

> `optional` **blockchain**: `Chain`

Defined in: [packages/vm/src/utils/VMOpts.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L41)

A Blockchain object for storing/retrieving blocks

***

### common?

> `optional` **common**: `object`

Defined in: [packages/vm/src/utils/VMOpts.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L33)

Use a Common instance
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

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

##### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

##### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

##### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

##### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

##### contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

> **ethjsCommon**: `Common`

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

> `optional` **evm**: `Evm`

Defined in: [packages/vm/src/utils/VMOpts.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L76)

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

***

### genesisState?

> `optional` **genesisState**: `GenesisState`

Defined in: [packages/vm/src/utils/VMOpts.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L60)

A genesisState to generate canonical genesis for the "in-house" created stateManager if external
stateManager not provided for the VM, defaults to an empty state

***

### profilerOpts?

> `optional` **profilerOpts**: [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md)

Defined in: [packages/vm/src/utils/VMOpts.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L78)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Defined in: [packages/vm/src/utils/VMOpts.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L71)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### stateManager?

> `optional` **stateManager**: `StateManager`

Defined in: [packages/vm/src/utils/VMOpts.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L37)

A StateManager instance to use as the state store
