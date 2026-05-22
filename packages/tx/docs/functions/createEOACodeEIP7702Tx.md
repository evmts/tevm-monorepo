[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createEOACodeEIP7702Tx

# Function: createEOACodeEIP7702Tx()

> **createEOACodeEIP7702Tx**(`txData`, `opts?`): [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

## Parameters

| Parameter | Type |
| ------ | ------ |
| `txData` | [`EOACodeEIP7702TxData`](../interfaces/EOACodeEIP7702TxData.md) |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) |

## Returns

[`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)
