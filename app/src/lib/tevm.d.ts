declare module 'tevm' {
  import type { 
    PublicClient, 
    Account, 
    Address, 
    Hex, 
    Transport 
  } from 'viem';

  export interface MemoryClient {
    getBalance: (params: { address: Address }) => Promise<bigint>;
    getBlockNumber: () => Promise<bigint>;
    getChainId: () => Promise<bigint>;
    getCode: (params: { address: Address }) => Promise<Hex>;
    getTransaction: (params: { hash: Hex }) => Promise<{
      hash: Hex;
      from: Address;
      to?: Address;
      value: bigint;
      blockNumber: bigint | null;
      // Other transaction fields
    }>;
    getBlock: (params: { blockNumber?: bigint; blockHash?: Hex }) => Promise<{
      number: bigint;
      hash: Hex;
      parentHash: Hex;
      timestamp: bigint;
      gasUsed: bigint;
      gasLimit: bigint;
      transactions: Hex[];
      // Other block fields
    }>;
    getTransactionCount: (params: { address: Address }) => Promise<bigint>;
    sendTransaction: (params: {
      from: Address;
      to?: Address;
      value?: bigint;
      data?: Hex;
      gas?: bigint;
    }) => Promise<Hex>;
    mine: (params: { blocks: number }) => Promise<void>;
    setBalance: (params: { address: Address; value: bigint }) => Promise<void>;
    resetForking: (params: { url: string; blockNumber?: bigint }) => void;
    // Add other methods as needed
  }

  export function createMemoryClient(options?: any): MemoryClient;
}

// Add other type declarations as needed