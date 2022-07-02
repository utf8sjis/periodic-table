<template>
  <div>
    <div id="app">
      <layout-header
        :is-nav-opened="isNavOpened"
        @toggle-nav-open="toggleNavOpen"
      />
      <layout-nav :is-nav-opened="isNavOpened" />
      <layout-nav-back
        :is-nav-opened="isNavOpened"
        @toggle-nav-open="toggleNavOpen"
      />
      <layout-bottom-fixed-area
        :is-around-top="isAroundTop"
        :is-share-button-expanded="isShareButtonExpanded"
        @toggle-share-expand-button="toggleShareExpandButton"
        @go-to-top="goToTop"
      />

      <main v-cloak>
        <section>
          <control-panel />

          <section
            class="periodic-table"
            :class="{
              'is-overflow-scroll': isPeriodicTableOverflow,
              'is-overflow-hidden': isBodyScrollLocked,
            }"
            :style="{
              height: periodicTableRect.height * periodicTableScale + 'px',
            }"
          >
            <div
              ref="periodicTable"
              class="periodic-table__grid-container"
              :class="{ 'is-overflow-scroll': isPeriodicTableOverflow }"
              :style="{ transform: 'scale(' + periodicTableScale + ')' }"
            >
              <div class="table-guide">
                <div class="table-guide__category-container">
                  <div
                    v-for="(categoryObj, categoryIndex) in categoryList"
                    :key="categoryIndex"
                    class="table-guide__category"
                  >
                    <div
                      class="table-guide__category-icon"
                      :class="categoryObj.categoryClass"
                    ></div>
                    <div>{{ categoryObj.categoryName }}</div>
                  </div>
                </div>
              </div>
              <div
                v-for="number in 18"
                :key="'group-' + number"
                class="periodic-table__group-number"
                :class="'periodic-table__group-number--group-' + number"
              >
                {{ number }}
              </div>
              <div
                v-for="number in 7"
                :key="'period-' + number"
                class="periodic-table__period-number"
                :class="'periodic-table__period-number--period-' + number"
              >
                {{ number }}
              </div>
              <div
                v-for="(cell, cellIndex) in otherCellList"
                :key="'la-ac-' + cellIndex"
                class="periodic-table__la-ac-wrapper"
                :class="cell.cellWrapperClass"
              >
                <div class="periodic-table__la-ac" :class="currentLang.class">
                  <span>{{ cell[currentLang.key] }}</span>
                </div>
              </div>
              <button
                v-for="(element, elementIndex) in elementList"
                :key="'cell-' + elementIndex"
                type="button"
                class="periodic-table__cell-wrapper"
                :class="[
                  'periodic-table__cell-wrapper--cell-' + element.elementSymbol,
                  {
                    'is-active':
                      elementStatusList[elementIndex].isDataPageActive,
                  },
                ]"
                @click="openDataPage(element.atomicNumber)"
              >
                <div
                  class="periodic-table__cell"
                  :class="[
                    'periodic-table__cell--' + element.categoryClass,
                    currentLang.class,
                  ]"
                >
                  <span
                    class="periodic-table__cell-text"
                    :class="[
                      'periodic-table__cell-text--cell-' +
                        element.elementSymbol,
                      currentLang.class,
                    ]"
                    >{{ element[currentLang.key] }}</span
                  >
                </div>
              </button>
            </div>
          </section>

          <transition
            name="overlay-"
            @enter="enterFade"
            @before-enter="beforeEnterFade"
            @before-leave="beforeLeaveFade"
          >
            <section
              v-show="isDataPageActive"
              class="overlay"
              :class="'is-' + currentDataPage.categoryClass"
            >
              <div
                class="overlay__main-wrapper"
                :class="{ 'is-overflow-hidden': !isBodyScrollLocked }"
              >
                <div class="overlay__main">
                  <div class="overlay__containers-wrapper">
                    <div class="overlay__container-base">
                      <div class="overlay__area overlay__area--element-symbol">
                        <div
                          class="data-area"
                          :class="'is-' + currentDataPage.categoryClass"
                        >
                          <div class="data-area__item-state">
                            <img
                              class="data-area__state-image"
                              :class="'is-' + currentDataPage.categoryClass"
                              :src="currentDataPage.stateSrc"
                            />
                          </div>
                          <div class="data-area__item-radioactivity">
                            <img
                              v-show="currentDataPage.isRadioactive"
                              class="data-area__radioactivity-image"
                              src="@/assets/img/state/radioactivity.svg"
                            />
                          </div>
                          <div class="data-area__item-element-symbol">
                            {{ currentDataPage.elementSymbol }}
                          </div>
                        </div>
                      </div>
                      <div class="overlay__area overlay__area--atomic-number">
                        <data-area
                          type="num"
                          label="Z ="
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.atomicNumber }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--period">
                        <data-area
                          type="num"
                          label="Period"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.period }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--group">
                        <data-area
                          type="num"
                          label="Group"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.group }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--atomic-weight">
                        <data-area
                          type="num"
                          label="Weight"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.atomicWeight }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--category">
                        <data-area
                          type="category"
                          label="Category"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                        >
                          <div class="data-area__category-text">
                            <template
                              v-for="(
                                category, categoryIndex
                              ) in currentDataPage.categoryList"
                            >
                              <span
                                :key="categoryIndex"
                                class="data-area__category-text-item"
                                >{{ category
                                }}<span
                                  v-show="
                                    categoryIndex !==
                                    currentDataPage.categoryList.length - 1
                                  "
                                  >／</span
                                ></span
                              >
                            </template>
                          </div>
                        </data-area>
                      </div>
                    </div>
                    <div class="overlay__container-kanji">
                      <div class="overlay__area overlay__area--cn">
                        <data-area
                          type="kanji"
                          label="Mainland China"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--cn"
                          >
                            {{ currentDataPage.simplifiedChinese }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ currentDataPage.unicodeCodePointCN }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + currentDataPage.categoryClass"
                              @click="
                                copyToClipboard(
                                  currentDataPage.simplifiedChinese
                                )
                              "
                            >
                              <i
                                class="fas fa-clipboard"
                                data-micron="swing"
                              ></i>
                            </button>
                          </template>
                        </data-area>
                      </div>
                      <div class="overlay__area overlay__area--tw">
                        <data-area
                          type="kanji"
                          label="Taiwan"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--tw"
                          >
                            {{ currentDataPage.taiwanTrad }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ currentDataPage.unicodeCodePointTW }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + currentDataPage.categoryClass"
                              @click="
                                copyToClipboard(currentDataPage.taiwanTrad)
                              "
                            >
                              <i
                                class="fas fa-clipboard"
                                data-micron="swing"
                              ></i>
                            </button>
                          </template>
                        </data-area>
                      </div>
                      <div class="overlay__area overlay__area--hk">
                        <data-area
                          type="kanji"
                          label="Hong Kong"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--hk"
                          >
                            {{ currentDataPage.hongkongTrad }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ currentDataPage.unicodeCodePointHK }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + currentDataPage.categoryClass"
                              @click="
                                copyToClipboard(currentDataPage.hongkongTrad)
                              "
                            >
                              <i
                                class="fas fa-clipboard"
                                data-micron="swing"
                              ></i>
                            </button>
                          </template>
                        </data-area>
                      </div>
                    </div>
                    <div class="overlay__container-reading">
                      <div class="overlay__area overlay__area--pinyin">
                        <data-area
                          type="pinyin"
                          label="Pinyin"
                          sub-label="Mainland China"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.pinyin }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--bopomofo">
                        <data-area
                          type="pinyin"
                          label="Bopomofo"
                          sub-label="Taiwan"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.bopomofo }} ({{
                            currentDataPage.taiwanPinyin
                          }})</data-area
                        >
                      </div>
                    </div>
                    <div class="overlay__container-name">
                      <div class="overlay__area overlay__area--japanese-name">
                        <data-area
                          type="japanese-name"
                          label="Japanese Name"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.japaneseName }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--english-name">
                        <data-area
                          type="english-name"
                          label="English Name"
                          :category-class="
                            'is-' + currentDataPage.categoryClass
                          "
                          >{{ currentDataPage.englishName }}</data-area
                        >
                      </div>
                    </div>
                    <div class="overlay__container-tweet">
                      <div class="overlay__area overlay__area--tweet">
                        <div
                          class="data-area data-area--tweet"
                          :class="'is-' + currentDataPage.categoryClass"
                        >
                          <div
                            class="data-area__item-tweet"
                            v-html="currentDataPage.twitterTweet"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div class="overlay__container-close">
                      <div class="overlay__area overlay__area--close">
                        <div
                          class="data-area"
                          :class="'is-' + currentDataPage.categoryClass"
                        >
                          <button
                            type="button"
                            class="data-area__item-close-button"
                            :class="'is-' + currentDataPage.categoryClass"
                            @click="closeDataPage()"
                          >
                            CLOSE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="overlay__main-info-icon"
                    :class="'is-' + currentDataPage.categoryClass"
                    @click="toggleBalloonTip('overlayMain')"
                  >
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <balloon-tip
                    id="overlayMain"
                    width="90%"
                    top="-10px"
                    left="4px"
                    beak-left="6px"
                  ></balloon-tip>
                </div>
              </div>
              <button
                type="button"
                class="overlay__close-button"
                :class="'is-' + currentDataPage.categoryClass"
                @click="closeDataPage()"
              >
                <ion-icon
                  class="overlay__close-button-icon"
                  name="close-circle"
                ></ion-icon>
              </button>
              <div class="overlay__container-element-changer">
                <div class="overlay__area overlay__area--element-changer">
                  <div
                    class="data-area"
                    :class="'is-' + currentDataPage.categoryClass"
                  >
                    <div
                      class="data-area__item-element-changer"
                      :class="'is-' + currentDataPage.categoryClass"
                    >
                      <button
                        type="button"
                        :disabled="elementChangeButton.isStart"
                        class="data-area__element-changer-button"
                        :class="{ 'is-disabled': elementChangeButton.isStart }"
                        @click="switchDataPage('prev')"
                      >
                        <ion-icon
                          class="data-area__element-changer-button-icon"
                          name="arrow-back"
                        ></ion-icon>
                        <span class="data-area__element-changer-button-text">
                          <span
                            class="data-area__element-changer-button-atomic-number"
                            >{{ elementChangeButton.prev.atomicNumber }}</span
                          >{{ elementChangeButton.prev.elementSymbol }}
                        </span>
                      </button>
                      <button
                        type="button"
                        :disabled="elementChangeButton.isEnd"
                        class="data-area__element-changer-button"
                        :class="{ 'is-disabled': elementChangeButton.isEnd }"
                        @click="switchDataPage('next')"
                      >
                        <span class="data-area__element-changer-button-text">
                          <span
                            class="data-area__element-changer-button-atomic-number"
                            >{{ elementChangeButton.next.atomicNumber }}</span
                          >{{ elementChangeButton.next.elementSymbol }}
                        </span>
                        <ion-icon
                          class="data-area__element-changer-button-icon"
                          name="arrow-forward"
                        ></ion-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </transition>
        </section>
        <section>
          <layout-article />
        </section>
      </main>

      <layout-footer />

      <transition-group v-cloak name="toast-" tag="div" class="toast">
        <div
          v-for="toast in toastList"
          :key="toast.timeoutID"
          class="toast__item-wrapper"
        >
          <div class="toast__item" @click="clearPopupBox(toast.timeoutID)">
            {{ toast.message }}
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

import { categoryList } from '@/assets/js/category_list.js'
import { otherCellList } from '@/assets/js/other_cell_list.js'

if (process.client) {
  window.onload = () => {
    const body = document.querySelector('body')
    body.classList.remove('body-preload')
  }
}

export default {
  name: 'IndexPage',

  data() {
    return {
      otherCellList,
      categoryList,
      /** ナビゲーションメニューが開いているか否か */
      isNavOpened: false,
      /** スクロール量がページのトップあたりか否か */
      isAroundTop: true,
      /** 表示中のトースト通知のリスト */
      toastList: [],
      /** 周期表の幅と高さ */
      periodicTableRect: {
        width: 0,
        height: 0,
      },
      /** 周期表の幅に対して作成したMediaQueryList */
      periodicTableMQL: null,
      /** 画面幅が周期表の幅を超過しているか否か */
      isPeriodicTableOverflow: false,
      /** シェアボタンが展開されているか否か */
      isShareButtonExpanded: false,
    }
  },
  head: {
    bodyAttrs: { class: 'body-preload' },
  },
  computed: {
    ...mapGetters(['isBodyScrollLocked', 'periodicTableScale']),
    ...mapGetters({
      elementList: 'element/elementList',
      elementStatusList: 'element/elementStatusList',
      currentDataPage: 'element/currentDataPage',
      isDataPageActive: 'element/isDataPageActive',
      currentLang: 'lang/currentLang',
    }),
    /**
     * 現在のデータページのページ遷移ボタンの表示内容
     * @returns {object} 表示内容の情報を含んだオブジェクト
     */
    elementChangeButton() {
      const atomicNumberToIndex = (atomicNumber) =>
        this.elementList.findIndex((item) => item.atomicNumber === atomicNumber)

      const z = this.currentDataPage.atomicNumber
      const obj = {
        prev: {
          atomicNumber: 0,
          elementSymbol: '',
        },
        next: {
          atomicNumber: 0,
          elementSymbol: '',
        },
        isStart: true,
        isEnd: false,
      }
      if (z - 1 < 1) {
        const nextIndex = atomicNumberToIndex(z + 1)
        obj.prev.atomicNumber = 0
        obj.prev.elementSymbol = 'n'
        obj.next.atomicNumber = this.elementList[nextIndex].atomicNumber
        obj.next.elementSymbol = this.elementList[nextIndex].elementSymbol
        obj.isStart = true
        obj.isEnd = false
      } else if (z + 1 > 118) {
        const prevIndex = atomicNumberToIndex(z - 1)
        obj.prev.atomicNumber = this.elementList[prevIndex].atomicNumber
        obj.prev.elementSymbol = this.elementList[prevIndex].elementSymbol
        obj.next.atomicNumber = 119
        obj.next.elementSymbol = 'Uue'
        obj.isStart = false
        obj.isEnd = true
      } else {
        const nextIndex = atomicNumberToIndex(z + 1)
        const prevIndex = atomicNumberToIndex(z - 1)
        obj.prev.atomicNumber = this.elementList[prevIndex].atomicNumber
        obj.prev.elementSymbol = this.elementList[prevIndex].elementSymbol
        obj.next.atomicNumber = this.elementList[nextIndex].atomicNumber
        obj.next.elementSymbol = this.elementList[nextIndex].elementSymbol
        obj.isStart = obj.isEnd = false
      }
      return obj
    },
  },
  watch: {
    /**
     * 周期表の大きさの倍率を監視する
     */
    periodicTableScale() {
      this.createMediaQuery()
      this.checkPeriodicTableOverflow()
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'))
      itemObj.periodicTableScale = this.periodicTableScale
      localStorage.setItem('itemStorage', JSON.stringify(itemObj))
    },
  },
  mounted() {
    // 周期表の幅と高さの初期値をセット
    this.periodicTableRect = this.$refs.periodicTable.getBoundingClientRect()
    // スクロールのイベントリスナを追加
    window.addEventListener('scroll', this.handleScroll)
    // localStorageの読み出しとその設定
    let itemStorage = JSON.parse(localStorage.getItem('itemStorage'))
    itemStorage = {
      themeId: itemStorage?.themeId ?? 'default',
      periodicTableScale: itemStorage?.periodicTableScale ?? 1,
    }
    localStorage.setItem('itemStorage', JSON.stringify(itemStorage))
    this.updatePeriodicTableScale(itemStorage.periodicTableScale)
    // 周期表の幅に対するメディアクエリを作成
    this.createMediaQuery()
    this.checkPeriodicTableOverflow()
    // スマートフォン幅に対するメディアクエリを作成 -> _variable.scss
    const phoneMQL = window.matchMedia('(max-width: 550px)')
    const checkIsPhone = () => this.updateIsPhone(phoneMQL.matches)
    try {
      phoneMQL.addEventListener('change', checkIsPhone)
    } catch (e) {
      phoneMQL.addListener(checkIsPhone) // for Safari 14 and earlier
    }
    checkIsPhone()
  },
  methods: {
    ...mapMutations([
      'updateIsBodyScrollLocked',
      'updateIsPhone',
      'updatePeriodicTableScale',
    ]),
    ...mapActions({
      toggleBalloonTip: 'balloon_tip/toggleBalloonTip',
      openDataPage: 'element/openDataPage',
      closeDataPage: 'element/closeDataPage',
    }),
    /**
     * データページを遷移する
     * @param {string} to - 'next'か'prev'
     */
    switchDataPage(to) {
      let z = this.currentDataPage.atomicNumber
      if (to === 'next') {
        z++
      } else if (to === 'prev') {
        z--
      }
      if (z >= 1 && z <= 118) {
        this.closeDataPage()
        this.openDataPage(z)
      }
    },
    /**
     * オーバーレイ表示時、データページのスクロール量を0にする
     * @param {object} el - オーバーレイの要素
     */
    enterFade(el) {
      el.querySelector('.overlay__main-wrapper').scrollTop = 0
    },
    /**
     * オーバーレイ表示前、bodyのスクロールを無効にする
     * @param {object} el - オーバーレイの要素
     */
    beforeEnterFade(el) {
      const targetEl = el.querySelector('.overlay__main-wrapper')
      disableBodyScroll(targetEl, {
        reserveScrollBarGap: true,
      })
      this.updateIsBodyScrollLocked(true)
    },
    /**
     * オーバーレイを閉じる前、bodyのスクロールを有効にする
     * @param {object} el - オーバーレイの要素
     */
    beforeLeaveFade(el) {
      clearAllBodyScrollLocks()
      this.updateIsBodyScrollLocked(false)
    },
    /**
     * ナビゲーションメニューを展開、格納する
     */
    toggleNavOpen() {
      // eslint-disable-next-line vue/no-mutating-props
      this.isNavOpened = !this.isNavOpened
    },
    /**
     * ナビゲーションメニューを格納する
     */
    closeNav() {
      this.isNavOpened = false
    },
    /**
     * スクロール量がページのトップあたりかを示すハンドラ
     */
    handleScroll() {
      if (window.scrollY > 200) {
        this.isAroundTop = false
      } else {
        this.isAroundTop = true
        this.isShareButtonExpanded = false
      }
    },
    /**
     * ページトップまでスクロールする
     */
    goToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    /**
     * 漢字をクリップボードにコピーする
     * @param {string} text - 選択された元素の漢字
     */
    copyToClipboard(text) {
      const successMessage = '漢字をコピーしました'
      const failureMessage = '漢字のコピーに失敗しました'
      try {
        if (!navigator.clipboard) {
          const handler = (e) => {
            e.clipboardData.setData('text/plain', text)
            e.preventDefault()
            document.removeEventListener('copy', handler)
          }
          document.addEventListener('copy', handler)
          document.execCommand('copy')
          this.showPopupBox(successMessage)
        } else {
          navigator.clipboard.writeText(text).then(
            () => this.showPopupBox(successMessage),
            () => this.showPopupBox(failureMessage)
          )
        }
      } catch (e) {
        this.showPopupBox(failureMessage)
      }
    },
    /**
     * 新たなトースト通知を表示する
     * @param {string} message - トースト通知に表示するメッセージ
     */
    showPopupBox(message) {
      const delay = 3000
      const maxLength = 8
      this.toastList.unshift({
        message,
        timeoutID: setTimeout(() => this.toastList.pop(), delay),
      })
      if (this.toastList.length > maxLength) {
        clearTimeout(this.toastList.pop().timeoutID)
      }
    },
    /**
     * 特定のトースト通知を閉じる
     * @param {number} timeoutID - 閉じるトースト通知のtimeoutID
     */
    clearPopupBox(timeoutID) {
      clearTimeout(timeoutID)
      this.toastList.splice(
        this.toastList.findIndex((item) => item.timeoutID === timeoutID),
        1
      )
    },
    /**
     * 画面幅が周期表の幅を超過しているかを示すハンドラ
     */
    checkPeriodicTableOverflow() {
      this.isPeriodicTableOverflow = !this.periodicTableMQL.matches
    },
    /**
     * 周期表の幅に対するメディアクエリを作成する
     */
    createMediaQuery() {
      this.periodicTableMQL = window.matchMedia(
        `(min-width: ${
          this.periodicTableRect.width * this.periodicTableScale
        }px)`
      )
      const handler = this.checkPeriodicTableOverflow
      try {
        this.periodicTableMQL.addEventListener('change', handler)
      } catch (e) {
        this.periodicTableMQL.addListener(handler) // for Safari 14 and earlier
      }
    },
    /**
     * シェアボタンを展開、格納する
     */
    toggleShareExpandButton() {
      this.isShareButtonExpanded = !this.isShareButtonExpanded
    },
  },
}
</script>

<style lang="scss"></style>
