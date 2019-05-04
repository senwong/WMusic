<template>
  <div class="rank-item">
    <div class="rank-title">
      <span class="rank-index text-gray">{{formatIndex(rankItem.rank + 1)}}</span>
      <UnderscoreIcon class="text-gray rank_icon" v-if="rankItem.rank + 1 == rankItem.lastRank"/>
      <ArrowTopIcon class="rank_icon" v-else-if="rankItem.rank + 1 < rankItem.lastRank" />
      <ArrowBottomIcon class="rank_icon" v-else-if="rankItem.rank + 1 > rankItem.lastRank && rankItem.lastRank <= 10" />
      <span v-else class="rank-index_new">new</span>
    </div>
    <CardImage
      class="media-cover"
      :play="{onClick: () => play()}"
      :href="'/mvplay/'+ rankItem.id"
      :src="rankItem.cover | convert2Https | clipImage(640, 360)"
      :alt="rankItem.name"
      ratio="16:9"
      radius
    />
    <div class="media__info">
      <div class="media__info__name">{{rankItem.name}}</div>
      <div class="media__info__artist">{{rankItem.artistName}}</div>
      <p class="media__info__desc text-gray">{{rankItem.briefDesc}}</p>
    </div>
  </div>
</template>
<script lang='ts'>
import UnderscoreIcon from '@/components/SVGIcons/UnderscoreIcon.vue';
import ArrowTopIcon from '@/components/SVGIcons/ArrowTopIcon.vue';
import ArrowBottomIcon from '@/components/SVGIcons/ArrowBottomIcon.vue';
import CardImage from '@/components/globals/CardImage.vue';
import { Rank } from '@/types';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    UnderscoreIcon,
    ArrowTopIcon,
    ArrowBottomIcon,
    CardImage,
  },
})
export default class RankItem extends Vue {
  @Prop() rankItem!: Rank;
  formatIndex(i: number):string {
    return i < 10 ? '0'+i : i.toString();
  }
  play() {
    // TODO
  }
}
</script>
<style lang="sass" scoped>
.text-gray
  color: #000;
  opacity: 0.3;
.rank-item
  display: flex;
  overflow: hidden;
  .rank_icon
    width: 1em;
    height: 1em;
  .rank-title
    font-size: 24px;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 1.5em;
    .rank-index_new
      font-size: 12px;
      color: green;

  .media__info
    flex: 1 1 auto;
    padding: 0 10px;
    overflow: hidden;
    .media__info__name, .media__info__artist, .media__info__desc
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    .media__info__name
      opacity: 0.9;
      padding: 6px 0;
    .media__info__artist
      opacity: 0.7;
      padding: 6px 0;
    .media__info__desc
      font-size: 14px;

.media-cover
  user-select: none;
  flex: 0 0 267px;
</style>