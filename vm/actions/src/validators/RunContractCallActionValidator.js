import { Abi as ZAbi, Address as ZAddress } from 'abitype/zod'
import { z } from 'zod'

export const RunContractCallActionValidator = z.object({
  abi: ZAbi.describe('The abi of the contract'),
  args: z
    .array(z.any())
    .optional()
    .describe('The arguments to pass to the function'),
  functionName: z
    .string()
    .optional()
    .describe('The name of the function to call'),
  caller: ZAddress.optional().describe('The address of the caller'),
  contractAddress: ZAddress.describe('The address of the contract'),
  gasLimit: z.bigint().optional().describe('The gas limit'),
})
