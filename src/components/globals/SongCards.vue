<template>
  <div>
    <div class="lists" v-if="cardLists.length > 0" key="cards">
      <CardItem v-for="card in cardLists" :key="card.id" :card="card" :cardType="cardType" />
    </div>
    <div class="lists" v-else key="placeholder">
      <div class="placeholder__wrapper" v-for="(_, idx) in new Array(15).fill(true)" :key="idx">
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
import { Playlist, PlaylistType } from "@/types";
import Placeholder from "@/components/globals/Placeholder.vue";

@Component({
  components: { CardItem, Placeholder }
})
export default class SongCards extends Vue {
  @Prop() readonly cardType!: PlaylistType;

  @Prop() readonly cardLists!: Playlist[];
}
</script>
<style lang="sass" scoped>
.lists
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
  grid-gap: 2em
  flex-wrap: wrap
  justify-content: space-between

.placeholder__img
  width: 100%
  padding-bottom: 100%
.placeholder__title
  height: 2em
  margin: 0.5em 0
.placeholder__subtitle
  height: 1em
</style>
