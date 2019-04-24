<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>
<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .5s;

.fade-enter, .fade-leave-to
  opacity: 0;
</style>
