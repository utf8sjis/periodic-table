import { elementList } from '@/assets/js/element_list.js'

export const state = () => ({
  list: elementList,
})

export const getters = {
  // => list
  list: (state) => {
    return state.list
  },
  // listのインデクス => listのアイテムのオブジェクト
  getItem: (state) => (index) => {
    return state.list[index]
  },
  // 原子番号 => listのインデクス
  numberToIndex: (state) => (number) => {
    return state.list.findIndex((item) => item.atomicNumber === number)
  },
}

export const mutations = {
  // データページの表示・非表示
  toggle(state, index) {
    state.list[index].isActive = !state.list[index].isActive
  },
}
