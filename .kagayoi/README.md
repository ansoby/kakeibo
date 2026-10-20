# .kagayoi

KAGAYOI Engineering がこのリポジトリから読む設定を置く。

## アプリの起動（launch.json）

`launch.json` は、Review で人の判断を待つ間にプレビューでアプリを起動するための、起動のコマンド（リポジトリの直下で実行する 1 行）とポートである。

- Host はレビューする PR の先頭（Issue のブランチ）から読む。
- Review の Agent が報告する起動の方法より優先される。
- JSON として読めないか、ほかの項目があると、Host は読まずに Agent の報告を使う。
- シンボリックリンクは読まれない。通常のファイルで置く。

## 工程ごとの指示

Design・Implement・Review で Agent に渡す指示は、Board の **設定 → 工程ごとの指示** で編集する。Host はこのディレクトリから指示を読まない。
