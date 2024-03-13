import { autoload, loaders } from '@shazow/whatsabi';
import { ABI } from '@shazow/whatsabi/lib.types/abi';
import { Address } from 'tevm/utils';

import { CHAINS } from '@/lib/constants/providers';
import { getFunctionName } from '@/lib/utils';

const { EtherscanABILoader, MultiABILoader, SourcifyABILoader } = loaders;

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
  // Get the default api url for the chain (if it exists)
  const apiUrl = chain.blockExplorers?.default.apiUrl;

  // We can't use the default ABI loader as it doesn't specify the chain id to the loaders
  const loaders = [
    new EtherscanABILoader({
      baseURL: apiUrl,
      // If the key is there, there is an Etherscan-compatible explorer
      // Whether an api key was fed to the environment or not (default ''), it will
      // still work, in the worst case with a rate limit
      apiKey: chain.custom.explorerApiKey,
    }),
    new SourcifyABILoader({ chainId: chain.id }),
  ];

  try {
    const res = await autoload(contractAddress, {
      provider: chain.custom.provider,
      // If there is no api url, don't even attempt to use the Etherscan loader
      abiLoader: apiUrl ? new MultiABILoader(loaders) : loaders[1],
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
