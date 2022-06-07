import { controlList } from './control_list.js'

export const popupBalloons = {
  controlPanel: {
    isActive: false,
    contents: [
      {
        title: controlList[0].name,
        titleIconClass: controlList[0].iconClass,
      },
      {
        title: controlList[1].name,
        titleIconClass: controlList[1].iconClass,
      },
      {
        title: controlList[2].name,
        titleIconClass: controlList[2].iconClass,
      },
    ],
  },
  overlayMain: {
    isActive: false,
    contents: [
      {
        title: 'データページ',
        titleIconClass: 'fas fa-database',
      },
    ],
  },
}
