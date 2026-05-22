[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSubscribeParams

# Type Alias: EthSubscribeParams

> **EthSubscribeParams** = `object`

Based on the JSON-RPC request for `eth_subscribe` procedure

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="filterparams"></a> `filterParams?` | `readonly` | `object` | Optional filter parameters for logs subscriptions |
| `filterParams.address?` | `readonly` | [`Address`](Address.md) \| readonly [`Address`](Address.md)[] | - |
| `filterParams.topics?` | `readonly` | readonly ([`Hex`](Hex.md) \| readonly [`Hex`](Hex.md)[] \| `null`)[] | - |
| <a id="subscriptiontype"></a> `subscriptionType` | `readonly` | `"newHeads"` \| `"logs"` \| `"newPendingTransactions"` \| `"syncing"` | The subscription type to subscribe to |
