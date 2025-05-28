[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / BlockBuilder

# Class: BlockBuilder

Defined in: [packages/vm/src/actions/BlockBuilder.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L43)

## Constructors

### Constructor

> **new BlockBuilder**(`vm`, `opts`): `BlockBuilder`

Defined in: [packages/vm/src/actions/BlockBuilder.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L75)

#### Parameters

##### vm

`BaseVm`

##### opts

[`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

#### Returns

`BlockBuilder`

## Properties

### blobGasUsed

> **blobGasUsed**: `bigint` = `0n`

Defined in: [packages/vm/src/actions/BlockBuilder.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L51)

The cumulative blob gas used by the blobs in a block

***

### gasUsed

> **gasUsed**: `bigint` = `0n`

Defined in: [packages/vm/src/actions/BlockBuilder.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L47)

The cumulative gas used by the transactions added to the block.

## Accessors

### minerValue

#### Get Signature

> **get** **minerValue**(): `bigint`

Defined in: [packages/vm/src/actions/BlockBuilder.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L71)

##### Returns

`bigint`

***

### transactionReceipts

#### Get Signature

> **get** **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [packages/vm/src/actions/BlockBuilder.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L67)

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L220)

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

##### tx

`TypedTransaction` | `ImpersonatedTx`

##### \_\_namedParameters

###### skipHardForkValidation?

`boolean`

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

***

### build()

> **build**(`sealOpts?`): `Promise`\<`Block`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:316](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L316)

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

##### sealOpts?

[`SealBlockOpts`](../interfaces/SealBlockOpts.md)

#### Returns

`Promise`\<`Block`\>

***

### getStatus()

> **getStatus**(): [`BlockStatus`](../type-aliases/BlockStatus.md)

Defined in: [packages/vm/src/actions/BlockBuilder.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L132)

#### Returns

[`BlockStatus`](../type-aliases/BlockStatus.md)

***

### initState()

> **initState**(): `Promise`\<`void`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:380](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L380)

#### Returns

`Promise`\<`void`\>

***

### logsBloom()

> **logsBloom**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L149)

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L161)

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:297](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L297)

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L139)

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
