[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Storage

# Interface: Storage

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

| Property | Type |
| ------ | ------ |
| <a id="getitem"></a> `getItem` | (`key`) => `string` \| `null` |
| <a id="removeitem"></a> `removeItem` | (`key`) => `void` |
| <a id="setitem"></a> `setItem` | (`key`, `value`) => `void` |
