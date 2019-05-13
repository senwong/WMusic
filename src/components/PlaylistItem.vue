<template>
  <div
    ref="container"
    class="container"
    :class="{ active: track.id == currentSongId }"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <!-- 靠左显示 -->
    <div class="album-img">
      <img :src="track.album.picUrl | convert2Https | clipImage(80, 80)" :alt="track.name" />
    </div>
    <div class="name-songer">
      <div class="name">{{ track.name }}</div>
      <div class="songer">
        <ArtistsWithComma :artists="track.artists" aTagClass commaClass />
      </div>
    </div>
    <!-- 靠右显示 -->
    <div class="duration">{{ formatTime(track.duration) }}</div>
    <!-- hover时才显示收藏和更多 -->
    <div class="fav-more">
      <!-- 收藏  TODO  -->
      <SvgBtnWrapper middle class="fav" :class="{ 'is-fav': false }">
        <FavIcon />
      </SvgBtnWrapper>
      <!-- more button -->
      <BtnWithPopupMenu :canPopup="canPopupMenu">
        <template slot="btn">
          <SvgBtnWrapper middle>
            <MoreIcon />
          </SvgBtnWrapper>
        </template>
        <template slot="menu">
          <more-list class="more-popup-menu">
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
            <more-item @click.native="handleRemove">
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">从列表中删除</span>
            </more-item>
            <more-item spread="left">
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">添加到歌单</span>
              <!-- hover时右侧扩展内容 -->
              <more-list slot="spread-list">
                <more-item
                  v-for="p in userPlaylists"
                  :key="p.id"
                  @click.native="addToPlaylist(p.id)"
                >
                  <DownloadIcon slot="icon" />
                  <span slot="txt" class="txt">{{ p.name }}</span>
                </more-item>
              </more-list>
            </more-item>
            <more-item @click.native="handleComment">
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">评论</span>
            </more-item>
            <more-item>
              <DownloadIcon slot="icon" />
              <span slot="txt" class="txt">分享</span>
            </more-item>
          </more-list>
        </template>
      </BtnWithPopupMenu>
    </div>
  </div>
</template>
<script lang="ts">
import { formatTime } from "@/utilitys";
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track, Artist, Playlist } from "@/types";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";
import MoreItem from "./more-list/MoreItem.vue";
import MoreList from "./more-list/MoreList.vue";
import DownloadIcon from "./SVGIcons/DownloadIcon.vue";
import { State, namespace } from "vuex-class";
import { getSongURL, getUserPlaylist, addToPlaylist as addToPlaylistService } from "@/service";

const notification = namespace("notification");
const playlist = namespace("playlist");
const currentUser = namespace("currentUser");
@Component({
  components: {
    FavIcon,
    MoreIcon,
    ArtistsWithComma,
    BtnWithPopupMenu,
    SvgBtnWrapper,
    MoreItem,
    MoreList,
    DownloadIcon
  }
})
export default class PlaylistItem extends Vue {
  canPopupMenu: boolean = false;
  @Prop() track!: Track;
  isLoading: boolean = false;
  userPlaylists: Playlist[] = [];

  @notification.Mutation setMsg!: (msg: string) => void;

  @playlist.State currentSongId!: number;
  @playlist.State tracks!: Track[];
  @playlist.Mutation setCurrentSongId!: (id: number) => void;
  @playlist.Mutation setTracks!: (tracks: Track[]) => void;
  @currentUser.State("userId") currentUserId!: number;
  formatTime = formatTime;
  handleMouseLeave() {
    this.canPopupMenu = false;
  }
  handleMouseEnter() {
    this.canPopupMenu = true;
  }
  handlePlay() {
    this.setCurrentSongId(this.track.id);
  }
  handleRemove() {
    this.setTracks(this.tracks.slice().filter((t: Track) => t.id !== this.track.id));
  }
  handleComment() {
    this.$router.push(`/song/${this.track.id}`);
  }
  downloadSong(url: string) {
    fetch(url).then(res =>
      res.blob().then(blob => {
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const filename = `${this.track.name}-${this.track.artists
          .map((ar: Artist) => ar.name)
          .join(",")}.mp3`;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      })
    );
  }
  handleDownload() {
    this.isLoading = true;
    getSongURL(this.track.id).then(
      res => {
        const songUrl = res.data.data[0].url;
        this.downloadSong(songUrl);
      },
      error => {
        this.setMsg(`获取下载歌曲地址错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
  updateUserPlaylists() {
    getUserPlaylist(this.currentUserId).then(
      res => {
        this.userPlaylists = res.data.playlist;
      },
      error => {
        this.setMsg(`获取用户歌单错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
  addToPlaylist(playlistId: number) {
    console.log("playlistId", playlistId, this.track.id);
    addToPlaylistService(playlistId, this.track.id).then(
      res => {
        this.setMsg(`添加到歌单成功！`);
      },
      error => {
        this.setMsg(`添加到歌单错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }
  created() {
    this.updateUserPlaylists();
  }
}
</script>
<style lang="sass" scoped>
@import "config.sass"
// 单个歌曲样式
.container
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 1.5em 0 1em
  &.active
    color: $orange
.container:nth-of-type(2n+1)
  background-color: $whitegray
.container:not(.not-play):hover
  background-color: $whitegray3
// 专辑封面
.album-img
  flex: 0 0 40px
  height: 40px
  img
    width: 100%
    height: 100%
    border-radius: 4px
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
    color: $orange
.duration
  flex: 0 0 auto
  color: $gray
  font-size: 12px
// hover时显示更多和收藏
.fav-more
  display: none
  color: $gray
  flex: 0 0 50px
  .fav
    margin-right: 10px
  .is-fav
    color: $orange
  &.is-fav svg
    fill: $orange
.container:hover
  .duration
    display: none
  .fav-more
    display: flex
.more-popup-menu
  color: #333
</style>
