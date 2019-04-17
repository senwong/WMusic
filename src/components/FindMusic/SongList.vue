<template>
<div>
  <ul class="tracks" @scroll="handleScroll">
    <li class="head">
      <span>歌曲名</span>
      <span></span>
      <span>歌手</span>
      <span>专辑</span>
      <span>时长</span>
    </li>
    <li class="track"
      v-for="track in tracks"
      :key="track.id"
      :class="{'active': track.id == currentSongId}"
    >
      <router-link :to="'/song/'+track.id" class="track__name">
        {{track.name}}
      </router-link>
      <span class="track__controll">
        <!-- 播放 -->
        <button class="button_icon large controll__item" @click="handlePlay(track.id)">
          <PlayIcon />
        </button>
        <!-- 收藏 -->
        <button class="button_icon large controll__item">
          <FavIcon />
        </button>
        <!-- 更多 -->
        <button class="button_icon large controll__item" @mousedown="handleMoreMousedown(track.id, $event)" :data-song-id="track.id">
          <MoreIcon />
        </button>
      </span>
      <span class="track__creators">
        <router-link
          v-for="ar in track.ar"
          :key="ar.id"
          :to="'/artist/' + ar.id"
          >{{ar.name}} &nbsp;</router-link>
      </span>
      <router-link :to="'/album/'+track.al.id"  class="track__al__name">
        {{track.al.name}}
      </router-link>
      <span class="track_dt">{{formatTime(track.dt)}}</span>
    </li>
  </ul>
  <popup-menu :target="moreButton">
    <more-list>
      <more-item @click.native="handleAddToNext">
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">下一首播放</span>
      </more-item>
      <more-item >
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">添加到播放列表</span>
      </more-item>
      <hr class="fixed-hr">
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">收藏</span>
      </more-item>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">下载</span>
      </more-item>
      <more-item>
        <DownloadIcon slot="icon" />
        <span slot="txt" class="txt">加入歌单</span>
      </more-item>
      <hr class="fixed-hr">
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
</div>
</template>
<script>
import PopupMenu from '@/components/PopupMenu.vue';
import MoreItem from '@/components/more-list/MoreItem.vue';
import MoreList from '@/components/more-list/MoreList.vue';
import { formatTime } from '@/utilitys';
import { mapState, mapGetters, mapMutations, } from 'vuex';
import PlayIcon from '../SVGIcons/PlayIcon';
import FavIcon from '../SVGIcons/FavIcon';
import MoreIcon from '../SVGIcons/MoreIcon';
import DownloadIcon from '../SVGIcons/DownloadIcon';

export default {
  name: "SongList",
  props: ["tracks"],
  components: {
    PopupMenu, MoreItem, MoreList, PlayIcon, FavIcon, MoreIcon, DownloadIcon,
  },
  data() {
    return {
      moreButton: null,
      selectedTrackId: null,
    }
  },
  methods: {
    formatTime,
    // play specify song
    handlePlay(trackId) {
      if (this.tracks.every((track, idx) => track.id == this.trackIds[idx])) {
        if (this.trackId != this.currentSongId) {
          this.setCurrentSongId(trackId);  
        }
      } else {
        this.setTracks(this.tracks);
      }
    },
    handleAddToNext() {
      if (typeof this.selectedTrackId == 'undefined') return;
      const track = this.tracks.find(t => t.id == this.selectedTrackId);
      this.addToNext(track);

    },
    ...mapMutations('playlist', [
      'setCurrentSongId',
      'setTracks',
      'addToNext',
    ]),
    handleMoreMousedown(trackId, { target }) {
      this.moreButton = target;
      this.selectedTrackId = trackId;
    },
    handleScroll() {
      this.moreButton = null;
    }
  },
  computed: {
    ...mapState('playlist', [
      'currentSongId'
    ]),
    ...mapGetters('playlist', [
      'trackIds'
    ])
  },
}
</script>
<style lang="sass" scoped>
@import '../config.sass';
.tracks
  padding: 0;
.head
  color: $gray;
  display: grid;
  grid-template-columns: 1fr minmax(120px, 0.5fr) 1fr 1fr minmax(auto, 0.5fr);
  grid-column-gap: 10px;
  font-size: 14px;
.track
  display: grid;
  padding: 8px;
  grid-template-columns: 1fr minmax(120px, 0.5fr) 1fr 1fr minmax(auto, 0.5fr);
  grid-column-gap: 10px;
  &:nth-of-type(2n)
    background-color: $whitegray2;
  &:hover
    background-color: $whitegray3;
  &:hover .track__controll
    visibility: visible;
  &.active
    color: $orange;
a
  text-decoration: none;
  color: inherit;
  &:hover
    text-decoration: underline;
.track__name, .track__controll, .track__creators, .track__al__name, .track_dt
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;

.track__controll
  visibility: hidden;
  color: $gray;
  display: flex;
  align-items: center;
  svg
    height: 100%;
    width: auto;
.control__play
  font-size: 0;
  display: inline-block;
.controll__item
  margin-right: 10px;
  cursor: pointer;

.txt
  font-size: 14px;
  line-height: 16px;
  height: 16px;
  // min-width: 150px;
  margin-left: 10px;
.fixed-hr
  margin-left: 0;
  margin-right: 0;
  border: 1px solid $gray;
  opacity: 0.7;
</style>
