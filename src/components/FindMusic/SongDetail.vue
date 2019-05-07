<template>
  <div class="main-wrapper">
    <!-- 歌曲信息 -->
    <div class="song-info">
      <div class="album-img" v-if="album">
        <img :src="album.picUrl | convert2Https | clipImage(400, 400)" :alt="name" />
      </div>
      <div class="song-desc">
        <div class="song-name">{{ name }}</div>
        <div>
          艺人：
          <router-link
            v-for="artist in artists.filter(ar => ar.id !== 0)"
            :key="artist.id"
            :to="'/artist/' + artist.id"
            >{{ artist.name }}</router-link
          >
        </div>
        <div v-if="album">
          专辑：
          <router-link :to="'/album/' + album.id">{{ album.name }}</router-link>
        </div>
        <div class="controls">
          <RippleButton @click.native="play">播放</RippleButton>
          <RippleButton class="button-secondary">收藏</RippleButton>
          <RippleButton class="button-secondary">歌词</RippleButton>
          <RippleButton class="button-secondary">more</RippleButton>
        </div>
      </div>
    </div>
    <!-- 歌曲评论和标签-->
    <div class="comment__tag">
      <!-- 歌曲评论 -->
      <CommentList class="comments" :type="currentCommentType" :id="Number(songId)" />
      <!-- 标签 -->
      <div class="tags">
        <h1>相似歌曲</h1>
        <ul>
          <li v-for="song in simiSongs" :key="song.id" class="simi-item">
            <div class="img-container">
              <img
                :src="song.album.picUrl | convert2Https | clipImage(100, 100)"
                :alt="song.album.name"
              />
              <div class="mask-container">
                <div class="mask"></div>
                <div class="play" @click="play(song.id)"><play-svg></play-svg></div>
              </div>
            </div>
            <div class="info-container">
              <router-link class="name" :to="'/song/' + song.id">{{ song.name }}</router-link>
              <router-link
                class="artists"
                :to="'/artist/' + song.id"
                v-for="ar in song.artists"
                :key="ar.id"
                >{{ ar.name }}</router-link
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getSongDetail, getSimiSongs } from "@/service";
import CommentList from "./CommentList.vue";
import RippleButton from "@/components/globals/RippleButton.vue";
import PlaySvg from "@/components/globals/PlaySvg.vue";
import { Vue, Component } from "vue-property-decorator";
import { Artist, Album, Track, TrackQuality, CommentType, convertTrack } from "@/types";
import { Mutation, namespace } from "vuex-class";

const playlist = namespace("playlist");

const OFEESETCOUNT = 20;
@Component({
  components: { CommentList, RippleButton, PlaySvg }
})
export default class SongDetail extends Vue {
  currentCommentType: CommentType = CommentType.SongComment;

  songId: number | null = null;

  name: string = "";

  artists: Artist[] = [];

  simiSongs: Track[] = [];

  duration: number = 0;

  high?: TrackQuality;

  middle?: TrackQuality;

  low: TrackQuality | null = null;

  album: Album | null = null;

  status: number = 0;

  created() {
    this.songId = Number(this.$route.params.id);
    // 获取歌曲信息
    getSongDetail(this.songId).then(
      res => {
        const song = res.data.songs[0];
        if (song) {
          this.name = song.name;
          this.artists = song.ar;
          this.album = song.al;
          this.duration = song.dt;
          this.high = song.h;
          this.middle = song.m;
          this.low = song.low;
          this.status = song.st;
        }
      },
      error => {}
    );
    // 获取相似歌曲
    getSimiSongs(this.songId).then(res => {
      this.simiSongs = res.data.songs;
    });
  }

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  play() {
    if (this.songId && this.album && this.low) {
      this.setCurrentSongId(this.songId);
      this.setTracks([
        {
          name: this.name,
          id: this.songId,
          artists: this.artists,
          album: this.album,
          duration: this.duration,
          high: this.high,
          middle: this.middle,
          low: this.low,
          status: this.status
        }
      ]);
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
@import "@/style/colors.sass"

.song-info
  display: flex
.album-img
  height: 200px
  flex: 0 0 200px
  font-size: 0
  margin-right: 20px
  background: $secondary
  border-radius: 15px
  overflow: hidden
  img
    width: 100%
    height: 100%

.song-desc
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: space-between
.song-name
  font-size: 2em
  margin: 1em 0

.button-secondary
  color: $secondary
  border-color: $secondary

.comment__tag
  display: flex
.comments
  flex: 1 1 auto
  margin: 20px 20px 0 0
.tags
  flex: 0 0 234px
  min-width: 0
// 加载提示样式
.loading-tips
  text-align: center
.loading-tip
  display: inline-block
  padding: 0 1em
  border-radius: 1em
  text-align: center
  border: 1px solid $orange
  color: $orange
  font-size: 14px
  font-weight: bolder
  margin: 1em auto

.controls > *:not(:last-child)
  margin-right: 2em
// 相似歌曲
.simi-item
  box-sizing: border-box
  padding: 0.5em
  display: flex
  border-radius: 2px
  min-width: 0
  &:hover
    background-color: $Alabaster
    & .mask-container
      display: block
  .img-container
    font-size: 0
    flex: 0 0 40px
    height: 40px
    background-color: $secondary
    position: relative
    margin-right: 8px
    border-radius: 2px
    overflow: hidden
    img
      width: 100%
      height: 100%

  .mask-container
    display: none
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
  .mask
    width: 100%
    height: 100%
    background-color: $black
    opacity: $mask-opacity
  .play
    position: absolute
    top: 0
    left: 0
    width: 55%
    height: 55%
    padding: 7px
    box-sizing: border-box
    background-color: $primary
    border-radius: 50%
    opacity: 1
    margin: 22.5% 0 0 22.5%

  .info-container
    display: flex
    flex-direction: column
    justify-content: space-between
    &, & .name, & .artists
      min-width: 0
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .name
      font-size: 100%
      font-weight: bolder
    .artists
      font-size: 80%
      color: $secondary
</style>
