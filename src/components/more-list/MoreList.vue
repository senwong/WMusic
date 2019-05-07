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
@import "../config.sass";
.more-list
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding: 4px;
  border: 1px solid $whitegray5;
  border-radius: 6px;
  background-color: $whitegray2;
  box-shadow: 0px 0px 6px 0px rgba(160, 160, 160, 0.6);
</style>
