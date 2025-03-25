[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / WalletPermissionCaveat

# Type Alias: WalletPermissionCaveat

> **WalletPermissionCaveat** = `object`

Defined in: [eip1193/WalletPermissionCaveat.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermissionCaveat.ts#L25)

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

Defined in: [eip1193/WalletPermissionCaveat.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermissionCaveat.ts#L26)

***

### value

> **value**: `any`

Defined in: [eip1193/WalletPermissionCaveat.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermissionCaveat.ts#L27)
