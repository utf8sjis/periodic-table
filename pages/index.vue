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
          <periodic-table />
          <data-page />
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
          <div class="toast__item" @click="clearToast(toast.timeoutID)">
            {{ toast.message }}
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
      /** ナビゲーションメニューが開いているか否か */
      isNavOpened: false,
      /** スクロール量がページのトップあたりか否か */
      isAroundTop: true,
      /** シェアボタンが展開されているか否か */
      isShareButtonExpanded: false,
    }
  },
  head: {
    bodyAttrs: { class: 'body-preload' },
  },
  computed: {
    ...mapGetters({
      toastList: 'toast/toastList',
    }),
  },
  mounted() {
    // スクロールのイベントリスナを追加
    window.addEventListener('scroll', this.handleScroll)
    // localStorageの初期化
    let itemStorage = JSON.parse(localStorage.getItem('itemStorage'))
    itemStorage = {
      themeId: itemStorage?.themeId ?? 'default',
      periodicTableScale: itemStorage?.periodicTableScale ?? 1,
    }
    localStorage.setItem('itemStorage', JSON.stringify(itemStorage))
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
    ...mapMutations(['updateIsPhone']),
    ...mapActions({
      clearToast: 'toast/clearToast',
    }),
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
     * シェアボタンを展開、格納する
     */
    toggleShareExpandButton() {
      this.isShareButtonExpanded = !this.isShareButtonExpanded
    },
  },
}
</script>

<style lang="scss"></style>
