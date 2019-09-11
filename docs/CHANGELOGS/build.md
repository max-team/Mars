# @marsjs/build

## [0.2.56](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.55...@marsjs/build@0.2.56) (2019-09-04)


### Bug Fixes

* **build:** fix filters in v-for and scoped-var in v-on args ([#172](https://github.com/max-team/Mars/issues/172)) ([1918b8a](https://github.com/max-team/Mars/commit/1918b8a))





## [0.2.55](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.54...@marsjs/build@0.2.55) (2019-08-21)


### Bug Fixes

* **build:** fix h5 app navigationStyle config and borderBottom ([#162](https://github.com/max-team/Mars/issues/162)) ([8910261](https://github.com/max-team/Mars/commit/8910261))


### Features

* **core & build:** 小程序 SFC 中支持 Vue.extend() 写法 ([#161](https://github.com/max-team/Mars/issues/161)) ([44a6cf5](https://github.com/max-team/Mars/commit/44a6cf5))





## [0.2.54](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.53...@marsjs/build@0.2.54) (2019-08-08)


### Features

* **build:** support use npm in wx ([9564c89](https://github.com/max-team/Mars/commit/9564c89))





## [0.2.53](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.52...@marsjs/build@0.2.53) (2019-08-05)


### Features

* **build:** 引入 sfc 组件时，支持 xxx.vue 写法 ([#155](https://github.com/max-team/Mars/issues/155)) ([e9d5fa5](https://github.com/max-team/Mars/commit/e9d5fa5))




## [0.2.52](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.51...@marsjs/build@0.2.52) (2019-07-19)


### Bug Fixes

* **build:** fix block config in component ([67515f0](https://github.com/max-team/Mars/commit/67515f0))


### Features

* **build:** components field support PascalCase ([#143](https://github.com/max-team/Mars/issues/143)) ([e7c08b2](https://github.com/max-team/Mars/commit/e7c08b2))
* **build:** support SFC config block ([#142](https://github.com/max-team/Mars/issues/142)) ([c4dfa54](https://github.com/max-team/Mars/commit/c4dfa54))


## [0.2.51](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.50...@marsjs/build@0.2.51) (2019-07-11)

**Note:** Version bump only for package @marsjs/build


## [0.2.50](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.49...@marsjs/build@0.2.50) (2019-07-04)


### Bug Fixes

* **build:** 支持用 use-trackby 开启 v-for 的 key 编译为 swan 的 trackBy (#128)


## [0.2.49](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.48...@marsjs/build@0.2.49) (2019-07-04)

### Revert

* **build:** swan 中将 v-for 上的 key 编译为 trackBy ([#124](https://github.com/max-team/Mars/issues/124)) ([30febdf](https://github.com/max-team/Mars/commit/30febdf))


## [0.2.48](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.47...@marsjs/build@0.2.48) (2019-07-03)


### Bug Fixes

* **build:** swan 中将 v-for 上的 key 编译为 trackBy ([#124](https://github.com/max-team/Mars/issues/124)) ([30febdf](https://github.com/max-team/Mars/commit/30febdf))



## [0.2.47](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.46...@marsjs/build@0.2.47) (2019-07-01)


### Bug Fixes

* **build:** add h5.useAOP option ([b90ffc6](https://github.com/max-team/Mars/commit/b90ffc6))



## [0.2.46](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.45...@marsjs/build@0.2.46) (2019-07-01)


### Bug Fixes

* **build:** 解决同步进入页面，跳转后在返回刷新的问题 & 添加使用AOP开关 ([acf39b7](https://github.com/max-team/Mars/commit/acf39b7))


## [0.2.45](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.44...@marsjs/build@0.2.45) (2019-06-27)


### Features

* **build:** 支持小程序AOP机制 ([#114](https://github.com/max-team/Mars/issues/114)) ([67c031a](https://github.com/max-team/Mars/commit/67c031a))


## [0.2.44](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.43...@marsjs/build@0.2.44) (2019-06-25)


### Bug Fixes

* 修复 vueComponentTagMap 中slider 的拼写错误 ([dbe5ee7](https://github.com/max-team/Mars/commit/dbe5ee7))


### Features

* **build:** 解决动态团片require context影响webpack打包的问题 ([#108](https://github.com/max-team/Mars/issues/108)) ([810dbb8](https://github.com/max-team/Mars/commit/810dbb8))


## [0.2.43](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.42...@marsjs/build@0.2.43) (2019-06-21)


### Features

* **build:** 去除多余overflow，支持页面内sticky ([1ef2fa9](https://github.com/max-team/Mars/commit/1ef2fa9))


## [0.2.42](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.41...@marsjs/build@0.2.42) (2019-06-20)

**Note:** Version bump only for package @marsjs/build


## [0.2.41](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.40...@marsjs/build@0.2.41) (2019-06-20)



### Bug Fixes

* **build:** 修复components检查时遇到的v-if/v-else 节点信息缺失问题 ([b2b3e5e](https://github.com/max-team/Mars/commit/b2b3e5e))


### Features

* **build:** 删除overflow-y，避免对 sticky 属性影响 ([440ed5f](https://github.com/max-team/Mars/commit/440ed5f))




## [0.2.40](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.39...@marsjs/build@0.2.40) (2019-06-20)


### Features

* **build:** 支持navigationStyle: custom & 升级转场动画和背景配置 ([#98](https://github.com/max-team/Mars/issues/98)) ([3a526aa](https://github.com/max-team/Mars/commit/3a526aa))




## [0.2.39](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.38...@marsjs/build@0.2.39) (2019-06-19)


### Bug Fixes

* **build:** 修复 ast 节点 component 信息收集问题 ([#96](https://github.com/max-team/Mars/issues/96)) ([c8d4352](https://github.com/max-team/Mars/commit/c8d4352))




## [0.2.38](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.37...@marsjs/build@0.2.38) (2019-06-19)


### Bug Fixes

* **build:** 修复因components属性type为StringLiteral时编译问题 ([5d2a898](https://github.com/max-team/Mars/commit/5d2a898))


### Features

* **build:** hideTabBar时 屏幕高度 & 单端文件打包优化，去掉非本端文件 ([fb67de2](https://github.com/max-team/Mars/commit/fb67de2))




## [0.2.37](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.36...@marsjs/build@0.2.37) (2019-06-19)


### Features

* **build:** hideTabBar时 屏幕高度 & 去掉模板中未用到的组件JS ([#86](https://github.com/max-team/Mars/issues/86)) ([6e10522](https://github.com/max-team/Mars/commit/6e10522))



## [0.2.36](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.35...@marsjs/build@0.2.36) (2019-06-11)


### Features

* **build & core:** class 和 style 属性支持使用过滤器 ([fe652db](https://github.com/max-team/Mars/commit/fe652db))



## [0.2.35](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.34...@marsjs/build@0.2.35) (2019-06-07)


### Features

* 支持 App.vue 大写 ([bf67dab](https://github.com/max-team/Mars/commit/bf67dab))



## [0.2.34](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.33...@marsjs/build@0.2.34) (2019-06-05)


### Features

* 兼容 App.vue 和 app.vue ([b37e161](https://github.com/max-team/Mars/commit/b37e161))


## [0.2.33](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.32...@marsjs/build@0.2.33) (2019-06-05)


### Bug Fixes

* **build:** subPackages里支持 按文件类型筛选，编译到小程序时去掉尾缀 ([9f5051f](https://github.com/max-team/Mars/commit/9f5051f))



## [0.2.32](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.31...@marsjs/build@0.2.32) (2019-06-04)


### Features

* **build:** 支持app.vue route添加文件类型筛选 ([4161775](https://github.com/max-team/Mars/commit/4161775))


## [0.2.31](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.30...@marsjs/build@0.2.31) (2019-06-04)


### Bug Fixes

* **bug:** 修复因兼容tabBar style 配置引入的bug：缺少tabBar会报错 ([e0ae976](https://github.com/max-team/Mars/commit/e0ae976))


## [0.2.30](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.29...@marsjs/build@0.2.30) (2019-06-03)


### Bug Fixes

* 组件中没有child，只有 scopedslot 时，scopedslot 不会被渲染 ([c0b7309](https://github.com/max-team/Mars/commit/c0b7309))


## [0.2.29](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.28...@marsjs/build@0.2.29) (2019-05-30)


### Features

* **build:** support subPackages config ([1e6c5a8](https://github.com/max-team/Mars/commit/1e6c5a8))


## [0.2.28](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.27...@marsjs/build@0.2.28) (2019-05-30)


### Features

* **build:** support tabBar style config ([25eed6a](https://github.com/max-team/Mars/commit/25eed6a))


## [0.2.27](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.26...@marsjs/build@0.2.27) (2019-05-29)


### Bug Fixes

* **build:** compatible with older versions ([36bb19b](https://github.com/max-team/Mars/commit/36bb19b))


## [0.2.26](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.25...@marsjs/build@0.2.26) (2019-05-29)


### Features

* **build:** add PWA feature ([a7bdbd0](https://github.com/max-team/Mars/commit/a7bdbd0))


## [0.2.25](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.24...@marsjs/build@0.2.25) (2019-05-22)


### Bug Fixes

* **build:** 修复 '||' 被识别为过滤器 ([#59](https://github.com/max-team/Mars/issues/59)) ([22dfd00](https://github.com/max-team/Mars/commit/22dfd00))



## [0.2.24](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.23...@marsjs/build@0.2.24) (2019-05-14)


### Features

* **build: (require core@0.2.9+)** 支持 npm 方式引入组件库 [#34](https://github.com/max-team/Mars/issues/34) ([b428d64](https://github.com/max-team/Mars/commit/b428d64))

* **build & core: (require core@0.2.9+)** add h5 runtime entry ([f1f7ff9](https://github.com/max-team/Mars/commit/f1f7ff9))


## [0.2.23](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.22...@marsjs/build@0.2.23) (2019-05-13)


### Bug Fixes

* **build:** remove eval from webpack output ([#53](https://github.com/max-team/Mars/issues/53)) ([932a98a](https://github.com/max-team/Mars/commit/932a98a))



## [0.2.22](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.21...@marsjs/build@0.2.22) (2019-05-13)


### Bug Fixes

* **build:** watching stopped when compile error ([1626613](https://github.com/max-team/Mars/commit/1626613))


### Features

* **build & core:** 支持 Vuex ([#46](https://github.com/max-team/Mars/issues/46)) ([173a329](https://github.com/max-team/Mars/commit/173a329))


## [0.2.21](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.20...@marsjs/build@0.2.21) (2019-05-10)


### Bug Fixes

* **build:** add default value for process.env.MARS_ENV_TARGET ([8eb4f2d](https://github.com/max-team/Mars/commit/8eb4f2d))


## [0.2.20](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.19...@marsjs/build@0.2.20) (2019-05-10)


### Features

* **build:** add mars config useTransition ([57421c1](https://github.com/max-team/Mars/commit/57421c1))
* **build:** update target condition and support App and fix postcss ([ad0e2c4](https://github.com/max-team/Mars/commit/ad0e2c4))



## [0.2.19](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.18...@marsjs/build@0.2.19) (2019-05-09)


### Bug Fixes

* **build:** bad path generated while building in windows ([#48](https://github.com/max-team/Mars/issues/48)) ([f60fa38](https://github.com/max-team/Mars/commit/f60fa38))



## [0.2.18](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.17...@marsjs/build@0.2.18) (2019-05-07)


### Bug Fixes

* **build:** fix h5 style scoped and fix component map ([b92de1e](https://github.com/max-team/Mars/commit/b92de1e))
* **build:** write file error on windows ([4e2f90d](https://github.com/max-team/Mars/commit/4e2f90d))


## [0.2.17](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.16...@marsjs/build@0.2.17) (2019-04-25)

### Bug Fixes

* **build:** 修复页面不滚动跳转后返回定位的问题 ([92b01bb](https://github.com/max-team/Mars/commit/92b01bb))



## [0.2.16](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.15...@marsjs/build@0.2.16) (2019-04-25)


### Refactor

* **build:** 升级getApp 项目中的 app.vue 文件在编译到 H5 时保留独立 sfc ([4667930](https://github.com/max-team/Mars/commit/4667930))


## [0.2.15](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.14...@marsjs/build@0.2.15) (2019-04-25)


### Bug Fixes

* **build:** fix vue-template-compiler version compare error ([#42](https://github.com/max-team/Mars/issues/42)) ([3498c68](https://github.com/max-team/Mars/commit/3498c68))


## [0.2.14](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.13...@marsjs/build@0.2.14) (2019-04-23)


### Features

* **build:** H5 getCurrentPages 支持返回历史页面栈信息 ([#39](https://github.com/max-team/Mars/issues/39)) ([a327656](https://github.com/max-team/Mars/commit/a327656))



## [0.2.13](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.12...@marsjs/build@0.2.13) (2019-04-22)


### Features

* **core & build:** 微信小程序支持 filter 和复杂表达式 ([9fdb951](https://github.com/max-team/Mars/commit/9fdb951))



## [0.2.12](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.11...@marsjs/build@0.2.12) (2019-04-19)


### Features

* **core & build:** 支持过滤器和复杂表达式 ([2e13b5e](https://github.com/max-team/Mars/commit/2e13b5e), [086e848](https://github.com/max-team/Mars/commit/086e848))



## [0.2.11](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.10...@marsjs/build@0.2.11) (2019-04-17)


### Bug Fixes

* **build:** add 'css' to default postcss extnames ([eecbbe4](https://github.com/max-team/Mars/commit/eecbbe4))



## [0.2.10](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.9...@marsjs/build@0.2.10) (2019-04-17)

### Features

* **core & build:** 支持跳过实例更新时跳过 computed 通过 properties 传给小程序 ([6dcf61c](https://github.com/max-team/Mars/commit/6dcf61c))


## [0.2.9](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.8...@marsjs/build@0.2.9) (2019-04-17)


### Bug Fixes

* **build:** bind v-show/v-model value in case of no other getters ([b3e58c0](https://github.com/max-team/Mars/commit/b3e58c0))


## [0.2.8](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.7...@marsjs/build@0.2.8) (2019-04-16)


### Features

* make H5 compatible with mp comp and pages ([1c38d88](https://github.com/max-team/Mars/commit/1c38d88))



## [0.2.7](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.6...@marsjs/build@0.2.7) (2019-04-16)


### Bug Fixes

* **build:** fix ios safari white screen ([f4e5739](https://github.com/max-team/Mars/commit/f4e5739))



## [0.2.6](https://github.com/max-team/Mars/compare/@marsjs/build@0.2.3...@marsjs/build@0.2.6) (2019-04-12)


### Bug Fixes

* **build:** disable px2units for h5 App Style ([38f7996](https://github.com/max-team/Mars/commit/38f7996))
* **build:** page 中 config 可能不存在 ([fca5a1f](https://github.com/max-team/Mars/commit/fca5a1f))
* **build:** preprocessors merge 错误，不能设置 options ([b54850c](https://github.com/max-team/Mars/commit/b54850c))


### Features

* **build:** js 编译增加 process.env.NODE_ENV 替换 ([0e8fea1](https://github.com/max-team/Mars/commit/0e8fea1))
* **build:** mars-cli info ([16cc438](https://github.com/max-team/Mars/commit/16cc438))
* **build:** mars-cli update ([d6863d1](https://github.com/max-team/Mars/commit/d6863d1))
* **build:** move config file parse to @marsjs/build ([c906d5e](https://github.com/max-team/Mars/commit/c906d5e))
* **build/cli-template:** pass postcss config to vue-cli postcss-loader ([d66d4f7](https://github.com/max-team/Mars/commit/d66d4f7))
* **build:** support config api/components packages ([842848c](https://github.com/max-team/Mars/commit/842848c))
* **build:**  add page api onPageScroll and onTabItemTap ([#6](https://github.com/max-team/Mars/issues/6)) ([482e39c](https://github.com/max-team/Mars/commit/482e39c))
* **build:** 支持使用原生小程序组件和页面 ([d62ecce](https://github.com/max-team/Mars/commit/d62ecce))

## 0.2.3 (2019-04-09)

- initial version
