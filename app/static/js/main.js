Vue.config.ignoredElements = ['ion-icon'];

Vue.component('data-area', {
  props: ['name', 'label', 'categoryClass'],
  template: `
    <div :class="['data-area', 'mod_' + name, categoryClass]">
      <div class="data-area__label">
        <div v-html="label"></div>
      </div>
      <div :class="['data-area__content', 'mod_' + name]">
        <slot></slot>
      </div>
    </div>`,
});

Vue.component('common-section', {
  props: ['title'],
  template: `
    <section class="section">
      <h1 class="section__title">{{ title }}</h1>
      <div class="section__contents">
        <slot></slot>
      </div>
    </section>`,
});

new Vue({
  el: '#app',
  data: {
    langList: langList,
    cellList: cellList,
    elementList: elementList,
    categoryList: categoryList,
    groupClassList: groupClassList,
    periodClassList: periodClassList,
    navLinkSectionList: navLinkSectionList,
    themeColorList: themeColorList,
    controlPanelTitleList: controlPanelTitleList,
    /** 現在の表示言語とセル */
    current: {
      langIndex: 3,
      cellIndex: 0,
      cell: cellList[0],
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
    isMainContentsOverflow: null,
    /** 周期表の大きさの倍率 */
    rangeValue: 1,
  },
  methods: {
    /**
     * 周期表の表示言語を変更する
     * @param {number} langIndex - 選択された言語のlangListでのインデクス
     */
    setCurrentLang: function (langIndex) {
      this.langList[this.current.langIndex].isActive = false;
      this.current.langIndex = langIndex;
      this.langList[langIndex].isActive = true;
    },
    /**
     * 元素のデータページをオーバーレイ表示する
     * @param {number} cellIndex - 選択された元素のcellListでのインデクス
     */
    openOverlay: function (cellIndex) {
      this.current.cell = this.cellList[cellIndex];
      this.current.cellIndex = cellIndex;
      this.isOverlayDisplayed = true;
      this.cellList[cellIndex].isActive = true;
      this.runTwitterScript();
    },
    /**
     * 元素のデータページを閉じる
     */
    closeOverlay: function () {
      this.isOverlayDisplayed = false;
      this.cellList[this.current.cellIndex].isActive = false;
    },
    /**
     * データページを遷移する
     * @param {string} to - 'next'か'prev'
     */
    changeOverlay: function (to) {
      let z = this.current.cell.atomicNum;
      if (to === 'next') {
        z++;
      } else if (to === 'prev') {
        z--;
      }
      if (z >= 1 && z <= 118) {
        const toIndex = this.atomicNumToIndex(z);
        this.cellList[this.current.cellIndex].isActive = false;
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
     * 原子番号からcellListのインデクスを返す
     * 見つからなかった場合は-1を返す
     * @param {number} atomicNum - 原子番号
     * @returns {number} cellListのインデクスか-1
     */
    atomicNumToIndex: function (atomicNum) {
      return this.cellList.findIndex(
        (element) => element.atomicNum === atomicNum
      );
    },
    /**
     * ナビゲーションメニューを開く
     */
    navOpen: function () {
      this.isNavOpened = !this.isNavOpened;
    },
    /**
     * スクロール量がページのトップあたりかを示すハンドラ
     */
    handleScroll: function () {
      if (window.scrollY > 200) {
        this.isAroundTop = false;
      } else {
        this.isAroundTop = true;
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
     * @param {string} text - currentCellの元素の漢字
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
      const themeColor = this.themeColorList[themeColorName];
      const mainA =
        'linear-gradient(0.375turn, ' +
        themeColor.main1 +
        'e6, ' +
        themeColor.main2 +
        'e6, ' +
        themeColor.main3 +
        'e6)';
      const rootElement = document.documentElement;
      rootElement.style.setProperty('--theme-color-main-1', themeColor.main1);
      rootElement.style.setProperty('--theme-color-main-2', themeColor.main2);
      rootElement.style.setProperty('--theme-color-main-2b', themeColor.main2B);
      rootElement.style.setProperty('--theme-color-main-3', themeColor.main3);
      rootElement.style.setProperty('--theme-color-main-a', mainA);
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
    checkMainContentsOverflow: function () {
      this.isMainContentsOverflow = !this.periodicTableMQL.matches;
    },
    /**
     * 周期表の幅に対するメディアクエリを作成する
     */
    createMediaQuery: function () {
      if (this.periodicTableMQL) {
        this.periodicTableMQL.removeEventListener('change', this.checkMainContentsOverflow);
      }
      this.periodicTableMQL = window.matchMedia(
        '(min-width: ' + (this.periodicTableRect.width * this.rangeValue) + 'px)');
      this.periodicTableMQL.addEventListener('change', this.checkMainContentsOverflow);
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
  },
  computed: {
    /**
     * データページを遷移するボタンの表示を作成する
     * @returns {object} 表示内容の情報を含んだのオブジェクト
     */
    elementChangeButton: function () {
      const z = this.current.cell.atomicNum;
      const obj = {
        prev: {
          atomicNum: 0,
          elementSymbol: '',
        },
        next: {
          atomicNum: 0,
          elementSymbol: '',
        },
        isStart: true,
        isEnd: false,
      };
      if (z - 1 < 1) {
        obj.prev.atomicNum = 0;
        obj.prev.elementSymbol = 'n';
        obj.next.atomicNum = this.elementList[z + 1].atomicNumber;
        obj.next.elementSymbol = this.elementList[z + 1].elementSymbol;
        obj.isStart = true;
        obj.isEnd = false;
      } else if (z + 1 > 118) {
        obj.prev.atomicNum = this.elementList[z - 1].atomicNumber;
        obj.prev.elementSymbol = this.elementList[z - 1].elementSymbol;
        obj.next.atomicNum = 119;
        obj.next.elementSymbol = 'Uue';
        obj.isStart = false;
        obj.isEnd = true;
      } else {
        obj.prev.atomicNum = this.elementList[z - 1].atomicNumber;
        obj.prev.elementSymbol = this.elementList[z - 1].elementSymbol;
        obj.next.atomicNum = this.elementList[z + 1].atomicNumber;
        obj.next.elementSymbol = this.elementList[z + 1].elementSymbol;
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
      this.checkMainContentsOverflow();
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
        themeColorName: 'wakaba',
        rangeValue: 1,
      };
      localStorage.setItem('itemStorage', JSON.stringify(itemObj));
    }
    this.changeThemeColor(itemObj.themeColorName);
    this.rangeValue = itemObj.rangeValue;
    // 周期表の幅に対するメディアクエリを作成
    this.createMediaQuery();
    this.checkMainContentsOverflow();
  },
});
