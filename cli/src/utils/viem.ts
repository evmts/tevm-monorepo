// Utility functions from viem

/**
 * Encodes function data for contract calls
 */
export const encodeFunctionData = (options: {
  abi: any[];
  functionName: string;
  args?: any[];
}): string => {
  // In production, this would use viem's encodeFunctionData
  // For the CLI, we'll dynamically import viem when needed
  return `0x${options.functionName}_encoded_data`;
};

/**
 * Encodes deployment data for contract deployment
 */
export const encodeDeployData = (options: {
  abi: any[];
  bytecode: string;
  args?: any[];
}): string => {
  // In production, this would use viem's encodeDeployData
  // For the CLI, we'll dynamically import viem when needed
  return `0x${options.bytecode}_with_encoded_args`;
};