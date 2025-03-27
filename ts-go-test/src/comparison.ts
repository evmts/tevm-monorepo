export interface ComparisonResult {
  equal: boolean;
  differences?: string;
}

export function compareResults(jsResult: unknown, goResult: unknown): ComparisonResult {
  if (jsResult === goResult) {
    return { equal: true };
  }
  
  // Convert to JSON and back to handle things like undefined vs null
  const normalizedJs = JSON.parse(JSON.stringify(jsResult || null));
  const normalizedGo = JSON.parse(JSON.stringify(goResult || null));
  
  const isEqual = JSON.stringify(normalizedJs) === JSON.stringify(normalizedGo);
  
  if (isEqual) {
    return { equal: true };
  }
  
  // Generate a diff for debugging
  const jsString = JSON.stringify(normalizedJs, null, 2);
  const goString = JSON.stringify(normalizedGo, null, 2);
  
  return {
    equal: false,
    differences: `
JS Result:
${jsString}

Go Result:
${goString}
`
  };
}