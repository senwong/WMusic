<template>
  <div class="list-item">
    <div class="list__cover">
      <!-- hover时显示播放 -->
      <div class="list__control">
        <!-- 播放 -->
        <div @click="$store.dispatch('newPlayList', {type: cardType, id: card.id, isPlay: true})" class="control__play control__item">
          <svg class="i-caret-right" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M10 30 L26 16 10 2 Z"></path>
          </svg>
        </div>
      </div>
      <router-link :to= "'/'+cardType +'/'+ card.id" class="item__link">
        <img :src="card.coverImgUrl" alt="">
      </router-link>
    </div>
    <router-link :to= "'/'+cardType +'/'+ card.id" class="song__list">
      <div
        v-for="(track, i) in tracks"
        :key="track.id"
        class="track-list"
      >
        <span class="track-order">{{i+1}}</span>
        <span class="track-name">{{track.name}}</span>
        <span class="track-artists">- {{track.ar.map(ar => ar.name).join(";")}}</span>
      </div>
    </router-link>
    <div class="list__name">
      {{card.name}}
    </div>
  </div>
</template>
<script>
  export default {
    name: "MediaItem",
    props: ['card', 'cardType'],
    data() {
      return {
      }
    },
    computed: {
      tracks() {
        return JSON.parse(JSON.stringify(this.card.tracks.slice(0, 3)))
      }
    }
  }
</script>
<style lang="sass" scoped>
@import '../config.sass';
.list-item
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: $whitegray3-5;
.list__cover
  height: 120px;
  flex: 0 0 120px;
  position: relative;
  font-size: 0;
  &:hover .list__control
    visibility: visible;
 
.item__link
  display: inline-block;
  height: 100%;
  width: 100%;
  user-select: none;
  &::after
    content: "";
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $mask;
    border-radius: 15px;
  &:hover::after
    display: block;
  img
    width: 100%;
    height: auto;

.list__control
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  left: 50%;
  visibility: hidden;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 9;
  &:hover
    visibility: visible;
.list__control:hover ~ .item__link::after
  display: block;
.control__item
  margin: 5px;
.control__play
  padding: 5px;
  border-radius: 50%;
  background: $orange;
.list__name
  position: absolute;
  top: -0.3em;
  left: -0.3em;
  background-color: black;
  color: white;
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
.creator-name
  color: $gray;
  font-size: 12px;
.song__list
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 0;
.track-list
  white-space: nowrap;
.track-order, .track-artists
   color: $gray3;
.track-name
  color: $black2;
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

