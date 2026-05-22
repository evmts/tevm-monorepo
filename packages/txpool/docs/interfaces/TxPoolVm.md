[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / TxPoolVm

# Interface: TxPoolVm

Defined in: zevm/npm/zevm/dist/txpool.d.ts:14

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="blockchain"></a> `blockchain` | `object` | zevm/npm/zevm/dist/txpool.d.ts:15 |
| `blockchain.getCanonicalHeadBlock` | `Promise`\<[`TxPoolBlock`](../type-aliases/TxPoolBlock.md)\> | zevm/npm/zevm/dist/txpool.d.ts:16 |
| <a id="statemanager"></a> `stateManager` | `object` | zevm/npm/zevm/dist/txpool.d.ts:18 |
| `stateManager.getAccount` | `Promise`\<`Account` \| `undefined`\> | zevm/npm/zevm/dist/txpool.d.ts:19 |

## Methods

### deepCopy()

> **deepCopy**(): `Promise`\<`TxPoolVm`\>

Defined in: zevm/npm/zevm/dist/txpool.d.ts:21

#### Returns

`Promise`\<`TxPoolVm`\>
