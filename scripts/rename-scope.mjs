#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const newScope = args[0]

if (!newScope || !newScope.startsWith('@')) {
  console.error('Usage: node scripts/rename-scope.mjs @yourscope')
  console.error('Example: node scripts/rename-scope.mjs @acme')
  process.exit(1)
}

const oldScope = '@phoenix'

// File patterns to search
const filePatterns = [
  'package.json',
  '*.ts',
  '*.tsx',
  '*.js',
  '*.jsx',
  '*.mjs',
  '*.md',
]

// Directories to exclude
const excludeDirs = ['node_modules', 'dist', '.turbo', '.next', '.git']

function shouldExclude(filePath) {
  return excludeDirs.some(
    (dir) => filePath.includes(`/${dir}/`) || filePath.includes(`\\${dir}\\`),
  )
}

function matchesPattern(filename) {
  return filePatterns.some((pattern) => {
    const regex = new RegExp(pattern.replace('*', '.*'))
    return regex.test(filename)
  })
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)

    if (shouldExclude(filePath)) {
      return
    }

    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList)
    } else if (matchesPattern(file)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

const files = getAllFiles(rootDir)
let modifiedCount = 0

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const newContent = content.replace(new RegExp(oldScope, 'g'), newScope)

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8')
    console.log(`✓ ${path.relative(rootDir, filePath)}`)
    modifiedCount++
  }
})

console.log(`\n✨ Renamed ${oldScope} to ${newScope} in ${modifiedCount} files`)
