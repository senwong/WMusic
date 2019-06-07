<template>
  <li
    class="song-list-item"
    :class="{
      'song-list-item--active': track.id == currentSongId,
      'song-list-item--disabled': track.status < 0
    }"
    @mouseenter="handleMouseEnter()"
    @mouseleave="handleMouseLeave()"
  >
    <div class="song-list-item__icon" @click="handlePlay">
      <SvgBtn middle class="song-list-item__icon__music">
        <MusicIcon />
      </SvgBtn>
      <PlayStatusBtn
        middle
        class="song-list-item__icon__play"
        :trackId="track.id"
      />
    </div>
    <div class="song-list-item__info">
      <div>
        <router-link
          :to="`/song/${track.id}`"
          class="song-list-item__info__name"
          >{{ track.name }}</router-link
        >
        <router-link
          v-if="track.mvId"
          :to="'/mvplay/' + track.mvId"
          class="song-list-item__info__mv"
        >
          <MvIcon />
        </router-link>
      </div>
      <div class="song-list-item__info__bot">
        <ArtistsWithComma
          :artists="track.artists"
          aTagClass="song-list-item__info__artist"
          commaClass="song-list-item__info__comma"
        />
        <span class="song-list-item__info__dot">•</span>
        <router-link
          :to="'/album/' + track.album.id"
          class="song-list-item__info__album"
        >
          {{ track.album.name }}
        </router-link>
      </div>
    </div>
    <BtnWithPopupMenu class="song-list-item__more" :canPopup="canPopup">
      <template slot="btn">
        <SvgBtn middle>
          <MoreIcon />
        </SvgBtn>
      </template>
      <template slot="menu">
        <more-list class="track__more__menu">
          <!-- 下一首播放 -->
          <AddToNext :track="track" />
          <!-- 添加到播放列表 -->
          <AddToCurPlaylist :track="track" />
          <hr class="fixed-hr" />
          <!-- 收藏 -->
          <FavTrack />
          <!-- 下载 -->
          <DownloadTrack :track="track" />
          <!-- 添加到歌单 -->
          <AddToUserPlaylist :track="track" />
          <hr class="fixed-hr" />
          <!-- 评论 -->
          <CommentTrack :track="track" />
          <!-- 分享 -->
          <ShareTrack :track="track" />
        </more-list>
      </template>
    </BtnWithPopupMenu>
    <div class="track-duration">{{ formatTime(track.duration) }}</div>
  </li>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, namespace, State, Getter } from "vuex-class";
import { Track, Artist } from "@/types";
import { getSongURL } from "@/service";
import { formatTime } from "@/utilitys";
import MoreItem from "@/components/more-list/MoreItem.vue";
import MoreList from "@/components/more-list/MoreList.vue";
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MusicIcon from "@/components/SVGIcons/MusicIcon.vue";
import MvIcon from "@/components/SVGIcons/MvIcon.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import PlayStatusBtn from "@/components/globals/PlayStatusBtn.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import DownloadTrack from "@/components/more-list/DownloadTrack.vue";
import CommentTrack from "@/components/more-list/CommentTrack.vue";
import ShareTrack from "@/components/more-list/ShareTrack.vue";
import AddToUserPlaylist from "@/components/more-list/AddToUserPlaylist.vue";
import FavTrack from "@/components/more-list/FavTrack.vue";
import AddToCurPlaylist from "@/components/more-list/AddToCurPlaylist.vue";
import AddToNext from "@/components/more-list/AddToNext.vue";

const playlist = namespace("playlist");
const playbar = namespace("playbar");
const notification = namespace("notification");
@Component({
  components: {
    MoreItem,
    MoreList,
    FavIcon,
    MoreIcon,
    DownloadIcon,
    MusicIcon,
    MvIcon,
    ArtistsWithComma,
    PlayStatusBtn,
    SvgBtn,
    BtnWithPopupMenu,
    DownloadTrack,
    CommentTrack,
    ShareTrack,
    AddToUserPlaylist,
    FavTrack,
    AddToCurPlaylist,
    AddToNext
  }
})
export default class SongListItem extends Vue {
  @Prop() track!: Track;

  selectedTrackId: number | null = null;
  canPopup: boolean = false;
  isLoading: boolean = false;
  formatTime = formatTime;

  @playlist.State currentSongId!: number;

  @playlist.Getter trackIds!: number[];

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation addToNext!: (track: Track) => void;

  @playbar.Mutation togglePlay!: () => void;
  @notification.Mutation setMsg!: (msg: string) => void;
  // play specify song
  handlePlay(trackId: number) {
    this.$emit("play", this.track.id);
  }
  handleMouseEnter() {
    this.canPopup = true;
  }
  handleMouseLeave() {
    this.canPopup = false;
  }
}
</script>
<style lang="sass" scoped>
@import '../config.sass'
@import '@/style/colors.sass'
@import "@/style/theme.sass"

.song-list-item
  display: flex
  flex-direction: row
  padding: 0.7em
  transition-property: background
  transition-duration: 250ms
  &--active
    color: $primary-color
    .song-list-item__icon__play
      display: block
    .song-list-item__icon__music
      display: none
  &--disabled
    color: #999
  &:not(&--active):hover
    @include themify($themes)
      background-color: themed("background-color-hover")
    .track-more
      opacity: 1
    .song-list-item__icon__music
      display: none
    .song-list-item__icon__play
      display: block

  &__icon
    flex: 0 0 auto
    cursor: pointer
    &__play
      display: none
  &__info
    margin-left: 1em
    flex: 1 1 auto
    &__name
      line-height: 22px
      user-select: none
      display: inline-block
      vertical-align: middle
    &__mv
      display: inline-block
      vertical-align: middle
      margin-left: 0.5em
      width: 1.2em
      height: 1.2em
      color: #666
      transition-property: color
      transition-duration: 250ms
      &:hover
        color: $primary-color
    &__bot
      margin-top: 0.5em
    &__artist
      opacity: 0.6
      transition-property: opacity border
      transition-duration: 250ms
      line-height: 20px
      border-bottom: 1px solid rgba(0,0,0,0)
      user-select: none
      &:hover
        opacity: 1
        @include themify($themes)
          border-color: themed("text-color")
    &__comma
      opacity: 0.6
      padding: 0 0.25em
    &__dot
      opacity: 0.6
      padding: 0 0.5em
    &__album
      opacity: 0.6
      transition-property: opacity border
      transition-duration: 250ms
      line-height: 20px
      border-bottom: 1px solid rgba(0,0,0,0)
      user-select: none
      &:hover
        opacity: 1
        @include themify($themes)
          border-color: themed("text-color")
  &__more
    flex: 0 0 3em
    height: 1em
    opacity: 0
    cursor: pointer
  &__duration
    flex: 0 0 0
    width: 4em
// if currentSongId == track.id, artist and album border-bottom color $primary-color
.song-list-item--active
  .song-list-item__info__artist:hover
    border-color: $primary-color
  .song-list-item__info__album:hover
    border-color: $primary-color

.fixed-hr
  margin-left: 0
  margin-right: 0
  border: 1px solid $gray
  opacity: 0.7
.track__more__menu
  color: #333
</style>
