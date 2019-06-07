<template>
  <div class="play-status-btn">
    <SvgBtn
      :large="large"
      :xlarge="xlarge"
      :middle="middle"
      :small="small"
      :primary="isCurrentTrack"
    >
      <Pause v-if="isCurrentTrack && !paused" />
      <PlayArrow v-else />
    </SvgBtn>
  </div>
</template>

<script lang="ts">
import SvgBtn from "@/components/globals/SvgBtn.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, State, namespace } from "vuex-class";
import PlayArrow from "@/components/SVGIcons/PlayArrow.vue";
import Pause from "@/components/SVGIcons/Pause.vue";

const playlist = namespace("playlist");
const playbar = namespace("playbar");
// if current audio is paused, show paused icon, else show playing icon,
// click then toggle paly status
@Component({
  components: { SvgBtn, PlayArrow, Pause }
})
export default class PlayStatusBtn extends Vue {
  @Prop(Boolean) small!: boolean;

  @Prop(Boolean) middle!: boolean;

  @Prop(Boolean) large!: boolean;

  @Prop(Boolean) xlarge!: boolean;

  @Prop(Boolean) primary!: boolean;
  @Prop(Number) trackId!: number;
  @playlist.State currentSongId!: number;
  @playbar.State paused!: boolean;
  get isCurrentTrack() {
    return this.currentSongId === this.trackId;
  }
}
</script>

<style lang="sass" scoped>
.play-status-btn
  display: flex
  align-items: center
  justify-content: center
</style>
