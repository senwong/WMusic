<template>
<div class="list-wrapper">
  <!-- 顶部标题 -->
  <div class="list__title">
    <span class="title__txt">播放列表</span>
    <button class="button_icon large title__more" ref="titleMore" >
      <MoreIcon />
    </button>
  </div>
  <!-- 统计歌曲数量 -->
  <p class="list__count">共{{tracks ? tracks.length : 0}}首歌</p>
  <!-- 点击title-more弹出菜单 -->
  <popup-menu :target="listControlButton">
    <more-list>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">清空列表</span>
      </more-item>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">下载全部</span>
      </more-item>
    </more-list>
  </popup-menu>
  <ul class="play-list scrollbar-invisible">
    <!-- 单个歌曲信息 -->
    <PlaylistItem
      v-for="track in tracks"
      :key="track.id"
      :track="track"
      :currentSongId="currentSongId"
      @handleMoreClick="handleMoreClick"
    />
    <!-- 点击单个歌曲的song-more弹出菜单 -->
    <popup-menu :target="songControlButton">
      <more-list>
        <more-item @click.native="handlePlay">
          <DownloadIcon slot="icon" />
          <span slot="txt" class="txt">播放</span>
        </more-item>
        <more-item>
          <DownloadIcon slot="icon" />
          <span slot="txt" class="txt">漫游相似歌曲</span>
        </more-item>
        <more-item @click.native="handleDownload">
          <DownloadIcon slot="icon" />
          <span slot="txt" class="txt">下载</span>
        </more-item>
        <more-item @click.native="handleRmove">
          <DownloadIcon slot="icon" />
          <span slot="txt" class="txt">从列表中删除</span>
        </more-item>
        <more-item spread="'left'">
          <DownloadIcon slot="icon" />
          <span slot="txt" class="txt">添加到歌单</span>
          <!-- hover时右侧扩展内容 -->
          <more-list slot="spread-list">
            <more-item>
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">喜欢的音乐</span>
            </more-item>
          </more-list>
        </more-item>
        <more-item>
          <DownloadIcon slot="icon" />
          <span slot="txt" class="txt">评论</span>
        </more-item>
        <more-item>
          <DownloadIcon slot="icon" />
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
import { mapState, mapMutations } from 'vuex';
import { getSongURL } from '@/service';
import PlaylistItem from './PlaylistItem';
import MoreIcon from './SVGIcons/MoreIcon';
import DownloadIcon from './SVGIcons/DownloadIcon';

export default {
  name: "PlayList",
  components: {
    PopupMenu, MoreList, MoreItem, Loading, PlaylistItem, MoreIcon, DownloadIcon,
  },
  data() {
    return {
      listControlButton: null,
      songControlButton: null,
      isLoading: false,
      popMenuSongId: null,
    };
  },
  methods: {
    toggleFav() {
      // TODO
    },
    handleSongMoreMouseenter(e) {
      this.songControlButton = e.target;
    },
    handleScroll(e) {
      this.songControlButton = null;
    },
    registerEvents() {
      this.listControlButton = this.$refs.titleMore;
      // 滚动时隐藏弹出菜单
      this.$el.querySelector(".play-list").addEventListener("scroll", this.handleScroll);
      this.$el.querySelectorAll(".song-more").forEach(el => {
        el.addEventListener('mousedown', this.handleSongMoreMouseenter);
      })
    },
    unRegisterEvents() {
      this.listControlButton = null;
      // 滚动时隐藏弹出菜单
      this.$el.querySelector(".play-list").removeEventListener("scroll", this.handleScroll);
      this.$el.querySelectorAll(".song-more").forEach(el => {
        el.removeEventListener('mousedown', this.handleSongMoreMouseenter);
      })
    },
    handlePlay() {
      if (!this.popMenuSongId) return;
      this.setCurrentSongId(this.popMenuSongId);
    },
    handleRemove() {
      // TODO
    },
    downloadSong(url) {
      fetch(song.songUrl).then(res => res.blob().then(blob => {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = song.name + ".mp3";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false
      }));
    },
    handleDownload() {
      // TODO
      if (!this.popMenuSongId) return;
      this.isLoading = true
      getSongURL(this.popMenuSongId).then(
        res => {
          const songUrl = res.data.data[0].url;
          downloadSong(songUrl);
        },
        error => alert(' get song url error ' + error)
      );
    },
    handleMoreClick(id) {
      this.popMenuSongId = id;
    },
    ...mapMutations('playlist', [
      'setCurrentSongId'
    ])
  },
  computed: {
    ...mapState('playlist', [
      'tracks',
      'currentSongId',
    ])
  },
  mounted() {
    this.registerEvents();
  },
  beforeDestroy() {
    this.unRegisterEvents();
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
  padding: 15px 0px;
  margin-bottom: 0;
  // margin-right: -15px;
  overscroll-behavior: contain;
// 顶部标题样式
.list__title
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 1.3em;;
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
  &.is-fav svg
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
