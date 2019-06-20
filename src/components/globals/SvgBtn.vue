<template>
  <button
    class="svg-btn"
    :class="{
      'svg-btn--large': large,
      'svg-btn--xlarge': xlarge,
      'svg-btn--middle': middle,
      'svg-btn--small': small,
      'svg-btn--primary': primary
    }"
    @mouseenter="handleMouseOver"
    @mouseleave="handleMouseOut"
  >
    <Motion :values="bgStyle" tag="div" spring="noWobble">
      <div
        class="svg-btn__bg"
        slot-scope="bgStyle"
        :style="{
          transform: `scale(${bgStyle.scale})`,
          opacity: bgStyle.opacity
        }"
      />
    </Motion>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Motion } from "vue-motion";

@Component({
  components: { Motion }
})
export default class SvgBtn extends Vue {
  @Prop(Boolean) small!: boolean;

  @Prop(Boolean) middle!: boolean;

  @Prop(Boolean) large!: boolean;

  @Prop(Boolean) xlarge!: boolean;

  @Prop(Boolean) primary!: boolean;

  bgStyle = {
    scale: 0,
    opacity: 0
  };
  handleMouseOver() {
    // console.log("mouse over");
    this.bgStyle = {
      scale: 1,
      opacity: 1
    };
  }
  handleMouseOut() {
    // console.log("mouse out");
    this.bgStyle = {
      scale: 0,
      opacity: 0
    };
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"

.svg-btn
  position: relative
  font-size: 16px
  margin: -0.375em
  padding: 0.375em
  cursor: pointer
  display: flex
  box-sizing: content-box
  width: 1em
  height: 1em
  border: none
  background: none
  color: inherit
  transform: translate3d(0, 0, 0)
  &:focus
    outline: none
  &:hover
    color: $primary-color
  &--primary
    color: $primary-color

  &--primary:hover
    color: #fff
    .svg-btn__bg
      background: $primary-color
  &[disabled]
    color: #777
  &--large
    width: 1.5em
    height: 1.5em
  &--middle
    width: 1em
    height: 1em
  &--small
    width: 0.5em
    height: 0.5em
  &--xlarge
    width: 2em
    height: 2em
  &__bg
    z-index: -1
    position: absolute
    left: 0
    top: 0
    box-sizing: border-box
    width: 100%
    height: 100%
    transform-origin: center
    transform: scale(0)
    opacity: 0
    transition: all 250ms
    border-radius: 9999px
    @include themify($themes)
      background-color: themed('background-color-hover')
</style>
