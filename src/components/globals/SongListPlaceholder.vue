<template>
  <div>
    <div
      class="placeholder__wrapper"
      v-for="(_, idx) in new Array(count)"
      :key="idx"
    >
      <Placeholder class="placeholder__icon" />
      <div class="placeholder__info">
        <Placeholder class="placeholder__title" />
        <div class="placeholder__artist__album">
          <Placeholder class="placeholder__artist" />
          <span class="placeholder__dot">•</span>
          <Placeholder class="placeholder__album" />
        </div>
      </div>
      <Placeholder class="placeholder__duration" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Placeholder from "@/components/globals/Placeholder.vue";

@Component({
  components: { Placeholder }
})
export default class SongListPlaceholder extends Vue {
  @Prop(Number) count!: number;
}
</script>

<style lang="sass" scoped>
.placeholder__wrapper
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: flex-start
  padding: 0.7em
.placeholder__icon
  height: 2em
  flex: 0 0 2em
  margin-right: 1em
.placeholder__info
  flex: 1 1 auto
  .placeholder__title
    width: 5em
    height: 1.125em
  .placeholder__artist, .placeholder__album
    margin-top: 0.5em
    width: 3em
    height: 1.125em
    display: inline-block
.placeholder__dot
  opacity: 0.6
  padding: 0 0.5em
.placeholder__duration
  flex: 0 0 2em
  height: 2em
</style>
