[@tevm/tx](../README.md) / [Exports](../modules.md) / Capability

# Enumeration: Capability

Can be used in conjunction with Transaction[TransactionType].supports
to query on tx capabilities

## Table of contents

### Enumeration Members

- [EIP1559FeeMarket](Capability.md#eip1559feemarket)
- [EIP155ReplayProtection](Capability.md#eip155replayprotection)
- [EIP2718TypedTransaction](Capability.md#eip2718typedtransaction)
- [EIP2930AccessLists](Capability.md#eip2930accesslists)

## Enumeration Members

### EIP1559FeeMarket

• **EIP1559FeeMarket** = ``1559``

Tx supports EIP-1559 gas fee market mechanism
See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:22

___

### EIP155ReplayProtection

• **EIP155ReplayProtection** = ``155``

Tx supports EIP-155 replay protection
See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:17

___

### EIP2718TypedTransaction

• **EIP2718TypedTransaction** = ``2718``

Tx is a typed transaction as defined in EIP-2718
See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:27

___

### EIP2930AccessLists

• **EIP2930AccessLists** = ``2930``

Tx supports access list generation as defined in EIP-2930
See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:32
