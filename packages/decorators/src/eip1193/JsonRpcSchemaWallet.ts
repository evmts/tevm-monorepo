// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
import type { Address, BlockTag, Hex } from '@tevm/utils'
import type { RpcBlockNumber as BlockNumber, Quantity, RpcTransactionRequest as TransactionRequest } from 'viem'
import type { AddEthereumChainParameter } from './AddEthereumChainParameter.js'
import type { NetworkSync } from './NetworkSync.js'
import type { WalletPermission } from './WalletPermission.js'
import type { WatchAssetParams } from './WatchAssetParams.js'
import type { Hash } from './misc.js'

/**
 * Type definitions for Ethereum JSON-RPC methods that interact with wallets.
 * Includes methods for account management, signing, transactions, and wallet-specific features.
 * @example
 * ```typescript
 * import { JsonRpcSchemaWallet } from '@tevm/decorators'
 * import { createTevmNode } from 'tevm'
 * import { requestEip1193 } from '@tevm/decorators'
 * 
 * const node = createTevmNode().extend(requestEip1193())
 * 
 * // Request accounts access (triggers wallet popup)
 * const accounts = await node.request({
 *   method: 'eth_requestAccounts'
 * })
 * 
 * // Send a transaction
 * const txHash = await node.request({
 *   method: 'eth_sendTransaction',
 *   params: [{
 *     from: accounts[0],
 *     to: '0x1234567890123456789012345678901234567890',
 *     value: '0xde0b6b3a7640000' // 1 ETH
 *   }]
 * })
 * ```
 */
export type JsonRpcSchemaWallet = {
	/**
	 * @description Returns a list of addresses owned by this client
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_accounts' })
	 * // => ['0x0fB69...']
	 */
	eth_accounts: {
		Method: 'eth_accounts'
		Parameters?: undefined
		ReturnType: Address[]
	}
	/**
	 * @description Returns the current chain ID associated with the wallet.
	 * @example
	 * provider.request({ method: 'eth_chainId' })
	 * // => '1'
	 */
	eth_chainId: {
		Method: 'eth_chainId'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Estimates the gas necessary to complete a transaction without submitting it to the network
	 *
	 * @example
	 * provider.request({
	 *  method: 'eth_estimateGas',
	 *  params: [{ from: '0x...', to: '0x...', value: '0x...' }]
	 * })
	 * // => '0x5208'
	 */
	eth_estimateGas: {
		Method: 'eth_estimateGas'
		Parameters: [transaction: TransactionRequest] | [transaction: TransactionRequest, block: BlockNumber | BlockTag]
		ReturnType: Quantity
	}
	/**
	 * @description Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear.
	 * @link https://eips.ethereum.org/EIPS/eip-1102
	 * @example
	 * provider.request({ method: 'eth_requestAccounts' }] })
	 * // => ['0x...', '0x...']
	 */
	eth_requestAccounts: {
		Method: 'eth_requestAccounts'
		Parameters?: undefined
		ReturnType: Address[]
	}
	/**
	 * @description Creates, signs, and sends a new transaction to the network
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
	 * // => '0x...'
	 */
	eth_sendTransaction: {
		Method: 'eth_sendTransaction'
		Parameters: [transaction: TransactionRequest]
		ReturnType: Hash
	}
	/**
	 * @description Sends and already-signed transaction to the network
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
	 * // => '0x...'
	 */
	eth_sendRawTransaction: {
		Method: 'eth_sendRawTransaction'
		Parameters: [signedTransaction: Hex]
		ReturnType: Hash
	}
	/**
	 * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] })
	 * // => '0x...'
	 */
	eth_sign: {
		Method: 'eth_sign'
		Parameters: [
			/** Address to use for signing */
			address: Address,
			/** Data to sign */
			data: Hex,
		]
		ReturnType: Hex
	}
	/**
	 * @description Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
	 * // => '0x...'
	 */
	eth_signTransaction: {
		Method: 'eth_signTransaction'
		Parameters: [request: TransactionRequest]
		ReturnType: Hex
	}
	/**
	 * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] })
	 * // => '0x...'
	 */
	eth_signTypedData_v4: {
		Method: 'eth_signTypedData_v4'
		Parameters: [
			/** Address to use for signing */
			address: Address,
			/** Message to sign containing type information, a domain separator, and data */
			message: string,
		]
		ReturnType: Hex
	}
	/**
	 * @description Returns information about the status of this client’s network synchronization
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_syncing' })
	 * // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' }
	 */
	eth_syncing: {
		Method: 'eth_syncing'
		Parameters?: undefined
		ReturnType: NetworkSync | false
	}
	/**
	 * @description Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] })
	 * // => '0x...'
	 */
	personal_sign: {
		Method: 'personal_sign'
		Parameters: [
			/** Data to sign */
			data: Hex,
			/** Address to use for signing */
			address: Address,
		]
		ReturnType: Hex
	}
	/**
	 * @description Add an Ethereum chain to the wallet.
	 * @link https://eips.ethereum.org/EIPS/eip-3085
	 * @example
	 * provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] })
	 * // => { ... }
	 */
	wallet_addEthereumChain: {
		Method: 'wallet_addEthereumChain'
		Parameters: [chain: AddEthereumChainParameter]
		ReturnType: null
	}
	/**
	 * @description Gets the wallets current permissions.
	 * @link https://eips.ethereum.org/EIPS/eip-2255
	 * @example
	 * provider.request({ method: 'wallet_getPermissions' })
	 * // => { ... }
	 */
	wallet_getPermissions: {
		Method: 'wallet_getPermissions'
		Parameters?: undefined
		ReturnType: WalletPermission[]
	}
	/**
	 * @description Requests the given permissions from the user.
	 * @link https://eips.ethereum.org/EIPS/eip-2255
	 * @example
	 * provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
	 * // => { ... }
	 */
	wallet_requestPermissions: {
		Method: 'wallet_requestPermissions'
		Parameters: [permissions: { eth_accounts: Record<string, any> }]
		ReturnType: WalletPermission[]
	}
	/**
	 * @description Switch the wallet to the given Ethereum chain.
	 * @link https://eips.ethereum.org/EIPS/eip-3326
	 * @example
	 * provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] })
	 * // => { ... }
	 */
	wallet_switchEthereumChain: {
		Method: 'wallet_switchEthereumChain'
		Parameters: [chain: { chainId: string }]
		ReturnType: null
	}
	/**
	 * @description Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added.
	 * @link https://eips.ethereum.org/EIPS/eip-747
	 * @example
	 * provider.request({ method: 'wallet_watchAsset' }] })
	 * // => true
	 */
	wallet_watchAsset: {
		Method: 'wallet_watchAsset'
		Parameters: WatchAssetParams
		ReturnType: boolean
	}
}
