<template>
  <div :class="{ 'angled-gradient': abled, 'placeholder--bg': !abled }">
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
@import "@/style/theme.sass"

.angled-gradient
  @include themify($themes)
    background: linear-gradient(90deg, themed('placeholder-background-color') 25%, themed('placeholder-background-color-gradient') 37%, themed('placeholder-background-color') 63%)
    animation: loading 1.4s ease infinite
    background-size: 400% 100%
    @keyframes loading
      0%
        background-position: 0% 50%
      100%
        background-position: 100% 50%
.placeholder--bg
  @include themify($themes)
    background-color: themed('placeholder-background-color-gradient')
</style>
