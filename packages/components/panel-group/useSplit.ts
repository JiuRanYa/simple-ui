import type { CSSProperties, ExtractPropTypes, Ref } from 'vue'
import { nextTick, reactive, ref, watch } from 'vue'
import { warnWithPrefix } from '@simple-ui/common'
import type { PanelConstraints, PanelData } from '../panel/types'
import type { panelGroupProps } from './props'
import type { PanelGroupStates } from './panel-group-states'
import type { DragStates, PanelDirection, ResizeEvent } from './types'

export function useSplit(props: ExtractPropTypes<typeof panelGroupProps>, groupId: string) {
  const gridCol = 12
  const paneCount = ref(0)
  const assignedSpans = ref(0)
  const container = ref<HTMLDivElement>()

  const states = reactive<PanelGroupStates>({
    layout: [],
    gridLayout: [],
    panelDataArray: [],
    gridColToFlexGrowMap: [],
    resizeHandleCount: 0,
    direction: props.direction as PanelDirection,
    showPreviewDots: false,
    previewDots: [],
  })
  const dragStates = ref<DragStates>({
    isDragging: false,
    dragHandleId: '',
    initialLayout: [],
    pivotIndice: [],
  })

  function registerPanel(panelData: Ref<PanelData>) {
    caculateGridColToFlexGrowMap()
    states.panelDataArray.push(panelData)

    const unsafeLayout = caculateDefaultLayout()
    states.layout = unsafeLayout
  }

  /*
   * 算法：最小宽度 = ((总面板宽度 + resize宽度) / (栅格数 / 所占格) - 18) / (总面板宽度 - resize宽度 * resize数量)
   * 备注：此处的18为单个resizeHandle的左边距和中心到右边panel的距离总和，如果你需要自定义resizeHandle，需要重新计算该值
   * */
  function transferGridColToFlexGrow(col: number) {
    const totalWidth
      = (props.direction === 'horizontal'
        ? container.value?.clientWidth
        : container.value?.clientHeight) ?? 0
    const resizeHandleWidth = 18
    const resizeHandleCount = document.querySelectorAll(`[data-panel-resize-handle][data-panel-group-id="${groupId}"]`).length

    return (
      (((totalWidth + resizeHandleWidth) / (gridCol / col) - 18)
      / (totalWidth - resizeHandleWidth * resizeHandleCount))
      * 100
    )
  }

  function caculateGridColToFlexGrowMap() {
    for (let i = 0; i < gridCol; i++)
      states.gridColToFlexGrowMap[i] = transferGridColToFlexGrow(i)

    if (props.gridLayout)
      return props.gridLayout.map(col => states.gridColToFlexGrowMap[col])
  }

  function validateGridLayout(gridLayout: number[]) {
    // 检查总列数是否等于 gridCol
    const totalCols = gridLayout.reduce((sum, cols) => sum + cols, 0)
    if (totalCols !== gridCol)
      return false

    // 检查每个面板是否满足最小列数约束
    return states.panelDataArray.every((panel, index) => {
      const minGridCol = panel.value.constraints.minGridCol ?? 0
      return gridLayout[index] >= minGridCol
    })
  }

  function caculateDefaultLayout() {
    const panelLength = states.panelDataArray.length

    // 如果开启了grid布局
    if (props.grid) {
      // 检查传入的 gridLayout 是否满足所有面板的最小列数约束
      if (props.gridLayout && validateGridLayout(props.gridLayout)) {
        states.gridLayout = props.gridLayout
      }
      else {
        // 如果不满足约束或没有传入 gridLayout，计算默认的栅格布局
        const defaultGridLayout = Array(panelLength).fill(Math.floor(gridCol / panelLength))

        // 确保每个面板满足最小列数约束
        states.panelDataArray.forEach((panel, index) => {
          const minGridCol = panel.value.constraints.minGridCol ?? 0
          defaultGridLayout[index] = Math.max(defaultGridLayout[index], minGridCol)
        })

        // 调整总列数为 gridCol
        const totalCols = defaultGridLayout.reduce((sum, cols) => sum + cols, 0)
        if (totalCols > gridCol)
          console.warn('Total minGridCols exceeds available grid columns')

        states.gridLayout = defaultGridLayout
      }

      states.panelDataArray.forEach((panel) => {
        const minGridCol = panel.value.constraints.minGridCol ?? 3
        panel.value.constraints.minSizePercentage = transferGridColToFlexGrow(minGridCol)
        panel.value.constraints.maxSizePercentage = transferGridColToFlexGrow(
          gridCol - states.panelDataArray.length,
        )
      })

      // 根据 gridLayout 计算实际的 layout
      return states.gridLayout.map(col => states.gridColToFlexGrowMap[col])
    }

    const layout = props.layout ?? Array<number>(states.panelDataArray.length).fill(0)
    const panelTempData = {
      count: 0,
      remainingSize: 100,
    }

    // we should Distribute default sizes first, exculde defaultSizePercentage size
    for (let i = 0; i < states.panelDataArray.length; i++) {
      const panelData = states.panelDataArray[i]

      const { defaultSizePercentage } = panelData.value.constraints

      if (defaultSizePercentage) {
        layout[i] = defaultSizePercentage
        panelTempData.remainingSize -= defaultSizePercentage
        continue
      }
      panelTempData.count++
    }

    for (let i = 0; i < layout.length; i++) {
      const size = layout[i]

      if (size !== 0)
        continue

      layout[i] = panelTempData.remainingSize / panelTempData.count
    }

    return layout
  }

  function getPanelStyle(panelData: Ref<PanelData>) {
    const panelIndex = states.panelDataArray.findIndex(p => p.value.panelId === panelData.value.panelId)

    return computePanelFlexBoxStyle({
      layout: states.layout,
      panelDataArray: states.panelDataArray,
      panelIndex,
    })
  }

  function computePanelFlexBoxStyle({
    layout,
    panelDataArray,
    panelIndex,
    precision = 12,
  }: {
    layout: number[]
    panelDataArray: Ref<PanelData>[]
    panelIndex: number
    precision?: number
  }): CSSProperties {
    const size = layout[panelIndex]

    let flexGrow = size ? Number(size.toPrecision(precision)) : 0

    if (panelDataArray.length === 1)
      flexGrow = 100

    return {
      flex: `${flexGrow} 1 0`,
      overflow: 'hidden',
    }
  }
  function setLayout(layout: number[]) {
    states.layout = layout
  }

  // panel-resize-handle
  function startDragging(event: ResizeEvent, resizeHandleId: string) {
    if (props.disabled)
      return

    const initialCursorPosition = getResizeEventCursorPosition(states.direction, event)

    states.showPreviewDots = true
    dragStates.value.isDragging = true
    dragStates.value.initialLayout = states.layout
    dragStates.value.initialCursorPosition = initialCursorPosition
    dragStates.value.dragHandleId = resizeHandleId

    // 计算需要展示的dot数量
    const pivotIndice = getPivotIndiceByResizeId(groupId, resizeHandleId)

    if (!props.grid || pivotIndice[0] === -1)
      return

    let preTotalMinCol = 0
    let afterTotalMinCol = 0

    let preDispatchedCol = 0
    let afterDispatchedCol = 0

    const barPivotIndice = pivotIndice[0]

    // 根据枢轴索引计算前后限制条件
    for (let i = 0; i < states.layout.length; i++) {
      const panelStateDate = states.panelDataArray[i]

      // 增量和为：flex系数 - 限制条件的最小col
      const currentCol = states.gridColToFlexGrowMap.findIndex((flexCol) => {
        return fuzzyCompareNumbers(flexCol, states.layout[i] ?? -1) === 0
      })
      const delta = currentCol - (panelStateDate.value.constraints.minGridCol ?? 0)

      if (i <= barPivotIndice) {
        preTotalMinCol += delta
        preDispatchedCol += currentCol
        continue
      }

      afterDispatchedCol += currentCol
      afterTotalMinCol += panelStateDate.value.constraints.minGridCol ?? 0
    }

    const startDotPos = preDispatchedCol - preTotalMinCol
    const endDotPos = preDispatchedCol + (afterDispatchedCol - afterTotalMinCol)

    states.previewDots = [startDotPos, endDotPos]
  }

  function stopDragging() {
    if (props.disabled)
      return

    states.showPreviewDots = false
    dragStates.value.isDragging = false
    dragStates.value.initialCursorPosition = 0
    dragStates.value.dragHandleId = ''

    if (props.grid)
      adjustGridLayout(states.layout)
  }

  function adjustGridLayout(layout: number[]) {
    if (!props.grid)
      return

    const newGridLayout: number[] = []

    for (let i = 0; i < layout.length; i++) {
      let minDelta = 999
      let targetGridCol = -1
      let shouldPatch = true

      for (let j = 0; j < states.gridColToFlexGrowMap.length; j++) {
        const prevPanelSize = layout[i]
        const exceptedWidth = states.gridColToFlexGrowMap[j]

        // 精度内相等，直接使用当前栅格列数
        if (fuzzyCompareNumbers(prevPanelSize, exceptedWidth) === 0) {
          shouldPatch = false
          targetGridCol = j
          break
        }

        const delta = Math.abs(prevPanelSize - exceptedWidth)

        if (delta < minDelta) {
          minDelta = delta
          targetGridCol = j
        }
      }

      if (shouldPatch)
        layout[i] = states.gridColToFlexGrowMap[targetGridCol]

      // 保存对应的栅格列数
      newGridLayout[i] = targetGridCol
    }

    // 更新 states 中的 gridLayout
    states.gridLayout = newGridLayout
  }

  function getResizeEventCursorPosition(direction: PanelDirection, event: ResizeEvent): number {
    const isHorizontal = direction === 'horizontal'

    if (isMouseEvent(event))
      return isHorizontal ? event.clientX : event.clientY
    else
      throw new Error(`Unsupported event type "${event.type}"`)
  }

  function registerResizeHandler(resizeHandleId: string) {
    states.resizeHandleCount++

    return function resizeHandler(event: MouseEvent) {
      event.preventDefault()

      if (dragStates.value.dragHandleId !== resizeHandleId || props.disabled)
        return

      const { initialLayout } = dragStates.value

      const initialCursorPosition = dragStates.value.initialCursorPosition ?? 0
      const movedCursorPosition = getResizeEventCursorPosition(states.direction, event)

      const delatPercentage = calculateDeltaPercentage(
        initialCursorPosition,
        movedCursorPosition,
        groupId,
      )

      const panelsConstraints = states.panelDataArray.map(data => data.value.constraints)
      const pivotIndice = getPivotIndiceByResizeId(groupId, resizeHandleId)

      dragStates.value.pivotIndice = pivotIndice

      // delta为初始位置计算，调整layout也应该根据初始的layout计算
      const nextLayout = adjustLayoutByDelatPercentage(
        delatPercentage,
        initialLayout,
        panelsConstraints,
        pivotIndice,
      )

      if (!compareLayouts(states.layout, nextLayout))
        states.layout = nextLayout
    }
  }
  function getPivotIndiceByResizeId(groupId: string, resizeHandleId: string) {
    const index = findResizeHandleIndex(groupId, resizeHandleId)

    return index != null ? [index, index + 1] : [-1, -1]
  }

  function getResizeHandleElementsForGroup(groupId: string) {
    return Array.from(
      document.querySelectorAll(`[data-panel-resize-handle][data-panel-group-id="${groupId}"]`),
    )
  }

  function findResizeHandleIndex(groupId: string, resizeHandleId: string) {
    const handles = getResizeHandleElementsForGroup(groupId)
    const index = handles.findIndex(
      handle => handle.getAttribute('data-panel-resize-handle-id') === resizeHandleId,
    )
    return index ?? null
  }

  // 计算panel的限制条件: 最大尺寸和最小尺寸
  function computePercentagePanelConstraints(
    panelIndex: number,
    panelsConstraints: PanelConstraints[],
  ) {
    let totalMinConstraints = 0
    let totalMaxConstraints = 0

    // All panel constraints, excluding the current one
    for (let i = 0; i < panelsConstraints.length; i++) {
      if (i !== panelIndex) {
        totalMaxConstraints += panelsConstraints[i].maxSizePercentage ?? 100
        totalMinConstraints += panelsConstraints[i].minSizePercentage ?? 0
      }
    }
    const { maxSizePercentage = 100, minSizePercentage = 0 } = panelsConstraints[panelIndex]

    // 极限法: 如果目标panel没有设置最大尺寸，那最大的限制条件为: 100 - 其余面板最小约束尺寸之和
    // Limit method: if target panel don't have maxSizePercentage, the maxSizePercentage is the 100 - totalMinConstraints
    return {
      maxSizePercentage:
        panelsConstraints.length > 1
          ? Math.min(maxSizePercentage, 100 - totalMinConstraints)
          : maxSizePercentage,
      minSizePercentage:
        panelsConstraints.length > 1
          ? Math.max(minSizePercentage, 100 - totalMaxConstraints)
          : minSizePercentage,
    }
  }

  function adjustLayoutByDelatPercentage(
    delta: number,
    layout: number[],
    panelConstraints: PanelConstraints[],
    pivotIndices: number[],
  ) {
    const nextLayout = [...layout]

    const increment = delta < 0 ? 1 : -1
    let index = delta < 0 ? pivotIndices[1]! : pivotIndices[0]!

    // 预先计算枢轴相反方向最大可用增量: 取用户触发的delta和面板最大可用增量的最小值
    // Pre-calculate max available delta in the opposite direction of our pivot.
    {
      let maxAvailableDelta = 0

      while (true) {
        const presize = layout[index]
        const { maxSizePercentage } = computePercentagePanelConstraints(index, panelConstraints)

        const delta = maxSizePercentage - presize
        maxAvailableDelta += delta
        index += increment

        if (index < 0 || index >= panelConstraints.length)
          break
      }

      const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta))
      delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta
    }

    let deltaApplied = 0
    // 逐一把增量分配给枢轴相同方向的面板
    // The applied Delta needs to be subtracted from other panels
    {
      const pivotIndex = delta < 0 ? pivotIndices[0]! : pivotIndices[1]!
      let index = pivotIndex
      while (index >= 0 && index < panelConstraints.length) {
        const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied)
        const presize = layout[index]
        const { minSizePercentage } = computePercentagePanelConstraints(index, panelConstraints)

        const panelDeltaAvailable = presize - minSizePercentage

        if (panelDeltaAvailable >= deltaRemaining) {
          nextLayout[index] = presize - deltaRemaining
          deltaApplied += deltaRemaining
          break
        }
        else {
          nextLayout[index] = minSizePercentage
          deltaApplied += panelDeltaAvailable
        }

        delta < 0 ? index-- : index++
      }
    }
    // 把已分配增量从枢轴相反方向的面板中减去
    // Distribute the applied delta to the panels in the other direction
    {
      const pivotIndex = delta < 0 ? pivotIndices[1]! : pivotIndices[0]!
      let index = pivotIndex
      while (index >= 0 && index < panelConstraints.length) {
        const deltaRemaining = Math.abs(deltaApplied)
        const presize = layout[index]
        const { maxSizePercentage } = computePercentagePanelConstraints(index, panelConstraints)

        const panelDeltaAvailable = maxSizePercentage

        if (panelDeltaAvailable >= deltaRemaining) {
          nextLayout[index] = presize + deltaRemaining
          deltaApplied -= deltaRemaining
          break
        }
        else {
          nextLayout[index] = maxSizePercentage
          deltaApplied -= panelDeltaAvailable
        }

        delta < 0 ? index++ : index--
      }
    }

    const totalPanelSize = nextLayout.reduce((total, size) => size + total, 0)

    if (fuzzyCompareNumbers(totalPanelSize, 100) !== 0)
      return layout

    return nextLayout
  }

  function calculateDeltaPercentage(
    initialCursorPosition: number,
    movedCursorPosition: number,
    groupId: string,
    precision = 12,
  ) {
    const delatPixel = calculateDeltaPixel(initialCursorPosition, movedCursorPosition)
    const panelGroupInPixel = getPanelGroupMainAxiosPixel(groupId) ?? 1
    const deltaPercentage = (delatPixel / panelGroupInPixel) * 100

    return Number(deltaPercentage.toFixed(precision))
  }

  function calculateDeltaPixel(initialCursorPosition: number, movedCursorPosition: number) {
    return movedCursorPosition - initialCursorPosition
  }

  function getGroupElement(groupId: string) {
    return document.querySelector(`[data-panel-group][data-panel-group-id="${groupId}"]`)
  }

  function getPanelGroupMainAxiosPixel(groupId: string) {
    const isHorizontal = states.direction === 'horizontal'
    const groupElement = getGroupElement(groupId)
    const groupRect = groupElement?.getBoundingClientRect()
    const mainAxiosPixel = isHorizontal ? groupRect?.width : groupRect?.height

    return mainAxiosPixel
  }

  watch(
    () => props.layout,
    () => {
      if (props.layout?.length)
        states.layout = props.layout
      else
        states.layout = caculateDefaultLayout()
    },
  )

  // 监听 props.gridLayout 的变化
  watch(
    () => props.gridLayout,
    (newGridLayout) => {
      if (props.grid && newGridLayout?.length) {
        // 验证新的 gridLayout 是否满足约束
        if (validateGridLayout(newGridLayout)) {
          states.gridLayout = newGridLayout
          states.layout = newGridLayout.map(col => states.gridColToFlexGrowMap[col])
        }
        else {
          warnWithPrefix('panel-group', 'Provided gridLayout does not satisfy panel minGridCol constraints')
          // 重新计算默认布局
          states.layout = caculateDefaultLayout()
        }
      }
    },
    { immediate: true },
  )

  return {
    states,
    container,
    paneCount,
    assignedSpans,
    dragStates,

    setLayout,
    registerPanel,
    caculateDefaultLayout,
    caculateGridColToFlexGrowMap,
    getPanelStyle,
    stopDragging,
    startDragging,
    registerResizeHandler,
    computePanelFlexBoxStyle,
  }
}

function isMouseEvent(event: MouseEvent) {
  return event.type.startsWith('mouse')
}
function fuzzyCompareNumbers(actual: number, expected: number, fractionDigits: number = 6): number {
  actual = Number.parseFloat(actual.toFixed(fractionDigits))
  expected = Number.parseFloat(expected.toFixed(fractionDigits))

  const delta = actual - expected
  if (delta === 0)
    return 0
  else
    return delta > 0 ? 1 : -1
}
function compareLayouts(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false
  }
  else {
    for (let index = 0; index < a.length; index++) {
      if (a[index] !== b[index])
        return false
    }
  }
  return true
}
