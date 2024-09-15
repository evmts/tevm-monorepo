---
editUrl: false
next: false
prev: false
title: "BlockBuilder"
---

## Constructors

### new BlockBuilder()

> **new BlockBuilder**(`vm`, `opts`): [`BlockBuilder`](/reference/tevm/vm/classes/blockbuilder/)

#### Parameters

• **vm**: `BaseVm`

• **opts**: [`BuildBlockOpts`](/reference/tevm/vm/interfaces/buildblockopts/)

#### Returns

[`BlockBuilder`](/reference/tevm/vm/classes/blockbuilder/)

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:76](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L76)

## Properties

### blobGasUsed

> **blobGasUsed**: `bigint`

The cumulative blob gas used by the blobs in a block

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:52](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L52)

***

### gasUsed

> **gasUsed**: `bigint`

The cumulative gas used by the transactions added to the block.

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:48](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L48)

## Accessors

### minerValue

> `get` **minerValue**(): `bigint`

#### Returns

`bigint`

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:72](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L72)

***

### transactionReceipts

> `get` **transactionReceipts**(): [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

#### Returns

[`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:68](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L68)

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters`): `Promise`\<[`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)\>

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

• **tx**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/) \| [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/)

• **\_\_namedParameters** = `{}`

• **\_\_namedParameters.skipHardForkValidation?**: `boolean`

#### Returns

`Promise`\<[`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:216](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L216)

***

### build()

> **build**(`sealOpts`?): `Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

This method returns the finalized block.
It also:
 - Assigns the reward for miner (PoW)
 - Commits the checkpoint on the StateManager
 - Sets the tip of the VM's blockchain to this block
For PoW, optionally seals the block with params `nonce` and `mixHash`,
which is validated along with the block number and difficulty by ethash.
For PoA, please pass `blockOption.cliqueSigner` into the buildBlock constructor,
as the signer will be awarded the txs amount spent on gas as they are added.

#### Parameters

• **sealOpts?**: [`SealBlockOpts`](/reference/tevm/vm/interfaces/sealblockopts/)

#### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:307](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L307)

***

### getStatus()

> **getStatus**(): [`BlockStatus`](/reference/tevm/vm/type-aliases/blockstatus/)

#### Returns

[`BlockStatus`](/reference/tevm/vm/type-aliases/blockstatus/)

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:128](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L128)

***

### initState()

> **initState**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:371](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L371)

***

### logsBloom()

> **logsBloom**(): `Uint8Array`

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:145](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L145)

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:157](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L157)

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:288](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L288)

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:135](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L135)
