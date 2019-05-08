<template>
  <div class="popup-menu">
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>
<style lang="sass" scoped>
@import "config.sass"
.popup-menu
  position: fixed
  z-index: 99
.hide
  opacity: 0
  visibility: hidden
</style>
