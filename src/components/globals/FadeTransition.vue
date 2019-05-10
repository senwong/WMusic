<template>
  <transition name="fade" :appear="appear">
    <slot></slot>
  </transition>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

export default class FadeTransition extends Vue {
  @Prop({ type: Boolean, default: false, required: false })
  appear: boolean = false;
}
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
