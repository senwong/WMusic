<template>
  <div class="rank-item">
    <div class="rank-item__trending rank-item__left">
      <span class="rank-index">{{ formatIndex(rankItem.rank + 1) }}</span>
      <TrendingFlat
        class="rank-item__trending__icon rank-item__trending__icon--flat  "
        v-if="rankItem.rank == rankItem.lastRank"
      />
      <TrendingUp
        class="rank-item__trending__icon rank-item__trending__icon--up"
        v-else-if="rankItem.rank < rankItem.lastRank"
      />
      <TrendingDown
        class="rank-item__trending__icon rank-item__trending__icon--down"
        v-else-if="rankItem.rank > rankItem.lastRank && rankItem.lastRank <= 10"
      />
      <span v-else class="rank-item__trending__new">new</span>
    </div>
    <CardItem class="rank-item__right" :card="mediaCardData" row />
  </div>
</template>
<script lang="ts">
import CardItem from "@/components/globals/CardItem.vue";
import { Rank, MediaCardItem, MediaCardType } from "@/types";
import { Vue, Component, Prop } from "vue-property-decorator";
import TrendingDown from "@/components/SVGIcons/TrendingDown.vue";
import TrendingFlat from "@/components/SVGIcons/TrendingFlat.vue";
import TrendingUp from "@/components/SVGIcons/TrendingUp.vue";

@Component({
  components: {
    CardItem,
    TrendingDown,
    TrendingUp,
    TrendingFlat
  }
})
export default class RankItem extends Vue {
  @Prop() rankItem!: Rank;

  formatIndex(i: number): string {
    return i < 10 ? `0${i}` : i.toString();
  }

  get mediaCardData() {
    const rankItem = this.rankItem;
    return {
      type: MediaCardType.Mv,
      picUrl: rankItem.cover,
      title: rankItem.name,
      id: rankItem.id,
      subTitle: rankItem.artistName,
      subLink: rankItem.artistId && `/artist/${rankItem.artistId}`,
      playCount: rankItem.playCount
    };
  }

  play() {
    // TODO
  }
}
</script>
<style lang="sass" scoped>
@import "@/style/theme.sass"

.text-gray
  @include themify($themes)
    color: themed('secondary-text-color')
.rank-item
  display: flex
  overflow: hidden
  &__left
    flex: 0 0 1.5em
  &__right
    margin-left: 1em
  &__trending
    font-size: 24px
    padding: 0 5px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    &__icon
      width: 1em
      height: 1em
      &--flat
        @include themify($themes)
          color: themed('secondary-text-color')
      &--up
        color: green
      &--down
        color: red
    &__new
      font-size: 12px
      color: red

  .media__info
    flex: 1 1 auto
    padding: 0 10px
    overflow: hidden
    .media__info__name, .media__info__artist, .media__info__desc
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    .media__info__name
      opacity: 0.9
      padding: 6px 0
    .media__info__artist
      opacity: 0.7
      padding: 6px 0
    .media__info__desc
      font-size: 14px

.media-cover
  user-select: none
  flex: 0 0 267px
</style>
