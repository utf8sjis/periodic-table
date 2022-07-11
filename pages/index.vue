<template>
  <div>
    <layout-header />
    <layout-nav />
    <layout-nav-back />
    <main>
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
if (process.client) {
  window.onload = () => {
    const body = document.querySelector('body')
    body.classList.remove('body-preload')
  }
}

export default {
  name: 'IndexPage',

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
  },
}
</script>
