<template>
  <div>
    <div class="select">
      <div
        class="select__element"
        @click="handleClick"
        :class="{ 'select__element--focused': showOptions }"
      >
        <span class="select__element__title">{{ title }}</span>
        <span
          class="select__element__icon"
          :class="{
            'select__element__icon--rotat-down': showOptions && !top,
            'select__element__icon--rotat-up': showOptions && top
          }"
        >
          <ChevronBottomIcon />
        </span>
      </div>
      <div class="select__options">
        <transition name="slide-fade">
          <div
            class="select__options__container"
            :class="{ 'select__options__container--is-top': top }"
            v-show="showOptions"
          >
            <div
              class="select__options__item"
              v-for="opt in options"
              :key="opt.key"
              @click="handleOptClick(opt)"
              :class="{ 'select__options__item--selected': opt.value == value }"
            >
              {{ opt.title }}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronBottomIcon from "@/components/SVGIcons/ChevronBottomIcon";

export default {
  name: "Select",
  props: {
    // option: {key, value, title}
    options: {
      type: Array
    },
    // selected from v-model
    value: {
      required: true
    },
    // options on the top of select element, because bottom has no room
    top: {
      type: Boolean
    },
    optionValueToTitle: {
      required: false
    }
  },
  data() {
    return {
      showOptions: false,
      // selected to emit
      valueTemp: null
    };
  },
  computed: {
    title() {
      if (!this.value || !this.options) {
        return "请选择";
      }
      const opt = this.options.find(opt => opt.value == this.value);
      if (opt) {
        if (
          this.optionValueToTitle &&
          typeof this.optionValueToTitle === "function"
        ) {
          return this.optionValueToTitle(opt.value);
        } else {
          return opt.value;
        }
      } else {
        return "请选择";
      }
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    valueTemp() {
      this.$emit("change", this.valueTemp);
    }
  },
  methods: {
    handleClick() {
      this.showOptions = !this.showOptions;
    },
    handleOptClick(opt) {
      this.valueTemp = opt.value;
      this.showOptions = false;
    }
  },
  components: { ChevronBottomIcon }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.select
  position: relative
  width: fit-content
  width: -moz-fit-content
  &__element
    font-size: 16px
    line-height: 1.25em
    border: 1px solid #bbb
    width: 100%
    padding: 0.2em 0.4em
    box-sizing: border-box
    border-radius: 0.4em
    cursor: pointer
    user-select: none
    -moz-user-select: none
    &--focused
      border-color: #3f72af
    &__title
      vertical-align: middle
      white-space: nowrap
    &__icon
      width: 1em
      display: inline-block
      vertical-align: middle
      transition: all 250ms
      transform: rotate(-90deg)
      &--rotat-down
        transform: rotate(0deg)
      &--rotat-up
        transform: rotate(-180deg)

  &__options
    position: relative
    &__container
      position: absolute
      top: 0.2em
      left: 0
      min-width: 100%
      min-height: 100px
      max-height: 200px
      overflow: scroll
      border: 1px solid #eee
      background: #f9f7f7
      padding: 0.2em 0
      border-radius: 0.4em
      z-index: 1
      &--is-top
        bottom: 2em
        top: auto
    &__item
      cursor: pointer
      padding: 0.2em 0.5em
      color: #393e46
      border-radius: 0.2em
      white-space: nowrap
      &:hover
        background: #3f72af
      &--selected
        color: #222831
.slide-fade
  &-enter-active,
  &-leave-active
    transition: all .25s
  &-enter,
  &-leave-to
    transform: translateY(-10px)
    opacity: 0
  &-enter-to,
  &-leave
    transform: translateY(0px)
    opacity: 1
</style>
