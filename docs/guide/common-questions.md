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