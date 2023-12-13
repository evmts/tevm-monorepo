import { ZHex } from '../../utils/ZHex.js'
import { Abi as ZAbi, Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'

export const RunScriptActionValidator = z
	.object({
		deployedBytecode: ZHex.describe('The deployed bytecode of the contract'),
		caller: ZAddress.optional().describe('The address of the caller'),
		args: z
			.array(z.any())
			.optional()
			.describe('The arguments to pass to the function'),
		abi: ZAbi.describe('The abi of the contract'),
		functionName: z.string().describe('The name of the function to call'),
	})
	.describe('Action to run a script or contract')
