[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilNodeInfoResult

# Type Alias: AnvilNodeInfoResult

> **AnvilNodeInfoResult** = `object`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="chainid"></a> `chainId` | `number` | The chain ID |
| <a id="currentblocknumber"></a> `currentBlockNumber` | `number` | The current environment (production, staging, etc.) |
| <a id="currentblocktimestamp"></a> `currentBlockTimestamp` | `number` | The current block timestamp |
| <a id="forkurl"></a> `forkUrl?` | `string` | Whether the node is in fork mode |
| <a id="hardfork"></a> `hardfork` | `string` | The hardfork |
| <a id="miningmode"></a> `miningMode` | `"auto"` \| `"manual"` \| `"interval"` | The mining configuration |
