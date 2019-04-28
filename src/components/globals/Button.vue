<template>
  <button
    :is="tag"
    :to="href"
    class="button"
    :class="{
      'button-primary': primary, 
      'button-secondary': secondary,
      'button-rounded': rounded,
      'button-block': block,
      'button-large': large,
    }"
  >
    <slot></slot>
  </button>  
</template>

<script>
export default {
  props: {
    primary: Boolean,
    secondary: Boolean,
    rounded: Boolean,
    block: Boolean,
    large: Boolean,
    as: String,
    href: String,
  },
  computed: {
    tag() {
      return this.as && this.as == 'a' ? 'router-link' : 'button';
    },
  }
}
</script>

<style lang="sass" scoped>
@import '../../style/colors.sass';

.button
  font-size: 16px;
  padding: 0.3em 1em;
  border: 1px solid #777;
  box-sizing: border-box;
  cursor: pointer;
  background: transparent;
  border-radius: 0.1em;
  &:focus, &:active
    outline: none;
  &.button-primary
    border-color: $primary;
    background: $primary;
    color: white;
  &.button-secondary
    border-color: $secondary;
  &.button-rounded
    border-radius: 9999px;
  &.button-block
    width: 100%;
    text-align: center;
  &.button-large
    font-size: 18px;
</style>
