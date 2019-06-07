<template>
  <div class="hover-underline">
    <slot></slot>
    <div class="hover-underline__underline"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.hover-underline
  &:hover
    &__underline
    transform: scaleX(1)
  &__underline
    height: 2px
    width: 100%
    transform-origin: left
    background: #000
    transition: all 250ms
    transform: scaleX(0)
</style>
