[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createEOACodeEIP7702TxFromRLP

# Function: createEOACodeEIP7702TxFromRLP()

> **createEOACodeEIP7702TxFromRLP**(`serialized`, `opts?`): [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)

Instantiate a transaction from a RLP serialized tx.

Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `serialized` | `Uint8Array` |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) |

## Returns

[`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)
