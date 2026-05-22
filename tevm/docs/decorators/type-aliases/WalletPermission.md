[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / WalletPermission

# Type Alias: WalletPermission

> **WalletPermission** = `object`

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

| Property | Type |
| ------ | ------ |
| <a id="caveats"></a> `caveats` | [`WalletPermissionCaveat`](WalletPermissionCaveat.md)[] |
| <a id="date"></a> `date` | `number` |
| <a id="id"></a> `id` | `string` |
| <a id="invoker"></a> `invoker` | `` `http://${string}` `` \| `` `https://${string}` `` |
| <a id="parentcapability"></a> `parentCapability` | `"eth_accounts"` \| `string` |
