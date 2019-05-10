<template>
  <div class="placeholder__wrapper">
    <Placeholder class="placeholder__cover"/>
    <Placeholder class="placeholder__title"/>
    <Placeholder class="placeholder__subtitle"/>
    <Placeholder class="placeholder__subtitle2"/>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import Placeholder from "@/components/globals/Placeholder.vue";
@Component({
  components: { Placeholder }
})
export default class ListItemPlaceholder extends Vue {}
</script>

<style lang="sass" scoped>
.placeholder__wrapper
  font-size: 16px
  align-items: center
  padding: 1em 2em
  display: grid
  grid-template-columns: auto 2fr 1fr auto
.placeholder__cover
  margin-right: 1em
  border-radius: 0.2em
  width: 3em
  height: 3em
  border-radius: 0.3em
.placeholder__title,
.placeholder__subtitle,
.placeholder__subtitle2
  height: 1.25em
.placeholder__title
  width: 8em
.placeholder__subtitle,
.placeholder__subtitle2
  width: 3em
</style>
