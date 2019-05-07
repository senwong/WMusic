<template>
  <div class="play-status-btn">
    <SvgBtnWrapper small @click="handleTogglePlay">
      <PausedIcon v-if="paused" />
      <PlayingIcon v-else />
    </SvgBtnWrapper>
  </div>
</template>

<script lang="ts">
import SvgBtnWrapper from "./SvgBtnWrapper.vue";
import { Vue, Component } from "vue-property-decorator";
import { Mutation, State, namespace } from "vuex-class";
import PlayingIcon from "@/components/SVGIcons/PlayingIcon.vue";
import PausedIcon from "@/components/SVGIcons/PausedIcon.vue";

const playbar = namespace("playbar");
// if current audio is paused, show paused icon, else show playing icon,
// click then toggle paly status
@Component({
  components: { SvgBtnWrapper, PlayingIcon, PausedIcon }
})
export default class PlayStatusBtn extends Vue {
  @playbar.State paused!: boolean;

  @playbar.Mutation togglePlay!: () => void;

  handleTogglePlay() {
    this.togglePlay();
  }
}
</script>

<style></style>
