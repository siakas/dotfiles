module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard-with-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', 'react-hooks', 'import', 'unused-imports'],
  ignorePatterns: ['build', 'dist'],
  rules: {
    /* 不要な空白を許可しないが、配列のみ視認性のための空白を許容する */
    // 'no-multi-spaces': [
    //   'error',
    //   {
    //     exceptions: {
    //       ArrayExpression: true,
    //     },
    //   },
    // ],

    /* React v17 以降で eslint-plugin-react を使用している場合の設定 */
    /* 下記を OFF にすることで不要なエラーを回避 */
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    /* boolean 変数の受け渡しには JSX の省略形を使う */
    'react/jsx-boolean-value': 'error',

    /* 文字列属性に波括弧は不要 */
    'react/jsx-curly-brace-presence': 'error',

    /* 子要素のないコンポーネントは自己終了タグを使う（HTML タグは除外） */
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],

    /* 静的サイト構築にともなう img タグの記述許可 */
    '@next/next/no-img-element': 'off',

    /* interface ではなく type を使用 */
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    /* unused-imports 向けの設定 */
    '@typescript-eslint/no-unused-vars': 'off', // or 'no-unused-vars': 'off'
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    /* import の自動ソートに関する設定 */
    'import/newline-after-import': 'error', // 最後の import のあとに空行を追加
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'object',
          'type',
          'index',
        ],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          // react 関連のモジュールを external より前にする
          {
            pattern: '{react,react-dom/**,react-router-dom,next,next/**}',
            group: 'builtin',
            position: 'before',
          },
          // `@/context`, `@/hooks`, `@/utils`, `@/data`, `@/types`,
          // `@/animations`, `@/layout` の import をグルーピング
          {
            pattern:
              '{@/context/**,@/hooks/**,@/utils/**,@/data/**,@/types/**,@/animations/**,@/layout/**}',
            group: 'internal',
            position: 'before',
          },
          // `@/components`, `@/pages` の import をグルーピング
          {
            pattern: '{@/components/**,@/pages/**}',
            group: 'internal',
            position: 'before',
          },
          // CSS module を一番最後に
          {
            pattern: '@/styles/**/*.module.{scss,css}',
            group: 'index',
            position: 'after',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        /* TypeScript では PropTypes による型チェックは不要 */
        'react/prop-types': 'off',

        /* Emotion で利用する css prop を許容 */
        'react/no-unknown-property': [
          'error',
          {
            ignore: ['css'],
          },
        ],
      },
    },
    {
      files: ['**/*.styles.ts'],
      rules: {
        /* Emotion が定義する *.styles.ts では default export の強制を無効化 */
        'import/prefer-default-export': 'off',
      },
    },
  ],
}
