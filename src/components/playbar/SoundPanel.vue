<template>
<div class="sound-panel">
  <!-- 打开/关闭音量 -->
  <button
    class="button_icon large mute-volume"
    @click="toggleVolume"
    >
    <svg v-if="isVolume" class="i-volume" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M20 16 C20 8 15 2 15 2 L8 10 2 10 2 22 8 22 15 30 C15 30 20 24 20 16 Z M21 2 C21 2 25 6 25 16 25 26 21 30 21 30 M27 4 C27 4 30 8 30 16 30 24 27 28 27 28"></path>
    </svg>
    <svg v-if="!isVolume" class="i-mute" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M20 16 C20 8 15 2 15 2 L8 10 2 10 2 22 8 22 15 30 C15 30 20 24 20 16 Z"></path>
    </svg>
  </button>
  <!-- 调节音量大小 -->
  <input class="volume__setter" v-model="volume" type="range" :min="MINVOLUME" :max="MAXVOLUME">
  <!-- 播放循环模式 -->
  <button
    class="button_icon large play-mode"
    @click=" $emit('changeMode')"
    >
    <svg v-if="currentMode === PLAYMODES.LOOP" class="i-loop" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M8 4 H 20 C 28 4, 28 4, 28 12 V 24 L 24 20 M28 24 L32 20 M24 28 H12 C4 28, 4 28, 4 20 V8 L0 12 M4 8 L8 12"></path>
    </svg>
    <svg v-if="currentMode === PLAYMODES.ONE_LOOP" class="i-one-cycle" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M8 4 H 20 C 28 4, 28 4, 28 12 V 24 L 24 20 M28 24 L32 20 M24 28 H12 C4 28, 4 28, 4 20 V8 L0 12 M4 8 L8 12 M16 12 V20"></path>
    </svg>
    <svg v-if="currentMode === PLAYMODES.SHUFFLE" class="i-shuffle" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path d="M4 4 L12 12 M20 20 L28 28 V22 M28 28 H22 M4 28 L28 4 H22 M28 4 V10"></path>
    </svg>
  </button>
  <!-- 音效调节 -->
  <button class="button_icon large sound-effect" :class="{'sound-effect-active': isEffect}">
    <svg class="i-options" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M28 6 L4 6 M28 16 L4 16 M28 26 L4 26 M24 3 L24 9 M8 13 L8 19 M20 23 L20 29"></path>
    </svg>
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
    <svg class="i-menu" viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M4 8 L28 8 M4 16 L28 16 M4 24 L28 24"></path>
    </svg>
  </button>
</div>
</template>
<script>
import PopupMenu from '../PopupMenu.vue';
import SelectList from '../more-list/SelectList.vue';
import AwesomeButton from '../AwesomeButton.vue';
import PLAYMODES from './PLAYMODES'


export default {
  name: "SoundPanel",
  components: {
    PopupMenu, SelectList, AwesomeButton,
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

