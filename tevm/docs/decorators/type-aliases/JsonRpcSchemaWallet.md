[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / JsonRpcSchemaWallet

# Type Alias: JsonRpcSchemaWallet

> **JsonRpcSchemaWallet** = `object`

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

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="eth_accounts"></a> `eth_accounts` | `object` | **Description** Returns a list of addresses owned by this client **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_accounts' }) // => ['0x0fB69...']` |
| `eth_accounts.Method` | `"eth_accounts"` | - |
| `eth_accounts.Parameters?` | `undefined` | - |
| `eth_accounts.ReturnType` | [`Address`](../../index/type-aliases/Address.md)[] | - |
| <a id="eth_chainid"></a> `eth_chainId` | `object` | **Description** Returns the current chain ID associated with the wallet. **Example** `provider.request({ method: 'eth_chainId' }) // => '1'` |
| `eth_chainId.Method` | `"eth_chainId"` | - |
| `eth_chainId.Parameters?` | `undefined` | - |
| `eth_chainId.ReturnType` | `Quantity$1` | - |
| <a id="eth_estimategas"></a> `eth_estimateGas` | `object` | **Description** Estimates the gas necessary to complete a transaction without submitting it to the network **Example** `provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208'` |
| `eth_estimateGas.Method` | `"eth_estimateGas"` | - |
| `eth_estimateGas.Parameters` | \[`RpcTransactionRequest`\] \| \[`RpcTransactionRequest`, `RpcBlockNumber` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)\] | - |
| `eth_estimateGas.ReturnType` | `Quantity$1` | - |
| <a id="eth_requestaccounts"></a> `eth_requestAccounts` | `object` | **Description** Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear. **Link** https://eips.ethereum.org/EIPS/eip-1102 **Example** `provider.request({ method: 'eth_requestAccounts' }] }) // => ['0x...', '0x...']` |
| `eth_requestAccounts.Method` | `"eth_requestAccounts"` | - |
| `eth_requestAccounts.Parameters?` | `undefined` | - |
| `eth_requestAccounts.ReturnType` | [`Address`](../../index/type-aliases/Address.md)[] | - |
| <a id="eth_sendrawtransaction"></a> `eth_sendRawTransaction` | `object` | **Description** Sends and already-signed transaction to the network **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...'` |
| `eth_sendRawTransaction.Method` | `"eth_sendRawTransaction"` | - |
| `eth_sendRawTransaction.Parameters` | \[[`Hex`](../../index/type-aliases/Hex.md)\] | - |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](Hash.md) | - |
| <a id="eth_sendtransaction"></a> `eth_sendTransaction` | `object` | **Description** Creates, signs, and sends a new transaction to the network **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...'` |
| `eth_sendTransaction.Method` | `"eth_sendTransaction"` | - |
| `eth_sendTransaction.Parameters` | \[`RpcTransactionRequest`\] | - |
| `eth_sendTransaction.ReturnType` | [`Hash`](Hash.md) | - |
| <a id="eth_sign"></a> `eth_sign` | `object` | **Description** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] }) // => '0x...'` |
| `eth_sign.Method` | `"eth_sign"` | - |
| `eth_sign.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), [`Hex`](../../index/type-aliases/Hex.md)\] | - |
| `eth_sign.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="eth_signtransaction"></a> `eth_signTransaction` | `object` | **Description** Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...'` |
| `eth_signTransaction.Method` | `"eth_signTransaction"` | - |
| `eth_signTransaction.Parameters` | \[`RpcTransactionRequest`\] | - |
| `eth_signTransaction.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="eth_signtypeddata_v4"></a> `eth_signTypedData_v4` | `object` | **Description** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] }) // => '0x...'` |
| `eth_signTypedData_v4.Method` | `"eth_signTypedData_v4"` | - |
| `eth_signTypedData_v4.Parameters` | \[[`Address`](../../index/type-aliases/Address.md), `string`\] | - |
| `eth_signTypedData_v4.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="eth_syncing"></a> `eth_syncing` | `object` | **Description** Returns information about the status of this client’s network synchronization **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_syncing' }) // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }` |
| `eth_syncing.Method` | `"eth_syncing"` | - |
| `eth_syncing.Parameters?` | `undefined` | - |
| `eth_syncing.ReturnType` | [`NetworkSync`](NetworkSync.md) \| `false` | - |
| <a id="personal_sign"></a> `personal_sign` | `object` | **Description** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] }) // => '0x...'` |
| `personal_sign.Method` | `"personal_sign"` | - |
| `personal_sign.Parameters` | \[[`Hex`](../../index/type-aliases/Hex.md), [`Address`](../../index/type-aliases/Address.md)\] | - |
| `personal_sign.ReturnType` | [`Hex`](../../index/type-aliases/Hex.md) | - |
| <a id="wallet_addethereumchain"></a> `wallet_addEthereumChain` | `object` | **Description** Add an Ethereum chain to the wallet. **Link** https://eips.ethereum.org/EIPS/eip-3085 **Example** `provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] }) // => { ... }` |
| `wallet_addEthereumChain.Method` | `"wallet_addEthereumChain"` | - |
| `wallet_addEthereumChain.Parameters` | \[[`AddEthereumChainParameter`](AddEthereumChainParameter.md)\] | - |
| `wallet_addEthereumChain.ReturnType` | `null` | - |
| <a id="wallet_getpermissions"></a> `wallet_getPermissions` | `object` | **Description** Gets the wallets current permissions. **Link** https://eips.ethereum.org/EIPS/eip-2255 **Example** `provider.request({ method: 'wallet_getPermissions' }) // => { ... }` |
| `wallet_getPermissions.Method` | `"wallet_getPermissions"` | - |
| `wallet_getPermissions.Parameters?` | `undefined` | - |
| `wallet_getPermissions.ReturnType` | [`WalletPermission`](WalletPermission.md)[] | - |
| <a id="wallet_requestpermissions"></a> `wallet_requestPermissions` | `object` | **Description** Requests the given permissions from the user. **Link** https://eips.ethereum.org/EIPS/eip-2255 **Example** `provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] }) // => { ... }` |
| `wallet_requestPermissions.Method` | `"wallet_requestPermissions"` | - |
| `wallet_requestPermissions.Parameters` | \[`object`\] | - |
| `wallet_requestPermissions.ReturnType` | [`WalletPermission`](WalletPermission.md)[] | - |
| <a id="wallet_switchethereumchain"></a> `wallet_switchEthereumChain` | `object` | **Description** Switch the wallet to the given Ethereum chain. **Link** https://eips.ethereum.org/EIPS/eip-3326 **Example** `provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] }) // => { ... }` |
| `wallet_switchEthereumChain.Method` | `"wallet_switchEthereumChain"` | - |
| `wallet_switchEthereumChain.Parameters` | \[`object`\] | - |
| `wallet_switchEthereumChain.ReturnType` | `null` | - |
| <a id="wallet_watchasset"></a> `wallet_watchAsset` | `object` | **Description** Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added. **Link** https://eips.ethereum.org/EIPS/eip-747 **Example** `provider.request({ method: 'wallet_watchAsset' }] }) // => true` |
| `wallet_watchAsset.Method` | `"wallet_watchAsset"` | - |
| `wallet_watchAsset.Parameters` | [`WatchAssetParams`](WatchAssetParams.md) | - |
| `wallet_watchAsset.ReturnType` | `boolean` | - |
