<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/05652ead-a98d-43be-b01a-03ccff031e79

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Docker 安装与运行

**前置要求：** 已安装 [Docker](https://docs.docker.com/get-docker/)。

### 构建镜像

在项目根目录执行：

```bash
# 仅构建（API Key 可在应用内「设置」中配置）
docker build -t aitarot .

# 构建时注入 Gemini API Key（可选，会写入前端构建产物）
docker build -t aitarot --build-arg GEMINI_API_KEY=你的API密钥 .
```

### 运行容器

```bash
# 后台运行，映射到本机 8080 端口
docker run -d -p 8080:80 --name aitarot aitarot
```

浏览器访问 **http://localhost:8080** 即可使用。

### 常用命令

```bash
# 停止并删除容器
docker stop aitarot && docker rm aitarot

# 查看运行中的容器
docker ps
```

---

## 上传镜像到阿里云

将构建好的镜像推送到阿里云容器镜像服务（ACR），便于在阿里云 ECS、ACK 等环境部署。

### 1. 开通并准备阿里云镜像仓库

1. 登录 [阿里云容器镜像服务](https://cr.console.aliyun.com/)。
2. 若未开通，按提示开通「个人版」或「企业版」实例。
3. 在「命名空间」中创建命名空间（如 `my-ns`）。
4. 在「镜像仓库」中创建仓库，选择该命名空间，仓库名如 `aitarot`，类型选「私有」或「公开」。

记下你的 **地域**（如 `cn-hangzhou`）和 **命名空间**，下面会用到。

### 2. 登录阿里云镜像仓库

在终端执行（将 `cn-hangzhou` 换成你的地域，如 `cn-shanghai`、`cn-beijing`）：

```bash
docker login registry.cn-hangzhou.aliyuncs.com
```

按提示输入阿里云账号（即镜像仓库登录名）和密码（开通 ACR 时设置的镜像仓库密码，可在控制台「访问凭证」中设置/查看）。

### 3. 给本地镜像打标签

格式：`registry.<地域>.aliyuncs.com/<命名空间>/<仓库名>:<标签>`

```bash
# 示例：地域 cn-hangzhou，命名空间 my-ns，仓库名 aitarot，标签 latest
docker tag aitarot registry.cn-hangzhou.aliyuncs.com/my-ns/aitarot:latest
```

请将 `cn-hangzhou`、`my-ns` 替换为你自己的地域和命名空间；仓库名与在 ACR 中创建的一致。

### 4. 推送镜像到阿里云

```bash
docker push registry.cn-hangzhou.aliyuncs.com/my-ns/aitarot:latest
```

推送完成后，在阿里云控制台「镜像仓库」→ 对应仓库 → 「镜像版本」中可看到该镜像。

### 5. 在服务器上拉取并运行（可选）

在已安装 Docker 的阿里云 ECS 或其他机器上：

```bash
# 登录（同上）
docker login registry.cn-hangzhou.aliyuncs.com

# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/my-ns/aitarot:latest

# 运行
docker run -d -p 8080:80 --name aitarot registry.cn-hangzhou.aliyuncs.com/my-ns/aitarot:latest
```

访问该机器的 **http://<服务器IP>:8080** 即可使用。
