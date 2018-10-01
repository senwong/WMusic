<template>
<div>
  <ul class="tracks">
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
      :class="{'active': track.id === playList.currentSongId}"
    >
      <router-link :to="'/song/'+track.id" class="track__name">
        {{track.name}}
      </router-link>
      <span class="track__controll">
        <!-- 播放 -->
        <svg @click="play(track.id)" class="i-caret-right controll__item" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 26 L24 16 12 6 Z"></path>
          <circle cx="16" cy="16" r="15"/>
        </svg>
        <!-- 收藏 -->
        <svg class="i-heart controll__item" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z"></path>
        </svg>
        <!-- 更多 -->
        <svg :data-song-id="track.id" class="controll__more controll__item" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <circle cx="7" cy="16" r="2"></circle>
          <circle cx="16" cy="16" r="2"></circle>
          <circle cx="25" cy="16" r="2"></circle>
        </svg>
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
      <more-item @click.native="addToNext">
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">下一首播放</span>
      </more-item>
      <more-item >
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">添加到播放列表</span>
      </more-item>
      <hr class="fixed-hr">
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">收藏</span>
      </more-item>
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">下载</span>
      </more-item>
      <more-item>
        <svg slot="icon" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16"></path>
        </svg>
        <span slot="txt" class="txt">加入歌单</span>
      </more-item>
      <hr class="fixed-hr">
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
</div>
</template>
<script>
  import PopupMenu from '@/components/PopupMenu.vue';
  import MoreItem from '@/components/more-list/MoreItem.vue';
  import MoreList from '@/components/more-list/MoreList.vue';
  import { formatTime } from '@/utilitys';
  export default {
    name: "SongList",
    props: ["tracks", "id"],
    components: {PopupMenu, MoreItem, MoreList},
    data() {
      return {
        formatTime: formatTime,
        moreButton: null,
      }
    },
    methods: {
      play(songId) {
        this.$store.dispatch("newPlayList", {type: "PLAYLIST", id: this.id, songId: songId, isPlay: true})
        console.log("now play list " + this.id + " song id "+songId)
      },
      addToNext() {
        const songId = this.moreButton.dataset.songId
        console.log("下一首播放", songId)
        this.$store.dispatch("addToNext", songId)
      }
    },
    watch: {
      tracks(val) {
        this.$nextTick(function() {
          this.$el.querySelectorAll(".controll__more").forEach(el => {
            el.addEventListener("mousedown", () => {
              this.moreButton = el
            })
          })
        })
      },
      playList(val) {
        if (val !== this.$store.state.playList) {
          this.$store.commit("newPlayList", val)
        }
      }
    },
    mounted() {
      this.$el.addEventListener("scroll", e => {
        console.log("scroll ", e)
      })
    },
    computed: {
      playList() {
        return this.$store.state.playList
      }
    }
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
