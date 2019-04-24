<template>
<Motion :values="styles" tag="div" ref="container" class="motion" :class="{ ishover: isHover }">
  <div
    class="container"
    :class="{ 'active': track.id == currentSongId }"
    slot-scope="_size"
    :style="{
      transform: `scale(${_size.scale})`,
      boxShadow: `0px 0px ${_size.blurRadius}px ${_size.spreadRadius}px rgba(0, 0, 0, 0.2)`,
      zIndex: isHover ? 1 : 0,
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 靠左显示 -->
    <div class="album-img">
      <img :src="track.al.picUrl | convert2Https | clipImage(80, 80)" :alt="track.name">
    </div>
    <div class="name-songer">
      <div class="name">{{track.name}}</div>
      <div class="songer">{{track.ar.map(ar => ar.name).join("/")}}</div>
    </div>
    <!-- 靠右显示 -->
    <div class="duration">
      {{formatTime(track.dt)}}
    </div>
    <!-- hover时才显示收藏和更多 -->
    <div class="fav-more">
      <!-- 收藏  TODO  -->
      <button class="button_icon fav" :class="{'is-fav': false}">
        <FavIcon />
      </button>
      <!-- 更多 popMenuSongId = track.id -->
      <button class="button_icon song-more" @click="$emit('handleMoreClick', track.id)">
        <MoreIcon />
      </button>
    </div>
  </div>
</Motion>
</template>
<script>
import { Motion } from 'vue-motion';
import { formatTime } from '@/utilitys';
import FavIcon from './SVGIcons/FavIcon';
import MoreIcon from './SVGIcons/MoreIcon';

export default {
  data() {
    return {
      isHover: false,
    };
  },
  props: [ 'track', 'currentSongId' ],
  components: { Motion, FavIcon, MoreIcon },
  computed: {
    styles() {
      return {
        translateX: this.isHover ? 0 : 0,
        scale: this.isHover ? 1.05 : 1,
        blurRadius: this.isHover ? 5 : 0,
        spreadRadius: this.isHover ? 5 : 0,
      };
    }
  },
  methods: {
    formatTime,
    handleMouseEnter() {
      this.isHover = true;
    },
    handleMouseLeave() {
      this.isHover = false;
    },
  }
}
</script>
<style lang="sass" scoped>
@import "config.sass";
.motion
  z-index: 0;
  position: relative;
  &.ishover
    z-index: 1;

// 单个歌曲样式
.container
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  &.active
    color: $orange;
.container:nth-of-type(2n+1)
  background-color: $whitegray;
.container:not(.not-play):hover
  background-color: $whitegray3;
// 专辑封面
.album-img
  flex: 0 0 40px;
  height: 40px;
  img
    width: 100%;
    height: 100%;
    border-radius: 4px;
.name-songer
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  max-width: 100%;
  overflow: hidden;
  .name
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  .songer
    font-size: 12px;
    color: $gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
.container
  .songer:hover,
    color: $orange;
.duration
  color: $gray;
  font-size: 12px;
  flex: 0 0 50px;
// hover时显示更多和收藏
.fav-more
  display: none;
  color: $gray;
  flex: 0 0 50px;
  .fav
    margin-right: 10px;
  .is-fav
    color: $orange;
  &.is-fav svg
    fill: $orange;
.container:hover
  .duration
    display: none;
  .fav-more
    display: flex;
</style>
