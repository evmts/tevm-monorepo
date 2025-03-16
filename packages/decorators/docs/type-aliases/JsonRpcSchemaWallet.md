[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaWallet

# Type Alias: JsonRpcSchemaWallet

> **JsonRpcSchemaWallet**: `object`

Defined in: [eip1193/JsonRpcSchemaWallet.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L41)

Type definitions for Ethereum JSON-RPC methods that interact with wallets.
Includes methods for account management, signing, transactions, and wallet-specific features.

## Type declaration

### eth\_accounts

> **eth\_accounts**: `object`

#### Description

Returns a list of addresses owned by this client

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_accounts' })
// => ['0x0fB69...']
```

#### eth\_accounts.Method

> **Method**: `"eth_accounts"`

#### eth\_accounts.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_accounts.ReturnType

> **ReturnType**: `Address`[]

### eth\_chainId

> **eth\_chainId**: `object`

#### Description

Returns the current chain ID associated with the wallet.

#### Example

```ts
provider.request({ method: 'eth_chainId' })
// => '1'
```

#### eth\_chainId.Method

> **Method**: `"eth_chainId"`

#### eth\_chainId.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_chainId.ReturnType

> **ReturnType**: `Quantity`

### eth\_estimateGas

> **eth\_estimateGas**: `object`

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

#### eth\_estimateGas.Method

> **Method**: `"eth_estimateGas"`

#### eth\_estimateGas.Parameters

> **Parameters**: \[`TransactionRequest`\] \| \[`TransactionRequest`, `BlockNumber` \| `BlockTag`\]

#### eth\_estimateGas.ReturnType

> **ReturnType**: `Quantity`

### eth\_requestAccounts

> **eth\_requestAccounts**: `object`

#### Description

Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear.

#### Link

https://eips.ethereum.org/EIPS/eip-1102

#### Example

```ts
provider.request({ method: 'eth_requestAccounts' }] })
// => ['0x...', '0x...']
```

#### eth\_requestAccounts.Method

> **Method**: `"eth_requestAccounts"`

#### eth\_requestAccounts.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_requestAccounts.ReturnType

> **ReturnType**: `Address`[]

### eth\_sendRawTransaction

> **eth\_sendRawTransaction**: `object`

#### Description

Sends and already-signed transaction to the network

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
// => '0x...'
```

#### eth\_sendRawTransaction.Method

> **Method**: `"eth_sendRawTransaction"`

#### eth\_sendRawTransaction.Parameters

> **Parameters**: \[`Hex`\]

#### eth\_sendRawTransaction.ReturnType

> **ReturnType**: [`Hash`](Hash.md)

### eth\_sendTransaction

> **eth\_sendTransaction**: `object`

#### Description

Creates, signs, and sends a new transaction to the network

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
// => '0x...'
```

#### eth\_sendTransaction.Method

> **Method**: `"eth_sendTransaction"`

#### eth\_sendTransaction.Parameters

> **Parameters**: \[`TransactionRequest`\]

#### eth\_sendTransaction.ReturnType

> **ReturnType**: [`Hash`](Hash.md)

### eth\_sign

> **eth\_sign**: `object`

#### Description

Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] })
// => '0x...'
```

#### eth\_sign.Method

> **Method**: `"eth_sign"`

#### eth\_sign.Parameters

> **Parameters**: \[`Address`, `Hex`\]

#### eth\_sign.ReturnType

> **ReturnType**: `Hex`

### eth\_signTransaction

> **eth\_signTransaction**: `object`

#### Description

Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
// => '0x...'
```

#### eth\_signTransaction.Method

> **Method**: `"eth_signTransaction"`

#### eth\_signTransaction.Parameters

> **Parameters**: \[`TransactionRequest`\]

#### eth\_signTransaction.ReturnType

> **ReturnType**: `Hex`

### eth\_signTypedData\_v4

> **eth\_signTypedData\_v4**: `object`

#### Description

Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] })
// => '0x...'
```

#### eth\_signTypedData\_v4.Method

> **Method**: `"eth_signTypedData_v4"`

#### eth\_signTypedData\_v4.Parameters

> **Parameters**: \[`Address`, `string`\]

#### eth\_signTypedData\_v4.ReturnType

> **ReturnType**: `Hex`

### eth\_syncing

> **eth\_syncing**: `object`

#### Description

Returns information about the status of this client’s network synchronization

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'eth_syncing' })
// => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }
```

#### eth\_syncing.Method

> **Method**: `"eth_syncing"`

#### eth\_syncing.Parameters?

> `optional` **Parameters**: `undefined`

#### eth\_syncing.ReturnType

> **ReturnType**: [`NetworkSync`](NetworkSync.md) \| `false`

### personal\_sign

> **personal\_sign**: `object`

#### Description

Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`

#### Link

https://eips.ethereum.org/EIPS/eip-1474

#### Example

```ts
provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] })
// => '0x...'
```

#### personal\_sign.Method

> **Method**: `"personal_sign"`

#### personal\_sign.Parameters

> **Parameters**: \[`Hex`, `Address`\]

#### personal\_sign.ReturnType

> **ReturnType**: `Hex`

### wallet\_addEthereumChain

> **wallet\_addEthereumChain**: `object`

#### Description

Add an Ethereum chain to the wallet.

#### Link

https://eips.ethereum.org/EIPS/eip-3085

#### Example

```ts
provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] })
// => { ... }
```

#### wallet\_addEthereumChain.Method

> **Method**: `"wallet_addEthereumChain"`

#### wallet\_addEthereumChain.Parameters

> **Parameters**: \[[`AddEthereumChainParameter`](AddEthereumChainParameter.md)\]

#### wallet\_addEthereumChain.ReturnType

> **ReturnType**: `null`

### wallet\_getPermissions

> **wallet\_getPermissions**: `object`

#### Description

Gets the wallets current permissions.

#### Link

https://eips.ethereum.org/EIPS/eip-2255

#### Example

```ts
provider.request({ method: 'wallet_getPermissions' })
// => { ... }
```

#### wallet\_getPermissions.Method

> **Method**: `"wallet_getPermissions"`

#### wallet\_getPermissions.Parameters?

> `optional` **Parameters**: `undefined`

#### wallet\_getPermissions.ReturnType

> **ReturnType**: [`WalletPermission`](WalletPermission.md)[]

### wallet\_requestPermissions

> **wallet\_requestPermissions**: `object`

#### Description

Requests the given permissions from the user.

#### Link

https://eips.ethereum.org/EIPS/eip-2255

#### Example

```ts
provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
// => { ... }
```

#### wallet\_requestPermissions.Method

> **Method**: `"wallet_requestPermissions"`

#### wallet\_requestPermissions.Parameters

> **Parameters**: \[`object`\]

#### wallet\_requestPermissions.ReturnType

> **ReturnType**: [`WalletPermission`](WalletPermission.md)[]

### wallet\_switchEthereumChain

> **wallet\_switchEthereumChain**: `object`

#### Description

Switch the wallet to the given Ethereum chain.

#### Link

https://eips.ethereum.org/EIPS/eip-3326

#### Example

```ts
provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] })
// => { ... }
```

#### wallet\_switchEthereumChain.Method

> **Method**: `"wallet_switchEthereumChain"`

#### wallet\_switchEthereumChain.Parameters

> **Parameters**: \[`object`\]

#### wallet\_switchEthereumChain.ReturnType

> **ReturnType**: `null`

### wallet\_watchAsset

> **wallet\_watchAsset**: `object`

#### Description

Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added.

#### Link

https://eips.ethereum.org/EIPS/eip-747

#### Example

```ts
provider.request({ method: 'wallet_watchAsset' }] })
// => true
```

#### wallet\_watchAsset.Method

> **Method**: `"wallet_watchAsset"`

#### wallet\_watchAsset.Parameters

> **Parameters**: [`WatchAssetParams`](WatchAssetParams.md)

#### wallet\_watchAsset.ReturnType

> **ReturnType**: `boolean`

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
