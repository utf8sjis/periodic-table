import { langList } from '@/assets/js/lang_list.js'

export const state = () => ({
  list: langList,
  currentIndex: 3,
})

export const getters = {
  // => list
  list: (state) => {
    return state.list
  },
  // listのインデクス => listのアイテムのオブジェクト
  getItem: (state) => (index) => {
    if (typeof index === 'undefined') {
      // 引数が与えられなかった場合は現在の言語のものを返す
      return state.list[state.currentIndex]
    } else {
      return state.list[index]
    }
  },
}

export const mutations = {
  // listのアクティブアイテムの更新
  updateActiveness(state, index) {
    state.list.forEach((item) => (item.isActive = false))
    if (typeof index !== 'undefined') {
      state.currentIndex = index
      state.list[index].isActive = true
    }
    // 引数が与えられなかった場合はすべて非アクティブ化
  },
}
