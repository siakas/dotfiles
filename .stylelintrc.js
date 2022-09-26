module.exports = {
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended',
  ],
  plugin: ['stylelint-prettier'],
  ignoreFiles: ['node_modules'],
  rules: {
    'prettier/prettier': true,

    // アルファベット順のソートを無効化（recess-order のソートを優先）
    'order/properties-alphabetical-order': null,
  },
  overrides: [
    {
      files: 'src/**/*.{ts,tsx}',
      customSyntax: '@stylelint/postcss-css-in-js',
    },
  ],
}
