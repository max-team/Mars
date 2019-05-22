# @marsjs/build

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
