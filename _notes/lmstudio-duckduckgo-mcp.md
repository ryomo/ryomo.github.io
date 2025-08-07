---
title: LM StudioにDuckDuckGoのMCPを追加する
date: 2025-08-07
image: /assets/lmstudio-duckduckgo-mcp/screenshot-mcp-search.png
tags: AI LMStudio MCP
toc: true
---


## 概要

LM StudioにDuckDuckGoのMCPを追加したら、ローカルLLMがDuckDuckGoの検索結果を取得できるようになって便利だったという話。

![image](/assets/lmstudio-duckduckgo-mcp/screenshot-mcp-search.png)

<br>

## 設定

### uvのインストール

Windowsの場合:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Mac / Linuxの場合:

```sh
curl -fsSL https://astral.sh/uv/install.sh | sh
```

- [Installation \| uv](https://docs.astral.sh/uv/getting-started/installation/)

<br>

### MCPの設定

LM Studioのチャット欄にある、🔌マークをクリックして、"Install"をクリックすると、

![image](/assets/lmstudio-duckduckgo-mcp/screenshot-mcp-config.png)

`mcp.json`が開くので、以下の内容を追加する。

```json
{
  "mcpServers": {
    "duckduckgo": {
      "command": "uvx",
      "args": [
        "duckduckgo-mcp-server"
      ]
    }
  }
}
```

- [nickclyde/duckduckgo-mcp-server](https://github.com/nickclyde/duckduckgo-mcp-server)

<br>

## 使い方

あとは迷うところはないと思います。LM StudioでduckduckgoのMCPが有効になっている状態で、チャットで質問するだけです。

モデルによっては「duckduckgoを使って検索して」と言わないとダメかもしれませんが、gpt-oss-20bでは冒頭のように「検索して」とかで大丈夫でした。

<br>

## ちなみに

MCPなしで gpt-oss-20b を実行したら、、、

![image](/assets/lmstudio-duckduckgo-mcp/screenshot-gorilla-rabbit.png)
