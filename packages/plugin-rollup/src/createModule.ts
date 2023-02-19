export const createModule = (contract: Record<string, any>) => {
  return Object.entries(contract)
    .map(([key, value]) => {
      return `export const ${key} = ${JSON.stringify(value)}`
    })
    .join('/n')
}
