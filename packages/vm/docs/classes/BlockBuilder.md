[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / BlockBuilder

# Class: BlockBuilder

Defined in: [packages/vm/src/actions/BlockBuilder.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L38)

## Constructors

### Constructor

> **new BlockBuilder**(`vm`, `opts`): `BlockBuilder`

Defined in: [packages/vm/src/actions/BlockBuilder.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L70)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `vm` | `BaseVm` |
| `opts` | [`BuildBlockOpts`](../interfaces/BuildBlockOpts.md) |

#### Returns

`BlockBuilder`

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="blobgasused"></a> `blobGasUsed` | `bigint` | `0n` | The cumulative blob gas used by the blobs in a block | [packages/vm/src/actions/BlockBuilder.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L46) |
| <a id="gasused"></a> `gasUsed` | `bigint` | `0n` | The cumulative gas used by the transactions added to the block. | [packages/vm/src/actions/BlockBuilder.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L42) |

## Accessors

### minerValue

#### Get Signature

> **get** **minerValue**(): `bigint`

Defined in: [packages/vm/src/actions/BlockBuilder.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L66)

##### Returns

`bigint`

***

### transactionReceipts

#### Get Signature

> **get** **transactionReceipts**(): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [packages/vm/src/actions/BlockBuilder.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L62)

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

## Methods

### addTransaction()

> **addTransaction**(`tx`, `__namedParameters?`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:213](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L213)

Run and add a transaction to the block being built.
Please note that this modifies the state of the VM.
Throws if the transaction's gasLimit is greater than
the remaining gas in the block.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `TypedTransaction` \| `ImpersonatedTx` |
| `__namedParameters` | `Pick`\<[`RunTxOpts`](../interfaces/RunTxOpts.md), `"skipBalance"` \| `"skipNonce"` \| `"skipHardForkValidation"`\> |

#### Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

***

### build()

> **build**(`sealOpts?`): `Promise`\<`Block`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L315)

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

`Promise`\<`Block`\>

***

### getStatus()

> **getStatus**(): [`BlockStatus`](../type-aliases/BlockStatus.md)

Defined in: [packages/vm/src/actions/BlockBuilder.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L130)

#### Returns

[`BlockStatus`](../type-aliases/BlockStatus.md)

***

### initState()

> **initState**(): `Promise`\<`void`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:381](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L381)

#### Returns

`Promise`\<`void`\>

***

### logsBloom()

> **logsBloom**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L147)

Calculates and returns the logs bloom for the block.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### receiptTrie()

> **receiptTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L159)

Calculates and returns the receiptTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:296](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L296)

Reverts the checkpoint on the StateManager to reset the state from any transactions that have been run.

#### Returns

`Promise`\<`void`\>

***

### transactionsTrie()

> **transactionsTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/actions/BlockBuilder.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/BlockBuilder.ts#L137)

Calculates and returns the transactionsTrie for the block.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
