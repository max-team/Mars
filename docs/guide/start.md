# 快速开始

## 安装和使用

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
mars serve [--target, -t swan (默认) | wx | h5]

# 构建模式
mars build [--target, -t swan (默认) | wx | h5]

```

## 开发规范

### 文件组织结构
App、Page、Component 使用 vue 单文件组件规范，定义在 `.vue` 文件中，其中 `<script>` 需使用 ES module 模式导出（即 `export default {}`）

建议的目录结构如下，其中 `app.vue` 为 APP 入口文件，无需包含 `<template>` 区块：

```
├── src                    源码目录
|   ├── components         组件目录
|   ├── pages              页面目录
|   |   └── index          index 页面目录
|   |       ├── banner     index 页面私有组件或其他资源文件等
|   |       └── index.vue  index 页面
|   ├── common             公共资源目录
|   ├── app.vue            APP 入口文件
|   └── project.swan.json  小程序 project 文件
├── package.json
└── mars.config.js         编译配置文件
```

## 编译配置

项目根目录下的 `mars.config.js` 为编译配置文件。

框架预置的默认配置如下，在 `mars.config.js` 中的配置会与默认配置进行深度 merge (默认配置中同名的配置项会被自定义配置覆盖，包括数组，数组不会进行 concat，如需要请自行处理)。

自定义配置导出类型如下：

Type：`(target: string) => Object`

### 配置项

#### `projectFiles`
小程序配置文件列表，每次编译时时不会从 `dest` 删除

#### `source`
需要编译的单文件组件(SFC)源代码文件 glob

#### `dest`  
编译产出目录

#### `assets`
需要复制到 `dest` 的文件 glob

#### `watch`
需要监听的文件 glob

#### `designWidth`
设计稿尺寸换算单位(px)。

将 `designWidth` 设置为实际设计稿的宽度值，在开发汇总书写尺寸即可按照 1:1 的关系来进行书写，即从设计稿上量的长度 100px，那么尺寸书写就是 100px。

如果设置了 `designWidth`，则会开启 css 单位转换功能，在小程序中会转换为 `rpx`，在 H5 中会转换为 `rem` （规定 1rem = 100px）。

#### `module`
各个编译模块的配置，目前支持 `module.postcss.px2units`。

Type of `module.postcss.px2units`: `options: Object | false`

options 配置请参考 [postcss-px2units](https://www.npmjs.com/package/postcss-px2units)。

#### `preprocessors`
Type: `{[name: string]: processor}`

Type of `processor`: `extnames: config`

Type of `config`: `{ extnames: Array<lang> [, options: Object, process: process | void]}`

Type of `process`: `(source: string, options: Object) => string`

预处理器，可以为 SFC 中各种语言类型的 block 设置预处理器（其语言类型由 `lang` 属性指定），预处理器将在 SFC 每一个 `block` 编译之前调用。

调用内置处理器可以通过 `name` 来指定要调用的处理器名称，通过 `extnames` 来设置处理器生效的语言类型，通过 `processor.options` 来设置传给处理器的选项。

目前提供的内置处理器有

- `babel` 即 `@babel/core`
- `less`
- `stylus`
- `scss`
- `postcss`
- `typescript`

如果内置处理器不能满足需求，也可以通过 `processor.process` 来设置自定义处理器。

#### `postprocessors`
后处理器，配置同 `preprocessors`。后处理器将在 SFC 每一个 `block` 编译之后调用。


### 默认配置
```js

module.exports = function (target) {
    const config = {
        projectFiles: ['project.swan.json', 'project.config.json'],
        source: ['src/**/*.vue'],
        dest: target === 'h5' ? './dist-h5/src' : `./dist-${target}`,
        assets: [
            'src/**/*.!(vue)'
        ],
        designWidth: 750,
        watch: ['src/**/*'],
        modules: {
            postcss: {
                px2units: {}
            }
        },
        preprocessors: {
            less: {
                extnames: ['less']
            },
            sass: {
                extnames: ['sass', 'scss']
            },
            stylus: {
                extnames: ['stylus', 'styl']
            },
            typescript: {
                extnames: ['ts']
            }
        },
        postprocessors: {
            postcss: {
                extnames: ['less', 'sass', 'scss', 'stylus', 'styl'],
                options: {
                    plugins: [require('autoprefixer')]
                }
            }
        }
    };

    return config;
};

```

### 配置示例

```js

module.exports = function (target) {
    const config = {
        designWidth: 640,
        modules: {
            postcss: {
                px2units: {
                    // px2units options
                }
            }
        },
        postprocessors: {
            postcss: {
                extnames: ['less', 'sass', 'scss', 'stylus', 'styl'],
                options: {
                    plugins: [require('autoprefixer')]
                }
            }
        }
    };

    return config;
};

```
