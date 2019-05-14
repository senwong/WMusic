<template>
  <more-item @click.native="handleClick">
    <DownloadIcon slot="icon" />
    <span slot="txt" class="txt">播放</span>
  </more-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Track } from "@/types";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreItem from "@/components/more-list/MoreItem.vue";
import { namespace, Mutation, Getter } from "vuex-class";

const playlist = namespace("playlist");
@Component({
  components: { DownloadIcon, MoreItem }
})
export default class PlayTrack extends Vue {
  @Prop() track!: Track;
  @playlist.State tracks!: Track[];
  @playlist.Getter trackIds!: number[];
  @playlist.Mutation setCurrentSongId!: (id: number) => void;
  @playlist.Mutation setTracks!: (tracks: Track[]) => void;
  handleClick() {
    if (!this.trackIds.includes(this.track.id)) {
      this.setTracks(this.tracks.concat([this.track]));
    }
    this.setCurrentSongId(this.track.id);
  }
}
</script>

<style></style>
