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
  >
    <div class="svg-btn__bg"></div>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SvgBtn extends Vue {
  @Prop(Boolean) small!: boolean;

  @Prop(Boolean) middle!: boolean;

  @Prop(Boolean) large!: boolean;

  @Prop(Boolean) xlarge!: boolean;

  @Prop(Boolean) primary!: boolean;
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
    .svg-btn__bg
      transform: scale(1)
      opacity: 0.5
  &--primary
    color: $primary-color

  &--primary:hover
    color: #fff
    .svg-btn__bg
      background: $primary-color
      opacity: 1
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
