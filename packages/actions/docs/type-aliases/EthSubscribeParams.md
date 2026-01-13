[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSubscribeParams

# Type Alias: EthSubscribeParams

> **EthSubscribeParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:363](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L363)

Based on the JSON-RPC request for `eth_subscribe` procedure

## Properties

### filterParams?

> `readonly` `optional` **filterParams**: `object`

Defined in: [packages/actions/src/eth/EthParams.ts:371](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L371)

Optional filter parameters for logs subscriptions

#### address?

> `readonly` `optional` **address**: [`Address`](Address.md) \| readonly [`Address`](Address.md)[]

#### topics?

> `readonly` `optional` **topics**: readonly ([`Hex`](Hex.md) \| readonly [`Hex`](Hex.md)[] \| `null`)[]

***

### subscriptionType

> `readonly` **subscriptionType**: `"newHeads"` \| `"logs"` \| `"newPendingTransactions"` \| `"syncing"`

Defined in: [packages/actions/src/eth/EthParams.ts:367](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L367)

The subscription type to subscribe to
