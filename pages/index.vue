<template>
  <div>
    <layout-header
      :is-nav-opened="isNavOpened"
      @toggle-nav-open="toggleNavOpen"
    />
    <layout-nav :is-nav-opened="isNavOpened" />
    <layout-nav-back
      :is-nav-opened="isNavOpened"
      @toggle-nav-open="toggleNavOpen"
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
    <layout-bottom-fixed-area />
    <layout-toast />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

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
    }
  },

  head: {
    bodyAttrs: { class: 'body-preload' },
  },

  mounted() {
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
  },
}
</script>
