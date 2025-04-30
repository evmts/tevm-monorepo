/**
 * Simple test for the REVM implementation using a basic counter contract
 * This test is meant to verify the WASM module works correctly before benchmarking
 */

import { createTevmEvm } from './index';

// Simple counter contract bytecode (increment and get functions)
const COUNTER_BYTECODE = '0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063d09de08a146051575b600080fd5b603d6059565b6040516048919060a4565b60405180910390f35b6057605f565b005b60008054905090565b6000808154809291906076906097565b9190505550565b6000819050919050565b609e81607f565b82525050565b600060208201905060b7600083018460a7565b92915050565b600060b38260d5565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036060821360cc57607b565b5b60018201905091905056fea2646970667358221220e9ed385f3ba95e2ce1d48e09cdeea5348a8260d5e1266969be913e791b94f4e464736f6c63430008100033';

// EVM address constants
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
const CALLER_ADDRESS = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// Function signatures
const GET_COUNT = '0x6d4ce63c'; // get()
const INCREMENT = '0xd09de08a'; // increment()

/**
 * Main test function
 */
async function testCounterContract() {
  console.log('Initializing REVM EVM...');
  
  try {
    // Create and initialize the EVM
    const evm = createTevmEvm();
    await evm.init();
    
    // Get REVM version
    const version = await evm.getVersion();
    console.log(`REVM Version: ${version}`);
    
    // Set up account
    console.log('Setting up contract account...');
    await evm.setAccountBalance(CALLER_ADDRESS, '1000000000000000000'); // 1 ETH for gas
    await evm.setAccountCode(CONTRACT_ADDRESS, COUNTER_BYTECODE);
    
    // Get initial count (should be 0)
    console.log('\nGetting initial count...');
    const initialCount = await evm.call({
      from: CALLER_ADDRESS,
      to: CONTRACT_ADDRESS,
      gasLimit: '100000',
      value: '0',
      data: GET_COUNT
    });
    
    console.log('Initial count result:', {
      success: initialCount.success,
      gasUsed: initialCount.gasUsed,
      returnValue: initialCount.returnValue
    });
    
    // Parse the result - should be 0
    if (initialCount.success) {
      const count = parseInt(initialCount.returnValue.slice(2), 16);
      console.log(`Initial count: ${count}`);
      console.log(count === 0 ? '✅ Test passed - correct initial count!' : '❌ Test failed - incorrect initial count!');
    } else {
      console.log('❌ Test failed - get count reverted!', initialCount.error);
    }
    
    // Increment counter
    console.log('\nIncrementing counter...');
    const incrementResult = await evm.call({
      from: CALLER_ADDRESS,
      to: CONTRACT_ADDRESS,
      gasLimit: '100000',
      value: '0',
      data: INCREMENT
    });
    
    console.log('Increment result:', {
      success: incrementResult.success,
      gasUsed: incrementResult.gasUsed,
      returnValue: incrementResult.returnValue
    });
    
    if (!incrementResult.success) {
      console.log('❌ Test failed - increment reverted!', incrementResult.error);
    }
    
    // Get count after increment (should be 1)
    console.log('\nGetting count after increment...');
    const newCount = await evm.call({
      from: CALLER_ADDRESS,
      to: CONTRACT_ADDRESS,
      gasLimit: '100000',
      value: '0',
      data: GET_COUNT
    });
    
    console.log('New count result:', {
      success: newCount.success,
      gasUsed: newCount.gasUsed,
      returnValue: newCount.returnValue
    });
    
    // Parse the result - should be 1
    if (newCount.success) {
      const count = parseInt(newCount.returnValue.slice(2), 16);
      console.log(`Count after increment: ${count}`);
      console.log(count === 1 ? '✅ Test passed - correct count after increment!' : '❌ Test failed - incorrect count after increment!');
    } else {
      console.log('❌ Test failed - get new count reverted!', newCount.error);
    }
    
    // Reset the EVM
    console.log('\nResetting EVM...');
    await evm.reset();
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testCounterContract();