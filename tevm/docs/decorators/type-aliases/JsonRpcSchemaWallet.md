[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaWallet

# Type Alias: JsonRpcSchemaWallet

> **JsonRpcSchemaWallet** = `object`

Defined in: packages/decorators/dist/index.d.ts:1573

Type definitions for Ethereum JSON-RPC methods that interact with wallets.
Includes methods for account management, signing, transactions, and wallet-specific features.

## Example

```typescript
import { JsonRpcSchemaWallet } from '@tevm/decorators'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from '@tevm/decorators'

const node = createTevmNode().extend(requestEip1193())

// Request accounts access (triggers wallet popup)
const accounts = await node.request({
  method: 'eth_requestAccounts'
})

// Send a transaction
const txHash = await node.request({
  method: 'eth_sendTransaction',
  params: [{
    from: accounts[0],
    to: '0x1234567890123456789012345678901234567890',
    value: '0xde0b6b3a7640000' // 1 ETH
  }]
})
```

## Properties

### eth\_accounts

> **eth\_accounts**: `object`

Defined in: packages/decorators/dist/index.d.ts:1581

#### Method

> **Method**: `"eth_accounts"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: [`Address`](../../index/type-aliases/Address.md)[]

#### Description

Returns a list of addresses owned by this client

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_accounts' })
// => ['0x0fB69...']
```

***

### eth\_chainId

> **eth\_chainId**: `object`

Defined in: packages/decorators/dist/index.d.ts:1592

#### Method

> **Method**: `"eth_chainId"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Returns the current chain ID associated with the wallet.

#### Example

```ts
provider.request({ method: 'eth_chainId' })
// => '1'
```

***

### eth\_estimateGas

> **eth\_estimateGas**: `object`

Defined in: packages/decorators/dist/index.d.ts:1607

#### Method

> **Method**: `"eth_estimateGas"`

#### Parameters

> **Parameters**: \[`RpcTransactionRequest`\] \| \[`RpcTransactionRequest`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\]

#### ReturnType

> **ReturnType**: `Quantity$1`

#### Description

Estimates the gas necessary to complete a transaction without submitting it to the network

#### Example

```ts
provider.request({
 method: 'eth_estimateGas',
 params: [{ from: '0x...', to: '0x...', value: '0x...' }]
})
// => '0x5208'
```

***

### eth\_requestAccounts

> **eth\_requestAccounts**: `object`

Defined in: packages/decorators/dist/index.d.ts:1619

#### Method

> **Method**: `"eth_requestAccounts"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: [`Address`](../../index/type-aliases/Address.md)[]

#### Description

Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear.

#### Link

https://eips.ethereum.org/EIPS/eip-1102

#### Example

```ts
provider.request({ method: 'eth_requestAccounts' }] })
// => ['0x...', '0x...']
```

***

### eth\_sendRawTransaction

> **eth\_sendRawTransaction**: `object`

Defined in: packages/decorators/dist/index.d.ts:1643

#### Method

> **Method**: `"eth_sendRawTransaction"`

#### Parameters

> **Parameters**: \[[`Hex`](../../index/type-aliases/Hex.md)\]

#### ReturnType

> **ReturnType**: [`Hash`](Hash.md)

#### Description

Sends and already-signed transaction to the network

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
// => '0x...'
```

***

### eth\_sendTransaction

> **eth\_sendTransaction**: `object`

Defined in: packages/decorators/dist/index.d.ts:1631

#### Method

> **Method**: `"eth_sendTransaction"`

#### Parameters

> **Parameters**: \[`RpcTransactionRequest`\]

#### ReturnType

> **ReturnType**: [`Hash`](Hash.md)

#### Description

Creates, signs, and sends a new transaction to the network

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
// => '0x...'
```

***

### eth\_sign

> **eth\_sign**: `object`

Defined in: packages/decorators/dist/index.d.ts:1655

#### Method

> **Method**: `"eth_sign"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), [`Hex`](../../index/type-aliases/Hex.md)\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] })
// => '0x...'
```

***

### eth\_signTransaction

> **eth\_signTransaction**: `object`

Defined in: packages/decorators/dist/index.d.ts:1672

#### Method

> **Method**: `"eth_signTransaction"`

#### Parameters

> **Parameters**: \[`RpcTransactionRequest`\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
// => '0x...'
```

***

### eth\_signTypedData\_v4

> **eth\_signTypedData\_v4**: `object`

Defined in: packages/decorators/dist/index.d.ts:1684

#### Method

> **Method**: `"eth_signTypedData_v4"`

#### Parameters

> **Parameters**: \[[`Address`](../../index/type-aliases/Address.md), `string`\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] })
// => '0x...'
```

***

### eth\_syncing

> **eth\_syncing**: `object`

Defined in: packages/decorators/dist/index.d.ts:1701

#### Method

> **Method**: `"eth_syncing"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: [`NetworkSync`](NetworkSync.md) \| `false`

#### Description

Returns information about the status of this client’s network synchronization

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_syncing' })
// => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }
```

***

### personal\_sign

> **personal\_sign**: `object`

Defined in: packages/decorators/dist/index.d.ts:1713

#### Method

> **Method**: `"personal_sign"`

#### Parameters

> **Parameters**: \[[`Hex`](../../index/type-aliases/Hex.md), [`Address`](../../index/type-aliases/Address.md)\]

#### ReturnType

> **ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

#### Description

Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] })
// => '0x...'
```

***

### wallet\_addEthereumChain

> **wallet\_addEthereumChain**: `object`

Defined in: packages/decorators/dist/index.d.ts:1730

#### Method

> **Method**: `"wallet_addEthereumChain"`

#### Parameters

> **Parameters**: \[[`AddEthereumChainParameter`](AddEthereumChainParameter.md)\]

#### ReturnType

> **ReturnType**: `null`

#### Description

Add an Ethereum chain to the wallet.

#### Link

https://eips.ethereum.org/EIPS/eip-3085

#### Example

```ts
provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] })
// => { ... }
```

***

### wallet\_getPermissions

> **wallet\_getPermissions**: `object`

Defined in: packages/decorators/dist/index.d.ts:1742

#### Method

> **Method**: `"wallet_getPermissions"`

#### Parameters?

> `optional` **Parameters**: `undefined`

#### ReturnType

> **ReturnType**: [`WalletPermission`](WalletPermission.md)[]

#### Description

Gets the wallets current permissions.

#### Link

https://eips.ethereum.org/EIPS/eip-2255

#### Example

```ts
provider.request({ method: 'wallet_getPermissions' })
// => { ... }
```

***

### wallet\_requestPermissions

> **wallet\_requestPermissions**: `object`

Defined in: packages/decorators/dist/index.d.ts:1754

#### Method

> **Method**: `"wallet_requestPermissions"`

#### Parameters

> **Parameters**: \[`object`\]

#### ReturnType

> **ReturnType**: [`WalletPermission`](WalletPermission.md)[]

#### Description

Requests the given permissions from the user.

#### Link

https://eips.ethereum.org/EIPS/eip-2255

#### Example

```ts
provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
// => { ... }
```

***

### wallet\_switchEthereumChain

> **wallet\_switchEthereumChain**: `object`

Defined in: packages/decorators/dist/index.d.ts:1768

#### Method

> **Method**: `"wallet_switchEthereumChain"`

#### Parameters

> **Parameters**: \[`object`\]

#### ReturnType

> **ReturnType**: `null`

#### Description

Switch the wallet to the given Ethereum chain.

#### Link

https://eips.ethereum.org/EIPS/eip-3326

#### Example

```ts
provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] })
// => { ... }
```

***

### wallet\_watchAsset

> **wallet\_watchAsset**: `object`

Defined in: packages/decorators/dist/index.d.ts:1782

#### Method

> **Method**: `"wallet_watchAsset"`

#### Parameters

> **Parameters**: [`WatchAssetParams`](WatchAssetParams.md)

#### ReturnType

> **ReturnType**: `boolean`

#### Description

Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added.

#### Link

https://eips.ethereum.org/EIPS/eip-747

#### Example

```ts
provider.request({ method: 'wallet_watchAsset' }] })
// => true
```
