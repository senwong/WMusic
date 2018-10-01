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
        <img :src="card.cover" alt="">
      </router-link>
    </div>
    <router-link :to= "'/'+cardType +'/' + card.id" class="list__name">
      <span>{{card.name}}</span><span> - {{card.artistName}}</span>
    </router-link>
  </div>
</template>
<script>
  export default {
    name: "CardItem",
    props: ['card', 'cardType'],
    methods: {
      formatPlayCount(playCount) {
        if (playCount < 10000) return playCount
        return (playCount / 10000).toFixed(1) + "万"
      }
    },
  }
</script>
<style lang="sass" scoped>
@import '../config.sass';
.list-item
  display: flex;
  flex-direction: column;
  position: relative;
.list__cover
  width: 100%;
  margin-bottom: 1em;
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
    border-radius: 15px;

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
.creator-name
  color: $gray;
  font-size: 12px;
</style>

