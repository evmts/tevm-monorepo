---
editUrl: false
next: false
prev: false
title: "BuildBlockOpts"
---

Options for building a block.

## Properties

### blockOpts?

> `optional` **blockOpts**: [`BuilderOpts`](/reference/tevm/vm/interfaces/builderopts/)

The block and builder options to use.

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:24](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L24)

***

### headerData?

> `optional` **headerData**: [`HeaderData`](/reference/tevm/block/interfaces/headerdata/)

The block header data to use.
Defaults used for any values not provided.

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:18](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L18)

***

### parentBlock

> **parentBlock**: [`Block`](/reference/tevm/block/classes/block/)

The parent block

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:12](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L12)

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](/reference/tevm/utils/type-aliases/withdrawaldata/)[]

#### Defined in

[packages/vm/src/utils/BuildBlockOpts.ts:20](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BuildBlockOpts.ts#L20)
