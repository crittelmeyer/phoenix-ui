import StyleDictionary from 'style-dictionary'
import { register } from '@tokens-studio/sd-transforms'
import { tokensStudioFormat } from './formats/tokens-studio.mjs'
import { tokenMappingFormat } from './formats/token-mapping.mjs'
import { colorComparisonFormat } from './formats/color-comparison.mjs'
import { oklchToHex } from './transforms/oklch-to-hex.mjs'

// Register sd-transforms globally before creating StyleDictionary instances
await register(StyleDictionary, {
  platform: 'css', // Use CSS platform transforms (includes hex color conversion)
  expand: {
    typography: false, // Phoenix doesn't use composite typography
    border: false,
    shadow: false,
  },
  excludeParentKeys: false,
  'ts/color/modifiers': {
    format: 'hex', // Output hex for Figma compatibility
  },
})

// Register custom transform for OKLCH to hex conversion
StyleDictionary.registerTransform({
  name: 'phoenix/oklch-to-hex',
  type: 'value',
  transitive: true,
  filter: (token) => (token.$type ?? token.type) === 'color',
  transform: oklchToHex,
})

// Register custom formats
StyleDictionary.registerFormat({
  name: 'phoenix/tokens-studio',
  format: tokensStudioFormat,
})

StyleDictionary.registerFormat({
  name: 'phoenix/token-mapping',
  format: tokenMappingFormat,
})

StyleDictionary.registerFormat({
  name: 'phoenix/color-comparison',
  format: colorComparisonFormat,
})

try {
  // Build light mode tokens (exclude .dark.json files)
  const sdLight = new StyleDictionary({
    source: ['src/tokens/**/!(*.dark).json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/',
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
            options: {
              outputReferences: true,
            },
          },
        ],
      },
      figma: {
        transforms: ['phoenix/oklch-to-hex'],
        buildPath: 'dist/figma/',
        files: [
          {
            destination: 'light.json',
            format: 'phoenix/tokens-studio',
            options: {
              tokenSetName: 'phoenix-light',
              outputReferences: false,
            },
          },
          {
            destination: 'token-mapping.json',
            format: 'phoenix/token-mapping',
            options: {
              outputReferences: false,
            },
          },
          {
            destination: '../color-comparison.html',
            format: 'phoenix/color-comparison',
          },
        ],
      },
    },
  })

  // Build dark mode tokens (only .dark.json files)
  const sdDark = new StyleDictionary({
    source: ['src/tokens/**/*.dark.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/',
        files: [
          {
            destination: 'tokens.dark.css',
            format: 'css/variables',
            options: {
              selector: '.dark',
              outputReferences: true,
            },
          },
        ],
      },
      figma: {
        transforms: ['phoenix/oklch-to-hex'],
        buildPath: 'dist/figma/',
        files: [
          {
            destination: 'dark.json',
            format: 'phoenix/tokens-studio',
            options: {
              tokenSetName: 'phoenix-dark',
              outputReferences: false,
            },
          },
        ],
      },
    },
  })

  await sdLight.buildAllPlatforms()
  await sdDark.buildAllPlatforms()

  console.log('✓ Design tokens built successfully:')
  console.log('  - dist/tokens.css (OKLCH CSS variables)')
  console.log('  - dist/tokens.dark.css (OKLCH CSS variables)')
  console.log('  - dist/figma/light.json (Hex Tokens Studio format)')
  console.log('  - dist/figma/dark.json (Hex Tokens Studio format)')
  console.log('  - dist/figma/token-mapping.json (Documentation)')
  console.log('  - dist/color-comparison.html (Visual comparison)')
} catch (error) {
  console.error('✗ Token build failed:', error.message)
  process.exit(1)
}
