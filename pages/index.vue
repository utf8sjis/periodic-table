<template>
  <div>
    <div id="app">
      <header v-cloak class="header">
        <div
          class="header__fixed-container"
          :class="{ 'is-active': isNavOpened }"
        >
          <div class="header__start">
            <div class="header__logo">
              <a href="https://gensokanji.netlify.app">gensokanji</a>
            </div>
            <div class="header__site">
              <i class="u-pr5 fas fa-location-arrow"></i>元素の漢字周期表
            </div>
          </div>

          <div class="header__end">
            <div class="header__share-container">
              <div class="header__share-label">SHARE</div>
              <div class="header__share-button-container">
                <a
                  class="header__share-button header__share-button--twitter"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://twitter.com/share?url=https://gensokanji.netlify.app/periodic-table&text=元素の漢字周期表%20-%20gensokanji%20@gensokanji_bot"
                  ><i class="fab fa-twitter"></i
                ></a>
                <a
                  class="header__share-button header__share-button--facebook"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://www.facebook.com/sharer/sharer.php?u=https://gensokanji.netlify.app/periodic-table"
                  ><i class="fab fa-facebook"></i
                ></a>
                <a
                  class="header__share-button header__share-button--line"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://social-plugins.line.me/lineit/share?url=https://gensokanji.netlify.app/periodic-table"
                  ><i class="fab fa-line"></i
                ></a>
              </div>
            </div>
            <button
              type="button"
              class="header__nav-open-button"
              @click="toggleNavOpen"
            >
              <span v-show="!isNavOpened">MORE</span>
              <span v-show="isNavOpened">CLOSE</span>
              <span class="header__nav-open-button-icon-wrapper">
                <i
                  class="header__nav-open-button-arrow-icon fas fa-long-arrow-alt-down"
                  :class="{ 'is-active': isNavOpened }"
                ></i>
                <i class="fas fa-list"></i>
              </span>
            </button>
          </div>
        </div>
      </header>

      <transition name="nav-">
        <nav v-cloak v-show="isNavOpened" class="nav">
          <div class="nav__content-wrapper">
            <div class="nav__content">
              <section class="nav__section">
                <div class="nav__section-title">テーマカラー</div>
                <div class="nav__theme-color-changer">
                  <div class="nav__theme-color-changer-button-wrapper">
                    <button
                      v-for="(themeColor, themeColorIndex) in themeColorList"
                      :key="themeColorIndex"
                      type="button"
                      class="nav__theme-color-changer-button"
                      :class="
                        'nav__theme-color-changer-button--' + themeColor.name
                      "
                      :style="{ background: themeColor.main2 }"
                      @click="changeThemeColor(themeColor.name)"
                    >
                      {{ themeColor.displayName }}
                    </button>
                  </div>
                </div>
              </section>
              <template
                v-for="(
                  navLinkSection, navLinkSectionIndex
                ) in navLinkSectionList"
              >
                <section :key="navLinkSectionIndex" class="nav__section">
                  <div class="nav__section-title">
                    {{ navLinkSection.title }}
                  </div>
                  <div class="nav__link-container">
                    <a
                      v-for="(navLink, navLinkIndex) in navLinkSection.links"
                      :key="navLinkIndex"
                      class="nav__link"
                      v-bind="
                        navLink.isTargetBlank
                          ? {
                              target: '_blank',
                              rel: 'noreferrer noopener',
                            }
                          : false
                      "
                      :href="navLink.href"
                    >
                      <div class="nav__link-image-container">
                        <img
                          class="nav__link-image"
                          :src="navLink.src"
                          :alt="navLink.alt"
                        />
                        <div class="nav__image-inset-shadow"></div>
                        <i
                          v-show="navLink.isTargetBlank"
                          class="nav__image-external-link-icon fas fa-external-link-alt"
                        ></i>
                      </div>
                      <div class="nav__link-content">
                        <div class="nav__link-title">{{ navLink.title }}</div>
                        <div class="nav__link-desc">{{ navLink.desc }}</div>
                      </div>
                    </a>
                  </div>
                </section>
              </template>
              <div class="nav__illustration">
                <img
                  class="nav__illustration-image"
                  src="@/assets/img/demon_core.png"
                  alt="デーモンコアのイラスト"
                />
              </div>
            </div>
          </div>
        </nav>
      </transition>

      <transition name="nav-back-">
        <div
          v-cloak
          v-show="isNavOpened"
          class="nav-back"
          @click="closeNav"
        ></div>
      </transition>

      <transition name="bottom-fixed-area-">
        <div v-show="!isAroundTop" class="bottom-fixed-area">
          <div>
            <div class="bottom-fixed-area__share-button-container">
              <div class="bottom-fixed-area__share-button-wrapper">
                <a
                  class="bottom-fixed-area__share-button bottom-fixed-area__share-button--twitter"
                  :class="{ 'is-expanded': isShareButtonExpanded }"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://twitter.com/share?url=https://gensokanji.netlify.app/periodic-table&text=元素の漢字周期表%20-%20gensokanji%20@gensokanji_bot"
                  ><i class="fab fa-twitter"></i
                ></a>
              </div>
              <div class="bottom-fixed-area__share-button-wrapper">
                <a
                  class="bottom-fixed-area__share-button bottom-fixed-area__share-button--facebook"
                  :class="{ 'is-expanded': isShareButtonExpanded }"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://www.facebook.com/sharer/sharer.php?u=https://gensokanji.netlify.app/periodic-table"
                  ><i class="fab fa-facebook"></i
                ></a>
              </div>
              <div class="bottom-fixed-area__share-button-wrapper">
                <a
                  class="bottom-fixed-area__share-button bottom-fixed-area__share-button--line"
                  :class="{ 'is-expanded': isShareButtonExpanded }"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://social-plugins.line.me/lineit/share?url=https://gensokanji.netlify.app/periodic-table"
                  ><i class="fab fa-line"></i
                ></a>
              </div>
              <div class="bottom-fixed-area__share-button-wrapper">
                <button
                  type="button"
                  class="bottom-fixed-area__share-expand-button"
                  :class="{ 'is-expanded': isShareButtonExpanded }"
                  @click="toggleShareExpandButton"
                >
                  <span class="material-icons">share</span>
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="bottom-fixed-area__top-button"
            @click="goToTop"
          >
            <i class="fas fa-angle-up"></i>
          </button>
        </div>
      </transition>

      <main v-cloak>
        <section class="main-app">
          <section class="control-panel">
            <div class="control-panel__tab-container">
              <div
                class="control-panel__tab control-panel__tab--left-end"
              ></div>
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
                @click="togglePopupBalloon('controlPanel')"
              >
                <i class="fas fa-info-circle"></i>
              </button>
              <popup-balloon
                :popup-balloons="popupBalloons"
                name="controlPanel"
                :index="current.controlIndex"
                width="90%"
                top="28px"
                right="3px"
                beak-right="8px"
                @toggle-popup-balloon="togglePopupBalloon('controlPanel')"
              ></popup-balloon>
            </div>

            <div class="control-panel__content-container">
              <transition name="control-panel__content-">
                <div
                  v-show="current.controlIndex === 0"
                  class="control-panel__content"
                >
                  <div
                    class="lang-changer"
                    :class="{ 'is-overflow-hidden': isBodyScrollLocked }"
                  >
                    <div class="lang-changer__button-container">
                      <template v-for="(langObj, langIndex) in langList">
                        <button
                          :key="'button-' + langIndex"
                          type="button"
                          class="lang-changer__button"
                          :class="[
                            { 'is-active-lang': langList[langIndex].isActive },
                          ]"
                          @click="setCurrentLang(langIndex)"
                        >
                          {{ langObj.langName }}
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
                <div
                  v-show="current.controlIndex === 1"
                  class="control-panel__content"
                >
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
                        <i
                          class="element-search__select-icon fas fa-chevron-down"
                        ></i>
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
                            $refs.elementSearchInput &&
                            $refs.elementSearchInput.value
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
                          ($refs.elementSearchInput &&
                            $refs.elementSearchInput.value)
                        "
                        class="element-search__result-container"
                      >
                        <div class="element-search__result-bar">
                          <div>
                            検索結果：{{ elementSearchResultList.length }} 元素
                          </div>
                          <div class="u-spacer"></div>
                          <button
                            type="button"
                            class="element-search__result-bar-button"
                            @click="
                              displayElementSearchResultList =
                                !displayElementSearchResultList
                            "
                          >
                            <i
                              v-show="
                                elementSearchResultList.length &&
                                displayElementSearchResultList
                              "
                              class="fas fa-chevron-circle-up"
                            ></i
                            ><i
                              v-show="
                                elementSearchResultList.length &&
                                !displayElementSearchResultList
                              "
                              class="fas fa-chevron-circle-down"
                            ></i>
                          </button>
                        </div>
                        <ul
                          v-show="
                            elementSearchResultList.length &&
                            displayElementSearchResultList
                          "
                          class="element-search__result-list"
                        >
                          <template
                            v-for="(
                              result, resultIndex
                            ) in elementSearchResultList"
                          >
                            <li :key="'button-' + result.element.atomicNumber">
                              <button
                                type="button"
                                class="element-search__result-item-button"
                                @click="
                                  openOverlay(
                                    atomicNumberToIndex(
                                      result.element.atomicNumber
                                    )
                                  )
                                "
                              >
                                <span
                                  >{{ result.element.atomicNumber }}
                                  {{ result.element.elementSymbol }}
                                  {{ result.element.japaneseName }}</span
                                >
                                <span
                                  v-for="type in result.matchTypeList"
                                  :key="type.tagName"
                                  class="element-search__result-type-tag"
                                  :class="
                                    'element-search__result-type-tag--' +
                                    type.className
                                  "
                                  >{{ type.tagName }}</span
                                >
                              </button>
                            </li>
                            <li
                              v-show="
                                resultIndex !==
                                elementSearchResultList.length - 1
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
                <div
                  v-show="current.controlIndex === 2"
                  class="control-panel__content"
                >
                  <div class="periodic-table-scaler">
                    <input
                      v-model="rangeValue"
                      type="range"
                      class="periodic-table-scaler__input-range"
                      min="0.5"
                      max="2"
                      step="0.05"
                    />
                    <button
                      type="button"
                      class="periodic-table-scaler__value-display"
                      @click="defaultRange"
                    >
                      {{ rangeValue + 'x' }}
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </section>

          <section
            class="periodic-table"
            :class="{
              'is-overflow-scroll': isPeriodicTableOverflow,
              'is-overflow-hidden': isBodyScrollLocked,
            }"
            :style="{ height: periodicTableRect.height * rangeValue + 'px' }"
          >
            <div
              ref="periodicTable"
              class="periodic-table__grid-container"
              :class="{ 'is-overflow-scroll': isPeriodicTableOverflow }"
              :style="{ transform: 'scale(' + rangeValue + ')' }"
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
                <div
                  class="periodic-table__la-ac"
                  :class="currentLang.langClass"
                >
                  <span>{{ cell[currentLang.langKey] }}</span>
                </div>
              </div>
              <button
                v-for="(element, elementIndex) in elementList"
                :key="'cell-' + elementIndex"
                type="button"
                class="periodic-table__cell-wrapper"
                :class="[
                  'periodic-table__cell-wrapper--cell-' + element.elementSymbol,
                  { 'is-active': elementList[elementIndex].isActive },
                ]"
                @click="openOverlay(elementIndex)"
              >
                <div
                  class="periodic-table__cell"
                  :class="[
                    'periodic-table__cell--' + element.categoryClass,
                    currentLang.langClass,
                  ]"
                >
                  <span
                    class="periodic-table__cell-text"
                    :class="[
                      'periodic-table__cell-text--cell-' +
                        element.elementSymbol,
                      currentLang.langClass,
                    ]"
                    >{{ element[currentLang.langKey] }}</span
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
              :class="'is-' + currentElement.categoryClass"
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
                          :class="'is-' + currentElement.categoryClass"
                        >
                          <div class="data-area__item-state">
                            <img
                              class="data-area__state-image"
                              :class="'is-' + currentElement.categoryClass"
                              :src="currentElement.stateSrc"
                            />
                          </div>
                          <div class="data-area__item-radioactivity">
                            <img
                              v-show="currentElement.isRadioactive"
                              class="data-area__radioactivity-image"
                              src="@/assets/img/state/radioactivity.svg"
                            />
                          </div>
                          <div class="data-area__item-element-symbol">
                            {{ currentElement.elementSymbol }}
                          </div>
                        </div>
                      </div>
                      <div class="overlay__area overlay__area--atomic-number">
                        <data-area
                          type="num"
                          label="Z ="
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.atomicNumber }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--period">
                        <data-area
                          type="num"
                          label="Period"
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.period }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--group">
                        <data-area
                          type="num"
                          label="Group"
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.group }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--atomic-weight">
                        <data-area
                          type="num"
                          label="Weight"
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.atomicWeight }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--category">
                        <data-area
                          type="category"
                          label="Category"
                          :category-class="'is-' + currentElement.categoryClass"
                        >
                          <div class="data-area__category-text">
                            <template
                              v-for="(
                                category, categoryIndex
                              ) in currentElement.categoryList"
                            >
                              <span
                                :key="categoryIndex"
                                class="data-area__category-text-item"
                                >{{ category
                                }}<span
                                  v-show="
                                    categoryIndex !==
                                    currentElement.categoryList.length - 1
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
                          :category-class="'is-' + currentElement.categoryClass"
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--cn"
                          >
                            {{ currentElement.simplifiedChinese }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ currentElement.unicodeCodePointCN }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + currentElement.categoryClass"
                              @click="
                                copyToClipboard(
                                  currentElement.simplifiedChinese
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
                          :category-class="'is-' + currentElement.categoryClass"
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--tw"
                          >
                            {{ currentElement.taiwanTrad }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ currentElement.unicodeCodePointTW }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + currentElement.categoryClass"
                              @click="
                                copyToClipboard(currentElement.taiwanTrad)
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
                          :category-class="'is-' + currentElement.categoryClass"
                        >
                          <div
                            class="data-area__kanji-character data-area__kanji-character--hk"
                          >
                            {{ currentElement.hongkongTrad }}
                          </div>
                          <div class="data-area__kanji-code-point">
                            U+{{ currentElement.unicodeCodePointHK }}
                          </div>
                          <template #absolute>
                            <button
                              type="button"
                              class="data-area__item-kanji-copy-button"
                              :class="'is-' + currentElement.categoryClass"
                              @click="
                                copyToClipboard(currentElement.hongkongTrad)
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
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.pinyin }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--bopomofo">
                        <data-area
                          type="pinyin"
                          label="Bopomofo"
                          sub-label="Taiwan"
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.bopomofo }} ({{
                            currentElement.taiwanPinyin
                          }})</data-area
                        >
                      </div>
                    </div>
                    <div class="overlay__container-name">
                      <div class="overlay__area overlay__area--japanese-name">
                        <data-area
                          type="japanese-name"
                          label="Japanese Name"
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.japaneseName }}</data-area
                        >
                      </div>
                      <div class="overlay__area overlay__area--english-name">
                        <data-area
                          type="english-name"
                          label="English Name"
                          :category-class="'is-' + currentElement.categoryClass"
                          >{{ currentElement.englishName }}</data-area
                        >
                      </div>
                    </div>
                    <div class="overlay__container-tweet">
                      <div class="overlay__area overlay__area--tweet">
                        <div
                          class="data-area data-area--tweet"
                          :class="'is-' + currentElement.categoryClass"
                        >
                          <div
                            ref="contAreaTweet"
                            class="data-area__item-tweet"
                            v-html="currentElement.twitterTweet"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div class="overlay__container-close">
                      <div class="overlay__area overlay__area--close">
                        <div
                          class="data-area"
                          :class="'is-' + currentElement.categoryClass"
                        >
                          <button
                            type="button"
                            class="data-area__item-close-button"
                            :class="'is-' + currentElement.categoryClass"
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
                    :class="'is-' + currentElement.categoryClass"
                    @click="togglePopupBalloon('overlayMain')"
                  >
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <popup-balloon
                    :popup-balloons="popupBalloons"
                    name="overlayMain"
                    width="90%"
                    top="-10px"
                    left="4px"
                    beak-left="6px"
                    @toggle-popup-balloon="togglePopupBalloon('overlayMain')"
                  ></popup-balloon>
                </div>
              </div>
              <button
                type="button"
                class="overlay__close-button"
                :class="'is-' + currentElement.categoryClass"
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
                    :class="'is-' + currentElement.categoryClass"
                  >
                    <div
                      class="data-area__item-element-changer"
                      :class="'is-' + currentElement.categoryClass"
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

        <article class="main-article">
          <article-section headline="元素の漢字周期表" :is-level-one="true">
            <article-subsection :is-no-headline="true">
              <article-p
                ><span class="u-marker-bold">元素の漢字周期表</span>は、<span
                  class="u-bold"
                  >中国語での元素名</span
                >を並べた漢字の元素周期表です。</article-p
              >
              <article-p
                >中国語圏では、化学元素の命名は<span class="u-bold"
                  >漢字1字</span
                >でなされます。日本では新しい元素が発見された場合、発音からカタカナ表記にして命名しますが、中国や台湾、香港ではその元素を表す新たな漢字が作られるのです。</article-p
              >
              <article-p
                >元素好き、漢字好きとなれば自ずと見えてくるその接点、「<span
                  class="u-marker-bold"
                  >元素の漢字</span
                >」を、このサイトでより好きになっていただければ幸いです。</article-p
              >
            </article-subsection>
          </article-section>

          <article-section headline="元素の漢字を眺める">
            <article-subsection headline="漢字の命名規則">
              <article-p
                >元素の漢字は基本的に漢字の分類法である六書のうち、意符＋音符で作られる「<span
                  class="u-bold"
                  >形声</span
                >」に従って命名されます。</article-p
              >
              <article-p
                >例えば、2016年に名称が決定した113番元素ニホニウムの漢字「<span
                  class="u-tw"
                  >鉨</span
                >」は、金属元素を表すかねへんを部首に、nihoniumの「ni」から、発音を表す「<span
                  class="u-tw"
                  >你</span
                >
                (nǐ)」などのつくり「<span class="u-tw">尔</span
                >」を付して作られました。</article-p
              >
              <article-p
                >このように、ほとんどの漢字は英語（IUPAC名）の発音の一部をとった<span
                  class="u-marker-bold"
                  >音訳によって新たに作られた漢字</span
                >です。</article-p
              >
              <article-p
                >一方、一部には音訳ではない漢字も存在します。</article-p
              >
              <article-p
                >例えば、塩素の「<span class="u-tw">氯</span
                >」です。きがまえに「<span class="u-tw">彔</span
                >」ですが、この「<span class="u-tw">彔</span>」は「<span
                  class="u-tw"
                  >綠</span
                >（＝緑）」から来ています。中国では塩素のことを緑色の気体という意味で「<span
                  class="u-tw"
                  >綠氣</span
                >」と呼んでいたようです。</article-p
              >
              <article-p
                >このような、<span class="u-marker-bold"
                  >既存の呼び名から新たに作られた漢字</span
                >は、比較的原子番号の小さい元素に多く見られます。日本語において水素や酸素が欧米の発音のカタカナ転写ではないのと同じようなものです。</article-p
              >
              <article-p
                >そのほか、「<span class="u-tw">鐵</span>」や「<span
                  class="u-tw"
                  >鉛</span
                >」、「<span class="u-tw">硫</span
                >」などは、伝統的に使われてきた漢字を<span class="u-marker-bold"
                  >化学元素を表すものとして転用した漢字</span
                >です。日本人でもそのまま読んでわかるのが特徴です。</article-p
              >
            </article-subsection>
            <article-subsection headline="漢字の部首">
              <article-p
                >元素の漢字の最たる特徴といえば、ずばり「<span
                  class="u-marker-bold"
                  >部首</span
                >」です。</article-p
              >
              <article-p
                >漢字の命名規則として、常温での<span class="u-bold">三態</span
                >（気体・液体・固体）と、<span class="u-bold">金属・非金属</span
                >によって以下の4つの部首いずれかに属すことが定められています。</article-p
              >
              <div class="article-section__insert">
                <figure class="article-section__figure">
                  <table class="article-section__table">
                    <thead>
                      <tr>
                        <th>部首</th>
                        <th>性質</th>
                        <th>例</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>气部</td>
                        <td>気体</td>
                        <td>
                          <span class="u-tw">氫</span>、<span class="u-tw"
                            >氧</span
                          >、<span class="u-tw">氯</span>、<span class="u-tw"
                            >氬</span
                          >など
                        </td>
                      </tr>
                      <tr>
                        <td>水部</td>
                        <td>液体</td>
                        <td>
                          <span class="u-tw">溴</span>、<span class="u-tw"
                            >汞</span
                          >のみ
                        </td>
                      </tr>
                      <tr>
                        <td>石部</td>
                        <td>固体非金属</td>
                        <td>
                          <span class="u-tw">硼</span>、<span class="u-tw"
                            >碳</span
                          >、<span class="u-tw">硫</span>、<span class="u-tw"
                            >砷</span
                          >など
                        </td>
                      </tr>
                      <tr>
                        <td>金部</td>
                        <td>固体金属</td>
                        <td>
                          <span class="u-tw">鐵</span>、<span class="u-tw"
                            >鉛</span
                          >、<span class="u-tw">鋰</span>、<span class="u-tw"
                            >鉨</span
                          >など
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <figcaption class="article-section__caption">
                    元素の漢字の部首
                  </figcaption>
                </figure>
              </div>
              <article-p
                >漢字を見ただけでその元素の性質がわかるのです。すごい！</article-p
              >
              <article-p
                >このような部首の決まりがあるので、例えば炭素の「<span
                  class="u-tw"
                  >碳</span
                >」は、普通なら<span class="u-tw">鐵</span
                >などと同様に伝統的に使われてきた「<span class="u-tw">炭</span
                >」がそのまま転用されるところを、規則に従っていしへんを付して新しく漢字を作っています。</article-p
              >
              <article-p
                >ただし例外も存在します。もっとも、原子番号の大きい人工元素は放射性崩壊によって性質を確かめられる量を十分に用意することができないため、テネシンの「<span
                  class="u-tw"
                  >鿬</span
                >」やオガネソンの「<span class="u-tw">鿫</span
                >」はそれぞれ石部、气部に属しますが、実際にそれらが非金属固体、気体であることが観察されたというわけではありません。</article-p
              >
            </article-subsection>
            <article-subsection headline="漢字の地域差">
              <article-p
                >中国大陸、台湾、香港では、簡体字・繁体字の差はあるものの基本的に同じ漢字を使っていますが、一部は、繁簡の差を除いても<span
                  class="u-marker-bold"
                  >地域によって異なる漢字</span
                >を使っている元素が存在します。ほとんどの場合、この差は<span
                  class="u-bold"
                  >中国大陸と台湾</span
                >の間に生じます。</article-p
              >
              <article-p
                >それらを見比べてみるとこんな感じになります。</article-p
              >
              <div class="article-section__insert">
                <figure class="article-section__figure">
                  <table class="article-section__table">
                    <thead>
                      <tr>
                        <th>元素名</th>
                        <th>大陸</th>
                        <th>台湾</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ケイ素</td>
                        <td><span class="u-cn">硅</span></td>
                        <td><span class="u-tw">矽</span></td>
                      </tr>
                      <tr>
                        <td>テクネチウム</td>
                        <td><span class="u-cn">锝</span></td>
                        <td><span class="u-tw">鎝</span></td>
                      </tr>
                      <tr>
                        <td>ルテチウム</td>
                        <td><span class="u-cn">镥</span></td>
                        <td><span class="u-tw">鎦</span></td>
                      </tr>
                      <tr>
                        <td>アスタチン</td>
                        <td><span class="u-cn">砹</span></td>
                        <td><span class="u-tw">砈</span></td>
                      </tr>
                      <tr>
                        <td>フランシウム</td>
                        <td><span class="u-cn">钫</span></td>
                        <td><span class="u-tw">鍅</span></td>
                      </tr>
                      <tr>
                        <td>ネプツニウム</td>
                        <td><span class="u-cn">镎</span></td>
                        <td><span class="u-tw">錼</span></td>
                      </tr>
                      <tr>
                        <td>プルトニウム</td>
                        <td><span class="u-cn">钚</span></td>
                        <td><span class="u-tw">鈽</span></td>
                      </tr>
                      <tr>
                        <td>アメリシウム</td>
                        <td><span class="u-cn">镅</span></td>
                        <td><span class="u-tw">鋂</span></td>
                      </tr>
                      <tr>
                        <td>バークリウム</td>
                        <td><span class="u-cn">锫</span></td>
                        <td><span class="u-tw">鉳</span></td>
                      </tr>
                      <tr>
                        <td>カリホルニウム</td>
                        <td><span class="u-cn">锎</span></td>
                        <td><span class="u-tw">鉲</span></td>
                      </tr>
                      <tr>
                        <td>アインスタイニウム</td>
                        <td><span class="u-cn">锿</span></td>
                        <td><span class="u-tw">鑀</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <figcaption class="article-section__caption">
                    中国大陸と台湾の元素の漢字の差異
                  </figcaption>
                </figure>
              </div>
              <article-p
                >これは、中国大陸と台湾で<span class="u-bold"
                  >元素を命名する機関が違う</span
                >ため生じています。しかし、この差異は大陸と台湾の交流が活発ではなかった時期の名残であり、現在は同じ漢字を決定するようになっています。</article-p
              >
              <article-p
                >一方、香港は台湾と同じ繁体字圏ですが、基本的には大陸の繁体字を使用しているようです。</article-p
              >
            </article-subsection>
          </article-section>

          <article-section headline="参考サイト">
            <article-subsection :is-no-headline="true">
              <article-p
                >以下、参考にしたサイトの一部です。間違いや、より良い文献等がありましたらツイッターのbotアカウント（<a
                  class="article-section__link-text"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://twitter.com/gensokanji_bot"
                  >@gensokanji_bot</a
                >）まで連絡していただけると助かりますm(_ _)m</article-p
              >
              <article-p
                ><a
                  hreflang="zh-cmn-Hans"
                  lang="zh-cmn-Hans"
                  class="article-section__link-text u-zhcn"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://baike.baidu.com/item/%E5%85%83%E7%B4%A0%E5%91%A8%E6%9C%9F%E8%A1%A8/282048"
                  >元素周期表（化学元素周期列表）_百度百科</a
                ><i class="u-pl5 fas fa-external-link-alt"></i
                ><br />大陸簡体の漢字と発音の参考にしました。</article-p
              >
              <article-p
                ><a
                  hreflang="zh-cmn-Hant"
                  lang="zh-cmn-Hant"
                  class="article-section__link-text u-zhtw"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="http://terms.naer.edu.tw/download/159/"
                  >國家教育研究院雙語詞彙、學術名詞暨辭書資訊網 - 下載專區
                  化學名詞-化學元素一覽表</a
                ><i class="u-pl5 fas fa-external-link-alt"></i
                ><br />台湾正体の漢字と発音の参考にしました。</article-p
              >
              <article-p
                ><a
                  hreflang="zh-cmn-Hans"
                  lang="zh-cmn-Hans"
                  class="article-section__link-text u-zhcn"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://zh.wikipedia.org/wiki/%E5%85%83%E7%B4%A0%E5%88%97%E8%A1%A8"
                  >元素列表 - 维基百科，自由的百科全书</a
                ><i class="u-pl5 fas fa-external-link-alt"></i
                ><br />香港繁体の漢字の参考にしました。</article-p
              >
              <article-p
                ><a
                  hreflang="zh-cmn-Hans"
                  lang="zh-cmn-Hans"
                  class="article-section__link-text u-zhcn"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="http://www.cnctst.cn/xwdt/mtgz/201705/t20170510_372222.html"
                  >国际在线：中国科学院公布四种新增元素中文名称----全国科学技术名词审定委员会</a
                ><i class="u-pl5 fas fa-external-link-alt"></i
                ><br />2016年に名称が決定した新元素4つの漢字の決定に関する記事です。</article-p
              >
            </article-subsection>
          </article-section>
        </article>
      </main>

      <footer v-cloak class="footer">
        <div class="footer__container">
          <div class="footer__content">
            <a
              href="https://twitter.com/gensokanji_bot?ref_src=twsrc%5Etfw"
              class="footer__twitter-follow-button twitter-follow-button"
              data-lang="en"
              data-size="large"
              data-show-count="true"
              >Follow @gensokanji_bot</a
            >
          </div>
          <div class="footer__content">元素の漢字周期表 v3.1.4</div>
          <div class="footer__content">© 2019-2022 gensokanji</div>
        </div>
      </footer>

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
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

import { categoryList } from '@/assets/js/category_list.js'
import { controlList } from '@/assets/js/control_list.js'
import { elementList } from '@/assets/js/element_list.js'
import { langList } from '@/assets/js/lang_list.js'
import { navLinkSectionList } from '@/assets/js/nav_link_list.js'
import { otherCellList } from '@/assets/js/other_cell_list.js'
import { themeColorList } from '@/assets/js/theme_color_list.js'
import { popupBalloons } from '@/assets/js/popup_balloon_contents.js'

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
      langList,
      otherCellList,
      elementList,
      categoryList,
      navLinkSectionList,
      themeColorList,
      controlList,
      popupBalloons,
      /** 現在の表示言語とセル */
      current: {
        langIndex: 3,
        elementIndex: 0,
        controlIndex: 0,
      },
      /** オーバーレイ表示しているか否か */
      isOverlayDisplayed: false,
      /** bodyScrollLockが有効か否か */
      isBodyScrollLocked: false,
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
      /** 周期表の大きさの倍率 */
      rangeValue: 1,
      /** 画面幅がスマートフォン幅か否か */
      isPhone: false,
      /** シェアボタンが展開されているか否か */
      isShareButtonExpanded: false,
      /** 元素の検索結果のリスト */
      elementSearchResultList: [],
      /** 元素の検索結果のリストが表示されているか否か */
      displayElementSearchResultList: false,
      /** 元素の検索対象の種類 */
      elementSearchType: 'all',
    }
  },
  head: {
    bodyAttrs: { class: 'body-preload' },
  },
  computed: {
    /**
     * リスト中の現在選択されている言語のデータ
     * current.langIndexに依存
     * @returns {object} リスト中の言語のオブジェクト
     */
    currentLang() {
      return this.langList[this.current.langIndex]
    },
    /**
     * リスト中の現在選択されている元素のデータ
     * current.elementIndexに依存
     * @returns {object} リスト中の元素のオブジェクト
     */
    currentElement() {
      return this.elementList[this.current.elementIndex]
    },
    /**
     * リスト中の現在選択されている操作のデータ
     * current.controlIndexに依存
     * @returns {object} リスト中の操作のオブジェクト
     */
    currentControl() {
      return this.controlList[this.current.controlIndex]
    },
    /**
     * 現在のデータページのページ遷移ボタンの表示内容
     * current.elementIndexに依存
     * @returns {object} 表示内容の情報を含んだオブジェクト
     */
    elementChangeButton() {
      const z = this.currentElement.atomicNumber
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
        obj.next.atomicNumber = this.elementList[nextIndex].atomicNumber
        obj.next.elementSymbol = this.elementList[nextIndex].elementSymbol
        obj.isStart = true
        obj.isEnd = false
      } else if (z + 1 > 118) {
        const prevIndex = this.atomicNumberToIndex(z - 1)
        obj.prev.atomicNumber = this.elementList[prevIndex].atomicNumber
        obj.prev.elementSymbol = this.elementList[prevIndex].elementSymbol
        obj.next.atomicNumber = 119
        obj.next.elementSymbol = 'Uue'
        obj.isStart = false
        obj.isEnd = true
      } else {
        const nextIndex = this.atomicNumberToIndex(z + 1)
        const prevIndex = this.atomicNumberToIndex(z - 1)
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
    rangeValue() {
      this.createMediaQuery()
      this.checkPeriodicTableOverflow()
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'))
      itemObj.rangeValue = this.rangeValue
      localStorage.setItem('itemStorage', JSON.stringify(itemObj))
    },
    /**
     * 元素の検索対象の変更を監視し、inputイベントを発生させる
     */
    elementSearchType() {
      const e = new Event('input')
      this.$refs.elementSearchInput.dispatchEvent(e)
    },
  },
  mounted() {
    // 周期表の幅と高さの初期値をセット
    this.periodicTableRect = this.$refs.periodicTable.getBoundingClientRect()
    // スクロールのイベントリスナを追加
    window.addEventListener('scroll', this.handleScroll)
    // localStorageの初期化と読み出し
    let itemObj = JSON.parse(localStorage.getItem('itemStorage'))
    if (!(itemObj && itemObj.themeColorName && itemObj.rangeValue)) {
      itemObj = {
        themeColorName: 'default',
        rangeValue: 1,
      }
      localStorage.setItem('itemStorage', JSON.stringify(itemObj))
    }
    this.changeThemeColor(itemObj.themeColorName)
    this.rangeValue = itemObj.rangeValue
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
    /**
     * 周期表の表示言語を変更する
     * @param {number} nextLangIndex - 選択された言語のlangListでのインデクス
     */
    setCurrentLang(nextLangIndex) {
      this.currentLang.isActive = false
      this.current.langIndex = nextLangIndex
      this.currentLang.isActive = true
    },
    /**
     * 元素のデータページをオーバーレイ表示する
     * @param {number} nextElementIndex - 選択された元素のelementListでのインデクス
     */
    openOverlay(nextElementIndex) {
      this.current.elementIndex = nextElementIndex
      this.currentElement.isActive = true
      this.isOverlayDisplayed = true
      this.runTwitterScript()
    },
    /**
     * 元素のデータページを閉じる
     */
    closeOverlay() {
      this.popupBalloons.overlayMain.isActive = false
      this.isOverlayDisplayed = false
      this.currentElement.isActive = false
    },
    /**
     * データページを遷移する
     * @param {string} to - 'next'か'prev'
     */
    changeOverlay(to) {
      let z = this.currentElement.atomicNumber
      if (to === 'next') {
        z++
      } else if (to === 'prev') {
        z--
      }
      if (z >= 1 && z <= 118) {
        const toIndex = this.atomicNumberToIndex(z)
        this.currentElement.isActive = false
        this.openOverlay(toIndex)
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
      this.isBodyScrollLocked = true
    },
    /**
     * オーバーレイを閉じる前、bodyのスクロールを有効にする
     * @param {object} el - オーバーレイの要素
     */
    beforeLeaveFade(el) {
      clearAllBodyScrollLocks()
      this.isBodyScrollLocked = false
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
     * 原子番号からelementListのインデクスを返す
     * 見つからなかった場合は-1を返す
     * @param {number} atomicNumber - 原子番号
     * @returns {number} elementListのインデクスか-1
     */
    atomicNumberToIndex(atomicNumber) {
      return this.elementList.findIndex(
        (element) => element.atomicNumber === atomicNumber
      )
    },
    /**
     * ナビゲーションメニューを展開、格納する
     */
    toggleNavOpen() {
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
     * テーマカラーを変更する
     * @param {string} themeColorName - テーマカラーの名前
     */
    changeThemeColor(themeColorName) {
      let themeColor = this.themeColorList.find(
        (themeColor) => themeColor.name === themeColorName
      )
      if (typeof themeColor === 'undefined') {
        themeColor = this.themeColorList[0]
      }
      const mainGrad =
        'linear-gradient(0.375turn, ' +
        themeColor.main1 +
        'e6, ' +
        themeColor.main2 +
        'e6, ' +
        themeColor.main3 +
        'e6)'
      const rootElement = document.documentElement
      rootElement.style.setProperty('--theme-color-main-1', themeColor.main1)
      rootElement.style.setProperty('--theme-color-main-2', themeColor.main2)
      rootElement.style.setProperty(
        '--theme-color-main-2-light',
        themeColor.main2Light
      )
      rootElement.style.setProperty(
        '--theme-color-main-2-dark',
        themeColor.main2Dark
      )
      rootElement.style.setProperty('--theme-color-main-3', themeColor.main3)
      rootElement.style.setProperty('--theme-color-main-grad', mainGrad)
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'))
      itemObj.themeColorName = themeColorName
      localStorage.setItem('itemStorage', JSON.stringify(itemObj))
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
        `(min-width: ${this.periodicTableRect.width * this.rangeValue}px)`
      )
      const handler = this.checkPeriodicTableOverflow
      try {
        this.periodicTableMQL.addEventListener('change', handler)
      } catch (e) {
        this.periodicTableMQL.addListener(handler) // for Safari 14 and earlier
      }
    },
    /**
     * 操作パネルの操作の内容を変更する
     * @param {number} nextControlIndex - 選択された操作のcontrolListでのインデクス
     */
    setCurrentControl(nextControlIndex) {
      this.currentControl.isActive = false
      this.current.controlIndex = nextControlIndex
      this.currentControl.isActive = true
    },
    /**
     * 周期表の大きさの倍率を1にする
     */
    defaultRange() {
      this.rangeValue = 1
    },
    /**
     * シェアボタンを展開、格納する
     */
    toggleShareExpandButton() {
      this.isShareButtonExpanded = !this.isShareButtonExpanded
    },
    /**
     * 吹き出しポップアップを表示、非表示する
     * @param {string} name - 対象の吹き出しの名前のキー
     */
    togglePopupBalloon(name) {
      this.popupBalloons[name].isActive = !this.popupBalloons[name].isActive
    },
    /**
     * 検索対象をもとに元素を検索し結果をリストに格納する
     * @param {object} e - InputEvent
     */
    seachElements(e) {
      this.elementSearchResultList = []
      const value = e.target.value.toLowerCase()

      if (value) {
        this.displayElementSearchResultList = true

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

<style lang="scss"></style>
