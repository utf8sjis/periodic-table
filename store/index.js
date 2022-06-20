export const state = () => ({
  isBodyScrollLocked: false,
  isPhone: false,
  periodicTableScale: 1,
})

export const getters = {
  // => bodyScrollLockが有効か否か
  isBodyScrollLocked: (state) => {
    return state.isBodyScrollLocked
  },
  // => 画面幅がスマートフォン幅か否か
  isPhone: (state) => {
    return state.isPhone
  },
  // => 周期表の大きさの倍率
  periodicTableScale: (state) => {
    return state.periodicTableScale
  },
}

export const mutations = {
  // bodyScrollLockが有効か否かの更新
  updateIsBodyScrollLocked(state, isLocked) {
    state.isBodyScrollLocked = isLocked
  },
  // 画面幅がスマートフォン幅か否かの更新
  updateIsPhone(state, isPhone) {
    state.isPhone = isPhone
  },
  // 周期表の大きさの倍率の更新
  updatePeriodicTableScale(state, scale) {
    state.periodicTableScale = scale
  },
}
