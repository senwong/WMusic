<template>
  <div class="container">
    <slot></slot>
    <div class="underline"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.container:hover .underline
  transform: scaleX(1)

.underline
  height: 2px
  width: 100%
  transform-origin: left
  background: #000
  transition: all 250ms
  transform: scaleX(0)
</style>
