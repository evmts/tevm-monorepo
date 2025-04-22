// This is a mock implementation of the minimal Tevm API we need
// Used as a fallback when the actual Tevm module can't be loaded

// Mock client
export function createMemoryClient() {
  return {
    ready: async () => Promise.resolve(),
    
    getVm: async () => ({
      evm: {
        events: {
          on: () => {},
          removeAllListeners: () => {}
        }
      }
    }),
    
    setBalance: async ({ address, value }) => {
      console.log(`Mock: Setting balance of ${address} to ${value}`);
      return Promise.resolve();
    },
    
    deployContract: async (options) => {
      const testAccount = "0x" + "baD60A7".padStart(40, "0");
      console.log(`Mock: Deploying contract with account ${options.account}`);
      
      return {
        address: testAccount,
        write: {
          increment: async () => ({ hash: '0x123' }),
          decrement: async () => ({ hash: '0x456' })
        },
        read: {
          getCount: async () => 42n
        }
      };
    },
    
    mine: async ({ blocks }) => {
      console.log(`Mock: Mining ${blocks} blocks`);
      return Promise.resolve();
    }
  };
}