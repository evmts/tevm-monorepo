import { Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'
import { ZHex } from '../../utils/ZHex.js'

export const PutContractCodeActionValidator = z.object({
	deployedBytecode: ZHex.describe('The deployed bytecode of the contract'),
	contractAddress: ZAddress.describe('The address of the contract'),
})
