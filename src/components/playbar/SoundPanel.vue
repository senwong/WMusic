<template>
  <div class="sound-panel">
    <!-- 打开/关闭音量 -->
    <SvgBtn
      xlarge
      class="sound-panel__mute"
      @click.native="toggleVolume"
      :disabled="disabled"
    >
      <VolumeUpIcon v-if="volume >= 50" />
      <VolumeDownIcon v-else-if="volume >= 1" />
      <VolumeMuteIcon v-else />
    </SvgBtn>
    <!-- 调节音量大小 -->
    <RangeInput
      class="sound-panel__volume-range"
      v-model="volume"
      :min="MINVOLUME"
      :max="MAXVOLUME"
    />
    <!-- <input class="volume__setter" v-model="volume" type="range" :min="MINVOLUME" :max="MAXVOLUME"> -->
    <!-- 播放循环模式 -->
    <SvgBtn
      xlarge
      class="sound-panel__repeat-mode"
      @click.native="$emit('changeMode')"
      :disabled="disabled"
    >
      <SoundRepeatIcon v-if="currentMode === PlayMode.Loop" />
      <SoundRepeatOneIcon v-if="currentMode === PlayMode.OneLoop" />
      <SoundShuffleIcon v-if="currentMode === PlayMode.Shuffle" />
    </SvgBtn>
    <!-- 音效调节 -->
    <SvgBtn
      xlarge
      class="sound-panel__sound-effect"
      :class="{ 'sound-panel__sound-effect--active': isEffect }"
      :disabled="disabled"
    >
      <SettingsInputCompositeIcon />
    </SvgBtn>

    <!-- <popup-menu :target="soundEffectButton">
      <select-list :data="soundEffects" @selected-change="effectChange">
        <div slot="title" class="sound-effect-title">
          <div class="sound-effect-set">
            <span class="set-title">音效设置</span>
            <awesome-button :is-close="isEffect" @toggle="toggleEffect"></awesome-button>
          </div>
          <p class="sound-effect-desc">环境音效</p>
        </div>
      </select-list>
    </popup-menu>-->
    <!-- 播放列表 -->
    <SvgBtn
      xlarge
      class="sound-panel__playlist"
      @click.native="toggleRightPlaylist"
    >
      <QueueMusicIcon />
    </SvgBtn>
  </div>
</template>
<script lang="ts">
import { PlayMode, Album, Artist } from "@/types";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Getter, namespace } from "vuex-class";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import RangeInput from "@/components/globals/RangeInput.vue";
import QueueMusicIcon from "@/components/SVGIcons/QueueMusic.vue";
import SoundRepeatIcon from "@/components/SVGIcons/SoundRepeat.vue";
import SoundRepeatOneIcon from "@/components/SVGIcons/SoundRepeatOne.vue";
import SoundShuffleIcon from "@/components/SVGIcons/SoundShuffle.vue";
import VolumeUpIcon from "@/components/SVGIcons/VolumeUp.vue";
import VolumeDownIcon from "@/components/SVGIcons/VolumeDown.vue";
import VolumeMuteIcon from "@/components/SVGIcons/VolumeMute.vue";
import SettingsInputCompositeIcon from "@/components/SVGIcons/SettingsInputComposite.vue";

const playlist = namespace("playlist");

@Component({
  components: {
    SvgBtn,
    RangeInput,
    QueueMusicIcon,
    SoundRepeatIcon,
    SoundRepeatOneIcon,
    SoundShuffleIcon,
    VolumeUpIcon,
    VolumeDownIcon,
    VolumeMuteIcon,
    SettingsInputCompositeIcon
  }
})
export default class SoundPanel extends Vue {
  isVolume: boolean = true;

  volume: number = 50;

  oldVolume: number = 50;

  MINVOLUME: number = 0;

  MAXVOLUME: number = 100;

  soundEffectButton: HTMLElement | null = null;

  soundEffects = [
    { id: 1, title: "无", isSelected: false },
    { id: 2, title: "演唱会", isSelected: false },
    { id: 3, title: "卧室", isSelected: false },
    { id: 4, title: "石屋", isSelected: false },
    { id: 5, title: "剧院", isSelected: false },
    { id: 6, title: "洞穴", isSelected: false },
    { id: 7, title: "空巷", isSelected: false },
    { id: 8, title: "城市", isSelected: false }
  ];

  currentEffect: number = 1;

  isEffect: boolean = false;

  PlayMode = PlayMode;

  @Prop() currentMode!: PlayMode;

  @Prop() disabled!: boolean;

  @playlist.Mutation("setVisibility") setPlaylistVisibility!: (
    v: boolean
  ) => void;
  @playlist.State("isVisible") isPlaylistVisible!: boolean;

  toggleVolume() {
    if (this.volume > this.MINVOLUME) {
      this.oldVolume = this.volume;
      this.volume = this.MINVOLUME;
    } else {
      this.volume = this.oldVolume;
    }
  }

  toggleEffect() {
    this.isEffect = !this.isEffect;
  }

  effectChange(id: number) {
    console.log("effect change ", id);
    this.currentEffect = id;
    this.isEffect = id > 1;
  }

  toggleRightPlaylist(e: Event) {
    e.stopPropagation();
    this.setPlaylistVisibility(!this.isPlaylistVisible);
  }

  @Watch("volume")
  onVolumeChange(newVal: number, oldVal: number) {
    this.isVolume = newVal > this.MINVOLUME;
    this.$emit("changeVolume", newVal / 100);
  }

  mounted() {
    this.soundEffectButton = this.$el.querySelector(".sound-effect");
  }

  get playList() {
    return this.$store.state.playList;
  }
}
</script>
<style lang="sass" scoped>
@import "../config.sass"
.sound-panel
  display: flex
  align-items: center
  justify-content: flex-end
  &__mute
    margin-right: 1em
  &__volume-range
    margin-right: 1em
  &__repeat-mode
    margin-right: 1em
  &__sound-effect
    margin-right: 1em
  &__playlist
    margin-right: 1em


// 音效设置弹出菜单
.sound-effect-set
  display: flex
  align-items: center
.sound-effect-title
  padding: 6px
.sound-effect-desc
  font-size: 1.0em
  color: $orange
.set-title
  font-size: 1.4em
  margin-right: 1.4em
.sound-effect-active
  color: $orange

.volume__setter
  -webkit-appearance: none
  height: 0.6em
  border-radius: 0.4em
  background: $black-3
  outline: none
  &::-moz-range-thumb
    width: 1em
    height: 1em
    cursor: pointer
    border-radius: 0.5em
    background-color: white
  &::-webkit-slider-thumb
    -webkit-appearance: none
    appearance: none
    width: 1em
    height: 1em
    cursor: pointer
    border-radius: 0.5em
    background-color: white
</style>
