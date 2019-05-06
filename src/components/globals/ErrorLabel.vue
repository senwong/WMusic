<template>
<FadeTransition>
  <div class="error-label__wrapper" v-if="show">
    <div class="error-label__title">
      <slot></slot>
    </div>
  </div>
</FadeTransition>
</template>

<script>
import FadeTransition from '@/components/globals/FadeTransition';

export default {
  props: {
    show: {
      required: true,
      type: Boolean,
    },
  },
  components: { FadeTransition },
}
</script>

<style lang="sass" scoped>
.error-label__wrapper
  font-size: 14px
  text-align: center
  margin-top: 3em
.error-label__title
  background-color: #333
  color: #F2F2F2
  border-radius: 9999px
  padding: 0.5em 2em
  display: inline-block
</style>
