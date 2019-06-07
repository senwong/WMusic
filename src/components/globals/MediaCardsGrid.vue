<template>
  <div>
    <div class="song-cards" v-if="data.length > 0" key="cards">
      <CardItem v-for="card in data" :key="card.id" :card="card" />
    </div>
    <div class="song-cards" v-else key="placeholder">
      <div
        class="placeholder__wrapper"
        v-for="(_, idx) in new Array(15).fill(true)"
        :key="idx"
      >
        <Placeholder class="placeholder__img"></Placeholder>
        <Placeholder class="placeholder__title"></Placeholder>
        <Placeholder class="placeholder__subtitle"></Placeholder>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import CardItem from "./CardItem.vue";
import { Playlist, PlaylistType, MediaCardItem } from "@/types";
import Placeholder from "@/components/globals/Placeholder.vue";
import PlayWithoutCircleIcon from "@/components/SVGIcons/PlayWithoutCircleIcon.vue";

@Component({
  components: { CardItem, Placeholder, PlayWithoutCircleIcon }
})
export default class MediaCardsGrid extends Vue {
  @Prop() readonly data!: MediaCardItem[];
}
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"
.song-cards
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
  grid-gap: 2em
  flex-wrap: wrap
  justify-content: space-between
  &__item
    position: relative

.placeholder
  &__img
    width: 100%
    padding-bottom: 100%
  &__title
    height: 2em
    margin: 0.5em 0
  &__subtitle
    height: 1em
</style>
