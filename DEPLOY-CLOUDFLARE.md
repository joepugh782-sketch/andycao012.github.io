# Cloudflare Pages 发布指南

当前默认网站为曹佳豪暗色作品集，使用 React + Vite，纯静态，无需服务器、数据库、API Key 或运行时环境变量。`?version=petalyx` 是保留的备用设计入口。

## 1. 确认 GitHub 文件完整

仓库：<https://github.com/joepugh782-sketch/andycao012.github.io>

`main` 分支根目录应包含 `package.json`、`package-lock.json`、`index.html`、`.nvmrc`、`vite.config.js`，以及 `src/`、`public/`、`scripts/`。只有一个 `index.html` 无法构建此 React 网站。`node_modules/`、`dist/`、`tmp/`、`preview/` 不应上传。

`.nvmrc` 固定 Node.js 24.16.0，与本地构建使用的版本一致。字体文件及 SIL OFL 许可证一起保存于 `public/fonts/`。

## 2. 在 Cloudflare 连接仓库

1. 打开 <https://dash.cloudflare.com/> 并登录。
2. 进入 **Workers & Pages**，点击 **Create application / 创建应用程序**。
3. 选择 **Pages**，再选 **Import an existing Git repository / Connect to Git / 导入现有 Git 仓库**。不同语言界面按钮名称可能稍有差异。
4. 选择 **GitHub**，授权 **Cloudflare Workers & Pages**。如果可选，只授权 `andycao012.github.io` 这一个仓库即可。
5. 选中 `joepugh782-sketch/andycao012.github.io`，点击 **Begin setup / 开始设置**。
6. 按下表填写，然后点击 **Save and Deploy / 保存并部署**。

| 字段 | 填写内容 |
| --- | --- |
| Project name / 项目名称 | `caojiahao-portfolio`；若被占用，可加自己的数字后缀 |
| Production branch / 生产分支 | `main` |
| Framework preset / 框架预设 | `React (Vite)`；若没有此选项，选 `None` 后手动填写下面两项 |
| Build command / 构建命令 | `npm run build` |
| Build output directory / 构建输出目录 | `dist` |
| Root directory / 根目录 | 留空，使用仓库根目录；不要填本机 `/Users/...` 路径 |
| Environment variables / 环境变量 | 留空；`.nvmrc` 已指定 Node 版本 |
| Deploy command / 部署命令 | Pages Git 构建无需填写；若要求输入 `npx wrangler deploy`，请返回选择 Pages 创建流程 |

Cloudflare 会安装依赖、构建并上传 `dist` 内容，不必手动上传 `dist`，也不必添加 Wrangler 配置。

## 3. 免费网址与域名

部署成功后，Cloudflare 会提供实际的 `https://项目名称.pages.dev` 地址。第一次发布无需购买域名，**Custom domains / 自定义域名** 暂时留空。

网站使用 `#about`、`#work`、`#expertise`、`#contact` 锚点，无需增加 SPA 路由重写。发布到 Pages 域名根目录，Vite 默认 `base: '/'` 适用。

以后每次将更新推送到 `main`，Pages 会自动重新构建和发布。

## 4. 发布后检查

复制部署成功页上的实际 `pages.dev` 地址，回到聊天中提供该地址，以便检查 HTTPS、首页、字体、视频、五组作品封面与详情、手机导航和 PDF 下载。

本地检查命令：

```sh
npm ci
npm run build
npm run check:pages
```

Cloudflare Pages 单个静态资源上限为 25 MiB。网页使用的 `public/portfolio.pdf` 是 32 页网页下载优化版（约 14.74 MiB，含其他设计）；原始 PDF 保留在最初提供的个人作品集文件夹中，不改动原件。

官方资料：[构建设置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[GitHub 集成](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)、[文件大小限制](https://developers.cloudflare.com/pages/platform/limits/)、[Node 版本设置](https://developers.cloudflare.com/pages/configuration/build-image/)。
