/**
 * Helper type to ensure exactly one property from a set is provided
 */
export type ExactlyOne<T, K extends keyof T> = {
    [P in K]: {
        [Q in P]: T[P];
    } & {
        [Q in Exclude<K, P>]?: never;
    };
}[K];
//# sourceMappingURL=ExactlyOne.d.ts.map