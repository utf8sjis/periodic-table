import { balloonTipDict } from '@/assets/js/balloon_tip_dict.js'

export const state = () => ({
  dict: balloonTipDict,
})

export const getters = {
  // => dict
  dict: (state) => {
    return state.dict
  },
  // id => dictのアイテムのオブジェクト
  getItem: (state) => (id) => {
    return state.dict[id]
  },
}

export const mutations = {
  // dictのアクティブアイテムの更新
  updateActiveness(state, payload) {
    if (typeof payload.by === 'undefined') {
      // byの値が与えられなかった場合はトグル
      state.dict[payload.id].isActive = !state.dict[payload.id].isActive
    } else if (payload.by === 'close') {
      state.dict[payload.id].isActive = false
    } else {
      throw new Error('Unknown balloon tip activation option')
    }
  },
}
