export type ThrowOnProxy = <THandler extends (params: any) => Promise<any>>(handler: THandler) => THandler
