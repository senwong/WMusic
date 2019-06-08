<template>
  <section class="search-rec-list">
    <div class="search-rec-list__title">{{ title }}</div>
    <ul>
      <slot />
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class SearchRecList extends Vue {
  @Prop(String) readonly title!: string;
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"
.search-rec-list
  padding: 3px
  &__title
    font-size: 0.75em
    @include themify($themes)
      color: themed('secondary-text-color')
</style>
