# ryomo's tech blog

## 概要

このリポジトリは、Jekyllを使って作成した技術ブログのリポジトリです。

自分でブログを始めたい場合は [GitHub Pagesで最新のJekyllを使う方法 | ryomo’s tech blog](https://ryomo.github.io/notes/jekyll-github-pages) を参照してください。


## インストール

### Jekyllのインストール

rubyをインストール

```sh
sudo apt install ruby-full build-essential zlib1g-dev
```

.bashrcに以下を追記

```sh
# RubyGem
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"
```

JekyllとBundlerをインストール

```sh
gem install jekyll bundler
```

### リポジトリのクローン

```sh
git clone git@github.com:ryomo/ryomo.github.io.git
cd ryomo.github.io/
bundle install
```


## プレビュー

```sh
bundle exec jekyll serve --livereload
```

http://localhost:4000 でサイトを表示
