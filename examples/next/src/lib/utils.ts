import { ABI } from '@shazow/whatsabi/lib.types/abi';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isAddress, isHex } from 'viem';

import { Address, Hex } from '@/lib/types/config';
import { ExpectedType } from '@/lib/types/tx';

/* -------------------------------------------------------------------------- */
/*                                MISCELLANEOUS                               */
/* -------------------------------------------------------------------------- */
// Merge Tailwind CSS classes with clsx
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
    if (isBytes) return formatBytes(input);
    if (isAddress) return formatAddress(input);
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

// Format a string into valid bytes
const formatBytes = (value: string | number): Hex => {
  // Just check if it's a valid hex value and let Tevm handle the rest
  if (!isHex(value.toString())) throw new Error('Invalid bytes');
  return value as Hex;
};

// Format a string into a valid address
const formatAddress = (value: string | number): Address => {
  if (!isAddress(value.toString())) throw new Error('Invalid address');
  return value as Address;
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

// Make sure to get a name for any function, so we can call it with Tevm
export const getFunctionName = (funcOrEvent: ABI[number], index: number) => {
  return funcOrEvent.type === 'event'
    ? funcOrEvent.name
    : funcOrEvent.name ||
        funcOrEvent.sig ||
        funcOrEvent.selector ||
        `function-${index.toString()}`;
};
