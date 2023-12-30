import { ZHex } from '../../utils/ZHex.js'
import { Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'

export const PutContractCodeActionValidator = z.object({
	deployedBytecode: ZHex.describe('The deployed bytecode of the contract'),
	contractAddress: ZAddress.describe('The address of the contract'),
})
