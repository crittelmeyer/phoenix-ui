import Color from 'colorjs.io'

/**
 * OKLCH to Hex Transform
 *
 * Converts OKLCH color values to hex format for Figma compatibility.
 *
 * Input: "oklch(0.647 0.186 264.54)"
 * Output: "#4338ca"
 *
 * Uses colorjs.io to parse OKLCH and convert to sRGB hex.
 */
export function oklchToHex(token) {
  const val = token.$value ?? token.value

  if (val === undefined || typeof val !== 'string') {
    return val
  }

  try {
    // Parse the OKLCH color and convert to hex
    const color = new Color(val)
    return color.to('srgb').toString({ format: 'hex' })
  } catch (error) {
    // If parsing fails, return original value
    console.warn(`Failed to convert "${val}" to hex:`, error.message)
    return val
  }
}
