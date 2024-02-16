import { MOCKERC1155_ABI, MOCKERC1155_BYTECODE } from './constants.js'
import { createMemoryClient, parseEther } from 'tevm'

const caller = `0x${'1'.repeat(40)}` as const
const token = '0x171593d3E5Bc8A2E869600F951ed532B9780Cbd2'

/**
 * initialize a brand new tevm client and then execute a call with lots of storage requirements. This is similar to how one might use tevm in a serverless function where tevm is reinitialized often
 */
export const lotsOfMemoryAccess = async (rpcUrl: string, ids = [1, 10, 20]) => {
	const tevm = await createMemoryClient({ fork: { url: rpcUrl } })
	await tevm.setAccount({
		address: token,
		deployedBytecode: MOCKERC1155_BYTECODE,
	})
	const amounts = ids.map((id) => parseEther(`${id}`))
	return tevm.contract({
		caller,
		to: token,
		abi: MOCKERC1155_ABI,
		functionName: 'batchMint',
		args: [caller, ids, amounts],
		createTransaction: true,
		gas: BigInt(1_000_000_000),
	})
}
