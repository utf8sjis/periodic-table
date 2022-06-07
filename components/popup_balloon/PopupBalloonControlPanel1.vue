<template>
  <div>
    <p>
      <span class="u-bold">原子番号</span>の一致、および<span class="u-bold"
        >元素記号</span
      >、<span class="u-bold">日本語名</span>、<span class="u-bold">英語名</span
      >、<span class="u-bold">中国語名</span>の部分一致で元素を検索します。
    </p>
    <p>
      結果のリストの各項目にはどのデータの種類でマッチしたかの<span
        class="u-bold"
        >タグ</span
      >が付いています（<span
        class="element-search__result-type-tag element-search__result-type-tag--atomic-number"
        >番号</span
      >＝原子番号、<span
        class="element-search__result-type-tag element-search__result-type-tag--element-symbol"
        >記号</span
      >＝元素記号、<span
        class="element-search__result-type-tag element-search__result-type-tag--japanese-name"
        >日</span
      >＝日本語名、<span
        class="element-search__result-type-tag element-search__result-type-tag--english-name"
        >英</span
      >＝英語名、<span
        class="element-search__result-type-tag element-search__result-type-tag--simplified-chinese"
        >大陸</span
      >＝大陸簡体、<span
        class="element-search__result-type-tag element-search__result-type-tag--taiwan-trad"
        >台湾</span
      >＝台湾正体、<span
        class="element-search__result-type-tag element-search__result-type-tag--hongkong-trad"
        >香港</span
      >＝香港繁体）。左の<span class="u-bold">選択メニュー</span
      >ではそのリストをデータの種類でフィルターすることができます。
    </p>
    <p>
      リストの項目を押すと直接<span class="u-bold">データページ</span
      >がオーバーレイ表示されます。
    </p>
  </div>
</template>

<script>
export default {
  name: 'PopupBalloonControlPanel1',
}
</script>
