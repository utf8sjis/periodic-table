<template>
  <div class="state-image-legend">
    <figure class="state-image-legend__figure">
      <img
        class="state-image-legend__image"
        src="@/assets/img/state/gas.svg"
        alt="気体のイラスト"
      />
      <figcaption class="state-image-legend__caption">気体</figcaption>
    </figure>
    <figure class="state-image-legend__figure">
      <img
        class="state-image-legend__image"
        src="@/assets/img/state/liquid_metal.svg"
        alt="液体金属のイラスト"
      />
      <figcaption class="state-image-legend__caption">液体金属</figcaption>
    </figure>
    <figure class="state-image-legend__figure">
      <img
        class="state-image-legend__image"
        src="@/assets/img/state/liquid_non-metal.svg"
        alt="液体非金属のイラスト"
      />
      <figcaption class="state-image-legend__caption">液体非金属</figcaption>
    </figure>
    <figure class="state-image-legend__figure">
      <img
        class="state-image-legend__image"
        src="@/assets/img/state/solid_metal.svg"
        alt="固体金属のイラスト"
      />
      <figcaption class="state-image-legend__caption">固体金属</figcaption>
    </figure>
    <figure class="state-image-legend__figure">
      <img
        class="state-image-legend__image"
        src="@/assets/img/state/solid_metalloid.svg"
        alt="半金属のイラスト"
      />
      <figcaption class="state-image-legend__caption">半金属</figcaption>
    </figure>
    <figure class="state-image-legend__figure">
      <img
        class="state-image-legend__image"
        src="@/assets/img/state/solid_non-metal.svg"
        alt="固体非金属のイラスト"
      />
      <figcaption class="state-image-legend__caption">固体非金属</figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  name: 'StateImageLegend',
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/global' as g;

.state-image-legend {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
  gap: 5px 15px;
  @include g.mediaQuery() {
    gap: 2px 10px;
  }

  &__figure {
    display: grid;
    grid-template-columns: auto;
    gap: 5px;
    @include g.mediaQuery() {
      gap: 2px;
    }
  }

  &__caption {
    text-align: center;
    white-space: nowrap;
  }

  &__image {
    width: 100%;
    border-radius: 5px;
    padding: 10px;
    object-fit: cover;
    background: g.$colorMain2;
  }
}
</style>
