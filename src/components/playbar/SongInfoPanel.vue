<template>
  <div class="song-info-panel">
    <div v-if="isLoading" class="loading-spinner">
      <Spinner />
    </div>
    <div class="album-img">
      <img v-if="albumImg" :src="albumImg | convert2Https | clipImage(192, 192)" :alt="name" />
      <div v-else class="img-placeholder"></div>
      <div class="img-mask">
        <button
          class="button_icon large button_center-center"
          @click="$emit('toggle-song-player')"
          :class="{ invert: !isShowSongPlayer }"
        >
          <SlideUpIcon />
        </button>
      </div>
    </div>
    <div class="name-songer">
      <div v-if="name" class="name">{{ name }}</div>
      <div v-else class="name">听见不同</div>
      <div>
        <ArtistsWithComma
          v-if="artists.length > 0"
          :artists="artists"
          aTagClass="songer"
          commaClass="comma"
        />
      </div>
    </div>
    <!-- 选择音质 -->
    <btn-with-popup-menu class="quality-btn__wrapper" :disabled="disabled">
      <template slot="btn">
        <button class="quality button" :disabled="disabled">{{ currentQuality }}</button>
      </template>
      <!-- 点击音质，弹出选择菜单 -->
      <template slot="menu">
        <select-list :data="qualitys" @selected-change="selectedChange" />
      </template>
    </btn-with-popup-menu>

    <!-- 收藏 -->
    <SvgBtnWrapper
      xlarge
      class="faver"
      @click.native="toggleFaver"
      :class="{ 'is-faver': isFaver }"
      :disabled="disabled"
    >
      <FavIcon />
    </SvgBtnWrapper>
    <!-- 三点 更多选项 -->
    <btn-with-popup-menu class="more" :disabled="disabled">
      <template slot="btn">
        <SvgBtnWrapper xlarge :disabled="disabled">
          <MoreIcon />
        </SvgBtnWrapper>
      </template>
      <template slot="menu">
        <more-list>
          <more-item>
            <DownloadIcon slot="icon" />
            <span slot="txt" class="txt">漫游相似歌曲</span>
          </more-item>
          <more-item>
            <DownloadIcon slot="icon" />
            <span slot="txt" class="txt">下载</span>
          </more-item>
          <!-- 添加到歌单 hover时右侧扩展 -->
          <more-item spread="'right'">
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
          <!-- 评论分享 -->
          <more-item>
            <DownloadIcon slot="icon" />
            <span slot="txt" class="txt">评论分享</span>
          </more-item>
        </more-list>
      </template>
    </btn-with-popup-menu>
    <!-- 点击更多，弹出菜单 -->
  </div>
</template>
<script lang="ts">
import PopupMenu from "@/components/PopupMenu.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import MoreList from "@/components/more-list/MoreList.vue";
import SelectList from "@/components/more-list/SelectList.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import FavIcon from "@/components/SVGIcons/FavIcon.vue";
import SlideUpIcon from "@/components/SVGIcons/SlideUpIcon.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";
import Spinner from "@/components/globals/Spinner.vue";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.vue";
import BtnWithPopupMenu from "@/components/globals/BtnWithPopupMenu.vue";
import { getUserPlaylist } from "@/service";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Artist } from "@/types";

interface Quality {
  id: number;
  title: string;
  isSelected: boolean;
}

@Component({
  components: {
    PopupMenu,
    MoreItem,
    MoreList,
    SelectList,
    MoreIcon,
    FavIcon,
    SlideUpIcon,
    DownloadIcon,
    SvgBtnWrapper,
    Spinner,
    ArtistsWithComma,
    BtnWithPopupMenu
  }
})
export default class SongInfoPanel extends Vue {
  @Prop() name!: string;
  @Prop() artists!: Artist[];
  @Prop() albumImg!: string;
  @Prop() isShowSongPlayer!: boolean;
  @Prop() isLoading!: boolean;
  @Prop() disabled!: boolean;
  isFaver: boolean = false;
  currentQuality: string = "标准品质";
  qualitys: Quality[] = [
    { id: 1, title: "标准品质", isSelected: false },
    { id: 2, title: "高品质", isSelected: false },
    { id: 3, title: "无损品质", isSelected: false }
  ];
  toggleFaver() {
    this.isFaver = !this.isFaver;
  }
  selectedChange(id: number) {
    console.log("selected change: ", id);
    const q = this.qualitys.find(q => q.id === id);
    if (q) {
      this.currentQuality = q.title;
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../config.sass"

.song-info-panel
  display: flex
  align-items: center
  justify-content: flex-start
  position: relative
.loading-spinner
  position: absolute
  left: 0
  top: 0
  width: 6em
  height: 100%
  padding: 1.5em
  box-sizing: border-box
  z-index: 1
.album-img
  flex: 0 0 6em
  height: 100%
  position: relative
  img
    width: 100%
    height: 100%
  .img-placeholder
    height: 100%
    width: 100%
    background-color: $gray
  .img-mask
    display: none
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: $whitegray-2
  &:hover .img-mask
    display: block

.name-songer
  min-width: 0
  flex: 0 1 auto
  display: flex
  flex-direction: column
  justify-content: center
  margin-left: 1em
  .songer
    font-size: 0.8em
    color: $gray
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
  .songer:hover, .name:hover
    color: $orange
  .comma
    font-size: 0.8em
    color: $gray
  .name
    cursor: pointer
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
.quality-btn__wrapper
  margin-left: 1em
.quality
  font-size: 0.8em
  color: $gray
  border: 1px solid $gray
  padding: 0px 2em 0px 3px
  background-image: url("../../assets/chevron-down-gray.svg")
  background-position: right 3px center
  background-repeat: no-repeat
  background-size: 1em 1em
  border-radius: 2px
  white-space: nowrap
  cursor: pointer
  &:active, &:focus
    outline: none
.faver, .more
  flex-shrink: 0
  flex-grow: 0
  margin-left: 1em
.faver.is-faver
  color: $orange
  & svg
    fill: $orange

.button_center-center
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  &.invert
    transform: translate(-50%, -50%) rotate(180deg)
    transform-origin: center
</style>
