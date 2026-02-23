# @siakas/dotfiles

プロジェクト共通の設定ファイルを `npx` コマンドでインタラクティブに導入できるセットアップツールです。

## 使い方

プロジェクトのルートディレクトリで以下のコマンドを実行してください。

```bash
npx @siakas/dotfiles
```

対話式メニューが起動し、必要な設定を選択してインストールできます。

## 提供する設定

| カテゴリ | 設定 | 配置先 |
|---------|------|--------|
| VSCode | Prettier + ESLint 向け | `.vscode/` |
| VSCode | Biome 向け | `.vscode/` |
| GitHub Actions | 汎用 CI ワークフロー | `.github/workflows/` |
| Prettier | 基本設定 | `.prettierrc` |
| Prettier | Tailwind CSS 向け | `.prettierrc` |
| ESLint | Next.js + Tailwind + Prettier | `eslint.config.js` |
| Biome | 統合 Linter/Formatter | `biome.json` |
| Claude Code | フロントエンド開発ルール | `CLAUDE.md` |
| Claude Code | コードレビュールール | `.claude/CLAUDE.md` |
| Claude Code | スラッシュコマンド | `.claude/commands/` |

### Claude Code スラッシュコマンド

インストールされるコマンド:

- `/commit` — セマンティックコミットメッセージの作成とコミット実行
- `/create-pr` — プルリクエストの作成（PR テンプレートに沿って自動生成）
- `/code-review` — React シニアエンジニア視点でのコードレビュー実行

## ローカル実行（開発・確認用）

```bash
git clone https://github.com/siakas/dotfiles.git
cd dotfiles
npm install
node bin/setup.js
```

## 競合する設定について

以下の組み合わせは同時選択できません（インストール先ファイルが競合します）。

- `VSCode 設定（Prettier + ESLint）` ↔ `VSCode 設定（Biome）`
- `Prettier 設定（基本）` ↔ `Prettier 設定（Tailwind CSS）`
