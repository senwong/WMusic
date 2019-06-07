<template>
  <div class="more-list">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "MoreList"
};
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

.more-list
  display: flex
  flex-direction: column
  padding: 4px
  border-radius: 6px
  box-shadow: 0px 0px 6px 0px rgba(160, 160, 160, 0.6)
  border: 1px solid
  @include themify($themes)
    border-color: themed('border-color')
</style>
