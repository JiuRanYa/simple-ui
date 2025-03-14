---
title: Dropdown
lang: zh-CN
description: 下拉菜单
---

# Dropdown

展示一个菜单给用户，例如一组由按钮触发的操作或功能。

## 基础用法

:::demo

dropdown/basic

:::

## 嵌套使用

:::demo

dropdown/nested

:::

## 自定义

您可以用`Dropdown`完成更多复杂的功能

:::demo

dropdown/custom

:::

## Dropdown 组件参数

| 名称           | 说明                                                          | 类型        | 默认值   | 始于   |
| -------------- | ------------------------------------------------------------- | ----------- | -------- | ------ |
| visible        | 是否可见                                                      | `boolean`   | `false`  | -      |
| trigger        | dropdown菜单的触发方式                                        | `string`    | `click`  | -      |
| placement      | dropdown菜单展示的位置                                        | `Placement` | `bottom` | -      |
| transfer       | 设置dropdown菜单的渲染位置，设置为 true 时默认渲染至 `<body>` | `boolean    | string`  | `true` |
| transitionName | dropdown菜单的transition动画                                  | `string`    | ``       | -      |
