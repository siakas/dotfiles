#!/usr/bin/env node

import { checkbox, select } from '@inquirer/prompts'
import { cp, mkdir, readdir, rename } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PACKAGE_ROOT = resolve(__dirname, '..')
const CONFIGS_DIR = join(PACKAGE_ROOT, 'configs')

// --- 設定オプション定義 ---
const CONFIG_OPTIONS = [
  {
    id: 'vscode-prettier-eslint',
    name: 'VSCode 設定（Prettier + ESLint 向け）',
    description: 'Prettier と ESLint を使用するプロジェクト向け',
    sourceDir: 'vscode/prettier-eslint',
    conflictsWith: ['vscode-biome'],
  },
  {
    id: 'vscode-biome',
    name: 'VSCode 設定（Biome 向け）',
    description: 'Biome を使用するプロジェクト向け',
    sourceDir: 'vscode/biome',
    conflictsWith: ['vscode-prettier-eslint'],
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions（汎用 CI）',
    description: 'type-check・lint・build を実行する汎用 CI ワークフロー',
    sourceDir: 'github-actions',
    conflictsWith: [],
  },
  {
    id: 'prettier-basic',
    name: 'Prettier 設定（基本）',
    description: '標準的な Prettier 設定',
    sourceDir: 'prettier/basic',
    conflictsWith: ['prettier-tailwind'],
  },
  {
    id: 'prettier-tailwind',
    name: 'Prettier 設定（Tailwind CSS）',
    description: 'prettier-plugin-tailwindcss を追加した設定',
    sourceDir: 'prettier/tailwind',
    conflictsWith: ['prettier-basic'],
  },
  {
    id: 'eslint-next-tailwind',
    name: 'ESLint 設定（Next.js + Tailwind + Prettier）',
    description: 'Next.js + Tailwind CSS + Prettier 向けの Flat Config',
    sourceDir: 'eslint/next-tailwind-prettier',
    conflictsWith: [],
  },
  {
    id: 'biome',
    name: 'Biome 設定',
    description: 'Prettier・ESLint の代替として Biome を使用する設定',
    sourceDir: 'biome',
    conflictsWith: [],
  },
  {
    id: 'claude-frontend-rules',
    name: 'Claude Code ルール（フロントエンド開発）',
    description: 'React/Next.js 開発向けの CLAUDE.md をプロジェクトルートに配置',
    sourceDir: 'claude/frontend-rules',
    conflictsWith: [],
  },
  {
    id: 'claude-review-rules',
    name: 'Claude Code ルール（コードレビュー）',
    description: 'コードレビュー向けルールを .claude/CLAUDE.md に配置',
    sourceDir: 'claude/review-rules',
    conflictsWith: [],
  },
  {
    id: 'claude-slash-commands',
    name: 'Claude Code スラッシュコマンド',
    description: 'commit・create-pr・code-review コマンドを .claude/commands/ に配置',
    sourceDir: 'claude/slash-commands',
    conflictsWith: [],
  },
]

// 競合ペア（同時選択不可）
const CONFLICT_PAIRS = [
  ['vscode-prettier-eslint', 'vscode-biome'],
  ['prettier-basic', 'prettier-tailwind'],
]

// --- ANSI カラーヘルパー ---
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
}

function fmt(text, ...codes) {
  return `${codes.join('')}${text}${c.reset}`
}

// --- ファイル操作ヘルパー ---

// ディレクトリ以下のファイルパス（相対）を再帰的に収集
async function collectFiles(dir, base = '') {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(join(dir, entry.name), rel)))
    } else {
      files.push(rel)
    }
  }
  return files
}

// 設定オプション1つ分のファイルをコピー
async function installConfig(opt, cwd, strategy) {
  const sourceDir = join(CONFIGS_DIR, opt.sourceDir)
  const files = await collectFiles(sourceDir)
  const installed = []

  for (const relPath of files) {
    const src = join(sourceDir, relPath)
    const dest = join(cwd, relPath)
    const destParent = dirname(dest)

    if (!existsSync(destParent)) {
      await mkdir(destParent, { recursive: true })
    }

    if (existsSync(dest)) {
      if (strategy === 'skip') {
        console.log(`  ${fmt('スキップ', c.gray)}: ${relPath}`)
        continue
      }
      if (strategy === 'backup') {
        await rename(dest, `${dest}.bak`)
        console.log(`  ${fmt('バックアップ作成', c.yellow)}: ${relPath}.bak`)
      }
    }

    await cp(src, dest)
    installed.push(relPath)
    console.log(`  ${fmt('✓', c.green)} ${relPath}`)
  }

  return installed
}

// --- メイン処理 ---
async function main() {
  console.log('')
  console.log(fmt('  ╔══════════════════════════════════╗', c.cyan))
  console.log(fmt('  ║      @siakas/dotfiles setup      ║', c.cyan, c.bold))
  console.log(fmt('  ╚══════════════════════════════════╝', c.cyan))
  console.log('')
  console.log(
    fmt(
      '  プロジェクトに必要な設定ファイルをインストールします。\n',
      c.gray,
    ),
  )

  // 1. 設定の選択
  let selected
  try {
    selected = await checkbox({
      message: 'インストールする設定を選択してください',
      choices: CONFIG_OPTIONS.map((opt) => ({
        value: opt.id,
        name: opt.name,
        description: opt.description,
      })),
    })
  } catch {
    console.log('\nキャンセルしました。')
    process.exit(0)
  }

  if (selected.length === 0) {
    console.log('\n何も選択されませんでした。終了します。')
    process.exit(0)
  }

  // 2. 競合チェック
  for (const [a, b] of CONFLICT_PAIRS) {
    if (selected.includes(a) && selected.includes(b)) {
      const nameA = CONFIG_OPTIONS.find((o) => o.id === a).name
      const nameB = CONFIG_OPTIONS.find((o) => o.id === b).name
      console.error(
        `\n${fmt('エラー:', c.red, c.bold)} 以下の設定は同時に選択できません。`,
      )
      console.error(`  • ${nameA}`)
      console.error(`  • ${nameB}`)
      process.exit(1)
    }
  }

  // 3. 既存ファイルのチェック
  const cwd = process.cwd()
  const selectedOptions = CONFIG_OPTIONS.filter((opt) =>
    selected.includes(opt.id),
  )

  let hasExistingFiles = false
  for (const opt of selectedOptions) {
    const files = await collectFiles(join(CONFIGS_DIR, opt.sourceDir))
    if (files.some((f) => existsSync(join(cwd, f)))) {
      hasExistingFiles = true
      break
    }
  }

  // 4. 既存ファイルの扱いを確認
  let strategy = 'overwrite'
  if (hasExistingFiles) {
    try {
      strategy = await select({
        message: '既存ファイルが見つかりました。どうしますか？',
        choices: [
          {
            value: 'skip',
            name: 'スキップ（既存ファイルは変更しない）',
          },
          {
            value: 'overwrite',
            name: '上書き',
          },
          {
            value: 'backup',
            name: 'バックアップして上書き（元のファイルを .bak として保存）',
          },
        ],
      })
    } catch {
      console.log('\nキャンセルしました。')
      process.exit(0)
    }
  }

  // 5. ファイルのインストール
  console.log('')
  console.log(fmt('インストール中...', c.bold))
  console.log('')

  let totalInstalled = 0
  for (const opt of selectedOptions) {
    console.log(fmt(`▸ ${opt.name}`, c.blue, c.bold))
    const installed = await installConfig(opt, cwd, strategy)
    totalInstalled += installed.length
    console.log('')
  }

  // 6. 完了メッセージ
  console.log(fmt('─'.repeat(44), c.gray))
  if (totalInstalled > 0) {
    console.log(
      fmt(`✓ ${totalInstalled} ファイルをインストールしました。`, c.green, c.bold),
    )
    console.log(
      fmt(
        '\n  インストール後、必要に応じてファイルの内容をカスタマイズしてください。',
        c.gray,
      ),
    )
  } else {
    console.log(fmt('インストールするファイルはありませんでした。', c.yellow))
  }
  console.log('')
}

main().catch((err) => {
  console.error(fmt(`\nエラーが発生しました: ${err.message}`, c.red))
  process.exit(1)
})
