import { themeDict } from '@/assets/js/theme_dict.js'

export const state = () => ({
  dict: themeDict,
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
  // dictのアクティブアイテムの更新とテーマのセット
  updateActiveness(state, id) {
    Object.keys(state.dict).forEach((key) => (state.dict[key].isActive = false))
    state.dict[id].isActive = true

    const theme = state.dict[id]
    const rootElement = document.documentElement
    const mainGrad = `linear-gradient(0.375turn, ${theme.main1}e6, ${theme.main2}e6, ${theme.main3}e6)`
    rootElement.style.setProperty('--theme-main-1', theme.main1)
    rootElement.style.setProperty('--theme-main-2', theme.main2)
    rootElement.style.setProperty('--theme-main-2-light', theme.main2Light)
    rootElement.style.setProperty('--theme-main-2-dark', theme.main2Dark)
    rootElement.style.setProperty('--theme-main-3', theme.main3)
    rootElement.style.setProperty('--theme-main-grad', mainGrad)
    const itemObj = JSON.parse(localStorage.getItem('itemStorage'))
    itemObj.themeId = id
    localStorage.setItem('itemStorage', JSON.stringify(itemObj))
  },
}
