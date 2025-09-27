import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import React from 'react'
import { useCounter } from '../hooks/useCounter.js'

const titleText = 'Tevm Create'
const loadingTitleText = 'Tevm Creating...'

type Props = { loading?: boolean }

export const FancyCreateTitle: React.FC<Props> = ({ loading }) => {
	const { count: i } = useCounter(titleText.length)

	const text = `${loading ? loadingTitleText : titleText}${loading ? '.'.repeat(Math.floor(i * 0.15) % 4) : ''}`.slice(
		0,
		i + 1,
	)

	const G = Gradient as any
	const BT = BigText as any

	return (
		<G name="pastel">
			<BT font="tiny" text={text} />
		</G>
	)
}
