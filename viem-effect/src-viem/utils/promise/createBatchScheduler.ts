import type { ErrorType } from '../../errors/utils.js'

type Resolved<TReturnType extends readonly unknown[] = any> = [
  result: TReturnType[number],
  results: TReturnType,
]

type PendingPromise<TReturnType extends readonly unknown[] = any> = {
  resolve?: (data: Resolved<TReturnType>) => void
  reject?: (reason?: unknown) => void
}

type SchedulerItem = { args: unknown; pendingPromise: PendingPromise }

export type CreateBatchSchedulerArguments<
  TParameters = unknown,
  TReturnType extends readonly unknown[] = readonly unknown[],
> = {
  fn: (args: TParameters[]) => Promise<TReturnType>
  id: number | string
  shouldSplitBatch?: (args: TParameters[]) => boolean
  wait?: number
}

export type CreateBatchSchedulerReturnType<
  TParameters = unknown,
  TReturnType extends readonly unknown[] = readonly unknown[],
> = {
  flush: () => void
  schedule: TParameters extends undefined
    ? (args?: TParameters) => Promise<Resolved<TReturnType>>
    : (args: TParameters) => Promise<Resolved<TReturnType>>
}

export type CreateBatchSchedulerErrorType = ErrorType

const schedulerCache = /*#__PURE__*/ new Map<number | string, SchedulerItem[]>()

export function createBatchScheduler<
  TParameters,
  TReturnType extends readonly unknown[],
>({
  fn,
  id,
  shouldSplitBatch,
  wait = 0,
}: CreateBatchSchedulerArguments<
  TParameters,
  TReturnType
>): CreateBatchSchedulerReturnType<TParameters, TReturnType> {
  const exec = async () => {
    const scheduler = getScheduler()
    flush()

    const args = scheduler.map(({ args }) => args)

    if (args.length === 0) return

    fn(args as TParameters[])
      .then((data) => {
        scheduler.forEach(({ pendingPromise }, i) =>
          pendingPromise.resolve?.([data[i], data]),
        )
      })
      .catch((err) => {
        scheduler.forEach(({ pendingPromise }) => pendingPromise.reject?.(err))
      })
  }

  const flush = () => schedulerCache.delete(id)

  const getBatchedArgs = () =>
    getScheduler().map(({ args }) => args) as TParameters[]

  const getScheduler = () => schedulerCache.get(id) || []

  const setScheduler = (item: SchedulerItem) =>
    schedulerCache.set(id, [...getScheduler(), item])

  return {
    flush,
    async schedule(args: TParameters) {
      const pendingPromise: PendingPromise<TReturnType> = {}
      const promise = new Promise<Resolved<TReturnType>>((resolve, reject) => {
        pendingPromise.resolve = resolve
        pendingPromise.reject = reject
      })

      const split = shouldSplitBatch?.([...getBatchedArgs(), args])

      if (split) exec()

      const hasActiveScheduler = getScheduler().length > 0
      if (hasActiveScheduler) {
        setScheduler({ args, pendingPromise })
        return promise
      }

      setScheduler({ args, pendingPromise })
      setTimeout(exec, wait)
      return promise
    },
  } as unknown as CreateBatchSchedulerReturnType<TParameters, TReturnType>
}
