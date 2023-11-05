import { hexToBytes, type Address, type Hex } from "viem"
import { Address as EthjsAddress } from "@ethereumjs/util"
import type { EVMts } from "../evmts.js"

export type RunCallParameters = {
  to: Address,
  caller: Address,
  origin: Address,
  gasLimit?: bigint,
  data: Hex,
  value?: bigint,
}

/**
 * Executes a call on the vm
 */
export const runCall = async (
  evmts: EVMts,
  options: RunCallParameters,
) => {
  return evmts.evm.runCall({
    to: new EthjsAddress(hexToBytes(options.to)),
    caller: new EthjsAddress(hexToBytes(options.caller)),
    origin: new EthjsAddress(hexToBytes(options.origin)),
    gasLimit: options.gasLimit ?? BigInt("0xfffffffffffffff"),
    data: Buffer.from(options.data.slice(2), 'hex'),
    value: options.value ?? 0n
  })
}
