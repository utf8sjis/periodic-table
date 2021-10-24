Vue.config.ignoredElements = ['ion-icon'];

Vue.component('normal-sub-area', {
  props: ['name', 'label'],
  template: `
    <div :class="'sub-area sub-area-' + name">
      <div class="label">
        <div v-html="label"></div>
      </div>
      <div :class="'cont-area cont-area-' + name">
        <slot></slot>
      </div>
    </div>`,
});

Vue.component('paragraph-section', {
  props: ['title'],
  template: `
    <section>
      <h1 class="sec-title">{{ title }}</h1>
      <div class="sec-contents">
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
    changerTitleList: changerTitleList,
    /** 現在の表示言語 */
    currentLang: {
      className: 'taiwan-trad', // CSSのクラス
      index: 3,                 // langListでのインデクス
    },
    /** オーバーレイ表示したセル */
    currentCell: {
      obj: cellList[0], // cellListの要素
      index: 0,         // cellListでのインデクス
    },
    /** オーバーレイ表示しているか否か */
    isOverlayDisplayed: false,
    /** bodyScrollLockが有効か否か */
    isBodyScrollLocked: false,
    /** データページを遷移するボタンのHTML */
    signHtml: {
      previous: '', // 前の元素
      next: '',     // 後の元素
    },
    /** データページの元素は最初の元素か否か */
    isStart: false,
    /** データページの元素は最後の元素か否か */
    isEnd: false,
    /** ナビゲーションメニューが開いているか否か */
    navOpened: false,
    /** スクロール量がページのトップあたりではないか否か */
    isNotAroundTop: false,
    /** ポップアップに表示するメッセージ */
    popupMessage: '',
    /** ポップアップが表示中か否か */
    inPopup: false,
    /** ポップアップ表示のタイマーID */
    timerId: null,
    /** 操作パネルの表示のtranslateYの値 */
    changerTranslate: 0,
    /** 操作パネルの内容が最初のものか */
    isDisableUp: true,
    /** 操作パネルの内容が最後のものか */
    isDisableDown: false,
    /** main-contentsの幅を設定したMediaQueryList */
    mql: null,
    /** 画面幅がmain-contentsを超過しているか否か */
    mcIsOverflow: null,
    /** main-contentsの幅 */
    mcWidth: 54 * 18 + 6 * 17 + 60 * 2, // cellSize cellGap padding
    /** main-contentsの幅の倍率 */
    rangeValue: 1,
  },
  methods: {
    /**
     * 周期表の表示言語を変更する
     * @param {number} langIndex - 選択された言語のlangListでのインデクス
     */
    setCurrentLang: function (langIndex) {
      this.langList[this.currentLang.index].isActive = false;
      this.currentLang.index = langIndex;
      this.currentLang.className = this.langList[langIndex].langClass;
      this.langList[langIndex].isActive = true;
    },
    /**
     * 元素のデータページをオーバーレイ表示する
     * @param {number} cellIndex - 選択された元素のcellListでのインデクス
     */
    openOverlay: function (cellIndex) {
      this.currentCell.obj = this.cellList[cellIndex];
      this.currentCell.index = cellIndex;
      this.isOverlayDisplayed = true;
      this.cellList[cellIndex].isActive = true;
      const z = this.cellList[cellIndex].atomicNum;
      const nextIndex = this.atomicNumToIndex(z + 1);
      const previousIndex = this.atomicNumToIndex(z - 1);
      this.signHtml.next =
        nextIndex != -1
          ? '<span>' +
            this.cellList[nextIndex].atomicNum +
            '</span>' +
            this.cellList[nextIndex].innerStr['element-symbol']
          : '<span>119</span>Uue';
      this.signHtml.previous =
        previousIndex != -1
          ? '<span>' +
            this.cellList[previousIndex].atomicNum +
            '</span>' +
            this.cellList[previousIndex].innerStr['element-symbol']
          : '<span>0</span>n';
      this.isEnd = nextIndex != -1 ? false : true;
      this.isStart = previousIndex != -1 ? false : true;
    },
    /**
     * 元素のデータページを閉じる
     */
    closeOverlay: function () {
      this.isOverlayDisplayed = false;
      this.cellList[this.currentCell.index].isActive = false;
    },
    /**
     * データページを遷移する
     * @param {string} to - 'next'＝次の元素か'previous'＝前の元素 
     */
    changeOverlay: function (to) {
      let z = this.currentCell.obj.atomicNum;
      if (to === 'next') {
        z++;
      } else if (to === 'previous') {
        z--;
      }
      if (z >= 1 && z <= 118) {
        const toIndex = this.atomicNumToIndex(z);
        this.cellList[this.currentCell.index].isActive = false;
        this.openOverlay(toIndex);
      }
    },
    /**
     * オーバーレイ表示時、データページのスクロール量を0にする
     * @param {object} el - オーバーレイの要素
     */
    enterFade: function (el) {
      el.querySelector('.ov-container-box').scrollTop = 0;
    },
    /**
     * オーバーレイ表示前、bodyのスクロールを無効にする
     * @param {object} el - オーバーレイの要素
     */
    beforeEnterFade: function (el) {
      const targetEl = document.querySelector('.ov-container-box');
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
     * Twitterのスクリプトタグを再設置し実行する
     */
    runScriptTag: function () {
      this.$el.querySelectorAll('script').forEach(function (script) {
        const alternativeNode = document.createElement('script');
        alternativeNode.src = script.src;
        script.parentNode.replaceChild(alternativeNode, script);
      });
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
      this.navOpened = !this.navOpened;
    },
    /**
     * スクロール量がページのトップあたりかを示すハンドラ
     */
    handleScroll: function () {
      if (window.scrollY > 200) {
        this.isNotAroundTop = true;
      } else {
        this.isNotAroundTop = false;
      }
    },
    /**
     * ページトップまでスクロールする
     */
    toTop: function () {
      jQuery(function () {
        $('body, html').animate({scrollTop: 0}, 500);
      });
    },
    /**
     * 漢字をクリップボードにコピーする
     * @param {string} str - currentCellの元素の漢字
     */
    copyToClipboard: function (str) {
      const listener = function (e) {
        e.clipboardData.setData('text/plain', str);
        e.preventDefault();
        document.removeEventListener('copy', listener);
      };
      document.addEventListener('copy', listener);
      document.execCommand('copy');
      this.activePopup('漢字をコピーしました。');
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
     * @param {string} mes - ポップアップに表示するメッセージ
     */
    activePopup: function (mes) {
      if (this.timerId != null) {
        clearTimeout(this.timerId);
      }
      this.popupMessage = mes;
      this.inPopup = true;
      this.timerId = setTimeout(() => (this.inPopup = false), 3000);
    },
    /**
     * ポップアップを閉じる
     */
    clearPopup: function () {
      if (this.timerId != null) {
        clearTimeout(this.timerId);
      }
      this.inPopup = false;
    },
    /**
     * 画面幅がmain-contentsを超過しているかを示すハンドラ
     * @param {MediaQueryList} mql - main-contentsの幅を設定したMediaQueryList
     */
    mcMediaQuery: function (mql) {
      this.mcIsOverflow = !mql.matches;
    },
    /**
     * 操作パネルの操作の内容を変更する
     * @param {string} d - 'up'か'down'
     */
    changeContents: function (d) {
      const contentsNum = 2;
      const changerHeight = 75;
      if (d === 'up') {
        if (this.changerTranslate === 0) {
          this.changerTranslate = this.changerTranslate;
        } else {
          this.changerTranslate += changerHeight;
        }
      } else {
        if (this.changerTranslate === -changerHeight * (contentsNum - 1)) {
          this.changerTranslate = this.changerTranslate;
        } else {
          this.changerTranslate -= changerHeight;
        }
      }
      if (this.changerTranslate === 0) {
        this.isDisableUp = true;
      } else {
        this.isDisableUp = false;
      }
      if (this.changerTranslate === -changerHeight * (contentsNum - 1)) {
        this.isDisableDown = true;
      } else {
        this.isDisableDown = false;
      }
    },
    /**
     * main-contentsの幅の倍率を1にする
     */
    defaultRange: function () {
      this.rangeValue = 1;
    },
  },
  computed: {
    /**
     * main-contentsのメディアクエリを作成する
     */
    createMcMediaQuery: function () {
      if (this.mql) {
        this.mql.removeListener(this.mcMediaQuery);
      }
      const mcMaxWidth = this.mcWidth;
      this.mql = window.matchMedia('(min-width: ' + mcMaxWidth + 'px)');
      this.mql.addListener(this.mcMediaQuery);
      this.mcMediaQuery(this.mql);
    },
  },
  watch: {
    /**
     * 倍率に応じてmain-contentsの幅を変更する
     */
    rangeValue: function () {
      this.mcWidth = (54 * 18 + 6 * 17 + 60 * 2) * this.rangeValue;
      this.createMcMediaQuery;
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'));
      itemObj.rangeValue = this.rangeValue;
      localStorage.setItem('itemStorage', JSON.stringify(itemObj));
    },
  },
  mounted: function () {
    // Twitterのスクリプトを実行
    this.runScriptTag();
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
    // main-contentsのメディアクエリを作成
    this.createMcMediaQuery;
  },
  updated: function () {
    // Twitterのスクリプトを実行
    this.runScriptTag();
  },
});
