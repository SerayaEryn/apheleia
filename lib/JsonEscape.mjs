export function jsonEscape (str) {
  if (str.length < 2500) {
    const size = str.length
    for (let i = 0; i < size; i++) {
      const codePoint = str.codePointAt(i)
      if (codePoint >= 0 && codePoint <= 31 || codePoint == 34 || codePoint == 92 || codePoint >= 55296 && codePoint <= 57343)  {
        return JSON.stringify(str)
      }
    }
    return `"${str}"`
  }
  return JSON.stringify(str)
}