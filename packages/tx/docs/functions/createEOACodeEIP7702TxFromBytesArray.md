[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createEOACodeEIP7702TxFromBytesArray

# Function: createEOACodeEIP7702TxFromBytesArray()

> **createEOACodeEIP7702TxFromBytesArray**(`values`, `opts?`): [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/7702/constructors.d.ts:21

Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

## Parameters

### values

`EOACode7702TxValuesArray`

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)
