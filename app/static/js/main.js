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
    /** 周期表の幅と高さ */
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
     * @param {string} to - 'next'＝次の元素か'previous'＝前の元素 
     */
    changeOverlay: function (to) {
      let z = this.current.cell.atomicNum;
      if (to === 'next') {
        z++;
      } else if (to === 'previous') {
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
      this.isNavOpened = !this.isNavOpened;
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
    // 周期表の幅に対するメディアクエリを作成
    this.createMediaQuery();
    this.checkMainContentsOverflow();
  },
  updated: function () {
    // Twitterのスクリプトを実行
    this.runScriptTag();
  },
});
