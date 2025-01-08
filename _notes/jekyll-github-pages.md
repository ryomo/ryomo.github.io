---
title: GitHub Pagesで最新のJekyllを使う方法
date: 2024-12-31
tags: Jekyll GitHub
toc: true
---

## GitHub PagesでJekyllを使う際の問題点

[GitHub Pagesの公式ドキュメント](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)に従うと、Jekyllのバージョンが3.xになってしまうという問題がある。

Jekyllは4.xになって久しいので、3.xだとほとんどのテーマでトラブルが起きるし、GitHub PagesのJekyllではそもそもプラグインを追加できないという問題もある。

**参考**

* [Support for Jekyll 4.0 · Issue #651 · github/pages-gem](https://github.com/github/pages-gem/issues/651)
* [Dependency versions \| GitHub Pages](https://pages.github.com/versions/)


## 方針

そこで、GitHub Actionsを使ってJekyll4を使う方法を記載する。

さらに、ローカルでもJekyll4環境を構築する。これにより、ローカルで確認しながら記事を書けるようになる。

（なお、ローカルで環境を構築すれば、ローカルでbuildもできるのだから、それをGitHub Pagesに上げればGitHub Actionを動かさなくてもサイト表示はできると思われる。）

<br>

## ローカル

先にローカル側の環境構築を行う。


### インストール

WSL上でUbuntuを使っている場合、基本的に下記の公式ドキュメントに従えばOK。

<https://jekyllrb.com/docs/installation/ubuntu/>

#### ruby

まずはrubyをインストール

```sh
sudo apt install ruby-full build-essential zlib1g-dev
```

.bashrcに以下を追記

```sh
# RubyGem
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"
```

* Jekyllの公式ドキュメントには、`GEM_HOME="$HOME/gems`とあるが、おそらくより一般的な`GEM_HOME="$HOME/.gem"`にしておいた


#### JekyllとBundler

次にJekyllとBundlerをインストール

```sh
gem install jekyll bundler
```

* インストール先は`$GEM_HOME`になる


### 基本的なコマンド

以下の2つのコマンドを実行すれば、ローカルでJekyllのサイトを表示できる。

#### new

```sh
jekyll new PATH
```

PATHに新しいJekyllサイトの骨組みを作成する

* `jekyll new .`とすれば現ディレクトリに作られる
* この時点ではGemfileが無いので、`bundle exec ~`を付けると動かない


##### serve

```sh
bundle exec jekyll serve --livereload
```

日本語: buildして、ローカルのWebサーバーを起動し、<http://localhost:4000> でサイトを表示する

* `--livereload`: ファイルを変更するたびにサイトを再構築する

<br>

以上で、ローカルでJekyll4の環境が構築できた。


<br>

## GitHub Actions

次に、GitHub Actionsを使ってJekyll4をGitHub Pagesにデプロイする方法を記載する。

基本的に[Jekyllの公式ドキュメント](https://jekyllrb.com/docs/continuous-integration/github-actions/)に従う。

まず、[Setting up the Action \| GitHub Actions \| Jekyll](https://jekyllrb.com/docs/continuous-integration/github-actions/#setting-up-the-action) に従って、

`{ユーザー}.github.io`リポジトリで、

1. Settings -> Pages -> Source -> "GitHub Actions"を選択
2. Actions -> New workflow -> "Jekyll"を検索して"Configure"
   * 検索時にJekyllと付くものがいくつか出てくるが、"Jekyll"を選ぶこと
3. コミット

本来ならば、これ以降デフォルトブランチに変更をプッシュするたびに、自動でbuild&deployされるはず。

が、build中にエラーが起きてたので、下記の通りその対応を行った。

<br>

### トラブルシューティング

#### `Error: The current runner (ubuntu-24.04-x64) was detected as self-hosted because ~` というエラーについて

`.github/workflows/jekyll.yml`に以下の変更を加えた。

```yaml
-        uses: ruby/setup-ruby@8575951200e472d5f2d95c625da0c7bec8217c42 # v1.161.0
+        uses: ruby/setup-ruby@v1
```

**参考**

* [Faild in ubuntu-24.04 runner · Issue #595 · ruby/setup-ruby](https://github.com/ruby/setup-ruby/issues/595) を見ると修正済みだったので、上記の通りsetup-rubyのバージョンの固定を外すことで解決した。
* JekyllのGitHub Actionについても、Pull request が出ていた。[Update setup-ruby in Jekyll workflow to support ubuntu-24.04 by kachick · Pull Request #2538 · actions/starter-workflows](https://github.com/actions/starter-workflows/pull/2538)

<br>

#### `activesupport-8.0.1 requires ruby version >= 3.2.0, which is incompatible with the current version, 3.1.4` というエラーについて

Rubyのバージョンを上げれば良いだけなので、下記のようにした。

```yaml
-          ruby-version: '3.1' # Not needed with a .ruby-version file
+          ruby-version: '3.2' # Not needed with a .ruby-version file
```

今度はbuildに成功し、そのままdeployされた。

<br>

なお、ここまで別のブランチで試行錯誤していたが、mainブランチ以外ではdeployできないようにしてあるので、マージした時点でdeployまで動いた。

<br>

これでリポジトリに記事をpushするだけで、自動でサイトが更新されるようになった。

<br>

## 結果

以上で、ローカルで確認してGitHub Pagesにデプロイする環境が整った。

<br>

## その他

### SassがminimaなどでDeprecation Warning

Sassがminimaなどのテーマで`Deprecation Warning: ~`を大量に出す件は、最近（2024年12月現在）のSassのアップデートによるもの。そのうちminima等のアップデートで直ると思われる。


**対処法**

基本的には放置で良いが、`_config.yml`に以下を書くと大幅にWarningが減る。

```yaml
sass:
  quiet_deps: true
```

* <https://github.com/jekyll/jekyll/issues/9686#issuecomment-2362850868>

<br>

### 残っている課題

* Markdownで、GitHub Flavored Markdownの機能の全ては使えない状態
* h1, h2, h3 などがリンクにならない
* 見た目を変えたい
