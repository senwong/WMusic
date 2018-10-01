<template>
<div class="list-wrapper">
  <!-- 顶部标题 -->
  <div class="list__title">
    <span class="title__txt">播放列表</span>
    <span>
      <svg class="title__more" viewBox="0 0 32 32" width="25" height="25" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <circle cx="7" cy="16" r="2"></circle>
        <circle cx="16" cy="16" r="2"></circle>
        <circle cx="25" cy="16" r="2"></circle>
      </svg>
    </span>
  </div>
  <!-- 统计歌曲数量 -->
  <p class="list__count">共{{playList.songs ? playList.songs.length : 0}}首歌</p>
  <!-- 点击title-more弹出菜单 -->
  <popup-menu :target="listControlButton">
    <more-list>
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">清空列表</span>
      </more-item>
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">下载全部</span>
      </more-item>
    </more-list>
  </popup-menu>
  <ul class="play-list">
    <!-- 单个歌曲信息 -->
    <li class="song-item"
      v-for="song in playList.songs"
      :key="song.id"
      :class="{'active': song.id == playList.currentSongId, 'not-play': !song.canPlay}"
    >
      
    <!-- 靠左显示 -->
      <div class="album-img"><img :src="song.imgUrl" alt=""></div>
      <div class="name-songer">
        <div class="name">{{song.name}}</div>
        <div class="songer">{{song.artists.map(ar => ar.name).join("/")}}</div>
      </div>
      <!-- 靠右显示 -->
      <div class="length">
        {{formatTime(song.duration)}}
      </div>
      <!-- hover时才显示收藏和更多 -->
      <div class="fav-more">
        <!-- 收藏 -->
        <svg
          class="i-heart fav"
          :class="{'is-fav': song.isFav }"
          @click="toggleFav(song)"
          viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z"></path>
        </svg>
        <!-- 更多 -->
        <svg class="song-more" @click="currentSongId = song.id" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <circle cx="7" cy="16" r="2"></circle>
          <circle cx="16" cy="16" r="2"></circle>
          <circle cx="25" cy="16" r="2"></circle>
        </svg>
      </div>
    </li>
    <!-- 点击单个歌曲的song-more弹出菜单 -->
    <popup-menu :target="songControlButton">
      <more-list>
        <more-item @click.native="play">
          <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
          </svg>
          <span slot="txt" class="txt">播放</span>
        </more-item>
        <more-item>
          <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
          </svg>
          <span slot="txt" class="txt">漫游相似歌曲</span>
        </more-item>
        <more-item @click.native="download">
          <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
          </svg>
          <span slot="txt" class="txt">下载</span>
        </more-item>
        <more-item @click.native="playList.remove(currentSongId)">
          <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
          </svg>
          <span slot="txt" class="txt">从列表中删除</span>
        </more-item>
        <more-item spread="'left'">
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
        <more-item>
          <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
          </svg>
          <span slot="txt" class="txt">评论</span>
        </more-item>
        <more-item>
          <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
          </svg>
          <span slot="txt" class="txt">分享</span>
        </more-item>
      </more-list>
    </popup-menu>
  </ul>
  <!-- 加载中。。。动画 -->
  <loading v-if="isLoading"></loading>
</div>
</template>
<script>
import PopupMenu from './PopupMenu.vue';
import MoreItem from './more-list/MoreItem.vue';
import MoreList from './more-list/MoreList.vue';
import Loading from '@/components/Loading.vue';
import {formatTime} from '@/utilitys';

export default {
  name: "PlayList",
  components: {
    PopupMenu, MoreList, MoreItem, Loading
  },
  data() {
    return {
      listControlButton: null,
      songControlButton: null,
      formatTime: formatTime,
      currentSongId: null,
      isLoading: false,
    }
  },
  methods: {
    toggleFav(song) {
      song.isFav = !song.isFav;
      console.log("set song with id " + song + " fav");
    },
    handleSongMoreMouseenter(e) {
      this.songControlButton = e.target;
    },
    handleScroll(e) {
      console.log("scroll")
      this.songControlButton = null;
    },
    registerEvents() {
      this.listControlButton = this.$el.querySelector(".title__more");
      // 滚动时隐藏弹出菜单
      this.$el.querySelector(".play-list").addEventListener("scroll", this.handleScroll);
      this.$el.querySelectorAll(".song-more").forEach(el => {
        el.addEventListener('mousedown', this.handleSongMoreMouseenter);
      })
    },
    play() {
      this.playList.play(this.currentSongId);
      console.log("play")
    },
    download() {
      this.isLoading = true
      const song = this.playList.getSong(this.currentSongId)
      fetch(song.songUrl).then(res => res.blob().then(blob => {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = song.name + ".mp3";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false
      }))
    }
  },
  computed: {
    playList() {
      this.$nextTick(this.registerEvents)
      return this.$store.state.playList;
    }
  },
}
</script>
<style lang="sass" scoped>
@import "config.sass";
.list-wrapper
  background-color: white;
  display: flex;
  flex-direction: column;
.play-list
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0;
  margin-bottom: 0;
  margin-right: -15px;
// 顶部标题样式
.list__title
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  min-height: max-content;
  .title__txt
    font-size: 16px;
    color: $orange;
  .title__more
    color: $gray;    
// 歌曲总数样式
.list__count
  padding: 0 10px;
  font-size: 12px;
  color: $gray;
  // 单个歌曲样式
.song-item
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  &.active
    color: $orange;
  &.not-play
    color: $gray;
.song-item:nth-of-type(2n+1)
  background-color: $whitegray;
.song-item:not(.not-play):hover
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
.song-item:not(.not-play)
  .songer:hover,
    color: $orange;
.length
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
    fill: $orange;
.song-item:not(.not-play):hover
  .length
    display: none;
  .fav-more
    display: flex;

.txt
  font-size: 14px;
  line-height: 16px;
  height: 16px;
  // min-width: 150px;
  margin-left: 10px;
</style>
