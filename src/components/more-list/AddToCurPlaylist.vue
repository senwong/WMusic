<template>
  <more-item @click.native="handleClick">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">添加到播放列表</span>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import { State, namespace } from "vuex-class";

const playlist = namespace("playlist");
@Component({
  components: { DownloadIcon, MoreItem }
})
export default class AddToCurPlaylist extends Vue {
  @Prop() track!: Track;
  @playlist.State tracks!: Track[];
  @playlist.Mutation setTracks!: (tracks: Track[]) => void;
  handleClick() {
    const track = this.tracks.find(t => t.id == this.track.id);
    !track && this.setTracks(this.tracks.concat([this.track]));
  }
}
</script>

<style></style>
