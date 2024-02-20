**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

## Properties

### expectedBlockTime

> **expectedBlockTime**?: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Source

packages/state/types/ProxyStateManager.d.ts:20

***

### onCommit

> **onCommit**?: (`stateManager`) => `void`

Called when state manager commits state

Called when state manager commits state

#### Parameters

▪ **stateManager**: [`ProxyStateManager`](../../state/classes/ProxyStateManager.md)

#### Source

packages/state/types/ProxyStateManager.d.ts:24

***

### url

> **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Source

packages/state/types/ProxyStateManager.d.ts:14

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
