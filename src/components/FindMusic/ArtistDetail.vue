<template>
  <div class="artist-detail">
    <div>
      <div class="artist-detail__media">
        <div class="artist-detail__media__left">
          <ImageWithPlaceholder
            :src="img | convert2Https"
            :alt="name"
            ratio="1:1"
          />
        </div>
        <div class="artist-detail__media__right">
          <div class="artist-detail__media__heading">{{ name }}</div>
          <div>
            <Button
              rounded
              primary
              class="button-controll"
              @click="handlePlayAll"
              >播放</Button
            >
            <Button rounded class="button-controll">收藏</Button>
            <Button rounded class="button-controll">歌词</Button>
            <Button rounded class="button-controll">more</Button>
          </div>
        </div>
      </div>
      <p class="artist-detail__brief-desc">{{ briefDesc }}</p>
      <TabMenu align-left :list="tabs" />
      <song-list :tracks="tracks" v-if="showSongs" />
      <MediaCardsGrid
        class="artist-detail__albums"
        :data="albumMediaCardData"
        v-if="showAlbums"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { getArtistInfo, getArtistAlbums } from "@/service";
import { formatDate } from "@/utilitys";
import SongList from "@/components/globals/SongList.vue";
import MediaCardsGrid from "@/components/globals/MediaCardsGrid.vue";
import { mapMutations } from "vuex";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Playlist, Track, convertTrack, MediaCardItem } from "@/types";
import { Mutation, namespace } from "vuex-class";
import TabMenu from "@/components/globals/TabMenu.vue";
import Button from "@/components/globals/Button.vue";
import ImageWithPlaceholder from "@/components/globals/ImageWithPlaceholder.vue";

console.log({ TabMenu });

const playlist = namespace("playlist");
enum ContentType {
  Songs,
  Albums
}
interface HotAlbumType {
  artist: { id: number; name: string };
  id: number;
  name: string;
  picUrl: string;
}

@Component({
  components: {
    SongList,
    MediaCardsGrid,
    TabMenu,
    Button,
    ImageWithPlaceholder
  }
})
export default class ArtistDetail extends Vue {
  name: string = "";

  img: string = "";

  briefDesc: string = "";

  tracks: Track[] = [];

  albumMediaCardData: MediaCardItem[] = [];

  currentContent: ContentType = ContentType.Songs;

  formatDate = formatDate;

  @playlist.Mutation setTracks!: (tracks: Track[]) => void;

  @playlist.Mutation setCurrentSongId!: (id: number) => void;

  get tabs() {
    return [
      {
        key: 0,
        isActive: this.currentContent == ContentType.Songs,
        onClick: () => (this.currentContent = ContentType.Songs),
        title: "热门歌曲"
      },
      {
        key: 1,
        isActive: this.currentContent == ContentType.Albums,
        onClick: () => (this.currentContent = ContentType.Albums),
        title: "专辑"
      }
    ];
  }

  get showSongs() {
    return this.currentContent == ContentType.Songs;
  }

  get showAlbums() {
    return this.currentContent == ContentType.Albums;
  }

  initData(artistId: number) {
    getArtistInfo(artistId).then(res => {
      const { name, img1v1Url, briefDesc } = res.data.artist;
      this.name = name;
      this.img = img1v1Url;
      this.briefDesc = briefDesc;
      this.tracks = res.data.hotSongs.map(convertTrack);
    });
    getArtistAlbums(artistId).then(res => {
      const hotAlbums = res.data.hotAlbums;
      this.albumMediaCardData = hotAlbums.map((ha: HotAlbumType) => ({
        type: "album",
        picUrl: ha.picUrl,
        title: ha.name,
        id: ha.id,
        subTitle: ha.artist && ha.artist.name,
        subLink: ha.artist && ha.artist.id && `/artist/${ha.artist.id}`
      }));
    });
  }

  handlePlayAll() {
    this.setTracks(this.tracks);
    this.setCurrentSongId(this.tracks[0].id);
  }

  created() {
    const songId = Number(this.$route.params.id);
    this.initData(songId);
  }
}
</script>
<style lang="sass" scoped>

.artist-detail
  padding: 1em
  &__media
    display: flex
    height: 200px
    &__left
      flex: 0 0 200px
      font-size: 0
      margin-right: 20px
      border-radius: 15px
      overflow: hidden
    &__right
      flex: 1 1 auto
      display: flex
      flex-direction: column
      justify-content: space-between
      &__heading
        font-size: 2em
  &__brief-desc
    text-overflow: ellipsis
    overflow: hidden
  &__albums
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
    grid-gap: 2em
    flex-wrap: wrap
    justify-content: space-between
    padding: 1em 0

.button-controll
  margin-right: 1em
</style>
