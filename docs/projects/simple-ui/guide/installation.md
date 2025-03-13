---
lang: en-US
---

# 安装

推荐使用 pnpm 或 yarn 的方式进行安装：

```shell
# 选择一个你喜欢的包管理器

# NPM
$ npm install simple-ui --save

# Yarn
$ yarn add simple-ui

# pnpm
$ pnpm install simple-ui
```

## 分包安装

`simple-ui`基于`Monorepo`开发，所以你可以根据自己的需求安装不同的工具包，以下是使用`pnpm`下载的示例

```shell

# 组件
$ pnpm install @simple-ui/components

# Hooks
$ pnpm install simple-ui/hooks

# 工具函数
$ pnpm install simple-ui/utils

```

你也可以选择其他的包管理工具下载

:::tip
我们强烈推荐你使用 pnpm 来管理你的包
:::
