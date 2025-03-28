[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / StateOverride

# Type Alias: StateOverride

> **StateOverride**: `object`

Defined in: packages/actions/types/eth/ethSimulateV1HandlerType.d.ts:43

## Type declaration

### address

> **address**: `` `0x${string}` ``

- The address to override

### balance?

> `optional` **balance**: `bigint`

- The new balance in wei

### code?

> `optional` **code**: `` `0x${string}` ``

- The new contract code

### nonce?

> `optional` **nonce**: `number`

- The new nonce

### storage?

> `optional` **storage**: `Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>

- Storage key-value pairs to override
