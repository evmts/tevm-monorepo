[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / WalletPermissionCaveat

# Type Alias: WalletPermissionCaveat

> **WalletPermissionCaveat** = `object`

Defined in: packages/decorators/dist/index.d.ts:1487

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

### type

> **type**: `string`

Defined in: packages/decorators/dist/index.d.ts:1488

***

### value

> **value**: `any`

Defined in: packages/decorators/dist/index.d.ts:1489
