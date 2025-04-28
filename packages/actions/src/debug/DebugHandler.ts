// TODO we should make throwOnFail get handled generically here

import type { DebugTraceCallParams } from './DebugParams.js'
import type { DebugTraceCallResult } from './DebugResult.js'

export type DebugTraceCallHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
>(
	params: DebugTraceCallParams<TTracer, TDiffMode>,
) => Promise<DebugTraceCallResult<TTracer, TDiffMode>>
