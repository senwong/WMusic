<template>
  <div class="sound-panel">
    <!-- 打开/关闭音量 -->
    <SvgBtnWrapper xlarge class="mute-volume" @click.native="toggleVolume" :disabled="disabled">
      <VolumeIcon v-if="isVolume" />
      <VolumeMuteIcon v-if="!isVolume" />
    </SvgBtnWrapper>
    <!-- 调节音量大小 -->
    <RangeInput v-model="volume" :min="MINVOLUME" :max="MAXVOLUME" />
    <!-- <input class="volume__setter" v-model="volume" type="range" :min="MINVOLUME" :max="MAXVOLUME"> -->
    <!-- 播放循环模式 -->
    <SvgBtnWrapper
      xlarge
      class="play-mode"
      @click.native="$emit('changeMode')"
      :disabled="disabled"
    >
      <LoopIcon v-if="currentMode === PlayMode.Loop" />
      <OneLoopIcon v-if="currentMode === PlayMode.OneLoop" />
      <ShuffleIcon v-if="currentMode === PlayMode.Shuffle" />
    </SvgBtnWrapper>
    <!-- 音效调节 -->
    <SvgBtnWrapper
      xlarge
      class="sound-effect"
      :class="{ 'sound-effect-active': isEffect }"
      :disabled="disabled"
    >
      <OptionsIcon />
    </SvgBtnWrapper>

    <popup-menu :target="soundEffectButton">
      <select-list :data="soundEffects" @selected-change="effectChange">
        <div slot="title" class="sound-effect-title">
          <div class="sound-effect-set">
            <span class="set-title">音效设置</span>
            <awesome-button :is-close="isEffect" @toggle="toggleEffect"></awesome-button>
          </div>
          <p class="sound-effect-desc">环境音效</p>
        </div>
      </select-list>
    </popup-menu>
    <!-- 播放列表 -->
    <SvgBtnWrapper xlarge class="play-list" @click.native="toggleRightPlaylist">
      <MenuIcon />
    </SvgBtnWrapper>
  </div>
</template>
<script lang="ts">
import PopupMenu from "../PopupMenu.vue";
import SelectList from "../more-list/SelectList.vue";
import AwesomeButton from "../AwesomeButton.vue";
import LoopIcon from "@/components/SVGIcons/LoopIcon.vue";
import OneLoopIcon from "@/components/SVGIcons/OneLoopIcon.vue";
import ShuffleIcon from "@/components/SVGIcons/ShuffleIcon.vue";
import OptionsIcon from "@/components/SVGIcons/OptionsIcon.vue";
import VolumeIcon from "@/components/SVGIcons/VolumeIcon.vue";
import VolumeMuteIcon from "@/components/SVGIcons/VolumeMuteIcon.vue";
import MenuIcon from "@/components/SVGIcons/MenuIcon.vue";
import { PlayMode, Album, Artist } from "@/types";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Getter, namespace } from "vuex-class";
import SvgBtnWrapper from "@/components/globals/SvgBtnWrapper.vue";
import RangeInput from "@/components/globals/RangeInput.vue";

@Component({
  components: {
    PopupMenu,
    SelectList,
    AwesomeButton,
    LoopIcon,
    OneLoopIcon,
    ShuffleIcon,
    OptionsIcon,
    VolumeIcon,
    VolumeMuteIcon,
    MenuIcon,
    SvgBtnWrapper,
    RangeInput
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

  toggleRightPlaylist() {
    this.$store.commit("toggleRightPlaylist");
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
.volume__setter
  width: 6em
  margin: 0
  font-size: inherit
.mute-volume, .volume__setter, .play-mode, .sound-effect, .play-list
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
