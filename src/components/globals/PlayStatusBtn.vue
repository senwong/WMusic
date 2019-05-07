<template>
  <div class="play-status-btn">
    <SvgBtnWrapper
      :large="large"
      :xlarge="xlarge"
      :middle="middle"
      :small="small"
      :primary="primary"
    >
      <PausedIcon v-if="paused" />
      <PlayingIcon v-else />
    </SvgBtnWrapper>
  </div>
</template>

<script lang="ts">
import SvgBtnWrapper from "./SvgBtnWrapper.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
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
  @Prop(Boolean) small!: boolean;

  @Prop(Boolean) middle!: boolean;

  @Prop(Boolean) large!: boolean;

  @Prop(Boolean) xlarge!: boolean;

  @Prop(Boolean) primary!: boolean;

  @playbar.State paused!: boolean;
}
</script>

<style></style>
