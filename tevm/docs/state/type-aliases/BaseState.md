[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / BaseState

# Type Alias: BaseState

> **BaseState** = `object`

**`Internal`**

The core data structure powering the state manager internally

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="caches"></a> `caches` | [`StateCache`](StateCache.md) | - |
| <a id="forkcache"></a> `forkCache` | [`StateCache`](StateCache.md) | - |
| <a id="getcurrentstateroot"></a> `getCurrentStateRoot` | () => [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="logger"></a> `logger` | `Logger` | - |
| <a id="options"></a> `options` | [`StateOptions`](../../index/type-aliases/StateOptions.md) | - |
| <a id="ready"></a> `ready` | () => `Promise`\<`true`\> | - |
| <a id="setcurrentstateroot"></a> `setCurrentStateRoot` | (`newStateRoot`) => `void` | - |
| <a id="stateroots"></a> `stateRoots` | [`StateRoots`](StateRoots.md) | Mapping of hashes to State roots |
| <a id="tombstones"></a> `tombstones` | `object` | - |
| `tombstones.accounts` | `Set`\<`string`\> | - |
| `tombstones.checkpoints` | `object`[] | - |
| `tombstones.storageCleared` | `Set`\<`string`\> | - |
