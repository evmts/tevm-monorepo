import { createLogger } from '@tevm/logger';
import { InternalError } from '@tevm/errors';
import type { StateManager } from '@tevm/state';
import type { Common } from '@tevm/common';
import type { Chain } from '@tevm/blockchain';

// Import native module
import { init_trevm, TrevmWrapper } from '../../dist/index.node';

export interface TrevmEvmOptions {
  common: Common;
  stateManager: StateManager;
  blockchain: Chain;
  customPrecompiles?: any[];
  profiler?: boolean;
  allowUnlimitedContractSize?: boolean;
  loggingLevel?: string;
}

export interface TrevmRunCallOptions {
  caller?: string;
  to?: string;
  data?: string;
  value?: bigint;
  gasLimit?: bigint;
  skipBalance?: boolean;
}

export interface TrevmRunCallResult {
  returnValue: string;
  executionGasUsed: string;
  error?: string;
}

export interface TrevmEvm {
  runCall(opts: TrevmRunCallOptions): Promise<TrevmRunCallResult>;
}

/**
 * Creates a trevm-based EVM instance
 * @param options EVM options
 * @returns A trevm EVM instance
 */
export const createTrevm = async ({
  common,
  stateManager,
  blockchain,
  customPrecompiles,
  profiler,
  allowUnlimitedContractSize,
  loggingLevel,
}: TrevmEvmOptions): Promise<TrevmEvm> => {
  const logger = createLogger({
    name: '@tevm/trevm',
    level: loggingLevel ?? 'warn',
  });
  
  logger.debug({
    allowUnlimitedContractSize,
    profiler,
    customPrecompiles: customPrecompiles?.map(c => c.address.toString()),
  });

  try {
    // Initialize the native trevm module with callbacks to the StateManager
    const nativeTrevm = await init_trevm({
      chainId: common.chainId(),
      allowUnlimitedContractSize: allowUnlimitedContractSize ?? false,
      stateCallbacks: {
        getAccount: async (address: string) => {
          try {
            const account = await stateManager.getAccount(address);
            if (!account) return null;
            
            return {
              nonce: account.nonce,
              balance: account.balance,
              codeHash: account.codeHash ? `0x${Buffer.from(account.codeHash).toString('hex')}` : undefined,
              code: account.code ? `0x${Buffer.from(account.code).toString('hex')}` : undefined,
            };
          } catch (error) {
            logger.error(`Error in getAccount for ${address}:`, error);
            return null;
          }
        },
        putAccount: async (address: string, account: any) => {
          try {
            await stateManager.putAccount(address, {
              nonce: account.nonce,
              balance: account.balance,
              codeHash: account.codeHash ? Buffer.from(account.codeHash.slice(2), 'hex') : undefined,
              code: account.code ? Buffer.from(account.code.slice(2), 'hex') : undefined,
            });
            return true;
          } catch (error) {
            logger.error(`Error in putAccount for ${address}:`, error);
            return false;
          }
        },
        getStorage: async (address: string, key: string) => {
          try {
            const value = await stateManager.getContractStorage(address, key);
            return value ? `0x${Buffer.from(value).toString('hex')}` : '0x0';
          } catch (error) {
            logger.error(`Error in getStorage for ${address} key ${key}:`, error);
            return '0x0';
          }
        },
        putStorage: async (address: string, key: string, value: string) => {
          try {
            await stateManager.putContractStorage(
              address,
              key,
              Buffer.from(value.slice(2), 'hex')
            );
            return true;
          } catch (error) {
            logger.error(`Error in putStorage for ${address} key ${key}:`, error);
            return false;
          }
        },
        getCode: async (address: string) => {
          try {
            const code = await stateManager.getContractCode(address);
            return code ? `0x${Buffer.from(code).toString('hex')}` : '0x';
          } catch (error) {
            logger.error(`Error in getCode for ${address}:`, error);
            return '0x';
          }
        },
        putCode: async (address: string, code: string) => {
          try {
            await stateManager.putContractCode(
              address,
              Buffer.from(code.slice(2), 'hex')
            );
            return true;
          } catch (error) {
            logger.error(`Error in putCode for ${address}:`, error);
            return false;
          }
        },
        getBlockHash: async (blockNumber: number) => {
          try {
            const block = await blockchain.getBlock(BigInt(blockNumber));
            return block ? `0x${Buffer.from(block.header.hash()).toString('hex')}` : null;
          } catch (error) {
            logger.error(`Error in getBlockHash for block ${blockNumber}:`, error);
            return null;
          }
        }
      }
    });

    // Return a JavaScript wrapper around the native trevm that matches the Evm interface
    return {
      async runCall(opts: TrevmRunCallOptions): Promise<TrevmRunCallResult> {
        try {
          return await nativeTrevm.run_call({
            caller: opts.caller,
            to: opts.to,
            data: opts.data,
            value: opts.value,
            gas_limit: opts.gasLimit,
            skip_balance: opts.skipBalance,
          });
        } catch (error) {
          logger.error('Error in runCall:', error);
          throw new InternalError(`Trevm execution error: ${error}`);
        }
      }
    };
  } catch (error) {
    logger.error('Error initializing trevm:', error);
    throw new InternalError(`Failed to initialize trevm: ${error}`);
  }
};