import { Effect } from 'effect'
import Ox from 'ox'

// Export ENS types
export type GetAddressParameters = Ox.Ens.GetAddressParameters
export type GetAddressReturnType = Ox.Ens.GetAddressReturnType

export type GetNameParameters = Ox.Ens.GetNameParameters
export type GetNameReturnType = Ox.Ens.GetNameReturnType

export type GetAvatarParameters = Ox.Ens.GetAvatarParameters
export type GetAvatarReturnType = Ox.Ens.GetAvatarReturnType

export type GetTextParameters = Ox.Ens.GetTextParameters
export type GetTextReturnType = Ox.Ens.GetTextReturnType

export type GetUniversalResolverParameters = Ox.Ens.GetUniversalResolverParameters
export type GetUniversalResolverReturnType = Ox.Ens.GetUniversalResolverReturnType

export type NormalizeParameters = Ox.Ens.NormalizeParameters
export type NormalizeReturnType = Ox.Ens.NormalizeReturnType

export type LabelhashParameters = Parameters<typeof Ox.Ens.labelhash>
export type LabelhashReturnType = ReturnType<typeof Ox.Ens.labelhash>

export type NamehashParameters = Parameters<typeof Ox.Ens.namehash>
export type NamehashReturnType = ReturnType<typeof Ox.Ens.namehash>

// Error classes for ENS functions
export class GetAddressError extends Error {
  override name = 'GetAddressError'
  _tag = 'GetAddressError'
  constructor(cause: unknown) {
    super('Error getting ENS address with ox', { cause })
  }
}

export class GetNameError extends Error {
  override name = 'GetNameError'
  _tag = 'GetNameError'
  constructor(cause: unknown) {
    super('Error getting ENS name with ox', { cause })
  }
}

export class GetAvatarError extends Error {
  override name = 'GetAvatarError'
  _tag = 'GetAvatarError'
  constructor(cause: unknown) {
    super('Error getting ENS avatar with ox', { cause })
  }
}

export class GetTextError extends Error {
  override name = 'GetTextError'
  _tag = 'GetTextError'
  constructor(cause: unknown) {
    super('Error getting ENS text record with ox', { cause })
  }
}

export class GetUniversalResolverError extends Error {
  override name = 'GetUniversalResolverError'
  _tag = 'GetUniversalResolverError'
  constructor(cause: unknown) {
    super('Error getting ENS universal resolver with ox', { cause })
  }
}

export class NormalizeError extends Error {
  override name = 'NormalizeError'
  _tag = 'NormalizeError'
  constructor(cause: unknown) {
    super('Error normalizing ENS name with ox', { cause })
  }
}

export class LabelhashError extends Error {
  override name = 'LabelhashError'
  _tag = 'LabelhashError'
  constructor(cause: unknown) {
    super('Error generating ENS labelhash with ox', { cause })
  }
}

export class NamehashError extends Error {
  override name = 'NamehashError'
  _tag = 'NamehashError'
  constructor(cause: unknown) {
    super('Error generating ENS namehash with ox', { cause })
  }
}

// Function implementations
/**
 * Gets the address for an ENS name
 */
export function getAddress(
  args: GetAddressParameters
): Effect.Effect<GetAddressReturnType, GetAddressError, never> {
  return Effect.tryPromise({
    try: () => Ox.Ens.getAddress(args),
    catch: (cause) => new GetAddressError(cause),
  })
}

/**
 * Gets the ENS name for an address
 */
export function getName(
  args: GetNameParameters
): Effect.Effect<GetNameReturnType, GetNameError, never> {
  return Effect.tryPromise({
    try: () => Ox.Ens.getName(args),
    catch: (cause) => new GetNameError(cause),
  })
}

/**
 * Gets the avatar for an ENS name
 */
export function getAvatar(
  args: GetAvatarParameters
): Effect.Effect<GetAvatarReturnType, GetAvatarError, never> {
  return Effect.tryPromise({
    try: () => Ox.Ens.getAvatar(args),
    catch: (cause) => new GetAvatarError(cause),
  })
}

/**
 * Gets a text record for an ENS name
 */
export function getText(
  args: GetTextParameters
): Effect.Effect<GetTextReturnType, GetTextError, never> {
  return Effect.tryPromise({
    try: () => Ox.Ens.getText(args),
    catch: (cause) => new GetTextError(cause),
  })
}

/**
 * Gets the universal resolver for ENS
 */
export function getUniversalResolver(
  args: GetUniversalResolverParameters
): Effect.Effect<GetUniversalResolverReturnType, GetUniversalResolverError, never> {
  return Effect.tryPromise({
    try: () => Ox.Ens.getUniversalResolver(args),
    catch: (cause) => new GetUniversalResolverError(cause),
  })
}

/**
 * Normalizes an ENS name
 */
export function normalize(
  args: NormalizeParameters
): Effect.Effect<NormalizeReturnType, NormalizeError, never> {
  return Effect.try({
    try: () => Ox.Ens.normalize(args),
    catch: (cause) => new NormalizeError(cause),
  })
}

/**
 * Computes the labelhash of an ENS label
 */
export function labelhash(
  label: string
): Effect.Effect<LabelhashReturnType, LabelhashError, never> {
  return Effect.try({
    try: () => Ox.Ens.labelhash(label),
    catch: (cause) => new LabelhashError(cause),
  })
}

/**
 * Computes the namehash of an ENS name
 */
export function namehash(
  name: string
): Effect.Effect<NamehashReturnType, NamehashError, never> {
  return Effect.try({
    try: () => Ox.Ens.namehash(name),
    catch: (cause) => new NamehashError(cause),
  })
}