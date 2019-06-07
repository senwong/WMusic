<template>
  <transition name="fade" :appear="appear">
    <slot></slot>
  </transition>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class FadeTransition extends Vue {
  @Prop(Boolean) appear!: boolean;
}
</script>

<style lang="sass" scoped>
.fade
  &-enter-active, &-leave-active
  transition: opacity .5s
  &-enter, &-leave-to
    opacity: 0
</style>
