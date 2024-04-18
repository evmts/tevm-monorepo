**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

## Properties

### expectedBlockTime?

> **`optional`** **expectedBlockTime**: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Source

packages/state/types/ProxyStateManager.d.ts:19

***

### onCommit()?

> **`optional`** **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`ProxyStateManager`](../../state/classes/ProxyStateManager.md)

#### Returns

`void`

#### Source

packages/state/types/ProxyStateManager.d.ts:23

***

### url

> **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Source

packages/state/types/ProxyStateManager.d.ts:13
