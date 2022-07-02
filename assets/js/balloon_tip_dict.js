import { controlList } from './control_list.js'

export const balloonTipDict = {
  controlPanel: [
    ...controlList.map((item) => ({
      contentId: item.component,
      title: item.name,
      titleIconClass: item.iconClass,
    })),
  ],
  overlayMain: [
    {
      title: 'データページ',
      titleIconClass: 'fas fa-database',
    },
  ],
}
