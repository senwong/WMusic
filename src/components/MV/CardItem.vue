<template>
  <div class="list-item">
    <CardImage
      :play="{ onClick: () => play() }"
      :href="`/${cardType}/${card.id}`"
      :src="this.card.cover | convert2Https | clipImage(640, 360)"
      :alt="card.name"
      ratio="16:9"
      radius
    />
    <router-link :to="`/${cardType}/${card.id}`" class="list__name">
      <div class="card__name">{{ card.name }}</div>
    </router-link>
    <div class="artist__names">
      <ArtistsWithComma :artists="card.artists" aTagClass="artist__name"/>
    </div>
  </div>
</template>
<script lang="ts">
import CardImage from "@/components/globals/CardImage.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import { MvCard } from "@/types";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: { CardImage, ArtistsWithComma }
})
export default class CardItem extends Vue {
  @Prop() card!: MvCard;

  @Prop() cardType!: string;

  formatPlayCount(playCount: number): string {
    if (playCount < 10000) return playCount.toString();
    return `${(playCount / 10000).toFixed(1)}万`;
  }

  play() {
    // TODO
  }
}
</script>
<style lang="sass" scoped>
.list-item
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;

.list__name
  margin: 8px 0 0;
  text-decoration: none;
  color: inherit;
  font-weight: bolder;
  font-size: 14px;
  &:hover
    text-decoration: underline;
.play-count
  display: flex;
  align-items: center;
  position: absolute;
  right: 0.7em;
  top: 0.5em;
  padding: 0 0.2em;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  display: inline-block;
  border-radius: 0.2em;
  font-size: 12px;
.card__name
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
.artist__names
  display: flex
  color: #333
.artist__name
  &:hover
    text-decoration: underline
</style>
