---
title: NVIDIA Container Toolkit のインストール
date: 2025-02-19
tags: NVIDIA Docker
toc: true
---

- 2025-02-19 作成
- 2026-01-14 更新

## NVIDIA Container Toolkit とは

NVIDIA Container Toolkit は、Dockerコンテナ内でNVIDIA GPUを使うためのツール集です。

dockerコマンドで`--runtime=nvidia`オプションを渡す場合や、`FROM nvidia/cuda`と書かれたDockerfileを使う場合[^1]には、必須になってます。

前提として、DockerとNVIDIAドライバがインストールされている必要があります。

<br>

## インストール

[Installing the NVIDIA Container Toolkit — NVIDIA Container Toolkit documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

インストールは、基本的にはこの公式ドキュメントに従えばOKなんですが、NVIDIAのドキュメントは重複してたりあちこち散らばってたりするのでまとめました。

WSLでも同じ手順でOKです。

```sh
sudo apt-get update && sudo apt-get install -y --no-install-recommends \
   curl \
   gnupg2
```

```sh
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

```sh
sudo apt-get update
```

```sh
export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.18.1-1
  sudo apt-get install -y \
      nvidia-container-toolkit=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      nvidia-container-toolkit-base=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container-tools=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container1=${NVIDIA_CONTAINER_TOOLKIT_VERSION}
```

**初期設定**

<https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#configuring-docker>

```sh
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

Rootless modeは、自分は使ってないのでスキップ

<br>

## 動作確認

<https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html#running-a-sample-workload-with-docker>

```sh
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```

出力例

```
Wed Feb 19 02:54:45 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.86.16              Driver Version: 572.16         CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA RTX 2000 Ada Gene...    On  |   00000000:01:00.0 Off |                  N/A |
| N/A   41C    P3              8W /   35W |       0MiB /   8188MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+


+-----------------------------------------------------------------------------------------+
| Processes:
                    |
|  GPU   GI   CI              PID   Type   Process name
         GPU Memory |
|        ID   ID
         Usage      |
|=========================================================================================|
|  No running processes found
                    |
+-----------------------------------------------------------------------------------------+
```

以上です。

<br>

## :notebook: 注釈

[^1]: [nvidia/cuda - Docker Image \| Docker Hub](https://hub.docker.com/r/nvidia/cuda) を "NVIDIA Container Toolkit" で検索すると、 "The NVIDIA Container Toolkit⁠ for Docker is required to run CUDA images." って書いてあります。
