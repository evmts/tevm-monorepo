import { autoload, loaders } from '@shazow/whatsabi';
import { ABI } from '@shazow/whatsabi/lib.types/abi';

import { Address } from '@/lib/types/config';
import { CHAINS } from '@/lib/constants/providers';
import { getFunctionName } from '@/lib/utils';

const { EtherscanABILoader, MultiABILoader, SourcifyABILoader } = loaders;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

/* ---------------------------------- TYPES --------------------------------- */
/**
 * @type {Object} FetchAbiResponse
 * @property {boolean} success Whether the fetch was successful
 * @property {ABI | null} data The fetched abi
 */
type FetchAbiResponse = {
  success: boolean;
  data: ABI | null;
};

/**
 * @type {Function} FetchAbi
 * @param {Address} contractAddress The address of the contract
 * @param {(typeof CHAINS)[number]} chain The chain the contract is deployed on
 * @returns {Promise<FetchAbiResponse>}
 */
type FetchAbi = (
  contractAddress: Address,
  chain: (typeof CHAINS)[number],
  onProgress: (title: string, description: string) => void,
) => Promise<FetchAbiResponse>;

/* -------------------------------- HANDLERS -------------------------------- */
// Map progress phases to messages
const phaseToMessage: Record<string, string> = {
  resolveName: 'Resolving name',
  getCode: 'Fetching code',
  loadDiamondFacets: 'Loading diamond facets',
  followProxies: 'Resolving proxies',
  abiLoader: 'Loading ABI from database',
  abiFromBytecode: 'Retrieving ABI from bytecode',
  signatureLookup: 'Loading signatures from database',
};

/* -------------------------------- FUNCTIONS ------------------------------- */
/**
 * @notice Fetch the abi of a given contract
 * @dev This will pass the public client (Viem) to the WhatsABI function to fetch the abi.
 * @see https://github.com/shazow/whatsabi
 */
export const fetchAbi: FetchAbi = async (
  contractAddress,
  chain,
  onProgress,
) => {
  try {
    const res = await autoload(contractAddress, {
      provider: chain.custom.provider,
      // We can't use the default ABI loader as it doesn't specify the chain id to Sourcify
      // Same for Etherscan
      abiLoader: new MultiABILoader([
        new EtherscanABILoader({
          baseURL: chain.blockExplorers?.default.apiUrl,
          apiKey: ETHERSCAN_API_KEY,
        }),
        new SourcifyABILoader({ chainId: chain.id }),
      ]),
      // Wrap the onProgress function to just resolve the phase into a message
      onProgress: (phase) => {
        onProgress('Fetching ABI', phaseToMessage[phase]);
      },
    });

    return {
      success: true,
      // If a function doesn't have a name, use its selector or its signature for easier calling
      data: res.abi.map((funcOrEvent) => ({
        ...funcOrEvent,
        name: getFunctionName(funcOrEvent, res.abi.indexOf(funcOrEvent)),
      })),
    };
  } catch (err) {
    console.error(err);
    return { success: false, data: null };
  }
};
