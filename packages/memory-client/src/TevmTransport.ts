import type { BaseClient } from '@tevm/base-client'
import type { EIP1193RequestFn } from '@tevm/decorators'
import type { Chain, ClientConfig, TransportConfig } from 'viem'

export type TevmTransport<TName extends string = string> = {
	tevm: BaseClient & { request: EIP1193RequestFn }
} & (<TChain extends Chain | undefined = Chain>({
	chain,
}: {
	chain?: TChain | undefined
	pollingInterval?: ClientConfig['pollingInterval'] | undefined
	retryCount?: TransportConfig['retryCount'] | undefined
	timeout?: TransportConfig['timeout'] | undefined
}) => {
	config: TransportConfig<TName>
	request: EIP1193RequestFn
	value: { tevm: BaseClient & { request: EIP1193RequestFn } }
})
