module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // 任意の構文の間に空行を入れるかどうかの定義
    // ここでは return 文の前に空行を入れるが、一行の const 宣言の直後に限って空行なしを許容する設定としている
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'any',
        prev: 'singleline-const',
        next: 'return',
      },
    ],

    // 型情報のみの import を import type に強制するルール
    // デフォルトでは import { type ... } の書式になっているので、
    // import type { ... } の書式に変更
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'separate-type-imports',
      },
    ],

    // オブジェクトの型定義にインターフェースまたは型エイリアスのどちらかを強制するルール
    // eslint-config-standard-with-typescript がインターフェースを強制しているのを無効化
    '@typescript-eslint/consistent-type-definitions': 'off',

    // 関数の戻り値に必ず型定義を書かなければいけないルール
    // eslint-config-standard-with-typescript が全面採用しているが厳しすぎるため、
    // その適用がエクスポートされる関数に限られる @typescript-eslint/explicit-module-boundary-types に入れ替え
    // 追記：
    // @typescript-eslint/explicit-module-boundary-types の方も有効化するメリットがないという意見もあるので error から off に変更
    // 参考：
    // https://twitter.com/fiahfy/status/1521724999953879040
    // https://github.com/typescript-eslint/typescript-eslint/issues/3746
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Promise の誤用を防ぐためのルール
    // 何も返さない async 関数のコールに明示的に void キーワードをつけることを強制され、
    // かつ、コンポーネントのイベント属性に async 関数を渡す際に、
    // (e): void => { handleSubmit(e) } のような煩雑な記述を強いられるのを部分的に無効化
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // Boolean 値が期待される記述で、Boolean 型以外の使用を許可しないルール
    // デフォルト設定だと警告が過剰に思えるので、ルールを緩和
    // ここでは string, number, オブジェクト、関数、null、undefined の場合には許容するよう設定
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowString: true,
        allowNumber: true,
        allowNullableString: true,
        allowNullableNumber: true,
        allowNullableObject: true,
      },
    ],

    // トリプルスラッシュ・ディレクティブの使用を許可するかどうかを定義するルール
    // ここでは eslint-config-standard-with-typescript が一律禁止にしているのを、type 属性に限り許可するように設定
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        types: 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
    },
  ],
}
