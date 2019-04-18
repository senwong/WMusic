<template>
  <div class="video-player">
    <video preload="true" ref="video"
      :src="src"
      @loadedmetadata="e => this.duration = e.target.duration"
      @progress="handleVideoProgress"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
    />
    <div class="control-wrapper" :class="{'show': paused}">
      <div class="progress-list" ref="progressBar">
        <div class="play-progress" :style= "playProgressStyle"></div>
        <div class="buffer-progress" :style= "bufferProgressStyle"></div>
        <div class="thumbnail-progress" :class="{'show': isShowThumbnailPorgress}" :style="{'transform': `scaleX(${thumbnailPercent})`}"></div>
        <div class="hover-area"
          @mousemove="handleThumbnailMousemove"
          @mouseleave="handleThumbnailMouseleave"
          @mouseenter="handleThumbnailMouseenter"
          @click="handleThumbnailClick"
          ></div>
      </div>
      <div class="thumbnail" ref="thumbnail" :class="{'show': isShowThumbnail}">
        <canvas class="thumbnail-canvas" ref="canvas"></canvas>
        <div class="thumbnail-time">{{thumbnailTime}}</div>
      </div>
      <div class="controls">
        <div class="left">
          <play-pause-button @click.native="togglePlay"></play-pause-button>
          <div class="volume">
            <volume-button @click.native="toggleMute" :volume="volume"></volume-button>
            <input v-model="volume" :style="{'background': `linear-gradient(to right, white ${volume}%, rgba(247, 247, 247, 0.2) 0%)`}" class="volume-range" type="range" min="0" max="100"/>
          </div>
          <div class="duration">
            {{ formatTime(currentTime * 1000) }}/{{ formatTime(duration * 1000) }}
          </div>
        </div>
        <div class="right">
          <!-- 设置按钮 -->
          <button class="button_icon large controll__icon" ref="setting">
            <SettingIcon />
          </button>
          <!-- 设置弹出菜单 -->
          <popup-menu :target="$refs.setting" direction="top" enableClick= true >
            <setting-container :qualitys="qualitys" @set-quality="setQuality"></setting-container>
          </popup-menu>
          <!-- 开启/关闭网页全屏 -->
          <button class="button_icon large controll__icon" @click="toggleTheaterMode">
            <WideScreenIcon />
          </button>
          <!-- 开启/关闭全屏 -->
          <button class="button_icon large controll__icon" @click="toggleFullScreen">
            <FullScreenIcon />
          </button>
        </div>
      </div>
    </div>
    <!-- 结束视频时 -->
    <div class="video-ended-mask" v-if="ended">
      <button class="button_icon large" @click="handleReplay">
        <ReplayIcon />
      </button>
    </div>
  </div>
</template>
<script>
import PlayPauseButton from "./PlayPauseButton";
import VolumeButton from "./VolumeButton"
import PopupMenu from "@/components/PopupMenu";
import SettingContainer from "@/components/MV/SettingContainer";
import axios from "axios";
import { formatTime, optimizedResize } from "@/utilitys"
import SettingIcon from '@/components/SVGIcons/SettingIcon';
import WideScreenIcon from '@/components/SVGIcons/WideScreenIcon';
import FullScreenIcon from '@/components/SVGIcons/FullScreenIcon';
import ReplayIcon from '@/components/SVGIcons/ReplayIcon';

optimizedResize();
export default {
  name: "VideoPlayer",
  props: ["brs"],
  components: {
    PlayPauseButton,
    PopupMenu,
    SettingContainer,
    VolumeButton,
    SettingIcon,
    WideScreenIcon,
    FullScreenIcon,
    ReplayIcon,
  },
  data() {
    return {
      paused: true,
      currentTime: 0,
      bufferedEnd: 0,
      duration: 0,
      src: "",
      volume: 50,
      video: null,
      isThumbnailMoving: false,
      thumbnailPercent: 0,
      isShowThumbnailPorgress: false,
      isShowThumbnail: false,
      ended: false,
    };
  },
  computed: {
    qualitys() {
      return Object.keys(this.brs);
    },
    tempSrc() {
      return this.brs[Object.keys(this.brs)[Object.keys(this.brs).length - 1]];
    },
    playProgressStyle() {
      return {
        transform:
          "scaleX(" +
          (this.duration == 0 ? 0 : this.currentTime / this.duration) +
          ")"
      };
    },
    bufferProgressStyle() {
      return {
        transform:
          "scaleX(" +
          (this.duration == 0 ? 0 : this.bufferedEnd / this.duration) +
          ")"
      };
    },
    /**
     * thumbnail截图上的时间
     */
    thumbnailTime() {
      return formatTime(this.duration * this.thumbnailPercent * 1000)
    },
  },
  mounted() {
    /**
     * 给video元素注册resize事件，设置固定宽度和长度，改变视频分辨率时不会闪动
     */
    // this.setVideoDemension();
    // window.addEventListener("optimizedResize", this.setVideoDemension.bind(this));
  },
  methods: {
    formatTime,
    handlePlay() {
      this.paused = false;
    },
    handlePause() {
      this.paused = true;
    },
    handleTimeUpdate({ target }) {
      this.currentTime = target.currentTime;
    },
    handleReplay() {
      this.$refs.video.currentTime = 0;
      this.$refs.video.play();
    },
    togglePlay() {
      if (!this.$refs.video) return;
      if (this.paused) {
        this.$refs.video.play();
      } else {
        this.$refs.video.pause();
      }
    },
    toggleMute() {
      if (this.volume > 0) {
        this.oldVolume = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.oldVolume;
      }
    },
    setQuality(newQuality) {
      if (typeof newQuality == 'undefined' || typeof this.$refs.video == 'undefined') return;
      const newSrc = this.brs[newQuality];
      const paused = this.$refs.video.paused;
      this.src = newSrc;
      this.$refs.video.currentTime = this.currentTime;
      if (!paused) this.$refs.video.play();
    },
    jumpToPercentTime(percent) {
      this.video.currentTime = this.video.duration * percent
    },
    createDrawer(videoPath, canvas) {
      const video = document.createElement("video"),
      ctx = canvas.getContext("2d")
      let videoWidth, videoHeight, duration
      const getMetadata = function(cb) {
        video.addEventListener("loadedmetadata", () => {
          videoWidth = video.videoWidth
          videoHeight = video.videoHeight
          duration = video.duration
          cb && cb();
        })
      }
      getMetadata();
      video.src = videoPath
      function percentDrawer(percent) {
        video.addEventListener("seeked", () => {
          ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height)
        })
        if (!duration) {
          getMetadata(() => {
            video.currentTime = parseInt(duration * percent)
          })
          return
        }
        video.currentTime = parseInt(duration * percent)
      }
      return percentDrawer
    },
    /**
     * hover时 显示对应时间点，视频截图
     */
    handleThumbnailMousemove(e) {
      if (this.isThumbnailMoving) return
      this.isThumbnailMoving = true
      setTimeout(handleMouseMove.bind(this), 1000 / 30)
      function handleMouseMove() {
        this.isThumbnailMoving = false
        const progressBarRect = this.$refs.progressBar.getBoundingClientRect()
        const percentTime = (e.clientX - progressBarRect.left) / progressBarRect.width
        this.thumbnailPercent = percentTime
        this.thumbnailDrawer && this.thumbnailDrawer(percentTime)
      }
    },
    /**
     * mouse离开hover area时隐藏thumbnail截图和进度条
     */
    handleThumbnailMouseleave() {
      this.isShowThumbnail = false
      this.isShowThumbnailPorgress = false
    },
    /**
     * mouse进入hover area时显示thumbnail截图和进度条
     */
    handleThumbnailMouseenter() {
      this.isShowThumbnail = true
      this.isShowThumbnailPorgress = true
    },
    /**
     * mouse点击hover area视频跳入到指定进度
     */
    handleThumbnailClick() {
      this.jumpToPercentTime(this.thumbnailPercent)
    },
    /**
     * toggle视频全屏显示
     */
    toggleFullScreen() {
      const exitFullscreen =
        document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozExitFullscreen ||
        document.webkitExitFullscreen;
      const requestFullScreen =
        this.$el.requestFullscreen ||
        this.$el.msRequestFullscreen ||
        this.$el.mozRequestFullScreen ||
        this.$el.webkitRequestFullscreen;
      const isFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (isFullScreen) {
        exitFullscreen.call(document);
      } else {
        requestFullScreen.call(this.$el);
      }
    },
    /**
     * 设置Thumbnai截图位置
     */
    setThumbnailLeft(percent) {
      if(Object.keys(this.$refs) == 0) return
      const progressBarRect = this.$refs.progressBar.getBoundingClientRect()
      let left =  percent * progressBarRect.width
      const thumbnailWidth = parseInt(getComputedStyle(this.$refs.thumbnail).width.replace("px", ""))
      if(left <= thumbnailWidth / 2) {
        left = 0
      } else if(left >=  progressBarRect.width - thumbnailWidth / 2) {
        left = progressBarRect.width - thumbnailWidth
      } else {
        left -= thumbnailWidth / 2
      }
      this.$refs.thumbnail.style.left = left + "px"
    },
    /**
     * 更新buffered
     */
    handleVideoProgress(e) {
      this.bufferedEnd = e.target.buffered.end(Math.max(0, e.target.buffered.length - 1));
    },
    /**
     * 开启关闭网页全屏
     */
    toggleTheaterMode() {
      this.$emit('toggle-theater-mode')
      // this.$nextTick(this.setVideoDemension)
    },
    /**
     * 根据元素更新video的长度和宽度
     */
    setVideoDemension() {
      const computedStyle = getComputedStyle(this.$refs.video.parentElement)
      this.$refs.video.style.width = computedStyle.width
      this.$refs.video.style.height = parseInt(computedStyle.width.replace("px", "")) * 9 / 16 + "px"
    }
  },
  watch: {
    volume(val) {
      this.$refs.video && (this.$refs.video.volume = val / 100);
    },
    brs(val) {
      this.src = this.brs[Object.keys(this.brs)[Object.keys(this.brs).length - 1]]
    },
    src(val) {
      this.thumbnailDrawer = this.createDrawer(val, this.$refs.canvas)
    },
    thumbnailPercent(val) {
      this.setThumbnailLeft(val)
    },
    currentTime(val) {
      this.ended = val > 0 && val == this.duration ? true : false;
    }
  }
};
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.video-player
  position: relative;
  overflow: hidden;
  video
    width: 100%;
    height: 100%;
    background: black;
  &:hover .control-wrapper
    bottom: 0px;

.theater-mode .video-player
  min-width: 389px;
  background: #000;
  @media screen and (max-width: calc(270px + 2em + 853.33px))
    height: 480px
    display: table-cell;
    vertical-align: middle;
    & video
      width: 100%;
      height: auto;
  @media screen and (min-width: calc(270px + 2em + 853.33px)) and (max-width: calc(270px + 2em + 960px))
    & video
      width: 100%;
      height: 100%;
  @media screen and (min-width: calc(270px + 2em + 960px))
    height: 540px;
    text-align: center;
    & video
      width: auto;
      height: 100%;

.progress-list
  height: 5px;
  background-color: $whitegray-2;
  position: relative;
  &:hover
    transform: scaleY(1.2);
    transform-origin: 0 2.5px;
  .play-progress
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: red;
    transform: scaleX(0.5);
    transform-origin: 0 0;
    z-index: 4;
  .buffer-progress
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $gray;
    transform: scaleX(0.5);
    transform-origin: 0 0;
    z-index: 2;
  .thumbnail-progress
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $whitegray7;
    transform: scaleX(0);
    transform-origin: 0 0;
    z-index: 3;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.3s, opacity 0.3s;
    &.show
      visibility: visible;
      opacity: 1;
  .hover-area
    position: absolute;
    left: 0;
    width: 100%;
    height: 16px;
    bottom: -6px;
    background-color: transparent;
.thumbnail
  position: absolute;
  left: 0;
  bottom: 50px;
  visibility: hidden;
  opacity: 0;
  width: 160px;
  height: 90px;
  box-sizing: border-box;
  background: black;
  border: 2px solid $whitegray3-5;
  border-radius: 2px;
  transition: visibility 0.3s, opacity 0.3s;
  .thumbnail-canvas
    width: 100%;
    height: 100%;
  .thumbnail-time
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    padding: 2px;
    background-color: $black-2;
    border-radius: 2px 2px 0 0;
  &.show
    visibility: visible;
    opacity: 1;


.control-wrapper
  color: white;
  position: absolute;
  height: auto;
  bottom: -41px;
  left: 0;
  right: 0;
  transition: bottom 0.3s;
  &.show
    bottom: 0px;
.controls
  display: flex;
  height: 36px;
  justify-content: space-between;
  .left, .right
    display: flex;
    align-items: center;
  .volume
    display: flex;
    align-items: center;
.controll__icon
  color: white;
  margin-right: 5px;
// .as-btn
//   border: none;
//   background: transparent;
//   padding: 0;
//   width: 46px;
//   height: 100%;
//   &:focus
//     outline: none;
// .svg-fill
//   fill: white;

.video-player:-webkit-full-screen
  video
    width: 100%;
    height: 100%;
.volume-range
  -webkit-appearance: none;
  width: 52px;
  height: 3px;
  background: $whitegray-2;
  outline: none;
  &::-moz-range-thumb
    width: 12px;
    height: 12px;
    cursor: pointer;
    border-radius: 6px;
    background-color: white;
  &::-webkit-slider-thumb
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    cursor: pointer;
    border-radius: 6px;
    background-color: white;
.theater-mode, .setting, .full-screen
  color: rgba(255, 255,255, 0.9);
  &:hover
    color: rgba(255, 255,255, 1);
.full-screen
  &:hover
    animation: scale 0.3s ease-in-out;
    transform-origin: 50%;
@keyframes scale
  from
    transform: scale(1)
  to
    transform: scale(1.2)

.video-ended-mask
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  flex-direction: row;
  justify-content: center;
  align-items: center;

</style>

