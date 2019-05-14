<template>
  <MoreItem>
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">收藏</span>
  </MoreItem>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";

@Component({
  components: { DownloadIcon, MoreItem }
})
export default class FavTrack extends Vue {
  @Prop() track!: Track;
}
</script>

<style></style>
