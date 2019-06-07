<template>
  <div>
    <div
      class="song-list-placeholder"
      v-for="(_, idx) in new Array(count)"
      :key="idx"
    >
      <Placeholder class="song-list-placeholder__icon" />
      <div class="song-list-placeholder__info">
        <Placeholder class="song-list-placeholder__info__top" />
        <div class="song-list-placeholder__info__bot">
          <Placeholder class="song-list-placeholder__info__artist" />
          <span class="song-list-placeholder__info__dot">•</span>
          <Placeholder class="song-list-placeholder__info__album" />
        </div>
      </div>
      <Placeholder class="song-list-placeholder__duration" />
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
.song-list-placeholder
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: flex-start
  padding: 0.7em
  &__icon
    height: 2em
    flex: 0 0 2em
    margin-right: 1em
  &__info
    flex: 1 1 auto
    &__top
      width: 5em
      height: 1.125em
    &__artist, &__album
      margin-top: 0.5em
      width: 3em
      height: 1.125em
      display: inline-block
    &__dot
      opacity: 0.6
      padding: 0 0.5em
  &__duration
    flex: 0 0 2em
    height: 2em
</style>
