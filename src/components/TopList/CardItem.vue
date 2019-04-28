<template>
  <div class="list-item">
    <CardImage
      :play="{onClick: () => play()}"
      :href="'/'+cardType +'/'+ card.id"
      :src="card.coverImgUrl | convert2Https"
      :alt="card.name"
      ratio="1:1"
      radius
    />
    <router-link :to="'/'+cardType +'/' + card.id" class="list__name">
      {{card.name}}
    </router-link>
  </div>
</template>
<script>
import CardImage from '@/components/globals/CardImage';

export default {
  name: "CardItem",
  props: ['card', 'cardType'],
  components: { CardImage },
  data() {
    return {
      morePopupButton: null,
    }
  },
  mounted() {
    this.morePopupButton = this.$el.querySelector(".control__more");
  },
  methods: {
    addFav(type, id) {
      if(!this.$store.state.isLogin) {
        console.log("not login , cannot add fav "+ type + id);
      } else {
        console.log("add fav "+ type + id);
      }
    },
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
.item-cover
  margin-bottom: 1em;

.list__name
  margin: 8px 0;
  text-decoration: none;
  color: inherit;
  font-weight: bolder;
  font-size: 14px;
  &:hover
    text-decoration: underline;
</style>

