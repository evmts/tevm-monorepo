[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / BlockBuilder

# Class: BlockBuilder

## Constructors

### new BlockBuilder()

> **new BlockBuilder**(`vm`, `opts`): [`BlockBuilder`](BlockBuilder.md)

#### Parameters

• **vm**: `BaseVm`

• **opts**: [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

#### Returns

[`BlockBuilder`](BlockBuilder.md)

#### Source

[packages/vm/src/actions/BlockBuilder.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L78)

## Properties

### \_minerValue

> `private` **\_minerValue**: `bigint`

Value of the block, represented by the final transaction fees
acruing to the miner.

#### Source

[packages/vm/src/actions/BlockBuilder.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L59)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

The cumulative blob gas used by the blobs in a block

#### Source

[packages/vm/src/actions/BlockBuilder.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L54)

***

### blockOpts

> `private` **blockOpts**: [`BuilderOpts`](../interfaces/BuilderOpts.md)

#### Source

[packages/vm/src/actions/BlockBuilder.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L62)

***

### blockStatus

> `private` **blockStatus**: [`BlockStatus`](../type-aliases/BlockStatus.md)

#### Source

[packages/vm/src/actions/BlockBuilder.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L68)

***

### checkpointed

> `private` **checkpointed**: `boolean` = `false`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L67)

***

### gasUsed

> **gasUsed**: `bigint`

The cumulative gas used by the transactions added to the block.

#### Source

[packages/vm/src/actions/BlockBuilder.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L50)

***

### headerData

> `private` **headerData**: `HeaderData`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L63)

***

### transactionResults

> `private` **transactionResults**: [`RunTxResult`](../interfaces/RunTxResult.md)[] = `[]`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L65)

***

### transactions

> `private` **transactions**: (`TypedTransaction` \| `ImpersonatedTx`)[] = `[]`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L64)

***

### vm

> `private` `readonly` **vm**: `BaseVm`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L61)

***

### withdrawals?

> `private` `optional` **withdrawals**: `Withdrawal`[]

#### Source

[packages/vm/src/actions/BlockBuilder.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L66)

## Accessors

### minerValue

> `get` **minerValue**(): `bigint`

#### Returns

`bigint`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L74)

***

### transactionReceipts

> `get` **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

#### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

#### Source

[packages/vm/src/actions/BlockBuilder.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L70)

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

• **tx**: `TypedTransaction` \| `ImpersonatedTx`

• **\_\_namedParameters**= `{}`

• **\_\_namedParameters.skipHardForkValidation?**: `boolean`

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:218](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L218)

***

### build()

> **build**(`sealOpts`?): `Promise`\<`Block`\>

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

• **sealOpts?**: [`SealBlockOpts`](../interfaces/SealBlockOpts.md)

#### Returns

`Promise`\<`Block`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:309](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L309)

***

### checkStatus()

> `private` **checkStatus**(): `void`

Throws if the block has already been built or reverted.

#### Returns

`void`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L121)

***

### getStatus()

> **getStatus**(): [`BlockStatus`](../type-aliases/BlockStatus.md)

#### Returns

[`BlockStatus`](../type-aliases/BlockStatus.md)

#### Source

[packages/vm/src/actions/BlockBuilder.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L130)

***

### initState()

> **initState**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:373](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L373)

***

### logsBloom()

> **logsBloom**(): `Uint8Array`

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`

#### Source

[packages/vm/src/actions/BlockBuilder.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L147)

***

### processWithdrawals()

> `private` **processWithdrawals**(): `Promise`\<`void`\>

Adds the withdrawal amount to the withdrawal address

#### Returns

`Promise`\<`void`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:198](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L198)

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L159)

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:290](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L290)

***

### rewardMiner()

> `private` **rewardMiner**(): `Promise`\<`void`\>

Adds the block miner reward to the coinbase account.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L179)

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\>

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[packages/vm/src/actions/BlockBuilder.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L137)
