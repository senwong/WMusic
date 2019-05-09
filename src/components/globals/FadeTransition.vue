<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .5s;

.fade-enter, .fade-leave-to
  opacity: 0;
</style>
