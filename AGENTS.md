# AGENTS.md

## プロジェクト概要

`npx @siakas/dotfiles` で実行できる設定ファイル配布 CLI。
`configs/` 以下の設定ファイルをユーザーのプロジェクトへ対話式にインストールする npm パッケージ。

## 技術仕様

- **ランタイム**: Node.js 18 以上
- **モジュール形式**: ESM（`"type": "module"`）
- **パッケージマネージャー**: npm

## 遵守ルール

### ファイル構造

- `configs/` 以下のパス構造はインストール先に直接反映されるため変更しない
  - 例: `configs/vscode/prettier-eslint/.vscode/settings.json` → ユーザーの `.vscode/settings.json`
- `bin/setup.js` の `CONFIG_OPTIONS` 配列が選択肢の唯一の定義元。新規カテゴリ追加時は必ずここに追記する

### コーディング

- `any` の使用禁止
- 新しい依存パッケージは `dependencies` のみに追加（`devDependencies` は使用しない）
  - npx 実行時にインストールされる必要があるため

### 動作確認

```bash
node bin/setup.js
```

### コミット

- メッセージは**日本語**で記述する
- 形式: `<type>: <説明>`
- type: `feat` / `fix` / `chore` / `docs` / `refactor`
