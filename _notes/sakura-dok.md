---
title: さくらの高火力DOKでLlama3.1をGRPOトレーニング
date: 2025-02-25
tags: AI さくらインターネット Docker
toc: true
---

## 前置き

さくらの高火力DOKとは、さくらインターネットのコンテナ型GPUクラウドサービスです。ざっくり言うと、Dockerイメージをアップして、強力なGPU環境で動かせるサービスです。

2025年4月30日まで、NVIDIA H100 (80GB) が1時間400円弱で使えるキャンペーンをやっているとのことで、試してみました。
初回のみ3000円分の無料枠があるので、7時間ちょっとその枠内で試せます。

[さくらインターネット、コンテナー型GPUクラウドサービス「高火力 DOK」にて「AI開発応援キャンペーン」を実施 \| さくらインターネット](https://www.sakura.ad.jp/corporate/information/newsreleases/2025/01/21/1968218168/)

<br>

## やること

今回は、高火力DOKでJupyterLabを動かして、Llama3.1をGRPOトレーニングするサンプルノートを動かします。

<br>

## 手順

### ノートのダウンロード

まず以下のノートを開いて、 File -> Download -> Download .ipynb を選択してダウンロードします。

[Llama3.1\_(8B)-GRPO.ipynb - Colab](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_(8B)-GRPO.ipynb) [^1]

<br>

### 高火力DOK

0. 未登録の人は登録してください: <https://www.sakura.ad.jp/koukaryoku-dok/>
1. 高火力DOKのコントロールパネルにログイン
2. タスク -> 新規作成 -> 以下を入力して作成
    - イメージ: `quay.io/jupyter/pytorch-notebook:cuda12-python-3.12` [^2]
    - HTTP: On
      - ポート: 8888
    - プラン: h100-80gb [^3]
3. 「開始日時」欄が表示されるまでしばらく待つ
  - 「状態」欄に「実行中...」と出ても、まだ起動してない状態らしい（課金も発生してないっぽい）です
  - 「ログを表示」を押しても何も表示されないので、ただ待つ以外にないです。これは改善して欲しいところです。
4. 「開始日時」欄に日時が表示されたら、ログを開く
    - `http://localhost:8888/lab?token=`とあるので、それ以降の文字列をマウスで選択して右クリックでコピーする [^4]
4. HTTP URI を別タブで開く
    - JupyterLabのログイン画面が開くので、さきほどのtoken文字列を"Password or token"欄に貼り付けてログイン

<br>

### JupyterLab


1. ダウンロードした`Llama3_1_(8B)_GRPO.ipynb`をドラッグアンドドロップしてアップロード
2. 最初のセルの1行目にある`%%capture`を削除
  - これがあると出力が抑制されるので、動いているのがわかりづらい
3. Run -> Run All Cells

合計30分ほどで終了しました。

<br>

### 結果保存

高火力DOKでは、`/opt/artifact/`に保存したファイルを、タスク終了後にダウンロードすることができます。[^5]

そこで、必要に応じて今回の成果物を`/opt/artifact/`にコピーしておきます。

JupyterLabでターミナルを開いて、以下のコマンドを実行します。

```sh
cp -r grpo_saved_lora grpo_trainer_lora_model outputs Llama3_1_\(8B\)_GRPO.ipynb /opt/artifact/
```

<br>

## タスク終了

高火力DOKのコントロールパネルで「中断」ボタンを押して、タスクを終了します。

終了後しばらくすろと、`/opt/artifact/`に保存されているファイルがダウンロードできるようになります。

![image](/assets/sakura-dok/screenshot-artifact.png)

<br>

## おまけ

### 同じものをローカル環境で動かしたい場合

**前提**

- NVIDIA GPUが搭載されていること
- Dockerがインストールされていること
- NVIDIA Container Toolkitがインストールされていること
  - 参考: [NVIDIA Container Toolkit のインストール \| ryomo’s tech blog](/notes/nvidia-container-toolkit)

**docker run**

```sh
docker run -it --rm -p 8888:8888 --gpus all -v .:/home/jovyan/work quay.io/jupyter/pytorch-notebook:cuda12-python-3.12
```

- `-v .:/home/jovyan/work`でカレントディレクトリをコンテナ内の`/home/jovyan/work`にマウントしています。`/home/jovyan/work`はJupyterLabの作業ディレクトリです。
  - ホスト側とコンテナ内でユーザーが異なるので、書き込み権限に注意してください。

<br>

### nvidia-smi

ファインチューニング中にJupyterのターミナルで`nvidia-smi`を実行したら、以下のように表示されました。
GPUメモリが余っているのがちょっともったいない感じです。

```sh
(base) jovyan@41633dc3-ad9d-42ef-b9a3-09964217c968:~$ nvidia-smi
Tue Feb 25 04:57:39 2025
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.183.06             Driver Version: 535.183.06   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA H100 80GB HBM3          Off | 00000000:00:09.0 Off |                    0 |
| N/A   49C    P0             411W / 700W |  54725MiB / 81559MiB |     55%      Default |
|                                         |                      |             Disabled |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
+---------------------------------------------------------------------------------------+
```

<br>

## :notebook: 注釈

[^1]: [Train your own R1 reasoning model locally (GRPO) - Unsloth](https://unsloth.ai/blog/r1-reasoning)で紹介されているものです。
[^2]: Jupyterの公式ブログ[CUDA enabled Jupyter Docker Images \| by Ayaz Salikhov \| Jupyter Blog](https://blog.jupyter.org/cuda-enabled-jupyter-docker-images-8a9f8b8f2158)で紹介されているイメージです。[jupyter/pytorch-notebook · Quay](https://quay.io/repository/jupyter/pytorch-notebook?tab=tags)からCUDA入りのを選びました。
[^3]: v100も選べますが、古いのでトラブルの元です。v100は[Compute Capability](https://developer.nvidia.com/cuda-gpus)が7.0で、Google Colab無料枠のT4が7.5なので、それよりも低い。メモリは32GBもあるんですけどね。実際動かしてみたら`"The kernel for Llama3_1_(8B)_GRPO.ipynb appears to have died. It will restart automatically."`と出てしまいました。
[^4]: ログ画面ではなぜかCtrl+Cでコピーできないので、マウスで選択して右クリックでコピーする必要があります。
[^5]: [定義済み環境変数について \| タスクの実行方法 \| さくらのクラウド マニュアル](https://manual.sakura.ad.jp/cloud/koukaryoku-container/running-tasks.html?_gl=1*1wmxybg*_gcl_au*MjgwNzkzNDM5LjE3Mzk5MjY1Njg.#koukaryoku-container-environment-variables) にある通り、`SAKURA_ARTIFACT_DIR`で定義されています。ただし、サポートへ問い合わせたところ、この環境変数は変更できないとのことです。
