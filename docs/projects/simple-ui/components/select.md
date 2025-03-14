---
title: Select
lang: zh-CN
description: Select选择器
---

# Select

## 基础用法

通过`v-model:value`可以双向绑定，可以通过`enter`、`up`、`down`来进行选择

:::demo

select/basic

:::

## 禁用状态

通过 `disabled` 属性禁用 Select。

:::demo

select/disabled

:::

## 不同尺寸

通过`size`属性可以指定选择器的大小

:::demo

select/size

:::

## 过滤模式

您可以通过传入`filterable`属性来开启过滤模式，默认情况下 filter method 为`String.include()`方法，后续会支持自定义`filter`方法

:::demo

select/filterable

:::

## 支持创建

`createable`创建模式，该模式将允许您创建自己的`Option`选项，且该模式下必须开启`filterable`，否则不会生效。

下面示例中配合`default-first-option`选项可以快速使用`Enter`来进行创建

:::demo

select/createable

:::

## 多选模式

通过`multiple`开启多选模式，并且可以通过`placeholder`自定义内容

:::demo

select/multiple

:::

## 清除模式

通过`clearable`开启可清除模式，该模式只支持单选

:::demo

select/clearable

:::

## 自定义选项

有的场合，需要定制选项显示内容、已选选项显示内容，可以结合 label 属性和插槽实现。

:::demo

select/template

:::

## 额外内容

有时候我们需要在 Select 下拉列表中添加额外的内容

您可以通过`prepend`和`append`插槽分别为选项列表的前方和后方插入内容

:::demo

select/extra

:::

## Select 参数

| 名称           | 说明                                   | 类型                 | 默认值    | 始于     |
| -------------- | -------------------------------------- | -------------------- | --------- | -------- |
| value          | select 当前选中值，可通过`v-model`绑定 | `string`             | ``        | -        |
| visible        | select 当前是否可见                    | `boolean`            | `false`   | -        |
| disabled       | select 是否禁用                        | `boolean`            | `false`   | `v2.2.8` |
| multiple       | select 开启多选                        | `boolean`            | `false`   | `v2.2.7` |
| clearable      | select 是否可清除                      | `boolean`            | `false`   | `v1.6.2` |
| options        | 数据化配置选项内容                     | `{ label, value }[]` | ``        | -        |
| fitPopper      | list 列表是否和 trigger 元素等宽       | `boolean`            | `true`    | -        |
| listClass      | list 上的 class 类，可用于自定义样式   | `string[]`           | ``        | -        |
| transitionName | 下拉列表的 transition 名称             | `string`             | `bl-drop` | -        |

## Select slots

| 名称        | 说明                    | 类型    | 默认值 | 始于    |
| ----------- | ----------------------- | ------- | ------ | ------- |
| prepend     | list 前置内容插槽       | `VNode` | ``     | v1.14.4 |
| append      | list 后置内容插槽       | `VNode` | ``     | v1.14.4 |
| empty       | 定制 Select 空状态内容  | `VNode` | ``     | v1.14.4 |
| placeholder | 定制 Select placeholder | `VNode` | ``     | v2.2.7  |
