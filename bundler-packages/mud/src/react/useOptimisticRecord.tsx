import type { GetRecordArgs, Key, TableRecord } from '@latticexyz/stash/internal'
import type { Table } from '@latticexyz/store/internal'
import { useOptimisticState } from './useOptimisticState.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

export type UseOptimisticRecordResult<
	TTable extends Table = Table,
	TDefaultValue extends Omit<TableRecord<TTable>, keyof Key<TTable>> | undefined = undefined,
> = TDefaultValue extends undefined ? TableRecord<TTable> | undefined : TableRecord<TTable>

export const useOptimisticRecord = <
	const TTable extends Table,
	const TDefaultValue extends Omit<TableRecord<TTable>, keyof Key<TTable>> | undefined = undefined,
>(
	args: Omit<GetRecordArgs<TTable, TDefaultValue>, 'stash' | 'state'>,
): UseOptimisticRecordResult<TTable, TDefaultValue> => {
	const { getOptimisticRecord } = useOptimisticWrapper()
	return useOptimisticState((state) => getOptimisticRecord({ state, ...args })) as UseOptimisticRecordResult<
		TTable,
		TDefaultValue
	>
}
