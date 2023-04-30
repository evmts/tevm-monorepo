export const createProxy = <T extends object>(
  instance: T,
  proxy: Partial<T>,
): T => {
  return new Proxy(instance, {
    get(target, key) {
      // If the key is one of the keys that are to be proxied, return the proxy value.
      if (key in proxy) {
        return proxy[key as keyof T]
      }

      // Otherwise, return the instance value.
      return target[key as keyof T]
    },
  })
}
