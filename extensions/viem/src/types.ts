export type AnyFunction = (...args: any[]) => any
export type AnyAsyncFunction = (...args: any[]) => Promise<any>
export type AnySyncFunction = (...args: any[]) => Exclude<any, Promise<any>>
