<template>
  <div class="container main-wrapper" @scroll="handleScroll">
    <SearchBarWithRecommendations
      v-model="keyWords"
      @enter="handleInputEnter"
      placeholder="搜索。。。"
    />
    <!-- search type tabs -->
    <TabMenu :list="tabMenuList" />

    <!-- search result -->
    <div>
      <!-- 搜索单曲 -->
      <div v-if="currentSearchType == SearchType.Song">
        <h3 class="fallback" v-if="searchSongs.length == 0">
          没有与此相关的单曲
        </h3>
        <SongList :tracks="searchSongs" v-else />
      </div>
      <!-- 搜索歌手 -->
      <div v-else-if="currentSearchType == SearchType.Artist">
        <h3 class="fallback" v-if="searchArtists.length == 0">
          没有与此相关的歌手
        </h3>
        <ul>
          <li
            v-for="artist in searchArtists"
            :key="artist.id"
            class="artist-item-search"
          >
            <router-link :to="'/artist/' + artist.id" class="artist-pic-search">
              <img
                :src="
                  (artist.picUrl || artist.picUrl)
                    | convert2Https
                    | clipImage(100, 100)
                "
                :alt="artist.name"
              />
            </router-link>
            <router-link :to="'/artist/' + artist.id" class="artis-name-search">
              <span>{{ artist.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 搜索专辑 -->
      <div v-else-if="currentSearchType == SearchType.Album">
        <h3 class="fallback" v-if="searchAlbums.length == 0">
          没有与此相关的专辑
        </h3>
        <ul>
          <li
            v-for="album in searchAlbums"
            :key="album.id"
            class="album-item-search"
          >
            <router-link :to="'/album/' + album.id" class="album-pic-search">
              <img
                :src="album.picUrl | convert2Https | clipImage(100, 100)"
                :alt="album.name"
              />
            </router-link>
            <div class="album-name-search">
              <router-link :to="'/album/' + album.id">{{
                album.name
              }}</router-link>
            </div>
            <div class="album-artist-search">
              <router-link :to="'/artist/' + album.artist.id">{{
                album.artist.name
              }}</router-link>
            </div>
          </li>
        </ul>
      </div>
      <!-- 搜索MV -->
      <div v-else-if="currentSearchType == SearchType.Mv">
        <h3 class="fallback" v-if="searchMvs.length == 0">没有与此相关的MV</h3>
        <MediaCardsGrid :data="searchMvs" />
      </div>
      <!-- 搜索歌单 -->
      <div v-else-if="currentSearchType == SearchType.Playlist">
        <h3 class="fallback" v-if="searchPlaylists.length == 0">
          没有与此相关的歌单
        </h3>
        <ul>
          <li
            v-for="playlist in searchPlaylists"
            :key="playlist.id"
            class="playlist-item-search"
          >
            <router-link
              :to="'/playlist/' + playlist.id"
              class="playlist-pic-search"
            >
              <img
                :src="
                  playlist.coverImgUrl | convert2Https | clipImage(200, 200)
                "
                :alt="playlist.name"
              />
            </router-link>
            <div class="playlist-name-search">
              <router-link :to="'/playlist/' + playlist.id">{{
                playlist.name
              }}</router-link>
            </div>
            <span class="playlist-count-search">{{ playlist.bookCount }}</span>
            <div class="playlist-user-search">
              <span>创建者：</span>
              <router-link :to="'/user/' + playlist.creator.userId">{{
                playlist.creator.nickname
              }}</router-link>
            </div>
          </li>
        </ul>
      </div>
      <!-- 搜索歌词 -->
      <div v-else-if="currentSearchType === SearchType.Lyric">
        <h3 class="fallback" v-if="searchLyrics && searchLyrics.length == 0">
          没有与此相关的歌词
        </h3>
        <ul>
          <li
            v-for="lyric in searchLyrics"
            :key="lyric.id"
            class="lyric-item-search"
          >
            <router-link :to="'/song/' + lyric.id" class="lyric-name-search">{{
              lyric.name
            }}</router-link>
            <div class="lyric-artists-search">
              <router-link
                v-for="ar in lyric.artists"
                :key="ar.id"
                :to="'/artist/' + ar.id"
                class="lyric-artist-search"
                >{{ ar.name }}</router-link
              >
            </div>
            <router-link
              :to="'/album/' + lyric.album.id"
              class="lyric-album-search"
              >{{ lyric.album.name }}</router-link
            >
            <div class="lyric-duration-search">
              {{ formatTime(lyric.duration) }}
            </div>
          </li>
        </ul>
      </div>
      <!-- 搜索主播电台 -->
      <div v-else-if="currentSearchType === SearchType.Radio">
        <h3 class="fallback" v-if="searchDjRadios.length == 0">
          没有与此相关的电台
        </h3>
        <MediaCardsGrid :data="searchDjRadios" />
      </div>
      <!-- 搜索用户 -->
      <div v-else-if="currentSearchType === SearchType.User">
        <h3 class="fallback" v-if="searchUsers.length == 0">
          没有与此相关的用户
        </h3>
        <ul>
          <li
            v-for="user in searchUsers"
            :key="user.id"
            class="user-item-search"
          >
            <router-link :to="'/user/' + user.id" class="user-pic-search">
              <img
                :src="user.avatarUrl | convert2Https | clipImage(200, 200)"
                :alt="user.name"
              />
            </router-link>
            <router-link :to="'/user/' + user.id" class="user-name-search">
              <span>{{ user.nickname }}</span>
              <span v-if="user.gender == 1">男生</span>
              <span v-if="user.gender == 2">女生</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <h2 v-show="currentSearchType !== null && isLoadMore" class="loading">
      Loading...
    </h2>
  </div>
</template>
<script lang="ts">
import { search } from "@/service";
import { formatTime } from "@/utilitys";
import SongList from "@/components/globals/SongList.vue";
import SearchBarWithRecommendations from "./SearchBarWithRecommendations.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import {
  Track,
  Artist,
  Album,
  MvCard,
  MvType,
  TabMenuItem,
  MediaCardItem,
  MediaCardType
} from "@/types";
import { Mutation, namespace } from "vuex-class";
import TabMenu from "@/components/globals/TabMenu.vue";
import CardItem from "@/components/globals/CardItem.vue";
import MediaCardsGrid from "@/components/globals/MediaCardsGrid.vue";

const notification = namespace("notification");
const SEARCH_OFFSET = 30;
interface DjType {
  nickname: string;
  id: number;
}
interface DjRadioType {
  picUrl: string;
  name: string;
  id: number;
  dj: DjType;
  subCount: number;
}

enum SearchType {
  Song = 1,
  Artist = 100,
  Album = 10,
  Mv = 1004,
  Playlist = 1000,
  Lyric = 1006,
  Radio = 1009,
  User = 1002
}
const searchTypes: { [index: string]: SearchType } = {
  单曲: SearchType.Song,
  歌手: SearchType.Artist,
  专辑: SearchType.Album,
  MV: SearchType.Mv,
  歌单: SearchType.Playlist,
  歌词: SearchType.Lyric,
  主播电台: SearchType.Radio,
  用户: SearchType.User
};
@Component({
  components: {
    CardItem,
    SongList,
    SearchBarWithRecommendations,
    TabMenu,
    MediaCardsGrid
  }
})
export default class Search extends Vue {
  keyWords: string = "";

  get tabMenuList(): TabMenuItem[] {
    return Object.keys(searchTypes).map(
      (title: string, idx: number): TabMenuItem => ({
        key: idx,
        title: title,
        isActive: this.currentSearchType == searchTypes[title],
        onClick: () => this.handleTabClick(searchTypes[title])
      })
    );
  }

  // number referring to type, default 1
  currentSearchType: SearchType = SearchType.Song;
  SearchType = SearchType;
  // search result
  searchSongs: Track[] = [];

  searchArtists: Artist[] = [];

  searchAlbums: Album[] = [];

  searchMvs: MediaCardItem[] = [];

  searchPlaylists: object[] = [];

  searchLyrics: object[] = [];

  searchDjRadios: MediaCardItem[] = [];

  searchUsers: object[] = [];

  isLoadMore: boolean = false;

  count: number = 0;

  prevLength: number = 0;

  currentLength: number = 0;

  formatTime = formatTime;

  @notification.Mutation setMsg!: (msg: string) => void;

  getMvSubTitles(mv: MvCard) {
    return mv.artists.map(ar => ({
      id: ar.id,
      txt: ar.name
    }));
  }

  getMvSubLinks(mv: MvCard) {
    const obj: { [index: number]: string } = {};
    mv.artists.forEach(ar => {
      obj[ar.id] = `/artist/${ar.id}`;
    });
    return obj;
  }

  searchWithTypes() {
    const searchType = this.currentSearchType;
    if (this.keyWords.length < 1) return;
    search(this.keyWords, searchType, this.currentLength).then(
      res => {
        const result = JSON.parse(
          JSON.stringify(res.data.result).replace(/http:\/\//g, "https://")
        );
        if (searchType == SearchType.Song && result.songs) {
          this.count = result.songCount;
          this.searchSongs = result.songs;
        } else if (searchType == SearchType.Artist) {
          this.searchArtists = result.artists;
          this.count = result.artistCount;
        } else if (searchType == SearchType.Album) {
          this.searchAlbums = result.albums;
          this.count = result.albumCount;
        } else if (searchType == SearchType.Mv) {
          this.searchMvs = result.mvs.map((mv: MvType) => ({
            type: MediaCardType.Mv,
            picUrl: mv.cover,
            title: mv.name,
            id: mv.id,
            subTitle: mv.artistName,
            subLink: mv.artistId && `/artist/${mv.artistId}`,
            playCount: mv.playCount
          }));
          this.count = result.mvCount;
        } else if (searchType == SearchType.Playlist) {
          this.searchPlaylists = result.playlists;
          this.count = result.playlistCount;
        } else if (searchType == SearchType.Song) {
          this.searchLyrics = result.songs;
          this.count = result.songCount;
        } else if (searchType == SearchType.Radio) {
          this.searchDjRadios = result.djRadios;
          this.count = result.djRadiosCount;
          this.searchDjRadios = result.djRadios.map((djRadio: DjRadioType) => ({
            type: MediaCardType.djRadio,
            picUrl: djRadio.picUrl,
            title: djRadio.name,
            id: djRadio.id,
            subTitle: djRadio.dj && djRadio.dj.nickname,
            subLink: djRadio.dj && djRadio.dj.id && `/user/${djRadio.dj.id}`,
            playCount: djRadio.subCount
          }));
        } else if (searchType == SearchType.User) {
          this.searchUsers = result.userprofiles;
          this.count = result.userprofileCount;
        }
      },
      error => {
        this.setMsg(`获取搜索结果错误${error && error.msg ? error.msg : ""}！`);
      }
    );
  }

  handleTabClick(searchType: SearchType) {
    this.currentSearchType = searchType;
    this.searchWithTypes();
  }

  getDjSubTitles(djRadio: { dj: { userId: number; nickname: string } }) {
    return [{ id: djRadio.dj.userId, txt: djRadio.dj.nickname }];
  }

  getDjSubLinks(djRadio: { dj: { userId: number; nickname: string } }) {
    const obj: { [index: number]: string } = {};
    obj[djRadio.dj.userId] = `/dj/${djRadio.dj.userId}`;
    return obj;
  }

  handleInputEnter() {
    this.searchWithTypes();
  }

  handleScroll({ target }: { target: HTMLElement }) {
    this.isLoadMore =
      this.currentSearchType !== null &&
      this.count !== this.currentLength &&
      target.scrollTop + target.clientHeight == target.scrollHeight;
  }

  @Watch("isLoadMore")
  onIsLoadingChange(val: boolean) {
    if (val == false) return;
    this.searchWithTypes();
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
@import "@/style/theme.sass"

ul
  padding: 0;
  list-style: none;
a
  text-decoration: none;
  color: inherit;
.container
  position: relative;
  padding-bottom: 2em;
  min-height: 100%;

.search-type,
.search-result-item
  display: inline-block;
.list-item
  display: flex;
  padding: 0.5em 0;
  transition: background 0.2s;

  &:hover
    background-color: $whitegray3-5;
    & .list-item-icon.play
      background-image: url('../../assets/caret-right.svg');
    & .list-item-icon.more
      background-image: url('../../assets/more.svg');

.list-item-icon
  width: 2em;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  background-position: center;
  &.play
    background-image: url('../../assets/music.svg');
  &.more
    background-position: center top;
    margin-right: 2em;

.list-item-left
  flex: 1 1 auto;
.duration
  flex: 0 0 auto;
  padding: 0 1em;
.song-name
  padding: 0.2em 0;
  user-select: none;
.artist-name, .album-name
  font-size: 0.875em;
  padding: 0 0 0 0;
  color: $black-6;
  transition: all 0.2s;
  border-bottom: 1px solid transparent;
  &:hover
    color: #000;
    border-bottom: 1px solid #000;
.artist-item
  display: inline-block;
  width: 10em;
  &:not(:last-child)
    margin-right: 2em;
  &:hover
    .artist-pic-mask
      visibility: visible;
      background-color: $mask;

.artist-pic
  width: 10em;
  height: 10em;
  display: inline-block;
  position: relative;
  border-radius: 5em;
  background-repeat: no-repeat;
  background-size: 10em 10em;
  background-position: center;
  .artist-pic-mask
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    visibility: hidden;
    background-color: transparent;
    transition: all 0.2s;
    .artist-pic-play
      width: 3.5em;
      height: 3.5em;
      border-radius: 50%;
      border: 1px solid #fff;
      transform-origin: center center;
      transition: transform 0.3s;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -1.75em;
      margin-left: -1.75em;
      display: inline-block;
      background: url('../../assets/triangle-right-fill.svg') no-repeat  center / 60%;
      &:hover
        transform: scale(1.1, 1.1);

.artist-info
  text-align: center;
  margin: 1em 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

.artist-item-search,
.album-item-search,
.playlist-item-search,
.lyric-item-search,
.user-item-search
  margin-left: -2em;
  padding: 0.5em 0 0.5em 2em;
  transition: background 0.2s;
  @include themify($themes)
    &:nth-of-type(2n)
      background: themed('secondary-background-color')
    &:hover
      background: themed('secondary-background-color-hover')
.artist-pic-search,
.album-pic-search,
.playlist-pic-search,
.user-pic-search
  width: 3em;
  height: 3em;
  display: inline-block;
  vertical-align: middle;
  margin-right: 1em;
  img
    width: 100%;
    height: 100%;
.artis-name-search,
  vertical-align: middle;
.user-pic-search img
  border-radius: 50%;
.album-item-search,
.playlist-item-search,
.lyric-item-search,
.user-item-search
  display: flex;
  align-items: center;
  .album-name-search, .album-artist-search,
  .playlist-name-search, .playlist-user-search,
  .lyric-name-search
    flex: 1 1 0;
  .playlist-count-search,
  .lyric-artists-search, .lyric-album-search
    flex: 0.5 0.5 0;
  .lyric-artists-search, .lyric-album-search
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

.loading
  position: absolute;
  bottom: 0;

.fallback
  text-align: center;
  padding-top: 2em;
  color: rgb(110, 110, 110);

.mv-result__wrapper
  margin-top: 2em
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  grid-gap: 2em;
  flex-wrap: wrap
  justify-content: space-between;
</style>
