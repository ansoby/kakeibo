# Guideline

## Top-Level Rules

- Run independent processes concurrently, not sequentially.
- 思考・回答・コミットメッセージ・PR の説明・Issue のコメント・ドキュメントは、すべて日本語で書く。
- Save temp design notes as `./.tmp/` in Markdown.
- Be critical, not obedient—but stay respectful.

## Context

- Document System: @docs/document_system/README.md

## Documents

- Product Index: @docs/product/INDEX.md
- Development Index: @docs/development/INDEX.md
- Development Philosophy: @docs/development/philosophy.md
- Operations Index: @docs/operations/INDEX.md

## Project

ブラウザだけで動く家計簿（React + TypeScript + Vite + Tailwind CSS v4）。データは localStorage に置く。
KAGAYOI Engineering のハンズオンの題材で、**誰が何度作っても同じ結果になること**を重んじる。

- 仕様は `docs/product/spec.md`、見た目は `docs/product/design.md` に従う。仕様で決まっていることを人に質問しない。
- 仕様が決めていないことは、既存のコードと部品の書き方に寄せて決め、PR の説明に書く。仕様に無い機能を足さない。
- 仕様を変える・足す Issue では、先に `docs/product/spec.md` を直す。

## 機能の足し方

- 機能は `src/features/<名前>/index.tsx` を作り、`feature`（置き場所・並び順・部品）を export するだけで画面に載る。
  置き場所と並び順は `docs/product/spec.md` の「画面」の表に従う。
- `src/app/`・`src/ui/`・`src/store/`・`src/lib/` は共通の土台で、並行して進む他の Issue と衝突しやすい。Issue が求めない限り変えない。
  機能だけで使う計算や部品は、その機能のディレクトリに置く。
- 画面は `src/ui/` の部品とトークンのクラスだけで組む。任意の値・色の直書き・`style` は `npm run lint` で落ちる。

## 確かめ方

- 変更したら `npm run check`（型検査・lint・テスト）を通す。失敗を抑止のコメントや設定の緩和で黙らせない。
- 計算（合計・並び順・書き出しの形）はその機能のディレクトリにテストを書く。画面はテストで `renderApp`（`src/test-utils.tsx`）を使い、本物の localStorage で確かめる。自分のモジュールをモックしない。
- 画面の変更は `npm run dev` で起動し、ブラウザで操作して確かめる。
