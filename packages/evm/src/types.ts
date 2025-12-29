export type EvmRunCallOpts = {
  block?: any
  gasPrice?: bigint
  caller?: any
  gasLimit?: bigint
  to?: any
  blobVersionedHashes?: string[]
  value?: bigint
  data?: Uint8Array
  skipBalance?: boolean
}

export type ExecResult = {
  returnValue: Uint8Array
  executionGasUsed: bigint
  gasRefund?: bigint
  logs?: any[]
  createdAddresses?: Set<string>
  selfdestruct?: string[]
  exceptionError?: any
}

export type EvmResult = {
  execResult: ExecResult
}

