[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / VMOpts

# Interface: VMOpts

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

packages/vm/types/utils/types.d.ts:124

***

### blockchain?

> `optional` **blockchain**: [`Chain`](../../blockchain/type-aliases/Chain.md)

A Blockchain object for storing/retrieving blocks

#### Defined in

packages/vm/types/utils/types.d.ts:110

***

### common?

> `optional` **common**: [`Common`](../../common/type-aliases/Common.md)

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

#### Defined in

packages/vm/types/utils/types.d.ts:102

***

### evm?

> `optional` **evm**: [`Evm`](../../evm/classes/Evm.md)

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

#### Defined in

packages/vm/types/utils/types.d.ts:143

***

### genesisState?

> `optional` **genesisState**: [`GenesisState`](../../utils/interfaces/GenesisState.md)

A genesisState to generate canonical genesis for the "in-house" created stateManager if external
stateManager not provided for the VM, defaults to an empty state

#### Defined in

packages/vm/types/utils/types.d.ts:129

***

### profilerOpts?

> `optional` **profilerOpts**: [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md)

#### Defined in

packages/vm/types/utils/types.d.ts:144

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| [`BigIntLike`](../../utils/type-aliases/BigIntLike.md)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the [Common](../../common/type-aliases/Common.md) instance)

#### Defined in

packages/vm/types/utils/types.d.ts:139

***

### stateManager?

> `optional` **stateManager**: [`StateManager`](../../state/interfaces/StateManager.md)

A [StateManager](../../state/interfaces/StateManager.md) instance to use as the state store

#### Defined in

packages/vm/types/utils/types.d.ts:106
