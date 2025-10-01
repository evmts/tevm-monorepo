import { useEffect, useState } from 'react'

export const useCounter = (max: number) => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCount((c) => (c >= max ? c : c + 1))
		}, 50)

		return () => clearInterval(timer)
	}, [max])

	return { count }
}
