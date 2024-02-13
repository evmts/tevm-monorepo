import { createMemoryClient } from '../createMemoryClient.js'
import { describe, expect, it } from 'bun:test'

// test case from minimal repro here : https://github.com/0xpolarzero/tevm-minimal-repro/blob/main/constants.ts

// See https://sepolia.etherscan.io/address/0x1823FbFF49f731061E8216ad2467112C0469cBFD#code
export const MOCKERC20_BYTECODE =
	'0x608060405234801561001057600080fd5b50600436106100cf5760003560e01c806340c10f191161008c57806395d89b411161006657806395d89b41146101ba578063a9059cbb146101d9578063d505accf146101ec578063dd62ed3e146101ff57600080fd5b806340c10f191461015957806370a082311461016e5780637ecebe001461019457600080fd5b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461011557806323b872dd1461012f578063313ce567146101425780633644e51514610151575b600080fd5b6100dc610228565b6040516100e9919061066a565b60405180910390f35b6101056101003660046106d4565b61024b565b60405190151581526020016100e9565b6805345cdf77eb68f44c545b6040519081526020016100e9565b61010561013d3660046106fe565b61029e565b604051601281526020016100e9565b61012161035c565b61016c6101673660046106d4565b6103d9565b005b61012161017c36600461073a565b6387a211a2600c908152600091909152602090205490565b6101216101a236600461073a565b6338377508600c908152600091909152602090205490565b60408051808201909152600381526204d32360ec1b60208201526100dc565b6101056101e73660046106d4565b6103e7565b61016c6101fa36600461075c565b610462565b61012161020d3660046107cf565b602052637f5e9f20600c908152600091909152603490205490565b60408051808201909152600981526804d6f636b45524332360bc1b602082015290565b600082602052637f5e9f20600c5233600052816034600c205581600052602c5160601c337f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560206000a350600192915050565b60008360601b33602052637f5e9f208117600c526034600c20805460018101156102de57808511156102d8576313be252b6000526004601cfd5b84810382555b50506387a211a28117600c526020600c208054808511156103075763f4d678b86000526004601cfd5b84810382555050836000526020600c208381540181555082602052600c5160601c8160601c7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a3505060019392505050565b600080610367610228565b8051906020012090506040517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81528160208201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604082015246606082015230608082015260a081209250505090565b6103e382826105eb565b5050565b60006387a211a2600c52336000526020600c208054808411156104125763f4d678b86000526004601cfd5b83810382555050826000526020600c208281540181555081602052600c5160601c337fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a350600192915050565b600061046c610228565b8051906020012090508442111561048b57631a15a3cc6000526004601cfd5b6040518860601b60601c98508760601b60601c975065383775081901600e52886000526020600c2080547f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f83528360208401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604084015246606084015230608084015260a08320602e527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c983528a60208401528960408401528860608401528060808401528760a084015260c08320604e526042602c206000528660ff1660205285604052846060526020806080600060015afa8b3d51146105975763ddafbaef6000526004601cfd5b0190556303faf4f960a51b88176040526034602c2087905587897f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925602060608501a360405250506000606052505050505050565b6805345cdf77eb68f44c548181018181101561060f5763e5cfe9576000526004601cfd5b806805345cdf77eb68f44c5550506387a211a2600c52816000526020600c208181540181555080602052600c5160601c60007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a35050565b600060208083528351808285015260005b818110156106975785810183015185820160400152820161067b565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146106cf57600080fd5b919050565b600080604083850312156106e757600080fd5b6106f0836106b8565b946020939093013593505050565b60008060006060848603121561071357600080fd5b61071c846106b8565b925061072a602085016106b8565b9150604084013590509250925092565b60006020828403121561074c57600080fd5b610755826106b8565b9392505050565b600080600080600080600060e0888a03121561077757600080fd5b610780886106b8565b965061078e602089016106b8565b95506040880135945060608801359350608088013560ff811681146107b257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156107e257600080fd5b6107eb836106b8565b91506107f9602084016106b8565b9050925092905056fea26469706673582212204aefe49a90febe3d6555adfa8ada1e9c46ee52718d61d970224810e1d866d3fb64736f6c63430008140033'
export const MOCKERC20_ABI = [
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
		inputs: [
			{ internalType: 'address', name: '_to', type: 'address' },
			{ internalType: 'uint256', name: '_amount', type: 'uint256' },
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
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
]

describe('Testing tevm state managers with mix of createTransaction: true and false', () => {
	describe('SHould be able to run some calls using createTransaction: true and then run a createTransaction: false', async () => {
		const caller = `0x${'1'.repeat(40)}` as const
		// Create client
		const forkClient = await createMemoryClient({
			fork: {
				url: 'https://mainnet.optimism.io',
			},
		})

		const normalClient = await createMemoryClient()
		const proxyClient = await createMemoryClient({
			proxy: { url: 'https://mainnet.optimism.io' },
		})
		const clients = {
			forkClient,
			normalClient,
			proxyClient,
		}

		for (const clientName in clients) {
			const client =
				clients[clientName as 'forkClient' | 'normalClient' | 'proxyClient']
			it(`Should properly track state with a ${clientName}`, async () => {
				// Set the token contract
				const token = '0x1823FbFF49f731061E8216ad2467112C0469cBFD'
				expect(
					await client.setAccount({
						address: token,
						deployedBytecode: MOCKERC20_BYTECODE,
					}),
				).toEqual({})

				const amount = BigInt(1e18)
				// Mint tokens
				const { errors: mintErrors } = await client.contract({
					caller,
					to: token,
					abi: MOCKERC20_ABI,
					functionName: 'mint',
					args: [caller, amount],
					createTransaction: true,
				})
				expect(mintErrors).toBeUndefined()

				// Check balance of caller
				const { data: balanceIncluded, errors: contractErrors } =
					await client.contract({
						caller,
						to: token,
						abi: MOCKERC20_ABI,
						functionName: 'balanceOf',
						args: [caller],
						createTransaction: true,
					})

				expect(contractErrors).toBeUndefined()
				expect(balanceIncluded).toBe(amount)

				const { data: balanceNotIncluded, errors: contractErrors2 } =
					await client.contract({
						caller,
						to: token,
						abi: MOCKERC20_ABI,
						functionName: 'balanceOf',
						args: [caller],
						// createTransaction: true,
					})

				expect(contractErrors2).toBeUndefined()
				expect(balanceNotIncluded).toBe(amount)
			})
		}
	})
})
