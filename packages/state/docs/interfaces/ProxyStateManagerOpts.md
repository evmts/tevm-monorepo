**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ProxyStateManagerOpts

# Interface: ProxyStateManagerOpts

## Properties

### expectedBlockTime

> **expectedBlockTime**?: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Source

[packages/state/src/ProxyStateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L37)

***

### url

> **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Source

[packages/state/src/ProxyStateManager.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L31)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
