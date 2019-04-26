<template>
  <div class="list-item">
    <CardImage
      class="list__cover"
      :play="{onClick: () => play()}"
      :href="'/'+cardType +'/'+ card.id"
      :src="card.coverImgUrl | convert2Https | clipImage(300, 300)"
      :alt="card.name"
      ratio="1:1"
    />
    <a :href="'/'+cardType +'/'+ card.id" class="song__list">
      <div
        v-for="(track, i) in tracks"
        :key="track.id"
        class="track-list"
      >
      <!-- TODO -->
        <span class="track-order">{{i+1}}</span>
        <span class="track-name">{{track.name}}</span>
        <span class="track-artists">- {{track.ar.map(ar => ar.name).join(";")}}</span>
      </div>
    </a>
    <div class="list__name">
      {{card.name}}
    </div>
  </div>
</template>
<script>
import CardImage from '@/components/globals/CardImage';

export default {
  name: "MediaItem",
  props: ['card', 'cardType'],
  components: { CardImage },
  data() {
    return {
    }
  },
  computed: {
    tracks() {
      return JSON.parse(JSON.stringify(this.card.tracks.slice(0, 3)))
    }
  },
  methods: {
    play() {
      // TODO
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../style/colors.sass'
.list-item
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: $secondary;
.list__cover
  // height: 120px;
  flex: 0 0 120px;

.list__name
  position: absolute;
  top: -0.3em;
  left: -0.3em;
  background-color: black;
  color: white;

.song__list
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 0;
.track-list
  white-space: nowrap;
.track-order, .track-artists
   color: black;
.track-name
  color: $black;
  font-weight: bolder;
.track-order, .track-name, .track-artists
  font-size: 14px;
  vertical-align: middle;
  display: inline-block;
  text-decoration: none;
.track-artists, .track-name
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
.track-order
  padding: 0 1em;
</style>

