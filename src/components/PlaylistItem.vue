<template>
  <div
    ref="container"
    class="container"
    :class="{ active: track.id == currentSongId }"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <!-- 靠左显示 -->
    <div class="album-img__wrapper">
      <ImageWithPlaceholder
        class="album-img"
        ratio="1:1"
        :alt="track.name"
        :src="track.album.picUrl | convert2Https | clipImage(80, 80)"
      />
      <PlayStatusBtn middle class="play-icon" :trackId="track.id" />
    </div>
    <div class="name-songer">
      <div class="name">{{ track.name }}</div>
      <div class="songer">
        <ArtistsWithComma :artists="track.artists" />
      </div>
    </div>
    <!-- 靠右显示 -->
    <div class="duration">{{ formatTime(track.duration) }}</div>
    <!-- hover时才显示收藏和更多 -->
    <div class="fav-more">
      <!-- 收藏  TODO  -->
      <SvgBtn middle class="fav" :class="{ 'is-fav': false }">
        <FavIcon />
      </SvgBtn>
      <!-- more button -->
      <BtnWithPopupMenu :canPopup="canPopupMenu">
        <template slot="btn">
          <SvgBtn middle>
            <MoreIcon />
          </SvgBtn>
        </template>
        <template slot="menu">
          <more-list class="more-popup-menu">
            <PlayTrack :track="track" />
            <more-item>
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">漫游相似歌曲</span>
            </more-item>
            <!-- 下载 -->
            <DownloadTrack :track="track" />
            <more-item @click.native="handleRemove">
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">从列表中删除</span>
            </more-item>
            <!-- 添加到歌单 -->
            <AddToUserPlaylist :track="track" />
            <!-- 评论 -->
            <CommentTrack :track="track" />
            <!-- 分享 -->
            <ShareTrack :track="track" />
          </more-list>
        </template>
      </BtnWithPopupMenu>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { Track } from "@/types";
import { getSongURL } from "@/service";
import { formatTime } from "@/utilitys";
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import MoreItem from "./more-list/MoreItem.vue";
import MoreList from "./more-list/MoreList.vue";
import DownloadIcon from "./SVGIcons/DownloadIcon.vue";
import DownloadTrack from "@/components/more-list/DownloadTrack.vue";
import CommentTrack from "@/components/more-list/CommentTrack.vue";
import ShareTrack from "@/components/more-list/ShareTrack.vue";
import AddToUserPlaylist from "@/components/more-list/AddToUserPlaylist.vue";
import PlayTrack from "@/components/more-list/PlayTrack.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";
import PlayStatusBtn from "@/components/globals/PlayStatusBtn.vue";

const notification = namespace("notification");
const playlist = namespace("playlist");
const currentUser = namespace("currentUser");
@Component({
  components: {
    FavIcon,
    MoreIcon,
    ArtistsWithComma,
    BtnWithPopupMenu,
    SvgBtn,
    MoreItem,
    MoreList,
    DownloadIcon,
    DownloadTrack,
    CommentTrack,
    ShareTrack,
    AddToUserPlaylist,
    PlayTrack,
    ImageWithPlaceholder,
    PlayStatusBtn
  }
})
export default class PlaylistItem extends Vue {
  canPopupMenu: boolean = false;
  @Prop() track!: Track;

  @playlist.State currentSongId!: number;
  @playlist.State tracks!: Track[];
  @playlist.Mutation setTracks!: (tracks: Track[]) => void;
  formatTime = formatTime;
  handleMouseLeave() {
    this.canPopupMenu = false;
  }
  handleMouseEnter() {
    this.canPopupMenu = true;
  }
  handleRemove() {
    this.setTracks(
      this.tracks.slice().filter((t: Track) => t.id !== this.track.id)
    );
  }
}
</script>
<style lang="sass" scoped>
@import "config.sass"
@import "@/style/theme.sass"

// 单个歌曲样式
.container
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 1.5em 0 1em
  &.active
    color: $primary-color
.container:nth-of-type(2n+1)
  @include themify($themes)
    background-color: themed('secondary-background-color')
.container:not(.not-play):hover
  @include themify($themes)
    background-color: themed('secondary-background-color-hover')
// 专辑封面
.album-img__wrapper
  flex: 0 0 40px
  height: 40px
  border-radius: 4px
  overflow: hidden
  position: relative
  .play-icon
    display: none
    position: absolute
    top: 0
    left: 0
    height: 100%
    width: 100%
.container:not(.active):hover
  .play-icon
    display: flex
.container.active
  .play-icon
    display: flex

.name-songer
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: center
  padding: 10px
  max-width: 100%
  overflow: hidden
  .name
    font-size: 14px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .songer
    font-size: 12px
    color: $gray
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
.container
  .songer:hover,
    color: $primary-color
.duration
  flex: 0 0 auto
  font-size: 12px


// hover时显示更多和收藏
.fav-more
  display: none
  flex: 0 0 50px
  .fav
    margin-right: 10px
  .is-fav
    color: $primary-color
  &.is-fav svg
    fill: $primary-color
.container:hover
  .duration
    display: none
  .fav-more
    display: flex
</style>
