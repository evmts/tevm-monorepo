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

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:13](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L13)

***

### blockGasUsed?

> `optional` **blockGasUsed**: `bigint`

To obtain an accurate tx receipt input the block gas used up until this tx.

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:61](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L61)

***

### reportAccessList?

> `optional` **reportAccessList**: `boolean`

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom StateManager implementation
StateManager.generateAccessList must be implemented.

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:50](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L50)

***

### reportPreimages?

> `optional` **reportPreimages**: `boolean`

If true, adds a hashedKey -> preimages mapping of all touched accounts
to the `RunTxResult` returned.

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:56](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L56)

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Skip balance checks if true. Adds transaction cost to balance to ensure execution doesn't fail.

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:26](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L26)

***

### skipBlockGasLimitValidation?

> `optional` **skipBlockGasLimitValidation**: `boolean`

If true, skips the validation of the tx's gas limit
against the block's gas limit.

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:32](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L32)

***

### skipHardForkValidation?

> `optional` **skipHardForkValidation**: `boolean`

If true, skips the hardfork validation of vm, block
and tx

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:38](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L38)

***

### skipNonce?

> `optional` **skipNonce**: `boolean`

If true, skips the nonce check

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:21](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L21)

***

### tx

> **tx**: `TypedTransaction`

An `@ethereumjs/tx` to run

#### Defined in

[packages/vm/src/utils/RunTxOpts.ts:17](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxOpts.ts#L17)
