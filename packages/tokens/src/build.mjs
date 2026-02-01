import StyleDictionary from 'style-dictionary'

// Build light mode tokens (exclude .dark.json files)
const sdLight = new StyleDictionary({
  source: ['src/tokens/**/!(*.dark).json'],
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
  },
})

// Build dark mode tokens (only .dark.json files)
const sdDark = new StyleDictionary({
  source: ['src/tokens/**/*.dark.json'],
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
  },
})

await sdLight.buildAllPlatforms()
await sdDark.buildAllPlatforms()

console.log('✓ Design tokens built successfully (2 CSS files generated)')
