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

[packages/vm/src/utils/types.ts:196](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L196)

***

### headerData?

> `optional` **headerData**: [`HeaderData`](/reference/tevm/block/interfaces/headerdata/)

The block header data to use.
Defaults used for any values not provided.

#### Defined in

[packages/vm/src/utils/types.ts:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L190)

***

### parentBlock

> **parentBlock**: [`Block`](/reference/tevm/block/classes/block/)

The parent block

#### Defined in

[packages/vm/src/utils/types.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L184)

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](/reference/tevm/utils/type-aliases/withdrawaldata/)[]

#### Defined in

[packages/vm/src/utils/types.ts:192](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L192)
