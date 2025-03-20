import { useMemo } from 'react';

import { formatNumberWithCommas } from '../../lib/utils';

type CurrencyAmountProps = {
  amount: string | number | bigint;
  currency?: string;
  decimals?: number;
  precision?: number;
  hideSymbol?: boolean;
  className?: string;
};

/**
 * @notice Formats and displays an amount with a currency symbol
 * @param amount - The amount to format
 * @param currency - The currency symbol to display
 * @param decimals - The number of decimals in the amount (e.g. 18 for ETH)
 * @param precision - The number of decimal places to show
 * @param hideSymbol - Whether to hide the currency symbol
 * @param className - Additional CSS classes to apply
 * @returns A component that displays a formatted currency amount
 */
const CurrencyAmount = ({
  amount,
  currency = 'ETH',
  decimals = 18,
  precision = 6,
  hideSymbol = false,
  className,
}: CurrencyAmountProps) => {
  const formattedAmount = useMemo(() => {
    try {
      const value = BigInt(amount);
      const divisor = BigInt(10) ** BigInt(decimals);
      const whole = value / divisor;
      const fraction = value % divisor;

      if (fraction === 0n) {
        return formatNumberWithCommas(whole);
      }

      // Convert the fraction to a string of specified precision
      let fractionStr = fraction.toString().padStart(decimals, '0');
      fractionStr = fractionStr.slice(0, precision);

      // Trim trailing zeros
      while (fractionStr.endsWith('0') && fractionStr.length > 1) {
        fractionStr = fractionStr.slice(0, -1);
      }

      return `${formatNumberWithCommas(whole)}.${fractionStr}`;
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '0';
    }
  }, [amount, decimals, precision]);

  return (
    <span className={className}>
      {formattedAmount}
      {!hideSymbol && ` ${currency}`}
    </span>
  );
};

export default CurrencyAmount;