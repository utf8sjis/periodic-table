import {categoryList} from './data/category_list.js';
import {controlPanelTitleList} from './data/control_panel_title_list.js';
import {elementList} from './data/element_list.js';
import {langList} from './data/lang_list.js';
import {navLinkSectionList} from './data/nav_link_list.js';
import {otherCellList} from './data/other_cell_list.js';
import {themeColorList} from './data/theme_color_list.js';


window.onload = () => {
  const body = document.querySelector('body');
  body.classList.remove('body-preload');
};

Vue.config.ignoredElements = ['ion-icon'];

Vue.component('data-area', {
  props: {
    type: String,
    label: String,
    categoryClass: String,
  },
  template: String.raw`
    <div class="data-area" :class="categoryClass">
      <div class="data-area__item-common-container">
        <div class="data-area__label" v-html="label"></div>
        <div class="data-area__content" :class="'data-area__content--' + type">
          <slot></slot>
        </div>
      </div>
      <slot name="absolute"></slot>
    </div>`,
});

Vue.component('article-section', {
  props: {
    headline: String,
    isLevelOne: Boolean,
  },
  template: String.raw`
    <section class="article-section">
      <h1 v-if="isLevelOne" class="article-section__headline">{{ headline }}</h1>
      <h2 v-else class="article-section__headline">{{ headline }}</h2>
      <div class="article-section__contents">
        <slot></slot>
      </div>
    </section>`,
});

Vue.component('article-subsection', {
  props: {
    isNoHeadline: Boolean,
    headline: String,
  },
  template: String.raw`
    <section class="article-section__subsection">
      <h3 v-if="!isNoHeadline" class="article-section__headline-2">{{ headline }}</h3>
      <slot></slot>
    </section>`,
});

Vue.component('article-p', {
  template: String.raw`
    <p class="article-section__paragraph">
      <slot></slot>
    </p>`,
});

new Vue({
  el: '#app',
  data: {
    langList: langList,
    otherCellList: otherCellList,
    elementList: elementList,
    categoryList: categoryList,
    navLinkSectionList: navLinkSectionList,
    themeColorList: themeColorList,
    controlPanelTitleList: controlPanelTitleList,
    /** 現在の表示言語とセル */
    current: {
      langIndex: 3,
      elementIndex: 0,
    },
    /** オーバーレイ表示しているか否か */
    isOverlayDisplayed: false,
    /** bodyScrollLockが有効か否か */
    isBodyScrollLocked: false,
    /** ナビゲーションメニューが開いているか否か */
    isNavOpened: false,
    /** スクロール量がページのトップあたりか否か */
    isAroundTop: true,
    /** ポップアップのメッセージ、表示されているか否か、タイムアウトID */
    popup: {
      message: '',
      isDisplayed: false,
      timeoutID: 0,
    },
    /** 操作パネルの高さ、内容のインデクス、内容が最初（最後）のものか否か */
    controlPanel: {
      height: 0,
      index: 0,
      isStart: true,
      isEnd: false,
    },
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
  },
  methods: {
    /**
     * 周期表の表示言語を変更する
     * @param {number} nextLangIndex - 選択された言語のlangListでのインデクス
     */
    setCurrentLang: function (nextLangIndex) {
      this.currentLang.isActive = false;
      this.current.langIndex = nextLangIndex;
      this.currentLang.isActive = true;
    },
    /**
     * 元素のデータページをオーバーレイ表示する
     * @param {number} nextElementIndex - 選択された元素のelementListでのインデクス
     */
    openOverlay: function (nextElementIndex) {
      this.current.elementIndex = nextElementIndex
      this.currentElement.isActive = true;
      this.isOverlayDisplayed = true;
      this.runTwitterScript();
    },
    /**
     * 元素のデータページを閉じる
     */
    closeOverlay: function () {
      this.isOverlayDisplayed = false;
      this.currentElement.isActive = false;
    },
    /**
     * データページを遷移する
     * @param {string} to - 'next'か'prev'
     */
    changeOverlay: function (to) {
      let z = this.currentElement.atomicNumber;
      if (to === 'next') {
        z++;
      } else if (to === 'prev') {
        z--;
      }
      if (z >= 1 && z <= 118) {
        const toIndex = this.atomicNumberToIndex(z);
        this.currentElement.isActive = false;
        this.openOverlay(toIndex);
      }
    },
    /**
     * オーバーレイ表示時、データページのスクロール量を0にする
     * @param {object} el - オーバーレイの要素
     */
    enterFade: function (el) {
      el.querySelector('.overlay__main-wrapper').scrollTop = 0;
    },
    /**
     * オーバーレイ表示前、bodyのスクロールを無効にする
     * @param {object} el - オーバーレイの要素
     */
    beforeEnterFade: function (el) {
      const targetEl = el.querySelector('.overlay__main-wrapper');
      bodyScrollLock.disableBodyScroll(targetEl, {
        reserveScrollBarGap: true,
      });
      this.isBodyScrollLocked = true;
    },
    /**
     * オーバーレイを閉じる前、bodyのスクロールを有効にする
     * @param {object} el - オーバーレイの要素
     */
    beforeLeaveFade: function (el) {
      bodyScrollLock.clearAllBodyScrollLocks();
      this.isBodyScrollLocked = false;
    },
    /**
     * Twitterのスクリプトタグを明示的に設置し実行する
     */
    runTwitterScript: function () {
      const scriptEl = document.createElement('script');
      scriptEl.async = true;
      scriptEl.src = 'https://platform.twitter.com/widgets.js';
      this.$refs.contAreaTweet.appendChild(scriptEl);
    },
    /**
     * 原子番号からelementListのインデクスを返す
     * 見つからなかった場合は-1を返す
     * @param {number} atomicNumber - 原子番号
     * @returns {number} elementListのインデクスか-1
     */
    atomicNumberToIndex: function (atomicNumber) {
      return this.elementList.findIndex(
        (element) => element.atomicNumber === atomicNumber
      );
    },
    /**
     * ナビゲーションメニューを展開、格納する
     */
    toggleNavOpen: function () {
      this.isNavOpened = !this.isNavOpened;
    },
    /**
     * ナビゲーションメニューを格納する
     */
    closeNav: function () {
      this.isNavOpened = false;
    },
    /**
     * スクロール量がページのトップあたりかを示すハンドラ
     */
    handleScroll: function () {
      if (window.scrollY > 200) {
        this.isAroundTop = false;
      } else {
        this.isAroundTop = true;
        this.isShareButtonExpanded = false;
      }
    },
    /**
     * ページトップまでスクロールする
     */
    goToTop: function () {
      jQuery(function () {
        $('body, html').animate({scrollTop: 0}, 500);
      });
    },
    /**
     * 漢字をクリップボードにコピーする
     * @param {string} text - 選択された元素の漢字
     */
    copyToClipboard: function (text) {
      const successMessage = '漢字をコピーしました';
      const failureMessage = '漢字のコピーに失敗しました';
      if (!navigator.clipboard) {
        this.activePopup(failureMessage);
      } else {
        navigator.clipboard.writeText(text).then(
          () => this.activePopup(successMessage),
          () => this.activePopup(failureMessage)
        );
      }
    },
    /**
     * テーマカラーを変更する
     * @param {string} themeColorName - テーマカラーの名前
     */
    changeThemeColor: function (themeColorName) {
      let themeColor = this.themeColorList.find(
        (themeColor) => themeColor.name === themeColorName
      );
      if (typeof themeColor === 'undefined') {
        themeColor = this.themeColorList[0]
      }
      const mainGrad =
        'linear-gradient(0.375turn, ' +
        themeColor.main1 + 'e6, ' +
        themeColor.main2 + 'e6, ' +
        themeColor.main3 + 'e6)';
      const rootElement = document.documentElement;
      rootElement.style.setProperty('--theme-color-main-1', themeColor.main1);
      rootElement.style.setProperty('--theme-color-main-2', themeColor.main2);
      rootElement.style.setProperty('--theme-color-main-2-dark', themeColor.main2dark);
      rootElement.style.setProperty('--theme-color-main-3', themeColor.main3);
      rootElement.style.setProperty('--theme-color-main-grad', mainGrad);
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'));
      itemObj.themeColorName = themeColorName;
      localStorage.setItem('itemStorage', JSON.stringify(itemObj));
    },
    /**
     * ポップアップを表示する
     * @param {string} message - ポップアップに表示するメッセージ
     */
    activePopup: function (message) {
      if (this.popup.timeoutID != null) {
        clearTimeout(this.popup.timeoutID);
      }
      this.popup.message = message;
      this.popup.isDisplayed = true;
      this.popup.timeoutID = setTimeout(
        () => (this.popup.isDisplayed = false),
        3000
      );
    },
    /**
     * ポップアップを閉じる
     */
    clearPopup: function () {
      if (this.popup.timeoutID != null) {
        clearTimeout(this.popup.timeoutID);
      }
      this.popup.isDisplayed = false;
    },
    /**
     * 画面幅が周期表の幅を超過しているかを示すハンドラ
     */
    checkPeriodicTableOverflow: function () {
      this.isPeriodicTableOverflow = !this.periodicTableMQL.matches;
    },
    /**
     * 周期表の幅に対するメディアクエリを作成する
     */
    createMediaQuery: function () {
      this.periodicTableMQL = window.matchMedia(
        `(min-width: ${this.periodicTableRect.width * this.rangeValue}px)`
      );
      const handler = this.checkPeriodicTableOverflow;
      try {
        this.periodicTableMQL.addEventListener('change', handler);
      } catch (e) {
        this.periodicTableMQL.addListener(handler); // for Safari 14 and earlier
      }
    },
    /**
     * 操作パネルの操作の内容を変更する
     * @param {string} to - 'next'か'prev'
     */
    changeContents: function (to) {
      if (to === 'next' && !this.controlPanel.isEnd) {
        this.controlPanel.index++;
      } else if (to === 'prev' && !this.controlPanel.isStart) {
        this.controlPanel.index--;
      }
      if (this.controlPanel.index === 0) {
        this.controlPanel.isStart = true;
      } else {
        this.controlPanel.isStart = false;
      }
      if (this.controlPanel.index === this.controlPanelTitleList.length - 1) {
        this.controlPanel.isEnd = true;
      } else {
        this.controlPanel.isEnd = false;
      }
    },
    /**
     * 周期表の大きさの倍率を1にする
     */
    defaultRange: function () {
      this.rangeValue = 1;
    },
    /**
     * シェアボタンを展開、格納する
     */
    toggleShareExpandButton: function () {
      this.isShareButtonExpanded = !this.isShareButtonExpanded;
    },
  },
  computed: {
    /**
     * リスト中の現在選択されている言語のデータ
     * current.langIndexに依存
     * @returns {object} リスト中の言語のオブジェクト
     */
    currentLang: function () {
      return this.langList[this.current.langIndex]
    },
    /**
     * リスト中の現在選択されている元素のデータ
     * current.elementIndexに依存
     * @returns {object} リスト中の元素のオブジェクト
     */
    currentElement: function () {
      return this.elementList[this.current.elementIndex]
    },
    /**
     * 現在のデータページのページ遷移ボタンの表示内容
     * current.elementIndexに依存
     * @returns {object} 表示内容の情報を含んだオブジェクト
     */
    elementChangeButton: function () {
      const z = this.currentElement.atomicNumber;
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
      };
      if (z - 1 < 1) {
        const nextIndex = this.atomicNumberToIndex(z + 1);
        obj.prev.atomicNumber = 0;
        obj.prev.elementSymbol = 'n';
        obj.next.atomicNumber = this.elementList[nextIndex].atomicNumber;
        obj.next.elementSymbol = this.elementList[nextIndex].elementSymbol;
        obj.isStart = true;
        obj.isEnd = false;
      } else if (z + 1 > 118) {
        const prevIndex = this.atomicNumberToIndex(z - 1);
        obj.prev.atomicNumber = this.elementList[prevIndex].atomicNumber;
        obj.prev.elementSymbol = this.elementList[prevIndex].elementSymbol;
        obj.next.atomicNumber = 119;
        obj.next.elementSymbol = 'Uue';
        obj.isStart = false;
        obj.isEnd = true;
      } else {
        const nextIndex = this.atomicNumberToIndex(z + 1);
        const prevIndex = this.atomicNumberToIndex(z - 1);
        obj.prev.atomicNumber = this.elementList[prevIndex].atomicNumber;
        obj.prev.elementSymbol = this.elementList[prevIndex].elementSymbol;
        obj.next.atomicNumber = this.elementList[nextIndex].atomicNumber;
        obj.next.elementSymbol = this.elementList[nextIndex].elementSymbol;
        obj.isStart = obj.isEnd = false;
      }
      return obj;
    },
  },
  watch: {
    /**
     * 周期表の大きさの倍率を監視する
     */
    rangeValue: function () {
      this.createMediaQuery();
      this.checkPeriodicTableOverflow();
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'));
      itemObj.rangeValue = this.rangeValue;
      localStorage.setItem('itemStorage', JSON.stringify(itemObj));
    },
  },
  mounted: function () {
    // 周期表の幅と高さの初期値をセット
    this.periodicTableRect = this.$refs.periodicTable.getBoundingClientRect();
    // 操作パネルの高さの初期値をセット
    const compStyles = window.getComputedStyle(this.$refs.controlPanel);
    this.controlPanel.height = parseInt(compStyles.getPropertyValue('height'));
    // スクロールのイベントリスナを追加
    window.addEventListener('scroll', this.handleScroll);
    // localStorageの初期化と読み出し
    let itemObj = JSON.parse(localStorage.getItem('itemStorage'));
    if (!(itemObj && itemObj.themeColorName && itemObj.rangeValue)) {
      itemObj = {
        themeColorName: 'default',
        rangeValue: 1,
      };
      localStorage.setItem('itemStorage', JSON.stringify(itemObj));
    }
    this.changeThemeColor(itemObj.themeColorName);
    this.rangeValue = itemObj.rangeValue;
    // 周期表の幅に対するメディアクエリを作成
    this.createMediaQuery();
    this.checkPeriodicTableOverflow();
    // スマートフォン幅に対するメディアクエリを作成 -> _variable.scss
    const phoneMQL = window.matchMedia('(max-width: 550px)');
    const checkIsPhone = () => (this.isPhone = phoneMQL.matches);
    try {
      phoneMQL.addEventListener('change', checkIsPhone);
    } catch (e) {
      phoneMQL.addListener(checkIsPhone); // for Safari 14 and earlier
    }
    checkIsPhone();
  },
});
