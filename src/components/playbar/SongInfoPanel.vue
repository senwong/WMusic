<template>
<div class="song-info-panel">
  <div class="album-img">
    <img :src="albumImg + '?param=200y200'" alt="">
    <div class="img-mask">
      <button class="button button_icon button_center-center" @click="$emit('toggle-song-player')" :class="{'invert': !isShowSongPlayer}">
        <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="rgba(0, 0, 0, 0.7)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M2 5 H30 Z M2 25 L16 10 L30 25"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="name-songer">
    <div class="name">{{name}}</div>
    <div class="songer">{{artists && artists.map(ar => ar.name).join("/")}}</div>
  </div>
  <!-- 选择音质 -->
  <button class="quality button">
    {{currentQuality}}
  </button>
  <!-- 点击音质，弹出选择菜单 -->
  <popup-menu :target="qualityPopupButton">
    <select-list 
      :data="qualitys"
      @selected-change="selectedChange"
    ></select-list>
  </popup-menu>
  <!-- 收藏 -->
  <button
    class="button button_icon faver"
    @click="toggleFaver"
    >
    <svg :class="{'is-faver': isFaver}" class="i-heart" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z"></path>
    </svg>
  </button>
  <!-- 三点 更多选项 -->
  <button class="button button_icon button_icon more">
    <svg class="i-ellipsis-horizontal" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <circle cx="7" cy="16" r="2"></circle>
        <circle cx="16" cy="16" r="2"></circle>
        <circle cx="25" cy="16" r="2"></circle>
    </svg>
  </button>
  <!-- 点击更多，弹出菜单 -->
  <popup-menu :target="morePopupButton">
    <more-list>
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">漫游相似歌曲</span>
      </more-item>
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">下载</span>
      </more-item>
      <!-- 添加到歌单 hover时右侧扩展 -->
      <more-item spread="'right'">
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">添加到歌单</span>
        <!-- hover时右侧扩展内容 -->
        <more-list slot="spread-list">
          <more-item>
            <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
            </svg>
            <span slot="txt" class="txt">喜欢的音乐</span>
          </more-item>
        </more-list>
      </more-item>
      <!-- 评论分享 -->
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">评论分享</span>
      </more-item>
    </more-list>
  </popup-menu>
</div>
</template>
<script>
import PopupMenu from '../PopupMenu.vue';
import MoreItem from '../more-list/MoreItem.vue';
import MoreList from '../more-list/MoreList.vue';
import SelectList from '../more-list/SelectList.vue';

export default {
  name: "SongInfoPanel",
  components: {
    PopupMenu, MoreItem, MoreList, SelectList,
  },
  props: ['name', 'artists', 'albumImg', 'isShowSongPlayer'],
  data() {
    return {
      isFaver: false,
      morePopupButton: null,
      qualityPopupButton: null,
      currentQuality: "标准品质",
      qualitys: [
        {id: 1, title: "标准品质", isSelected: false},
        {id: 2, title: "高品质", isSelected: false},
        {id: 3, title: "无损品质", isSelected: false},
      ]
    }
  },
  methods: {
    toggleFaver() {
      this.isFaver = !this.isFaver;
    },
    selectedChange(id) {
      console.log("selected change: ", id);
      this.currentQuality = this.qualitys.find(q => q.id === id).title;
    }
  },
  mounted() {
    this.morePopupButton = this.$el.querySelector(".more");
    this.qualityPopupButton = this.$el.querySelector(".quality");
  },
}
</script>
<style lang="sass" scoped>
@import "../config.sass";
.song-info-panel
  display: flex;
  align-items: center;
  justify-content: flex-start;
.album-img
  width: min-content;
  height: 100%;
  position: relative;
  img
    width: auto;
    height: 100%;
  .img-mask
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $whitegray-2;
  &:hover .img-mask
    display: block;
.name-songer
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1em;
  .songer
    font-size: 0.8em;
    color: $gray;
    white-space: nowrap
  .songer:hover, .name:hover
    color: $orange;
  .name
    white-space: nowrap
.quality
    font-size: 0.8em;
    // width: 5em;
    color: $gray;
    border: 1px solid $gray;
    padding: 0px 2em 0px 3px;
    background-image: url("../../assets/chevron-down-gray.svg");
    background-position: right 3px center;
    background-repeat: no-repeat;
    background-size: 1em 1em;
    border-radius: 2px;
    margin-left: 1em;
    white-space: nowrap;
    cursor: pointer;
.faver, .more
  margin-left: 1em;
  font-size: 0;
.faver .is-faver
  color: $orange;
  fill: $orange;

.button
  background-color: transparent;
  &:focus, &:hover
    outline: none;
.button_icon
  border: none;
  font-size: inherit;
  width: 2em;
  height: 2em;
  padding: 0;
.button_center-center
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &.invert
    transform: translate(-50%, -50%) rotate(180deg);
    transform-origin: center;
</style>
