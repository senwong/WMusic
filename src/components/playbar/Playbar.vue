<template>
  <div>
    <div class="playbar">
      <audio
        :src="songUrl | convert2Https"
        autoplay
        ref="audio"
        @play="handlePlay"
        @pause="handlePause"
        @loadedmetadata="handleLoadedMetaData"
        @ended="nextSong"
        @canplaythrough="handleCanPlayThrough"
        @waiting="handleWaiting"
      />
      <!-- 左边区域 开始-->
      <song-info-panel
        class="playbar__item_left"
        :name="name"
        :artists="artists"
        :albumImg="album && album.picUrl"
        :isShowSongPlayer="isShowSongPlayer"
        @toggle-song-player="toggleSongPlayer"
        :isLoading="isLoading"
        :disabled="disabled"
      ></song-info-panel>
      <!-- 左边区域 结束-->
      <!-- 中间区域 开始-->
      <div class="playbar__item_middle pause-panel">
        <!-- 上一曲按钮 -->
        <SvgBtnWrapper xlarge class="prev-song" @click.native="prevSong" :disabled="disabled">
          <PrevSongIcon />
        </SvgBtnWrapper>
        <!-- 播放/暂停按钮 -->
        <SvgBtnWrapper
          xlarge
          primary
          class="pause-song"
          @click.native="togglePlay"
          :disabled="disabled"
        >
          <PausedIcon v-if="paused" />
          <PlayingIcon v-else />
        </SvgBtnWrapper>
        <!-- 下一曲按钮 -->
        <SvgBtnWrapper xlarge class="next-song" @click.native="nextSong" :disabled="disabled">
          <NextSongIcon />
        </SvgBtnWrapper>
      </div>
      <!-- 中间区域 结束 -->
      <!-- 右边区域 开始-->
      <sound-panel
        class="playbar__item_right"
        :currentMode="currentMode"
        @changeVolume="changeVolume"
        @changeMode="changeMode"
        :isLoading="isLoading"
        :disabled="disabled"
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
<script lang="ts">
import SongInfoPanel from "./SongInfoPanel.vue";
import SoundPanel from "./SoundPanel.vue";
import { getSongDetail, getSongURL, getPlaylistDetail } from "@/service";
import { formatTime } from "@/utilitys";
import SongPlayer from "./SongPlayer.vue";
import ProgressBar from "./ProgressBar.vue";
import { mapState } from "vuex";
import PrevSongIcon from "@/components/SVGIcons/PrevSongIcon.vue";
import NextSongIcon from "@/components/SVGIcons/NextSongIcon.vue";
import PausedIcon from "@/components/SVGIcons/PausedIcon.vue";
import PlayingIcon from "@/components/SVGIcons/PlayingIcon.vue";
import { PlayMode, Album, Artist } from "@/types";
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Getter, namespace } from "vuex-class";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";

const playlist = namespace("playlist");
const playbar = namespace("playbar");

@Component({
  components: {
    SongInfoPanel,
    SoundPanel,
    SongPlayer,
    ProgressBar,
    PrevSongIcon,
    NextSongIcon,
    PausedIcon,
    PlayingIcon,
    SvgBtnWrapper
  }
})
export default class Playbar extends Vue {
  formatTime = formatTime;

  isShowSongPlayer: boolean = false;

  songUrl: string = "";

  paused: boolean = true;

  name: string = "";

  album: Album | null = null;

  artists: Artist[] = [];

  currentMode: PlayMode = PlayMode.Loop;

  volume: number = 0.5;

  duration: number = 0;

  isLoading: boolean = false;

  // get progressPercent():  {
  // TODO
  // if(!this.currentSong.currentTime || !this.currentSong.duration) {
  //   return 0;
  // }
  // return (this.currentSong.currentTime * 1000 / this.currentSong.duration).toFixed(2);
  // }
  get disabled(): boolean {
    return this.songUrl.length < 1 || this.isLoading;
  }

  $refs!: {
    audio: HTMLAudioElement;
  };

  @playlist.State currentSongId!: number;

  @playlist.Getter trackIds!: number[];

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  @playbar.Mutation setPaused!: (paused: boolean) => void;
  @playbar.Mutation setAudio!: (audio: HTMLAudioElement) => void;

  @Watch("currentSongId")
  onCurrentSongIdChange(id: number) {
    if (id) {
      this.isLoading = true;
      getSongURL(id).then(
        res => {
          const newSongUrl = res.data.data[0].url;
          if (newSongUrl) {
            this.songUrl = newSongUrl;
          } else {
            this.nextSong();
          }
        },
        error => alert(`get song url error ${error}`)
      );
      getSongDetail(id).then(
        res => {
          const song = res.data.songs[0];
          this.name = song.name;
          this.artists = song.ar;
          this.album = song.al;
        },
        error => alert(`get song detail error ${error}`)
      );
    }
  }

  @Watch("volume")
  onVolumeChange(val: number) {
    this.setAudioEleVolume(val);
  }
  @Watch("paused")
  onPausedChange(val: boolean) {
    this.setPaused(val);
  }

  mounted() {
    // this.registeDragLable(this.$el.querySelector(".progress__state"), this.$el.querySelector(".progress-bar"))
    // initial set volume
    this.setAudioEleVolume(this.volume);
    this.setAudio(this.$refs.audio);
  }

  play() {
    if (this.$refs.audio && this.songUrl) {
      this.$refs.audio.play();
    }
  }

  pause() {
    if (this.$refs.audio && this.songUrl) {
      this.$refs.audio.pause();
    }
  }

  togglePlay() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  /**
   * 拖动状态栏时间戳，改变播放进度
   * @param {HTMLElement} progressLable
   */
  // registeDragLable(progressLable: HTMLElement, parentEle: HTMLElement) {
  //   let enableDray = false;
  //   progressLable.addEventListener("mousedown", () => enableDray = true)
  //   document.body.addEventListener("mouseup", (e) => enableDray = false)
  //   document.body.addEventListener("mouseleave", () => enableDray = false)
  //   document.body.addEventListener("mousemove", (e) => {
  //     if(!enableDray) return;
  //     progressLable.style.left = e.clientX - 40 + "px";

  //     const percent =  (e.clientX - 40) / parseInt(getComputedStyle(parentEle).width.slice(0, -2));
  //     const currentTime = percent * this.currentSong.duration / 1000;
  //     this.currentSong.changeCurrentTime(currentTime);
  //   })
  // }
  toggleSongPlayer() {
    this.isShowSongPlayer = !this.isShowSongPlayer;
  }

  animateProgressBar() {
    window.requestAnimationFrame(() => {});
  }

  handlePlay() {
    this.paused = false;
  }

  handlePause() {
    this.paused = true;
  }

  changeMode() {
    const PLAYMODES = [PlayMode.Loop, PlayMode.OneLoop, PlayMode.Shuffle];
    let currentIdx = PLAYMODES.indexOf(this.currentMode);
    currentIdx = (currentIdx + 1 + PLAYMODES.length) % PLAYMODES.length;
    this.currentMode = PLAYMODES[currentIdx];
  }

  setAudioEleVolume(newVolume: number) {
    const { audio } = this.$refs;
    if (audio) {
      audio.volume = newVolume;
    }
  }

  changeVolume(val: number) {
    this.volume = val;
  }

  prevSong() {
    switch (this.currentMode) {
      case PlayMode.Loop: {
        const currentIdx = this.trackIds.indexOf(this.currentSongId);
        const newIdx = (currentIdx - 1 + this.trackIds.length) % this.trackIds.length;
        this.setCurrentSongId(this.trackIds[newIdx]);
        break;
      }
      case PlayMode.OneLoop: {
        if (this.$refs.audio) {
          this.$refs.audio.currentTime = 0;
        }
        break;
      }
      case PlayMode.Shuffle: {
        const newIdx = Math.round(Math.random() * this.trackIds.length);
        this.setCurrentSongId(this.trackIds[newIdx]);
        break;
      }
      default:
    }
  }

  nextSong() {
    switch (this.currentMode) {
      case PlayMode.Loop: {
        const currentIdx = this.trackIds.indexOf(this.currentSongId);
        const newIdx = (currentIdx + 1 + this.trackIds.length) % this.trackIds.length;
        this.setCurrentSongId(this.trackIds[newIdx]);
        break;
      }
      case PlayMode.OneLoop: {
        if (this.$refs.audio) {
          this.$refs.audio.currentTime = 0;
        }
        break;
      }
      case PlayMode.Shuffle: {
        const newIdx = Math.round(Math.random() * this.trackIds.length);
        this.setCurrentSongId(this.trackIds[newIdx]);
        break;
      }
      default:
    }
  }

  handleLoadedMetaData({ target }: { target: HTMLAudioElement }) {
    this.duration = target.duration;
  }

  handleJumpTo(percent: number) {
    this.$refs.audio.currentTime = percent * this.$refs.audio.duration;
  }

  handleCanPlayThrough() {
    this.isLoading = false;
  }

  handleWaiting() {
    this.isLoading = true;
  }
}
</script>
<style lang="sass" scoped>
@import "../config.sass"

.playbar
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: stretch
  position: relative
  height: 100%
  z-index: 1
  background-color: $whitegray
.playbar__item_left
  max-width: calc(50% - 100px)
.playbar__item_right
  max-width: calc(50% - 100px)

// 中间播放控制样式
.playbar__item_middle
  position: absolute
  left: calc(50% - 100px)
  top: 0
  height: 100%
.pause-panel
  display: flex
  align-items: center
  justify-content: center
.pause-song
  flex-shrink: 0
  flex-grow: 0
.pause-song:active
  opacity: 0.3
.prev-song, .pause-song, .next-song
  margin: 0 1em
  flex: 0 0 auto

// 进度条位置
.progress-bar
  position: absolute
  top: -6px
  left: 0
  width: 100%


.progress__past
  height: 100%
  width: 0%
  background-color: $orange
.progress__state
  position: absolute
  visibility: visible
  height: 1em
  line-height: 1em
  font-size: 1em
  position: absolute
  top: -0.5em
  background: $mask
  border-radius: 1em
  display: inline-block
  padding: 0.2em 0.5em
  min-width: 5.5em

.slide-up-enter-active
  animation: slide-up 0.5s
.slide-up-leave-active
  animation: slide-up .5s reverse
@keyframes slide-up
  from
    top: calc(100% - #{$footerHeight})
  to
    top: 0
</style>
