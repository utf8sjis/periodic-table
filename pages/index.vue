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
          <control-panel
            :is-phone="isPhone"
            @open-overlay="openOverlay"
          />

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
                <div class="periodic-table__la-ac" :class="getLangItem().class">
                  <span>{{ cell[getLangItem().key] }}</span>
                </div>
              </div>
              <button
                v-for="(element, elementIndex) in elementList"
                :key="'cell-' + elementIndex"
                type="button"
                class="periodic-table__cell-wrapper"
                :class="[
                  'periodic-table__cell-wrapper--cell-' + element.elementSymbol,
                  { 'is-active': getElementItem(elementIndex).isActive },
                ]"
                @click="openOverlay(elementIndex)"
              >
                <div
                  class="periodic-table__cell"
                  :class="[
                    'periodic-table__cell--' + element.categoryClass,
                    getLangItem().class,
                  ]"
                >
                  <span
                    class="periodic-table__cell-text"
                    :class="[
                      'periodic-table__cell-text--cell-' +
                        element.elementSymbol,
                      getLangItem().class,
                    ]"
                    >{{ element[getLangItem().key] }}</span
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
              v-show="isOverlayDisplayed"
              class="overlay"
              :class="'is-' + getElementItem().categoryClass"
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
                          :class="'is-' + getElementItem().categoryClass"
                        >
                          <div class="data-area__item-state">
                            <img
                              class="data-area__state-image"
                              :class="'is-' + getElementItem().categoryClass"
                              :src="getElementItem().stateSrc"
                            />
                          </div>
                          <div class="data-area__item-radioactivity">
                            <img
                              v-show="getElementItem().isRadioactive"
                              class="data-area__radioactivity-image"
                              src="@/assets/img/state/radioactivity.svg"
                            />
                          </div>
                          <div class="data-area__item-element-symbol">
                            {{ getElementItem().elementSymbol }}
                          </div>
                        </div>
                      </div>
                      <div class="overlay__area overlay__area--atomic-number">
                        <data-area
                          type="num"
                          label="Z ="
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().atomicNumber }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--period">
                        <data-area
                          type="num"
                          label="Period"
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().period }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--group">
                        <data-area
                          type="num"
                          label="Group"
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().group }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--atomic-weight">
                        <data-area
                          type="num"
                          label="Weight"
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().atomicWeight }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--category">
                        <data-area
                          type="category"
                          label="Category"
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                        >
                          <div class="data-area__category-text">
                            <template
                              v-for="(
                                category, categoryIndex
                              ) in getElementItem().categoryList"
                            >
                              <span
                                :key="categoryIndex"
                                class="data-area__category-text-item"
                                >{{ category
                                }}<span
                                  v-show="
                                    categoryIndex !==
                                    getElementItem().categoryList.length - 1
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
                            'is-' + getElementItem().categoryClass
                          "
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--cn"
                          >
                            {{ getElementItem().simplifiedChinese }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ getElementItem().unicodeCodePointCN }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + getElementItem().categoryClass"
                              @click="
                                copyToClipboard(
                                  getElementItem().simplifiedChinese
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
                            'is-' + getElementItem().categoryClass
                          "
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--tw"
                          >
                            {{ getElementItem().taiwanTrad }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ getElementItem().unicodeCodePointTW }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + getElementItem().categoryClass"
                              @click="
                                copyToClipboard(getElementItem().taiwanTrad)
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
                            'is-' + getElementItem().categoryClass
                          "
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--hk"
                          >
                            {{ getElementItem().hongkongTrad }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ getElementItem().unicodeCodePointHK }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + getElementItem().categoryClass"
                              @click="
                                copyToClipboard(getElementItem().hongkongTrad)
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
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().pinyin }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--bopomofo">
                        <data-area
                          type="pinyin"
                          label="Bopomofo"
                          sub-label="Taiwan"
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().bopomofo }} ({{
                            getElementItem().taiwanPinyin
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
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().japaneseName }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--english-name">
                        <data-area
                          type="english-name"
                          label="English Name"
                          :category-class="
                            'is-' + getElementItem().categoryClass
                          "
                          >{{ getElementItem().englishName }}</data-area
                        >
                      </div>
                    </div>
                    <div class="overlay__container-tweet">
                      <div class="overlay__area overlay__area--tweet">
                        <div
                          class="data-area data-area--tweet"
                          :class="'is-' + getElementItem().categoryClass"
                        >
                          <div
                            ref="contAreaTweet"
                            class="data-area__item-tweet"
                            v-html="getElementItem().twitterTweet"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div class="overlay__container-close">
                      <div class="overlay__area overlay__area--close">
                        <div
                          class="data-area"
                          :class="'is-' + getElementItem().categoryClass"
                        >
                          <button
                            type="button"
                            class="data-area__item-close-button"
                            :class="'is-' + getElementItem().categoryClass"
                            @click="closeOverlay"
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
                    :class="'is-' + getElementItem().categoryClass"
                    @click="updateBalloonTipActiveness({ id: 'overlayMain' })"
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
                :class="'is-' + getElementItem().categoryClass"
                @click="closeOverlay"
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
                    :class="'is-' + getElementItem().categoryClass"
                  >
                    <div
                      class="data-area__item-element-changer"
                      :class="'is-' + getElementItem().categoryClass"
                    >
                      <button
                        type="button"
                        :disabled="elementChangeButton.isStart"
                        class="data-area__element-changer-button"
                        :class="{ 'is-disabled': elementChangeButton.isStart }"
                        @click="changeOverlay('prev')"
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
                        @click="changeOverlay('next')"
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
import { mapGetters, mapMutations } from 'vuex'
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
      /** オーバーレイ表示しているか否か */
      isOverlayDisplayed: false,
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
      /** 画面幅がスマートフォン幅か否か */
      isPhone: false,
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
      elementList: 'element/list',
      getElementItem: 'element/getItem',
      atomicNumberToIndex: 'element/atomicNumberToIndex',
      getLangItem: 'lang/getItem',
    }),
    /**
     * 現在のデータページのページ遷移ボタンの表示内容
     * @returns {object} 表示内容の情報を含んだオブジェクト
     */
    elementChangeButton() {
      const z = this.getElementItem().atomicNumber
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
        const nextIndex = this.atomicNumberToIndex(z + 1)
        obj.prev.atomicNumber = 0
        obj.prev.elementSymbol = 'n'
        obj.next.atomicNumber = this.getElementItem(nextIndex).atomicNumber
        obj.next.elementSymbol = this.getElementItem(nextIndex).elementSymbol
        obj.isStart = true
        obj.isEnd = false
      } else if (z + 1 > 118) {
        const prevIndex = this.atomicNumberToIndex(z - 1)
        obj.prev.atomicNumber = this.getElementItem(prevIndex).atomicNumber
        obj.prev.elementSymbol = this.getElementItem(prevIndex).elementSymbol
        obj.next.atomicNumber = 119
        obj.next.elementSymbol = 'Uue'
        obj.isStart = false
        obj.isEnd = true
      } else {
        const nextIndex = this.atomicNumberToIndex(z + 1)
        const prevIndex = this.atomicNumberToIndex(z - 1)
        obj.prev.atomicNumber = this.getElementItem(prevIndex).atomicNumber
        obj.prev.elementSymbol = this.getElementItem(prevIndex).elementSymbol
        obj.next.atomicNumber = this.getElementItem(nextIndex).atomicNumber
        obj.next.elementSymbol = this.getElementItem(nextIndex).elementSymbol
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
    let itemObj = JSON.parse(localStorage.getItem('itemStorage'))
    itemObj = {
      themeId: itemObj?.themeId ?? 'default',
      periodicTableScale: itemObj?.periodicTableScale ?? 1,
    }
    localStorage.setItem('itemStorage', JSON.stringify(itemObj))
    this.updateThemeActiveness(itemObj.themeId)
    this.updatePeriodicTableScale(itemObj.periodicTableScale)
    // 周期表の幅に対するメディアクエリを作成
    this.createMediaQuery()
    this.checkPeriodicTableOverflow()
    // スマートフォン幅に対するメディアクエリを作成 -> _variable.scss
    const phoneMQL = window.matchMedia('(max-width: 550px)')
    const checkIsPhone = () => (this.isPhone = phoneMQL.matches)
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
      'updatePeriodicTableScale',
    ]),
    ...mapMutations({
      updateThemeActiveness: 'theme/updateActiveness',
      updateElementActiveness: 'element/updateActiveness',
      updateBalloonTipActiveness: 'balloon_tip/updateActiveness',
    }),
    /**
     * 元素のデータページをオーバーレイ表示する
     * @param {number} nextElementIndex - 選択された元素のelementListでのインデクス
     */
    openOverlay(nextElementIndex) {
      this.updateElementActiveness(nextElementIndex)
      this.isOverlayDisplayed = true
      this.runTwitterScript()
    },
    /**
     * 元素のデータページを閉じる
     */
    closeOverlay() {
      this.updateBalloonTipActiveness({ id: 'overlayMain', by: 'close' })
      this.isOverlayDisplayed = false
      this.updateElementActiveness()
    },
    /**
     * データページを遷移する
     * @param {string} to - 'next'か'prev'
     */
    changeOverlay(to) {
      let z = this.getElementItem().atomicNumber
      if (to === 'next') {
        z++
      } else if (to === 'prev') {
        z--
      }
      if (z >= 1 && z <= 118) {
        this.openOverlay(this.atomicNumberToIndex(z))
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
     * Twitterのスクリプトタグを明示的に設置し実行する
     */
    runTwitterScript() {
      const scriptEl = document.createElement('script')
      scriptEl.async = true
      scriptEl.src = 'https://platform.twitter.com/widgets.js'
      this.$refs.contAreaTweet.appendChild(scriptEl)
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
