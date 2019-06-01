<template>
  <!-- search recommendations -->
  <section class="search__recommendations">
    <section v-for="(value, idx) in order" :key="idx">
      <component
        v-bind:is="upperCaseFirst(value)"
        v-bind:[value]="$data[value]"
      />
    </section>
  </section>
</template>
<script lang="ts">
import { searchSuggest } from "@/service";
import { formatTime, clipImage } from "@/utilitys";
import CardItem from "./CardItem.vue";
import SongList from "@/components/globals/SongList.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Track, Artist, Album, MvCard, Playlist } from "@/types";
import ArtistsWithComma from "@/components/globals/ArtistsWithComma.tsx";
import Songs from "./SongsRecommendations.vue";
import Artists from "./ArtistsRecommendations.vue";
import Albums from "./AlbumsRecommendations.vue";
import Mvs from "./MvsRecommendations.vue";
import Playlists from "./PlaylistsRecommendations.vue";
import { Mutation, namespace } from "vuex-class";

const notification = namespace("notification");

@Component({
  components: {
    Songs,
    Artists,
    Albums,
    Mvs,
    Playlists
  }
})
export default class SearchRecommendations extends Vue {
  songs: Track[] | null = null;

  artists: Artist[] | null = null;

  albums: Album[] | null = null;

  mvs: MvCard[] | null = null;
  playlists: Playlist[] | null = null;

  order: string[] = [];
  
  formatTime = formatTime;
  @Prop(String) keywords!: string;

  @notification.Mutation setMsg!: (msg: string) => void;

  @Watch("keywords")
  onKeywordsChange(val: string) {
    this.searchSuggest(val);
  }

  getMvSubTitles(mv: MvCard) {
    return mv.artists.map(ar => ({
      id: ar.id,
      txt: ar.name
    }));
  }

  getMvSubLinks(mv: MvCard) {
    const obj: { [idx: number]: string } = {};
    mv.artists.forEach(ar => {
      obj[ar.id] = `/artist/${ar.id}`;
    });
    return obj;
  }

  searchSuggest(keywords: string) {
    if (!keywords || keywords.length < 1) {
      this.songs = [];
      this.artists = [];
      this.albums = [];
      this.mvs = [];
      this.playlists = [];
      this.order = [];
      return;
    }
    searchSuggest(keywords).then(
      res => {
        const {
          songs,
          artists,
          albums,
          mvs,
          playlists,
          order
        } = res.data.result;
        this.songs = songs;
        this.artists = artists;
        this.albums = albums;
        this.mvs = mvs;
        this.playlists =
          playlists &&
          playlists.map(
            (p: { id: number; name: string; coverImgUrl: string }) => ({
              ...p,
              picUrl: p.coverImgUrl
            })
          );
        this.order = order;
      },
      error => {
        this.setMsg(
          `获取搜索建议结果错误${error && error.msg ? error.msg : ""}！`
        );
      }
    );
  }

  upperCaseFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"

.search__recommendations
  min-height: 300px
  max-height: 600px
  overflow: scroll
  padding: 1em 0
  border-bottom-left-radius: 8px
  border-bottom-right-radius: 8px
  box-sizing: border-box
  border: 1px solid
  border-top: none
  @include themify($themes)
    background-color: themed('background-color')
    border-color: themed('border-color')
    box-shadow: 0 8px 6px 3px themed('box-shadow-color')
</style>
