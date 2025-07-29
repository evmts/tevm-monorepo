import type { TevmSetAccountError } from './TevmSetAccountError.js';
/**
 * Result of SetAccount Action
 */
export type SetAccountResult<ErrorType = TevmSetAccountError> = {
    /**
     * Description of the exception, if any occurred
     */
    errors?: ErrorType[];
};
//# sourceMappingURL=SetAccountResult.d.ts.map