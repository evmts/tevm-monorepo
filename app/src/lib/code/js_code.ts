export const code = `// JavaScript Example
import { createMemoryClient } from 'tevm';

async function testTevm() {
  // Create a memory client
  const client = createMemoryClient();
  
  // Get the current block number
  const blockNumber = await client.getBlockNumber();
  console.log('Current block number:', blockNumber.toString());
  
  // Set up a test account
  const testAccount = '0x1234567890123456789012345678901234567890';
  await client.setBalance({
    address: testAccount,
    value: 1000000000000000000n // 1 ETH
  });
  
  // Check the balance
  const balance = await client.getBalance({ address: testAccount });
  console.log('Account balance:', balance.toString());
  
  return { blockNumber, balance };
}

testTevm().catch(console.error);
`;