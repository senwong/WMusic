<template>
  <div class="list-wrapper" ref="menu">
    <!-- 顶部标题 -->
    <div class="list__title">
      <span class="title__txt">播放列表</span>
      <BtnWithPopupMenu>
        <template slot="btn">
          <SvgBtn large>
            <MoreIcon />
          </SvgBtn>
        </template>
        <template slot="menu">
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
        </template>
      </BtnWithPopupMenu>
    </div>
    <!-- 统计歌曲数量 -->
    <p class="list__count">共{{ tracks ? tracks.length : 0 }}首歌</p>
    <ul class="play-list scrollbar-invisible">
      <!-- 单个歌曲信息 -->
      <PlaylistItem v-for="track in tracks" :key="track.id" :track="track" />
    </ul>
    <!-- 加载中。。。动画 -->
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script lang="ts">
import PopupMenu from "./PopupMenu.vue";
import MoreItem from "./more-list/MoreItem.vue";
import MoreList from "./more-list/MoreList.vue";
import Loading from "@/components/Loading.vue";
import PlaylistItem from "./PlaylistItem.vue";
import MoreIcon from "./SVGIcons/MoreIcon.vue";
import DownloadIcon from "./SVGIcons/DownloadIcon.vue";
import { Vue, Component } from "vue-property-decorator";
import { Mutation, namespace, State } from "vuex-class";
import { Track } from "@/types";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import { withIn } from "@/utilitys";

const playlist = namespace("playlist");
const notification = namespace("notification");
@Component({
  components: {
    PopupMenu,
    MoreList,
    MoreItem,
    Loading,
    PlaylistItem,
    MoreIcon,
    DownloadIcon,
    BtnWithPopupMenu,
    SvgBtn
  }
})
export default class Playlist extends Vue {
  isLoading: boolean = false;

  @notification.Mutation setMsg!: (msg: string) => void;
  @playlist.State isVisible!: boolean;
  @playlist.Mutation setVisibility!: (b: boolean) => void;

  @playlist.State tracks!: Track[];

  $refs!: {
    menu: HTMLElement;
  };
  handleBodyClick(e: UIEvent) {
    if (!this.isVisible) {
      return;
    }
    const target = e.target as HTMLElement;
    if (!target && !this.$refs.menu) {
      return;
    }
    if (!withIn(target, this.$refs.menu)) {
      this.setVisibility(false);
    }
  }
  mounted() {
    document.body.addEventListener("click", this.handleBodyClick);
  }
  beforeDestroy() {
    document.body.removeEventListener("click", this.handleBodyClick);
  }
}
</script>
<style lang="sass" scoped>
@import "config.sass"
@import "@/style/theme.sass"

.list-wrapper
  background-color: white
  display: flex
  flex-direction: column
  &.active
    color: $primary-color
.play-list
  overflow-y: scroll
  overflow-x: hidden
  padding: 15px 0px
  margin-bottom: 0
  // margin-right: -15px
  overscroll-behavior: contain
// 顶部标题样式
.list__title
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 10px
  height: 1.3em
  margin-top: 1em
  .title__txt
    font-size: 16px
    color: $primary-color
// 歌曲总数样式
.list__count
  padding: 0 10px
  font-size: 12px
  @include themify($themes)
    color: themed("secondary-text-color")
  // 单个歌曲样式
.song-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 10px
  &.active
    color: $primary-color
  &.not-play
    @include themify($themes)
      color: themed("secondary-text-color")
.song-item:nth-of-type(2n+1)
  @include themify($themes)
    background-color: themed("secondary-background-color")

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
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &:hover
      color: $primary-color

@include themify($themes)
  .length,.songer,.fav-more
    color: themed("secondary-text-color")
.length
  font-size: 12px
  flex: 0 0 50px
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
.song-item:not(.not-play):hover
  .length
    display: none
  .fav-more
    display: flex

.txt
  font-size: 14px
  line-height: 16px
  height: 16px
  // min-width: 150px
  margin-left: 10px
</style>
