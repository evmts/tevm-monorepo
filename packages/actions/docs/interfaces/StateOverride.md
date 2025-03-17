[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / StateOverride

# Interface: StateOverride

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L20)

## Properties

### address

> **address**: `` `0x${string}` ``

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L21)

The address to override

***

### balance?

> `optional` **balance**: `bigint`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L22)

The new balance in wei

***

### code?

> `optional` **code**: `` `0x${string}` ``

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L24)

The new contract code

***

### nonce?

> `optional` **nonce**: `number`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L23)

The new nonce

***

### storage?

> `optional` **storage**: `Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L25)

Storage key-value pairs to override
