export const createModule = (contract: Record<string, any>) => {
  const out = Object.entries(contract)
    .map(([key, value]) => {
      return `export const ${key} = ${JSON.stringify(value)}`
    })

  out.push(`export default ${JSON.stringify(contract)}`)

  return out
    .join('\n')
}
