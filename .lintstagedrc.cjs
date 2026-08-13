module.exports = {
  '*.{ts,tsx,js,jsx,json,css,md,yml,yaml}': () => [
    'eslint . --fix --concurrency=5',
    'prettier --write .',
  ],
}
