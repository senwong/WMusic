<template>
  <div class="list-item" v-if="content">
    <div class="list__cover">
      <CardImage
        :play="{ onClick: () => play() }"
        :href="'/playlist/' + content.id"
        :src="content.picUrl | convert2Https | clipImage(300, 300)"
        :alt="content.name"
        ratio="1:1"
      />
      <div class="list__name">{{ content.name }}</div>
    </div>
    <router-link :to="'/playlist/' + content.id" class="song__list">
      <div v-for="(track, i) in tracks" :key="track.id" class="track-list">
        <!-- TODO -->
        <span class="track-order">{{ i + 1 }}</span>
        <span class="track-name">{{ track.name }}</span>
        <div class="track-artists">
          <ArtistsWithComma aTagClass="track-artist" :artists="track.artists" />
        </div>
      </div>
    </router-link>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import CardImage from "@/components/globals/CardImage.vue";
import { PlaylistType, Track, Artist } from "@/types";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import { getTopList } from "@/service";

export interface DomesticTopList {
  id: number;
  picUrl: string;
  name: string;
  type: PlaylistType;
  tracks: Track[];
}
@Component({
  components: { CardImage, ArtistsWithComma }
})
export default class MediaItem extends Vue {
  @Prop() typeId!: number;

  content: {
    id: number;
    name: string;
    picUrl: string;
    tracks: Track[];
  } | null = null;

  created() {
    getTopList(this.typeId).then(res => {
      const p = res.data.playlist;
      const tracks = p.tracks.map(
        (t: { id: number; name: string; ar: Artist[] }) => ({
          id: t.id,
          name: t.name,
          artists: t.ar
        })
      );
      this.content = {
        id: p.id,
        name: p.name,
        picUrl: p.coverImgUrl,
        tracks
      };
    });
  }

  get tracks(): Track[] {
    return this.content ? this.content.tracks.slice(0, 5) : [];
  }

  play() {
    // TODO
  }
}
</script>
<style lang="sass" scoped>
@import '../../style/colors.sass'

.list-item
  display: flex
  flex-direction: row
  position: relative
  background-color: #eee
  border: 1px solid #e8e8e8
  box-sizing: border-box
.list__cover
  // height: 120px
  flex: 0 0 120px
  position: relative

.list__name
  position: absolute
  top: -0.3em
  left: -0.3em
  width: 100%
  background-color: rgba(0, 0, 0, 0.6)
  color: white
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.song__list
  flex: 1 1 auto
  overflow: hidden
  display: flex
  flex-direction: column
  justify-content: space-around

.track-list
  display: flex
  flex-direction: row
  justify-content: flex-start
.track-order
  flex: 0 0 auto
.track-name, .track-artists
  flex: 1 1 0
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
.track-name
  margin-right: 0.8em
.track-order, .track-artists
   color: black
.track-name
  color: $black
  font-weight: bolder
.track-order, .track-name, .track-artists
  font-size: 14px
  vertical-align: middle
  display: inline-block
  text-decoration: none

.track-order
  padding: 0 1em
</style>
