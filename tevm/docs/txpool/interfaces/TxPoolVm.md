[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [txpool](../README.md) / TxPoolVm

# Interface: TxPoolVm

## Properties

| Property | Type |
| ------ | ------ |
| <a id="blockchain"></a> `blockchain` | `object` |
| `blockchain.getCanonicalHeadBlock` | `Promise`\<[`TxPoolBlock`](../type-aliases/TxPoolBlock.md)\> |
| <a id="statemanager"></a> `stateManager` | `object` |
| `stateManager.getAccount` | `Promise`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md) \| `undefined`\> |

## Methods

### deepCopy()

> **deepCopy**(): `Promise`\<`TxPoolVm`\>

#### Returns

`Promise`\<`TxPoolVm`\>
