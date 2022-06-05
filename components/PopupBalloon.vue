<template>
  <transition name="popup-balloon-">
    <div
      v-show="isActive"
      class="popup-balloon"
      :style="{
        width: width,
        top: top ? top : 'auto',
        right: right ? right : 'auto',
        left: left ? left : 'auto',
      }"
    >
      <div class="popup-balloon__balloon">
        <div
          class="popup-balloon__beak"
          :style="{
            right: beakRight ? beakRight : 'auto',
            left: beakLeft ? beakLeft : 'auto',
          }"
        ></div>
        <div class="popup-balloon__container">
          <div class="popup-balloon__title">
            <i class="u-pr5" :class="titleIconClass"></i
            ><span>{{ title }}</span>
          </div>
          <div class="popup-balloon__content" v-html="content"></div>
        </div>
        <button
          type="button"
          class="popup-balloon__close-button"
          @click="close"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PopupBalloon',

  props: {
    isActive: { type: Boolean, required: true },
    title: { type: String, required: true },
    titleIconClass: { type: String, required: true },
    content: { type: String, required: true },
    width: { type: String, required: true },
    top: { type: String, default: '' },
    left: { type: String, default: '' },
    right: { type: String, default: '' },
    beakLeft: { type: String, default: '' },
    beakRight: { type: String, default: '' },
  },
  methods: {
    close() {
      this.$emit('toggle-popup-balloon')
    },
  },
}
</script>

<style lang="scss" scoped></style>
