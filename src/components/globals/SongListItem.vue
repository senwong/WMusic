<template>
  <li
    class="track"
    :class="{
      active: track.id == currentSongId,
      disabled: track.status < 0
    }"
    @mouseenter="handleMouseEnter()"
    @mouseleave="handleMouseLeave()"
  >
    <div class="track-icon" @click="handlePlay">
      <SvgBtnWrapper middle class="music-icon">
        <MusicIcon />
      </SvgBtnWrapper>
      <PlayStatusBtn middle class="play-icon" :trackId="track.id" />
    </div>
    <div class="track-names">
      <div class="track-name-mvlink">
        <router-link :to="`/song/${track.id}`" class="track-name">{{ track.name }}</router-link>
        <router-link v-if="track.mv" :to="'/mvplay/' + track.mv" class="track-mvlink">
          <MvIcon />
        </router-link>
      </div>
      <div class="track-ar-al">
        <ArtistsWithComma
          :artists="track.artists"
          aTagClass="track-artist"
          commaClass="track__artist__comma"
        />
        <span class="track-dot">•</span>
        <router-link :to="'/album/' + track.album.id" class="track-album">
          {{ track.album.name }}
        </router-link>
      </div>
    </div>
    <BtnWithPopupMenu class="track-more" :canPopup="canPopup">
      <template slot="btn">
        <SvgBtnWrapper middle>
          <MoreIcon />
        </SvgBtnWrapper>
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
import PlayIcon from "@/components/SVGIcons/PlayIcon.vue";
import PausedIcon from "@/components/SVGIcons/PausedIcon.vue";
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MusicIcon from "@/components/SVGIcons/MusicIcon.vue";
import MvIcon from "@/components/SVGIcons/MvIcon.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import PlayStatusBtn from "@/components/globals/PlayStatusBtn.vue";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";
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
    PausedIcon,
    FavIcon,
    MoreIcon,
    DownloadIcon,
    MusicIcon,
    MvIcon,
    ArtistsWithComma,
    PlayStatusBtn,
    SvgBtnWrapper,
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
@import '../../style/colors.sass'
.tracks
  padding: 20px 0 0
.head
  color: $gray
  display: grid
  grid-template-columns: 1fr minmax(120px, 0.5fr) 1fr 1fr minmax(auto, 0.5fr)
  grid-column-gap: 10px
  font-size: 14px
.track
  display: flex
  flex-direction: row
  padding: 0.7em
  transition-property: background
  transition-duration: 250ms
  &.active
    color: $primary
    .play-icon
      display: block
    .music-icon
      display: none
  &.disabled
    color: #999
  &:not(.active):hover
    background-color: rgba(0,0,0,.1)
    .track-more
      opacity: 1
    .music-icon
      display: none
    .play-icon
      display: block

.track-icon
  flex: 0 0 auto
  cursor: pointer
  .play-icon
    display: none
.track-names
  margin-left: 1em
  flex: 1 1 auto

// track name and mv icon
.track-name-mvlink
  display: flex
  flex-direction: row
  align-items: center
.track-name
  line-height: 22px
  user-select: none
.track-mvlink
  margin-left: 0.5em
  width: 1.2em
  height: 1.2em
  color: #666
  transition-property: color
  transition-duration: 250ms
  &:hover
    color: $primary
// artists and album
.track-ar-al
  margin-top: 0.5em
.track-artist
  opacity: 0.6
  transition-property: opacity border
  transition-duration: 250ms
  line-height: 20px
  border-bottom: 1px solid rgba(0,0,0,0)
  user-select: none
  &:hover
    opacity: 1
    border-color: rgba(0,0,0,0.8)

.track__artist__comma
  opacity: 0.6
  padding: 0 0.25em
.track-dot
  opacity: 0.6
  padding: 0 0.5em
.track-album
  opacity: 0.6
  transition-property: opacity border
  transition-duration: 250ms
  line-height: 20px
  border-bottom: 1px solid rgba(0,0,0,0)
  user-select: none
  &:hover
    opacity: 1
    border-color: rgba(0,0,0,0.8)
// if currentSongId == track.id, artist and album border-bottom color $primary
.track.active
  .track-artist:hover
    border-color: $primary
  .track-album:hover
    border-color: $primary

.track-more
  flex: 0 0 3em
  height: 1em
  opacity: 0
  cursor: pointer
.track-duration
  flex: 0 0 0
  width: 4em

a
  text-decoration: none
  color: inherit

.track__name, .track__controll, .track__creators, .track__al__name, .track_dt
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  text-decoration: none
  color: inherit
  display: flex
  flex-direction: row
  align-items: center

.track__controll
  visibility: hidden
  color: $gray
  display: flex
  align-items: center
  svg
    height: 100%
    width: auto
.control__play
  font-size: 0
  display: inline-block
.controll__item
  margin-right: 10px
  cursor: pointer

.txt
  font-size: 14px
  line-height: 16px
  height: 16px
  // min-width: 150px
  margin-left: 10px
.fixed-hr
  margin-left: 0
  margin-right: 0
  border: 1px solid $gray
  opacity: 0.7
.track__more__menu
  color: #333
</style>
