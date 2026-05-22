[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / JsonRpcSchemaWallet

# Type Alias: JsonRpcSchemaWallet

> **JsonRpcSchemaWallet** = `object`

Defined in: [eip1193/JsonRpcSchemaWallet.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L41)

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

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="eth_accounts"></a> `eth_accounts` | `object` | **Description** Returns a list of addresses owned by this client **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_accounts' }) // => ['0x0fB69...']` | [eip1193/JsonRpcSchemaWallet.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L49) |
| `eth_accounts.Method` | `"eth_accounts"` | - | [eip1193/JsonRpcSchemaWallet.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L50) |
| `eth_accounts.Parameters?` | `undefined` | - | [eip1193/JsonRpcSchemaWallet.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L51) |
| `eth_accounts.ReturnType` | `Address`[] | - | [eip1193/JsonRpcSchemaWallet.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L52) |
| <a id="eth_chainid"></a> `eth_chainId` | `object` | **Description** Returns the current chain ID associated with the wallet. **Example** `provider.request({ method: 'eth_chainId' }) // => '1'` | [eip1193/JsonRpcSchemaWallet.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L60) |
| `eth_chainId.Method` | `"eth_chainId"` | - | [eip1193/JsonRpcSchemaWallet.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L61) |
| `eth_chainId.Parameters?` | `undefined` | - | [eip1193/JsonRpcSchemaWallet.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L62) |
| `eth_chainId.ReturnType` | `Quantity` | - | [eip1193/JsonRpcSchemaWallet.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L63) |
| <a id="eth_estimategas"></a> `eth_estimateGas` | `object` | **Description** Estimates the gas necessary to complete a transaction without submitting it to the network **Example** `provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208'` | [eip1193/JsonRpcSchemaWallet.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L75) |
| `eth_estimateGas.Method` | `"eth_estimateGas"` | - | [eip1193/JsonRpcSchemaWallet.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L76) |
| `eth_estimateGas.Parameters` | \[`TransactionRequest`\] \| \[`TransactionRequest`, `BlockNumber` \| `BlockTag`\] | - | [eip1193/JsonRpcSchemaWallet.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L77) |
| `eth_estimateGas.ReturnType` | `Quantity` | - | [eip1193/JsonRpcSchemaWallet.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L78) |
| <a id="eth_requestaccounts"></a> `eth_requestAccounts` | `object` | **Description** Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear. **Link** https://eips.ethereum.org/EIPS/eip-1102 **Example** `provider.request({ method: 'eth_requestAccounts' }] }) // => ['0x...', '0x...']` | [eip1193/JsonRpcSchemaWallet.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L87) |
| `eth_requestAccounts.Method` | `"eth_requestAccounts"` | - | [eip1193/JsonRpcSchemaWallet.ts:88](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L88) |
| `eth_requestAccounts.Parameters?` | `undefined` | - | [eip1193/JsonRpcSchemaWallet.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L89) |
| `eth_requestAccounts.ReturnType` | `Address`[] | - | [eip1193/JsonRpcSchemaWallet.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L90) |
| <a id="eth_sendrawtransaction"></a> `eth_sendRawTransaction` | `object` | **Description** Sends and already-signed transaction to the network **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...'` | [eip1193/JsonRpcSchemaWallet.ts:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L111) |
| `eth_sendRawTransaction.Method` | `"eth_sendRawTransaction"` | - | [eip1193/JsonRpcSchemaWallet.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L112) |
| `eth_sendRawTransaction.Parameters` | \[`Hex`\] | - | [eip1193/JsonRpcSchemaWallet.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L113) |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](Hash.md) | - | [eip1193/JsonRpcSchemaWallet.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L114) |
| <a id="eth_sendtransaction"></a> `eth_sendTransaction` | `object` | **Description** Creates, signs, and sends a new transaction to the network **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...'` | [eip1193/JsonRpcSchemaWallet.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L99) |
| `eth_sendTransaction.Method` | `"eth_sendTransaction"` | - | [eip1193/JsonRpcSchemaWallet.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L100) |
| `eth_sendTransaction.Parameters` | \[`TransactionRequest`\] | - | [eip1193/JsonRpcSchemaWallet.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L101) |
| `eth_sendTransaction.ReturnType` | [`Hash`](Hash.md) | - | [eip1193/JsonRpcSchemaWallet.ts:102](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L102) |
| <a id="eth_sign"></a> `eth_sign` | `object` | **Description** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] }) // => '0x...'` | [eip1193/JsonRpcSchemaWallet.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L123) |
| `eth_sign.Method` | `"eth_sign"` | - | [eip1193/JsonRpcSchemaWallet.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L124) |
| `eth_sign.Parameters` | \[`Address`, `Hex`\] | - | [eip1193/JsonRpcSchemaWallet.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L125) |
| `eth_sign.ReturnType` | `Hex` | - | [eip1193/JsonRpcSchemaWallet.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L131) |
| <a id="eth_signtransaction"></a> `eth_signTransaction` | `object` | **Description** Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...'` | [eip1193/JsonRpcSchemaWallet.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L140) |
| `eth_signTransaction.Method` | `"eth_signTransaction"` | - | [eip1193/JsonRpcSchemaWallet.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L141) |
| `eth_signTransaction.Parameters` | \[`TransactionRequest`\] | - | [eip1193/JsonRpcSchemaWallet.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L142) |
| `eth_signTransaction.ReturnType` | `Hex` | - | [eip1193/JsonRpcSchemaWallet.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L143) |
| <a id="eth_signtypeddata_v4"></a> `eth_signTypedData_v4` | `object` | **Description** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] }) // => '0x...'` | [eip1193/JsonRpcSchemaWallet.ts:152](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L152) |
| `eth_signTypedData_v4.Method` | `"eth_signTypedData_v4"` | - | [eip1193/JsonRpcSchemaWallet.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L153) |
| `eth_signTypedData_v4.Parameters` | \[`Address`, `string`\] | - | [eip1193/JsonRpcSchemaWallet.ts:154](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L154) |
| `eth_signTypedData_v4.ReturnType` | `Hex` | - | [eip1193/JsonRpcSchemaWallet.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L160) |
| <a id="eth_syncing"></a> `eth_syncing` | `object` | **Description** Returns information about the status of this client’s network synchronization **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'eth_syncing' }) // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }` | [eip1193/JsonRpcSchemaWallet.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L169) |
| `eth_syncing.Method` | `"eth_syncing"` | - | [eip1193/JsonRpcSchemaWallet.ts:170](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L170) |
| `eth_syncing.Parameters?` | `undefined` | - | [eip1193/JsonRpcSchemaWallet.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L171) |
| `eth_syncing.ReturnType` | [`NetworkSync`](NetworkSync.md) \| `false` | - | [eip1193/JsonRpcSchemaWallet.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L172) |
| <a id="personal_sign"></a> `personal_sign` | `object` | **Description** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **Link** https://eips.ethereum.org/EIPS/eip-1474 **Example** `provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] }) // => '0x...'` | [eip1193/JsonRpcSchemaWallet.ts:181](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L181) |
| `personal_sign.Method` | `"personal_sign"` | - | [eip1193/JsonRpcSchemaWallet.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L182) |
| `personal_sign.Parameters` | \[`Hex`, `Address`\] | - | [eip1193/JsonRpcSchemaWallet.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L183) |
| `personal_sign.ReturnType` | `Hex` | - | [eip1193/JsonRpcSchemaWallet.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L189) |
| <a id="wallet_addethereumchain"></a> `wallet_addEthereumChain` | `object` | **Description** Add an Ethereum chain to the wallet. **Link** https://eips.ethereum.org/EIPS/eip-3085 **Example** `provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] }) // => { ... }` | [eip1193/JsonRpcSchemaWallet.ts:198](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L198) |
| `wallet_addEthereumChain.Method` | `"wallet_addEthereumChain"` | - | [eip1193/JsonRpcSchemaWallet.ts:199](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L199) |
| `wallet_addEthereumChain.Parameters` | \[[`AddEthereumChainParameter`](AddEthereumChainParameter.md)\] | - | [eip1193/JsonRpcSchemaWallet.ts:200](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L200) |
| `wallet_addEthereumChain.ReturnType` | `null` | - | [eip1193/JsonRpcSchemaWallet.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L201) |
| <a id="wallet_getpermissions"></a> `wallet_getPermissions` | `object` | **Description** Gets the wallets current permissions. **Link** https://eips.ethereum.org/EIPS/eip-2255 **Example** `provider.request({ method: 'wallet_getPermissions' }) // => { ... }` | [eip1193/JsonRpcSchemaWallet.ts:210](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L210) |
| `wallet_getPermissions.Method` | `"wallet_getPermissions"` | - | [eip1193/JsonRpcSchemaWallet.ts:211](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L211) |
| `wallet_getPermissions.Parameters?` | `undefined` | - | [eip1193/JsonRpcSchemaWallet.ts:212](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L212) |
| `wallet_getPermissions.ReturnType` | [`WalletPermission`](WalletPermission.md)[] | - | [eip1193/JsonRpcSchemaWallet.ts:213](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L213) |
| <a id="wallet_requestpermissions"></a> `wallet_requestPermissions` | `object` | **Description** Requests the given permissions from the user. **Link** https://eips.ethereum.org/EIPS/eip-2255 **Example** `provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] }) // => { ... }` | [eip1193/JsonRpcSchemaWallet.ts:222](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L222) |
| `wallet_requestPermissions.Method` | `"wallet_requestPermissions"` | - | [eip1193/JsonRpcSchemaWallet.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L223) |
| `wallet_requestPermissions.Parameters` | \[`object`\] | - | [eip1193/JsonRpcSchemaWallet.ts:224](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L224) |
| `wallet_requestPermissions.ReturnType` | [`WalletPermission`](WalletPermission.md)[] | - | [eip1193/JsonRpcSchemaWallet.ts:225](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L225) |
| <a id="wallet_switchethereumchain"></a> `wallet_switchEthereumChain` | `object` | **Description** Switch the wallet to the given Ethereum chain. **Link** https://eips.ethereum.org/EIPS/eip-3326 **Example** `provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] }) // => { ... }` | [eip1193/JsonRpcSchemaWallet.ts:234](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L234) |
| `wallet_switchEthereumChain.Method` | `"wallet_switchEthereumChain"` | - | [eip1193/JsonRpcSchemaWallet.ts:235](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L235) |
| `wallet_switchEthereumChain.Parameters` | \[`object`\] | - | [eip1193/JsonRpcSchemaWallet.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L236) |
| `wallet_switchEthereumChain.ReturnType` | `null` | - | [eip1193/JsonRpcSchemaWallet.ts:237](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L237) |
| <a id="wallet_watchasset"></a> `wallet_watchAsset` | `object` | **Description** Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added. **Link** https://eips.ethereum.org/EIPS/eip-747 **Example** `provider.request({ method: 'wallet_watchAsset' }] }) // => true` | [eip1193/JsonRpcSchemaWallet.ts:246](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L246) |
| `wallet_watchAsset.Method` | `"wallet_watchAsset"` | - | [eip1193/JsonRpcSchemaWallet.ts:247](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L247) |
| `wallet_watchAsset.Parameters` | [`WatchAssetParams`](WatchAssetParams.md) | - | [eip1193/JsonRpcSchemaWallet.ts:248](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L248) |
| `wallet_watchAsset.ReturnType` | `boolean` | - | [eip1193/JsonRpcSchemaWallet.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L249) |
