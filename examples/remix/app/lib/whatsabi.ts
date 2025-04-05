import { ABI } from "@shazow/whatsabi/lib.types/abi";
import { Address } from "tevm/utils";

import { Chain } from "./types/providers";

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
 * @param {Chain} chain The chain the contract is deployed on
 * @returns {Promise<FetchAbiResponse>}
 */
type FetchAbi = (
  contractAddress: Address,
  chain: Chain,
) => Promise<FetchAbiResponse>;

// Make sure to get a name for any function, so we can call it with Tevm
export const getFunctionName = (funcOrEvent: ABI[number], index: number) => {
  return funcOrEvent.type === "event"
    ? funcOrEvent.name
    : funcOrEvent.name ||
        funcOrEvent.sig ||
        funcOrEvent.selector ||
        `function-${index.toString()}`;
};

/**
 * @notice Fetch the abi of a given contract
 * @dev This will pass the public client (Viem) to the WhatsABI function to fetch the abi.
 * @dev We need to do this using an api route because of the Sourcify strict CORS policy.
 * @see https://github.com/shazow/whatsabi
 */
export const fetchAbi: FetchAbi = async (contractAddress, chain) => {
  // Get the default api url for the chain (if it exists)
  const apiUrl = chain.blockExplorers?.default.apiUrl;

  const response = await fetch("/api/abi", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      chainId: chain.id,
      contractAddress,
      apiUrl,
    }),
  });

  if (!response.ok) {
    console.error("Failed to fetch abi:", response);
    return { success: false, data: null };
  }

  const abi = ((await response.json()) as FetchAbiResponse).data;
  if (!abi) {
    return { success: true, data: null };
  }

  return {
    success: true,
    // If a function doesn't have a name, use its selector or its signature for easier calling
    data: abi.map((funcOrEvent) => ({
      ...funcOrEvent,
      name: getFunctionName(funcOrEvent, abi.indexOf(funcOrEvent)),
    })),
  };
};
