import type { Chain, ClientConfig, TransportConfig } from 'viem'
import type { EIP1193RequestFn } from '@tevm/decorators'
import type { TevmNode } from '@tevm/node'

/**
 * A custom Transport implementation for viem that uses TEVM as its backend.
 * 
 * This transport enables viem clients to communicate with TEVM's in-memory EVM implementation,
 * providing a seamless interface between viem's API and TEVM's execution environment.
 * The transport handles converting between viem's request format and TEVM's internal API.
 *
 * @template TName - The name of the transport, defaults to string.
 * @template TChain - The blockchain configuration, extends Chain or undefined.
 */
export type TevmTransport<TName extends string = string> = <TChain extends Chain | undefined = Chain>({
  chain,
  pollingInterval,
  retryCount,
  timeout,
}: {
  chain?: TChain | undefined
  pollingInterval?: ClientConfig['pollingInterval'] | undefined
  retryCount?: TransportConfig['retryCount'] | undefined
  timeout?: TransportConfig['timeout'] | undefined
}) => {
  config: TransportConfig<TName>
  request: EIP1193RequestFn
  value: { tevm: TevmNode & { request: EIP1193RequestFn } }
}