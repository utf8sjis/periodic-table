<template>
  <section class="control-panel">
    <div class="control-panel__tab-container">
      <div class="control-panel__tab control-panel__tab--left-end"></div>
      <div class="control-panel__tab-button-container">
        <template v-for="(control, controlIndex) in controlList">
          <button
            :key="'tab-' + controlIndex"
            type="button"
            class="control-panel__tab"
            :class="{ 'is-active': control.isActive }"
            @click="setCurrentControl(controlIndex)"
          >
            <div>
              <i class="u-pr5" :class="control.iconClass"></i
              ><span>{{ control.name }}</span>
            </div>
          </button>
          <div
            v-show="controlIndex !== controlList.length - 1"
            :key="'separator-' + controlIndex"
            class="control-panel__tab-separator"
          ></div>
        </template>
        <div class="control-panel__tab-spacer"></div>
      </div>
    </div>

    <div class="control-panel__info-button-wrapper">
      <button
        type="button"
        class="control-panel__info-button"
        @click="updateBalloonTipActiveness({ id: 'controlPanel' })"
      >
        <i class="fas fa-info-circle"></i>
      </button>
      <balloon-tip
        id="controlPanel"
        :index="currentControlIndex"
        width="90%"
        top="28px"
        right="3px"
        beak-right="8px"
      ></balloon-tip>
    </div>

    <div class="control-panel__content-container">
      <transition name="control-panel__content-">
        <div v-show="currentControlIndex === 0" class="control-panel__content">
          <div
            class="lang-changer"
            :class="{ 'is-overflow-hidden': isBodyScrollLocked }"
          >
            <div class="lang-changer__button-container">
              <template v-for="(lang, langIndex) in langList">
                <button
                  :key="'button-' + langIndex"
                  type="button"
                  class="lang-changer__button"
                  :class="[
                    { 'is-active-lang': getLangItem(langIndex).isActive },
                  ]"
                  @click="updateLangActiveness(langIndex)"
                >
                  {{ lang.name }}
                </button>
                <div
                  v-show="langIndex !== langList.length - 1"
                  :key="'separator-' + langIndex"
                  class="lang-changer__separator"
                ></div>
              </template>
            </div>
          </div>
        </div>
      </transition>

      <transition name="control-panel__content-">
        <div v-show="currentControlIndex === 1" class="control-panel__content">
          <div class="element-search">
            <div class="element-search__container">
              <div class="element-search__select-wrapper">
                <select
                  v-model="elementSearchType"
                  class="element-search__select"
                >
                  <option value="all">すべて</option>
                  <option value="number">原子番号</option>
                  <option value="symbol">元素記号</option>
                  <option value="ja">日本語名</option>
                  <option value="en">英語名</option>
                  <option value="zh">中国語名</option>
                </select>
                <i class="element-search__select-icon fas fa-chevron-down"></i>
              </div>
              <div class="element-search__input-wrapper">
                <input
                  ref="elementSearchInput"
                  type="text"
                  class="element-search__input"
                  @input="seachElements"
                />
                <button
                  v-show="
                    $refs.elementSearchInput && $refs.elementSearchInput.value
                  "
                  type="button"
                  class="element-search__input-reset-button"
                  @click="resetElementSearchInput"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div
                v-show="
                  !isPhone ||
                  ($refs.elementSearchInput && $refs.elementSearchInput.value)
                "
                class="element-search__result-container"
              >
                <div class="element-search__result-bar">
                  <div>検索結果：{{ elementSearchResultList.length }} 元素</div>
                  <div class="u-spacer"></div>
                  <button
                    type="button"
                    class="element-search__result-bar-button"
                    @click="
                      isDisplayedElementSearchResultList =
                        !isDisplayedElementSearchResultList
                    "
                  >
                    <i
                      v-show="
                        elementSearchResultList.length &&
                        isDisplayedElementSearchResultList
                      "
                      class="fas fa-chevron-circle-up"
                    ></i
                    ><i
                      v-show="
                        elementSearchResultList.length &&
                        !isDisplayedElementSearchResultList
                      "
                      class="fas fa-chevron-circle-down"
                    ></i>
                  </button>
                </div>
                <ul
                  v-show="
                    elementSearchResultList.length &&
                    isDisplayedElementSearchResultList
                  "
                  class="element-search__result-list"
                >
                  <template
                    v-for="(result, resultIndex) in elementSearchResultList"
                  >
                    <li :key="'button-' + result.element.atomicNumber">
                      <button
                        type="button"
                        class="element-search__result-item-button"
                        @click="
                          $emit(
                            'open-overlay',
                            atomicNumberToIndex(result.element.atomicNumber)
                          )
                        "
                      >
                        <span
                          >{{ result.element.atomicNumber }}
                          {{ result.element.elementSymbol }}
                          {{ result.element.japaneseName }}</span
                        >
                        <inline-tag
                          v-for="type in result.matchTypeList"
                          :key="type.tagName"
                          class="u-mr5"
                          :type="type.className"
                          >{{ type.tagName }}</inline-tag
                        >
                      </button>
                    </li>
                    <li
                      v-show="
                        resultIndex !== elementSearchResultList.length - 1
                      "
                      :key="'separator-' + result.element.atomicNumber"
                      class="element-search__result-separator"
                    ></li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="control-panel__content-">
        <div v-show="currentControlIndex === 2" class="control-panel__content">
          <div class="periodic-table-scaler">
            <input
              type="range"
              class="periodic-table-scaler__input-range"
              min="0.5"
              max="2"
              step="0.05"
              :value="periodicTableScale"
              @input="updatePeriodicTableScale(parseFloat($event.target.value))"
            />
            <button
              type="button"
              class="periodic-table-scaler__value-display"
              @click="updatePeriodicTableScale(1)"
            >
              {{ periodicTableScale + 'x' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { controlList } from '@/assets/js/control_list.js'

export default {
  name: 'ControlPanel',

  data() {
    return {
      controlList,
      currentControlIndex: 0,
      elementSearchType: 'all',
      isDisplayedElementSearchResultList: false,
      elementSearchResultList: [],
    }
  },

  computed: {
    ...mapGetters(['isBodyScrollLocked', 'isPhone', 'periodicTableScale']),
    ...mapGetters({
      elementList: 'element/list',
      atomicNumberToIndex: 'element/atomicNumberToIndex',
      langList: 'lang/list',
      getLangItem: 'lang/getItem',
    }),
    /**
     * リスト中の現在選択されている操作のデータ
     * currentControlIndexに依存
     * @returns {object} リスト中の操作のオブジェクト
     */
    currentControl() {
      return this.controlList[this.currentControlIndex]
    },
  },

  watch: {
    /**
     * 元素の検索対象の変更を監視し、inputイベントを発生させる
     */
    elementSearchType() {
      const e = new Event('input')
      this.$refs.elementSearchInput.dispatchEvent(e)
    },
  },

  methods: {
    ...mapMutations(['updatePeriodicTableScale']),
    ...mapMutations({
      updateLangActiveness: 'lang/updateActiveness',
      updateBalloonTipActiveness: 'balloon_tip/updateActiveness',
    }),
    /**
     * 操作パネルの操作の内容を変更する
     * @param {number} nextControlIndex - 選択された操作のcontrolListでのインデクス
     */
    setCurrentControl(nextControlIndex) {
      this.currentControl.isActive = false
      this.currentControlIndex = nextControlIndex
      this.currentControl.isActive = true
    },
    /**
     * 検索対象をもとに元素を検索し結果をリストに格納する
     * @param {object} e - InputEvent
     */
    seachElements(e) {
      this.elementSearchResultList = []
      const value = e.target.value.toLowerCase()

      if (value) {
        this.isDisplayedElementSearchResultList = true

        const sortedElementList = this.elementList.slice()
        if (this.elementSearchType === 'symbol') {
          // 元素記号は完全一致likeな表示にした方がわかりやすい
          sortedElementList.sort(
            (a, b) => a.elementSymbol.length - b.elementSymbol.length
          )
        }

        sortedElementList.forEach((element) => {
          const typeList = []
          typeList.push({
            type: {
              type: 'number',
              className: 'atomic-number',
              tagName: '番号',
            },
            // eslint-disable-next-line eqeqeq
            isMatch: element.atomicNumber == value,
          })
          typeList.push({
            type: {
              type: 'symbol',
              className: 'element-symbol',
              tagName: '記号',
            },
            isMatch: element.elementSymbol.toLowerCase().includes(value),
          })
          typeList.push({
            type: { type: 'en', className: 'english-name', tagName: '英' },
            isMatch: element.englishName.toLowerCase().includes(value),
          })
          typeList.push({
            type: { type: 'ja', className: 'japanese-name', tagName: '日' },
            isMatch:
              element.japaneseName.includes(value) ||
              element.japaneseReading.includes(value),
          })
          typeList.push({
            type: {
              type: 'zh',
              className: 'simplified-chinese',
              tagName: '大陸',
            },
            isMatch: element.simplifiedChinese.includes(value),
          })
          typeList.push({
            type: { type: 'zh', className: 'taiwan-trad', tagName: '台湾' },
            isMatch: element.taiwanTrad.includes(value),
          })
          typeList.push({
            type: { type: 'zh', className: 'hongkong-trad', tagName: '香港' },
            isMatch: element.hongkongTrad.includes(value),
          })

          if (
            typeList.some(
              (item) =>
                item.isMatch &&
                (this.elementSearchType === 'all' ||
                  item.type.type === this.elementSearchType)
            )
          ) {
            const matchTypeList = []
            typeList.forEach((item) => {
              if (item.isMatch) {
                matchTypeList.push(item.type)
              }
            })
            this.elementSearchResultList.push({ element, matchTypeList })
          }
        })
      }
    },
    /**
     * 元素の検索結果と入力をリセットする
     */
    resetElementSearchInput() {
      this.elementSearchResultList = []
      this.$refs.elementSearchInput.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/global' as g;

$controlPanelHeight: 90px;
$controlPanelTabHeight: 28px;
$controlPanelBorderRadius: 8px;

.control-panel {
  display: grid;
  grid-template-columns: auto 35px;
  grid-template-rows: $controlPanelTabHeight auto;
  position: sticky;
  top: g.$headerHeight;
  margin: 0 auto;
  border: 2px solid g.$colorMain2;
  border-radius: $controlPanelBorderRadius;
  width: g.$controlPanelWidth;
  height: $controlPanelHeight;
  filter: drop-shadow(0 0 2px #0002);
  z-index: 100;
  @include g.mediaQuery(g.$controlPanelWidth) {
    margin: 0 10px;
    width: auto;
  }
  @include g.mediaQuery() {
    top: g.$headerHeightPhone;
  }

  &__tab-container {
    display: flex;
    overflow: hidden;
    border-radius: $controlPanelBorderRadius - 2px 0 0 0;
  }

  &__tab-button-container {
    flex: 1;
    display: flex;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  &__tab {
    @include g.flexCentering();
    height: 100%;
    padding: 0 10px;
    white-space: nowrap;
    font-size: 14px;
    color: g.$colorWhite;
    background: g.$colormain2Light;
    transition-property: color, background-color;
    transition-duration: 0.2s;
    &.is-active {
      color: g.$colorMain2;
      background: g.$colorBaseA;
    }
    &--left-end {
      width: 10px;
      padding: 0;
      background: g.$colorMain2;
    }
  }

  &__tab-separator {
    flex: none;
    width: 2px;
    background: g.$colorMain2;
  }

  &__tab-spacer {
    flex-grow: 1;
    background: g.$colorMain2;
  }

  &__info-button-wrapper {
    border-radius: 0 $controlPanelBorderRadius - 2px 0 0;
    z-index: 101;
  }

  &__info-button {
    @include g.flexCentering();
    width: 100%;
    height: 100%;
    border-radius: 0 $controlPanelBorderRadius - 2px 0 0;
    font-size: 15px;
    color: g.$colorWhite;
    background: g.$colorMain1;
  }

  &__content-container {
    grid-column: 1 / -1;
    position: relative;
    overflow: visible;
    border-radius: 0 0 $controlPanelBorderRadius - 2px $controlPanelBorderRadius -
      2px;
    background: g.$colorBaseA;
  }

  &__content {
    position: absolute;
    width: 100%;
    height: 100%;
    &--enter-active {
      transition-property: opacity, transform;
      transition-duration: 0.2s;
      transition-delay: 0.05s;
    }
    &--leave-active {
      transition-property: opacity, transform;
      transition-duration: 0.2s;
    }
    &--enter,
    &--leave-to {
      opacity: 0;
      transform: translateY(-3px);
    }

    > div {
      /*
        overflowの扱いはcontrol-panelに依存する直下の個々のコンテンツに任せているため、
        その輪郭を指定するborderは親であるcontrol-panelに依存して指定したほうが
        構造の把握が容易。
      */
      border-radius: 0 0 $controlPanelBorderRadius - 2px
        $controlPanelBorderRadius - 2px;
    }
  }
}
</style>
