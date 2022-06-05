<template>
  <section class="article-section__subsection">
    <h3 v-if="!isNoHeadline" class="article-section__headline-2">
      {{ headline }}
    </h3>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'ArticleSubsection',

  props: {
    isNoHeadline: { type: Boolean, default: false },
    headline: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped></style>
