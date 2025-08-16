import type { Hex } from '@tevm/utils';
import type { TevmMineError } from './TevmMineError.js';
/**
 * Result of Mine Method
 */
export type MineResult = {
    /**
     * Array of mined block hashes
     */
    blockHashes: Array<Hex>;
    /**
     * No errors occurred
     */
    errors?: undefined;
} | {
    /**
     * No block hashes available
     */
    blockHashes?: undefined;
    /**
     * Description of the exception, if any occurred
     */
    errors: TevmMineError[];
};
//# sourceMappingURL=MineResult.d.ts.map