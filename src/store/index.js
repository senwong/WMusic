import Vue from "vue"
import Vuex from "vuex"
import { getSongDetail, getSongURL, getPlaylistDetail, } from "@/service"
// const defaultplayList = new PlayList([new Song({
//   id: 326703,
//   name: "艳火",
//   imgUrl: "http://p1.music.126.net/klOSGBRQhevtM6c9RXrM1A==/18808245906527670.jpg",
//   artists: [new Artist(10557, "张悬")],
//   duration: 221866,
// })]);
import Playlist from './modules/Playlist';

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    playlist: Playlist,
  },
  state: {
    isLogin: false,
    isScrollBottom: false,
    rightPlaylistVisible: false,
  },
  mutations: {
    changeScroll(state, isScrollBottom) {
      state.isScrollBottom = isScrollBottom
    },
    toggleRightPlaylist(state) {
      state.rightPlaylistVisible = !state.rightPlaylistVisible;
    },
  },
});
