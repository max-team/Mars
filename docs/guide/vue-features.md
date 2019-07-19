# Vue 特性

## 模板语法

- 支持插值（暂不支持v-html）
- 支持 v- 指令（某些修饰符不支持，参考指令文档）
- 支持缩写

::: warning
`build@0.2.13` `core@0.2.7` 起支持过滤器（filters）和复杂表达式（包括函数调用），之前的版本只支持 [swan 支持的表达式](https://smartprogram.baidu.com/docs/develop/framework/view_data/)。

为了区分简单表达式，使用复杂表达式需要在表达式最外层加上 `()`，如下示例。

filters 可以在插值和 props 中使用，复杂表达式可以在插值、props、v-if、v-else-if、v-for 中使用。
:::


```html
{{( Math.random() )}}  // => 0.21836891324389485
{{ btnText | capitalize}}

<view l="0,2,0" :test="reverse(btnText) | capitalize">

<view v-if="(Math.random() > 0.5)">v-if="Math.random() > 0.5"</view>
<view v-else-if="(Math.random() > 0.5)">v-else-if="(Math.random() > 0.5)"</view>
<view v-else>v-else</view>

<view v-for="item in (split(btnText))">{{item}}</view>
```

## 计算属性

- 支持

::: tip
为了实现计算属性的初始值能应用到组件初次渲染（否则可能会导致视图闪动），计算属性的初始值会通过 `props` 方式从 Page 传给组件。为了性能注意不要通过计算属性返回大量数据。
:::

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

::: warning
`build@0.2.50` 起支持可选将 v-for 上的 key 编译为 swan 的 trackBy，开启方法为在 v-for 节点上加上 `use-trackby` 属性。
:::

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
- scoped-slot：部分支持（基于 v2.5.21 语法，swan 和 H5 支持，wx 平台暂不支持）
- 自定义事件：支持
- refs：支持通过 refs 访问组件实例（暂不支持 refs 访问视图元素）
- 动态组件 & 异步组件：不支持
- **注意**：由于小程序组件渲染不能在渲染时设置数据，目前只有 data 函数返回的默认值/props的值/此时计算出的计算属性值 作用于组件的首次渲染，其他的数据更新都会在组件首次渲染完成后再更新


## 可复用性 & 组合

- 过滤器：支持
- mixin：暂不支持（计划中）
- 插件、自定义指令、渲染函数、JSX：不支持

::: warning
`build@0.2.12` `core@0.2.6` 起支持过滤器（filters），暂时只支持局部定义过滤器。
:::

## Vuex

Mars 中使用 Vuex 的方法与 Vue 类似，首先在 app.vue 中引入 Vue 和 Vuex，并初始化：

> 由于 Mars 使用定制的 Vue ，因此务必**从 @marsjs/core 中引入 Vue**。

```javascript
import {Vue} from '@marsjs/core';
import Vuex from 'vuex';

Vue.use(Vuex);
```

之后创建一个 store:

```javascript
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count++;
        }

    }
});
```

放在 app.vue 的 export 中：

```javascript
export default {
    config: {
        pages: [
            'pages/home/index',
            'pages/land/index',
            'pages/swan/index.swan'
        ],
        tabBar: {
            list: [{
                pagePath: 'pages/home/index',
                text: 'API'
            }, {
                pagePath: 'pages/land/index',
                text: 'Component'
            }, {
                pagePath: 'pages/swan/index.swan',
                text: 'Swan'
            }]
        },
        window: {
            navigationBarBackgroundColor: '#3eaf7c',
            navigationBarTextStyle: 'white'
        },
        networkTimeout: {
            request: 30000
        }
    },
    store,
    onLaunch() {},
    onShow() {}
};
```

完成，接下来就可以正常使用 vuex 了。

