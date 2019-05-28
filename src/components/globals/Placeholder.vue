<template>
  <div :class="{ 'angled-gradient': abled }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Placeholder extends Vue {
  @Prop({ default: true }) readonly abled!: boolean;
}
</script>

<style lang="sass" scoped>
.angled-gradient
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%)
  animation: loading 1.4s ease infinite
  background-size: 400% 100%

@keyframes loading
  0%
    background-position: 0% 50%

  100%
    background-position: 100% 50%
</style>
