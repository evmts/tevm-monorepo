[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / RunTxOpts

# Interface: RunTxOpts

Options for the `runTx` method.

## Properties

### block?

> `optional` **block**: `Block`

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.

#### Source

[packages/vm/src/utils/types.ts:354](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L354)

***

### blockGasUsed?

> `optional` **blockGasUsed**: `bigint`

To obtain an accurate tx receipt input the block gas used up until this tx.

#### Source

[packages/vm/src/utils/types.ts:402](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L402)

***

### reportAccessList?

> `optional` **reportAccessList**: `boolean`

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom StateManager implementation
StateManager.generateAccessList must be implemented.

#### Source

[packages/vm/src/utils/types.ts:391](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L391)

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Source

[packages/vm/src/utils/types.ts:397](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L397)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

#### Source

[packages/vm/src/utils/types.ts:367](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L367)

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation**: `boolean`

If true, skips the validation of the tx's gas limit
against the block's gas limit.

#### Source

[packages/vm/src/utils/types.ts:373](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L373)

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Source

[packages/vm/src/utils/types.ts:379](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L379)

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Source

[packages/vm/src/utils/types.ts:362](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L362)

***

### tx

> **tx**: `TypedTransaction`

An `@ethereumjs/tx` to run

#### Source

[packages/vm/src/utils/types.ts:358](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L358)
