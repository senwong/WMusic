<template>
  <div class="video-player">
    <video
      preload="true"
      ref="video"
      class="video-player__video"
      :src="currentSrc"
      @loadedmetadata="e => (this.duration = e.target.duration)"
      @progress="handleVideoProgress"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @canplay="handleCanPlay"
      @click="togglePlay"
    />
    <!-- click toggle play -->
    <div class="video-player__mask" @click="handleScreenClick">
      <div
        class="fadeout-btn"
        :class="{ 'fadeout-btn--fade-out': fadeoutBtnAnimate }"
        @animationend="handleAnimationEnd"
      >
        <div class="fadeout-btn__icon">
          <PlayArrow v-if="paused" />
          <Pause v-else />
        </div>
      </div>
    </div>

    <div class="video-player__mask" v-if="!isLoading && !ended && paused">
      <svg-btn class="screen-play-icon" xlarge @click.native="togglePlay">
        <play-arrow />
      </svg-btn>
    </div>
    <!-- video player control buttons in buttom -->
    <div
      class="video-player__bottom"
      :class="{ 'video-player__bottom--show': paused }"
    >
      <div class="video-player__progress" ref="progressBar">
        <div
          class="video-player__progress__played"
          :style="playProgressStyle"
        ></div>
        <div
          class="video-player__progress__buffered"
          :style="bufferProgressStyle"
        ></div>
        <div
          class="video-player__progress__thumbnail"
          :class="{
            'video-player__progress__thumbnail--show': isShowThumbnailPorgress
          }"
          :style="{ transform: `scaleX(${thumbnailPercent})` }"
        ></div>
        <div
          class="video-player__progress__hover-area"
          @mousemove="handleThumbnailMousemove"
          @mouseleave="handleThumbnailMouseleave"
          @mouseenter="handleThumbnailMouseenter"
          @click="handleThumbnailClick"
        ></div>
      </div>
      <div
        class="video-player__thumbnail"
        ref="thumbnail"
        :class="{ 'video-player__thumbnail--show': isShowThumbnail }"
      >
        <canvas class="video-player__thumbnail__canvas" ref="canvas"></canvas>
        <div class="video-player__thumbnail__time">{{ thumbnailTime }}</div>
      </div>
      <div class="video-player__btns">
        <div class="video-player__btns__left">
          <play-pause-button @click.native="togglePlay" :paused="paused" />
          <div class="video-player__btns__volume">
            <volume-button
              @click.native="toggleMute"
              :volume="volume"
            ></volume-button>
            <input
              v-model="volume"
              :style="{
                background: `linear-gradient(to right, white ${volume}%, rgba(247, 247, 247, 0.2) 0%)`
              }"
              class="video-player__btns__volume__range"
              type="range"
              min="0"
              max="100"
            />
          </div>
          <div class="video-player__btns__duration">
            {{ formatTime(currentTime * 1000) }}/{{
              formatTime(duration * 1000)
            }}
          </div>
        </div>
        <div class="video-player__btns__right">
          <!-- 设置按钮 -->
          <div
            class="video-player--btn video-player--settings"
            :class="{ 'video-player--settings--rotate': isShowSettingsPannel }"
          >
            <SvgBtn>
              <SettingsIcon />
            </SvgBtn>
            <div
              class="video-player--settings__hd-sign"
              v-if="currentQuality && currentQuality >= 20"
            >
              <HDIcon />
            </div>
          </div>
          <!-- 设置弹出菜单 -->
          <!-- <popup-menu
            :target="$refs.setting"
            direction="top"
            enableClick="true"
          >
            <setting-container
              :qualitys="qualitys"
              @set-quality="setQuality"
            ></setting-container>
          </popup-menu> -->
          <!-- 开启/关闭宽屏 -->
          <SvgBtn class="video-player--btn" @click.native="toggleTheaterMode">
            <WideScreenIcon />
          </SvgBtn>
          <!-- 开启/关闭全屏 -->
          <SvgBtn class="video-player--btn" @click.native="toggleFullScreen">
            <FullScreenIcon />
          </SvgBtn>
        </div>
      </div>
    </div>
    <!-- 结束视频时 -->
    <div class="video-player__mask" v-if="ended">
      <SvgBtn xlarge @click.native="handleReplay">
        <ReplayIcon />
      </SvgBtn>
    </div>

    <!-- loading animation -->
    <div class="video-player__mask" v-if="isLoading">
      <div class="loading-icon">
        <Loading />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import PlayPauseButton from "./PlayPauseButton.vue";
import VolumeButton from "./VolumeButton.vue";
import { formatTime, optimizedResize, isUndef } from "@/utilitys";
import WideScreenIcon from "@/components/SVGIcons/WideScreenIcon.vue";
import FullScreenIcon from "@/components/SVGIcons/FullScreenIcon.vue";
import ReplayIcon from "@/components/SVGIcons/ReplayIcon.vue";
import Loading from "@/components/globals/Loading.vue";
import SettingsIcon from "@/components/SVGIcons/SettingsIcon.vue";
import HDIcon from "@/components/SVGIcons/HDIcon.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import PlayArrow from "@/components/SVGIcons/PlayArrow.vue";
import Pause from "@/components/SVGIcons/Pause.vue";
import { toggleFullScreen, QFSElement } from "@/utilitys";

interface BRType {
  [key: number]: string;
}
type Quality = number | null;
type ThumbnailDrawerType = ((percent: number) => void) | null;

optimizedResize();
@Component({
  components: {
    PlayPauseButton,
    VolumeButton,
    SettingsIcon,
    WideScreenIcon,
    FullScreenIcon,
    ReplayIcon,
    Loading,
    HDIcon,
    SvgBtn,
    PlayArrow,
    Pause
  }
})
export default class VideoPlayer extends Vue {
  // video element
  paused: boolean = true;
  currentTime: number = 0;
  bufferedEnd: number = 0;
  duration: number = 0;
  volume: number = 50;
  oldVolume: number = 0;
  video: HTMLVideoElement | null = null;
  ended: boolean = false;
  // thumbnail
  isThumbnailMoving: boolean = false;
  thumbnailPercent: number = 0;
  isShowThumbnailPorgress: boolean = false;
  isShowThumbnail: boolean = false;
  thumbnailDrawer: ThumbnailDrawerType = null;

  currentQuality: Quality = null;
  isLoading: boolean = true;
  isShowSettingsPannel: boolean = false;
  fadeoutBtnAnimate: boolean = false;

  // double click full screen
  lastScreenClick: number | null = null;

  @Prop() brs!: BRType;

  get qualitys(): number[] {
    if (!this.brs) return [];
    return Object.keys(this.brs).map(Number);
  }
  get currentSrc(): string {
    if (
      !this.brs ||
      Object.keys(this.brs).length == 0 ||
      this.currentQuality === null
    )
      return "";
    if (!Object.hasOwnProperty.call(this.brs, this.currentQuality)) return "";
    return this.brs[this.currentQuality];
  }
  // thumbnail
  get playProgressStyle() {
    return {
      transform: `scaleX(${
        this.duration == 0 ? 0 : this.currentTime / this.duration
      })`
    };
  }
  get bufferProgressStyle() {
    return {
      transform: `scaleX(${
        this.duration == 0 ? 0 : this.bufferedEnd / this.duration
      })`
    };
  }
  /**
   * thumbnail截图上的时间
   */
  get thumbnailTime() {
    return formatTime(this.duration * this.thumbnailPercent * 1000);
  }

  formatTime = formatTime;
  // video play
  toggleFullScreen() {
    const video = this.$el as QFSElement;
    toggleFullScreen(video);
  }
  handlePlay() {
    this.paused = false;
  }
  handlePause() {
    this.paused = true;
  }
  handleTimeUpdate({ target }: Event) {
    if (target !== null) {
      this.currentTime = (target as HTMLVideoElement).currentTime;
    }
  }
  handleReplay() {
    const video = this.$refs.video as HTMLVideoElement;
    if (video) {
      video.currentTime = 0;
      video.play();
      this.ended = false;
    }
  }
  togglePlay() {
    const video = this.$refs.video as HTMLVideoElement;
    if (video) {
      if (this.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }
  toggleMute() {
    if (this.volume > 0) {
      this.oldVolume = this.volume;
      this.volume = 0;
    } else {
      this.volume = this.oldVolume;
    }
  }
  setQuality(newQuality: number) {
    const video = this.$refs.video as HTMLVideoElement;
    if (isUndef(newQuality) || isUndef(video)) return;
    this.currentQuality = newQuality;
    const { paused } = video;
    video.currentTime = this.currentTime;
    if (!paused) video.play();
  }
  // thumbnail
  jumpToPercentTime(percent: number) {
    (this.$refs.video as HTMLVideoElement).currentTime =
      this.duration * percent;
  }
  loadVideo(videoSrc: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.addEventListener("loadedmetadata", () => {
        resolve(video);
      });
      video.src = videoSrc;
    });
  }
  createThumbnaiaDrawer(
    videoSrc: string,
    canvas: HTMLCanvasElement
  ): Promise<ThumbnailDrawerType> {
    return new Promise((resolve, reject) => {
      this.loadVideo(videoSrc).then(video => {
        const { videoWidth, videoHeight, duration } = video;
        const ctx = canvas.getContext("2d");
        function drawerFn(percent: number) {
          function handleSeeked() {
            if (!ctx) {
              return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              video,
              0,
              0,
              videoWidth,
              videoHeight,
              0,
              0,
              canvas.width,
              canvas.height
            );
            video.removeEventListener("seeked", handleSeeked);
          }
          video.addEventListener("seeked", handleSeeked);
          video.currentTime = Math.round(duration * percent);
        }
        resolve(drawerFn);
      });
    });
  }
  /**
   * hover时 显示对应时间点，视频截图
   */
  handleThumbnailMousemove(e: MouseEvent) {
    if (this.isThumbnailMoving) return;
    this.isThumbnailMoving = true;
    setTimeout(handleMouseMove.bind(this), 1000 / 30);
    const that = this;

    function handleMouseMove() {
      that.isThumbnailMoving = false;
      const progressBar = that.$refs.progressBar as HTMLElement;
      if (!progressBar) {
        return;
      }
      const progressBarRect = progressBar.getBoundingClientRect();
      const percentTime =
        (e.clientX - progressBarRect.left) / progressBarRect.width;
      that.thumbnailPercent = percentTime;
    }
  }
  /**
   * mouse离开hover area时隐藏thumbnail截图和进度条
   */
  handleThumbnailMouseleave() {
    this.isShowThumbnail = false;
    this.isShowThumbnailPorgress = false;
  }
  /**
   * mouse进入hover area时显示thumbnail截图和进度条
   */
  handleThumbnailMouseenter() {
    this.isShowThumbnail = true;
    this.isShowThumbnailPorgress = true;
  }
  /**
   * mouse点击hover area视频跳入到指定进度
   */
  handleThumbnailClick() {
    this.jumpToPercentTime(this.thumbnailPercent);
  }
  /**
   * 设置Thumbnai截图位置
   */
  setThumbnailLeft(percent: number) {
    const progressBar = this.$refs.progressBar as HTMLElement;
    const thumbnail = this.$refs.thumbnail as HTMLElement;
    const progressBarRect = progressBar.getBoundingClientRect();
    let left = percent * progressBar.clientWidth;

    const thumbnailWidth = thumbnail.clientWidth;
    if (left <= thumbnailWidth / 2) {
      left = 0;
    } else if (left >= progressBarRect.width - thumbnailWidth / 2) {
      left = progressBarRect.width - thumbnailWidth;
    } else {
      left -= thumbnailWidth / 2;
    }
    if (thumbnail.style) {
      thumbnail.style.left = `${left}px`;
    }
  }
  /**
   * 更新buffered
   */
  handleVideoProgress(e: Event) {
    const target = e.target as HTMLVideoElement;
    const buffered = target.buffered;
    if (buffered.length > 0) {
      this.bufferedEnd = buffered.end(0);
    }
  }
  /**
   * 开启关闭网页全屏
   */
  toggleTheaterMode() {
    this.$emit("toggle-theater-mode");
  }
  handleEnded() {
    this.ended = true;
  }
  handleCanPlay() {
    this.isLoading = false;
  }
  handleScreenClick() {
    if (!this.lastScreenClick) {
      this.lastScreenClick = performance.now();
    } else {
      const current = performance.now();
      if (current - this.lastScreenClick <= 800) {
        // request full screen, and return;
        this.toggleFullScreen();
        return;
      }
      this.lastScreenClick = current;
    }
    this.togglePlay();
  }
  // AnimationEvent
  handleAnimationEnd(event: AnimationEvent) {
    if (event.animationName === "fadeout-btn") {
      this.fadeoutBtnAnimate = false;
    }
  }
  @Watch("volume")
  onVolumeChange(val: number) {
    const video = this.$refs.video as HTMLVideoElement;
    video && (video.volume = val / 100);
  }
  @Watch("brs")
  onBrsChange(brs: BRType) {
    this.currentQuality =
      this.qualitys.length == 0 ? null : Math.max(...this.qualitys);
    this.setupThumbnailDrawer(brs);
  }
  @Watch("thumbnailPercent")
  onThumbnailPercentChange(val: number) {
    this.setThumbnailLeft(val);
    this.thumbnailDrawer && this.thumbnailDrawer(val);
  }
  @Watch("paused")
  onPausedChange() {
    if (this.fadeoutBtnAnimate) {
      this.fadeoutBtnAnimate = false;
      this.$nextTick(function() {
        this.fadeoutBtnAnimate = true;
      });
    } else {
      this.fadeoutBtnAnimate = true;
    }
  }
  getMinQualitySrc(): string {
    const quality = Math.min(...Object.keys(this.brs).map(Number));
    console.log(this.brs);
    console.log({ quality });
    return this.brs[quality];
  }
  setupThumbnailDrawer(brs: BRType) {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    const qualitys = Object.keys(brs);
    if (qualitys.length < 1 || isUndef(canvas)) {
      return;
    }
    const minQuality = Math.min(...qualitys.map(Number));
    const minQualityVideoSrc = brs[minQuality];
    this.createThumbnaiaDrawer(minQualityVideoSrc, canvas).then(drawerFn => {
      this.thumbnailDrawer = drawerFn;
    });
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

.video-player
  width: 100%
  position: relative
  overflow: hidden
  padding-bottom: 56.25%
  &:hover .video-player__bottom
    bottom: 0px
  &__video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: black
  &__bottom
    color: white
    position: absolute
    height: auto
    bottom: -41px
    left: 0
    right: 0
    transition: bottom 0.3s
    &--show
      bottom: 0px
  &__mask
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    flex-direction: row

.theater-mode .video-player
  min-width: 389px
  background: #000
  @media screen and (max-width: calc(270px + 2em + 853.33px))
    padding-bottom: 480px
    & video
      left: 50%
      transform: translateX(-50%)
  @media screen and (min-width: calc(270px + 2em + 853.33px)) and (max-width: calc(270px + 2em + 960px))
    & video
      width: 100%
      height: 100%
  @media screen and (min-width: calc(270px + 2em + 960px))
    padding-bottom: 540px
    & video
      left: 50%
      transform: translateX(-50%)
      width: auto
      height: 100%

.video-player__progress
  height: 5px
  background-color: #777
  position: relative
  &:hover
    transform: scaleY(1.2)
    transform-origin: 0 2.5px
  &__played
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: red
    transform: scaleX(0.5)
    transform-origin: 0 0
    z-index: 4
  &__buffered
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: $gray
    transform: scaleX(0.5)
    transform-origin: 0 0
    z-index: 2
  &__thumbnail
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: $whitegray7
    transform: scaleX(0)
    transform-origin: 0 0
    z-index: 3
    visibility: hidden
    opacity: 0
    transition: visibility 0.3s, opacity 0.3s
    &--show
      visibility: visible
      opacity: 1
  &__hover-area
    position: absolute
    left: 0
    width: 100%
    height: 16px
    bottom: -6px
    background-color: transparent
    cursor: pointer
.video-player__thumbnail
  position: absolute
  left: 0
  bottom: 50px
  visibility: hidden
  opacity: 0
  width: 160px
  height: 90px
  box-sizing: border-box
  background: black
  border: 2px solid #777
  border-radius: 2px
  transition: visibility 0.3s, opacity 0.3s
  &--show
    visibility: visible
    opacity: 1
  &__canvas
    width: 100%
    height: 100%
  &__time
    position: absolute
    bottom: 0
    left: 50%
    transform: translateX(-50%)
    font-size: 12px
    padding: 2px
    background-color: $black-2
    border-radius: 2px 2px 0 0



.video-player__btns
  display: flex
  height: 36px
  justify-content: space-between
  &__left, &__right
    display: flex
    align-items: center
  &__volume
    display: flex
    align-items: center
    &__range
      -webkit-appearance: none
      width: 52px
      height: 3px
      background: #eee
      outline: none
      &::-moz-range-thumb
        width: 12px
        height: 12px
        cursor: pointer
        border-radius: 6px
        background-color: white
      &::-webkit-slider-thumb
        -webkit-appearance: none
        appearance: none
        width: 12px
        height: 12px
        cursor: pointer
        border-radius: 6px
        background-color: white

.video-player:-webkit-full-screen
  video
    width: 100%
    height: 100%


.loading-icon
  color: white
  width: 6em
  height: 6em

.fadeout-btn
  width: 4em
  height: 4em
  transition-property: all
  transform-origin: center
  background-color: rgba(0, 0, 0, 0.2)
  border-radius: 9999px
  display: flex
  justify-content: center
  align-items: center
  opacity: 0
  &__icon
    width: 2em
    height: 2em
    color: white
  &--fade-out
    animation: fadeout-btn .25s
@keyframes fadeout-btn
  from
    opacity: 1
    transform: scale(1)
  to
    opacity: 0
    transform: scale(3)
.video-player--settings
  position: relative
  transform-origin: center
  transition: all 250ms
  &--rotate
    transform: rotate(60deg)
  &__hd-sign
    width: 16px
    height: auto
    position: absolute
    font-size: 0
    top: 0
    right: 0
.video-player--btn
  margin: 0 0.25em
  padding: 0.5em
.screen-play-icon
  color: white
</style>
