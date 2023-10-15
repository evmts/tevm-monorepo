export declare const isDeterministicError: (error: Error) => boolean;
export declare function buildRequest<TRequest extends (args: any) => Promise<any>>(request: TRequest, { retryDelay, retryCount, }?: {
    retryDelay?: number;
    retryCount?: number;
}): TRequest;
//# sourceMappingURL=buildRequest.d.ts.map