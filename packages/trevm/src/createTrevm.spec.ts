import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTrevm } from './index';
import { createBlockchain } from '@tevm/blockchain';
import { createStateManager } from '@tevm/state';
import { mainnet } from '@tevm/common';

// Mock the trevm-native module
vi.mock('@tevm/trevm-native', () => {
  return {
    createTrevm: vi.fn().mockImplementation(async () => {
      return {
        runCall: vi.fn().mockImplementation(async (opts) => {
          return {
            returnValue: '0x',
            executionGasUsed: '21000',
          };
        }),
      };
    }),
  };
});

describe('createTrevm', () => {
  let stateManager;
  let blockchain;
  let common;

  beforeEach(() => {
    common = mainnet.clone();
    stateManager = createStateManager({ common });
    blockchain = createBlockchain({ common });
  });

  it('should create a trevm instance with the correct API', async () => {
    const evm = await createTrevm({
      common,
      stateManager,
      blockchain,
    });

    expect(evm).toBeDefined();
    expect(typeof evm.runCall).toBe('function');
  });

  it('should handle runCall with basic parameters', async () => {
    const evm = await createTrevm({
      common,
      stateManager,
      blockchain,
    });

    const result = await evm.runCall({
      to: '0x' + '0'.repeat(40),
      value: 420n,
      skipBalance: true,
    });

    expect(result).toBeDefined();
    expect(result.returnValue).toBe('0x');
    expect(result.executionGasUsed).toBe('21000');
  });
});