<template>
<div class="sound-panel">
  <!-- 打开/关闭音量 -->
  <button
    class="button_icon large mute-volume"
    @click="toggleVolume"
    >
    <VolumeIcon v-if="isVolume" />
    <VolumeMuteIcon v-if="!isVolume" />
  </button>
  <!-- 调节音量大小 -->
  <input class="volume__setter" v-model="volume" type="range" :min="MINVOLUME" :max="MAXVOLUME">
  <!-- 播放循环模式 -->
  <button
    class="button_icon large play-mode"
    @click=" $emit('changeMode')"
    >
    <LoopIcon v-if="currentMode === PLAYMODES.LOOP" />
    <OneLoopIcon v-if="currentMode === PLAYMODES.ONE_LOOP" />
    <ShuffleIcon v-if="currentMode === PLAYMODES.SHUFFLE" />
  </button>
  <!-- 音效调节 -->
  <button class="button_icon large sound-effect" :class="{'sound-effect-active': isEffect}">
    <OptionsIcon />
  </button>
  <popup-menu :target="soundEffectButton">
    <select-list
      :data="soundEffects"
      @selected-change="effectChange"
    >
      <div slot="title" class="sound-effect-title">
        <div class="sound-effect-set">
          <span class="set-title">音效设置</span>
          <awesome-button
            :is-close="isEffect"
            @toggle="toggleEffect"></awesome-button>
        </div>
        <p class="sound-effect-desc">环境音效</p>
      </div>
    </select-list>
  </popup-menu>
  <!-- 播放列表 -->
  <button
    class="button_icon large play-list"
    @click="toggleRightPlaylist"
  >
    <MenuIcon />
  </button>
</div>
</template>
<script>
import PopupMenu from '../PopupMenu.vue';
import SelectList from '../more-list/SelectList.vue';
import AwesomeButton from '../AwesomeButton.vue';
import PLAYMODES from './PLAYMODES'
import LoopIcon from '@/components/SVGIcons/LoopIcon';
import OneLoopIcon from '@/components/SVGIcons/OneLoopIcon';
import ShuffleIcon from '@/components/SVGIcons/ShuffleIcon';
import OptionsIcon from '@/components/SVGIcons/OptionsIcon';
import VolumeIcon from '@/components/SVGIcons/VolumeIcon';
import VolumeMuteIcon from '@/components/SVGIcons/VolumeMuteIcon';
import MenuIcon from '@/components/SVGIcons/MenuIcon';

export default {
  name: "SoundPanel",
  components: {
    PopupMenu, SelectList, AwesomeButton, LoopIcon, OneLoopIcon, ShuffleIcon, OptionsIcon, VolumeIcon, VolumeMuteIcon, MenuIcon,
  },
  data() {
    return {
      isVolume: true,
      volume: 50,
      oldVolume: 50,
      MINVOLUME: 0,
      MAXVOLUME: 100,
      soundEffectButton: null,
      soundEffects: [
        {id: 1, title: "无", isSelected: false},
        {id: 2, title: "演唱会", isSelected: false},
        {id: 3, title: "卧室", isSelected: false},
        {id: 4, title: "石屋", isSelected: false},
        {id: 5, title: "剧院", isSelected: false},
        {id: 6, title: "洞穴", isSelected: false},
        {id: 7, title: "空巷", isSelected: false},
        {id: 8, title: "城市", isSelected: false},
      ],
      currentEffect: 1,
      isEffect: false,
      PLAYMODES,
    }
  },
  props: [ 'currentMode' ],
  methods: {
    toggleVolume() {
      if (this.volume > this.MINVOLUME) {
        this.oldVolume = this.volume;
        this.volume = this.MINVOLUME;
      } else {
        this.volume = this.oldVolume;
      }
    },
    toggleEffect() {
      this.isEffect = !this.isEffect;
    },
    effectChange(id) {
      console.log("effect change ", id)
      this.currentEffect = id;
      this.isEffect = id > 1 ? true : false;
    },
    toggleRightPlaylist() {
      this.$store.commit('toggleRightPlaylist');
    },
  },
  watch: {
    volume: function(newVal, oldVal) {
      this.isVolume = newVal > this.MINVOLUME ? true : false;
      this.$emit('changeVolume', newVal / 100);
    },
  },
  mounted() {
    this.soundEffectButton = this.$el.querySelector(".sound-effect")
  },
  computed: {
    playList() {
      return this.$store.state.playList;
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../config.sass";
.sound-panel
  display: flex;
  align-items: center;
  justify-content: flex-end;
.volume__setter
  width: 6em;
  margin: 0;
  font-size: inherit;
.mute-volume, .volume__setter, .play-mode, .sound-effect, .play-list
  margin-right: 1em;
// 音效设置弹出菜单
.sound-effect-set
  display: flex;
  align-items: center;
.sound-effect-title
  padding: 6px;
.sound-effect-desc
  font-size: 1.0em;
  color: $orange;
.set-title
  font-size: 1.4em;
  margin-right: 1.4em;
.sound-effect-active
  color: $orange;

.volume__setter
  -webkit-appearance: none;
  height: 0.6em;
  border-radius: 0.4em;
  background: $black-3;
  outline: none;
  &::-moz-range-thumb
    width: 1em;
    height: 1em;
    cursor: pointer;
    border-radius: 0.5em;
    background-color: white;
  &::-webkit-slider-thumb
    -webkit-appearance: none;
    appearance: none;
    width: 1em;
    height: 1em;
    cursor: pointer;
    border-radius: 0.5em;
    background-color: white;
</style>

