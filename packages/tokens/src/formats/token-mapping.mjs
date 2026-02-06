/**
 * Token Mapping Format
 *
 * Documents Phoenix token name to Figma path correspondence.
 *
 * Provides a mapping table showing how Phoenix's dot-separated token names
 * (color.semantic.primary) map to Figma's slash-separated paths
 * (color/semantic/primary).
 *
 * Useful for:
 * - Documentation of token naming conventions
 * - Debugging Figma import issues
 * - Understanding token hierarchy differences
 *
 * @param {Object} params - Style Dictionary format API params
 * @param {Object} params.dictionary - Token dictionary with allTokens array
 * @returns {string} JSON string of Phoenix-to-Figma token mapping
 */
export const tokenMappingFormat = ({ dictionary }) => {
  const mapping = {}

  dictionary.allTokens.forEach((token) => {
    const phoenixName = token.path.join('.') // color.semantic.primary
    const figmaPath = token.path.join('/') // color/semantic/primary

    mapping[phoenixName] = {
      figmaPath,
      type: token.$type,
      value: token.value, // Final hex value after transformation
    }
  })

  return JSON.stringify(mapping, null, 2)
}
