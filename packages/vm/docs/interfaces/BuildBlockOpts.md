[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

The block and builder options to use.

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L24)

***

### headerData?

> `optional` **headerData**: `HeaderData`

The block header data to use.
Defaults used for any values not provided.

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L18)

***

### parentBlock

> **parentBlock**: `Block`

The parent block

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L12)

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L20)
