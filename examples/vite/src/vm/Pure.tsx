import { useQuery } from '@tanstack/react-query'
import { useId, useState } from 'react'
// @ts-expect-error - TODO make a ts plugin TODO make a global .t.sol module type
import PureQuery from './PureQuery.s.sol'
import { run } from './run.js'

export const Pure = () => {
	const [num1, setNum1] = useState(0)
	const [num2, setNum2] = useState(0)
	const { data, error, isLoading } = useQuery([PureQuery.id, num1, num2], async () => {
		return run(PureQuery, [num1, num2])
	})
	return (
		<div>
			<div>Testing a pure query</div>
			<div>This pure script does not read/write to state</div>
			<div>This is testing that the vm is executing</div>
			<div>Change the inputs and a query will execute</div>
			<div>
				<input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value))} /> +
				<input type="number" value={num2} onChange={(e) => setNum2(Number(e.target.value))} /> =
				<div id={useId()}>{data}</div>
				{error && <div>{JSON.stringify(error)}</div>}
				{isLoading && <div>Loading...</div>}
			</div>
		</div>
	)
}
