<template>
  <more-item @click.native="handleComment">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">评论</span>
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
export default class CommentTrack extends Vue {
  @Prop() track!: Track;
  handleComment() {
    this.$router.push(`/song/${this.track.id}`);
  }
}
</script>

<style></style>
