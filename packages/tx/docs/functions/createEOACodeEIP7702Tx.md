[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createEOACodeEIP7702Tx

# Function: createEOACodeEIP7702Tx()

> **createEOACodeEIP7702Tx**(`txData`, `opts?`): [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/7702/constructors.d.ts:14

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

## Parameters

### txData

[`EOACodeEIP7702TxData`](../interfaces/EOACodeEIP7702TxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)
