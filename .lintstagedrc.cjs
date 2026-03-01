const buildTscCommand = () =>
  process.platform === 'win32'
    ? 'node_modules\\.bin\\tsc.cmd --noEmit --pretty'
    : 'tsc --noEmit --pretty'

module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint', buildTscCommand],
  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': ['prettier --write'],
}
