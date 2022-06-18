export const state = () => ({
  periodicTableScale: 1,
})

export const getters = {
  // => 周期表の大きさの倍率
  periodicTableScale: (state) => {
    return state.periodicTableScale
  },
}

export const mutations = {
  // 周期表の大きさの倍率の更新
  updatePeriodicTableScale(state, scale) {
    state.periodicTableScale = scale
  },
}
