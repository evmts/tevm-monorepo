[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSubscribeParams

# Type Alias: EthSubscribeParams

> **EthSubscribeParams** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:340

Based on the JSON-RPC request for `eth_subscribe` procedure

## Properties

### filterParams?

> `readonly` `optional` **filterParams**: `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:348

Optional filter parameters for logs subscriptions

#### address?

> `readonly` `optional` **address**: [`Address`](Address.md) \| readonly [`Address`](Address.md)[]

#### topics?

> `readonly` `optional` **topics**: readonly ([`Hex`](Hex.md) \| readonly [`Hex`](Hex.md)[] \| `null`)[]

***

### subscriptionType

> `readonly` **subscriptionType**: `"newHeads"` \| `"logs"` \| `"newPendingTransactions"` \| `"syncing"`

Defined in: packages/actions/types/eth/EthParams.d.ts:344

The subscription type to subscribe to
