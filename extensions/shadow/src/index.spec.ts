import { beforeEach, describe, expect, it } from 'vitest'
import { type Abi, callHandler, contractHandler, deployHandler, setAccountHandler } from '@tevm/actions'
import { type Contract, createContract, SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import type { TevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS, type Address, type Hex } from '@tevm/utils'
import { createSolc } from '@tevm/solc'

// POC: Shadow Contract Implementation
// This demonstrates combining a base contract with inline Solidity code,
// compiling the combined contract, and deploying it to the TEVM

// TODO: This is a mock that replaces the unimplemented whatsabi api
// TODO: Either the whatsabi api returns a contract instance AND the source code, either we add the
// source code to the contract type
const ethwhatsAbiHandler = (client: TevmNode) => {
	// Whatsabi handler would get the chain id, env variables for loaders
	return async (params: { address: Address }) => {
		return {
			contract: SimpleContract.withAddress(params.address),
			source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    uint256 private value;

    event ValueSet(uint256 newValue);

    constructor(uint256 initialValue) {
        value = initialValue;
    }

    function get() public view returns (uint256) {
        return value;
    }

    function set(uint256 newValue) public {
        value = newValue;
        emit ValueSet(newValue);
    }
}
`,
			// + metadata about the language, compiler, etc
		}
	}
}

// contract.withShadowView
// TODO: nice thing here is we can fully type the inline code
// TODO: ideally this is not async (just because of createSolc) and we lazy init and await only in first call
const withShadowView = async <TName extends string, THumanReadableAbi extends ReadonlyArray<string>>(
	contract: Contract<TName, THumanReadableAbi, Address, Hex, Hex>,
	{ source, inline }: { source: string; inline: string },
): Promise<Contract<TName, THumanReadableAbi, Address, Hex, Hex>> => {
	// 1. Merge the source code with the inline code
	const merged = mergeSolidityCode(source, inline)
	// 2. Compile the merged code
	const { abi, bytecode, deployedBytecode } = await compileSoliditySource(merged)
	// 3. Return a new contract instance with the new compiled code
	const shadowContract = createContract({
		name: 'ShadowContract',
		abi: abi,
		bytecode,
		deployedBytecode,
	}).withAddress(contract.address)

	return shadowContract as unknown as Contract<TName, THumanReadableAbi, Address, Hex, Hex>
}

/**
 * Merges base Solidity contract with additional inline code
 * Simple merging strategy: find the contract body and insert the inline code before the closing brace
 */
const mergeSolidityCode = (baseContract: string, inlineCode: string): string => {
	const cleanInlineCode = inlineCode.trim()
	// Find the last closing brace in the base contract
	const lastBraceIndex = baseContract.lastIndexOf('}')
	if (lastBraceIndex === -1) {
		throw new Error('Invalid base contract: no closing brace found')
	}

	// Insert the inline code before the closing brace
	return `${baseContract.slice(0, lastBraceIndex)}\n\n    // === Shadow Methods ===\n    ${cleanInlineCode.split('\n').join('\n    ')}\n\n${baseContract.slice(lastBraceIndex)}`
}

/**
 * Compiles a Solidity source string
 */
const compileSoliditySource = async (soliditySource: string): Promise<{ abi: Abi; bytecode: Hex; deployedBytecode: Hex }> => {
	// TODO: contract's version, language and optimizer settings come from whatsabi
	const solc = await createSolc('0.8.20')

	const output = solc.compile({
		language: 'Solidity',
		sources: {
			['ShadowContract.sol']: {
				content: soliditySource,
			},
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'],
				},
			},
		},
	})

	// Check for errors
	const errors = output.errors?.filter((e) => e.severity === 'error') || []
	if (errors.length > 0) {
		throw new Error(`Compilation failed: ${errors.map((e) => e.message).join(', ')}`)
	}

	// Extract the compiled contract
	const contract = output.contracts['ShadowContract.sol']?.['SimpleContract']
	if (!contract) {
		throw new Error(`Contract not found in compilation output`)
	}

	return {
		abi: contract.abi,
		bytecode: `0x${contract.evm.bytecode.object}`,
		deployedBytecode: `0x${contract.evm.deployedBytecode.object}`,
	}
}

const client = createTevmNode({loggingLevel: 'debug'})
describe('Shadow Contract POC', () => {
	let contractAddress: Address

	beforeEach(async () => {
		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(1n),
			addToBlockchain: true,
		})
		if (!createdAddress) throw new Error('Failed to deploy contract')
		contractAddress = createdAddress
	})

	it('should work', async () => {
		// Get the contract from whatsabi with an address
		const { contract, source } = await ethwhatsAbiHandler(client)({ address: contractAddress })

		// Create the shadow contract with additional inline code
		const shadowContract = await withShadowView(contract, {
			source,
			inline: `
function getDoubleValue() public view returns (uint256) {
    return value * 2;
}`,
		})

		// Set the account bytecode to the shadow contract
		const { errors } = await setAccountHandler(client)({
			address: contractAddress,
			deployedBytecode: shadowContract.deployedBytecode,
		})
		expect(errors).toBeUndefined()

		// @ts-expect-error - New shadow contract is not typed with the new inline methods
		const result = await contractHandler(client)(shadowContract.read.getDoubleValue())
		expect(result.data).toBe(2n)
	})
})
