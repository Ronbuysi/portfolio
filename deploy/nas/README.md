# NAS Docker 部署说明

这个目录用于在飞牛 fnOS 的 Docker 里运行作品集静态网站。

当前配置使用 `8088` 端口，避免覆盖 `5666/5667` 的 fnOS 管理后台。

## 目录结构

```text
portfolio/
  docker-compose.yml
  nginx.conf
  site/
    index.html
    assets/
    images/
    video/
```

## 在 fnOS Docker 启动

1. 打开飞牛 fnOS 的 Docker 应用。
2. 进入 Compose / 项目，新建项目。
3. 项目名称填写 `wcc-portfolio`。
4. 项目路径选择当前 `portfolio` 文件夹。
5. 使用本目录里的 `docker-compose.yml`。
6. 勾选创建后立即启动。

启动后，内网访问：

```text
http://192.168.1.21:8088/
```

如果已经创建过项目，修改配置后请在 Docker 里重新创建或重启该 Compose 项目。

## 给外部访客访问

`192.168.1.21` 是内网地址，外面的人不能直接打开。需要在路由器里做端口转发：

```text
外部端口 8088 -> NAS 192.168.1.21:8088
```

之后外部访客使用：

```text
http://你的公网IP:8088/
```

如果要更正式，建议绑定域名并配置 HTTPS 反向代理。

```bash
docker compose up -d
```
