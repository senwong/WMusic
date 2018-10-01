<template>
<div>
  <div class="playbar">
    <!-- 左边区域 开始-->
    <song-info-panel
      class="playbar__item_left"
      :name="currentSong.name"
      :artists="currentSong.artists"
      :albumImg="currentSong.imgUrl"
      :isShowSongPlayer="isShowSongPlayer"
      @toggle-song-player="toggleSongPlayer"
    ></song-info-panel>
    <!-- 左边区域 结束-->
    <!-- 中间区域 开始-->
    <div class="playbar__item_middle pause-panel">
      <!-- 上一曲按钮 -->
      <button class="button button_icon prev-song" @click="args => playList.prev.call(playList, args)">
        <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M8 2 L8 16 22 2 22 30 8 16 8 30"></path>
        </svg>
      </button>
      <!-- 播放/暂停按钮 -->
      <div
        class="pause-song"
        @click="togglePlay">
        <svg v-if="!currentSong.isPlaying" class="i-caret-right" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M10 30 L26 16 10 2 Z"></path>
        </svg>
        <svg v-if="currentSong.isPlaying" class="i-pause" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M23 2 L23 30 M9 2 L9 30"></path>
        </svg>
      </div>
      <!-- 下一曲按钮 -->
      <button class="button button_icon next-song" @click="args => playList.next.call(playList, args)">
        <svg  viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M24 2 L24 16 10 2 10 30 24 16 24 30"></path>
        </svg>
      </button>
    </div>
    <!-- 中间区域 结束 -->
    <!-- 右边区域 开始-->
    <sound-panel
      class="playbar__item_right "
      @toggle-right-menu="$emit('toggle-right-menu')"
      @volume-change="changeVolume"
    ></sound-panel>
    <!-- 右边区域 结束-->
    <div class="progress-bar">
      <div class="progress__past" :style="{ width: progressPercent}"></div>
      <div class="progress__state" :style="{ left: progressPercent}">{{formatTime(currentSong.currentTime * 1000) + '/' +formatTime(currentSong.duration)}}</div>
    </div>
  </div>
  <transition name="slide-up">
    <song-player v-if="isShowSongPlayer"></song-player>
  </transition>
</div>
</template>
<script>
import SongInfoPanel from './SongInfoPanel.vue';
import SoundPanel from './SoundPanel.vue';
import { getSongDetail, getSongURL, getPlaylistDetail, } from '@/service/Service';
import { formatTime } from '@/utilitys';
import SongPlayer from './SongPlayer.vue';

export default {
  name: "Playbar",
  components: {
    SongInfoPanel, SoundPanel, SongPlayer
  },
  data() {
    return {
      formatTime: formatTime,
      isShowSongPlayer: false
    }
  },
  methods: {
    togglePlay() {
      if (this.currentSong.isPlaying ) {
        this.playList.pause();
      } else {
        this.playList.play();
      }

    },
    changeVolume(volume) {
      this.playList.changeVolume(volume);
    },
    /**
     * 拖动状态栏时间戳，改变播放进度
     * @param {HTMLElement} progressLable
     */
    registeDragLable(progressLable, parentEle) {
      let enableDray = false;
      progressLable.addEventListener("mousedown", () => enableDray = true)
      document.body.addEventListener("mouseup", (e) => enableDray = false)
      document.body.addEventListener("mouseleave", () => enableDray = false)
      document.body.addEventListener("mousemove", (e) => {
        if(!enableDray) return;
        progressLable.style.left = e.clientX - 40 + "px";

        const percent =  (e.clientX - 40) / parseInt(getComputedStyle(parentEle).width.slice(0, -2));
        const currentTime = percent * this.currentSong.duration / 1000;
        this.currentSong.changeCurrentTime(currentTime);
      })
    },
    toggleSongPlayer() {
      this.isShowSongPlayer= !this.isShowSongPlayer
    }
  },
  computed: {
    playList() {
      return this.$store.state.playList;
    },
    currentSong() {
      return this.playList.getCurrentSong()
    },
    progressPercent() {
      if(!this.currentSong.currentTime || !this.currentSong.duration) {
        return '0%';
      }
      return (100 * this.currentSong.currentTime * 1000 / this.currentSong.duration).toFixed(2) + '%'
    },
  },
  mounted() {
    this.registeDragLable(this.$el.querySelector(".progress__state"), this.$el.querySelector(".progress-bar"))
    this.$watch("playList", function(val) {
      this.$store.commit("newPlayList", val)
    }, {deep: true})
  },
  // watch: {
  //   playList: function(val) {
  //     console.log("play list change ", val)
  //     this.$store.commit("newPlayList", val)
  //   }
  // }
}
</script>
<style lang="sass">
@import "../config.sass";

.playbar
  display: flex;
  align-items: stretch;
  position: relative;
  height: 100%;
  z-index: 1;
  background-color: $whitegray;
// .playbar__item_left
//   flex: 1 1 0;
//   // justify-content: flex-start;
// .playbar__item_right
  // flex: 1 1 0;
  // justify-content: flex-end;

// 中间播放控制样式
.pause-panel
  display: flex;
  align-items: center;
  margin: 0 -0.5em;
  flex: 1 1 auto;
  justify-content: center;
.pause-song
  background-color: $orange;
  border-radius: 50%;
  color: white
  padding: 5px;
  font-size: inherit;
  width: 2em;
  height: 2em;
.pause-song:active
  opacity: 0.3;
.prev-song, .pause-song, .next-song
  margin: 0 0.5em;

// 进度条样式
.progress-bar
  position: absolute;
  top: 0;
  height: 4px;
  left: 0;
  right: 0;
  background-color: $whitegray3;
  &:hover
    // height: 8px;
    .progress__state
      visibility: visible;

.progress__past
  height: 100%;
  width: 0%;
  background-color: $orange;
.progress__state
  position: absolute;
  visibility: visible;
  height: 1em;
  line-height: 1em;
  font-size: 1em;
  position: absolute;
  top: -0.5em;
  background: $mask;
  border-radius: 1em;
  display: inline-block;
  padding: 0.2em 0.5em;

.button
  background-color: transparent;
  &:focus, &:hover
    outline: none;
.button_icon
  border: none;
  font-size: inherit;
  width: 2em;
  height: 2em;
  padding: 0;

.slide-up-enter-active
  animation: slide-up 0.5s;
.slide-up-leave-active
  animation: slide-up .5s reverse;
@keyframes slide-up
  from
    top: calc(100% - #{$footerHeight});
  to
    top: 0;
</style>

