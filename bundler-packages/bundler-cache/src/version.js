/**
 * Current cache version identifier used to track cache compatibility.
 *
 * This version string is stored in the metadata.json file and is used to
 * determine if cached files are compatible with the current bundler version.
 * When significant changes are made to the caching system, this version
 * should be updated to invalidate existing caches.
 *
 * @type {string}
 * @internal
 */
export const version = '1.x.x'
