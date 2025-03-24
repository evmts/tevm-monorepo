[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / WalletPermission

# Type Alias: WalletPermission

> **WalletPermission** = `object`

Defined in: packages/decorators/dist/index.d.ts:1520

Permission granted to a website or application by a wallet.
Defined in EIP-2255 for the wallet permissions management system.

## Example

```typescript
import { WalletPermission } from '@tevm/decorators'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from '@tevm/decorators'

const node = createTevmNode().extend(requestEip1193())

// Request and display current wallet permissions
const permissions = await node.request({
  method: 'wallet_getPermissions'
})

const accountsPermission: WalletPermission = {
  id: 'ZcbZ7h80QuyOfK1im9OHbw',
  parentCapability: 'eth_accounts',
  invoker: 'https://example.com',
  date: 1720872662291,
  caveats: [{
    type: 'restrictReturnedAccounts',
    value: ['0x1234567890123456789012345678901234567890']
  }]
}
```

## Properties

### caveats

> **caveats**: [`WalletPermissionCaveat`](WalletPermissionCaveat.md)[]

Defined in: packages/decorators/dist/index.d.ts:1521

***

### date

> **date**: `number`

Defined in: packages/decorators/dist/index.d.ts:1522

***

### id

> **id**: `string`

Defined in: packages/decorators/dist/index.d.ts:1523

***

### invoker

> **invoker**: `` `http://${string}` `` \| `` `https://${string}` ``

Defined in: packages/decorators/dist/index.d.ts:1524

***

### parentCapability

> **parentCapability**: `"eth_accounts"` \| `string`

Defined in: packages/decorators/dist/index.d.ts:1525
