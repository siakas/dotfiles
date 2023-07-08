module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  rules: {
    'order/properties-alphabetical-order': null,
  },
  overrides: [
    {
      files: ['*.astro', '**/*.astro'],

      // `*.astro` では postcss-html を指定しないとシンタックスエラーになってしまう
      customSyntax: 'postcss-html',
    },
    {
      files: ['*.{js,jsx,ts,tsx}', '**/*.{js,jsx,ts,tsx}'],
      customSyntax: 'postcss-styled-syntax',
    },
  ],
}
