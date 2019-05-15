<template>
  <button
    class="wrapper"
    :class="{
      large: large,
      xlarge: xlarge,
      middle: middle,
      small: small,
      primary: primary
    }"
  >
    <div class="background"></div>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SvgBtnWrapper extends Vue {
  @Prop(Boolean) small!: boolean;

  @Prop(Boolean) middle!: boolean;

  @Prop(Boolean) large!: boolean;

  @Prop(Boolean) xlarge!: boolean;

  @Prop(Boolean) primary!: boolean;
}
</script>

<style lang="sass" scoped>
@import '@/style/colors.sass'

.wrapper
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
  &:focus
    outline: none
  &:hover
    color: $primary
    .background
      transform: scale(1)
      opacity: 0.5
  &.primary
    color: $primary

  &.primary:hover
    color: #fff
    .background
      background: $primary
      opacity: 1
  &[disabled]
    color: #777
  &.large
    width: 1.5em
    height: 1.5em
  &.middle
    width: 1em
    height: 1em
  &.small
    width: 0.5em
    height: 0.5em
  &.xlarge
    width: 2em
    height: 2em
.background
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
  background: #bbb
  transition: all 250ms
  border-radius: 9999px
</style>
