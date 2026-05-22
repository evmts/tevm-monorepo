[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSubscribeParams

# Type Alias: EthSubscribeParams

> **EthSubscribeParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:370](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L370)

Based on the JSON-RPC request for `eth_subscribe` procedure

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="filterparams"></a> `filterParams?` | `readonly` | `object` | Optional filter parameters for logs subscriptions | [packages/actions/src/eth/EthParams.ts:378](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L378) |
| `filterParams.address?` | `readonly` | [`Address`](Address.md) \| readonly [`Address`](Address.md)[] | - | [packages/actions/src/eth/EthParams.ts:379](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L379) |
| `filterParams.topics?` | `readonly` | readonly ([`Hex`](Hex.md) \| readonly [`Hex`](Hex.md)[] \| `null`)[] | - | [packages/actions/src/eth/EthParams.ts:380](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L380) |
| <a id="subscriptiontype"></a> `subscriptionType` | `readonly` | `"newHeads"` \| `"logs"` \| `"newPendingTransactions"` \| `"syncing"` | The subscription type to subscribe to | [packages/actions/src/eth/EthParams.ts:374](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L374) |
