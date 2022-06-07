<template>
  <div>
    <p>
      ここデータページでは元素の基本的なデータや漢字の情報を見ることができます。
    </p>
    <p>
      元素記号の後ろにうっすら見えているイラストは、その元素の常温での<span
        class="u-bold"
        >状態や性質</span
      >を示しています。
    </p>
    <figure></figure>
    <div class="state-image-legend">
      <figure class="state-image-legend__figure">
        <img
          class="state-image-legend__image"
          src="static/img/state/gas.svg"
          alt="気体のイラスト"
        />
        <figcaption class="state-image-legend__caption">気体</figcaption>
      </figure>
      <figure class="state-image-legend__figure">
        <img
          class="state-image-legend__image"
          src="static/img/state/liquid_metal.svg"
          alt="液体金属のイラスト"
        />
        <figcaption class="state-image-legend__caption">液体金属</figcaption>
      </figure>
      <figure class="state-image-legend__figure">
        <img
          class="state-image-legend__image"
          src="static/img/state/liquid_non-metal.svg"
          alt="液体非金属のイラスト"
        />
        <figcaption class="state-image-legend__caption">液体非金属</figcaption>
      </figure>
      <figure class="state-image-legend__figure">
        <img
          class="state-image-legend__image"
          src="static/img/state/solid_metal.svg"
          alt="固体金属のイラスト"
        />
        <figcaption class="state-image-legend__caption">固体金属</figcaption>
      </figure>
      <figure class="state-image-legend__figure">
        <img
          class="state-image-legend__image"
          src="static/img/state/solid_metalloid.svg"
          alt="半金属のイラスト"
        />
        <figcaption class="state-image-legend__caption">半金属</figcaption>
      </figure>
      <figure class="state-image-legend__figure">
        <img
          class="state-image-legend__image"
          src="static/img/state/solid_non-metal.svg"
          alt="固体非金属のイラスト"
        />
        <figcaption class="state-image-legend__caption">固体非金属</figcaption>
      </figure>
    </div>
    <p>
      半金属の範囲は一例で、半減期が短い元素の状態は推定から独断と偏見で決めているのであしからず...
    </p>
  </div>
</template>

<script>
export default {
  name: 'PopupBalloonOverlayMain',
}
</script>
