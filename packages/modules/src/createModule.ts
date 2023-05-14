export const createModule = (artifacts: Record<string, any>) => {
  const out = Object.entries(artifacts).map(([contractName, artifact]) => {
    return `export const ${contractName} = ${JSON.stringify(artifact)}`
  })
  out.push(`export default ${JSON.stringify(artifacts)}`)
  return out.join('\n')
}

export const createModuleCjs = (artifacts: Record<string, any>) => {
  const out = Object.entries(artifacts).map(([contractName, artifact]) => {
    return `module.exports.${contractName} = ${JSON.stringify(artifact)}`
  })
  out.push(`module.exports.default = ${JSON.stringify(artifacts)}`)
  return out.join('\n')
}
