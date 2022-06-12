<template>
  <section class="article-section">
    <h1 v-if="isLevelOne" class="article-section__headline">{{ headline }}</h1>
    <h2 v-else class="article-section__headline">{{ headline }}</h2>
    <div class="article-section__contents">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArticleSection',

  props: {
    headline: { type: String, required: true },
    isLevelOne: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped></style>
