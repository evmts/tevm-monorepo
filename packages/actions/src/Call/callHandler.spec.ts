import { createAddress, createContractAddress } from '@tevm/address'
import { optimism } from '@tevm/common'
import { InvalidBytecodeError, MisconfiguredClientError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { SimpleContract, TestERC20, transports } from '@tevm/test-utils'
import {
	type Address,
	EthjsAddress,
	PREFUNDED_ACCOUNTS,
	decodeFunctionResult,
	encodeDeployData,
	encodeFunctionData,
	parseEther,
} from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { callHandler } from './callHandler.js'

const ERC20_ABI = TestERC20.abi
const ERC20_BYTECODE = TestERC20.deployedBytecode
describe('callHandler', () => {
	it('should execute a call using existing VM', async () => {
		const tevm = createTevmNode()
		const vm = await tevm.getVm()

		// we need to cache a block by triggering a transaction(this triggers the fork and caching)
		// an empty trasnaction will do (for cached state root)
		await vm.evm.runCall({
			gasLimit: 16784800n,
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
			data: Buffer.from(''),
			block: await vm.blockchain.getCanonicalHeadBlock(),
		})

		// try to execute a tracing request
		const result = await callHandler(tevm)({
			gas: 16784800n,
			data: '0x12' as `0x${string}`,
		})

		// make sure it used the provided or default parameters for gas
		expect(result.executionGasUsed).toBe(21002n)
		// We should have no logs on a blank execution
		expect(result.logs).toEqual([])
		// should provide a reasonable gas remaining
		expect(result.gas).toBe(29992797n)
		// We shoudn't have any created addresses or selfdestruct
		expect(result.selfdestruct).toEqual(new Set())
		expect(result.createdAddresses).toEqual(new Set())
		// callHandler should return the raw data from a call
		expect(result.rawData).toMatchInlineSnapshot('"0x"')
	})

	// This test added for coverage of throwing on fail
	it('should throw on a failed execution of runCall', async () => {
		const tevm = createTevmNode()
		const vm = await tevm.getVm()
		const originalRunCall = vm.evm.runCall
		// Here we mock a failed execution, where runCall throws
		vm.evm.runCall = async () => {
			throw new Error('VM execution failed')
		}
		// should throw on fail by default
		await expect(callHandler(tevm)({ gas: 16784800n })).rejects.toThrow()
		// restore runCall
		vm.evm.runCall = originalRunCall
	})

	// This test added for coverage of not throwing on fail
	it('should not throw if specified on a failed execution of runCall', async () => {
		const tevm = createTevmNode()
		const vm = await tevm.getVm()
		const originalRunCall = vm.evm.runCall
		// Here we mock a failed execution, where runCall throws
		vm.evm.runCall = async () => {
			throw new Error('VM execution failed')
		}
		// with a specific throwOnFail flag
		const result = await callHandler(tevm)({
			gas: 16784800n,
			throwOnFail: false,
		})
		expect(result.errors).toBeDefined()
		// restore runCall
		vm.evm.runCall = originalRunCall
	})

	it('should create a transaction if specified', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			createTransaction: true,
			data: '0x12' as `0x${string}`,
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.txHash).toBeDefined()
		expect(result.txHash).toMatchSnapshot()
	})

	it('should create a transaction with data if it would be a contract deployment', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			createTransaction: true,
			data: '0xbeef' as `0x${string}`,
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.txHash).toBeDefined()
		// should have the provided data
		expect(result.rawData).toMatchInlineSnapshot()
	})

	it('should fail on bytecode error ', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			// use the 'stack underflow bytecode'
			data: '0x5b' as `0x${string}`, // stack underflow
			throwOnFail: false,
		}
		const result = await callHandler(tevm)(callOpts)
		// should have appropriate errors
		expect(result.errors?.[0]).toBeInstanceOf(InvalidBytecodeError)
	})

	it('should create a transaction with value if provided', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			createTransaction: true,
			data: '0x' as `0x${string}`,
			value: 1000n,
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.txHash).toBeDefined()
		expect(result.txHash).toMatchSnapshot()
	})

	it('should create a transaction with nonce if provided', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			createTransaction: true,
			data: '0x' as `0x${string}`,
			nonce: 42n,
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.txHash).toBeDefined()
		expect(result.txHash).toMatchSnapshot()
	})

	it('should throw with a useful error if creating a transaction fails', async () => {
		const tevm = createTevmNode()
		const txPool = await tevm.getTxPool()
		// mock a failing txPool.addUnverified
		txPool.addUnverified = () => {
			throw new Error('Error adding transaction to pool')
		}

		const callOpts = {
			gas: 16784800n,
			createTransaction: true,
			data: '0x' as `0x${string}`,
		}
		// should throw on txPool.addUnverified failing
		await expect(callHandler(tevm)(callOpts)).rejects.toThrow('Error adding transaction to pool')
	})

	it('should provide a reasonable execution trace', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			data: '0x12' as `0x${string}`, // push1 0x12
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.executionGasUsed).toBe(21002n)
	})

	it('should override options if some sort of useLatestOptions is provided', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			data: '0x12' as `0x${string}`, // push1 0x12
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.executionGasUsed).toBe(21002n)
	})

	it('should use custom validation of call parameters', () => {
		expect(async () => {
			const tevm = createTevmNode()
			await callHandler(tevm)({
				gas: -1n, // Invalid gas value
			})
		}).rejects.toThrowError()
	})

	it('should work with EIP-1559 tx type params', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			data: '0x12' as `0x${string}`, // push1 0x12
			maxFeePerGas: 1000000000n,
			maxPriorityFeePerGas: 100000000n,
		}
		const result = await callHandler(tevm)(callOpts)
		// should have a tx hash for transactions
		expect(result.executionGasUsed).toBe(21002n)
	})

	it('should create an access list if specified', async () => {
		const tevm = createTevmNode()

		const callOpts = {
			gas: 16784800n,
			data: '0x3333333333333333333333333333333333333333' as `0x${string}`,
			createAccessList: true,
		} as const
		const result = await callHandler(tevm)(callOpts)
		// should have a created access list
		expect(result.accessList).toBeDefined()
		// check keys(storage slots) are available in accessList
		expect(Object.keys(result.accessList as Record<string, Set<string>>).length).toEqual(2)
		// check values(storage slots) are available in accessList
		const vals = Array.from(Object.values(result.accessList as Record<string, Set<string>>)).map((v) => Array.from(v))
		expect(vals.length).toEqual(2)
		expect(vals).toEqual([[], []])
	})

	it('should have useful result for contract deployment', async () => {
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const contractAddress = createContractAddress(from, 0n)
		const client = createTevmNode()

		// Deploy a contract and ensure it succeeded
		const { errors, createdAddress } = await callHandler(client)({
			createTransaction: true,
			from: PREFUNDED_ACCOUNTS[0].address,
			data: encodeDeployData(SimpleContract.deploy(42n)),
			gas: 10_000_000n,
		})
		expect(errors).toBeUndefined()
		expect(createdAddress).toEqual(contractAddress.toString())

		// Mine the block to include the transaction
		await mineHandler(client)()

		// Now verify the deployed contract works
		const result = await callHandler(client)({
			to: contractAddress.toString(),
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			}),
		})

		// Decode the result and check it matches our deployment argument
		const decodedResult = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: result.rawData,
		})
		expect(decodedResult).toEqual(42n)
	})

	it('should be able to call a contract', async () => {
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const client = createTevmNode()

		const erc20Address = `0x${'a'.repeat(40)}` as const
		await setAccountHandler(client)({
			address: erc20Address,
			deployedBytecode: TestERC20.deployedBytecode,
		})

		// Check initial balance
		const initialBalanceResult = await callHandler(client)({
			to: erc20Address,
			data: encodeFunctionData({
				abi: TestERC20.abi,
				functionName: 'balanceOf',
				args: [from.toString()],
			}),
		})

		const initialBalance = decodeFunctionResult({
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			data: initialBalanceResult.rawData,
		})
		expect(initialBalance).toEqual(0n)

		const mintAmount = 1000000000000000000n

		// Import dealHandler to deal tokens to the account
		const { dealHandler } = await import('../anvil/anvilDealHandler.js')

		// Use dealHandler to give ERC20 tokens to the account
		await dealHandler(client)({
			erc20: erc20Address,
			account: from.toString(),
			amount: mintAmount,
		})

		// Mine the block to include the transaction
		await mineHandler(client)()

		// Verify the balance was updated
		const newBalanceResult = await callHandler(client)({
			to: erc20Address,
			data: encodeFunctionData({
				abi: TestERC20.abi,
				functionName: 'balanceOf',
				args: [from.toString()],
			}),
		})

		const newBalance = decodeFunctionResult({
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			data: newBalanceResult.rawData,
		})
		expect(newBalance).toEqual(mintAmount)
	})

	it('should handle state overrides', async () => {
		const client = createTevmNode()
		const address = `0x${'42'.repeat(20)}` as `0x${string}`

		// Set up state override to give the address a balance
		const result = await callHandler(client)({
			stateOverrideSet: {
				[address]: {
					balance: parseEther('1000'),
				},
			},
			to: address,
		})

		expect(result.amountSpent).toBeDefined()
		expect(result.executionGasUsed).toBeDefined()
	})

	it('should return op stack info if forking', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 132675810n, // Updated to latest block as of Mar 2, 2025
			},
			common: optimism,
		})
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeUndefined()
		expect(result.l1Fee).toBeDefined()
		expect(result.l1BaseFee).toBeDefined()
		expect(result.l1BlobFee).toBeDefined()
		expect(result.l1GasUsed).toBeDefined()
		expect(result.l1Fee).toBeGreaterThan(0n)
		expect(result.l1BaseFee).toBeGreaterThan(0n)
		expect(result.l1BlobFee).toBeGreaterThan(0n)
		expect(result.l1GasUsed).toBeGreaterThan(0n)
	})

	it('should handle opstack throwing unexpectedly', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 132675810n, // Updated to latest block as of Mar 2, 2025
			},
			common: {
				...optimism,
				contracts: {
					...optimism.contracts,
					gasPriceOracle: {
						address: '0xbadaddress',
					},
				},
			},
		})
		const mockWarn = vi.fn()
		client.logger.warn = mockWarn
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(mockWarn.mock.calls).toHaveLength(1)
		expect(result.errors).toBeUndefined()
		expect(result.l1Fee).toBeUndefined()
		expect(result.l1BaseFee).toBeUndefined()
		expect(result.l1BlobFee).toBeUndefined()
		expect(result.l1GasUsed).toBeUndefined()
	})

	it('should handle vm cloning throwing unexpectedly', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 132675810n, // Updated to latest block as of Mar 2, 2025
			},
			common: {
				...optimism,
				contracts: {
					...optimism.contracts,
					gasPriceOracle: {
						address: '0xbadaddress',
					},
				},
			},
		})
		const vm = await client.getVm()
		vm.deepCopy = () => {
			throw new Error('Error cloning VM')
		}
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toHaveLength(1)
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle being unable to get options', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 132675810n, // Updated to latest block as of Mar 2, 2025
			},
			common: {
				...optimism,
				contracts: {
					...optimism.contracts,
					gasPriceOracle: {
						address: '0xbadaddress',
					},
				},
			},
		})
		const vm = await client.getVm()
		// this will break if something in callHandler calls getBlock first in future
		vm.blockchain.getBlock = () => {
			throw new Error('Error cloning VM')
		}
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			blockTag: 23n,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toHaveLength(1)
		expect(result.errors).toMatchSnapshot()
	})

	it('should submit a transaction and read the result with pending blockTag', async () => {
		const client = createTevmNode()
		const from = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)

		// Set up account with enough balance
		await setAccountHandler(client)({
			address: from.toString() as Address,
			balance: parseEther('1'),
			nonce: 0n,
		})

		const simpleContract = SimpleContract.withAddress(`0x${'42'.repeat(20)}` as const)
		const setValue = 42n

		// Deploy SimpleContract
		await setAccountHandler(client)({
			address: simpleContract.address,
			deployedBytecode: simpleContract.deployedBytecode,
		})

		// Send transaction to set value
		const setResult = await callHandler(client)({
			createTransaction: true,
			to: simpleContract.address,
			from: from.toString() as Address,
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [setValue],
			}),
			gas: 16784800n,
		})
		expect(setResult.txHash).toBeDefined()
		expect(setResult.txHash).toMatchSnapshot()

		// Check the result with pending blockTag
		const getResult = await callHandler(client)({
			to: simpleContract.address,
			blockTag: 'pending',
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			}),
		})

		expect(decodeFunctionResult({ functionName: 'get', abi: simpleContract.abi, data: getResult.rawData })).toBe(
			setValue,
		)

		// Mine the transaction and verify the state change
		await mineHandler(client)()
		const stateResult = await callHandler(client)({
			to: simpleContract.address,
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			}),
		})
		expect(stateResult.rawData).toBe(`0x${setValue.toString(16).padStart(64, '0')}`)
	})

	it('should be able to process pending transactions', async () => {
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const contractAddress = createContractAddress(from, 0n)
		const contract = SimpleContract.withAddress(contractAddress.toString())

		const client = createTevmNode()

		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: PREFUNDED_ACCOUNTS[0].address,
			data: encodeDeployData(SimpleContract.deploy(2n)),
			throwOnFail: false,
		})

		// deploy contract using transaction
		expect(deployResult).toEqual({
			amountSpent: 1117613n,
			createdAddress: createContractAddress(from, 0n).toString(),
			createdAddresses: new Set([contractAddress.toString()]),
			executionGasUsed: 98137n,
			gas: 29915941n,
			logs: [],
			rawData: SimpleContract.deployedBytecode,
			selfdestruct: new Set(),
			totalGasSpent: 159659n,
			txHash: '0x8f656a85084ae373ac42a63a2f2186e683107d753cd9509574f314f3c97b923e',
		})

		if (!deployResult.createdAddress) throw new Error('No created address')

		// cannot read from contract using latest because we haven't mined
		expect(
			await callHandler(client)({
				blockTag: 'latest',
				throwOnFail: false,
				...contract.read.get(),
			}),
		).toEqual({
			amountSpent: 147000n,
			executionGasUsed: 0n,
			// rawData is 0x because the contract hasn't been mined yet
			rawData: '0x',
			totalGasSpent: 21000n,
		})

		// can read from contract if we using pending though
		expect(
			await callHandler(client)({
				blockTag: 'pending',
				throwOnFail: false,
				data: encodeFunctionData(contract.read.get()),
				to: contract.address,
			}),
		).toEqual({
			// it works with pending tag
			rawData: '0x0000000000000000000000000000000000000000000000000000000000000002',
			amountSpent: 164472n,
			createdAddresses: new Set(),
			executionGasUsed: 2432n,
			gas: 29976504n,
			logs: [],
			selfdestruct: new Set(),
			totalGasSpent: 23496n,
		})

		// can also submit tx using pending
		expect(
			await callHandler(client)({
				blockTag: 'pending',
				throwOnFail: false,
				createTransaction: true,
				createAccessList: true,
				to: contract.address,
				data: encodeFunctionData(contract.write.set(42n)),
			}),
		).toEqual({
			amountSpent: 194488n,
			createdAddresses: new Set(),
			executionGasUsed: 6580n,
			gas: 29972216n,
			logs: [
				{
					address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
					data: '0x000000000000000000000000000000000000000000000000000000000000002a',
					topics: ['0x012c78e2b84325878b1bd9d250d772cfe5bda7722d795f45036fa5e1e6e303fc'],
				},
			],
			accessList: {
				'0x5fbdb2315678afecb367f032d93f642f64180aa3': new Set([
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				]),
			},
			preimages: {
				'0x44e659e60b21cc961f64ad47f20523c1d329d4bbda245ef3940a76dc89d0911b':
					'0x5fbdb2315678afecb367f032d93f642f64180aa3',
				'0x5380c7b7ae81a58eb98d9c78de4a1fd7fd9535fc953ed2be602daaa41767312a':
					'0x0000000000000000000000000000000000000000',
				'0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9':
					'0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
			},
			rawData: '0x',
			selfdestruct: new Set(),
			totalGasSpent: 27784n,
			txHash: '0x837ec20cf75b4fbac2da3b8efc547b9683af8afa5a54e9d2975b32224ea4ae86',
		})
	})

	it('should handle mining failing', async () => {
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const contractAddress = createContractAddress(from, 0n)
		const contract = SimpleContract.withAddress(contractAddress.toString())

		const client = createTevmNode()

		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: PREFUNDED_ACCOUNTS[0].address,
			data: encodeDeployData(SimpleContract.deploy(2n)),
			throwOnFail: false,
		})

		// deploy contract using transaction
		expect(deployResult).toEqual({
			amountSpent: 1117613n,
			createdAddress: createContractAddress(from, 0n).toString(),
			createdAddresses: new Set([contractAddress.toString()]),
			executionGasUsed: 98137n,
			gas: 29915941n,
			logs: [],
			rawData: SimpleContract.deployedBytecode,
			selfdestruct: new Set(),
			totalGasSpent: 159659n,
			txHash: '0x8f656a85084ae373ac42a63a2f2186e683107d753cd9509574f314f3c97b923e',
		})

		if (!deployResult.createdAddress) throw new Error('No created address')

		// make it so an error happens while mining
		const originalDeepCopy = client.deepCopy.bind(client)
		;(client as any).deepCopy = async () => {
			const copy = await originalDeepCopy()
			return {
				...copy,
				// This will cause the mine handler to throw an error for not being ready
				status: 'SYNCING',
			}
		}

		const { errors } = await callHandler(client)({
			blockTag: 'pending',
			throwOnFail: false,
			...contract.read.get(),
			to: contract.address,
		})
		expect(errors?.[0]).toBeInstanceOf(MisconfiguredClientError)
		expect(errors).toMatchSnapshot()
	})
})
