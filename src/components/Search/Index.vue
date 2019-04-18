<template>
<div class="container" ref="wrapper">
  <input
    class="search-input"
    type="text"
    @focus="handleInputFocus"
    @blur="handleInputBlur"
    @input="searchSuggest"
    v-model="keyWords"
    v-on:keyup.enter="handleInputEnter"
    placeholder="搜索。。。"
  >
  <!-- search type tabs -->
  <ul class="tab-menu" ref="tabMenu">
    <li
      class="tab-item"
      v-for='type in Object.keys(searchTypes)'
      :key="searchTypes[type]"
      :class="{active: currentSearchType == searchTypes[type]}"
      @click="handleTabClick(searchTypes[type])"
    >{{type}}</li>
  </ul>

  <!-- search result -->
  <div v-if="!showRecommendations">
    <!-- 搜索单曲 -->
    <div v-if="currentSearchType == 1">
      <h3 class="fallback" v-if="searchSongs.length == 0">没有与此相关的单曲</h3>
      <song-list :tracks="searchSongs" />
    </div>
    <!-- 搜索歌手 -->
    <div v-else-if="currentSearchType == 100">
      <h3 class="fallback" v-if="searchArtists.length == 0">没有与此相关的歌手</h3>
      <ul>
        <li v-for="artist in searchArtists" :key="artist.key" class="artist-item-search">
          <router-link :to="'/artist/' + artist.id" class="artist-pic-search">
            <img :src="(artist.picUrl || artist.img1v1Url) | clipImage(100, 100)" :alt="artist.name">
          </router-link>
          <router-link :to="'/artist/' + artist.id" class="artis-name-search">
            <span>{{artist.name}}</span><span v-if="artist.trans">({{artist.trans}})</span>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 搜索专辑 -->
    <div v-else-if="currentSearchType == 10">
      <h3 class="fallback" v-if="searchAlbums.length == 0">没有与此相关的专辑</h3>
      <ul>
        <li v-for="album in searchAlbums" :key="album.key" class="album-item-search">
          <router-link :to="'/album/' + album.id" class="album-pic-search">
            <img :src="album.picUrl | clipImage(100, 100)" :alt="album.name">
          </router-link>
          <div class="album-name-search">
            <router-link :to="'/album/' + album.id">
              {{album.name}}
            </router-link>
          </div>
          <div class="album-artist-search">
            <router-link :to="'/artist/' + album.artist.id">
              {{album.artist.name}}
            </router-link>              
          </div>
        </li>
      </ul>
    </div>
    <!-- 搜索MV -->
    <div v-else-if="currentSearchType == 1004">
      <h3 class="fallback" v-if="searchMvs.length == 0">没有与此相关的MV</h3>
      <card-item
        v-for="mv in searchMvs"
        :key="mv.id"
        :link = "'/mvplay/' + mv.id"
        :picUrl = "mv.cover | clipImage(640, 360)"
        :title = mv.name
        :subTitles = getMvSubTitles(mv)
        :subLinks = getMvSubLinks(mv)
        shape = "rectangle"
        ></card-item>
    </div>
    <!-- 搜索歌单 -->
    <div v-else-if="currentSearchType == 1000">
      <h3 class="fallback" v-if="searchPlaylists.length == 0">没有与此相关的歌单</h3>
      <ul>
        <li v-for="playlist in searchPlaylists" :key="playlist.key" class="playlist-item-search">
          <router-link :to="'/playlist/' + playlist.id" class="playlist-pic-search">
            <img :src="playlist.coverImgUrl | clipImage(200, 200)" :alt="playlist.name">
          </router-link>
          <div class="playlist-name-search">
            <router-link :to="'/playlist/' + playlist.id">
              {{playlist.name}}
            </router-link>
          </div>
          <span class="playlist-count-search">{{playlist.bookCount}}</span>
          <div class="playlist-user-search">
            <span>创建者：</span>
            <router-link :to="'/user/' + playlist.creator.userId">
              {{playlist.creator.nickname}}
            </router-link>
          </div>
        </li>
      </ul>
    </div>
    <!-- 搜索歌词 -->
    <div v-else-if="1006">
      <h3 class="fallback" v-if="searchLyrics.length == 0">没有与此相关的歌词</h3>
      <ul>
        <li v-for="lyric in searchLyrics" :key="lyric.id" class="lyric-item-search">
          <router-link :to="'/song/' + lyric.id" class="lyric-name-search">
            {{lyric.name}}
          </router-link>
          <div class="lyric-artists-search">
            <router-link v-for="ar in lyric.artists" :key="ar.id" :to="'/artist/' + ar.id" class="lyric-artist-search">
              {{ar.name}}
            </router-link>
          </div>
          <router-link :to="'/album/' + lyric.album.id" class="lyric-album-search">
            {{lyric.album.name}}
          </router-link>
          <div class="lyric-duration-search">{{formatTime(lyric.duration)}}</div>
        </li>
      </ul>
    </div>
    <!-- 搜索主播电台 -->
    <div v-else-if="1009">
      <h3 class="fallback" v-if="searchDjRadios.length == 0">没有与此相关的电台</h3>
      <card-item
        v-for="djRadio in searchDjRadios"
        :key="djRadio.id"
        :link = "'/djradio/' + djRadio.id"
        :picUrl = "djRadio.picUrl | clipImage(320, 320)"
        :title = djRadio.name
        :subTitles = getDjSubTitles(djRadio)
        :subLinks = getDjSubLinks(djRadio)
        shape = "square"
        ></card-item>
    </div>
    <!-- 搜索用户 -->
    <div v-else-if="1002">
      <h3 class="fallback" v-if="searchUsers.length == 0">没有与此相关的用户</h3>
      <ul>
        <li v-for="user in searchUsers" :key="user.id" class="user-item-search">
          <router-link :to="'/user/' + user.id" class="user-pic-search">
            <img :src="user.avatarUrl | clipImage(200, 200)" :alt="user.name">
          </router-link>
          <router-link :to="'/user/' + user.id" class="user-name-search">
            <span>{{user.nickname}}</span>
            <span v-if="user.gender == 1">男生</span>
            <span v-if="user.gender == 2">女生</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
  <h2 v-show="currentSearchType !== null && isLoadMore" class="loading">Loading...</h2>
  <!-- search recommendations -->
  <section class="search__recommendations" v-if="showRecommendations">
    <h2 v-if="songs && songs.length > 0">单曲</h2>
    <ul>
      <li v-for="song in songs" :key="song.id" class="list-item">
        <div class="list-item-icon play"></div>
        <div class="list-item-left">
          <div class="song-name">
            {{song.name}}
          </div>
          <div>
            <router-link
              v-for="artist in song.artists.filter(ar => ar.id != 0)"
              :to="'/artist/' + artist.id"
              :key="artist.id"
              class="artist-name">{{artist.name}}</router-link>
            <span>•</span>
            <router-link
              :to="'/album/' + song.album.id"
              class="album-name">{{song.album.name}}</router-link>
          </div>
        </div>
        <div class="list-item-icon more"></div>
        <div class="duration">
        {{ formatTime(song.duration)}}
        </div>
      </li>
    </ul>

    <section v-if="artists && artists.length > 0">
      <h2>歌手</h2>
      <card-item
        v-for="artist in artists"
        :key="artist.id"
        :link = "'/artist/' + artist.id"
        :picUrl = "artist.img1v1Url | clipImage(400, 400)"
        :title = artist.name
        shape = "round"
      />
    </section>

    <section v-if="playlists && playlists.length > 0">
      <h2>歌单</h2>
      <card-item
        v-for="playlist in playlists"
        :key="playlist.id"
        :link = "'/playlist/' + playlist.id"
        :picUrl = "playlist.coverImgUrl | clipImage(400, 400)"
        :title = playlist.name
        shape = "square"
      />
    </section>

    <section v-if="mvs && mvs.length > 0">
      <h2>MV</h2>
      <card-item
        v-for="mv in mvs"
        :key="mv.id"
        :link = "'/mvplay/' + mv.id"
        :picUrl = "mv.cover | clipImage(640, 360)"
        :title = mv.name
        :subTitles = getMvSubTitles(mv)
        :subLinks = getMvSubLinks(mv)
        shape = "rectangle"
      />
    </section>
  </section>
</div>
</template>
<script>
import { search, searchSuggest } from '@/service/Service'
import { formatTime } from '@/utilitys'
import CardItem from './CardItem'
import SongList from '@/components/FindMusic/SongList'
const SEARCH_OFFSET = 30

export default {
  name: "SearchIndex",
  components: { CardItem, SongList },
  data() {
    return {
      keyWords: "",
      searchTypes: {
        "单曲": 1,
        "歌手": 100,
        "专辑": 10,
        "MV": 1004,
        "歌单": 1000,
        "歌词": 1006,
        "主播电台": 1009,
        "用户": 1002,
      },
      showRecommendations: false,

      // search recommendations result
      songs: [],
      artists: [],
      albums: [],
      mvs: [],
      playlists: [],

      tabKey: null,

      // number referring to type, default 1
      currentSearchType: 1,

      // search result
      searchSongs: [],
      searchArtists: [],
      searchAlbums: [],
      searchMvs: [],
      searchPlaylists: [],
      searchLyrics: [],
      searchDjRadios: [],
      searchUsers: [],
      isLoadMore: false,
      count: 0,
      prevLength: 0,
      currentLength: 0,
    }
  },
  methods: {
    formatTime,
    searchSuggest({ target: { value } }) {
      if (!this.showRecommendations) return;
      if (value.length < 1) {
        this.songs = [];
        this.artists = [];
        this.albums = [];
        this.mvs = [];
        this.playlists = [];
        return;
      }
      searchSuggest(value).then(
        res => {
          const { songs,artists, albums, mvs, playlists } = res.data.result;
          this.songs = songs;
          this.artists = artists;
          this.albums = albums;
          this.mvs = mvs;
          this.playlists = playlists;
        },
        error => alert('get search suggest error ' + error)
      );
    },
    getMvSubTitles(mv) {
      return mv.artists.map( ar => {
        return {
          id: ar.id,
          txt: ar.name
        }
      })
    },
    getMvSubLinks(mv) {
      const obj = {};
      mv.artists.forEach(ar => {
        obj[ar.id] = "/artist/" + ar.id
      })
      return obj
    },
    searchWithTypes() {
      const searchType = this.currentSearchType;
      if (this.keyWords.length < 1) return;
      search(this.keyWords, searchType, this.currentLength).then(
        res => {
          const result = JSON.parse(JSON.stringify(res.data.result).replace(/http:\/\//g, "https://"));
          if(searchType == 1) {
            const songs = result.songs.map(song => ({
              id: song.id,
              name: song.name,
              ar: song.artists,
              dt: song.duration,
              al: song.album,
            }));
            this.count = result.songCount
            this.searchSongs = songs;
          } else if (searchType == 100) {
            this.searchArtists = result.artists;
            this.count = result.artistCount
          } else if (searchType == 10) {
            this.searchAlbums = result.albums;
            this.count = result.albumCount
          } else if (searchType == 1004) {
            this.searchMvs = result.mvs;
            this.count = result.mvCount
          } else if (searchType == 1000) {
            this.searchPlaylists = result.playlists;
            this.count = result.playlistCount
          } else if (searchType == 1006) {
            this.searchLyrics = result.songs;
            this.count = result.songCount
          } else if (searchType == 1009) {
            this.searchDjRadios = result.djRadios;
            this.count = result.djRadiosCount
          } else if (searchType == 1002) {
            this.searchUsers = result.userprofiles;
            this.count = result.userprofileCount
          }
        },
        error => alert('get search data error ' + error)
      );
    },
    handleTabClick(searchType) {
      this.currentSearchType = searchType
      this.searchWithTypes();
    },
    getDjSubTitles(djRadio) {
      return [{id: djRadio.dj.userId, txt: djRadio.dj.nickname}]
    },
    getDjSubLinks(djRadio) {
      const obj = {};
      obj[djRadio.dj.userId] = "/dj/" +  djRadio.dj.userId
      return obj
    },
    handleInputFocus() {
      // show recommendations; update recommendation data
      this.showRecommendations = true;
    },
    handleInputBlur() {
      // hide recommendations;
      this.showRecommendations = false;
      this.searchWithTypes();
    },
    handleInputEnter() {
      this.showRecommendations = false;
      this.searchWithTypes();
    },
  },
  mounted() {
    this.$refs.wrapper.addEventListener("scroll",  e => {
      this.isLoadMore = this.currentSearchType !== null
        && this.count !== this.currentLength
        && e.target.scrollTop + e.target.clientHeight ==  e.target.scrollHeight
    })
  },
  watch: {
    isLoadMore(val) {
      if(val == false) return
      this.searchWithTypes();
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"

ul
  padding: 0;
  list-style: none;
a
  text-decoration: none;
  color: inherit;
.container
  position: relative;
  padding-bottom: 2em;
.search-input
  font-size: 150%;
  border: none;
  background: $whitegray5;
  padding: 1em;
  width: 100%;
  &:focus
    outline: none;
.tab-menu
  display: flex;
  border-bottom: 2px solid $orange;
.tab-item
  flex: 1 1 0;
  display: inline-block;
  padding: 1em 0.5em;
  min-width: 0;
  overflow: hidden;
  text-align: center;
  border: 1px solid $black-6;
  border-bottom: none;
  &.active
    color: #fff;
    background: $orange;
    border-color: $orange;
  &:not(:last-child)
    margin-right: 0.2em;

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
  &:nth-of-type(2n)
    background: $whitegray3-5;
  &:hover
    background: $gray2;
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
</style>

