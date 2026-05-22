[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / Storage

# Interface: Storage

Defined in: [Storage.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L26)

Interface for storage providers that can be used with sync-storage-persister
Provides a minimal subset of the Web Storage API (localStorage/sessionStorage)
for storing and retrieving data.

## Example

```typescript
import { Storage } from '@tevm/sync-storage-persister'

// Implement the Storage interface with localStorage
const webStorage: Storage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key)
}

// Or create a custom in-memory implementation
const memoryStorage: Storage = {
  store: new Map<string, string>(),
  getItem: (key) => this.store.get(key) || null,
  setItem: (key, value) => this.store.set(key, value),
  removeItem: (key) => this.store.delete(key)
}
```

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="getitem"></a> `getItem` | (`key`) => `string` \| `null` | [Storage.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L27) |
| <a id="removeitem"></a> `removeItem` | (`key`) => `void` | [Storage.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L29) |
| <a id="setitem"></a> `setItem` | (`key`, `value`) => `void` | [Storage.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/sync-storage-persister/src/Storage.ts#L28) |
