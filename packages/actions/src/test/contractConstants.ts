/* -------------------------------------------------------------------------- */
/*                                 MOCK ERC20                                 */
/* -------------------------------------------------------------------------- */

// See https://sepolia.etherscan.io/address/0x1823FbFF49f731061E8216ad2467112C0469cBFD#code
export const MOCKERC20_BYTECODE =
	'0x608060405234801561001057600080fd5b50600436106100cf5760003560e01c806340c10f191161008c57806395d89b411161006657806395d89b41146101ba578063a9059cbb146101d9578063d505accf146101ec578063dd62ed3e146101ff57600080fd5b806340c10f191461015957806370a082311461016e5780637ecebe001461019457600080fd5b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461011557806323b872dd1461012f578063313ce567146101425780633644e51514610151575b600080fd5b6100dc610228565b6040516100e9919061066a565b60405180910390f35b6101056101003660046106d4565b61024b565b60405190151581526020016100e9565b6805345cdf77eb68f44c545b6040519081526020016100e9565b61010561013d3660046106fe565b61029e565b604051601281526020016100e9565b61012161035c565b61016c6101673660046106d4565b6103d9565b005b61012161017c36600461073a565b6387a211a2600c908152600091909152602090205490565b6101216101a236600461073a565b6338377508600c908152600091909152602090205490565b60408051808201909152600381526204d32360ec1b60208201526100dc565b6101056101e73660046106d4565b6103e7565b61016c6101fa36600461075c565b610462565b61012161020d3660046107cf565b602052637f5e9f20600c908152600091909152603490205490565b60408051808201909152600981526804d6f636b45524332360bc1b602082015290565b600082602052637f5e9f20600c5233600052816034600c205581600052602c5160601c337f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560206000a350600192915050565b60008360601b33602052637f5e9f208117600c526034600c20805460018101156102de57808511156102d8576313be252b6000526004601cfd5b84810382555b50506387a211a28117600c526020600c208054808511156103075763f4d678b86000526004601cfd5b84810382555050836000526020600c208381540181555082602052600c5160601c8160601c7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a3505060019392505050565b600080610367610228565b8051906020012090506040517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81528160208201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604082015246606082015230608082015260a081209250505090565b6103e382826105eb565b5050565b60006387a211a2600c52336000526020600c208054808411156104125763f4d678b86000526004601cfd5b83810382555050826000526020600c208281540181555081602052600c5160601c337fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a350600192915050565b600061046c610228565b8051906020012090508442111561048b57631a15a3cc6000526004601cfd5b6040518860601b60601c98508760601b60601c975065383775081901600e52886000526020600c2080547f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f83528360208401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604084015246606084015230608084015260a08320602e527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c983528a60208401528960408401528860608401528060808401528760a084015260c08320604e526042602c206000528660ff1660205285604052846060526020806080600060015afa8b3d51146105975763ddafbaef6000526004601cfd5b0190556303faf4f960a51b88176040526034602c2087905587897f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925602060608501a360405250506000606052505050505050565b6805345cdf77eb68f44c548181018181101561060f5763e5cfe9576000526004601cfd5b806805345cdf77eb68f44c5550506387a211a2600c52816000526020600c208181540181555080602052600c5160601c60007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a35050565b600060208083528351808285015260005b818110156106975785810183015185820160400152820161067b565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146106cf57600080fd5b919050565b600080604083850312156106e757600080fd5b6106f0836106b8565b946020939093013593505050565b60008060006060848603121561071357600080fd5b61071c846106b8565b925061072a602085016106b8565b9150604084013590509250925092565b60006020828403121561074c57600080fd5b610755826106b8565b9392505050565b600080600080600080600060e0888a03121561077757600080fd5b610780886106b8565b965061078e602089016106b8565b95506040880135945060608801359350608088013560ff811681146107b257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156107e257600080fd5b6107eb836106b8565b91506107f9602084016106b8565b9050925092905056fea26469706673582212204aefe49a90febe3d6555adfa8ada1e9c46ee52718d61d970224810e1d866d3fb64736f6c63430008140033'
export const MOCKERC20_ABI = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{ inputs: [], name: 'AllowanceOverflow', type: 'error' },
	{ inputs: [], name: 'AllowanceUnderflow', type: 'error' },
	{ inputs: [], name: 'InsufficientAllowance', type: 'error' },
	{ inputs: [], name: 'InsufficientBalance', type: 'error' },
	{ inputs: [], name: 'InvalidPermit', type: 'error' },
	{ inputs: [], name: 'PermitExpired', type: 'error' },
	{ inputs: [], name: 'TotalSupplyOverflow', type: 'error' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [],
		name: 'DOMAIN_SEPARATOR',
		outputs: [{ internalType: 'bytes32', name: 'result', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '_to', type: 'address' },
			{ internalType: 'uint256', name: '_amount', type: 'uint256' },
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'nonces',
		outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' },
		],
		name: 'permit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const

/* -------------------------------------------------------------------------- */
/*                                MOCK ERC1155                                */
/* -------------------------------------------------------------------------- */

// See https://sepolia.etherscan.io/address/0x171593d3E5Bc8A2E869600F951ed532B9780Cbd2#code
export const MOCKERC1155_BYTECODE =
	'0x608060405234801561001057600080fd5b50600436106100925760003560e01c80632eb2c2d6116100665780632eb2c2d6146101755780634e1273f414610188578063a22cb465146101a8578063e985e9c5146101bb578063f242432a146101e757600080fd5b8062fdd58e1461009757806301ffc9a7146100d75780630ca83480146101175780630e89341c1461012c575b600080fd5b6100c46100a536600461085c565b679a31110384e0b0c96020526014919091526000908152604090205490565b6040519081526020015b60405180910390f35b6101076100e5366004610886565b6301ffc9a760e09190911c90811463d9b67a26821417630e89341c9091141790565b60405190151581526020016100ce565b61012a610125366004610968565b6101fa565b005b61016861013a3660046109dc565b5060408051808201909152601381527268747470733a2f2f6578616d706c652e636f6d60681b602082015290565b6040516100ce91906109f5565b61012a610183366004610ad1565b61021a565b61019b610196366004610b8c565b610436565b6040516100ce9190610bf8565b61012a6101b6366004610c3c565b6104a6565b6101076101c9366004610c78565b679a31110384e0b0c96020526014919091526000526034600c205490565b61012a6101f5366004610cab565b6104fc565b61021583838360405180602001604052806000815250610666565b505050565b82851461022f57633b800a466000526004601cfd5b8760601b679a31110384e0b0c9178760601b679a31110384e0b0c917816020528160601c99508060601c98508861026e5763ea553b346000526004601cfd5b89331461029157336000526034600c205461029157634b6e7f186000526004601cfd5b8660051b5b8015610303576020810390508087013583602052818a013560005260406000208054808311156102ce5763f4d678b86000526004601cfd5b8290039055602083905260406000208054808301818110156102f8576301336cea6000526004601cfd5b909155506102969050565b505050604051604081528560051b602001604082018160208a03823781604001602084015281602088038383013750888a337f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb60408586010186a45050610368600090565b1561037d5761037d888888888888888861077f565b863b1561042c578660005260405163bc197c81815233602082015288604082015260a060608201528560051b60200160c082018160208a0382378160a001806080850152826020890384840137820160a084015260208401601f19860183800183013750808101830160c401905060208282601c8501600080515af161040c573d1561040c573d6000833e3d82fd5b50805163bc197c8160e01b1461042a57639c05499b6000526004601cfd5b505b5050505050505050565b606083821461044d57633b800a466000526004601cfd5b6040519050818152602081018260051b8181016040525b801561049c57602081039050808701358060601b679a31110384e0b0c917602052508085013560005260406000205481830152610464565b5050949350505050565b8015159050679a31110384e0b0c96020523360145281600052806034600c2055806000528160601b60601c337f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3160206000a35050565b8560601b679a31110384e0b0c9178560601b679a31110384e0b0c917816020528160601c97508060601c96508661053b5763ea553b346000526004601cfd5b87331461055e57336000526034600c205461055e57634b6e7f186000526004601cfd5b85600052604060002091508154808611156105815763f4d678b86000526004601cfd5b85810383555080602052604060002091508154858101818110156105ad576301336cea6000526004601cfd5b909255505060208390528486337fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6260406000a4843b1561065e5760405163f23a6e61815233602082015286604082015284606082015283608082015260a080820152816020016020840360c08301376020818360c401601c840160008a5af161063f573d1561063f573d6000823e3d81fd5b805163f23a6e6160e01b1461065c57639c05499b6000526004601cfd5b505b505050505050565b815183511461067d57633b800a466000526004601cfd5b8360601b806106945763ea553b346000526004601cfd5b80679a31110384e0b0c917602052835160051b5b80156106e757808401518186015160005260406000208054828101818110156106d9576301336cea6000526004601cfd5b9091555050601f19016106a8565b5060405160408152845160051b602001604082018181838960045afa503d60400160208401523d81019050855160051b60200191508181838860045afa50823d8201039150508260601c6000337f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8486a4505050610763600090565b50833b1561077957610779600085858585610784565b50505050565b61042c565b60405163bc197c8181523360208201528560601b60601c604082015260a06060820152835160051b60200160c082018181838860045afa503d60a0018060808501523d82019150855160051b60200192508282848860045afa503d0160a0840152835160200191503d018181818660045afa50601c83013d82010391505060208282601c850160008a5af1610822573d15610822573d6000833e3d82fd5b50805163bc197c8160e01b1461065e57639c05499b6000526004601cfd5b80356001600160a01b038116811461085757600080fd5b919050565b6000806040838503121561086f57600080fd5b61087883610840565b946020939093013593505050565b60006020828403121561089857600080fd5b81356001600160e01b0319811681146108b057600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126108de57600080fd5b8135602067ffffffffffffffff808311156108fb576108fb6108b7565b8260051b604051601f19603f83011681018181108482111715610920576109206108b7565b60405293845285810183019383810192508785111561093e57600080fd5b83870191505b8482101561095d57813583529183019190830190610944565b979650505050505050565b60008060006060848603121561097d57600080fd5b61098684610840565b9250602084013567ffffffffffffffff808211156109a357600080fd5b6109af878388016108cd565b935060408601359150808211156109c557600080fd5b506109d2868287016108cd565b9150509250925092565b6000602082840312156109ee57600080fd5b5035919050565b600060208083528351808285015260005b81811015610a2257858101830151858201604001528201610a06565b506000604082860101526040601f19601f8301168501019250505092915050565b60008083601f840112610a5557600080fd5b50813567ffffffffffffffff811115610a6d57600080fd5b6020830191508360208260051b8501011115610a8857600080fd5b9250929050565b60008083601f840112610aa157600080fd5b50813567ffffffffffffffff811115610ab957600080fd5b602083019150836020828501011115610a8857600080fd5b60008060008060008060008060a0898b031215610aed57600080fd5b610af689610840565b9750610b0460208a01610840565b9650604089013567ffffffffffffffff80821115610b2157600080fd5b610b2d8c838d01610a43565b909850965060608b0135915080821115610b4657600080fd5b610b528c838d01610a43565b909650945060808b0135915080821115610b6b57600080fd5b50610b788b828c01610a8f565b999c989b5096995094979396929594505050565b60008060008060408587031215610ba257600080fd5b843567ffffffffffffffff80821115610bba57600080fd5b610bc688838901610a43565b90965094506020870135915080821115610bdf57600080fd5b50610bec87828801610a43565b95989497509550505050565b6020808252825182820181905260009190848201906040850190845b81811015610c3057835183529284019291840191600101610c14565b50909695505050505050565b60008060408385031215610c4f57600080fd5b610c5883610840565b915060208301358015158114610c6d57600080fd5b809150509250929050565b60008060408385031215610c8b57600080fd5b610c9483610840565b9150610ca260208401610840565b90509250929050565b60008060008060008060a08789031215610cc457600080fd5b610ccd87610840565b9550610cdb60208801610840565b94506040870135935060608701359250608087013567ffffffffffffffff811115610d0557600080fd5b610d1189828a01610a8f565b979a969950949750929593949250505056fea2646970667358221220fd08d6cd1f4bcc931aa8f300838d6368c085f293017eee5f0d03b5e68a3e259764736f6c63430008140033'

export const MOCKERC1155_ABI = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{ inputs: [], name: 'AccountBalanceOverflow', type: 'error' },
	{ inputs: [], name: 'ArrayLengthsMismatch', type: 'error' },
	{ inputs: [], name: 'InsufficientBalance', type: 'error' },
	{ inputs: [], name: 'NotOwnerNorApproved', type: 'error' },
	{
		inputs: [],
		name: 'TransferToNonERC1155ReceiverImplementer',
		type: 'error',
	},
	{ inputs: [], name: 'TransferToZeroAddress', type: 'error' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'isApproved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'ids',
				type: 'uint256[]',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: 'amounts',
				type: 'uint256[]',
			},
		],
		name: 'TransferBatch',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'TransferSingle',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: 'string', name: 'value', type: 'string' },
			{ indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
		],
		name: 'URI',
		type: 'event',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'uint256', name: 'id', type: 'uint256' },
		],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address[]', name: 'owners', type: 'address[]' },
			{ internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
		],
		name: 'balanceOfBatch',
		outputs: [
			{ internalType: 'uint256[]', name: 'balances', type: 'uint256[]' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '_to', type: 'address' },
			{ internalType: 'uint256[]', name: '_ids', type: 'uint256[]' },
			{ internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
		],
		name: 'batchMint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'operator', type: 'address' },
		],
		name: 'isApprovedForAll',
		outputs: [{ internalType: 'bool', name: 'result', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
			{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
		],
		name: 'safeBatchTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'id', type: 'uint256' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'operator', type: 'address' },
			{ internalType: 'bool', name: 'isApproved', type: 'bool' },
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
		name: 'supportsInterface',
		outputs: [{ internalType: 'bool', name: 'result', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'uri',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'pure',
		type: 'function',
	},
] as const

/* -------------------------------------------------------------------------- */
/*                              AIRDROP CONTRACT                              */
/* -------------------------------------------------------------------------- */

export const GASLITEDROP_ADDRESS = '0x09350F89e2D7B6e96bA730783c2d76137B045FEF'
export const GASLITEDROP_ABI = [
	{
		inputs: [
			{ internalType: 'address', name: '_token', type: 'address' },
			{
				internalType: 'address[]',
				name: '_addresses',
				type: 'address[]',
			},
			{ internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
			{ internalType: 'uint256', name: '_totalAmount', type: 'uint256' },
		],
		name: 'airdropERC20',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
] as const
