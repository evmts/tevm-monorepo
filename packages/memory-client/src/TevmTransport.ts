import type { EIP1193RequestFn } from '@tevm/decorators'
import type { TevmNode } from '@tevm/node'
import type { Chain, ClientConfig, TransportConfig } from 'viem'

/**
 * A type representing a custom TEVM Transport for viem.
 *
 * @template TName - The name of the transport.
 * @template TChain - The blockchain configuration.
 *
 * @param {TevmTransportConfig} config - Transport configuration options.
 * @returns {Object} The configured TEVM transport.
 * @returns {TransportConfig<TName>} config - The transport configuration.
 * @returns {EIP1193RequestFn} request - The EIP-1193 request function.
 * @returns {Object} value - The transport value.
 * @returns {TevmNode & { request: EIP1193RequestFn }} value.tevm - The TEVM base client with the EIP-1193 request function.
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
