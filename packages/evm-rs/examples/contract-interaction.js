/**
 * Example of deploying and interacting with a smart contract using @tevm/evm-rs
 * 
 * To run:
 * 1. Build the package with `npm run build`
 * 2. Run with Node.js: `node examples/contract-interaction.js`
 */

import { createEvm } from '../dist/index.js'

// This would typically be imported from other tevm packages
const mockCommon = { ethjsCommon: {} }
const mockStateManager = { /* mock implementation */ }
const mockBlockchain = { /* mock implementation */ }

// Simple storage contract bytecode (stores and retrieves a uint256)
// pragma solidity ^0.8.0;
// contract SimpleStorage {
//     uint256 private value;
//     function setValue(uint256 _value) public { value = _value; }
//     function getValue() public view returns (uint256) { return value; }
// }
const SIMPLE_STORAGE_BYTECODE = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633fa4f2451461003b5780635524107714610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea2646970667358221220223701d5d0d4c6cefdd5356c93a17cd1f67302f3a4f155f2578e073eadf4d55464736f6c63430008120033'

// ABI encoding of setValue(42)
const SET_VALUE_CALLDATA = '0x552410770000000000000000000000000000000000000000000000000000000000000042'

// ABI encoding of getValue()
const GET_VALUE_CALLDATA = '0x3fa4f245'

async function runExample() {
  console.log('Creating EVM instance...')
  
  try {
    // Create the EVM instance
    const evm = await createEvm({
      common: mockCommon,
      stateManager: mockStateManager,
      blockchain: mockBlockchain,
      allowUnlimitedContractSize: true,
      loggingLevel: 'info'
    })

    console.log('Waiting for EVM to be ready...')
    await evm.ready()
    console.log('EVM ready!')

    // Set up deployer account
    console.log('Setting up account...')
    await evm.setAccount(
      '0x1000000000000000000000000000000000000000', // Deployer address
      '0x1000000000000000000', // 1 ETH
      null, // No code (EOA)
      0 // Nonce
    )

    // Deploy the contract
    console.log('Deploying contract...')
    const deployResult = await evm.runCall({
      caller: '0x1000000000000000000000000000000000000000',
      to: null, // null means contract creation
      value: '0x0',
      data: SIMPLE_STORAGE_BYTECODE,
      gasLimit: 1000000
    })

    console.log('Contract deployment result:', {
      gasUsed: deployResult.gasUsed.toString(),
    })

    // In a real scenario, we'd get the contract address from the result
    // For this example, we'll use a hardcoded address based on the sender
    // The actual address would depend on sender and nonce
    const contractAddress = '0x5a443704dd4b594b382c22a083e2bd3090a6fef3'
    console.log('Contract deployed at address:', contractAddress)

    // Call the contract: setValue(42)
    console.log('Calling setValue(42)...')
    const setValueResult = await evm.runCall({
      caller: '0x1000000000000000000000000000000000000000',
      to: contractAddress,
      value: '0x0',
      data: SET_VALUE_CALLDATA,
      gasLimit: 100000
    })

    console.log('setValue result:', {
      gasUsed: setValueResult.gasUsed.toString(),
      result: setValueResult.result
    })

    // Call the contract: getValue()
    console.log('Calling getValue()...')
    const getValueResult = await evm.runCall({
      caller: '0x1000000000000000000000000000000000000000',
      to: contractAddress,
      value: '0x0',
      data: GET_VALUE_CALLDATA,
      gasLimit: 100000
    })

    console.log('getValue result:', {
      gasUsed: getValueResult.gasUsed.toString(),
      result: getValueResult.result
    })

    // Decode the return value (should be 42)
    if (getValueResult.result && getValueResult.result.length >= 66) {
      // Convert hex string to decimal
      const value = BigInt(getValueResult.result)
      console.log('Decoded value:', value.toString())
    } else {
      console.log('Could not decode result:', getValueResult.result)
    }

    console.log('Example completed successfully!')
  } catch (error) {
    console.error('Error running example:', error)
  }
}

runExample()