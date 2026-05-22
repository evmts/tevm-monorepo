[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / WalletPermissionCaveat

# Type Alias: WalletPermissionCaveat

> **WalletPermissionCaveat** = `object`

Restrictions or conditions applied to a wallet permission.
Used in the EIP-2255 wallet permissions system to add constraints to granted permissions.

## Example

```typescript
import { WalletPermissionCaveat } from '@tevm/decorators'

const addressCaveat: WalletPermissionCaveat = {
  type: 'restrictReturnedAccounts',
  value: ['0x1234567890123456789012345678901234567890']
}

const expirationCaveat: WalletPermissionCaveat = {
  type: 'expiresOn',
  value: 1720872662291 // Unix timestamp in milliseconds
}
```

## Properties

| Property | Type |
| ------ | ------ |
| <a id="type"></a> `type` | `string` |
| <a id="value"></a> `value` | `any` |
