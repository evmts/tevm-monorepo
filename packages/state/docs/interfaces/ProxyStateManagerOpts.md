**@tevm/state** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/state](../README.md) / ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

## Properties

### expectedBlockTime?

> **`optional`** **expectedBlockTime**: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Source

[packages/state/src/ProxyStateManager.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L36)

***

### onCommit()?

> **`optional`** **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`ProxyStateManager`](../classes/ProxyStateManager.md)

#### Returns

`void`

#### Source

[packages/state/src/ProxyStateManager.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L40)

***

### url

> **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Source

[packages/state/src/ProxyStateManager.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L30)
