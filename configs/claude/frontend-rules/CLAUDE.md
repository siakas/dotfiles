# 開発ガイドライン

このプロジェクトは React/Next.js + TypeScript で開発しています。以下のルールに従って作業してください。

## 基本方針

- **TypeScript strict mode** を徹底し、`any` の使用を禁止
- **コンポーネントの純粋性** を保つ（レンダー中の副作用を禁止）
- **Next.js App Router** の規約に従い、Server Components を積極活用
- コメントは日本語で記述する
- 日本語と半角英数字の間には半角スペースを入れる

## コンポーネント設計原則

### 純粋なコンポーネントを保つ

- 同じ props に対して常に同じ JSX を返すこと
- props・state・context は読み取り専用として扱う
- レンダー中に外部変数を変更しない
- 副作用はイベントハンドラか `useEffect` 内で実装する

```typescript
// ✅ 純粋なコンポーネント
function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>
}

// ❌ レンダー中に副作用（禁止）
function BadComponent({ userId }: { userId: string }) {
  fetch(`/api/users/${userId}`) // レンダー中の API 呼び出し禁止
  return <div>...</div>
}
```

### データ取得

- データ取得には TanStack Query または SWR を使用する
- Server Components では直接 async/await でデータ取得可能

```typescript
// ✅ TanStack Query でのデータ取得
function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((r) => r.json()),
  })
  return <div>{user?.name}</div>
}
```

## TypeScript 規約

- `strict: true` を有効化（`noImplicitAny`, `strictNullChecks` を含む）
- `any` の使用を禁止（型が不明な場合は `unknown` を使用）
- 型アサーション（`as`）は極力避け、型ガードを使用する
- コンポーネントの Props は `interface` で定義する

```typescript
// ✅ Props の定義
interface ButtonProps {
  /** ボタンのスタイルバリエーション */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** クリック時のハンドラー */
  onClick?: () => void
  children: React.ReactNode
}
```

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `UserProfile` |
| 関数・変数 | camelCase | `handleClick` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 型・インターフェース | PascalCase | `UserData` |
| CSS クラス | kebab-case | `user-profile` |

## Git・コミット規律

コミットメッセージは**必ず日本語**で、以下の形式を使用してください。

```
<type>: <変更内容の説明>
```

| type | 用途 |
|------|------|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング |
| `docs` | ドキュメントの更新 |
| `style` | フォーマット変更（動作に影響しない） |
| `test` | テストの追加・修正 |
| `chore` | ビルド設定・依存関係の更新 |

### コミット前チェックリスト

- [ ] TypeScript エラーゼロ（`npm run typecheck`）
- [ ] ESLint エラー・警告ゼロ（`npm run lint`）
- [ ] ビルド成功（`npm run build`）
- [ ] コンポーネントの純粋性を保持している
