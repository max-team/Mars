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

## 文档教程
[https://max-team.github.io/Mars/](https://max-team.github.io/Mars/)

## 案例

### 多端案例

| | 百度智能小程序 | H5 |
|-|-|-|
| 装馨家 | ![](./docs/assets/qr-jiazhuang.png) | [![](./docs/assets/qr-jiazhuang-h5.png)](https://jia.baidu.com/m#/pages/home/index) |
| 健康养生说 | ![](./docs/assets/qr-yangsheng.png) | [![](./docs/assets/qr-yangsheng-h5.png)](https://sp0.baidu.com/5LMDcjW6BwF3otqbppnN2DJv/health.pae.baidu.com/medauth/healthpage/#/pages/list/index) |
| 百股精 |  | [![](./docs/assets/qr-baigujing-h5.png)](http://finance.pae.baidu.com/selfselect/#/pages/index/index) |


### 小程序案例

| 百度百聘 | 百拍智能构图 | 百看君 | 百度作业模式 | 爱眼日 |
|-|-|-|-|-|
| ![](./docs/assets/qr-baipin.png) | ![](./docs/assets/qr-huabao.png) | ![](./docs/assets/qr-fuli.png) | ![](./docs/assets/qr-zuoye.png) | ![](./docs/assets/qr-aiyan.png) |

## Packages & CHANGELOGs

| package | version | CHANGELOG |
|-|-|-|
| @marsjs/core | [![](https://img.shields.io/npm/v/@marsjs/core.svg)](https://www.npmjs.com/package/@marsjs/core) | [CHANGELOG](https://max-team.github.io/Mars/CHANGELOGS-0.3/core.html) |
| @marsjs/build | [![](https://img.shields.io/npm/v/@marsjs/build.svg)](https://www.npmjs.com/package/@marsjs/build) | [CHANGELOG](https://max-team.github.io/Mars/CHANGELOGS-0.3/build.html) |
| @marsjs/cli | [![](https://img.shields.io/npm/v/@marsjs/cli.svg)](https://www.npmjs.com/package/@marsjs/cli) | [CHANGELOG](https://max-team.github.io/Mars/CHANGELOGS-0.3/cli.html) |
| @marsjs/cli-template | [![](https://img.shields.io/npm/v/@marsjs/cli-template.svg)](https://www.npmjs.com/package/@marsjs/cli-template) | [CHANGELOG](https://max-team.github.io/Mars/CHANGELOGS-0.3/cli-template.html) |
| @marsjs/api | [![](https://img.shields.io/npm/v/@marsjs/api.svg)](https://www.npmjs.com/package/@marsjs/api) | [CHANGELOG](https://max-team.github.io/Mars/CHANGELOGS/api.html) |
| @marsjs/components | [![](https://img.shields.io/npm/v/@marsjs/components.svg)](https://www.npmjs.com/package/@marsjs/components) | |

## Contributing & Discussion

请参考 [如何贡献](./CONTRIBUTING.md)

欢迎提 Issue 和 PR。

百度员工可以加 Hi 群：1659354
