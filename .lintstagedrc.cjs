const path = require('path')

const rel = f => path.relative(process.cwd(), f).replaceAll('\\', '/')

const buildEslintCommand = fileNames =>
  `node ./node_modules/eslint/bin/eslint.js ${fileNames.map(f => `"${rel(f)}"`).join(' ')} --fix`

const buildPrettierCommand = fileNames =>
  `node ./node_modules/prettier/bin/prettier.cjs --write ${fileNames.map(f => `"${rel(f)}"`).join(' ')}`

const buildAddToGitAfterPrettier = fileNames =>
  `git add ${fileNames.map(f => `"${rel(f)}"`).join(' ')}`

module.exports = {
  '*.{ts,tsx,js,jsx}': files => {
    if (!files.length) return []

    return [buildEslintCommand(files)]
  },

  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': files => {
    if (!files.length) return []

    return [buildPrettierCommand(files), buildAddToGitAfterPrettier(files)]
  },
}
