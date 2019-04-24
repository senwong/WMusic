<template>
<div>
  <div class="playbar">
    <audio :src="songUrl" autoplay ref="audio" @play="handlePlay" @pause="handlePause" @loadedmetadata="handleLoadedMetaData" @ended="nextSong"/>
    <!-- 左边区域 开始-->
    <song-info-panel
      class="playbar__item_left"
      :name="name"
      :artists="artists"
      :albumImg="album && album.picUrl"
      :isShowSongPlayer="isShowSongPlayer"
      @toggle-song-player="toggleSongPlayer"
    ></song-info-panel>
    <!-- 左边区域 结束-->
    <!-- 中间区域 开始-->
    <div class="playbar__item_middle pause-panel">
      <!-- 上一曲按钮 -->
      <button class="button_icon large prev-song" @click="prevSong">
        <PrevSongIcon />
      </button>
      <!-- 播放/暂停按钮 -->
      <div
        class="pause-song"
        @click="togglePlay"
      >
        <PausedIcon v-if="paused" />
        <PlayingIcon v-else />
      </div>
      <!-- 下一曲按钮 -->
      <button class="button_icon large next-song" @click="nextSong">
        <NextSongIcon />
      </button>
    </div>
    <!-- 中间区域 结束 -->
    <!-- 右边区域 开始-->
    <sound-panel
      class="playbar__item_right "
      :currentMode="currentMode"
      @changeVolume="changeVolume"
      @changeMode="changeMode"
    ></sound-panel>
    <!-- 右边区域 结束-->
    <div class="progress-bar">
      <!-- TODO -->
      <ProgressBar :totalTime="duration" :isPlaying="!paused" @jumpTo="handleJumpTo" />
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
import { getSongDetail, getSongURL, getPlaylistDetail, } from '@/service';
import { formatTime } from '@/utilitys';
import SongPlayer from './SongPlayer.vue';
import ProgressBar from './ProgressBar';
import { mapState } from 'vuex';
import PLAYMODES from './PLAYMODES.js';
import PrevSongIcon from '../SVGIcons/PrevSongIcon';
import NextSongIcon from '../SVGIcons/NextSongIcon';
import PausedIcon from '../SVGIcons/PausedIcon';
import PlayingIcon from '../SVGIcons/PlayingIcon';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: "Playbar",
  components: {
    SongInfoPanel,
    SoundPanel,
    SongPlayer,
    ProgressBar,
    PrevSongIcon,
    NextSongIcon,
    PausedIcon,
    PlayingIcon,
  },
  data() {
    return {
      formatTime: formatTime,
      isShowSongPlayer: false,
      songUrl: null,
      paused: true,
      name: null,
      album: null,
      artists: [],
      currentMode: PLAYMODES.LOOP,
      volume: 0.5,
      duration: 0,
    }
  },
  computed: {
    progressPercent() {
      // TODO
      // if(!this.currentSong.currentTime || !this.currentSong.duration) {
      //   return 0;
      // }
      // return (this.currentSong.currentTime * 1000 / this.currentSong.duration).toFixed(2);
    },
    ...mapState('playlist', {
      currentSongId: state => state.currentSongId,
    }),
    ...mapGetters('playlist', [
      'trackIds',
    ]),
  },
  methods: {
    play() {
      if (this.$refs.audio && this.songUrl) {
        this.$refs.audio.play();
      }
    },
    pause() {
      if (this.$refs.audio && this.songUrl) {
        this.$refs.audio.pause();
      }
    },
    togglePlay() {
      if (this.paused) {
        this.play();
      } else {
        this.pause();
      }
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
    },
    animateProgressBar() {
      window.requestAnimationFrame(() => {

      });
    },
    handlePlay() {
      this.paused = false;
    },
    handlePause() {
      this.paused = true;
    },
    changeMode() {
        const playModeValues = Object.values(PLAYMODES);
      let currentIdx = playModeValues.indexOf(this.currentMode);
      currentIdx = (currentIdx + 1 + playModeValues.length) % playModeValues.length;
      this.currentMode = playModeValues[currentIdx];
    },
    setAudioEleVolume(newVolume) {
      const audio = this.$refs.audio;
      if (audio) {
        audio.volume = newVolume;
      }
    },
    changeVolume(val) {
      this.volume = val;
    },
    prevSong() {
      switch (this.currentMode) {
        case PLAYMODES.LOOP: {
          const currentIdx = this.trackIds.indexOf(this.currentSongId);
          const newIdx = (currentIdx - 1 + this.trackIds.length) % this.trackIds.length;
          this.setCurrentSongId(this.trackIds[newIdx]);
          break;
        }
        case PLAYMODES.ONE_LOOP: {
          if (this.$refs.audio) {
            this.$refs.audio.currentTime = 0;
          }
          break;
        }
        case PLAYMODES.SHUFFLE: {
          const newIdx = Math.round(Math.random() * this.trackIds.length);
          this.setCurrentSongId(this.trackIds[newIdx]);
          break;
        }
        default:
          return;
      }
    },
    nextSong() {
      switch (this.currentMode) {
        case PLAYMODES.LOOP: {
          const currentIdx = this.trackIds.indexOf(this.currentSongId);
          const newIdx = (currentIdx + 1 + this.trackIds.length) % this.trackIds.length;
          this.setCurrentSongId(this.trackIds[newIdx]);
          break;
        }
        case PLAYMODES.ONE_LOOP: {
          if (this.$refs.audio) {
            this.$refs.audio.currentTime = 0;
          }
          break;
        }
        case PLAYMODES.SHUFFLE: {
          const newIdx = Math.round(Math.random() * this.trackIds.length);
          this.setCurrentSongId(this.trackIds[newIdx]);
          break;
        }
        default:
          return;
      }
    },
    handleLoadedMetaData({ target: { duration } }) {
      this.duration = duration;
    },
    handleJumpTo(percent) {
      this.$refs.audio.currentTime = percent * this.$refs.audio.duration;
    },
    ...mapMutations('playlist', [
      'setCurrentSongId',
    ])
  },
  mounted() {
    // this.registeDragLable(this.$el.querySelector(".progress__state"), this.$el.querySelector(".progress-bar"))
    // initial set volume
    this.setAudioEleVolume(this.volume);
  },
  watch: {
    currentSongId: function(id) {
      if (id) {
        getSongURL(id).then(
          res => {
            const newSongUrl = res.data.data[0].url;
            if (newSongUrl) {
              this.songUrl = newSongUrl;
            } else {
              this.nextSong();
            }
          },
          error => alert('get song url error '+ error)
        );
        getSongDetail(id).then(
          res => {
            const song = res.data.songs[0];
            this.name = song.name;
            this.artists = song.ar;
            this.album = song.al;
          },
          error => alert('get song detail error ' + error)
        );
      }
    },
    volume(newVolume) {
      this.setAudioEleVolume(newVolume);
    },
  }
}
</script>
<style lang="sass">
@import "../config.sass";

.playbar
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
  height: 100%;
  z-index: 1;
  background-color: $whitegray;
.playbar__item_left
  max-width: calc(50% - 100px);
.playbar__item_right
  max-width: calc(50% - 100px);

// 中间播放控制样式
.playbar__item_middle
  position: absolute;
  left: calc(50% - 100px);
  width: 200px;
  top: 0;
  height: 100%;
.pause-panel
  display: flex;
  align-items: center;
  justify-content: center;
.pause-song
  background-color: $orange;
  border-radius: 50%;
  color: white
  padding: 5px;
  font-size: inherit;
  width: 2em;
  height: 2em;
  cursor: pointer;
.pause-song:active
  opacity: 0.3;
.prev-song, .pause-song, .next-song
  margin: 0 0.5em;

// 进度条位置
.progress-bar
  position: absolute;
  top: -6px;
  left: 0;
  width: 100%;


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
  min-width: 5.5em;

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

