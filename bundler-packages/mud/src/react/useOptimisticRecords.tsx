import { type GetRecordsArgs, getRecords, type TableRecord } from '@latticexyz/stash/internal'
import type { Table } from '@latticexyz/store/internal'
import { deepEqual } from '../internal/utils/deepEqual.js'
import { useOptimisticState } from './useOptimisticState.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

export type UseOptimisticRecordsResult<table extends Table = Table> = readonly TableRecord<table>[]

export const useOptimisticRecords = <const TTable extends Table>(
	args: Omit<GetRecordsArgs<TTable>, 'stash' | 'state'>,
): UseOptimisticRecordsResult<TTable> => {
	const wrapper = useOptimisticWrapper()
	return (
		useOptimisticState(
			(state) => {
				const records = wrapper ? wrapper.getOptimisticRecords({ state, ...args }) : getRecords({ state, ...args })
				return Object.values(records)
			},
			{
				isEqual: deepEqual,
			},
		) ?? []
	)
}
