import { type FC, useEffect, useState } from 'react'

type ElapsedTimeProps = {
	start: number
	end?: number
	prefix?: string
	suffix?: string
}

/**
 * @notice A component to display the elapsed time between two timestamps
 * @dev If no end is provided, the current time will be used; this will be updated in real-time
 * @param start The start timestamp
 * @param end The end timestamp (default to now)
 * @param prefix A prefix to display before the elapsed time (optional)
 * @param suffix A suffix to display after the elapsed time (optional)
 */
const ElapsedTime: FC<ElapsedTimeProps> = ({ start, end, prefix, suffix }) => {
	const [elapsed, setElapsed] = useState<number>(end ? end - start : Date.now() - start)

	const seconds = Math.floor(elapsed / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)
	const months = Math.floor(days / 30)
	const years = Math.floor(months / 12)

	// Update the elapsed time in real-time
	useEffect(() => {
		if (!end) {
			const interval = setInterval(() => {
				setElapsed(Date.now() - start)
			}, 1000)
			return () => clearInterval(interval)
		}
	}, [start, end])

	if (Number.isNaN(elapsed)) {
		return null
	}

	if (end && end < start) {
		throw new Error('The end timestamp must be greater than the start timestamp')
	}

	return (
		<>
			{prefix ? `${prefix} ` : ''}
			{years > 0
				? `${years} year${years > 1 ? 's' : ''}`
				: months > 0
					? `${months} month${months > 1 ? 's' : ''}`
					: days > 0
						? `${days} day${days > 1 ? 's' : ''}`
						: hours > 0
							? `${hours} hour${hours > 1 ? 's' : ''}`
							: minutes > 0
								? `${minutes} minute${minutes > 1 ? 's' : ''}`
								: seconds > 10
									? `${seconds} second${seconds > 1 ? 's' : ''}`
									: 'a few seconds'}
			{suffix ? ` ${suffix}` : ''}
		</>
	)
}

export default ElapsedTime
