# 0.3.x 迁移指南

## What's new

`0.3.x` 版本最主要的更新是去掉运行时中 Vue 渲染和更新过程生成 VNode 和 patch 的过程，使得运行时无需创建 VNode 以及进行 VNode 的 DIFF，从而大幅提升了运行时性能，因为去除了 VNode，也简化了 Vue 的 render 函数，从而减小了包大小。

## 是否兼容

`0.3.x` 版本与 `0.2.x` 版本在开发规范层面完全兼容，但是由于 `0.3.x` 重构了运行时，在一些功能特性上有较小的差异和注意点需要检查。

1、computed

`0.2.x` 版本为了优化小程序初始渲染时能获取到 computed 值，进行了一些变通的处理，因为这些处理方法依赖预先创建完整的 Vue 组件树，以及会有一些性能开销。在 `0.3.x` 中，我们移除了对 computed 值的特殊处理，你需要检查是否依赖 computed 值的初始获取。

2、小程序 attached 生命周期

`0.3.x` 中组件对应的 vue 实例创建时机统一到小程序的 `lifetimes.attached` 生命周期，导致在 swan 的 lifetimes.created 生命周期中将无法通过 this 获取到 vue 实例，`lifetimes.created` 中 `this` 中仅可以访问 `$api` 和 `$mp.scope` （指向小程序组件实例）属性。如果有在 `lifetimes.created` 生命周期中通过 `this` 获取和操作 vue 实例，需要将逻辑迁移至小程序的 `lifetimes.attached` 或者 vue 的 `created` 生命周期。

3、事件绑定参数传递

`0.3.x` 在事件绑定中绑定参数时，`$event` 参数只支持作为单独的参数绑定，不支持将 `$event` 放在数组或对象字面量中。例如：

```html
<!-- 支持 -->
<Component @change="handle($event, otherArg, {otherArg})" />

<!-- 不支持 将获取不到 $event -->
<Component @change="handle({$event, otherArg}, otherArg)" />
```

4、npm 引入的 UI 组件库以及组件库作者

如果有使用 npm 引入的 UI 组件库，需要将组件库中的 Mars 框架升级到 `0.3.x` 并发布新版本。


## 如何迁移

1、新建项目并转移业务代码

安装 `0.3.x` 版本的 `@marsjs/cli`，创建一个新项目，然后将业务代码和配置文件合并转移到项目中。

2、从现有项目迁移

- 升级 `@marsjs/cli` 版本到 `0.3.x`
- 升级本地的 `@marsjs/core` `@marsjs/build` `@marsjs/cli-template` 版本到 `0.3.x`
