<template>
  <div class="more-item">
    <div class="more-item__content">
      <div class="more-item__content__wrapper">
        <!-- 靠左显示 -->
        <div class="more-item__left">
          <div class="more-item__left__icon">
            <slot name="icon"></slot>
          </div>
          <slot name="txt"></slot>
        </div>
        <!-- 靠右显示 -->
        <div class="more-item__right">
          <RightArrowIcon v-show="!!spread" />
        </div>
      </div>
    </div>
    <div class="more-item__spread-list" :style="styleObj">
      <slot name="spread-list"></slot>
    </div>
  </div>
</template>
<script>
import RightArrowIcon from "@/components/SVGIcons/RightArrowIcon";

export default {
  name: "MoreItem",
  props: ["spread"],
  data() {
    return {
      styleObj: {}
    };
  },
  components: { RightArrowIcon },
  mounted() {
    this.$nextTick(() => {
      const property = this.spread;
      property === "right" && (this.styleObj = { left: "100%" });
      property === "left" && (this.styleObj = { right: "100%" });
    });
  }
};
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

.more-item
  position: relative
  border-radius: inherit
  &__content
    position: relative
    overflow: visible
    border-radius: inherit
    cursor: pointer
    &:hover
      .more-item__content__wrapper
        background-color: $primary-color
        color: $dark-text-color
      .more-item__left__icon
        color: inherit
    &:hover ~ .spread-list
        display: block
    &__wrapper
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center
      padding: 8px 6px
      border-radius: 2px
  &__left
    display: flex
    flex-direction: row
    align-items: center
    &__icon
      width: 1em
      height: 1em
      @include themify($themes)
        color: themed('secondary-text-color')
  &__right
    width: 1em
    height: 1em
  &__spread-list
    display: none
    position: absolute
    top: 50%
    transform: translateY(-50%)
    max-height: 20em
    overflow: scroll
</style>
