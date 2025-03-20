import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createPublicClient, http } from "viem";
import { 
  fromZodError, 
  getAbiItem, 
  isAbiFunction, 
  printAbi, 
  resolveAbi, 
  resolveEtherscanAbi 
} from "@shazow/whatsabi";
import { z } from "zod";

import { ALCHEMY_API_KEY, STANDALONE_RPC_CHAINS } from "../lib/constants/providers";

// Schema for the request
const RequestSchema = z.object({
  chainId: z.number(),
  contractAddress: z.string(),
  apiUrl: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  // Only handle POST requests
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { chainId, contractAddress, apiUrl } = RequestSchema.parse(body);

    // Create a public client for the chain
    const client = createPublicClient({
      transport: STANDALONE_RPC_CHAINS.includes(chainId)
        ? http(apiUrl ?? "")
        : http(`${apiUrl ?? ""}${ALCHEMY_API_KEY}`),
    });

    // Use WhatsABI to fetch the ABI
    const abi = await resolveAbi({
      address: contractAddress,
      provider: client,
      followProxies: true,
    });

    // Format the ABI to match the format expected by the client
    const formattedAbi = abi.map((abiFn) => {
      if (!isAbiFunction(abiFn)) return abiFn;
      
      return {
        ...abiFn,
        name: abiFn.name || `function-${abi.indexOf(abiFn)}`,
      };
    });

    return json({ success: true, data: formattedAbi });
  } catch (error) {
    console.error("Error fetching ABI:", error);
    return json({ 
      success: false, 
      error: error instanceof z.ZodError 
        ? fromZodError(error) 
        : "Failed to fetch ABI" 
    }, { status: 500 });
  }
}