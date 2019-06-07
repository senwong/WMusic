<template>
  <ul class="song-list">
    <SongListItem
      v-for="track in tracks"
      :key="track.id"
      :track="track"
      @play="handlePlay"
    />
  </ul>
</template>
<script lang="ts">
import { Track } from "@/types";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, namespace, State, Getter } from "vuex-class";
import SongListItem from "@/components/globals/SongListItem.vue";

const playlist = namespace("playlist");
const playbar = namespace("playbar");
const notification = namespace("notification");

@Component({
  components: {
    SongListItem
  }
})
export default class SongList extends Vue {
  @Prop() tracks!: Track[];

  @playlist.State currentSongId!: number;

  @playlist.Getter trackIds!: number[];

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playbar.Mutation togglePlay!: () => void;
  @notification.Mutation setMsg!: (msg: string) => void;

  // play specify song
  handlePlay(trackId: number) {
    if (this.tracks.every(t => t.status < 0)) {
      this.setMsg("资源暂时下架！");
      return;
    }
    //  if local component's tracks equal to store's tracks
    if (this.tracks.every((track, idx) => track.id == this.trackIds[idx])) {
      if (trackId != this.currentSongId) {
        this.setCurrentSongId(trackId);
      } else {
        this.togglePlay();
      }
    } else {
      this.setTracks(this.tracks);
      this.setCurrentSongId(trackId);
    }
  }
}
</script>
<style lang="sass" scoped>
.song-list
  padding: 20px 0 0
</style>
