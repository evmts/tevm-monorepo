export const artifacts = {
  "solcInput": {
    "language": "Solidity",
    "sources": {
      "/path/to/SimpleContract.s.sol": {
        "content": "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.17;\n\ncontract SimpleContract {\n    uint256 public value;\n\n    function set(uint256 _value) public {\n        value = _value;\n    }\n\n    function get() public view returns (uint256) {\n        return value;\n    }\n}\n"
      }
    },
    "settings": {
      "outputSelection": {
        "*": {
          "*": [
            "abi",
            "userdoc",
            "evm.bytecode.object",
            "evm.deployedBytecode.object"
          ]
        }
      }
    }
  },
  "solcOutput": {
    "contracts": {
      "/path/to/SimpleContract.s.sol": {
        "SimpleContract": {
          "abi": [
            {
              "inputs": [],
              "name": "get",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_value",
                  "type": "uint256"
                }
              ],
              "name": "set",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "value",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          "evm": {
            "bytecode": {
              "object": "6080604052348015600e575f5ffd5b506101718061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c80633fa4f2451461004357806360fe47b1146100615780636d4ce63c1461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea264697066735822122099677513cae886542da0be81c22d503f01e1d285bf96454ad9d85b9e144d7cc364736f6c634300081c0033"
            },
            "deployedBytecode": {
              "object": "608060405234801561000f575f5ffd5b506004361061003f575f3560e01c80633fa4f2451461004357806360fe47b1146100615780636d4ce63c1461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea264697066735822122099677513cae886542da0be81c22d503f01e1d285bf96454ad9d85b9e144d7cc364736f6c634300081c0033"
            }
          },
          "userdoc": {
            "kind": "user",
            "methods": {},
            "version": 1
          }
        }
      }
    },
    "sources": {
      "/path/to/SimpleContract.s.sol": {
        "id": 0
      }
    }
  },
  "artifacts": {
    "SimpleContract": {
      "contractName": "SimpleContract",
      "abi": [
        {
          "inputs": [],
          "name": "get",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "set",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "value",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      "userdoc": {
        "kind": "user",
        "methods": {},
        "version": 1
      },
      "evm": {
        "bytecode": {
          "object": "6080604052348015600e575f5ffd5b506101718061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c80633fa4f2451461004357806360fe47b1146100615780636d4ce63c1461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea264697066735822122099677513cae886542da0be81c22d503f01e1d285bf96454ad9d85b9e144d7cc364736f6c634300081c0033"
        },
        "deployedBytecode": {
          "object": "608060405234801561000f575f5ffd5b506004361061003f575f3560e01c80633fa4f2451461004357806360fe47b1146100615780636d4ce63c1461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea264697066735822122099677513cae886542da0be81c22d503f01e1d285bf96454ad9d85b9e144d7cc364736f6c634300081c0033"
        }
      }
    }
  },
  "modules": {
    "/path/to/SimpleContract.s.sol": {
      "id": "/path/to/SimpleContract.s.sol",
      "rawCode": "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.17;\n\ncontract SimpleContract {\n    uint256 public value;\n\n    function set(uint256 _value) public {\n        value = _value;\n    }\n\n    function get() public view returns (uint256) {\n        return value;\n    }\n}\n",
      "importedIds": [],
      "code": "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.17;\n\ncontract SimpleContract {\n    uint256 public value;\n\n    function set(uint256 _value) public {\n        value = _value;\n    }\n\n    function get() public view returns (uint256) {\n        return value;\n    }\n}\n"
    }
  }
} as const