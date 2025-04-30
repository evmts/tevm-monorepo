/**
 * Basic example demonstrating how to use the @tevm/revm package
 * 
 * This example:
 * 1. Creates a new REVM-based EVM instance
 * 2. Sets up a contract account with code
 * 3. Executes a call to the contract
 * 4. Displays the results
 */

import { createTevmEvm } from '../src/index.js';

async function main() {
  console.log('Initializing REVM-based EVM...');
  
  // Create and initialize the EVM
  const evm = createTevmEvm();
  await evm.init();
  
  // Get and display REVM version
  const version = await evm.getVersion();
  console.log(`REVM Version: ${version}`);
  
  // Setup accounts and contract
  const contractAddress = '0x1234567890123456789012345678901234567890';
  const callerAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  
  // Set caller balance
  console.log('Setting up accounts...');
  await evm.setAccountBalance(callerAddress, '1000000000000000000'); // 1 ETH
  
  // Set up a simple storage contract
  // This contract includes:
  // - store(uint256 value) function: stores a value
  // - retrieve() function: returns the stored value
  const contractCode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220ec5ef571580726581f21710b2d8079a26da5a74271627d9862669471e37badae64736f6c63430008120033';
  
  console.log('Deploying contract...');
  await evm.setAccountCode(contractAddress, contractCode);
  
  // Call store(42) - function signature: 6057361d
  console.log('Calling store(42)...');
  const storeCallInput = {
    from: callerAddress,
    to: contractAddress,
    gasLimit: '1000000',
    value: '0',
    data: '0x6057361d000000000000000000000000000000000000000000000000000000000000002a' // store(42)
  };
  
  const storeResult = await evm.call(storeCallInput);
  console.log('Store call result:', {
    success: storeResult.success,
    gasUsed: storeResult.gasUsed,
    returnValue: storeResult.returnValue,
    error: storeResult.error
  });
  
  // Call retrieve() - function signature: 2e64cec1
  console.log('Calling retrieve()...');
  const retrieveCallInput = {
    from: callerAddress,
    to: contractAddress,
    gasLimit: '1000000',
    value: '0',
    data: '0x2e64cec1' // retrieve()
  };
  
  const retrieveResult = await evm.call(retrieveCallInput);
  console.log('Retrieve call result:', {
    success: retrieveResult.success,
    gasUsed: retrieveResult.gasUsed,
    returnValue: retrieveResult.returnValue,
    error: retrieveResult.error
  });
  
  // Parse the returned value
  if (retrieveResult.success && retrieveResult.returnValue) {
    const valueHex = retrieveResult.returnValue.slice(2); // Remove 0x prefix
    const value = parseInt(valueHex, 16);
    console.log(`Retrieved value: ${value}`);
  }
  
  // Reset the EVM
  console.log('Resetting EVM...');
  await evm.reset();
  
  console.log('Done!');
}

main().catch(error => {
  console.error('Error:', error);
});