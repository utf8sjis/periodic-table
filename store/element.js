import { elementList } from '@/assets/js/element_list.js'

export const state = () => ({
  list: elementList,
  activeList: Array(elementList.length).fill(false),
  currentIndex: 0,
})

export const getters = {
  // => list
  list: (state) => {
    return state.list
  },
  // => activeList
  activeList: (state) => {
    return state.activeList
  },
  // listのインデクス => listのアイテムのオブジェクト
  getItem: (state) => (index) => {
    if (typeof index === 'undefined') {
      // 引数が与えられなかった場合は現在の元素のものを返す
      return state.list[state.currentIndex]
    } else {
      return state.list[index]
    }
  },
  // 原子番号 => listのインデクス
  atomicNumberToIndex: (state) => (atomicNumber) => {
    return state.list.findIndex((item) => item.atomicNumber === atomicNumber)
  },
}

export const mutations = {
  // アクティブアイテムの更新
  updateActiveList(state, index) {
    state.activeList = Array(state.list.length).fill(false)
    if (typeof index !== 'undefined') {
      state.currentIndex = index
      state.activeList[index] = true
    }
    // 引数が与えられなかった場合はすべて非アクティブ化
  },
}
