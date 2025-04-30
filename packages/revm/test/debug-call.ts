/**
 * Debug test for the REVM implementation specifically focused on call() and return values
 */

import { createTevmEvm } from './index';

// A simple "return 42" function - this is the bytecode for a contract with function:
// function get() public pure returns (uint256) { return 42; }
const RETURN_42_BYTECODE = '0x6080604052348015600f57600080fd5b5060a58061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80636d4ce63c14602d575b600080fd5b60336047565b604051603e9190605c565b60405180910390f35b602a90565b6000819050919050565b6056816050565b82525050565b600060208201905060706000830184604f565b9291505056fea26469706673582212201007290f7aae4cf6ce5fd1e61bed433c5973a20d5b89b2f09ea1751af49826eb64736f6c63430008130033';

// Contract that adds two numbers
// function add(uint256 a, uint256 b) public pure returns (uint256) { return a + b; }
const ADD_FUNCTION_BYTECODE = '0x608060405234801561001057600080fd5b5060f78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063771602f714602d575b600080fd5b60436004803603810190603f91906086565b6059565b604051605491906098565b60405180910390f35b6000818301905092915050565b600080fd5b6000819050919050565b6080816079565b8114608457600080fd5b50565b600081359050609081607a565b92915050565b60006040828403121560a45760a3606f565b5b600060ab848285016083565b925050602060ba848285016083565b9150509250929050565b60928160d5565b82525050565b600060208201905060ab600083018460a9565b9291505056fea26469706673582212202b9f9c17cda29d1da8a1a2dc9c81eb28d73fe8ee40d0b46dbdaed47755aac02664736f6c63430008130033';

// Address constants
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
const CALLER_ADDRESS = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// Function signatures
const GET_FUNCTION = '0x6d4ce63c'; // get()
const ADD_FUNCTION = '0x771602f7'; // add(uint256,uint256)

// Add two numbers: add(22, 20) = 42  (0x16 + 0x14 = 0x2a)
const ADD_22_20 = ADD_FUNCTION + '0000000000000000000000000000000000000000000000000000000000000016' + '0000000000000000000000000000000000000000000000000000000000000014';

/**
 * Main debug function
 */
async function debugRevm() {
  console.log('=== REVM DEBUG TEST ===');
  
  try {
    // Create and initialize the EVM
    console.log('Creating and initializing EVM...');
    const evm = createTevmEvm();
    await evm.init();
    
    // Set account balance and deploy "return 42" contract
    console.log('\n=== Testing "return 42" contract ===');
    console.log('Setting up contract account...');
    await evm.setAccountBalance(CALLER_ADDRESS, '1000000000000000000'); // 1 ETH for gas
    await evm.setAccountCode(CONTRACT_ADDRESS, RETURN_42_BYTECODE);
    
    // Call the get() function
    console.log('Calling get() function...');
    const result1 = await evm.call({
      from: CALLER_ADDRESS,
      to: CONTRACT_ADDRESS,
      gasLimit: '100000',
      value: '0',
      data: GET_FUNCTION
    });
    
    console.log('Result of get():', {
      success: result1.success,
      gasUsed: result1.gasUsed,
      returnValue: result1.returnValue,
      returnValueLength: result1.returnValue.length,
      error: result1.error
    });
    
    console.log('\n=== Resetting and testing add(a,b) contract ===');
    // Reset EVM state
    await evm.reset();
    
    // Set account balance and deploy "add(a,b)" contract
    console.log('Setting up add contract account...');
    await evm.setAccountBalance(CALLER_ADDRESS, '1000000000000000000'); // 1 ETH for gas
    await evm.setAccountCode(CONTRACT_ADDRESS, ADD_FUNCTION_BYTECODE);
    
    // Call the add(22, 20) function
    console.log('Calling add(22, 20) function...');
    const result2 = await evm.call({
      from: CALLER_ADDRESS,
      to: CONTRACT_ADDRESS,
      gasLimit: '100000',
      value: '0',
      data: ADD_22_20
    });
    
    console.log('Result of add(22, 20):', {
      success: result2.success,
      gasUsed: result2.gasUsed,
      returnValue: result2.returnValue,
      returnValueLength: result2.returnValue.length,
      error: result2.error
    });
    
    console.log('\n=== Debug Test Completed ===');
  } catch (error) {
    console.error('Debug test failed with error:', error);
  }
}

// Run the debug test
debugRevm();