# Cloudflare Tunnel

用于把 NAS 内网作品集公开到：

```text
https://wcc.2004.kdns.fr
```

Cloudflare Tunnel 公共主机名配置：

```text
Hostname: wcc.2004.kdns.fr
Service type: HTTP
Service URL: 192.168.1.21:8088
```

使用步骤：

1. 在 Cloudflare Zero Trust 创建 Cloudflare Tunnel。
2. 平台选择 Docker，复制命令里的 token。
3. 复制 `.env.example` 为 `.env`。
4. 把 token 填到 `.env` 的 `CLOUDFLARED_TOKEN=` 后面。
5. 在飞牛 Docker 的 Compose 里选择本目录并启动。

以后新增其他作品集时，可以继续在同一个 Tunnel 添加 Public Hostname：

```text
other.2004.kdns.fr -> http://192.168.1.21:8089
```
