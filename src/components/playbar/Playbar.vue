<template>
  <div>
    <transition name="slide-up">
      <song-player
        v-show="isShowSongPlayer"
        :currentTime="currentTime"
        :name="name"
        :album="album"
        :artists="artists"
      />
    </transition>
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
        @timeupdate="handleTimeupdate"
      />
      <!-- 左边区域 开始-->

      <song-info-panel
        class="playbar__left playbar__song-info"
        :name="name"
        :artists="artists"
        :albumImg="album && album.picUrl"
        :isShowSongPlayer="isShowSongPlayer"
        @toggle-song-player="toggleSongPlayer"
        :isLoading="isLoading"
        :disabled="disabled"
      />
      <!-- 左边区域 结束-->

      <!-- 中间区域 开始-->
      <div class="playbar__middle">
        <div class="pause-panel">
          <!-- 上一曲按钮 -->
          <SvgBtn
            xlarge
            class="prev-song"
            @click.native="prevSong"
            :disabled="disabled"
          >
            <SkipPreviousIcon />
          </SvgBtn>
          <!-- 播放/暂停按钮 -->
          <SvgBtn
            xlarge
            primary
            class="pause-song"
            @click.native="togglePlay"
            :disabled="disabled"
          >
            <PlayArrowIcon v-if="paused" />
            <PauseIcon v-else />
          </SvgBtn>
          <!-- 下一曲按钮 -->
          <SvgBtn
            xlarge
            class="next-song"
            @click.native="nextSong"
            :disabled="disabled"
          >
            <SkipNextIcon />
          </SvgBtn>
        </div>
      </div>
      <!-- 中间区域 结束 -->
      <!-- 右边区域 开始-->
      <sound-panel
        class="playbar__right"
        :currentMode="currentMode"
        @changeVolume="changeVolume"
        @changeMode="changeMode"
        :isLoading="isLoading"
        :disabled="disabled"
      ></sound-panel>
      <!-- 右边区域 结束-->
      <div class="playbar__progress">
        <!-- TODO -->
        <ProgressBar
          :totalTime="duration"
          :isPlaying="!paused"
          @jumpTo="handleJumpTo"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import SongInfoPanel from "./SongInfoPanel.vue";
import SoundPanel from "./SoundPanel.vue";
import { getSongDetail, getSongURL } from "@/service";
import { formatTime } from "@/utilitys";
import SongPlayer from "./SongPlayer.vue";
import ProgressBar from "./ProgressBar.vue";
import PrevSongIcon from "@/components/SVGIcons/PrevSongIcon.vue";
import NextSongIcon from "@/components/SVGIcons/NextSongIcon.vue";
import { PlayMode, Album, Artist } from "@/types";
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Getter, namespace } from "vuex-class";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import SkipPreviousIcon from "@/components/SVGIcons/SkipPrevious.vue";
import SkipNextIcon from "@/components/SVGIcons/SkipNext.vue";
import PlayArrowIcon from "@/components/SVGIcons/PlayArrow.vue";
import PauseIcon from "@/components/SVGIcons/Pause.vue";

const playlist = namespace("playlist");
const playbar = namespace("playbar");
const notification = namespace("notification");

@Component({
  components: {
    SongInfoPanel,
    SoundPanel,
    SongPlayer,
    ProgressBar,
    PrevSongIcon,
    NextSongIcon,
    SvgBtn,
    SkipPreviousIcon,
    SkipNextIcon,
    PlayArrowIcon,
    PauseIcon
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
  currentTime: number = 0; // unit second
  // get progressPercent():  {
  // TODO
  // if(!this.currentSong.currentTime || !this.currentSong.duration) {
  //   return 0;
  // }
  // return (this.currentSong.currentTime * 1000 / this.currentSong.duration).toFixed(2);
  // }
  @notification.Mutation setMsg!: (msg: string) => void;

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
    if (id === undefined) {
      return;
    }
    this.isLoading = true;
    getSongURL(id).then(
      res => {
        const newSongUrl =
          res &&
          res.data &&
          res.data.data &&
          res.data.data[0] &&
          res.data.data[0].url;
        if (newSongUrl) {
          this.songUrl = newSongUrl;
        } else {
          this.nextSong();
        }
      },
      error => {
        this.setMsg(`获取歌曲地址错误${error && error.msg ? error.msg : ""}！`);
      }
    );
    getSongDetail(id).then(
      res => {
        const song = res.data.songs[0];
        this.name = song.name;
        this.artists = song.ar;
        this.album = song.al;
      },
      error => {
        this.setMsg(`获取歌曲数据错误${error && error.msg ? error.msg : ""}！`);
      }
    );
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
        const newIdx =
          (currentIdx - 1 + this.trackIds.length) % this.trackIds.length;
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
        const newIdx =
          (currentIdx + 1 + this.trackIds.length) % this.trackIds.length;
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
  handleTimeupdate(event: Event) {
    this.currentTime = (event.target as HTMLAudioElement).currentTime;
  }
}
</script>
<style lang="sass" scoped>

.playbar
  position: relative
  text-align: center
  min-width: 1000px
  height: 100%
  z-index: 1
  &__left
    float: left
    height: 100%
  &__right
    float: right
    height: 100%
  &__middle
    height: 100%
    display: inline-block
  &__progress
    position: absolute
    top: -6px
    left: 0
    width: 100%

// 中间播放控制样式
.pause-panel
  height: 100%
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
  display: inline-block
.slide-up
  &-enter-active, &-leave-active
    transition: all 0.25s
  &-enter, &-leave-to
    opacity: 0
    transform: translateY(100px)
</style>
