export const getContractName = (id: string) => {
  const contractName = id.split('/').at(-1)
  if (!contractName) {
    throw new Error('unable to parse contract name from path')
  }
  return contractName
}
