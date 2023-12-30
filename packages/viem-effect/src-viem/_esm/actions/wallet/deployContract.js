import { encodeDeployData } from '../../utils/abi/encodeDeployData.js'
import { sendTransaction } from './sendTransaction.js'
/**
 * Deploys a contract to the network, given bytecode and constructor arguments.
 *
 * - Docs: https://viem.sh/docs/contract/deployContract.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/contracts/deploying-contracts
 *
 * @param client - Client to use
 * @param parameters - {@link DeployContractParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms.html#transaction) hash. {@link DeployContractReturnType}
 *
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { deployContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await deployContract(client, {
 *   abi: [],
 *   account: '0x…,
 *   bytecode: '0x608060405260405161083e38038061083e833981016040819052610...',
 * })
 */
export function deployContract(
	walletClient,
	{ abi, args, bytecode, ...request },
) {
	const calldata = encodeDeployData({
		abi,
		args,
		bytecode,
	})
	return sendTransaction(walletClient, {
		...request,
		data: calldata,
	})
}
//# sourceMappingURL=deployContract.js.map
