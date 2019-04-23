# 编译配置

项目根目录下的 `mars.config.js` 为编译配置文件。

框架预置的默认配置如下，在 `mars.config.js` 中的配置会与默认配置进行深度 merge (默认配置中同名的配置项会被自定义配置覆盖，包括数组，数组不会进行 concat，如需要请自行处理)。

自定义配置导出类型如下：

Type：`(target: string) => Object`

## 配置项

### `projectFiles`
小程序配置文件列表，每次编译时时不会从 `dest` 删除

### `source`
需要编译的单文件组件(SFC)源代码文件 glob

### `dest`  
编译产出目录

### `assets`
需要复制到 `dest` 的文件 glob

### `watch`
需要监听的文件 glob

### `designWidth`
设计稿尺寸换算单位(px)。

框架默认开启 px 单位转换功能（通过 `postcss-px2units` 插件），在小程序中会转换为 `rpx`，在 H5 中会转换为 `rem`。

将 `designWidth` 设置为实际设计稿的宽度值，在开发汇总书写尺寸即可按照 1:1 的关系来进行书写，即从设计稿上量的长度 100px，那么尺寸书写就是 100px。


### `module`
各个编译模块的配置。

#### `module.postcss.px2units`
Type: `options: Object | false`

`postcss-px2units` 插件配置，如果需要关闭 px 单位转换，将 `module.postcss.px2units` 设置为 `false` 即可。
options 配置请参考 [postcss-px2units](https://www.npmjs.com/package/postcss-px2units)。

### `preprocessors`
Type: `{[name: string]: processor}`

Type of `processor`: `{ extnames: Array<lang> [, options: Object, process: process]}`

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

### `postprocessors`
后处理器，配置同 `preprocessors`。后处理器将在 SFC 每一个 `block` 编译之后调用。

### `h5`

H5 特有编译配置，只影响 H5 的功能。

#### `h5.navigationBarHomeColor`
Type: enum('dark', 'light')

Home icon 颜色配置，默认 `dark`。

#### `h5.showNavigationBorder`
Type: boolean

是否显示 navigationBar 下划线，默认true。

#### `h5.mode`
Type: enum('history', 'hash')

设置 vue-router 的 mode，默认 `history`。

## 默认配置
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
                extnames: ['css', 'less', 'sass', 'scss', 'stylus', 'styl'],
                options: {
                    plugins: [require('autoprefixer')]
                }
            }
        }
    };

    return config;
};

```

## 配置示例

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
