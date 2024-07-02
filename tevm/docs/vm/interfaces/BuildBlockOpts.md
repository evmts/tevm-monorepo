[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / BuildBlockOpts

# Interface: BuildBlockOpts

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](BuilderOpts.md)

The block and builder options to use.

#### Defined in

packages/vm/types/utils/BuildBlockOpts.d.ts:21

***

### headerData?

> `optional` **headerData**: [`HeaderData`](../../block/interfaces/HeaderData.md)

The block header data to use.
Defaults used for any values not provided.

#### Defined in

packages/vm/types/utils/BuildBlockOpts.d.ts:16

***

### parentBlock

> **parentBlock**: [`Block`](../../block/classes/Block.md)

The parent block

#### Defined in

packages/vm/types/utils/BuildBlockOpts.d.ts:11

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[]

#### Defined in

packages/vm/types/utils/BuildBlockOpts.d.ts:17
