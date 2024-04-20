import { useEffect, useState } from 'react'

export const useCounter = (n: number) => {
	const [count, setCount] = useState(0)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const intervalId = setInterval(() => {
			setCount((currentCount) => currentCount + 1)
		}, 50)
		return () => clearInterval(intervalId)
	}, [count, n])
	return { count, isRunning: count < n }
}
