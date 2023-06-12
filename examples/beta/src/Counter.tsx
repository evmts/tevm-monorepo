import { Counter as CounterContract } from './contracts/Counter.sol'
import { useContractRead } from 'wagmi'

export const Counter = () => {
	const { data, error, isLoading, isSuccess } = useContractRead({
		...CounterContract.read.count(),
		// enabled: Boolean(address),
	})
	console.log({ data, error, isLoading, isSuccess })
	return <div>{data as any}</div>
}
