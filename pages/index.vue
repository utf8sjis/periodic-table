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
export default {
  name: 'IndexPage',

  head: {
    bodyAttrs: { class: 'body-preload' },
  },
}
</script>
