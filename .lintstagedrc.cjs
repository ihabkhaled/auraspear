const buildTscCommand = () => 'npm run typecheck'
const buildLintCommand = () => 'npm run lint:fix'
const buildPrettierCommand = () => 'npm run format'

module.exports = {
  '*.{ts,tsx,js,jsx}': files => {
    if (!files.length) return []

    return [buildLintCommand(), buildTscCommand()]
  },

  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': files => {
    if (!files.length) return []

    return [buildPrettierCommand()]
  },
}
