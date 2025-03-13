---
title: Panel Group
lang: zh-CN
description: 一个可以支持更改大小的面板集合
---

# Panel Group

一个可以支持更改大小的面板集合。Panel之间会自动插入调整大小的手柄,也支持自定义手柄。

## 基础用法

使用`Panel`组件即可实现可调整大小的面板布局,组件会自动在相邻面板之间插入调整手柄。

:::demo
panel-group/basic
:::

## 边界条件

通过`minSizePercentage`和`maxSizePercentage`来设置面板的`最小宽度`和`最大宽度`

:::demo
panel-group/max
:::

## 垂直方向

通过设置`direction`为`horizontal`和`vertical`分别设置`水平方向`和`垂直方向`

:::demo
panel-group/vertical
:::

## 网格模式

`PanelGroup`支持了网格模式，默认栅格布局为`12列`，通过`grid`属性可以开启，开启后会自动调节面板宽度，目前已经支持垂直方向上的`grid`布局

:::demo
panel-group/grid
:::

## 嵌套使用

您可以通过简单的嵌套来实现多方向的布局

:::demo
panel-group/nested
:::

## 面板拖拽

在面板拖拽结束后，应该调用`reset`方法来重置面板数据

:::demo
panel-group/draggable
:::

## Panel Group 参数

| 名称       | 说明                                      | 类型                                 | 默认值                      | 始于      |
| ---------- | ----------------------------------------- | ------------------------------------ | --------------------------- | --------- |
| direction  | Panel 的主轴方向                          | `PanelDirection`                     | `horizontal`                | `v1.11.0` |
| grid       | Panel 开启栅格布局                        | `boolean`                            | `false`                     | `v1.11.0` |
| layout     | 各个 Panel 的宽度百分比                   | `number[]`                           | `默认各个panel平分100%宽度` | `v1.11.0` |
| gridLayout | 开启 grid 布局后各个 Panel 的所占栅格数量 | `number[]`                           | `默认各个panel平分12个栅格` | `v1.11.5` |
| disabled   | 是否禁用 Panel 拖拽                       | `boolean`                            | `false`                     | `v1.11.6` |
| onDragEnd  | Panel 拖拽结束后调用                      | `(states: PanelGroupStates) => void` | `null`                      | `v2.2.8`  |

## Panel 参数

| 名称                  | 说明                                | 类型     | 默认值                 | 始于      |
| --------------------- | ----------------------------------- | -------- | ---------------------- | --------- |
| defaultSizePercentage | Panel 的默认大小                    | `number` | `所有面板平分可用空间` | `v1.11.0` |
| minSizePercentage     | Panel 的百分比最小值                | `number` | `0`                    | `v1.11.0` |
| maxSizePercentage     | Panel 的百分比最大值                | `number` | `100`                  | `v1.11.0` |
| minGridCol            | 开启 grid 布局后 Panel 的最小栅格数 | `number` | `3`                    | `v1.11.5` |

## 类型补充

```typescript
type PanelDirection = 'horizontal' | 'vertical'
```

## Panel Group 方法

| 名称  | 说明                                                                                | 类型         | 始于      |
| ----- | ----------------------------------------------------------------------------------- | ------------ | --------- |
| reset | 重置面板数据。在面板拖拽后需要调用此方法来重新排序面板数据,确保布局和数据保持同步 | `() => void` | `v1.11.0` |

## Panel Group 事件

| 名称  | 说明                 | 类型         | 始于      |
| ----- | -------------------- | ------------ | --------- |
| reset | 面板重置时触发的事件 | `() => void` | `v1.11.0` |

## Panel Group 插槽

| 名称    | 说明           |
| ------- | -------------- |
| default | 面板的默认内容 |
