# @marsjs-cli

## 安装

``` sh
npm i -g @marsjs-cli
```

## 创建项目

``` sh
mars create my-project
```

如创建的项目不需要支持 h5，选择 `仅小程序` 否则。若需要支持 h5，选择 `小程序和 H5`。

## 开发项目

``` sh
mars serve
```

可通过 `-t` 设置编译目标，可选值为 `swan` | `wx` | `h5`，默认 `swan`；

## 构建项目（用于上线）

``` sh
mars build
```

可通过 `-t` 设置编译目标，可选值为 `swan` | `wx` | `h5`，默认 `swan`；