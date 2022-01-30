import {controlList} from './control_panel_content_list.js';

export const balloonTips = {
  controlPanel: [
    {
      title: controlList[0].name,
      titleIconClass: controlList[0].iconClass,
      content: String.raw`
        <p>周期表の表示内容を変更します。</p>
        <p>選択できるのは<span class="balloon-tip__paragraph-bold">大陸簡体</span>（中国大陸で使われる簡体字）、<span class="balloon-tip__paragraph-bold">台湾正体</span>（台湾で使われる繁体字）、<span class="balloon-tip__paragraph-bold">香港繁体</span>（香港で使われる繁体字）の3つの地域で使われる漢字に<span class="balloon-tip__paragraph-bold">原子番号</span>、<span class="balloon-tip__paragraph-bold">元素記号</span>、<span class="balloon-tip__paragraph-bold">日本語名</span>、<span class="balloon-tip__paragraph-bold">英語名</span>を加えた計7種類です。</p>
      `,
    },
    {
      title: controlList[1].name,
      titleIconClass: controlList[1].iconClass,
      content: String.raw`
        <p>周期表を拡大・縮小します。</p>
        <p>スライドバーを動かすことによって<span class="balloon-tip__paragraph-bold">0.5倍から2倍</span>の間で周期表のサイズを変えることができます。お使いのデバイスの画面サイズに合わせて調節してみてください。</p>
        <p>ちなみに、倍率が表示されているボタンを押すと倍率が1倍にリセットされます。</p>
      `,
    },
  ],
  overlayMain: {
    title: 'データページ',
    titleIconClass: 'fas fa-database',
    content: String.raw`
      <p>ここデータページでは元素の基本的なデータや漢字の情報を見ることができます。</p>
      <p>元素記号の後ろにうっすら見えているイラストは、その元素の常温での<span class="article-section__bold">状態や性質</span>を示しています。</p>
      <figure></figure>
        <div class="state-image-legend">
          <figure class="state-image-legend__figure">
            <img class="state-image-legend__image" src="static/img/state/gas.svg" alt="気体のイラスト">
            <figcaption class="state-image-legend__caption">気体</figcaption>
          </figure>
          <figure class="state-image-legend__figure">
            <img class="state-image-legend__image" src="static/img/state/liquid_metal.svg" alt="液体金属のイラスト">
            <figcaption class="state-image-legend__caption">液体金属</figcaption>
          </figure>
          <figure class="state-image-legend__figure">
            <img class="state-image-legend__image" src="static/img/state/liquid_non-metal.svg" alt="液体非金属のイラスト">
            <figcaption class="state-image-legend__caption">液体非金属</figcaption>
          </figure>
          <figure class="state-image-legend__figure">
            <img class="state-image-legend__image" src="static/img/state/solid_metal.svg" alt="固体金属のイラスト">
            <figcaption class="state-image-legend__caption">固体金属</figcaption>
          </figure>
          <figure class="state-image-legend__figure">
            <img class="state-image-legend__image" src="static/img/state/solid_metalloid.svg" alt="半金属のイラスト">
            <figcaption class="state-image-legend__caption">半金属</figcaption>
          </figure>
          <figure class="state-image-legend__figure">
            <img class="state-image-legend__image" src="static/img/state/solid_non-metal.svg" alt="固体非金属のイラスト">
            <figcaption class="state-image-legend__caption">固体非金属</figcaption>
          </figure>
        </div>
        <p>半金属の範囲は一例で、半減期が短い元素の状態は推定から独断と偏見で決めているのであしからず...</p>
    `,
  },
};
