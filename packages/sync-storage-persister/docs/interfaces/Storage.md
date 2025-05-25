[**@tevm/sync-storage-persister**](../README.md)

***

[@tevm/sync-storage-persister](../globals.md) / Storage

# Interface: Storage

Defined in: Storage.ts:26

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

### getItem()

> **getItem**: (`key`) => `null` \| `string`

Defined in: Storage.ts:27

#### Parameters

##### key

`string`

#### Returns

`null` \| `string`

***

### removeItem()

> **removeItem**: (`key`) => `void`

Defined in: Storage.ts:29

#### Parameters

##### key

`string`

#### Returns

`void`

***

### setItem()

> **setItem**: (`key`, `value`) => `void`

Defined in: Storage.ts:28

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`
