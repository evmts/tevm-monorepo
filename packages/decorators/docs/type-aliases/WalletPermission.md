[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / WalletPermission

# Type Alias: WalletPermission

> **WalletPermission** = `object`

Defined in: [eip1193/WalletPermission.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L36)

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

Defined in: [eip1193/WalletPermission.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L37)

***

### date

> **date**: `number`

Defined in: [eip1193/WalletPermission.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L38)

***

### id

> **id**: `string`

Defined in: [eip1193/WalletPermission.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L39)

***

### invoker

> **invoker**: `` `http://${string}` `` \| `` `https://${string}` ``

Defined in: [eip1193/WalletPermission.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L40)

***

### parentCapability

> **parentCapability**: `"eth_accounts"` \| `string`

Defined in: [eip1193/WalletPermission.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L41)
