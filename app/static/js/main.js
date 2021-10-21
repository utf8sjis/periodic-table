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
    currentLang: {
      className: 'taiwan-trad',
      index: 3,
    },
    currentCell: {
      obj: cellList[0],
      index: 0,
    },
    isDisp: false,
    isHidden: false,
    signHtml: {
      previous: '',
      next: '',
    },
    isStart: false,
    isEnd: false,
    demoCell: demoCell,
    navOpened: false,
    isNotAroundTop: false,
    popupMessage: '',
    inPopup: false,
    timerId: null,
    changerTranslate: 0,
    isDisableUp: true,
    isDisableDown: false,
    mql: null,
    mcIsOverflow: null,
    mcWidth: 54 * 18 + 6 * 17 + 60 * 2, // cellSize cellGap padding
    rangeValue: 1,
  },
  methods: {
    setCurrentLang: function (langIndex) {
      this.langList[this.currentLang.index].isActive = false;
      this.currentLang.index = langIndex;
      this.currentLang.className = this.langList[langIndex].langClass;
      this.langList[langIndex].isActive = true;
    },
    openOverlay: function (cellIndex) {
      this.currentCell.obj = this.cellList[cellIndex];
      this.currentCell.index = cellIndex;
      this.isDisp = true;
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
    openDemoOverlay: function () {
      this.currentCell.obj = demoCell;
      this.isDisp = true;
      demoCell.isActive = true;
      this.signHtml.next = '次の元素';
      this.signHtml.previous = '前の元素';
      this.isEnd = this.isStart = true;
    },
    closeOverlay: function () {
      this.isDisp = false;
      this.cellList[this.currentCell.index].isActive = false;
      demoCell.isActive = false;
    },
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
    enterFade: function (el) {
      el.querySelector('.ov-container-box').scrollTop = 0;
    },
    beforeEnterFade: function (el) {
      const targetEl = document.querySelector('.ov-container-box');
      bodyScrollLock.disableBodyScroll(targetEl, {
        reserveScrollBarGap: true,
      });
      this.isHidden = true;
    },
    beforeLeaveFade: function (el) {
      bodyScrollLock.clearAllBodyScrollLocks();
      this.isHidden = false;
    },
    runScriptTag: function () {
      this.$el.querySelectorAll('script').forEach(function (script) {
        const alternativeNode = document.createElement('script');
        alternativeNode.src = script.src;
        script.parentNode.replaceChild(alternativeNode, script);
      });
    },
    atomicNumToIndex: function (atomicNum) {
      return this.cellList.findIndex(
        (element) => element.atomicNum === atomicNum
      );
    },
    navOpen: function () {
      this.navOpened = !this.navOpened;
    },
    handleScroll: function () {
      if (window.scrollY > 200) {
        this.isNotAroundTop = true;
      } else {
        this.isNotAroundTop = false;
      }
    },
    toTop: function () {
      jQuery(function () {
        $('body, html').animate({scrollTop: 0}, 500);
      });
    },
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
    activePopup: function (mes) {
      if (this.timerId != null) {
        clearTimeout(this.timerId);
      }
      this.popupMessage = mes;
      this.inPopup = true;
      this.timerId = setTimeout(() => (this.inPopup = false), 3000);
    },
    clearPopup: function () {
      if (this.timerId != null) {
        clearTimeout(this.timerId);
      }
      this.inPopup = false;
    },
    mcMediaQuery: function (mql) {
      // console.log(!mql.matches);
      this.mcIsOverflow = !mql.matches;
    },
    changeContents: function (d) {
      const contentsNum = 2;
      const changerHeight = 75;
      // console.log(this.changerTranslate);
      if (d === 'up') {
        if (this.changerTranslate === 0) {
          // this.changerTranslate = -changerHeight * (contentsNum - 1);
          this.changerTranslate = this.changerTranslate;
        } else {
          this.changerTranslate += changerHeight;
        }
      } else {
        if (this.changerTranslate === -changerHeight * (contentsNum - 1)) {
          // this.changerTranslate = 0;
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
    defaultRange: function () {
      this.rangeValue = 1;
    },
  },
  computed: {
    createMcMediaQuery: function () {
      if (this.mql) {
        this.mql.removeListener(this.mcMediaQuery);
      }
      const mcMaxWidth = this.mcWidth;
      this.mql = window.matchMedia('(min-width: ' + mcMaxWidth + 'px)');
      this.mql.addListener(this.mcMediaQuery);
      this.mcMediaQuery(this.mql);
      // console.log(mcMaxWidth);
    },
  },
  watch: {
    rangeValue: function () {
      this.mcWidth = (54 * 18 + 6 * 17 + 60 * 2) * this.rangeValue;
      this.createMcMediaQuery;
      const itemObj = JSON.parse(localStorage.getItem('itemStorage'));
      itemObj.rangeValue = this.rangeValue;
      localStorage.setItem('itemStorage', JSON.stringify(itemObj));
    },
  },
  mounted: function () {
    // script tag
    this.runScriptTag();
    // scroll event
    window.addEventListener('scroll', this.handleScroll);
    // localStorage
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
    // main-content mediaQuery
    this.createMcMediaQuery;
  },
  updated: function () {
    // script tag
    this.runScriptTag();
  },
});
