<template>
  <div class="song-detail">
    <!-- 歌曲信息 -->
    <div class="song-detail__info">
      <ImageWithPlaceholder
        class="song-detail__info__cover"
        v-if="album"
        :src="album.picUrl | convert2Https | clipImage(400, 400)"
        :alt="name"
        ratio="1:1"
      />
      <div class="song-detail__info__desc">
        <h3>{{ name }}</h3>
        <div>
          艺人：
          <ArtistsWithComma :artists="artists.filter(ar => ar.id !== 0)" />
        </div>
        <div v-if="album">
          专辑：
          <router-link :to="'/album/' + album.id">{{ album.name }}</router-link>
        </div>
        <div class="song-detail__info__controls">
          <RippleButton @click.native="play">播放</RippleButton>
          <RippleButton>收藏</RippleButton>
          <RippleButton>歌词</RippleButton>
          <RippleButton>more</RippleButton>
        </div>
      </div>
    </div>
    <!-- 歌曲评论和标签-->
    <div class="song-detail__content">
      <!-- 歌曲评论 -->
      <CommentList
        class="song-detail__content__main"
        :type="currentCommentType"
        :id="Number(songId)"
      />
      <!-- 标签 -->
      <div class="song-detail__content__aside">
        <h3>相似歌曲</h3>
        <ul>
          <li
            v-for="song in simiSongs"
            :key="song.id"
            class="song-detail__simi-item"
          >
            <CardImage
              class="song-detail__simi-item__cover"
              :play="{ onClick: () => play }"
              :href="'#'"
              :src="song.album.picUrl | convert2Https | clipImage(100, 100)"
              :alt="song.album.name"
              ratio="1:1"
              radius
            />
            <div class="song-detail__simi-item__info">
              <router-link
                class="song-detail__simi-item__info__name ellipsis"
                :to="'/song/' + song.id"
                >{{ song.name }}</router-link
              >
              <div>
                <ArtistsWithComma
                  v-if="song.artists"
                  :artists="song.artists"
                  aTagClass="song-detail__simi-item__info__artist"
                />
              </div>
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
import { Vue, Component } from "vue-property-decorator";
import {
  Artist,
  Album,
  Track,
  TrackQuality,
  CommentType,
  convertTrack
} from "@/types";
import { Mutation, namespace } from "vuex-class";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma";
import CardImage from "@/components/globals/CardImage.vue";

const playlist = namespace("playlist");
const notification = namespace("notification");
const OFEESETCOUNT = 20;
@Component({
  components: {
    CommentList,
    RippleButton,
    ImageWithPlaceholder,
    ArtistsWithComma,
    CardImage
  }
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
  @notification.Mutation setMsg!: (msg: string) => void;
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
      error => {
        this.setMsg(`获取歌曲信息错误${error && error.msg ? error.msg : ""}！`);
      }
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
@import "@/style/colors.sass"
@import "@/style/theme.sass"
$break-middle: 1000px

.song-detail
  padding: 1em
  &__info
    display: flex
    &__cover
      flex: 0 0 12.5em
      margin-right: 1em
      border-radius: 1em
      overflow: hidden
    &__desc
      flex: 1 1 auto
      display: flex
      flex-direction: column
      justify-content: space-between
    &__controls > *:not(:last-child)
      margin-right: 2em

  &__content
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    margin-top: 1em
    @media screen and (max-width: $break-middle)
      flex-direction: column-reverse
      align-items: stretch
    &__main
      flex: 1 1 auto
      margin-right: 1em
      @media screen and (max-width: $break-middle)
        margin-right: 0
    &__aside
      flex: 0 0 300px
      @media screen and (max-width: $break-middle)
        flex: 0 0 auto

  &__simi-item
    box-sizing: border-box
    padding: 0.5em
    display: flex
    flex-direction: row
    align-items: flex-start
    justify-content: flex-start
    border-radius: 0.4em
    min-width: 0
    transition: all .25s
    &:hover
      @include themify($themes)
        background-color: themed("background-color-hover")
      & .mask-container
        display: block
    &__cover
      flex: 0 0 3em
      margin-right: 1em
    &__info
      min-width: 0
      &__name
        width: 100%
        display: block
        font-weight: bolder
      &__artist
        font-size: 0.875em
        @include themify($themes)
          color: themed("secondary-text-color")

// 加载提示样式
.loading-tips
  text-align: center
.loading-tip
  display: inline-block
  padding: 0 1em
  border-radius: 1em
  text-align: center
  border: 1px solid $primary-color
  color: $primary-color
  font-size: 14px
  font-weight: bolder
  margin: 1em auto
</style>
