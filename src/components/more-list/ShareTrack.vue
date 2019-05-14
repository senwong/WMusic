<template>
  <more-item @click.native="handleClick">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">分享</span>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";

@Component({
  components: { DownloadIcon, MoreItem }
})
export default class ShareTrack extends Vue {
  @Prop() track!: Track;
  handleClick() {
    // TODO
  }
}
</script>

<style></style>
