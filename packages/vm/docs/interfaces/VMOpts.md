[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / VMOpts

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

#### Source

[packages/vm/src/utils/types.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L135)

***

### blockchain?

> `optional` **blockchain**: `Chain`

A Blockchain object for storing/retrieving blocks

#### Source

[packages/vm/src/utils/types.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L121)

***

### common?

> `optional` **common**: `Common`

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

#### Source

[packages/vm/src/utils/types.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L113)

***

### evm?

> `optional` **evm**: `Evm`

Use a custom EVM to run Messages on. If this is not present, use the default EVM.

#### Source

[packages/vm/src/utils/types.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L156)

***

### genesisState?

> `optional` **genesisState**: `GenesisState`

A genesisState to generate canonical genesis for the "in-house" created stateManager if external
stateManager not provided for the VM, defaults to an empty state

#### Source

[packages/vm/src/utils/types.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L140)

***

### profilerOpts?

> `optional` **profilerOpts**: [`VMProfilerOpts`](../type-aliases/VMProfilerOpts.md)

#### Source

[packages/vm/src/utils/types.ts:158](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L158)

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Source

[packages/vm/src/utils/types.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L151)

***

### stateManager?

> `optional` **stateManager**: `StateManager`

A StateManager instance to use as the state store

#### Source

[packages/vm/src/utils/types.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L117)
