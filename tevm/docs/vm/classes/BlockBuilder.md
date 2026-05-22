[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BlockBuilder

# Class: BlockBuilder

## Constructors

### Constructor

> **new BlockBuilder**(`vm`, `opts`): `BlockBuilder`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `vm` | `BaseVm` |
| `opts` | [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md) |

#### Returns

`BlockBuilder`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blobgasused"></a> `blobGasUsed` | `bigint` | The cumulative blob gas used by the blobs in a block |
| <a id="gasused"></a> `gasUsed` | `bigint` | The cumulative gas used by the transactions added to the block. |

## Accessors

### minerValue

#### Get Signature

> **get** **minerValue**(): `bigint`

##### Returns

`bigint`

***

### transactionReceipts

#### Get Signature

> **get** **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters?`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md) |
| `__namedParameters?` | `Pick`\<[`RunTxOpts`](../interfaces/RunTxOpts.md), `"skipBalance"` \| `"skipNonce"` \| `"skipHardForkValidation"`\> |

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

***

### build()

> **build**(`sealOpts?`): `Promise`\<[`Block`](../../block/classes/Block.md)\>

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

| Parameter | Type |
| ------ | ------ |
| `sealOpts?` | [`SealBlockOpts`](../interfaces/SealBlockOpts.md) |

#### Returns

`Promise`\<[`Block`](../../block/classes/Block.md)\>

***

### getStatus()

> **getStatus**(): [`BlockStatus`](../type-aliases/BlockStatus.md)

#### Returns

[`BlockStatus`](../type-aliases/BlockStatus.md)

***

### initState()

> **initState**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

***

### logsBloom()

> **logsBloom**(): `Uint8Array`\<`ArrayBufferLike`\>

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
