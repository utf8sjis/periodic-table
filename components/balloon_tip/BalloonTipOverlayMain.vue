<template>
  <div class="content">
    <p>
      ここデータページでは元素の基本的なデータや漢字の情報を見ることができます。
    </p>
    <p>
      元素記号の後ろにうっすら見えているイラストは、その元素の常温での<span
        class="u-bold"
        >状態や性質</span
      >を示しています。
    </p>
    <state-image-legend></state-image-legend>
    <p>
      半金属の範囲は一例で、半減期が短い元素の状態は推定から独断と偏見で決めているのであしからず...
    </p>
  </div>
</template>

<script>
export default {
  name: 'BalloonTipOverlayMain',
}
</script>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-template-columns: auto;
  gap: 10px;
}
</style>
