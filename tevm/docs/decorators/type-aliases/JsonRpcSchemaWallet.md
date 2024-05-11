**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [decorators](../README.md) > JsonRpcSchemaWallet

# Type alias: JsonRpcSchemaWallet

> **JsonRpcSchemaWallet**: `object`

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

### eth\_accounts.Method

> **eth\_accounts.Method**: `"eth_accounts"`

### eth\_accounts.Parameters

> **eth\_accounts.Parameters**?: `undefined`

### eth\_accounts.ReturnType

> **eth\_accounts.ReturnType**: [`Address`](../../index/type-aliases/Address.md)[]

### eth\_chainId

> **eth\_chainId**: `object`

#### Description

Returns the current chain ID associated with the wallet.

#### Example

```ts
provider.request({ method: 'eth_chainId' })
// => '1'
```

### eth\_chainId.Method

> **eth\_chainId.Method**: `"eth_chainId"`

### eth\_chainId.Parameters

> **eth\_chainId.Parameters**?: `undefined`

### eth\_chainId.ReturnType

> **eth\_chainId.ReturnType**: `Quantity$1`

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

### eth\_estimateGas.Method

> **eth\_estimateGas.Method**: `"eth_estimateGas"`

### eth\_estimateGas.Parameters

> **eth\_estimateGas.Parameters**: [`RpcTransactionRequest`] \| [`RpcTransactionRequest`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)]

### eth\_estimateGas.ReturnType

> **eth\_estimateGas.ReturnType**: `Quantity$1`

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

### eth\_requestAccounts.Method

> **eth\_requestAccounts.Method**: `"eth_requestAccounts"`

### eth\_requestAccounts.Parameters

> **eth\_requestAccounts.Parameters**?: `undefined`

### eth\_requestAccounts.ReturnType

> **eth\_requestAccounts.ReturnType**: [`Address`](../../index/type-aliases/Address.md)[]

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

### eth\_sendRawTransaction.Method

> **eth\_sendRawTransaction.Method**: `"eth_sendRawTransaction"`

### eth\_sendRawTransaction.Parameters

> **eth\_sendRawTransaction.Parameters**: [[`Hex`](../../index/type-aliases/Hex.md)]

### eth\_sendRawTransaction.ReturnType

> **eth\_sendRawTransaction.ReturnType**: [`Hash`](Hash.md)

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

### eth\_sendTransaction.Method

> **eth\_sendTransaction.Method**: `"eth_sendTransaction"`

### eth\_sendTransaction.Parameters

> **eth\_sendTransaction.Parameters**: [`RpcTransactionRequest`]

### eth\_sendTransaction.ReturnType

> **eth\_sendTransaction.ReturnType**: [`Hash`](Hash.md)

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

### eth\_sign.Method

> **eth\_sign.Method**: `"eth_sign"`

### eth\_sign.Parameters

> **eth\_sign.Parameters**: [[`Address`](../../index/type-aliases/Address.md), [`Hex`](../../index/type-aliases/Hex.md)]

### eth\_sign.ReturnType

> **eth\_sign.ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

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

### eth\_signTransaction.Method

> **eth\_signTransaction.Method**: `"eth_signTransaction"`

### eth\_signTransaction.Parameters

> **eth\_signTransaction.Parameters**: [`RpcTransactionRequest`]

### eth\_signTransaction.ReturnType

> **eth\_signTransaction.ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

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

### eth\_signTypedData\_v4.Method

> **eth\_signTypedData\_v4.Method**: `"eth_signTypedData_v4"`

### eth\_signTypedData\_v4.Parameters

> **eth\_signTypedData\_v4.Parameters**: [[`Address`](../../index/type-aliases/Address.md), `string`]

### eth\_signTypedData\_v4.ReturnType

> **eth\_signTypedData\_v4.ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

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

### eth\_syncing.Method

> **eth\_syncing.Method**: `"eth_syncing"`

### eth\_syncing.Parameters

> **eth\_syncing.Parameters**?: `undefined`

### eth\_syncing.ReturnType

> **eth\_syncing.ReturnType**: [`NetworkSync`](NetworkSync.md) \| `false`

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

### personal\_sign.Method

> **personal\_sign.Method**: `"personal_sign"`

### personal\_sign.Parameters

> **personal\_sign.Parameters**: [[`Hex`](../../index/type-aliases/Hex.md), [`Address`](../../index/type-aliases/Address.md)]

### personal\_sign.ReturnType

> **personal\_sign.ReturnType**: [`Hex`](../../index/type-aliases/Hex.md)

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

### wallet\_addEthereumChain.Method

> **wallet\_addEthereumChain.Method**: `"wallet_addEthereumChain"`

### wallet\_addEthereumChain.Parameters

> **wallet\_addEthereumChain.Parameters**: [[`AddEthereumChainParameter`](AddEthereumChainParameter.md)]

### wallet\_addEthereumChain.ReturnType

> **wallet\_addEthereumChain.ReturnType**: `null`

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

### wallet\_getPermissions.Method

> **wallet\_getPermissions.Method**: `"wallet_getPermissions"`

### wallet\_getPermissions.Parameters

> **wallet\_getPermissions.Parameters**?: `undefined`

### wallet\_getPermissions.ReturnType

> **wallet\_getPermissions.ReturnType**: [`WalletPermission`](WalletPermission.md)[]

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

### wallet\_requestPermissions.Method

> **wallet\_requestPermissions.Method**: `"wallet_requestPermissions"`

### wallet\_requestPermissions.Parameters

> **wallet\_requestPermissions.Parameters**: [`object`]

### wallet\_requestPermissions.ReturnType

> **wallet\_requestPermissions.ReturnType**: [`WalletPermission`](WalletPermission.md)[]

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

### wallet\_switchEthereumChain.Method

> **wallet\_switchEthereumChain.Method**: `"wallet_switchEthereumChain"`

### wallet\_switchEthereumChain.Parameters

> **wallet\_switchEthereumChain.Parameters**: [`object`]

### wallet\_switchEthereumChain.ReturnType

> **wallet\_switchEthereumChain.ReturnType**: `null`

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

### wallet\_watchAsset.Method

> **wallet\_watchAsset.Method**: `"wallet_watchAsset"`

### wallet\_watchAsset.Parameters

> **wallet\_watchAsset.Parameters**: [`WatchAssetParams`](WatchAssetParams.md)

### wallet\_watchAsset.ReturnType

> **wallet\_watchAsset.ReturnType**: `boolean`

## Source

packages/decorators/dist/index.d.ts:1364

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
