---
editUrl: false
next: false
prev: false
title: "VMOpts"
---

Options for instantiating a VM.

## Properties

### activatePrecompiles?

> `optional` **activatePrecompiles**: `boolean`

If true, create entries in the state tree for the precompiled contracts, saving some gas the
first time each of them is called.

If this parameter is false, each call to each of them has to pay an extra 25000 gas
for creating the account. If the account is still empty after this call, it will be deleted,
such that this extra cost has to be paid again.

Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
the very first call, which is intended for testing networks.

Default: `false`

#### Defined in

[packages/vm/src/utils/VMOpts.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L55)

***

### blockchain?

> `optional` **blockchain**: [`Chain`](/reference/tevm/blockchain/type-aliases/chain/)

A Blockchain object for storing/retrieving blocks

#### Defined in

[packages/vm/src/utils/VMOpts.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L41)

***

### common?

> `optional` **common**: `object`

Use a [Common](../../../../../../../../reference/tevm/common/type-aliases/common) instance
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

#### blockExplorers.default

> **blockExplorers.default**: `ChainBlockExplorer`

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

#### contracts.ensRegistry?

> `optional` **contracts.ensRegistry**: `ChainContract`

#### contracts.ensUniversalResolver?

> `optional` **contracts.ensUniversalResolver**: `ChainContract`

#### contracts.multicall3?

> `optional` **contracts.multicall3**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; \} \| undefined; ... 11...

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; \} \| undefined; ... 11...

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

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

#### rpcUrls.default

> **rpcUrls.default**: `ChainRpcUrls`

#### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

#### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

#### Defined in

[packages/vm/src/utils/VMOpts.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L33)

***

### evm?

> `optional` **evm**: `Evm`

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

#### Defined in

[packages/vm/src/utils/VMOpts.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L76)

***

### genesisState?

> `optional` **genesisState**: [`GenesisState`](/reference/tevm/utils/interfaces/genesisstate/)

A genesisState to generate canonical genesis for the "in-house" created stateManager if external
stateManager not provided for the VM, defaults to an empty state

#### Defined in

[packages/vm/src/utils/VMOpts.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L60)

***

### profilerOpts?

> `optional` **profilerOpts**: [`VMProfilerOpts`](/reference/tevm/vm/type-aliases/vmprofileropts/)

#### Defined in

[packages/vm/src/utils/VMOpts.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L78)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](/reference/tevm/utils/type-aliases/bigintlike/)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../../../../../../../reference/tevm/common/type-aliases/common) instance)

#### Defined in

[packages/vm/src/utils/VMOpts.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L71)

***

### stateManager?

> `optional` **stateManager**: `StateManager`

A StateManager instance to use as the state store

#### Defined in

[packages/vm/src/utils/VMOpts.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMOpts.ts#L37)
