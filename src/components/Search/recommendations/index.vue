<template>
  <!-- search recommendations -->
  <transition name="slide-up">
    <section class="search__recommendations" v-show="show">
      <transition name="scale">
        <h5 class="search__recommendations__no-rec" v-if="isLoading">
          请稍等！
        </h5>
      </transition>
      <section v-for="(value, idx) in order" :key="idx" class="rec__wrapper">
        <component
          v-bind:is="upperCaseFirst(value)"
          v-bind:[value]="$data[value]"
        />
      </section>
      <h5 class="search__recommendations__no-rec" v-if="isNoRecommendations">
        没有匹配的搜索结果！
      </h5>
      <h5
        class="search__recommendations__no-rec"
        v-if="!isLoading && (keywords == undefined || keywords.length < 1)"
      >
        请输入查询关键字！
      </h5>
    </section>
  </transition>
</template>
<script lang="ts">
import {
  searchSuggest,
  makeAxisoCancelable,
  CancelablePromise
} from "@/service";
import { formatTime, debounceTime } from "@/utilitys";
import SongList from "@/components/globals/SongList.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Track, Artist, Album, MvCard, Playlist } from "@/types";
import Songs from "./Tracks.vue";
import Artists from "./Artists.vue";
import Albums from "./Albums.vue";
import Mvs from "./Mvs.vue";
import Playlists from "./Playlists.vue";
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

  isNoSearchResult: boolean = false;

  isLoading: boolean = false;

  get isNoRecommendations(): boolean {
    return (
      !this.isLoading &&
      this.keywords !== undefined &&
      this.keywords.length > 0 &&
      this.isNoSearchResult
    );
  }

  formatTime = formatTime;
  @Prop(String) keywords!: string;
  @Prop(Boolean) show!: boolean;

  @notification.Mutation setMsg!: (msg: string) => void;

  @Watch("keywords")
  onKeywordsChange(val: string) {
    // this.searchSuggest(val);
    this.debounceTimeSearchSuggest(val);
  }
  debounceTimeSearchSuggest = debounceTime(this.searchSuggest, 500);

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
  oldRequest: CancelablePromise | null = null;
  isEmptyArray(arr: any[]): boolean {
    return arr === null || arr === undefined || arr.length === 0;
  }
  emptyAllRecs() {
    this.songs = [];
    this.artists = [];
    this.albums = [];
    this.mvs = [];
    this.playlists = [];
    this.order = [];
  }
  searchSuggest(keywords: string) {
    if (keywords == undefined || keywords.length < 1) {
      this.emptyAllRecs();
      return;
    }
    this.isLoading = true;
    const cancelablePromise = makeAxisoCancelable(searchSuggest(keywords));
    if (this.oldRequest) {
      this.oldRequest.cancel();
    }
    this.oldRequest = cancelablePromise;
    cancelablePromise.promise.then(
      res => {
        const {
          songs,
          artists,
          albums,
          mvs,
          playlists,
          order
        } = res.data.result;

        this.isLoading = false;
        this.isNoSearchResult = [songs, artists, albums, mvs, playlists].every(
          this.isEmptyArray
        );

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
        this.isLoading = false;
        error &&
          error !== "canceled" &&
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
.search__recommendations
  height: 450px
  overflow-y: scroll
  overflow-x: hidden
  border-bottom-left-radius: 8px
  border-bottom-right-radius: 8px
  box-sizing: border-box
  border: 1px solid
  border-top: none
  &__no-rec
    text-align: center
    padding: 1em 0
    margin: 0
.rec__wrapper
  margin: 1em 0
.slide-up-enter-active, .slide-up-leave-active
  transition: all 0.25s

.slide-up-enter, .slide-up-leave-to
  height: 0px
  box-shadow: 0 0px 0px 0px rgba(0, 0, 0, 0)
  border-color: rgba(0, 0, 0, 0)

.scale
  &-enter
    animation: scale-height 0.8s ease-in
  &-leave
    animation: scale-height 0.8s ease-out reverse

@keyframes scale-height
  from
    height: auto
    opacity: 1
  to
    height: 0
    opacity: 0
</style>
