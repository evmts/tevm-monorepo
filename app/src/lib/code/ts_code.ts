export const code = `// TypeScript Example
import { createMemoryClient } from 'tevm';
import { parseEther } from 'viem';

async function testTevm(): Promise<{ blockNumber: bigint; balance: bigint }> {
  // Create a memory client
  const client = createMemoryClient();
  
  // Get the current block number
  const blockNumber = await client.getBlockNumber();
  console.log('Current block number:', blockNumber.toString());
  
  // Set up a test account
  const testAccount = '0x1234567890123456789012345678901234567890';
  await client.setBalance({
    address: testAccount,
    value: parseEther('1') // 1 ETH
  });
  
  // Check the balance
  const balance = await client.getBalance({ address: testAccount });
  console.log('Account balance:', balance.toString());
  
  return { blockNumber, balance };
}

testTevm().catch((err: Error) => console.error(err));
`;