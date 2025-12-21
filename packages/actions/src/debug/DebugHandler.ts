// TODO we should make throwOnFail get handled generically here

import type { DebugTraceCallParams } from './DebugParams.js'
import type { DebugTraceCallResult } from './DebugResult.js'

export type DebugTraceCallHandler = <
	TTracer extends
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
>(
	params: DebugTraceCallParams<TTracer, TDiffMode>,
) => Promise<DebugTraceCallResult<TTracer, TDiffMode>>
