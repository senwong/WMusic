<template>
  <div class="with-hover-mask-container">
    <slot></slot>
    <div class="mask-wrapper">
      <slot name="controlls"></slot>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.with-hover-mask-container
  width: 100%;
  height: 100;
  position: relative;
  display: flex;

.with-hover-mask-container:hover .mask-wrapper
  opacity: 1;

.mask-wrapper
  transition-property: opacity;
  transition-duration: 250ms;
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(72, 72, 72, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

</style>
