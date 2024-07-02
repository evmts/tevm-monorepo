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

[packages/vm/src/actions/BlockBuilder.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L78)

## Properties

### blobGasUsed

> **blobGasUsed**: `bigint`

The cumulative blob gas used by the blobs in a block

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L54)

***

### gasUsed

> **gasUsed**: `bigint`

The cumulative gas used by the transactions added to the block.

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L50)

## Accessors

### minerValue

> `get` **minerValue**(): `bigint`

#### Returns

`bigint`

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L74)

***

### transactionReceipts

> `get` **transactionReceipts**(): [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

#### Returns

[`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L70)

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

[packages/vm/src/actions/BlockBuilder.ts:218](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L218)

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

[packages/vm/src/actions/BlockBuilder.ts:309](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L309)

***

### getStatus()

> **getStatus**(): [`BlockStatus`](/reference/tevm/vm/type-aliases/blockstatus/)

#### Returns

[`BlockStatus`](/reference/tevm/vm/type-aliases/blockstatus/)

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L130)

***

### initState()

> **initState**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:373](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L373)

***

### logsBloom()

> **logsBloom**(): `Uint8Array`

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L147)

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L159)

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:290](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L290)

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/vm/src/actions/BlockBuilder.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L137)
