<template>
  <button
    :is="tag"
    :to="href"
    class="btn"
    :class="{
      'btn-primary': primary, 
      'btn-secondary': secondary,
      'btn-rounded': rounded,
      'btn-block': block,
      'btn-large': large,
      'btn-small': small,
      'btn-xsmall': xsmall,
      'btn-noborder': noborder,
      'btn-svg_large': svglarge
    }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>  
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop(Boolean) readonly primary!: boolean;
  @Prop(Boolean) readonly secondary!: boolean;
  @Prop(Boolean) readonly rounded!: boolean;
  @Prop(Boolean) readonly block!: boolean;
  @Prop(Boolean) readonly large!: boolean;
  @Prop(Boolean) readonly small!: boolean;
  @Prop(Boolean) readonly xsmall!: boolean;
  @Prop(String) readonly as!: string;
  @Prop(String) readonly href!: string;
  @Prop(Boolean) readonly disabled!: boolean;
  @Prop(Boolean) readonly noborder!: boolean;
  @Prop(Boolean) readonly svglarge!: boolean;
  get tag() {
    return this.as && this.as == 'a' ? 'router-link' : 'button';
  }
}
</script>

<style lang="sass" scoped>
@import '../../style/colors.sass'

.btn
  font-size: 16px
  padding: 0.3em 1em
  border: 1px solid #777
  box-sizing: border-box
  cursor: pointer
  background: transparent
  border-radius: 0.1em
  transition: all 250ms
  &:hover
    color: #000
    border-color: #000
  &:focus, &:active
    outline: none
  &.btn-primary
    border-color: $primary
    transition: all 250ms
    &:hover
      background: $primary
      color: white
  &.btn-secondary
    border-color: $secondary
  &.btn-rounded
    border-radius: 9999px
  &.btn-block
    width: 100%
    text-align: center
  &.btn-large
    font-size: 18px
  &.btn-small
    font-size: 14px
  &.btn-xsmall
    font-size: 12px
  &[disabled]
    opacity: 0.5
  &.btn-noborder
    border: none
  &.btn-svg_large
    width: 2em
    height: 2em
    padding: 0
</style>
