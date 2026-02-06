/**
 * Tokens Studio JSON Format
 *
 * Outputs tokens in Tokens Studio plugin-compatible JSON format for Figma import.
 *
 * Features:
 * - Wraps tokens in named set (e.g., { "phoenix-light": { ... } })
 * - Uses slash separator for Figma hierarchy (color/semantic/primary)
 * - Includes type and description from DTCG source
 * - Values are already hex-converted by sd-transforms ts/color/modifiers
 *
 * @param {Object} params - Style Dictionary format API params
 * @param {Object} params.dictionary - Token dictionary with allTokens array
 * @param {Object} params.options - Format options (tokenSetName)
 * @param {Object} params.file - File configuration
 * @returns {string} JSON string of Tokens Studio format
 */
export const tokensStudioFormat = ({ dictionary, options, file }) => {
  const tokenSet = {}

  dictionary.allTokens.forEach((token) => {
    // Use slash separator for Figma hierarchy
    const tokenPath = token.path.join('/')

    tokenSet[tokenPath] = {
      value: token.value, // Already transformed to hex by sd-transforms
      type: token.$type,
      ...(token.$description && { description: token.$description }),
    }
  })

  // Wrap in token set name - different for light/dark modes
  const output = {
    [options.tokenSetName || 'phoenix']: tokenSet,
  }

  return JSON.stringify(output, null, 2)
}
