function splitTextToChunks(input: string, maxLength = 2000): string[] {
  const result: string[] = []
  for (let i = 0; i < input.length; i += maxLength) {
    result.push(input.substring(i, i + maxLength))
  }
  return result;
}

export default splitTextToChunks;
