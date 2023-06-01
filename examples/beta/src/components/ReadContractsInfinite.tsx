import { paginatedIndexesConfig, useContractInfiniteReads } from 'wagmi'

import { stringify } from '../utils/stringify'
import { wagmiContractConfig } from './contracts'

export function ReadContractsInfinite() {
	const { data, isLoading, isSuccess, fetchNextPage } =
		useContractInfiniteReads({
			cacheKey: 'lootTokenURIs',
			...paginatedIndexesConfig(
				(index: number) => [
					{
						...wagmiContractConfig,
						functionName: 'ownerOf',
						args: [BigInt(index)] as const,
					},
				],
				{ start: 0, perPage: 10, direction: 'increment' },
			),
		})

	return (
		<div>
			{isLoading && <div>loading...</div>}
			{isSuccess && (
				<>
					{data?.pages.map((data, i) => (
						<div key={i}>
							{data.flatMap((x) => (
								<pre key={stringify(x)}>{stringify(x)}</pre>
							))}
						</div>
					))}
					<button type='button' onClick={() => fetchNextPage()}>
						Fetch more
					</button>
				</>
			)}
		</div>
	)
}
