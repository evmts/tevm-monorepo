import { expect, test } from 'vitest'

import { wagmiContractConfig } from '~test/src/abis.js'
import { forkBlockNumber } from '~test/src/constants.js'
import { publicClient } from '~test/src/utils.js'

import { getBytecode } from './getBytecode.js'

test('default', async () => {
  expect(
    await getBytecode(publicClient, {
      address: '0x0000000000000000000000000000000000000000',
    }),
  ).toBe(undefined)
  expect(
    await getBytecode(publicClient, { address: wagmiContractConfig.address }),
  ).toBe(
    '0x608060405234801561001057600080fd5b50600436106101005760003560e01c80636352211e11610097578063a22cb46511610066578063a22cb46514610215578063b88d4fde14610228578063c87b56dd1461023b578063e985e9c51461024e57600080fd5b80636352211e146101d457806370a08231146101e757806395d89b41146101fa578063a0712d681461020257600080fd5b80631249c58b116100d35780631249c58b1461018f57806318160ddd1461019757806323b872dd146101ae57806342842e0e146101c157600080fd5b806301ffc9a71461010557806306fdde031461012d578063081812fc14610142578063095ea7b31461017a575b600080fd5b61011861011336600461178f565b610297565b60405190151581526020015b60405180910390f35b61013561037c565b6040516101249190611829565b61015561015036600461183c565b61040e565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610124565b61018d61018836600461187e565b6104d3565b005b61018d61062b565b6101a060065481565b604051908152602001610124565b61018d6101bc3660046118a8565b61067d565b61018d6101cf3660046118a8565b610704565b6101556101e236600461183c565b61071f565b6101a06101f53660046118e4565b6107b7565b61013561086b565b61018d61021036600461183c565b61087a565b61018d6102233660046118ff565b610902565b61018d61023636600461196a565b610911565b61013561024936600461183c565b61099f565b61011861025c366004611a64565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260056020908152604080832093909416825291909152205460ff1690565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f80ac58cd00000000000000000000000000000000000000000000000000000000148061032a57507fffffffff0000000000000000000000000000000000000000000000000000000082167f5b5e139f00000000000000000000000000000000000000000000000000000000145b8061037657507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b60606000805461038b90611a97565b80601f01602080910402602001604051908101604052809291908181526020018280546103b790611a97565b80156104045780601f106103d957610100808354040283529160200191610404565b820191906000526020600020905b8154815290600101906020018083116103e757829003601f168201915b5050505050905090565b60008181526002602052604081205473ffffffffffffffffffffffffffffffffffffffff166104aa5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201527f697374656e7420746f6b656e000000000000000000000000000000000000000060648201526084015b60405180910390fd5b5060009081526004602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b60006104de8261071f565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036105815760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084016104a1565b3373ffffffffffffffffffffffffffffffffffffffff821614806105aa57506105aa813361025c565b61061c5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016104a1565b6106268383610b07565b505050565b6007545b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff16156106615760010161062f565b61066b3382610ba7565b60068054600190810190915501600755565b6106873382610bc1565b6106f95760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656400000000000000000000000000000060648201526084016104a1565b610626838383610d17565b61062683838360405180602001604052806000815250610911565b60008181526002602052604081205473ffffffffffffffffffffffffffffffffffffffff16806103765760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201527f656e7420746f6b656e000000000000000000000000000000000000000000000060648201526084016104a1565b600073ffffffffffffffffffffffffffffffffffffffff82166108425760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a6560448201527f726f20616464726573730000000000000000000000000000000000000000000060648201526084016104a1565b5073ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b60606001805461038b90611a97565b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff16156108ec5760405162461bcd60e51b815260206004820152601160248201527f546f6b656e2049442069732074616b656e00000000000000000000000000000060448201526064016104a1565b6108f63382610ba7565b50600680546001019055565b61090d338383610f4a565b5050565b61091b3383610bc1565b61098d5760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656400000000000000000000000000000060648201526084016104a1565b6109998484848461105d565b50505050565b6040517f666f726567726f756e64000000000000000000000000000000000000000000006020820152602a810182905260609060009061016890604a016040516020818303038152906040528051906020012060001c6109ff9190611b19565b6040517f6261636b67726f756e64000000000000000000000000000000000000000000006020820152602a810185905290915060009061016890604a016040516020818303038152906040528051906020012060001c610a5f9190611b19565b90506000610aba610a6f866110e6565b610aa9610a7b866110e6565b610a84866110e6565b604051602001610a95929190611b2d565b60405160208183030381529060405261121b565b604051602001610a959291906125ba565b9050600081604051602001610acf919061268b565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190529695505050505050565b600081815260046020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff84169081179091558190610b618261071f565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b61090d82826040518060200160405280600081525061136e565b60008181526002602052604081205473ffffffffffffffffffffffffffffffffffffffff16610c585760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201527f697374656e7420746f6b656e000000000000000000000000000000000000000060648201526084016104a1565b6000610c638361071f565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610cd1575073ffffffffffffffffffffffffffffffffffffffff80821660009081526005602090815260408083209388168352929052205460ff165b80610d0f57508373ffffffffffffffffffffffffffffffffffffffff16610cf78461040e565b73ffffffffffffffffffffffffffffffffffffffff16145b949350505050565b8273ffffffffffffffffffffffffffffffffffffffff16610d378261071f565b73ffffffffffffffffffffffffffffffffffffffff1614610dc05760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201527f6f776e657200000000000000000000000000000000000000000000000000000060648201526084016104a1565b73ffffffffffffffffffffffffffffffffffffffff8216610e485760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016104a1565b610e53600082610b07565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600360205260408120805460019290610e899084906126ff565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260408120805460019290610ec4908490612716565b909155505060008181526002602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff86811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610fc55760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104a1565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526005602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b611068848484610d17565b611074848484846113f7565b6109995760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104a1565b60608160000361112957505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b8115611153578061113d8161272e565b915061114c9050600a83612766565b915061112d565b60008167ffffffffffffffff81111561116e5761116e61193b565b6040519080825280601f01601f191660200182016040528015611198576020820181803683370190505b5090505b8415610d0f576111ad6001836126ff565b91506111ba600a86611b19565b6111c5906030612716565b60f81b8183815181106111da576111da61277a565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350611214600a86612766565b945061119c565b6060815160000361123a57505060408051602081019091526000815290565b600060405180606001604052806040815260200161284d60409139905060006003845160026112699190612716565b6112739190612766565b61127e9060046127a9565b67ffffffffffffffff8111156112965761129661193b565b6040519080825280601f01601f1916602001820160405280156112c0576020820181803683370190505b509050600182016020820185865187015b8082101561132c576003820191508151603f8160121c168501518453600184019350603f81600c1c168501518453600184019350603f8160061c168501518453600184019350603f81168501518453506001830192506112d1565b5050600386510660018114611348576002811461135b57611363565b603d6001830353603d6002830353611363565b603d60018303535b509195945050505050565b61137883836115d0565b61138560008484846113f7565b6106265760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104a1565b600073ffffffffffffffffffffffffffffffffffffffff84163b156115c5576040517f150b7a0200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063150b7a029061146e9033908990889088906004016127e6565b6020604051808303816000875af19250505080156114c7575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526114c49181019061282f565b60015b61157a573d8080156114f5576040519150601f19603f3d011682016040523d82523d6000602084013e6114fa565b606091505b5080516000036115725760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016104a1565b805181602001fd5b7fffffffff00000000000000000000000000000000000000000000000000000000167f150b7a0200000000000000000000000000000000000000000000000000000000149050610d0f565b506001949350505050565b73ffffffffffffffffffffffffffffffffffffffff82166116335760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016104a1565b60008181526002602052604090205473ffffffffffffffffffffffffffffffffffffffff16156116a55760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016104a1565b73ffffffffffffffffffffffffffffffffffffffff821660009081526003602052604081208054600192906116db908490612716565b909155505060008181526002602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b7fffffffff000000000000000000000000000000000000000000000000000000008116811461178c57600080fd5b50565b6000602082840312156117a157600080fd5b81356117ac8161175e565b9392505050565b60005b838110156117ce5781810151838201526020016117b6565b838111156109995750506000910152565b600081518084526117f78160208601602086016117b3565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006117ac60208301846117df565b60006020828403121561184e57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461187957600080fd5b919050565b6000806040838503121561189157600080fd5b61189a83611855565b946020939093013593505050565b6000806000606084860312156118bd57600080fd5b6118c684611855565b92506118d460208501611855565b9150604084013590509250925092565b6000602082840312156118f657600080fd5b6117ac82611855565b6000806040838503121561191257600080fd5b61191b83611855565b91506020830135801515811461193057600080fd5b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806000806080858703121561198057600080fd5b61198985611855565b935061199760208601611855565b925060408501359150606085013567ffffffffffffffff808211156119bb57600080fd5b818701915087601f8301126119cf57600080fd5b8135818111156119e1576119e161193b565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908382118183101715611a2757611a2761193b565b816040528281528a6020848701011115611a4057600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b60008060408385031215611a7757600080fd5b611a8083611855565b9150611a8e60208401611855565b90509250929050565b600181811c90821680611aab57607f821691505b602082108103611ae4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082611b2857611b28611aea565b500690565b7f3c73766720786d6c6e733d22687474703a2f2f7777772e77332e6f72672f323081527f30302f737667222077696474683d223130323422206865696768743d2231303260208201527f34222066696c6c3d226e6f6e65223e3c706174682066696c6c3d2268736c2800604082015260008351611bb181605f8501602088016117b3565b7f2c20313030252c20313025292220643d224d3020306831303234763130323448605f918401918201527f307a22202f3e3c672066696c6c3d2268736c2800000000000000000000000000607f8201528351611c148160928401602088016117b3565b7f2c20313030252c2039302529223e3c7061746820643d224d393033203433372e609292909101918201527f35633020392e3131332d372e3338382031362e352d31362e352031362e35732d60b28201527f31362e352d372e3338372d31362e352d31362e3520372e3338382d31362e352060d28201527f31362e352d31362e352031362e3520372e3338372031362e352031362e357a4d60f28201527f3639382e3532392035363663362e39323120302031322e35332d352e353936206101128201527f31322e35332d31322e35762d353063302d362e39303420352e3630392d31322e6101328201527f352031322e3532392d31322e356832352e30353963362e393220302031322e356101528201527f323920352e3539362031322e3532392031322e35763530633020362e393034206101728201527f352e3630392031322e352031322e35332031322e357331322e3532392d352e356101928201527f39362031322e3532392d31322e35762d353063302d362e39303420352e3630396101b28201527f2d31322e352031322e35332d31322e356832352e30353963362e3932203020316101d28201527f322e35323920352e3539362031322e3532392031322e35763530633020362e396101f28201527f303420352e3630392031322e352031322e3532392031322e356833372e3538396102128201527f63362e393220302031322e3532392d352e3539362031322e3532392d31322e356102328201527f762d373563302d362e3930342d352e3630392d31322e352d31322e3532392d316102528201527f322e35732d31322e353320352e3539362d31322e35332031322e357635362e326102728201527f3561362e32363420362e3236342030203120312d31322e3532392030563437386102928201527f2e3563302d362e3930342d352e3630392d31322e352d31322e35332d31322e356102b28201527f483639382e353239632d362e393220302d31322e35323920352e3539362d31326102d28201527f2e3532392031322e35763735633020362e39303420352e3630392031322e35206102f28201527f31322e3532392031322e357a22202f3e3c7061746820643d224d3135372e36356103128201527f3520353431632d362e39333220302d31322e3535322d352e3539362d31322e356103328201527f35322d31322e35762d353063302d362e3930342d352e3631392d31322e352d316103528201527f322e3535312d31322e3553313230203437312e35393620313230203437382e356103728201527f763735633020362e39303420352e36322031322e352031322e3535322031322e6103928201527f35683135302e363263362e39333320302031322e3535322d352e3539362031326103b28201527f2e3535322d31322e35762d353063302d362e39303420352e3631392d31322e356103d28201527f2031322e3535322d31322e35683134342e33343563332e343635203020362e326103f28201527f373620322e37393820362e32373620362e3235732d322e38313120362e32352d6104128201527f362e32373620362e3235483332302e383238632d362e39333320302d31322e356104328201527f353220352e3539362d31322e3535322031322e357633372e35633020362e39306104528201527f3420352e3631392031322e352031322e3535322031322e35683135302e3632636104728201527f362e39333320302031322e3535322d352e3539362031322e3535322d31322e356104928201527f762d373563302d362e3930342d352e3631392d31322e352d31322e3535322d316104b28201527f322e35483238332e313732632d362e39333220302d31322e35353120352e35396104d28201527f362d31322e3535312031322e35763530633020362e3930342d352e36313920316104f28201527f322e352d31322e3535322031322e35682d32352e313033632d362e39333320306105128201527f2d31322e3535322d352e3539362d31322e3535322d31322e35762d353063302d6105328201527f362e3930342d352e36322d31322e352d31322e3535322d31322e35732d31322e6105528201527f35353220352e3539362d31322e3535322031322e35763530633020362e3930346105728201527f2d352e3631392031322e352d31322e3535312031322e35682d32352e3130347a6105928201527f6d3330312e3234322d362e3235633020332e3435322d322e38313120362e32356105b28201527f2d362e32373620362e3235483333392e363535632d332e34363520302d362e326105d28201527f37362d322e3739382d362e3237362d362e323573322e3831312d362e323520366105f28201527f2e3237362d362e3235683131322e39363663332e343635203020362e323736206106128201527f322e37393820362e32373620362e32357a4d343937203535332e3831386330206106328201527f362e39323920352e3632382031322e3534362031322e3537312031322e3534366106528201527f6831333261362e323820362e323820302030203120362e32383620362e3237326106728201527f20362e323820362e32382030203020312d362e32383620362e323733682d31336106928201527f32632d362e39343320302d31322e35373120352e3631362d31322e35373120316106b28201527f322e3534364131322e35362031322e3536203020302030203530392e353731206106d28201527f363034683135302e38353863362e39343320302031322e3537312d352e3631366106f28201527f2031322e3537312d31322e353435762d3131322e393163302d362e3932382d356107128201527f2e3632382d31322e3534352d31322e3537312d31322e353435483530392e35376107328201527f31632d362e39343320302d31322e35373120352e3631372d31322e35373120316107528201527f322e3534357637352e3237337a6d33372e3731342d36322e373237632d362e396107728201527f343320302d31322e35373120352e3631372d31322e3537312031322e353435766107928201527f32352e303931633020362e39323920352e3632382031322e3534362031322e356107b28201527f37312031322e353436683130302e35373263362e39343320302031322e3537316107d28201527f2d352e3631372031322e3537312d31322e353436762d32352e30393163302d366107f28201527f2e3932382d352e3632382d31322e3534352d31322e3537312d31322e353435486108128201527f3533342e3731347a222066696c6c2d72756c653d226576656e6f646422202f3e6108328201527f3c2f673e3c2f7376673e0000000000000000000000000000000000000000000061085282015261085c01949350505050565b7f7b226e616d65223a20227761676d6920230000000000000000000000000000008152600083516125f28160118501602088016117b3565b7f222c2022696d616765223a2022646174613a696d6167652f7376672b786d6c3b6011918401918201527f6261736536342c00000000000000000000000000000000000000000000000000603182015283516126558160388401602088016117b3565b7f227d00000000000000000000000000000000000000000000000000000000000060389290910191820152603a01949350505050565b7f646174613a6170706c69636174696f6e2f6a736f6e3b6261736536342c0000008152600082516126c381601d8501602087016117b3565b91909101601d0192915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082821015612711576127116126d0565b500390565b60008219821115612729576127296126d0565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361275f5761275f6126d0565b5060010190565b60008261277557612775611aea565b500490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156127e1576127e16126d0565b500290565b600073ffffffffffffffffffffffffffffffffffffffff80871683528086166020840152508360408301526080606083015261282560808301846117df565b9695505050505050565b60006020828403121561284157600080fd5b81516117ac8161175e56fe4142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2fa26469706673582212201665a4f9111990d7529375848d3fd02c0121091a940da59e763eba826e7b077064736f6c634300080d0033',
  )
  expect(
    await getBytecode(publicClient, {
      address: wagmiContractConfig.address,
      blockNumber: forkBlockNumber,
    }),
  ).toBeDefined()
})
