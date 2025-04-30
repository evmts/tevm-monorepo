/**
 * Example demonstrating Ether transfers using the @tevm/revm package
 * 
 * This example:
 * 1. Creates a new REVM-based EVM instance
 * 2. Sets up sender and recipient accounts
 * 3. Executes an Ether transfer
 * 4. Displays the results
 */

import { createTevmEvm } from '../src/index.js';

async function main() {
  console.log('Initializing REVM-based EVM...');
  
  // Create and initialize the EVM
  const evm = createTevmEvm();
  await evm.init();
  
  // Setup accounts
  const sender = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const recipient = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
  
  // Set sender balance with enough for transfer + gas
  console.log('Setting up accounts...');
  await evm.setAccountBalance(sender, '10000000000000000000'); // 10 ETH
  
  // Execute a transfer of 1 ETH
  console.log('Executing Ether transfer...');
  const transferResult = await evm.call({
    from: sender,
    to: recipient,
    gasLimit: '21000',
    value: '1000000000000000000', // 1 ETH
    data: '0x' // Empty data for simple transfer
  });
  
  console.log('Transfer result:', {
    success: transferResult.success,
    gasUsed: transferResult.gasUsed,
    returnValue: transferResult.returnValue,
    error: transferResult.error
  });
  
  // Reset the EVM
  console.log('Resetting EVM...');
  await evm.reset();
  
  console.log('Done!');
}

main().catch(error => {
  console.error('Error:', error);
});