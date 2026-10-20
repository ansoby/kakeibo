# kagayoi-handson-kakeibo

KAGAYOI Engineering のハンズオン用のサンプルリポジトリ。ブラウザだけで動く家計簿を、AI に Issue 単位で作らせる。

いまあるのは「取引の一覧」だけで、まだ記録もできない。作る機能は仕様（[`docs/product/spec.md`](docs/product/spec.md)）に書いてある。

## はじめに

1. このページの **Use this template** から、自分のアカウントにリポジトリを作る（公開・非公開どちらでもよい）
2. https://eng.kagayoi.pro/ にログインし、GitHub App を入れて、作ったリポジトリを選ぶ
3. Host を接続する

```sh
curl -fsSL https://cli.kagayoi.pro/install.sh | sh
kagayoi login
kagayoi start
```

## ハンズオン

Issue は **New issue** から雛形を選ぶだけで作れる。

### 1. Issue を 1 本、マージまで任せる

- 雛形「1. 収支の登録」で Issue を作り、Board で Backlog のカードを **Scope** へ移す
- 確認ポイントは、Board の設定の「人が確認する工程」で Design と Review をオンにする（Issue 画面で Issue ごとにも変えられる）
- Scope の上の **Start** を押す。「担当者の居ない Issue を自分の担当にする」に印が付いたまま進めると、AI が着手する
- Design では AI の設計を読んで承認する。Review では **プレビュー** を開き、記録して一覧に出るのを確かめてからマージする

### 2. 並列に実装する

- 雛形「2. カテゴリ別の内訳」「3. 月ごとの推移」「4. CSV の書き出し」で Issue を 3 つ作り、Scope へ移して **Start** を押す
- 3 つは画面の別の場所に載るので、同時に進めても衝突しない
- プレビューで記録を足して確かめるため、1 の Issue をマージしてから始める
- 色が付いたカードにだけ対応する
- 「2. カテゴリ別の内訳」の Design は、一度差し戻す。コメントには次を書く

  > 割合の四捨五入と、金額が同じときの並び順を、テストで確かめる観点として設計に書いてください

- 3 つとも終わったら、Board の **ふりかえりを始める** を押す。AI が差し戻しから学びを下書きするので、読んで直し、確定する

### 早く終わったら

- 雛形「5. 月の要約」「6. 月の切り替え」も試せる。
- Backlog の **AI と相談する** から、仕様に無いことを文で頼める（依頼）。AI がリポジトリを調べ、Issue の案を返す。たとえば次のようなもの。
  - 月の予算を決めて、超えたら知らせてほしい
  - 取引を間違えて記録したので、直したり消したりしたい
  - よく使うメモを、次から選べるようにしたい

## 手元で動かす

```sh
mise install
mise run setup
mise run dev     # http://127.0.0.1:5173
```

詳しくは [`docs/development/setup.md`](docs/development/setup.md)。
