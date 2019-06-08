<template>
  <RouterLink class="search-rec-item" :to="to">
    <slot />
  </RouterLink>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SearchRecItem extends Vue {
  @Prop(String) readonly to!: string;
}
</script>

<style lang="sass" scoped>
@import "@/style/colors.sass"
.search-rec-item
  padding: 6px
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  border-radius: 4px
  transition-property: background color
  transition-duration: 250ms
  &:hover
    background: $primary-color
    color: white
</style>
