# Athenz UI メンバー表示機能改善設計書

## 概要

Athenz UIのロールおよびグループのメンバー表示機能に、ページネーション、表示件数切り替え、クライアントサイドフィルタリング機能を追加する設計書です。

## 現状分析

### 技術スタック
- **フレームワーク**: Next.js 14.2.26 + React 18.2.0
- **状態管理**: Redux + Redux Toolkit 1.8.5
- **UIライブラリ**: @denali-design/react, Emotion
- **開発環境**: Jest + React Testing Library

### 現在の実装状況
1. **全件表示方式**: ページネーション機能なし
2. **フィルタリング**: UserRoleTableのみ実装済み
3. **カスタムHooks**: 未実装
4. **文字列定数**: `/src/components/constants/constants.js`で一元管理

## アーキテクチャ設計

### 1. ディレクトリ構造

```
src/
├── hooks/                        # 新規作成
│   ├── usePagination.js         # ページネーション状態管理
│   ├── useMemberFilter.js       # フィルタリング状態管理
│   └── useDebounce.js           # デバウンス処理
├── components/
│   ├── member/
│   │   ├── MemberList.js        # 修正: フィルタリング機能追加
│   │   ├── MemberTable.js       # 修正: ページネーション機能追加
│   │   ├── MemberRow.js         # 既存のまま
│   │   └── Pagination.js        # 新規: ページネーションコンポーネント
│   ├── role/
│   │   └── RoleUserTable.js     # 修正: ページネーション機能追加
│   └── group/
│       └── GroupTable.js        # 修正: ページネーション機能追加
└── constants/
    └── constants.js             # 修正: ページネーション関連定数追加
```

### 2. 状態管理設計

#### usePagination Hook

```javascript
// 状態
{
  currentPage: 1,              // 現在のページ番号
  itemsPerPage: 30,           // 1ページあたりの表示件数
  totalItems: 0,              // 全アイテム数
  totalPages: 0,              // 総ページ数
}

// インターフェース
{
  currentPage,
  itemsPerPage,
  totalPages,
  paginatedData,              // 現在のページのデータ
  setCurrentPage,
  setItemsPerPage,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  getPageNumbers,             // 表示するページ番号の配列を返す
}
```

#### useMemberFilter Hook

```javascript
// 状態
{
  searchText: '',             // 検索テキスト
  debouncedSearchText: '',    // デバウンス後の検索テキスト
  filteredData: [],          // フィルタリング後のデータ
}

// インターフェース
{
  searchText,
  filteredData,
  handleSearchChange,
  clearFilter,
}
```

### 3. コンポーネント設計

#### Pagination Component

```javascript
// Props
{
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
  itemsPerPage: number,
  onItemsPerPageChange: (items: number) => void,
  itemsPerPageOptions: [30, 50, 100],
}

// 機能
- ページ番号の表示（最大9個、現在のページを中心に動的に変更）
- 前へ/次へボタン
- 表示件数セレクター
- "ページ番号 / 総ページ数" の表示
```

#### MemberTable 修正内容

```javascript
// 追加する機能
1. usePagination フックの利用
2. Pagination コンポーネントの組み込み
3. ページネーション対応のデータスライス処理
```

#### MemberList 修正内容

```javascript
// 追加する機能
1. useMemberFilter フックの利用
2. 検索ボックスの追加
3. フィルタリング結果0件時のメッセージ表示
```

### 4. UI/UXデザイン

#### ページネーションUI
```
[<] [1] [2] [3] ... [7] [8] [9] [>]  ページ 3 / 9  表示件数: [30▼]
```

#### 検索ボックス
```
[🔍 メンバーを検索...]
```

#### 0件表示
```
該当するメンバーが見つかりません
```

### 5. 実装の優先順位

#### フェーズ1: 基盤実装
1. カスタムHooksの作成
   - useDebounce
   - useMemberFilter
   - usePagination
2. Paginationコンポーネントの作成
3. 定数の追加

#### フェーズ2: MemberTable/MemberListへの適用
1. MemberTableへのページネーション機能追加
2. MemberListへのフィルタリング機能追加
3. テストの作成

#### フェーズ3: Role/Groupへの展開
1. RoleUserTableへの適用
2. GroupTableへの適用
3. 統合テスト

## テスト戦略（TDD）

### 1. Hooksのテスト

#### useDebounce
- 入力値の変更後、指定時間後に値が更新されることを確認
- 連続入力時は最後の入力のみが反映されることを確認

#### useMemberFilter
- 検索テキストによるフィルタリングが正しく動作することを確認
- 大文字小文字を区別しない検索の確認
- 空文字での全件表示の確認

#### usePagination
- ページ計算が正しいことを確認
- ページ遷移が正しく動作することを確認
- 表示件数変更時のページ番号リセットの確認

### 2. コンポーネントのテスト

#### Pagination
- ページ番号が正しく表示されることを確認
- クリックイベントが正しく発火することを確認
- 表示件数の変更が正しく動作することを確認

#### MemberTable/MemberList
- ページネーション・フィルタリング統合動作の確認
- エッジケース（0件、1ページのみ）の確認

## パフォーマンス考慮事項

1. **メモ化の活用**
   - React.memo でコンポーネントの再レンダリング抑制
   - useMemo でページデータの計算結果をキャッシュ

2. **デバウンスの実装**
   - 検索入力は200msのデバウンス処理

3. **仮想化の検討**
   - 将来的に1000件以上のデータを扱う場合は react-window の導入を検討

## セキュリティ考慮事項

1. **XSS対策**
   - 検索テキストのサニタイゼーション
   - ReactのデフォルトエスケープによるXSS防止

2. **入力値検証**
   - ページ番号の範囲チェック
   - 表示件数の妥当性チェック

## 移行計画

1. **段階的導入**
   - 新機能はフィーチャーフラグで制御可能にする
   - 既存機能への影響を最小限に抑える

2. **後方互換性**
   - URLパラメータでのページ指定は将来の機能として保留
   - 既存のAPIはそのまま使用（クライアントサイドでの処理）

## 今後の拡張性

1. **サーバーサイドページネーション**
   - API側でのページネーション対応（将来的な検討事項）

2. **高度なフィルタリング**
   - 複数条件でのフィルタリング
   - ソート機能の追加

3. **状態の永続化**
   - LocalStorageでのページ設定保存
   - URLパラメータでの状態管理

## リスクと対策

### リスク
1. 大量データでのパフォーマンス低下
2. 既存機能への影響
3. ブラウザ互換性

### 対策
1. パフォーマンステストの実施
2. 段階的なリリースとA/Bテスト
3. Polyfillの適用とブラウザテストの実施