<template>
  <more-item @click.native="handleComment">
    <CommentIcon slot="icon" />
    <span slot="txt" class="txt">评论</span>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import MoreItem from "@/components/more-list/MoreItem.vue";
import CommentIcon from "@/components/SVGIcons/Comment.vue";

@Component({
  components: { MoreItem, CommentIcon }
})
export default class CommentTrack extends Vue {
  @Prop() track!: Track;
  handleComment() {
    this.$router.push(`/song/${this.track.id}`);
  }
}
</script>
