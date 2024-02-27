/// Generated file. Do not edit.

import { createScript } from '@tevm/contract'
import { type Hex } from '@tevm/utils'

/**
 * Creates a L2OutputOracle contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2OutputOracle } from '@tevm/opstack'
 * const L2OutputOracle = createL2OutputOracle()
 */
export const createL2OutputOracle = (chainId: 10 = 10) =>
	createScript({
		name: 'L2OutputOracle',
		deployedBytecode: L2OutputOracleDeployedBytecode,
		bytecode: L2OutputOracleBytecode,
		humanReadableAbi: L2OutputOracleHumanReadableAbi,
	}).withAddress(L2OutputOracleAddresses[chainId])

export const L2OutputOracleAddresses = {
	'10': '0xdfe97868233d1aa22e815a266982f2cf17685a27',
} as const

export const L2OutputOracleBytecode =
	'0x60806040523480156200001157600080fd5b50620000256001806000808080806200002b565b62000328565b600054610100900460ff16158080156200004c5750600054600160ff909116105b806200007c575062000069306200031960201b6200135d1760201c565b1580156200007c575060005460ff166001145b620000e55760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff19166001179055801562000109576000805461ff0019166101001790555b60008811620001815760405162461bcd60e51b815260206004820152603a60248201527f4c324f75747075744f7261636c653a207375626d697373696f6e20696e74657260448201527f76616c206d7573742062652067726561746572207468616e20300000000000006064820152608401620000dc565b60008711620001f95760405162461bcd60e51b815260206004820152603460248201527f4c324f75747075744f7261636c653a204c3220626c6f636b2074696d65206d7560448201527f73742062652067726561746572207468616e20300000000000000000000000006064820152608401620000dc565b428511156200027f5760405162461bcd60e51b8152602060048201526044602482018190527f4c324f75747075744f7261636c653a207374617274696e67204c322074696d65908201527f7374616d70206d757374206265206c657373207468616e2063757272656e742060648201526374696d6560e01b608482015260a401620000dc565b6004889055600587905560018690556002859055600780546001600160a01b038087166001600160a01b0319928316179092556006805492861692909116919091179055600882905580156200030f576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050505050565b6001600160a01b03163b151590565b6115d580620003386000396000f3fe60806040526004361061018a5760003560e01c806389c44cbb116100d6578063ce5db8d61161007f578063dcec334811610059578063dcec33481461049b578063e1a41bcf146104b0578063f4daa291146104c657600080fd5b8063ce5db8d614610445578063cf8e5cf01461045b578063d1de856c1461047b57600080fd5b8063a25ae557116100b0578063a25ae55714610391578063a8e4fb90146103ed578063bffa7f0f1461041a57600080fd5b806389c44cbb1461034857806393991af3146103685780639aaab6481461037e57600080fd5b806369f16eec1161013857806370872aa51161011257806370872aa5146102fc5780637f00642014610312578063887862721461033257600080fd5b806369f16eec146102a75780636abcf563146102bc5780636b4d98dd146102d157600080fd5b8063529933df11610169578063529933df146101ea578063534db0e2146101ff57806354fd4d501461025157600080fd5b80622134cc1461018f5780631c89c97d146101b35780634599c788146101d5575b600080fd5b34801561019b57600080fd5b506005545b6040519081526020015b60405180910390f35b3480156101bf57600080fd5b506101d36101ce3660046113a2565b6104db565b005b3480156101e157600080fd5b506101a06108b6565b3480156101f657600080fd5b506004546101a0565b34801561020b57600080fd5b5060065461022c9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101aa565b34801561025d57600080fd5b5061029a6040518060400160405280600581526020017f312e382e3000000000000000000000000000000000000000000000000000000081525081565b6040516101aa9190611405565b3480156102b357600080fd5b506101a0610929565b3480156102c857600080fd5b506003546101a0565b3480156102dd57600080fd5b5060065473ffffffffffffffffffffffffffffffffffffffff1661022c565b34801561030857600080fd5b506101a060015481565b34801561031e57600080fd5b506101a061032d366004611478565b61093b565b34801561033e57600080fd5b506101a060025481565b34801561035457600080fd5b506101d3610363366004611478565b610b4f565b34801561037457600080fd5b506101a060055481565b6101d361038c366004611491565b610de9565b34801561039d57600080fd5b506103b16103ac366004611478565b61124a565b60408051825181526020808401516fffffffffffffffffffffffffffffffff9081169183019190915292820151909216908201526060016101aa565b3480156103f957600080fd5b5060075461022c9073ffffffffffffffffffffffffffffffffffffffff1681565b34801561042657600080fd5b5060075473ffffffffffffffffffffffffffffffffffffffff1661022c565b34801561045157600080fd5b506101a060085481565b34801561046757600080fd5b506103b1610476366004611478565b6112de565b34801561048757600080fd5b506101a0610496366004611478565b611316565b3480156104a757600080fd5b506101a0611346565b3480156104bc57600080fd5b506101a060045481565b3480156104d257600080fd5b506008546101a0565b600054610100900460ff16158080156104fb5750600054600160ff909116105b806105155750303b158015610515575060005460ff166001145b6105a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084015b60405180910390fd5b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055801561060457600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff166101001790555b60008811610694576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f4c324f75747075744f7261636c653a207375626d697373696f6e20696e74657260448201527f76616c206d7573742062652067726561746572207468616e2030000000000000606482015260840161059d565b60008711610724576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f4c324f75747075744f7261636c653a204c3220626c6f636b2074696d65206d7560448201527f73742062652067726561746572207468616e2030000000000000000000000000606482015260840161059d565b428511156107db576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526044602482018190527f4c324f75747075744f7261636c653a207374617274696e67204c322074696d65908201527f7374616d70206d757374206265206c657373207468616e2063757272656e742060648201527f74696d6500000000000000000000000000000000000000000000000000000000608482015260a40161059d565b60048890556005879055600186905560028590556007805473ffffffffffffffffffffffffffffffffffffffff8087167fffffffffffffffffffffffff0000000000000000000000000000000000000000928316179092556006805492861692909116919091179055600882905580156108ac57600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050505050565b6003546000901561092057600380546108d1906001906114f2565b815481106108e1576108e1611509565b600091825260209091206002909102016001015470010000000000000000000000000000000090046fffffffffffffffffffffffffffffffff16919050565b6001545b905090565b600354600090610924906001906114f2565b60006109456108b6565b8211156109fa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604860248201527f4c324f75747075744f7261636c653a2063616e6e6f7420676574206f7574707560448201527f7420666f72206120626c6f636b207468617420686173206e6f74206265656e2060648201527f70726f706f736564000000000000000000000000000000000000000000000000608482015260a40161059d565b600354610aaf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604660248201527f4c324f75747075744f7261636c653a2063616e6e6f7420676574206f7574707560448201527f74206173206e6f206f7574707574732068617665206265656e2070726f706f7360648201527f6564207965740000000000000000000000000000000000000000000000000000608482015260a40161059d565b6003546000905b80821015610b485760006002610acc8385611538565b610ad69190611550565b90508460038281548110610aec57610aec611509565b600091825260209091206002909102016001015470010000000000000000000000000000000090046fffffffffffffffffffffffffffffffff161015610b3e57610b37816001611538565b9250610b42565b8091505b50610ab6565b5092915050565b60065473ffffffffffffffffffffffffffffffffffffffff163314610bf6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603e60248201527f4c324f75747075744f7261636c653a206f6e6c7920746865206368616c6c656e60448201527f67657220616464726573732063616e2064656c657465206f7574707574730000606482015260840161059d565b6003548110610cad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604360248201527f4c324f75747075744f7261636c653a2063616e6e6f742064656c657465206f7560448201527f747075747320616674657220746865206c6174657374206f757470757420696e60648201527f6465780000000000000000000000000000000000000000000000000000000000608482015260a40161059d565b60085460038281548110610cc357610cc3611509565b6000918252602090912060016002909202010154610cf3906fffffffffffffffffffffffffffffffff16426114f2565b10610da6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604660248201527f4c324f75747075744f7261636c653a2063616e6e6f742064656c657465206f7560448201527f74707574732074686174206861766520616c7265616479206265656e2066696e60648201527f616c697a65640000000000000000000000000000000000000000000000000000608482015260a40161059d565b6000610db160035490565b90508160035581817f4ee37ac2c786ec85e87592d3c5c8a1dd66f8496dda3f125d9ea8ca5f657629b660405160405180910390a35050565b60075473ffffffffffffffffffffffffffffffffffffffff163314610eb6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604160248201527f4c324f75747075744f7261636c653a206f6e6c79207468652070726f706f736560448201527f7220616464726573732063616e2070726f706f7365206e6577206f757470757460648201527f7300000000000000000000000000000000000000000000000000000000000000608482015260a40161059d565b610ebe611346565b8314610f72576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604860248201527f4c324f75747075744f7261636c653a20626c6f636b206e756d626572206d757360448201527f7420626520657175616c20746f206e65787420657870656374656420626c6f6360648201527f6b206e756d626572000000000000000000000000000000000000000000000000608482015260a40161059d565b42610f7c84611316565b10611009576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f4c324f75747075744f7261636c653a2063616e6e6f742070726f706f7365204c60448201527f32206f757470757420696e207468652066757475726500000000000000000000606482015260840161059d565b83611096576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f4c324f75747075744f7261636c653a204c32206f75747075742070726f706f7360448201527f616c2063616e6e6f7420626520746865207a65726f2068617368000000000000606482015260840161059d565b81156111525781814014611152576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604960248201527f4c324f75747075744f7261636c653a20626c6f636b206861736820646f65732060448201527f6e6f74206d61746368207468652068617368206174207468652065787065637460648201527f6564206865696768740000000000000000000000000000000000000000000000608482015260a40161059d565b8261115c60035490565b857fa7aaf2512769da4e444e3de247be2564225c2e7a8f74cfe528e46e17d24868e24260405161118e91815260200190565b60405180910390a45050604080516060810182529283526fffffffffffffffffffffffffffffffff4281166020850190815292811691840191825260038054600181018255600091909152935160029094027fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b810194909455915190518216700100000000000000000000000000000000029116177fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85c90910155565b60408051606081018252600080825260208201819052918101919091526003828154811061127a5761127a611509565b600091825260209182902060408051606081018252600290930290910180548352600101546fffffffffffffffffffffffffffffffff8082169484019490945270010000000000000000000000000000000090049092169181019190915292915050565b604080516060810182526000808252602082018190529181019190915260036113068361093b565b8154811061127a5761127a611509565b60006005546001548361132991906114f2565b611333919061158b565b6002546113409190611538565b92915050565b60006004546113536108b6565b6109249190611538565b73ffffffffffffffffffffffffffffffffffffffff163b151590565b803573ffffffffffffffffffffffffffffffffffffffff8116811461139d57600080fd5b919050565b600080600080600080600060e0888a0312156113bd57600080fd5b873596506020880135955060408801359450606088013593506113e260808901611379565b92506113f060a08901611379565b915060c0880135905092959891949750929550565b600060208083528351808285015260005b8181101561143257858101830151858201604001528201611416565b81811115611444576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60006020828403121561148a57600080fd5b5035919050565b600080600080608085870312156114a757600080fd5b5050823594602084013594506040840135936060013592509050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082821015611504576115046114c3565b500390565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000821982111561154b5761154b6114c3565b500190565b600082611586577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156115c3576115c36114c3565b50029056fea164736f6c634300080f000a' as Hex

export const L2OutputOracleDeployedBytecode =
	'0x60806040526004361061018a5760003560e01c806389c44cbb116100d6578063ce5db8d61161007f578063dcec334811610059578063dcec33481461049b578063e1a41bcf146104b0578063f4daa291146104c657600080fd5b8063ce5db8d614610445578063cf8e5cf01461045b578063d1de856c1461047b57600080fd5b8063a25ae557116100b0578063a25ae55714610391578063a8e4fb90146103ed578063bffa7f0f1461041a57600080fd5b806389c44cbb1461034857806393991af3146103685780639aaab6481461037e57600080fd5b806369f16eec1161013857806370872aa51161011257806370872aa5146102fc5780637f00642014610312578063887862721461033257600080fd5b806369f16eec146102a75780636abcf563146102bc5780636b4d98dd146102d157600080fd5b8063529933df11610169578063529933df146101ea578063534db0e2146101ff57806354fd4d501461025157600080fd5b80622134cc1461018f5780631c89c97d146101b35780634599c788146101d5575b600080fd5b34801561019b57600080fd5b506005545b6040519081526020015b60405180910390f35b3480156101bf57600080fd5b506101d36101ce3660046113a2565b6104db565b005b3480156101e157600080fd5b506101a06108b6565b3480156101f657600080fd5b506004546101a0565b34801561020b57600080fd5b5060065461022c9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101aa565b34801561025d57600080fd5b5061029a6040518060400160405280600581526020017f312e382e3000000000000000000000000000000000000000000000000000000081525081565b6040516101aa9190611405565b3480156102b357600080fd5b506101a0610929565b3480156102c857600080fd5b506003546101a0565b3480156102dd57600080fd5b5060065473ffffffffffffffffffffffffffffffffffffffff1661022c565b34801561030857600080fd5b506101a060015481565b34801561031e57600080fd5b506101a061032d366004611478565b61093b565b34801561033e57600080fd5b506101a060025481565b34801561035457600080fd5b506101d3610363366004611478565b610b4f565b34801561037457600080fd5b506101a060055481565b6101d361038c366004611491565b610de9565b34801561039d57600080fd5b506103b16103ac366004611478565b61124a565b60408051825181526020808401516fffffffffffffffffffffffffffffffff9081169183019190915292820151909216908201526060016101aa565b3480156103f957600080fd5b5060075461022c9073ffffffffffffffffffffffffffffffffffffffff1681565b34801561042657600080fd5b5060075473ffffffffffffffffffffffffffffffffffffffff1661022c565b34801561045157600080fd5b506101a060085481565b34801561046757600080fd5b506103b1610476366004611478565b6112de565b34801561048757600080fd5b506101a0610496366004611478565b611316565b3480156104a757600080fd5b506101a0611346565b3480156104bc57600080fd5b506101a060045481565b3480156104d257600080fd5b506008546101a0565b600054610100900460ff16158080156104fb5750600054600160ff909116105b806105155750303b158015610515575060005460ff166001145b6105a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084015b60405180910390fd5b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055801561060457600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff166101001790555b60008811610694576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f4c324f75747075744f7261636c653a207375626d697373696f6e20696e74657260448201527f76616c206d7573742062652067726561746572207468616e2030000000000000606482015260840161059d565b60008711610724576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f4c324f75747075744f7261636c653a204c3220626c6f636b2074696d65206d7560448201527f73742062652067726561746572207468616e2030000000000000000000000000606482015260840161059d565b428511156107db576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526044602482018190527f4c324f75747075744f7261636c653a207374617274696e67204c322074696d65908201527f7374616d70206d757374206265206c657373207468616e2063757272656e742060648201527f74696d6500000000000000000000000000000000000000000000000000000000608482015260a40161059d565b60048890556005879055600186905560028590556007805473ffffffffffffffffffffffffffffffffffffffff8087167fffffffffffffffffffffffff0000000000000000000000000000000000000000928316179092556006805492861692909116919091179055600882905580156108ac57600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050505050565b6003546000901561092057600380546108d1906001906114f2565b815481106108e1576108e1611509565b600091825260209091206002909102016001015470010000000000000000000000000000000090046fffffffffffffffffffffffffffffffff16919050565b6001545b905090565b600354600090610924906001906114f2565b60006109456108b6565b8211156109fa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604860248201527f4c324f75747075744f7261636c653a2063616e6e6f7420676574206f7574707560448201527f7420666f72206120626c6f636b207468617420686173206e6f74206265656e2060648201527f70726f706f736564000000000000000000000000000000000000000000000000608482015260a40161059d565b600354610aaf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604660248201527f4c324f75747075744f7261636c653a2063616e6e6f7420676574206f7574707560448201527f74206173206e6f206f7574707574732068617665206265656e2070726f706f7360648201527f6564207965740000000000000000000000000000000000000000000000000000608482015260a40161059d565b6003546000905b80821015610b485760006002610acc8385611538565b610ad69190611550565b90508460038281548110610aec57610aec611509565b600091825260209091206002909102016001015470010000000000000000000000000000000090046fffffffffffffffffffffffffffffffff161015610b3e57610b37816001611538565b9250610b42565b8091505b50610ab6565b5092915050565b60065473ffffffffffffffffffffffffffffffffffffffff163314610bf6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603e60248201527f4c324f75747075744f7261636c653a206f6e6c7920746865206368616c6c656e60448201527f67657220616464726573732063616e2064656c657465206f7574707574730000606482015260840161059d565b6003548110610cad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604360248201527f4c324f75747075744f7261636c653a2063616e6e6f742064656c657465206f7560448201527f747075747320616674657220746865206c6174657374206f757470757420696e60648201527f6465780000000000000000000000000000000000000000000000000000000000608482015260a40161059d565b60085460038281548110610cc357610cc3611509565b6000918252602090912060016002909202010154610cf3906fffffffffffffffffffffffffffffffff16426114f2565b10610da6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604660248201527f4c324f75747075744f7261636c653a2063616e6e6f742064656c657465206f7560448201527f74707574732074686174206861766520616c7265616479206265656e2066696e60648201527f616c697a65640000000000000000000000000000000000000000000000000000608482015260a40161059d565b6000610db160035490565b90508160035581817f4ee37ac2c786ec85e87592d3c5c8a1dd66f8496dda3f125d9ea8ca5f657629b660405160405180910390a35050565b60075473ffffffffffffffffffffffffffffffffffffffff163314610eb6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604160248201527f4c324f75747075744f7261636c653a206f6e6c79207468652070726f706f736560448201527f7220616464726573732063616e2070726f706f7365206e6577206f757470757460648201527f7300000000000000000000000000000000000000000000000000000000000000608482015260a40161059d565b610ebe611346565b8314610f72576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604860248201527f4c324f75747075744f7261636c653a20626c6f636b206e756d626572206d757360448201527f7420626520657175616c20746f206e65787420657870656374656420626c6f6360648201527f6b206e756d626572000000000000000000000000000000000000000000000000608482015260a40161059d565b42610f7c84611316565b10611009576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f4c324f75747075744f7261636c653a2063616e6e6f742070726f706f7365204c60448201527f32206f757470757420696e207468652066757475726500000000000000000000606482015260840161059d565b83611096576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f4c324f75747075744f7261636c653a204c32206f75747075742070726f706f7360448201527f616c2063616e6e6f7420626520746865207a65726f2068617368000000000000606482015260840161059d565b81156111525781814014611152576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152604960248201527f4c324f75747075744f7261636c653a20626c6f636b206861736820646f65732060448201527f6e6f74206d61746368207468652068617368206174207468652065787065637460648201527f6564206865696768740000000000000000000000000000000000000000000000608482015260a40161059d565b8261115c60035490565b857fa7aaf2512769da4e444e3de247be2564225c2e7a8f74cfe528e46e17d24868e24260405161118e91815260200190565b60405180910390a45050604080516060810182529283526fffffffffffffffffffffffffffffffff4281166020850190815292811691840191825260038054600181018255600091909152935160029094027fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b810194909455915190518216700100000000000000000000000000000000029116177fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85c90910155565b60408051606081018252600080825260208201819052918101919091526003828154811061127a5761127a611509565b600091825260209182902060408051606081018252600290930290910180548352600101546fffffffffffffffffffffffffffffffff8082169484019490945270010000000000000000000000000000000090049092169181019190915292915050565b604080516060810182526000808252602082018190529181019190915260036113068361093b565b8154811061127a5761127a611509565b60006005546001548361132991906114f2565b611333919061158b565b6002546113409190611538565b92915050565b60006004546113536108b6565b6109249190611538565b73ffffffffffffffffffffffffffffffffffffffff163b151590565b803573ffffffffffffffffffffffffffffffffffffffff8116811461139d57600080fd5b919050565b600080600080600080600060e0888a0312156113bd57600080fd5b873596506020880135955060408801359450606088013593506113e260808901611379565b92506113f060a08901611379565b915060c0880135905092959891949750929550565b600060208083528351808285015260005b8181101561143257858101830151858201604001528201611416565b81811115611444576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60006020828403121561148a57600080fd5b5035919050565b600080600080608085870312156114a757600080fd5b5050823594602084013594506040840135936060013592509050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082821015611504576115046114c3565b500390565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000821982111561154b5761154b6114c3565b500190565b600082611586577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156115c3576115c36114c3565b50029056fea164736f6c634300080f000a' as Hex

export const L2OutputOracleHumanReadableAbi = [
	'constructor()',
	'function CHALLENGER() view returns (address)',
	'function FINALIZATION_PERIOD_SECONDS() view returns (uint256)',
	'function L2_BLOCK_TIME() view returns (uint256)',
	'function PROPOSER() view returns (address)',
	'function SUBMISSION_INTERVAL() view returns (uint256)',
	'function challenger() view returns (address)',
	'function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)',
	'function deleteL2Outputs(uint256 _l2OutputIndex)',
	'function finalizationPeriodSeconds() view returns (uint256)',
	'function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))',
	'function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))',
	'function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)',
	'function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)',
	'function l2BlockTime() view returns (uint256)',
	'function latestBlockNumber() view returns (uint256)',
	'function latestOutputIndex() view returns (uint256)',
	'function nextBlockNumber() view returns (uint256)',
	'function nextOutputIndex() view returns (uint256)',
	'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable',
	'function proposer() view returns (address)',
	'function startingBlockNumber() view returns (uint256)',
	'function startingTimestamp() view returns (uint256)',
	'function submissionInterval() view returns (uint256)',
	'function version() view returns (string)',
	'event Initialized(uint8 version)',
	'event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)',
	'event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)',
] as const

export const L2OutputOracleAbi = [
	{
		type: 'constructor',
		inputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'CHALLENGER',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'FINALIZATION_PERIOD_SECONDS',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'L2_BLOCK_TIME',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'PROPOSER',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'SUBMISSION_INTERVAL',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'challenger',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'computeL2Timestamp',
		inputs: [
			{
				name: '_l2BlockNumber',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'deleteL2Outputs',
		inputs: [
			{
				name: '_l2OutputIndex',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'finalizationPeriodSeconds',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getL2Output',
		inputs: [
			{
				name: '_l2OutputIndex',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType: 'struct Types.OutputProposal',
				components: [
					{
						name: 'outputRoot',
						type: 'bytes32',
						internalType: 'bytes32',
					},
					{
						name: 'timestamp',
						type: 'uint128',
						internalType: 'uint128',
					},
					{
						name: 'l2BlockNumber',
						type: 'uint128',
						internalType: 'uint128',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getL2OutputAfter',
		inputs: [
			{
				name: '_l2BlockNumber',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType: 'struct Types.OutputProposal',
				components: [
					{
						name: 'outputRoot',
						type: 'bytes32',
						internalType: 'bytes32',
					},
					{
						name: 'timestamp',
						type: 'uint128',
						internalType: 'uint128',
					},
					{
						name: 'l2BlockNumber',
						type: 'uint128',
						internalType: 'uint128',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getL2OutputIndexAfter',
		inputs: [
			{
				name: '_l2BlockNumber',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'initialize',
		inputs: [
			{
				name: '_submissionInterval',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_l2BlockTime',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_startingBlockNumber',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_startingTimestamp',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_proposer',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_challenger',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_finalizationPeriodSeconds',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'l2BlockTime',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'latestBlockNumber',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'latestOutputIndex',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'nextBlockNumber',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'nextOutputIndex',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'proposeL2Output',
		inputs: [
			{
				name: '_outputRoot',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: '_l2BlockNumber',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_l1BlockHash',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: '_l1BlockNumber',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'proposer',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'startingBlockNumber',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'startingTimestamp',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'submissionInterval',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'version',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'string',
				internalType: 'string',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'event',
		name: 'Initialized',
		inputs: [
			{
				name: 'version',
				type: 'uint8',
				indexed: false,
				internalType: 'uint8',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OutputProposed',
		inputs: [
			{
				name: 'outputRoot',
				type: 'bytes32',
				indexed: true,
				internalType: 'bytes32',
			},
			{
				name: 'l2OutputIndex',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'l2BlockNumber',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'l1Timestamp',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OutputsDeleted',
		inputs: [
			{
				name: 'prevNextOutputIndex',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'newNextOutputIndex',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
] as const
