<template>
  <transition name="popup-balloon-">
    <div
      v-show="popupBalloons[name].isActive"
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
            <i
              class="u-pr5"
              :class="popupBalloons[name].contents[index].titleIconClass"
            ></i
            ><span>{{ popupBalloons[name].contents[index].title }}</span>
          </div>
          <div class="popup-balloon__content">
            <component :is="contentComponent"></component>
          </div>
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
    popupBalloons: { type: Object, required: true },
    name: { type: String, required: true },
    index: { type: Number, default: 0 },
    width: { type: String, required: true },
    top: { type: String, default: '' },
    left: { type: String, default: '' },
    right: { type: String, default: '' },
    beakLeft: { type: String, default: '' },
    beakRight: { type: String, default: '' },
  },
  computed: {
    contentComponent() {
      const camelToKebab = (str) =>
        str
          .split(/(?=[A-Z])/)
          .join('-')
          .toLowerCase()

      return (
        'popup-balloon-' +
        camelToKebab(this.name) +
        (this.index ? '-' + this.index : '')
      )
    },
  },
  methods: {
    close() {
      this.$emit('toggle-popup-balloon')
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/global' as g;

.popup-balloon {
  position: absolute;
  max-width: 400px;
  filter: drop-shadow(0 0 2px #0002);
  &:hover {
    display: block;
  }
  &--enter-active,
  &--leave-active {
    transition: opacity 0.2s;
  }
  &--enter,
  &--leave-to {
    opacity: 0;
  }

  &__balloon {
    position: relative;
    font-size: 15px;
  }

  &__beak {
    position: absolute;
    top: -5px;
    width: 0;
    height: 0;
    border-right: 7px solid transparent;
    border-bottom: 7px solid g.$colorMain2;
    border-left: 7px solid transparent;
  }

  &__container {
    display: grid;
    grid-template-columns: auto;
    gap: 10px 0;
    margin-top: 5px;
    border: 2px solid g.$colorMain2;
    border-radius: 8px;
    padding: 12px 15px;
    background: g.$colorBaseA;
  }

  &__title {
    @include g.font(ja, bold);
    color: g.$colorMain1;
  }

  &__content {
    display: grid;
    grid-template-columns: auto;
    gap: 10px 0;
  }

  &__insert {
    padding: 0 20px;
    @include g.mediaQuery() {
      padding: 0;
    }
  }

  &__close-button {
    @include g.flexCentering();
    position: absolute;
    top: 7px;
    right: 7px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    color: g.$colorMain2;
  }
}
</style>
