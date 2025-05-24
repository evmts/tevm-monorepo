import type { GetRecordsArgs, TableRecord } from '@latticexyz/stash/internal'
import type { Table } from '@latticexyz/store/internal'
import { isArrayEqual } from '../internal/arrayDeepEqual.js'
import { useOptimisticState } from './useOptimisticState.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

export type UseOptimisticRecordsResult<table extends Table = Table> = readonly TableRecord<table>[] | undefined

export const useOptimisticRecords = <const TTable extends Table>(
	args: Omit<GetRecordsArgs<TTable>, 'stash'>,
): UseOptimisticRecordsResult<TTable> => {
	const { getOptimisticRecords } = useOptimisticWrapper()
	return useOptimisticState(
		(state) => getOptimisticRecords({ state, ...args }).then((records) => Object.values(records)),
		{
			isEqual: isArrayEqual,
		},
	) as UseOptimisticRecordsResult<TTable>
}
