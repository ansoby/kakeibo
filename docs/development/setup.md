# 開発環境セットアップ

## 前提

[mise](https://mise.jdx.dev/) が入っていること。**それ以外のツールの版はすべて `mise.toml` が持つ**。

## 2 コマンド

```sh
mise install     # mise.toml の [tools] を入れる（Node.js と lefthook）
mise run setup   # 依存と git hooks を導入する
```

`mise run setup` は冪等なので何度実行してもよい。起動は `mise run dev`（http://127.0.0.1:5173）。

新しいツールを足すときは、`mise.toml` の `[tools]` に版を pin し、導入手順を `[tasks.setup]` へ足す。
**この 2 コマンドで環境が整う状態を保つ**。

## mise の無い環境（KAGAYOI Engineering の Agent のコンテナ）

コンテナには Node.js 24.21.0 があり、mise と Python は無い。アプリの検査は npm だけで回せる。

```sh
npm ci
npm run check
```

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバ（127.0.0.1:5173） |
| `npm run check` | 型検査・lint・テストをまとめて流す。**変更したら必ず通す** |
| `npm run format` | 整形と import の並べ替え |
| `npm run build` | 本番のビルド |
| `mise run lint:docs` | ドキュメントの書式契約の検査（Python 3） |
| `mise run check` | フルチェック（`lint:docs` と `npm run check`） |

`npm run lint` は Biome に加え、`scripts/check-styles.mjs` で見た目の書き方（`docs/product/design.md`）を検査する。

## 依存

- 依存を足すときは版を固定し（`npm install --save-exact`）、`package-lock.json` もコミットする。
- Agent のコンテナから届くのは npm のレジストリと GitHub だけである。CDN・Web フォント・外部 API に頼らない。

## KAGAYOI Engineering の設定

`.kagayoi/` は KAGAYOI Engineering が読む設定で、読み方は `.kagayoi/README.md` にある。

- `launch.json`: プレビューでアプリを起動するコマンドとポート。開発サーバのポートやコマンドを変えたら、このファイルも合わせる。
- 工程ごとの指示は、リポジトリではなく Board の **設定 → 工程ごとの指示** で編集する。

## CI

CI は PR の変更範囲で実行内容を分ける。

| 変更範囲 | 実行 |
|---|---|
| `docs/` 配下のみ | `mise run lint:docs`（書式契約だけ） |
| それ以外を含む | `npm ci` の後に `mise run check`（フルチェック） |

検査を足すときは `package.json` の `check` か、`mise.toml` の `[tasks.check]` の `depends` に加える。CI は変えない。
必須ステータスチェックには、どちらの分岐でも結果を返す `result` ジョブを指定する。
