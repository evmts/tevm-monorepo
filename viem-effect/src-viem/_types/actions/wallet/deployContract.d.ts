import type { Abi } from 'abitype';
import type { Account } from '../../accounts/types.js';
import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Chain } from '../../types/chain.js';
import type { GetChain } from '../../types/chain.js';
import type { GetConstructorArgs } from '../../types/contract.js';
import type { Hex } from '../../types/misc.js';
import type { UnionOmit } from '../../types/utils.js';
import { type SendTransactionParameters, type SendTransactionReturnType } from './sendTransaction.js';
export type DeployContractParameters<TAbi extends Abi | readonly unknown[] = Abi, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined, TChainOverride extends Chain | undefined = Chain | undefined> = UnionOmit<SendTransactionParameters<TChain, TAccount, TChainOverride>, 'accessList' | 'chain' | 'to' | 'data'> & {
    abi: TAbi;
    bytecode: Hex;
} & GetChain<TChain, TChainOverride> & GetConstructorArgs<TAbi>;
export type DeployContractReturnType = SendTransactionReturnType;
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
export declare function deployContract<const TAbi extends Abi | readonly unknown[], TChain extends Chain | undefined, TAccount extends Account | undefined, TChainOverride extends Chain | undefined>(walletClient: Client<Transport, TChain, TAccount>, { abi, args, bytecode, ...request }: DeployContractParameters<TAbi, TChain, TAccount, TChainOverride>): Promise<DeployContractReturnType>;
//# sourceMappingURL=deployContract.d.ts.map