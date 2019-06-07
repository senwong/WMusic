<template>
  <FadeTransition>
    <div class="error-label" v-if="show">
      <div class="error-label__title">
        <slot></slot>
      </div>
    </div>
  </FadeTransition>
</template>

<script>
import FadeTransition from "@/components/globals/FadeTransition";

export default {
  props: {
    show: {
      required: true,
      type: Boolean
    }
  },
  components: { FadeTransition }
};
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"

.error-label
  font-size: 14px
  text-align: center
  margin-top: 3em
  &__title
    border-radius: 9999px
    padding: 0.5em 2em
    display: inline-block
    @include themify($themes)
      color: themed('secondary-text-color')
      background-color: themed('secondary-background-color')
</style>
