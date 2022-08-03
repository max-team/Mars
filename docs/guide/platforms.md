# 多端适配

## 设计稿尺寸单位

框架默认开启 px 单位转换功能，在小程序中会转换为 `rpx`，在 H5 中会转换为 `rem`。

将编译配置中 `designWidth` 设置为实际设计稿的宽度值，在开发汇总书写尺寸即可按照 1:1 的关系来进行书写，即从设计稿上量的长度 100px，那么尺寸书写就是 100px。详细设置参考【编译配置】。


## 特性支持

### 全局方法

| 生命周期 | 小程序 | H5 |
|---|---|---|
| getApp | 支持 | 支持(可以获取到 app 实例及其属性和生命周期、支持 $api) | 
| getCurrentPages | 支持 | 支持(已支持获取到 route 和 uri，其他信息暂未支持) | 


### 配置

#### App

| 配置属性 | 小程序 | H5 |
|---|---|---|
| pages | 支持 | 支持 |
| tabBar | 支持 | 见下方 |
| window | 支持 | 见下方 |
| preloadRule | 支持| 不支持 |
| subpackages | 支持 | 不支持 |

`tabBar`

| 配置属性 | 小程序 | H5 |
|---|---|---|
| backgroundColor | 支持 | 支持 |
| borderStyle| 支持 | 支持 |
| color	| 支持 | 支持 |
| list | 支持 | 见下方 |
| selectedColor	| 支持 | 支持 |

`tabBar.list: Array<item: Object>`

list 接受一个数组，tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：

| 配置属性 | 小程序 | H5 |
|---|---|---|
| pagePath | 支持 | 支持 |
| text | 支持 | 支持 |
| iconPath | 支持 | 支持 |
| selectedIconPath | 支持 | 支持 |

`window`

| 配置属性 | 小程序 | H5 |
|---|---|---|
| navigationBarBackgroundColor | 支持 | 支持 |
| navigationBarTextStyle | 支持 | 支持 |
| navigationBarTitleText | 支持 | 支持 |
| navigationStyle | 支持 | 不支持 |
| backgroundColor | 支持 | 支持 |
| backgroundTextStyle | 支持 | 支持 |
| enablePullDownRefresh | 支持 | 支持 |
| onReachBottomDistance | 支持 | 支持 |


#### Page

| 配置属性 | 小程序 | H5 |
|---|---|---|
| navigationBarBackgroundColor | 支持 | 支持 |
| navigationBarTextStyle | 支持 | 支持 |
| navigationBarTitleText | 支持 | 支持 |
| navigationStyle | 支持 | 支持 |
| backgroundColor | 支持 | 支持 |
| backgroundTextStyle | 支持 | 支持 |
| enablePullDownRefresh | 支持 | 支持 |
| onReachBottomDistance | 支持 | 支持 |
| disableScroll | 支持 | 支持 |


### 生命周期和事件方法

Mars (在 Page 和 Componet 上)支持完整的 Vue 生命周期和小程序生命周期，对应的映射关系如下，建议开发者使用 Vue 生命周期来开发。

#### App
| 生命周期 | 小程序 | H5 |
|---|---|---|
| onLaunch | 支持 | 支持 |
| onShow | 支持 | 支持 |
| onHide | 支持 | 支持 |
| onError | 支持 | 不支持 |
| onPageNotFound | 支持 | 不支持 |

#### 页面 Page
| 生命周期 | 小程序 | H5 |
|---|---|---|
| beforeCreate | 支持 | 支持 |
| created | 支持(onLoad时调用) | 支持 |
| beforeMount | 支持(onReady前调用) | 支持 |
| mounted | 支持(onReady时调用) | 支持 |
| beforeUpdate | 支持(setData前调用) | 支持 |
| updated | 支持(视图更新后调用) | 支持 |
| beforeDestroy | 支持(onUnload时调用) | 支持 |
| destroyed | 支持(onUnload时调用) | 支持 |
| onShow | 支持 | 支持(映射为 activated) |
| onHide | 支持 | 支持(映射为 deactivated) |
| onLoad | 支持 | 支持(映射为 created) |
| onReady | 支持 | 支持(映射为 mounted) |
| onUnload | 支持 | 支持(映射为 destroyed) |


| 页面方法 | 小程序 | H5 |
|---|---|---|
| onPullDownRefresh | 支持 | 支持 |
| onReachBottom | 支持 | 支持 |
| onPageScroll | 支持 | 支持 |
| onTabItemTap | 支持 | 支持 |
| onBeforePageBack | 仅安卓支持 | 暂不支持 |
| onForceReLaunch | 支持 | 暂不支持 |
| onShareAppMessage | 支持 | 暂不支持 |

#### 组件 Component

| 生命周期 | 小程序 | H5 |
|---|---|---|
| beforeCreate | 支持 | 支持 |
| created | 支持 | 支持 |
| beforeMount | 支持(ready前调用) | 支持 |
| mounted | 支持(ready时调用) | 支持 |
| beforeUpdate | 支持(setData前调用) | 支持 |
| updated | 支持(视图更新后调用) | 支持 |
| beforeDestroy | 支持(detached时调用) | 支持 |
| destroyed | 支持(detached时调用) | 支持 |
| pageLifetimes.onShow | 支持 | 支持(映射为 activated) |
| pageLifetimes.onHide | 支持 | 支持(映射为 deactivated) |
| lifetimes.created | 支持 | 支持(映射为 created) |
| lifetimes.attached | 支持 | 支持(映射为 beforeMount) |
| lifetimes.ready | 支持 | 支持(映射为 mounted) |
| lifetimes.detached | 支持 | 支持(映射为 destroyed) |


### 特性

#### Component 构造器

这里只列出小程序特有的特性，生命周期和 Vue 单文件组件具有的特性请参考上述【生命周期和页面方法】以及【Vue 特性支持 - 自定义组件】。

| 字段 | 小程序 | H5 |
|---|---|---|
| options | 支持 | 不支持 |
| externalClasses | 支持 | 不支持 |
| behaviors | 不支持 | 不支持 |
| definitionFilter | 不支持 | 不支持 |


## 多端不同业务逻辑适配方法

1、JS 逻辑适配

环境判断条件：`process.env.MARS_ENV`

::: tip
`process.env.MARS_ENV` 会在编译时进行静态替换，所以不能当做变量使用，只能静态使用。替换后并进行 dead code elimination，不符合平台判断的代码块会在编译时移除。
:::

```js
if (process.env.MARS_ENV === 'h5') {
    // 此代码块里的内容只渲染到h5端
    // todo ...
}
else if (process.env.MARS_ENV === 'swan') {
    // 此代码块里的内容只渲染到swan端
    // todo ...
}
else if (process.env.MARS_ENV === 'wx') {
    // 此代码块里的内容只渲染到wx端
    // todo ...
}
```

2、template 逻辑适配

通过模板`<template-mars target="h5/swan/wx">`判断

```html
<template-mars target="h5" > // 在H5端渲染为<template>
    ...
</template-mars>

<template-mars target="swan"> // 在swan渲染为<block>，wx同理
    ...
</template-mars>
```

3、style 逻辑适配

通过` <style target="h5/swan/wx">`判断
style 标签不需要写scoped 编译过程统一加

```html
<style target="swan/wx">
// 此处的style 会与其他style 按顺序合并到一个 style标签，编译到swan/wx
</style>

<style target="h5">
// 此处的style直接编译到H5端，单独style标签存在
</style>

```

