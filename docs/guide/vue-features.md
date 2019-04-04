# Vue 语法特性支持

## 模板语法

- 支持插值（暂不支持v-html、不支持复杂表达式，开发中）
- 支持指令（某些修饰符不支持，参考指令文档）
- 支持缩写

**注意**：表达式只支持 [swan 支持的表达式](https://smartprogram.baidu.com/docs/develop/framework/view_data/)，不支持 swan `{= =}` 双向绑定和 Filter 过滤器


## 计算属性

- 支持


## Class 和 Style 绑定

- 部分支持（不支持 classObject 和 styleObject），见示例

```html
<view class="static" :class="{ active: isActive, 'text-danger': hasError }"></view>
<view class="static" :class="[{ active: isActive }, errorClass]"></view>
<view :style="{ color: activeColor, fontSize: fontSize + 'px' }" style="text-align: center"></view>
<view :style="[{ color: activeColor, fontSize: fontSize + 'px' }, {textAlign: 'center'}]"></view>
```


## 条件渲染

- 支持 v-if
- 支持 v-show
- **注意**：小程序内用 `<block>` 来表示不可见的虚拟包裹元素，在 `<template>` 上使用 v-if 需要使用小程序的 `<block>` 标签


## 列表渲染

- 支持 v-for （暂不支持对象的 v-for 和一段取值范围的 v-for）
- **注意**：小程序内用 `<block>` 来表示不可见的虚拟包裹元素，在 `<template>` 上使用 v-for 需要使用小程序的 `<block>` 标签
- **注意**：由于小程序视图模板限制 v-if 与 v-for 不能同时用于同一节点，需自行处理）



## 事件处理

- 支持（事件名使用小程序事件名，如 @tap）
- 支持内联调用方法并绑定参数（**注意**：参数绑定实际上是通过 dataset 实现，调用时取到的参数是经过序列化的值，而不是原参数的引用;参数暂时只支持传单个值，暂不支持传对象和数组字面量）
- 修饰符暂只支持`.stop`


## 表单输入绑定

- 支持 v-model


## 自定义组件

- data：需要是函数（**注意**：不支持在 data 中获取 props 的值作为初始值，首次渲染会获取不到）
- props：支持
- slot：支持
- scoped-slot：支持（基于 v2.5.21 语法）
- 自定义事件：支持
- refs：支持通过 refs 访问组件实例（暂不支持 refs 访问视图元素）
- 动态组件 & 异步组件：不支持
- **注意**：由于小程序组件渲染不能在渲染时设置数据，目前只有 data 函数返回的默认值/props的值/此时计算出的计算属性值 作用于组件的首次渲染，其他的数据更新都会在组件首次渲染完成后再更新



## 可复用性 & 组合

- 插件和过滤器：暂不支持（开发中）
- mixin：暂不支持（计划中）
- 自定义指令、渲染函数、JSX：不支持

## 规模化

- vuex：暂不支持（开发中）