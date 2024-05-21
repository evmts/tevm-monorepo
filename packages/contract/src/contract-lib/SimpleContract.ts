import { createScript } from '../createScript.js'

/**
 * A simple contract that stores a uint256 that is initialized in constructor and offers a getter and setter method
 * @warning the deployedBytecode is not currently correct and contract must be deployed
 */
export const SimpleContract = createScript({
	name: 'SimpleContract',
	humanReadableAbi: [
		'constructor(uint256 _initialValue)',
		'function get() view returns (uint256)',
		'function set(uint256 x)',
	] as const,
	bytecode:
		'0x40516101ef3803806101ef83398181016040528101906100319190610074565b805f819055505061009f565b5f80fd5b5f819050919050565b61005381610041565b811461005d575f80fd5b50565b5f8151905061006e8161004a565b92915050565b5f602082840312156100895761008861003d565b5b5f61009684828501610060565b91505092915050565b610143806100ac5f395ff3fe608060405234801561000f575f80fd5b5060',
	// TODO this needs to be updated
	deployedBytecode:
		'0x608060405234801561000f575f80fd5b506040516101ef3803806101ef83398181016040528101906100319190610074565b805f819055505061009f565b5f80fd5b5f819050919050565b61005381610041565b811461005d575f80fd5b50565b5f8151905061006e8161004a565b92915050565b5f602082840312156100895761008861003d565b5b5f61009684828501610060565b91505092915050565b610143806100ac5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033',
})
