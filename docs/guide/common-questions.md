# 常见问题

### 我想在 H5 编译结束后，将产物推送到开发机，如何知道构建已完成？

H5 的编译，会先生成 H5 工程文件，之后使用 vue-cli-service 进行编译。vue-cli-service 使用 webpack 编译，因此我们可以使用 `webpack.ProgressPlugin` 插件来获取编译进度，具体设置在 vue.config.js 中增加：

```js
configureWebpack: {
    plugins: [
        new webpack.ProgressPlugin((percentage, message, ...args) => {
            if (percentage === 1) {
                console.log('do something');
            }
        })
    ]
}
```

### 新增的文件没有触发编译？

执行 `mars serve` 后，新增了文件，发现不能够触发编译。请检查 mars.config.js 文件，是否自己设置了 watch。

gulp.watch 不能设置为绝对路径或 `./` 开头的路径，否则不能自动监测到新增文件，例如：`./src/**/*` 需要改为 `src/**/*`。

详细说明见：https://stackoverflow.com/questions/22391527/gulps-gulp-watch-not-triggered-for-new-or-deleted-files 。

### 为什么我升级了 `@marsjs/api` 和 `@marsjs/components` 构建产物却没有变化？

这是 `@vue/cli` 插件 `@vue/cli-plugin-babel` 中使用 `cache-loader` 的一个 Bug，导致 `transpileDependencies` 中的 npm 升级后不会更新缓存，在官方修复这个 Bug 之前，可以通过在更新 `transpileDependencies` 包之后手动删除 H5 产出目录下的`node_modules/.cache` 目录来解决。

相关 Issue：

[https://github.com/vuejs/vue-cli/issues/4438](https://github.com/vuejs/vue-cli/issues/4438)

[https://github.com/vuejs/vue-cli/issues/3635](https://github.com/vuejs/vue-cli/issues/3635)

[https://github.com/vuejs/vue-cli/issues/2450](https://github.com/vuejs/vue-cli/issues/2450)

[https://github.com/webpack-contrib/cache-loader/issues/34](https://github.com/webpack-contrib/cache-loader/issues/34)