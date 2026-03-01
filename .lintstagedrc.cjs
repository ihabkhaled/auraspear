const buildTscCommand = () => `npm run typecheck`

const buildLintCommand = () => `npm run lint:fix`

module.exports = {
  '*.{ts,tsx,js,jsx}': [buildLintCommand, buildTscCommand],
  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': ['prettier --write'],
}
