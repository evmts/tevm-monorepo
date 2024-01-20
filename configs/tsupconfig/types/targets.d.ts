/**
 * @typedef {'js' | 'node' | 'browser'} Target
 */
/**
 * @type {Record<Target, Exclude<import('tsup').Options['target'], undefined>>}
 */
export const targets: Record<Target, Exclude<import('tsup').Options['target'], undefined>>;
export type Target = 'js' | 'node' | 'browser';
//# sourceMappingURL=targets.d.ts.map