import { ABI, ABIFunction } from '@shazow/whatsabi/lib.types/abi';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAddress, Hex, isHex } from 'tevm/utils';
import { formatUnits as vFormatUnits } from 'viem';

import { ExpectedType } from './types/tx';

/* -------------------------------------------------------------------------- */
/*                                MISCELLANEOUS                               */
/* -------------------------------------------------------------------------- */
/**
 * @notice Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/*                                 FORMATTING                                 */
/* -------------------------------------------------------------------------- */
// Format an input filled by the user into a valid argument for a Tevm contract call
// Throw an error if the input is invalid
export const formatInputValue = (
  type: string,
  value: string | number,
): ExpectedType => {
  // Check if it should be parsed as an array
  const isArray = type.includes('[]');
  // Check the type
  const isUint = type.includes('uint');
  const isAddress = type.includes('address');
  const isBytes = type.includes('bytes');
  const isBool = type.includes('bool');

  // Transform into array for easier manipulation
  const array = isArray ? parseArrayInput(value) : [value];
  // Format each input (which will validate it)
  const formatted = array.map((input) => {
    if (isUint) return formatUint(input);
    if (isBytes) return getHex(input);
    if (isAddress) return getAddress(input.toString());
    if (isBool) return formatBool(input);
    // Let Tevm handle the error if the type is not recognized
    return input;
  });

  return isArray ? formatted : formatted[0];
};

// Format a string or number into a valid uint
const formatUint = (value: string | number): bigint => {
  return BigInt(value.toString()); // this will throw an error if the value is not a valid bigint
};

// Verify an hexadecimal valud and type it correctly
const getHex = (value: string | number): Hex => {
  // Just check if it's a valid hex value and let Tevm handle the rest
  if (!isHex(value.toString())) throw new Error('Invalid bytes');
  return value as Hex;
};

// Format a string into a valid boolean
const formatBool = (value: string | number): boolean => {
  if (value.toString() === 'true' || value.toString() === '1') return true;
  if (value.toString() === 'false' || value.toString() === '0') return false;
  throw new Error('Invalid boolean');
};

// Parse an input supposed to be an array into a javascript array
const parseArrayInput = (input: string | number) => {
  return input.toString().split(/,| /);
};

// Get a unique id for each function in the abi
export const getFunctionId = (abi: ABI, func: ABIFunction) => {
  // We have this function from the abi so it will always be there
  return abi
    .filter((funcOrEvent) => funcOrEvent.type === 'function')
    .indexOf(func)
    .toString();
};

/**
 * @notice Formats a number with commas
 */
export function formatNumberWithCommas(value: number | bigint): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * @notice Gets time elapsed since a given timestamp in seconds, minutes, hours, or days
 */
export function getTimeElapsed(timestamp: number): string {
  const elapsed = (Date.now() - timestamp) / 1000;

  if (elapsed < 60) {
    return `${Math.floor(elapsed)}s ago`;
  } else if (elapsed < 3600) {
    return `${Math.floor(elapsed / 60)}m ago`;
  } else if (elapsed < 86400) {
    return `${Math.floor(elapsed / 3600)}h ago`;
  } else {
    return `${Math.floor(elapsed / 86400)}d ago`;
  }
}

/**
 * @notice Truncates a string to a given length
 */
export function truncateString(
  str: string,
  maxLength: number,
  startChars = 4,
  endChars = 4,
  ellipsis = '...',
): string {
  if (str.length <= maxLength) {
    return str;
  }

  const start = str.slice(0, startChars);
  const end = str.slice(-endChars);

  return `${start}${ellipsis}${end}`;
}

/**
 * @notice Formats an address with a prefix and suffix
 */
export function formatAddress(
  address: string,
  prefix = 6,
  suffix = 4,
): string {
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
}

/**
 * @notice Formats a hash with a prefix and suffix
 */
export function formatHash(hash: string, prefix = 6, suffix = 6): string {
  return `${hash.slice(0, prefix)}...${hash.slice(-suffix)}`;
}

/**
 * @notice Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy text: ', error);
      return false;
    }
  }

  // Fallback for browsers that don't support the Clipboard API
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
}

/**
 * @notice Format wei (or other unit) value to a human-readable ETH value
 * @param value The value in wei to format
 * @param decimals The number of decimals (18 for ETH)
 * @returns Formatted string with ETH value and up to 6 decimal places
 */
export function formatUnits(
  value: bigint | string | number,
  decimals = 18
): string {
  const formatted = vFormatUnits(BigInt(value.toString()), decimals);
  
  // If the value is a whole number, return without decimals
  if (formatted.endsWith('.0')) {
    return formatted.slice(0, -2);
  }
  
  // Trim trailing zeros and the decimal point if needed
  const trimmed = formatted.replace(/\.?0+$/, '');
  
  // Limit to 6 decimal places for readability
  const parts = trimmed.split('.');
  if (parts.length === 2 && parts[1].length > 6) {
    return `${parts[0]}.${parts[1].slice(0, 6)}`;
  }
  
  return trimmed;
}