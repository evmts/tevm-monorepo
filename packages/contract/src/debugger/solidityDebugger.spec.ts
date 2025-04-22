import { describe, it } from 'vitest';
import { createMemoryClient } from '@tevm/memory-client';
import { solidityDebugger } from './solidityDebugger.js';
import { createContract } from '../createContract.js';
import { artifacts } from './fixtures.js';

describe(solidityDebugger.name, () => {
  it('should have correct name', async () => {
    const contractAddress = `0x${'1'.repeat(40)}` as const;
    const contractInfo =
      artifacts.solcOutput.contracts['/path/to/SimpleContract.s.sol']
        .SimpleContract;
    const contract = createContract({
      name: 'SimpleContract',
      abi: contractInfo.abi,
      address: contractAddress,
      bytecode: `0x${contractInfo.evm.bytecode.object}`,
      deployedBytecode: `0x${contractInfo.evm.deployedBytecode.object}`,
    });

    const client = createMemoryClient();
    await client.tevmSetAccount(contract);

    // @ts-expect-error - problem with deploy args type
    const debug = await solidityDebugger({ contracts: [contract] });
    await client.tevmContract({
      to: contractAddress,
      abi: contract.abi,
      functionName: 'set',
      args: [1n],
      onStep: debug,
    });
  });
});
