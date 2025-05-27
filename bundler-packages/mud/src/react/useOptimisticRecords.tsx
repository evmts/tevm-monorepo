import { type GetRecordsArgs, type TableRecord, getRecords } from '@latticexyz/stash/internal'
import type { Table } from '@latticexyz/store/internal'
import { arrayDeepEqual } from '../internal/arrayDeepEqual.js'
import { useOptimisticState } from './useOptimisticState.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

export type UseOptimisticRecordsResult<table extends Table = Table> = readonly TableRecord<table>[] | undefined

export const useOptimisticRecords = <const TTable extends Table>(
	args: Omit<GetRecordsArgs<TTable>, 'stash' | 'state'>,
): UseOptimisticRecordsResult<TTable> => {
	const wrapper = useOptimisticWrapper()
	return useOptimisticState(
		(state) =>
			(wrapper
				? wrapper.getOptimisticRecords({ state, ...args })
				: Promise.resolve(getRecords({ state, ...args }))
			).then((records) => Object.values(records)),
		{
			isEqual: arrayDeepEqual,
		},
	) as UseOptimisticRecordsResult<TTable>
}
