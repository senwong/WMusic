<template>
<!-- search recommendations -->
<section class="search__recommendations">
  <section v-for="(value, key) in order" :key="key">
    <component v-bind:is="upperCaseFirst(value)"  v-bind="$data" />
  </section>
</section>
</template>
<script>
import { searchSuggest } from '@/service/Service';
import { formatTime } from '@/utilitys';
import CardItem from './CardItem';
import SongList from '@/components/FindMusic/SongList';
import { clipImage } from '@/utilitys';

const Songs = {
  functional: true,
  props: { songs: Array },
  render(h, { props: { songs } }) {
    if (!songs || songs.length == 0) return;
    return (
      <section class="recommendation-section">
        <div class="title">单曲</div>
        <ul>
          {
            songs.map(song => (
              <li key={song.id} class="list-item">
                <a class="item" href={'/song/' + song.id} >
                  <span class="item-title">
                    {song.name} -&nbsp;
                    {song.artists.filter(ar => ar.id != 0).map(ar => ar.name).join('/')}
                  </span>
                </a>
              </li>
            ))
          }
        </ul>
      </section>
    );
  },
};
const Artists = {
  functional: true,
  props: { artists: Array },
  render(h, { props: { artists }}) {
    if (!artists || artists.length == 0) return;
    return (
      <section class="recommendation-section">
        <div class="title">艺人</div>
        <ul>
          {
            artists.map(artist => (
              <li key={artist.id}>
                <a class="item" href={'/artist/' + artist.id}>
                  <img
                    class="artist-avatar"
                    src={clipImage(artist.img1v1Url, 200, 200)}
                    alt={artist.name} />
                  <span class="item-title">
                    {artist.name}
                  </span>
                </a>
              </li>
            ))
          }
        </ul>
      </section>
    );
  }
};
const Albums = {
  functional: true,
  props: { albums: Array },
  render(h, { props: { albums }}) {
    if (!albums || albums.length == 0) return;
    return (
      <section class="recommendation-section">
        <div class="title">专辑</div>
        <ul>
          {
            albums.map(album => (
              <li key={album.id}>
                <a class="item" href={'/album/'+ album.id}>
                  <span class="item-title">{album.name}</span>
                </a>
              </li>
            ))
          }
        </ul>
      </section>
    );
  }
};
const Mvs = {
  functional: true,
  props: { mvs: Array },
  render(h, { props: { mvs }}) {
    if (!mvs || mvs.length == 0) return;
    return (
      <section class="recommendation-section">
        <div class="title">MV</div>
        <ul>
          {
            mvs.map(mv => (
              <li key={mv.id}>
                <a href={'/mvplay/'+ mv.id} class="item">
                  <span class="item-title">
                    {mv.name}
                  </span>
                </a>
              </li>
            ))
          }
        </ul>
      </section>
    );
  }
};
const Playlists = {
  functional: true,
  props: { playlists: Array },
  render(h, { props: { playlists }}) {
    if (!playlists || playlists.length == 0) return;
    return (
      <section class="recommendation-section">
        <div class="title">歌单</div>
        <ul>
          {
            playlists.map(playlist => (
              <li key={playlist.id}>
                <a href={'/playlist/' + playlist.id} class="item">
                  <img
                    class="playlist-img"
                    src={clipImage(playlist.coverImgUrl, 100, 100)}
                    alt={playlist.name} />
                  <span class="item-title">
                    {playlist.name}
                  </span>
                </a>
              </li>
            ))
          }
        </ul>
      </section>
    );
  }
};

export default {
  data() {
    return {
      songs: [],
      artists: [],
      albums: [],
      mvs: [],
      playlists: [],
      order: {},
    };
  },
  props: [ 'keywords' ],
  components: {
    Songs, Artists, Albums, Mvs, Playlists,
  },
  watch: {
    keywords(value) {
      this.searchSuggest(value);
    }
  },
  methods: {
    formatTime,
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
    searchSuggest(keywords) {
      if (!keywords || keywords.length < 1) {
        this.songs = [];
        this.artists = [];
        this.albums = [];
        this.mvs = [];
        this.playlists = [];
        this.order = {};
        return;
      }
      searchSuggest(keywords).then(
        res => {
          const { songs,artists, albums, mvs, playlists, order } = res.data.result;
          this.songs = songs;
          this.artists = artists;
          this.albums = albums;
          this.mvs = mvs;
          this.playlists = playlists;
          this.order = order;
        },
        error => alert('get search suggest error ' + error)
      );
    },
    upperCaseFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../config.sass"

.search__recommendations
  background-color: rgb(255, 255, 255);
  min-height: 300px;
  max-height: 600px;
  overflow: scroll;
  padding: 1em 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-top: none;
  box-shadow: 0 8px 6px 3px rgba(0, 0, 0, 0.2);

.recommendation-section
  padding: 0 6px;
.title
  font-size: 12px;
  color: $gray;
  padding-left: 6px;
.item
  padding: 6px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  transition-property: background color;
  transition-duration: 250ms;
  &:hover
    background: $orange;
    color: white;
  .item-title
    display: block;
    padding: 0.5em 0;
  
.artist-avatar, .album-img, .playlist-img
  width: 3em;
  height: 3em;
  border-radius: 4px;
  margin-right: 9px;
.artist-avatar
  border-radius: 9999px;
</style>
