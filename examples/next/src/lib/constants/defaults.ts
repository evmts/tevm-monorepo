import { extractChain } from 'viem';

import { Chain } from '@/lib/types/providers';
import { CHAINS } from '@/lib/constants/providers';

/* ----------------------------- DEFAULT VALUES ----------------------------- */
// The initial chain to use
// TODO extractChain not outputting a type-safe chain
export const DEFAULT_CHAIN = extractChain({
  chains: CHAINS,
  id: 1,
}) as Chain;

// The default caller address (or when the user clears the input)
export const DEFAULT_CALLER = `0x${'1'.repeat(40)}` as const;

/* --------------------------------- EXAMPLE -------------------------------- */
// The default example contract address
export const EXAMPLE_VALUES = {
  chain: extractChain({
    chains: CHAINS,
    id: 11155111, // Ethereum Sepolia
  }) as Chain,
  contract: '0x1823FbFF49f731061E8216ad2467112C0469cBFD' as const,
};
