---
title: InputEmoji
lang: zh-CN
description: 表情输入框
---

# InputEmoji

## 基础用法

使用 `v-model:value` 进行双向绑定。

:::demo

input-emoji/basic

:::

## 设置默认`emoji`

通过 `defaultEmoji` 设置默认`emoji`。

:::demo

input-emoji/default

:::

## 粘贴文本

当粘贴文本到输入框时，即使为组件传递了参数`defaultEmoji`，但如果所粘贴文本的第一个字符为 `emoji`，则会将其解析为默认`emoji`展示。

:::demo

input-emoji/paste

:::

## 不同大小

通过设置`size`属性可控制输入框的大小

:::demo

input-emoji/size

:::

## 不同类型

通过设置`type`属性可控制输入框的类型, 默认`auto`, 当设置为`edit`时, 输入框会一直保持编辑状态, 当设置为`show`时, 输入框会一直保持预览状态。

:::demo

input-emoji/type

:::

## 自定义copy和clear按钮

组件提供了`copy`和`clear`两个 slot，方便用户为复制和清除功能设置自定义图标。

:::demo

input-emoji/custom

:::

## InputEmoji 参数

| 名称        | 说明             | 类型      | 默认值  | 始于 |
| ----------- | ---------------- | --------- | ------- | ---- |
| value | 绑定的值 | `string` |  -  |  -  |
| defaultEmoji | 默认展示的 emoji | `string` |  `😀` |  -  |
| size       | 输入框大小         | `string`  | `middle`      | -    |
| type       | 输入框类型         | EditType  | `auto`      | -    |

## InputEmoji 事件

| 名称   | 说明                 | 类型            | 始于     |
| ------ | -------------------- | --------------- | -------- |
| input | 输入框输入时触发 | (value: `string`, event: Event) => void | v2.3.24 |
| change | 绑定值发生改变且失去焦点时触发 | (value: `string`) => void | - |

## InputEmoji 插槽

| 名称 | 说明       |
| ---- | ---------- |
| copy | 复制功能的图标 |
| clear | 清除功能的图标 |

## 类型

```ts
type EditType = 'auto' | 'edit' | 'show'
```
