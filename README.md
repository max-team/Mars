# Mars - Vue 驱动的多端开发框架

`Mars` 是由 Vue 驱动的多端开发框架，其语法规范完全遵循 Vue，支持一套代码同时运行到百度小程序、微信小程序以及 H5 Web 端。

## 快速开始

```bash
# 安装 mars-cli
npm install -g @marsjs/cli

# 创建项目
mars create [projectName]

# 可选项：
# 是否支持 H5，如需支持 H5 请选择：小程序和 H5
? 选择创建项目类型： (Use arrow keys)
❯ 小程序和 H5
  仅小程序

# 开发模式
# 如果 target 是小程序，需要用小程序开发工具打开对应的 dist 目录
mars serve [--target, -t swan (default) | wx | h5]

# 构建模式
# 如果 target 是小程序，需要用小程序开发工具打开对应的 dist 目录
mars build [--target, -t swan (default) | wx | h5]

```

更多教程请访问 [https://max-team.github.io](https://max-team.github.io)


## 案例

||百度智能小程序|H5|
|-|-|-|
|装馨家|![装馨家小程序](./docs/assets/qrcode-mp-online.png)|![装馨家 H5](./docs/assets/qrcode-h5-online.png)|

## Contributing & Discussion

请参考 [如何贡献](./CONTRIBUTING.md)

欢迎提 Issue 和 PR。
