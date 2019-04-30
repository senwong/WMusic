<template>
  <div class="list-item">
    <CardImage
      :play="{onClick: () => play()}"
      :href="`/${cardType}/${card.id}`"
      :src="this.card.cover | convert2Https | clipImage(640, 360)"
      :alt="card.name"
      ratio="16:9"
      radius
    />
    <router-link :to="`/${cardType}/${card.id}`" class="list__name">
      <span>{{card.name}}</span><span> - </span><ArtistsWithComma :artists="card.artists" />
    </router-link>
  </div>
</template>
<script>
import CardImage from '@/components/globals/CardImage';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma';

export default {
  name: "CardItem",
  props: ['card', 'cardType'],
  components: { CardImage, ArtistsWithComma },
  methods: {
    formatPlayCount(playCount) {
      if (playCount < 10000) return playCount
      return (playCount / 10000).toFixed(1) + "万"
    },
    play() {
      // TODO
    }
  },
}
</script>
<style lang="sass" scoped>
.list-item
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;

.list__name
  margin: 8px 0;
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
</style>
