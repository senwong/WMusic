<template>
  <div class="with-hover-mask-container">
    <slot></slot>
    <div class="mask-wrapper">
      <slot name="controlls"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.with-hover-mask-container
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;

.with-hover-mask-container:hover .mask-wrapper
  opacity: 1;

.mask-wrapper
  opacity: 0;
  transition-property: opacity;
  transition-duration: 250ms;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(72, 72, 72, 0.4);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
</style>
