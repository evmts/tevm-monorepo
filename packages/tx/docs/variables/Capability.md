[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / Capability

# Variable: Capability

> **Capability**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:8

Can be used in conjunction with Transaction\[TransactionType\].supports
to query on tx capabilities

## Type declaration

### EIP1559FeeMarket

> **EIP1559FeeMarket**: `number`

Tx supports EIP-1559 gas fee market mechanism
See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP

### EIP155ReplayProtection

> **EIP155ReplayProtection**: `number`

Tx supports EIP-155 replay protection
See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP

### EIP2718TypedTransaction

> **EIP2718TypedTransaction**: `number`

Tx is a typed transaction as defined in EIP-2718
See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP

### EIP2930AccessLists

> **EIP2930AccessLists**: `number`

Tx supports access list generation as defined in EIP-2930
See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP

### EIP7702EOACode

> **EIP7702EOACode**: `number`

Tx supports setting EOA code
See [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)
