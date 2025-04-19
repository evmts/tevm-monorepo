import { invoke } from "@tauri-apps/api/core";

// TODO we want to make this typesafe and generated using specta-rs
export interface Block {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
}

export class RustBridge {
  private static instance: RustBridge;

  private constructor() { }

  public static getInstance(): RustBridge {
    if (!RustBridge.instance) {
      RustBridge.instance = new RustBridge();
    }
    return RustBridge.instance;
  }

  async start(params: { rpcUrl: string, chainId: number, consensusRpc?: string }): Promise<void> {
    try {
      await invoke('start_helios', params);
    } catch (error) {
      console.error('Failed to start Helios:', error);
      throw error;
    }
  }

  /**
   * Async generator that polls for the latest block.
   * It waits for 1000ms between polls and yields a block whenever the block hash changes.
   */
  async *getLatestBlock(): AsyncGenerator<Block, void, unknown> {
    let lastBlock: Block | null = null;
    let failures = 0

    while (true) {
      try {
        const block = await invoke<Block>('get_latest_block');

        if (!lastBlock || block.hash !== lastBlock.hash) {
          lastBlock = block;
          yield block;
        }
        failures = 0
      } catch (error) {
        failures++
        if (failures > 10) {
          throw new Error("Failed to get block 10 times. Is helios started and healthy?")
        }
        console.error('Failed to get latest block:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
} 
